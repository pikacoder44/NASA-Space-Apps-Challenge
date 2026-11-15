"""AI Explanation request and response schemas."""

from typing import Optional, List
from pydantic import BaseModel, Field


class AIExplanationRequest(BaseModel):
    """Payload to request an AI operational physiological explanation."""
    indicator: Optional[str] = Field(default=None, example="sleep_hours")
    status: Optional[str] = Field(default=None, example="warning")
    prompt: Optional[str] = Field(default=None, example="Why is my sleep debt affecting mission readiness?")


class AIExplanationResponse(BaseModel):
    """Structured AI explanation grounded in space medicine telemetry."""
    indicator: Optional[str] = Field(default=None, example="sleep_hours")
    status: Optional[str] = Field(default=None, example="warning")
    title: str = Field(..., example="Circadian Adaptation & Sleep Debt Analysis")
    explanation: str = Field(..., example="In microgravity, altered baroreceptor feedback and cabin acoustics disrupt slow-wave sleep cycles.")
    recommendation: str = Field(..., example="Schedule a 45-minute sleep recovery extension and inspect berth acoustic baffles.")
    risk_level: str = Field(default="moderate", example="moderate")
    clinical_reference: str = Field(
        default="NASA Human Research Program (HRP) Behavioral Health & Performance Risk Protocol",
        example="NASA Human Research Program (HRP) Behavioral Health & Performance Risk Protocol"
    )
