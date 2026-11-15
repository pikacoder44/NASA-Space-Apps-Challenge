"""Routine task schema."""

from typing import Optional
from pydantic import BaseModel, Field


class RoutineTask(BaseModel):
    """Daily operational routine task checklist item."""
    id: str = Field(..., example="task-1")
    title: str = Field(..., example="Morning Vitals & Pulse Oximetry")
    category: str = Field(..., example="Medical")
    completed: bool = Field(default=False, example=True)
    due_time: Optional[str] = Field(default=None, example="07:30 UTC")
    indicator: Optional[str] = Field(default=None, example="sleep_hours",
                                     description="Indicator this follow-up task relates to, if any")
