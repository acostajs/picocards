# Force database to test.db and disable bypass globally during tests
from app.core.config import settings

settings.DATABASE_URL = "sqlite:///./test.db"
settings.DEV_BYPASS_ENABLED = False
