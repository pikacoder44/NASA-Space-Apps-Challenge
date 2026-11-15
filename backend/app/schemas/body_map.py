"""Interactive body map schemas."""

from typing import List
from pydantic import BaseModel, Field


class BodyMapResponse(BaseModel):
    """Body region physiological indicators mapping."""
    body_part: str = Field(..., example="chest")
    indicators: List[str] = Field(..., example=["heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic"])
    status: str = Field(default="normal", example="normal")
