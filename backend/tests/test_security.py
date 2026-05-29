# backend/tests/test_security.py
from datetime import timedelta

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.security import create_access_token
from app.main import app


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.mark.anyio
async def test_auth_via_cookie() -> None:
    """Test successful authentication using the hub_session cookie."""
    token = create_access_token(user_id="student-101")
    cookies = {"hub_session": token}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/api/me", cookies=cookies)

    assert response.status_code == 200
    assert response.json() == {"user_id": "student-101"}


@pytest.mark.anyio
async def test_auth_via_bearer_header() -> None:
    """Test successful authentication using the Bearer Authorization header."""
    token = create_access_token(user_id="student-202")
    headers = {"Authorization": f"Bearer {token}"}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/api/me", headers=headers)

    assert response.status_code == 200
    assert response.json() == {"user_id": "student-202"}


@pytest.mark.anyio
async def test_auth_via_raw_header() -> None:
    """Test successful authentication using a raw Authorization header."""
    token = create_access_token(user_id="student-303")
    headers = {"Authorization": token}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/api/me", headers=headers)

    assert response.status_code == 200
    assert response.json() == {"user_id": "student-303"}


@pytest.mark.anyio
async def test_auth_missing_credentials() -> None:
    """Test standard 401 response when session token is missing entirely."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/api/me")

    assert response.status_code == 401
    assert "Missing session token" in response.json()["detail"]


@pytest.mark.anyio
async def test_auth_expired_token() -> None:
    """Test authentication rejection for expired signatures."""
    token = create_access_token(
        user_id="expired-student", expires_delta=timedelta(seconds=-10)
    )
    cookies = {"hub_session": token}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/api/me", cookies=cookies)

    assert response.status_code == 401
    assert "expired" in response.json()["detail"].lower()


@pytest.mark.anyio
async def test_auth_invalid_token() -> None:
    """Test authentication rejection for malformed / invalid signature tokens."""
    cookies = {"hub_session": "invalid.gibberish.token-string"}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/api/me", cookies=cookies)

    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()
