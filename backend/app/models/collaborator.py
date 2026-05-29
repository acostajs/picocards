# backend/app/models/collaborator.py
from datetime import datetime
from typing import TYPE_CHECKING, ClassVar, Optional

import sqlalchemy as sa
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.project import Project


class ProjectCollaborator(SQLModel, table=True):
    __tablename__: ClassVar[str] = "project_collaborator"

    project_id: str = Field(
        sa_column=sa.Column(
            sa.String(36),
            sa.ForeignKey("project.id", ondelete="CASCADE"),
            primary_key=True,
            nullable=False,
        ),
    )
    user_id: str = Field(
        sa_column=sa.Column(
            sa.String(36),
            primary_key=True,
            nullable=False,
            index=True,
        ),
    )
    email: str = Field(
        default="collab@hub.ca",
        sa_column=sa.Column(
            sa.String(100),
            nullable=False,
        ),
    )
    role: str = Field(
        sa_column=sa.Column(
            sa.String(20),
            nullable=False,
        ),
    )
    joined_at: datetime = Field(
        sa_column=sa.Column(
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # Relationships
    project: Optional["Project"] = Relationship(back_populates="collaborators")
