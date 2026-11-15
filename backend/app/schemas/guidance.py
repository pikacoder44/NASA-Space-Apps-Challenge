"""Clinical guidance schema."""

from typing import List, Optional
from pydantic import BaseModel, Field


class GuidanceResponse(BaseModel):
    """Clinical guidance response for indicator and health status evaluation."""
    indicator: str = Field(..., example="sleep_hours")
    status: str = Field(..., example="warning")
    title: str = Field(..., example="Mild Sleep Debt Accumulated")
    explanation: str = Field(..., example="Microgravity circadian desynchrony is causing reduced restorative sleep.")
    action: str = Field(..., example="Schedule a 45-minute recovery sleep block before EVA activity.")
    advice: List[str] = Field(
        default_factory=list,
        example=["Review sleep berth acoustic insulation", "Avoid screen time 1 hour before scheduled rest"]
    )
    citation: str = Field(
        default="NASA Human Research Program Standard Medical Protocol",
        example="NASA Human Research Program Standard Medical Protocol"
    )
    citation_url: Optional[str] = Field(
        default="https://www.nasa.gov/hrp",
        example="https://www.nasa.gov/hrp"
    )
    disclaimer: str = Field(
        default="Support tool only, not a certified clinical diagnostic device.",
        example="Support tool only, not a certified clinical diagnostic device."
    )
