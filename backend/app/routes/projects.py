# backend/app/routes/projects.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.collaborator import ProjectCollaborator
from app.models.project import Project
from app.schemas import ProjectCreate, ProjectRead, ProjectUpdate

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
async def get_projects(
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> list[Project]:
    """Retrieve all projects owned or collaborated on by the caller."""
    stmt = (
        select(Project)
        .outerjoin(ProjectCollaborator)
        .where((Project.owner_id == user_id) | (ProjectCollaborator.user_id == user_id))
        .distinct()
    )
    res = await session.execute(stmt)
    return list(res.scalars().all())


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Project:
    """Create a new project workspace owned by the caller."""
    project = Project(
        title=project_in.title,
        description=project_in.description,
        owner_id=user_id,
    )
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectRead)
async def get_project(
    project_id: str,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Project:
    """Retrieve details of a project if the caller has access."""
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # 1. Access Check: Owner
    if project.owner_id == user_id:
        return project

    # 2. Access Check: Collaborator (Owner, Editor, Visitor)
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


@router.put("/{project_id}", response_model=ProjectRead)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Project:
    """Update a project if the caller is the owner or an editor."""
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # 1. Access Check: Owner or Editor
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

    # 2. Update fields
    if project_in.title is not None:
        project.title = project_in.title
    if project_in.description is not None:
        project.description = project_in.description

    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete a project workspace only if the caller is the owner."""
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # Access Check: Owner Only
    if project.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Only the project owner can delete this project",
        )

    await session.delete(project)
    await session.commit()
