# backend/tests/test_projects.py
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import async_session_maker, engine
from app.core.security import create_access_token
from app.main import app
from app.models import SQLModel
from app.models.collaborator import ProjectCollaborator
from app.models.project import Project


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture(autouse=True)
async def setup_db() -> AsyncGenerator[None, None]:
    """Fixture to create and drop database schemas for testing environment."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest.mark.anyio
async def test_create_project() -> None:
    """Test successful project workspace creation."""
    token = create_access_token(user_id="student-1")
    cookies = {"hub_session": token}
    payload = {"title": "Calculus III", "description": "Multi-variable calculus deck"}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post("/api/projects", json=payload, cookies=cookies)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Calculus III"
    assert data["description"] == "Multi-variable calculus deck"
    assert data["owner_id"] == "student-1"
    assert "id" in data


@pytest.mark.anyio
async def test_get_projects_list() -> None:
    """Test listing only owned and collaborated projects."""
    user1_token = create_access_token(user_id="student-1")

    async with async_session_maker() as session:
        # User 1 owned project
        proj1 = Project(title="Calculus I", owner_id="student-1")
        # User 2 owned project (User 1 collaborates on this)
        proj2 = Project(title="Linear Algebra", owner_id="student-2")
        # User 2 owned project (User 1 has NO access)
        proj3 = Project(title="Discrete Math", owner_id="student-2")

        session.add(proj1)
        session.add(proj2)
        session.add(proj3)
        await session.commit()
        await session.refresh(proj2)

        # Make User 1 a collaborator on proj2
        collab = ProjectCollaborator(
            project_id=proj2.id, user_id="student-1", role="editor"
        )
        session.add(collab)
        await session.commit()

    # Query projects list as User 1
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/api/projects", cookies={"hub_session": user1_token})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    titles = [p["title"] for p in data]
    assert "Calculus I" in titles
    assert "Linear Algebra" in titles
    assert "Discrete Math" not in titles


@pytest.mark.anyio
async def test_get_project_detail_access_rules() -> None:
    """Test RBAC restrictions on retrieving single project details."""
    token_user1 = create_access_token(user_id="student-1")
    token_user2 = create_access_token(user_id="student-2")
    token_unauth = create_access_token(user_id="student-external")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-1")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        # Collaborator
        collab = ProjectCollaborator(
            project_id=project_id, user_id="student-2", role="visitor"
        )
        session.add(collab)
        await session.commit()

    # 1. Retrieve as Owner -> Allowed
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}", cookies={"hub_session": token_user1}
        )
    assert res.status_code == 200
    assert res.json()["title"] == "Calculus I"

    # 2. Retrieve as Collaborator -> Allowed
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}", cookies={"hub_session": token_user2}
        )
    assert res.status_code == 200

    # 3. Retrieve as Unauth User -> 403 Forbidden
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}", cookies={"hub_session": token_unauth}
        )
    assert res.status_code == 403

    # 4. Non-existent Project -> 404 Not Found
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            "/api/projects/non-existent-uuid", cookies={"hub_session": token_user1}
        )
    assert res.status_code == 404


@pytest.mark.anyio
async def test_update_project_access_rules() -> None:
    """Test RBAC restrictions on updating project details (Owner / Editor)."""
    token_owner = create_access_token(user_id="student-owner")
    token_editor = create_access_token(user_id="student-editor")
    token_visitor = create_access_token(user_id="student-visitor")

    async with async_session_maker() as session:
        project = Project(title="Organic Chemistry", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        collab1 = ProjectCollaborator(
            project_id=project_id, user_id="student-editor", role="editor"
        )
        collab2 = ProjectCollaborator(
            project_id=project_id, user_id="student-visitor", role="visitor"
        )
        session.add(collab1)
        session.add(collab2)
        await session.commit()

    payload = {"title": "O-Chem 101", "description": "Up-to-date O-Chem"}

    # 1. Update as Owner -> Allowed
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.put(
            f"/api/projects/{project_id}",
            json=payload,
            cookies={"hub_session": token_owner},
        )
    assert res.status_code == 200
    assert res.json()["title"] == "O-Chem 101"

    # 2. Update as Editor -> Allowed
    payload_editor = {"title": "O-Chem (Editor Edit)"}
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.put(
            f"/api/projects/{project_id}",
            json=payload_editor,
            cookies={"hub_session": token_editor},
        )
    assert res.status_code == 200
    assert res.json()["title"] == "O-Chem (Editor Edit)"

    # 3. Update as Visitor -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.put(
            f"/api/projects/{project_id}",
            json={"title": "Hack"},
            cookies={"hub_session": token_visitor},
        )
    assert res.status_code == 403


@pytest.mark.anyio
async def test_delete_project_access_rules() -> None:
    """Test standard RBAC deletion policy (Owner Only)."""
    token_owner = create_access_token(user_id="student-owner")
    token_editor = create_access_token(user_id="student-editor")

    async with async_session_maker() as session:
        project = Project(title="Linear Systems", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        collab = ProjectCollaborator(
            project_id=project_id, user_id="student-editor", role="editor"
        )
        session.add(collab)
        await session.commit()

    # 1. Delete as Editor collaborator -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/projects/{project_id}", cookies={"hub_session": token_editor}
        )
    assert res.status_code == 403

    # 2. Delete as Owner -> Allowed (204)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/projects/{project_id}", cookies={"hub_session": token_owner}
        )
    assert res.status_code == 204

    # Verify project is wiped from database
    async with async_session_maker() as session:
        deleted_proj = await session.get(Project, project_id)
        assert deleted_proj is None
