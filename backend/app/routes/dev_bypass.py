# backend/app/routes/dev_bypass.py
from fastapi import APIRouter, HTTPException, Response, status

from app.core.config import settings
from app.core.security import create_access_token

router = APIRouter(prefix="/api/dev", tags=["dev-bypass"])


@router.post("/bypass", status_code=status.HTTP_200_OK)
async def dev_bypass(response: Response, user_id: str | None = None) -> dict[str, str]:
    """Sandbox endpoint to inject mock session cookie for local testing."""
    if settings.ENVIRONMENT != "development":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bypass route only available in local development",
        )

    target_user = user_id or settings.DEV_MOCK_USER_ID
    token = create_access_token(user_id=target_user)

    response.set_cookie(
        key="hub_session",
        value=token,
        domain=(
            settings.COOKIE_DOMAIN if settings.ENVIRONMENT != "development" else None
        ),
        httponly=True,
        samesite="lax",
    )

    return {
        "status": "bypass_session_injected",
        "user_id": target_user,
        "token": token,
    }
