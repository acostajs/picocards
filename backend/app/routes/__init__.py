# backend/app/routes/__init__.py
from app.routes.cards import router as cards_router
from app.routes.collaborators import router as collaborators_router
from app.routes.dev_bypass import router as dev_bypass_router
from app.routes.projects import router as projects_router

__all__ = [
    "projects_router",
    "cards_router",
    "collaborators_router",
    "dev_bypass_router",
]
