# backend/tests/conftest.py
import pytest

from app.core.config import settings


@pytest.fixture(scope="session", autouse=True)
def disable_dev_bypass_during_tests() -> None:
    """Disable local dev bypass globally during tests."""
    settings.DEV_BYPASS_ENABLED = False
