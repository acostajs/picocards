# backend/app/routes/collaborators.py
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import settings
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.collaborator import ProjectCollaborator
from app.models.project import Project
from app.schemas import CollaboratorInvite, CollaboratorRead

router = APIRouter(tags=["collaborators"])


@router.post(
    "/api/projects/{project_id}/collaborators",
    response_model=CollaboratorRead,
    status_code=status.HTTP_201_CREATED,
)
async def invite_collaborator(
    project_id: str,
    invite: CollaboratorInvite,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> ProjectCollaborator:
    """Invite a peer to collaborate on a project workspace (Owner Only)."""
    # 1. Fetch project and verify ownership
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    if project.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Only the project owner can invite collaborators",
        )

    # 2. Validate role choices
    if invite.role not in ["editor", "visitor"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role: must be 'editor' or 'visitor'",
        )

    # 3. Lookup user on external identity microservice
    try:
        async with httpx.AsyncClient() as client:
            headers = {"X-System-API-Key": settings.HUB_SYSTEM_API_KEY}
            resp = await client.get(
                f"{settings.HUB_INTERNAL_URL}/api/system/users/lookup",
                params={"email": invite.email},
                headers=headers,
                timeout=5.0,
            )
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Collaborator profile not found on identity server",
                )
            user_data = resp.json()
            retrieved_user_id = user_data.get("user_id") or user_data.get("id")
            if not retrieved_user_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Collaborator profile not found on identity server",
                )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Identity server lookup offline: {e}",
        ) from e

    # 4. Check if trying to invite self/owner
    if retrieved_user_id == project.owner_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add the project owner as a collaborator",
        )

    # 5. Check if already invited
    existing_stmt = select(ProjectCollaborator).where(
        ProjectCollaborator.project_id == project_id,
        ProjectCollaborator.user_id == retrieved_user_id,
    )
    existing_res = await session.execute(existing_stmt)
    if existing_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a collaborator on this project",
        )

    # 6. Insert new record
    collab = ProjectCollaborator(
        project_id=project_id,
        user_id=retrieved_user_id,
        role=invite.role,
    )
    session.add(collab)
    await session.commit()
    await session.refresh(collab)
    return collab


@router.delete(
    "/api/projects/{project_id}/collaborators/{collaborator_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_collaborator(
    project_id: str,
    collaborator_id: str,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> None:
    """Kick a collaborator (Owner Only) or leave a workspace (Target User)."""
    # 1. Fetch project and verify existence
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # 2. Fetch collaborator details
    stmt = select(ProjectCollaborator).where(
        ProjectCollaborator.project_id == project_id,
        ProjectCollaborator.user_id == collaborator_id,
    )
    res = await session.execute(stmt)
    collaborator = res.scalars().first()
    if not collaborator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaborator not found on this project",
        )

    # 3. Access Boundaries check: Owner Kick OR Collaborator Leave
    authorized = False
    if project.owner_id == user_id:
        authorized = True  # Kick
    elif collaborator_id == user_id:
        authorized = True  # Leave

    if not authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to remove this user",
        )

    # 4. Remove record
    await session.delete(collaborator)
    await session.commit()
