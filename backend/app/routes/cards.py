# backend/app/routes/cards.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.card import Card
from app.models.collaborator import ProjectCollaborator
from app.models.project import Project
from app.schemas import CardCreate, CardRead, CardUpdate

router = APIRouter(tags=["cards"])


async def check_project_read_access(
    project_id: str, user_id: str, session: AsyncSession
) -> Project:
    """Validate project existence and retrieve read privileges."""
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    if project.owner_id == user_id:
        return project

    collab_stmt = select(ProjectCollaborator).where(
        ProjectCollaborator.project_id == project_id,
        ProjectCollaborator.user_id == user_id,
    )
    collab_res = await session.execute(collab_stmt)
    if not collab_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have access to this project",
        )
    return project


async def check_project_edit_access(
    project_id: str, user_id: str, session: AsyncSession
) -> Project:
    """Validate project existence and retrieve edit privileges."""
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    authorized = False
    if project.owner_id == user_id:
        authorized = True
    else:
        collab_stmt = select(ProjectCollaborator).where(
            ProjectCollaborator.project_id == project_id,
            ProjectCollaborator.user_id == user_id,
        )
        collab_res = await session.execute(collab_stmt)
        collaborator = collab_res.scalars().first()
        if collaborator and collaborator.role == "editor":
            authorized = True

    if not authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to edit this project",
        )
    return project


@router.get("/api/projects/{project_id}/cards", response_model=list[CardRead])
async def get_project_cards(
    project_id: str,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> list[Card]:
    """Retrieve all flashcards in a project workspace."""
    await check_project_read_access(project_id, user_id, session)

    stmt = select(Card).where(Card.project_id == project_id)
    res = await session.execute(stmt)
    return list(res.scalars().all())


@router.post(
    "/api/projects/{project_id}/cards",
    response_model=CardRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_card(
    project_id: str,
    card_in: CardCreate,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Card:
    """Append a new flashcard to the project workspace."""
    await check_project_edit_access(project_id, user_id, session)

    card = Card(
        project_id=project_id,
        question=card_in.question,
        answer=card_in.answer,
    )
    session.add(card)
    await session.commit()
    await session.refresh(card)
    return card


@router.get("/api/cards/{card_id}", response_model=CardRead)
async def get_card(
    card_id: str,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Card:
    """Retrieve details of a single flashcard."""
    card = await session.get(Card, card_id)
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    await check_project_read_access(card.project_id, user_id, session)
    return card


@router.put("/api/cards/{card_id}", response_model=CardRead)
async def update_card(
    card_id: str,
    card_in: CardUpdate,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Card:
    """Update a flashcard's question and/or answer fields."""
    card = await session.get(Card, card_id)
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    await check_project_edit_access(card.project_id, user_id, session)

    if card_in.question is not None:
        card.question = card_in.question
    if card_in.answer is not None:
        card.answer = card_in.answer

    session.add(card)
    await session.commit()
    await session.refresh(card)
    return card


@router.delete("/api/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(
    card_id: str,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> None:
    """Remove a flashcard from its project workspace."""
    card = await session.get(Card, card_id)
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    await check_project_edit_access(card.project_id, user_id, session)

    await session.delete(card)
    await session.commit()
