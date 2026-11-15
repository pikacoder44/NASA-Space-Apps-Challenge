"""Telemetry reading request and response schemas."""

from typing import Optional
from pydantic import BaseModel, Field


class NewReading(BaseModel):
    """Payload to record a new physiological reading."""
    indicator: str = Field(..., example="heart_rate")
    value: float = Field(..., example=72.0)
    unit: Optional[str] = Field(default=None, example="bpm")
    measured_at: Optional[str] = Field(default=None, example="2026-11-15T08:00:00Z")


class ReadingResponse(BaseModel):
    """Evaluated reading response matching frontend expectations."""
    id: int = Field(..., example=1)
    indicator: str = Field(..., example="heart_rate")
    value: float = Field(..., example=72.0)
    unit: str = Field(..., example="bpm")
    status: str = Field(..., example="normal")
    measured_at: str = Field(..., example="2026-11-15T08:00:00Z")
    message: str = Field(..., example="Heart rate is within your personal baseline.")
    reason: Optional[str] = Field(default=None, example="Heart rate is within your personal baseline.")
