"""Application configuration and environment settings for AstroTrack."""

import os
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:  # type: ignore
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)


class Settings(BaseSettings):
    """Central configuration class loading from environment variables."""

    PROJECT_NAME: str = "AstroTrack AAHMS API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Database: defaults to SQLite for simple local development and tests,
    # and overrides with PostgreSQL via environment in Docker / staging.
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aahms.db")

    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "insecure_dev_secret_key_for_hackathon_only")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS: in production set FRONTEND_URL to your Vercel deployment URL.
    # CORS_ORIGINS is derived from FRONTEND_URL at runtime; the wildcard "*" is
    # intentionally removed in production — set FRONTEND_URL properly instead.
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    @property
    def CORS_ORIGINS(self) -> List[str]:  # type: ignore[override]
        """Build CORS origins list dynamically from FRONTEND_URL."""
        origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        # Only add wildcard in permissive local/demo mode (AUTH_REQUIRED=false)
        if not self.AUTH_REQUIRED:
            origins.append("*")
        return origins

    # Authentication requirement toggle:
    # When False (default for demo), anonymous requests map to demo astronaut.
    # Set AUTH_REQUIRED=true in production if you want per-user data isolation.
    # WARNING: AUTH_REQUIRED=false means any unauthenticated request reads/writes
    # the shared demo astronaut's data. This is intentional for the hackathon demo
    # but means ALL visitors share one health record.
    AUTH_REQUIRED: bool = os.getenv("AUTH_REQUIRED", "false").lower() in ("true", "1")

    # Demo Astronaut profile info
    DEFAULT_ASTRONAUT_ID: str = "1"
    DEFAULT_ASTRONAUT_EMAIL: str = "crew@astrotrack.space"
    DEFAULT_ASTRONAUT_NAME: str = "Commander Sarah Walker"
    DEFAULT_ASTRONAUT_ROLE: str = "CDR-01"
    DEFAULT_MISSION_DAY: int = 90


settings = Settings()
