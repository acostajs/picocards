# backend/app/models/card.py
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, ClassVar, Optional

import sqlalchemy as sa
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.project import Project


class Card(SQLModel, table=True):
    __tablename__: ClassVar[str] = "card"

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
    project_id: str = Field(
        sa_column=sa.Column(
            sa.String(36),
            sa.ForeignKey("project.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
    )
    question: str = Field(
        sa_column=sa.Column(
            sa.Text,
            nullable=False,
        ),
    )
    answer: str = Field(
        sa_column=sa.Column(
            sa.Text,
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
    project: Optional["Project"] = Relationship(back_populates="cards")
