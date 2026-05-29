# backend/tests/test_cards.py
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import async_session_maker, engine
from app.core.security import create_access_token
from app.main import app
from app.models import SQLModel
from app.models.card import Card
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
async def test_create_card_access_rules() -> None:
    """Test RBAC restrictions on creating cards in a project workspace."""
    token_owner = create_access_token(user_id="student-owner")
    token_editor = create_access_token(user_id="student-editor")
    token_visitor = create_access_token(user_id="student-visitor")
    token_external = create_access_token(user_id="student-external")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-owner")
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

    payload = {"question": "What is 2+2?", "answer": "4"}

    # 1. Create as Owner -> Allowed (201)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            f"/api/projects/{project_id}/cards",
            json=payload,
            cookies={"hub_session": token_owner},
        )
    assert res.status_code == 201
    assert res.json()["question"] == "What is 2+2?"

    # 2. Create as Editor -> Allowed (201)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            f"/api/projects/{project_id}/cards",
            json={"question": "What is 3+3?", "answer": "6"},
            cookies={"hub_session": token_editor},
        )
    assert res.status_code == 201

    # 3. Create as Visitor -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            f"/api/projects/{project_id}/cards",
            json=payload,
            cookies={"hub_session": token_visitor},
        )
    assert res.status_code == 403

    # 4. Create as External -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.post(
            f"/api/projects/{project_id}/cards",
            json=payload,
            cookies={"hub_session": token_external},
        )
    assert res.status_code == 403


@pytest.mark.anyio
async def test_get_cards_list_access_rules() -> None:
    """Test RBAC restrictions on listing all cards in a project workspace."""
    token_owner = create_access_token(user_id="student-owner")
    token_visitor = create_access_token(user_id="student-visitor")
    token_external = create_access_token(user_id="student-external")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        card = Card(project_id=project_id, question="Q1", answer="A1")
        session.add(card)

        collab = ProjectCollaborator(
            project_id=project_id, user_id="student-visitor", role="visitor"
        )
        session.add(collab)
        await session.commit()

    # 1. Get list as Owner -> Allowed
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}/cards",
            cookies={"hub_session": token_owner},
        )
    assert res.status_code == 200
    assert len(res.json()) == 1

    # 2. Get list as Visitor -> Allowed
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}/cards",
            cookies={"hub_session": token_visitor},
        )
    assert res.status_code == 200

    # 3. Get list as External -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/projects/{project_id}/cards",
            cookies={"hub_session": token_external},
        )
    assert res.status_code == 403


@pytest.mark.anyio
async def test_get_card_detail_access_rules() -> None:
    """Test RBAC restrictions on retrieving single card details."""
    token_owner = create_access_token(user_id="student-owner")
    token_visitor = create_access_token(user_id="student-visitor")
    token_external = create_access_token(user_id="student-external")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        card = Card(project_id=project_id, question="Q1", answer="A1")
        session.add(card)
        await session.commit()
        await session.refresh(card)
        card_id = card.id

        collab = ProjectCollaborator(
            project_id=project_id, user_id="student-visitor", role="visitor"
        )
        session.add(collab)
        await session.commit()

    # 1. Get detail as Owner -> Allowed
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/cards/{card_id}", cookies={"hub_session": token_owner}
        )
    assert res.status_code == 200
    assert res.json()["question"] == "Q1"

    # 2. Get detail as Visitor -> Allowed
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/cards/{card_id}", cookies={"hub_session": token_visitor}
        )
    assert res.status_code == 200

    # 3. Get detail as External -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            f"/api/cards/{card_id}", cookies={"hub_session": token_external}
        )
    assert res.status_code == 403

    # 4. Non-existent card -> 404 Not Found
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.get(
            "/api/cards/non-existent-uuid", cookies={"hub_session": token_owner}
        )
    assert res.status_code == 404


@pytest.mark.anyio
async def test_update_card_access_rules() -> None:
    """Test RBAC restrictions on editing cards (Owner / Editor)."""
    token_owner = create_access_token(user_id="student-owner")
    token_editor = create_access_token(user_id="student-editor")
    token_visitor = create_access_token(user_id="student-visitor")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        card = Card(project_id=project_id, question="Old Q", answer="Old A")
        session.add(card)
        await session.commit()
        await session.refresh(card)
        card_id = card.id

        collab1 = ProjectCollaborator(
            project_id=project_id, user_id="student-editor", role="editor"
        )
        collab2 = ProjectCollaborator(
            project_id=project_id, user_id="student-visitor", role="visitor"
        )
        session.add(collab1)
        session.add(collab2)
        await session.commit()

    payload = {"question": "New Q", "answer": "New A"}

    # 1. Update as Owner -> Allowed (200)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.put(
            f"/api/cards/{card_id}",
            json=payload,
            cookies={"hub_session": token_owner},
        )
    assert res.status_code == 200
    assert res.json()["question"] == "New Q"

    # 2. Update as Editor -> Allowed (200)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.put(
            f"/api/cards/{card_id}",
            json={"question": "Editor Q"},
            cookies={"hub_session": token_editor},
        )
    assert res.status_code == 200
    assert res.json()["question"] == "Editor Q"

    # 3. Update as Visitor -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.put(
            f"/api/cards/{card_id}",
            json=payload,
            cookies={"hub_session": token_visitor},
        )
    assert res.status_code == 403


@pytest.mark.anyio
async def test_delete_card_access_rules() -> None:
    """Test RBAC restrictions on deleting cards (Owner / Editor)."""
    token_owner = create_access_token(user_id="student-owner")
    token_editor = create_access_token(user_id="student-editor")
    token_visitor = create_access_token(user_id="student-visitor")

    async with async_session_maker() as session:
        project = Project(title="Calculus I", owner_id="student-owner")
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        card1 = Card(project_id=project_id, question="Q1", answer="A1")
        card2 = Card(project_id=project_id, question="Q2", answer="A2")
        session.add(card1)
        session.add(card2)
        await session.commit()
        await session.refresh(card1)
        await session.refresh(card2)
        card1_id = card1.id
        card2_id = card2.id

        collab1 = ProjectCollaborator(
            project_id=project_id, user_id="student-editor", role="editor"
        )
        collab2 = ProjectCollaborator(
            project_id=project_id, user_id="student-visitor", role="visitor"
        )
        session.add(collab1)
        session.add(collab2)
        await session.commit()

    # 1. Delete as Visitor -> Forbidden (403)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/cards/{card1_id}", cookies={"hub_session": token_visitor}
        )
    assert res.status_code == 403

    # 2. Delete as Editor -> Allowed (204)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/cards/{card1_id}", cookies={"hub_session": token_editor}
        )
    assert res.status_code == 204

    # 3. Delete as Owner -> Allowed (204)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        res = await ac.delete(
            f"/api/cards/{card2_id}", cookies={"hub_session": token_owner}
        )
    assert res.status_code == 204

    # Verify both cards are deleted
    async with async_session_maker() as session:
        c1 = await session.get(Card, card1_id)
        c2 = await session.get(Card, card2_id)
        assert c1 is None
        assert c2 is None
