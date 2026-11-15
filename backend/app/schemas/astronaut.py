"""Astronaut profile schemas."""

from pydantic import BaseModel, Field


class AstronautResponse(BaseModel):
    """Crew member profile returned by /api/astronauts/me."""
    id: str = Field(..., example="1")
    email: str = Field(..., example="crew@astrotrack.space")
    name: str = Field(..., example="Commander Sarah Walker")
    role: str = Field(..., example="CDR-01")
    mission_day: int = Field(default=90, example=90)
