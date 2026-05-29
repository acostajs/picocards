# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./picocards.db"
    JWT_SECRET: str = "your-super-secret-jwt-token-key-for-local-dev"
    ENVIRONMENT: str = "development"
    COOKIE_DOMAIN: str = ".hub.ca"

    # Hub Identity Microservice configurations
    HUB_INTERNAL_URL: str = "http://localhost:8081"
    HUB_SYSTEM_API_KEY: str = "dev-system-secret-key"

    # Local development bypass parameters
    DEV_BYPASS_ENABLED: bool = True
    DEV_MOCK_USER_ID: str = "dev-student-1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def async_database_url(self) -> str:
        """Convert standard database URLs to their async drivers dynamically."""
        url = self.DATABASE_URL
        if url.startswith("sqlite:///"):
            return url.replace("sqlite:///", "sqlite+aiosqlite:///")
        if url.startswith("sqlite://"):
            return url.replace("sqlite://", "sqlite+aiosqlite://")
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+psycopg://")
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+psycopg://")
        return url


settings = Settings()
