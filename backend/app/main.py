# backend/app/main.py
from fastapi import FastAPI

app = FastAPI(title="PicoCards API Layer")


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    """Simple API health check endpoint."""
    return {"status": "ok", "service": "picocards-backend"}
