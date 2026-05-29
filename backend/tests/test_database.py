# backend/tests/test_database.py
from collections.abc import AsyncGenerator

import pytest
from sqlmodel import select

from app.core.database import async_session_maker, engine
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
async def test_create_and_delete_project_cascades() -> None:
    """Test standard model CRUD, indexing, composite keys, and cascade wipes."""
    # 1. Insert Project, Cards, and Collaborator
    async with async_session_maker() as session:
        project = Project(
            title="Chemistry 101",
            description="High school chemistry flashcards",
            owner_id="owner-uuid-1",
        )
        session.add(project)
        await session.commit()
        await session.refresh(project)
        project_id = project.id

        card1 = Card(
            project_id=project_id,
            question="What is the symbol for Gold?",
            answer="Au",
        )
        card2 = Card(
            project_id=project_id,
            question="What is the atomic number of Helium?",
            answer="2",
        )
        session.add(card1)
        session.add(card2)

        collab = ProjectCollaborator(
            project_id=project_id,
            user_id="collaborator-uuid-1",
            role="editor",
        )
        session.add(collab)
        await session.commit()

    # 2. Verify all resources are successfully queryable
    async with async_session_maker() as session:
        db_project = await session.get(Project, project_id)
        assert db_project is not None
        assert db_project.title == "Chemistry 101"
        assert db_project.description == "High school chemistry flashcards"
        assert db_project.owner_id == "owner-uuid-1"

        cards_res = await session.execute(
            select(Card).where(Card.project_id == project_id)
        )
        cards = list(cards_res.scalars().all())
        assert len(cards) == 2
        assert any(c.question == "What is the symbol for Gold?" for c in cards)

        collabs_res = await session.execute(
            select(ProjectCollaborator).where(
                ProjectCollaborator.project_id == project_id
            )
        )
        collabs = list(collabs_res.scalars().all())
        assert len(collabs) == 1
        assert collabs[0].role == "editor"

    # 3. Trigger project deletion and verify cascade behavior
    async with async_session_maker() as session:
        db_project = await session.get(Project, project_id)
        assert db_project is not None
        await session.delete(db_project)
        await session.commit()

    # 4. Verify cascade wipe across child collections (Card & ProjectCollaborator)
    async with async_session_maker() as session:
        db_project = await session.get(Project, project_id)
        assert db_project is None

        cards_res = await session.execute(
            select(Card).where(Card.project_id == project_id)
        )
        assert len(list(cards_res.scalars().all())) == 0

        collabs_res = await session.execute(
            select(ProjectCollaborator).where(
                ProjectCollaborator.project_id == project_id
            )
        )
        assert len(list(collabs_res.scalars().all())) == 0
