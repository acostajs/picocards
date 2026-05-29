# backend/app/main.py
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.security import get_current_user
from app.routes.cards import router as cards_router
from app.routes.collaborators import router as collaborators_router
from app.routes.dev_bypass import router as dev_bypass_router
from app.routes.projects import router as projects_router

app = FastAPI(title="PicoCards API Layer")

# Enable CORS for cross-origin frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    """Simple API health check endpoint."""
    return {"status": "ok", "service": "picocards-backend"}


@app.get("/api/me")
async def get_me(user_id: str = Depends(get_current_user)) -> dict[str, str]:
    """Protected endpoint to retrieve the authenticated caller's identity context."""
    return {"user_id": user_id}


# Mount domain-separated routers
app.include_router(projects_router)
app.include_router(cards_router)
app.include_router(collaborators_router)

# Mount development bypass router strictly in development
if settings.ENVIRONMENT == "development":
    app.include_router(dev_bypass_router)
