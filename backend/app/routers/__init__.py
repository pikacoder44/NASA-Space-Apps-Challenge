"""AstroTrack API Routers Package."""

from app.routers import (
    auth,
    astronauts,
    readings,
    dashboard,
    guidance,
    routine,
    body_map,
    ai_explanation,
)

__all__ = [
    "auth",
    "astronauts",
    "readings",
    "dashboard",
    "guidance",
    "routine",
    "body_map",
    "ai_explanation",
]
