# backend/tests/test_collaborators.py
from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, patch

import httpx
import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
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
async def test_invite_collaborator_success() -> None:
    """Test successful project collaborator invitation by the owner."""
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_resp = AsyncMock(spec=httpx.Response)
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"user_id": "student-collaborator-1"}
        mock_get.return_value = mock_resp

        # Setup project in DB
        token_owner = create_access_token(user_id="student-owner")
        async with async_session_maker() as session:
            project = Project(title="Calculus I", owner_id="student-owner")
            session.add(project)
            await session.commit()
            await session.refresh(project)
            project_id = project.id

        payload = {"email": "collab@hub.ca", "role": "editor"}

        # Call endpoint
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            res = await ac.post(
                f"/api/projects/{project_id}/collaborators",
                json=payload,
                cookies={"hub_session": token_owner},
            )

        assert res.status_code == 201
        data = res.json()
        assert data["project_id"] == project_id
        assert data["user_id"] == "student-collaborator-1"
        assert data["role"] == "editor"
        assert data["email"] == "collab@hub.ca"


@pytest.mark.anyio
async def test_invite_collaborator_rbac_rules() -> None:
    """Test standard RBAC policies when inviting collaborators."""
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_resp = AsyncMock(spec=httpx.Response)
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"user_id": "student-collaborator-1"}
        mock_get.return_value = mock_resp

        token_owner = create_access_token(user_id="student-owner")
        token_external = create_access_token(user_id="student-external")

        async with async_session_maker() as session:
            project = Project(title="Calculus I", owner_id="student-owner")
            session.add(project)
            await session.commit()
            await session.refresh(project)
            project_id = project.id

        payload = {"email": "collab@hub.ca", "role": "editor"}

        # 1. Invite as External User -> Forbidden (403)
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            res = await ac.post(
                f"/api/projects/{project_id}/collaborators",
                json=payload,
                cookies={"hub_session": token_external},
            )
        assert res.status_code == 403

        # 2. Try to invite the owner -> Bad Request (400)
        mock_resp_owner = AsyncMock(spec=httpx.Response)
        mock_resp_owner.status_code = 200
        mock_resp_owner.json.return_value = {"user_id": "student-owner"}
        mock_get.return_value = mock_resp_owner

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            res = await ac.post(
                f"/api/projects/{project_id}/collaborators",
                json={"email": "owner@hub.ca"},
                cookies={"hub_session": token_owner},
            )
        assert res.status_code == 400


@pytest.mark.anyio
async def test_remove_collaborator_kick_and_leave() -> None:
    """Test Owner kick privileges and collaborator leave privileges."""
    token_owner = create_access_token(user_id="student-owner")
    token_collab = create_access_token(user_id="student-collab")
    token_external = create_access_token(user_id="student-external")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        collab = ProjectCollaborator(
            project_id=project_id, user_id="student-collab", role="editor"
        )
        session.add(collab)
        await session.commit()

    # 1. External User tries to kick -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/projects/{project_id}/collaborators/student-collab",
            cookies={"hub_session": token_external},
        )
    assert res.status_code == 403

    # 2. Collaborator Leaves -> Allowed (204)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/projects/{project_id}/collaborators/student-collab",
            cookies={"hub_session": token_collab},
        )
    assert res.status_code == 204

    # Re-insert collaborator for Kick test
    async with async_session_maker() as session:
        collab_new = ProjectCollaborator(
            project_id=project_id, user_id="student-collab", role="editor"
        )
        session.add(collab_new)
        await session.commit()

    # 3. Owner Kicks -> Allowed (204)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/projects/{project_id}/collaborators/student-collab",
            cookies={"hub_session": token_owner},
        )
    assert res.status_code == 204

    # Verify collaborator is wiped
    async with async_session_maker() as session:
        collab_check = await session.get(
            ProjectCollaborator, (project_id, "student-collab")
        )
        assert collab_check is None


@pytest.mark.anyio
async def test_development_bypass_fallback() -> None:
    """Test automatic sandbox development credentials bypass fallback."""
    original_env = settings.ENVIRONMENT
    original_bypass = settings.DEV_BYPASS_ENABLED
    original_mock = settings.DEV_MOCK_USER_ID

    settings.ENVIRONMENT = "development"
    settings.DEV_BYPASS_ENABLED = True
    settings.DEV_MOCK_USER_ID = "mock-dev-id"

    try:
        # Request /api/me with absolutely no session cookies or headers
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            res = await ac.get("/api/me")

        assert res.status_code == 200
        assert res.json() == {"user_id": "mock-dev-id"}
    finally:
        # Clean up settings changes
        settings.ENVIRONMENT = original_env
        settings.DEV_BYPASS_ENABLED = original_bypass
        settings.DEV_MOCK_USER_ID = original_mock


@pytest.mark.anyio
async def test_development_bypass_cookie_endpoint() -> None:
    """Test the dev bypass session cookie injection router."""
    original_env = settings.ENVIRONMENT
    settings.ENVIRONMENT = "development"

    try:
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            res = await ac.post("/api/dev/bypass?user_id=student-dev-custom")

        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "bypass_session_injected"
        assert data["user_id"] == "student-dev-custom"
        assert "token" in data
    finally:
        settings.ENVIRONMENT = original_env


@pytest.mark.anyio
async def test_list_collaborators_rbac_rules() -> None:
    """Test standard RBAC policies when listing collaborators in a project."""
    token_owner = create_access_token(user_id="student-owner")
    token_collab = create_access_token(user_id="student-collab")
    token_external = create_access_token(user_id="student-external")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        collab = ProjectCollaborator(
            project_id=project_id,
            user_id="student-collab",
            email="collab@hub.ca",
            role="editor",
        )
        session.add(collab)
        await session.commit()

    # 1. Owner lists -> Allowed (200)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}/collaborators",
            cookies={"hub_session": token_owner},
        )
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["user_id"] == "student-collab"
    assert data[0]["email"] == "collab@hub.ca"

    # 2. Collaborator lists -> Allowed (200)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}/collaborators",
            cookies={"hub_session": token_collab},
        )
    assert res.status_code == 200
    assert len(res.json()) == 1

    # 3. External lists -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}/collaborators",
            cookies={"hub_session": token_external},
        )
    assert res.status_code == 403
