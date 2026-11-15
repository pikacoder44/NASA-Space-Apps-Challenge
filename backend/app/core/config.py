"""Application configuration and environment settings for AstroTrack."""

import os
import secrets
from typing import List

try:
    from dotenv import load_dotenv  # optional: read backend/.env when python-dotenv is installed

    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
except ImportError:
    pass

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
    # No secret in code: without SECRET_KEY a random key is generated at startup
    # (login tokens then stop working after a restart). Always set it when deployed.
    SECRET_KEY: str = os.getenv("SECRET_KEY") or secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS: FRONTEND_URL may be a comma-separated list (e.g. local + Vercel URL).
    # Any localhost port and *.vercel.app deployments are also allowed (see CORS_ORIGIN_REGEX).
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    CORS_ORIGIN_REGEX: str = r"^(https?://(localhost|127\.0\.0\.1)(:\d+)?|https://[a-z0-9-]+\.vercel\.app)$"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        return [o.strip().rstrip("/") for o in self.FRONTEND_URL.split(",") if o.strip()]

    # Authentication requirement toggle:
    # When False (default for demo), anonymous requests map to demo astronaut.
    AUTH_REQUIRED: bool = os.getenv("AUTH_REQUIRED", "false").lower() in ("true", "1")

    # Demo Astronaut profile info
    DEFAULT_ASTRONAUT_ID: str = "1"
    DEFAULT_ASTRONAUT_EMAIL: str = "crew@astrotrack.space"
    DEFAULT_ASTRONAUT_NAME: str = "Commander Sarah Walker"
    DEFAULT_ASTRONAUT_ROLE: str = "CDR-01"
    DEFAULT_MISSION_DAY: int = 90
    # Public demo account password (the demo astronaut is a shared showcase profile).
    DEMO_PASSWORD: str = os.getenv("DEMO_PASSWORD", "SpaceOps2026!")
    # Last simulated mission day loaded by the seed (that day = today).
    SEED_MISSION_DAY: int = int(os.getenv("SEED_MISSION_DAY", "90"))


settings = Settings()
