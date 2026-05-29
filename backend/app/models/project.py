# backend/app/models/project.py
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, ClassVar

import sqlalchemy as sa
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.card import Card
    from app.models.collaborator import ProjectCollaborator


class Project(SQLModel, table=True):
    __tablename__: ClassVar[str] = "project"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        sa_column=sa.Column(
            sa.String(36),
            primary_key=True,
            index=True,
            nullable=False,
            unique=True,
        ),
    )
    title: str = Field(
        sa_column=sa.Column(
            sa.String(100),
            nullable=False,
        ),
    )
    description: str | None = Field(
        default=None,
        sa_column=sa.Column(
            sa.Text,
            nullable=True,
        ),
    )
    owner_id: str = Field(
        sa_column=sa.Column(
            sa.String(36),
            index=True,
            nullable=False,
        ),
    )
    created_at: datetime = Field(
        sa_column=sa.Column(
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # Relationships
    cards: list["Card"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "passive_deletes": True,
        },
    )
    collaborators: list["ProjectCollaborator"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "passive_deletes": True,
        },
    )
