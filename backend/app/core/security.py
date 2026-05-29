# backend/app/core/security.py
from datetime import UTC, datetime, timedelta

import jwt
from fastapi import HTTPException, Request, status

from app.core.config import settings


def create_access_token(user_id: str, expires_delta: timedelta | None = None) -> str:
    """Generate a stateless JWT session token for testing and authentication."""
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(days=7)
    payload = {
        "sub": user_id,
        "user_id": user_id,
        "exp": expire,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def get_current_user(request: Request) -> str:
    """FastAPI dependency to validate JWT sessions from cookies/headers."""
    # 1. Look for cookie token
    token = request.cookies.get("hub_session")

    # 2. Fallback to standard Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header:
            if auth_header.startswith("Bearer "):
                token = auth_header[7:]
            else:
                token = auth_header

    # 3. Handle bypass / raise 401 if token is missing
    if not token:
        if settings.ENVIRONMENT == "development" and settings.DEV_BYPASS_ENABLED:
            return settings.DEV_MOCK_USER_ID
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated: Missing session token",
        )

    try:
        # 4. Decode JWT signature in-memory
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])

        # 5. Extract caller's identifier
        user_id = payload.get("user_id") or payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated: Invalid token payload structure",
            )
        return str(user_id)
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated: Session token has expired",
        ) from e
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated: Invalid session token",
        ) from e
