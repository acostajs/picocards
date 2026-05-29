# backend/app/main.py
from fastapi import Depends, FastAPI

from app.core.security import get_current_user
from app.routes.projects import router as projects_router

app = FastAPI(title="PicoCards API Layer")


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
