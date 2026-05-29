# backend/app/schemas.py
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    title: str = Field(..., max_length=100, description="Title of the project")
    description: str | None = Field(
        default=None, description="Detailed description of the project"
    )


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = Field(
        default=None, max_length=100, description="Updated title of the project"
    )
    description: str | None = Field(
        default=None, description="Updated description of the project"
    )


class ProjectRead(ProjectBase):
    id: str
    owner_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CardBase(BaseModel):
    question: str = Field(..., description="Front canvas content (question)")
    answer: str = Field(..., description="Back canvas solution (answer)")


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    question: str | None = Field(
        default=None, description="Updated front canvas content"
    )
    answer: str | None = Field(default=None, description="Updated back canvas solution")


class CardRead(CardBase):
    id: str
    project_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CollaboratorInvite(BaseModel):
    email: str = Field(..., description="Email lookup of invited collaborator")
    role: str = Field(
        default="editor",
        description="Collaborator role choice: 'editor' or 'visitor'",
    )


class CollaboratorRead(BaseModel):
    project_id: str
    user_id: str
    email: str
    role: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)
