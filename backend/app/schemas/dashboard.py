"""Pydantic schemas for the AstroTrack Dashboard summary endpoint.

Provides data models for individual indicator summaries, sparkline trends,
overall health status assessment, and clinical disclaimers.
"""

from typing import List, Optional

try:
    from pydantic import BaseModel, Field, ConfigDict
except ImportError:
    # Graceful fallback for host test environments where pydantic is not installed
    class BaseModel:  # type: ignore
        def __init__(self, **kwargs):
            for key, val in self.__class__.__dict__.items():
                if not key.startswith("_") and not callable(val):
                    setattr(self, key, val)
            for k, v in kwargs.items():
                setattr(self, k, v)

        def model_dump(self):
            def _dump(val):
                if isinstance(val, BaseModel):
                    return val.model_dump()
                elif isinstance(val, list):
                    return [_dump(x) for x in val]
                elif isinstance(val, dict):
                    return {k: _dump(v) for k, v in val.items()}
                return val

            return {k: _dump(v) for k, v in self.__dict__.items()}

        def dict(self):
            return self.model_dump()

    def Field(default=None, **kwargs):  # type: ignore
        return default

    ConfigDict = None  # type: ignore


class IndicatorSummary(BaseModel):
    """Current assessment and 7-day trend for a specific physiological indicator."""

    indicator: str = Field(
        ...,
        description="Snake_case indicator identifier (e.g. 'heart_rate', 'sleep_hours')",
        example="sleep_hours",
    )
    name: str = Field(
        ...,
        description="Human-readable indicator display name (e.g. 'Sleep Duration')",
        example="Sleep Duration",
    )
    value: float = Field(
        ...,
        description="Most recent recorded numerical measurement (alias for latest_value)",
        example=5.6,
    )
    latest_value: float = Field(
        ...,
        description="Most recent recorded numerical measurement",
        example=5.6,
    )
    unit: str = Field(
        ...,
        description="Unit of measurement",
        example="hours",
    )
    status: str = Field(
        ...,
        description="Health status: 'normal', 'warning', or 'critical'",
        example="warning",
    )
    reason: str = Field(
        ...,
        description="Readable human explanation for astronaut and medical officers",
        example="Sleep Duration (5.6 hours) is 2.2 SD below your 30-day normal (7.1 hours).",
    )
    message: str = Field(
        ...,
        description="Readable human explanation (alias for reason)",
        example="Sleep Duration (5.6 hours) is 2.2 SD below your 30-day normal (7.1 hours).",
    )
    trend: str = Field(
        default="stable",
        description="Directional velocity across 7-day trend: 'up', 'down', or 'stable'",
        example="down",
    )
    trend_7d: List[float] = Field(
        default_factory=list,
        description="Up to 7 most recent readings in chronological order for sparklines",
        example=[7.0, 6.9, 6.8, 6.5, 6.1, 5.8, 5.6],
    )
    mode: Optional[str] = Field(
        default="baseline",
        description="Evaluation mode: 'baseline' or 'reference'",
        example="baseline",
    )


class DashboardSummaryResponse(BaseModel):
    """Comprehensive dashboard summary response containing overall status and all indicators."""

    overall_status: str = Field(
        ...,
        description="Worst status among all evaluated indicators: 'critical' > 'warning' > 'normal'",
        example="warning",
    )
    indicators: List[IndicatorSummary] = Field(
        ...,
        description="List of status evaluations for each tracked physiological indicator",
    )
    mission_day: Optional[int] = Field(
        default=None,
        description="Evaluated mission day (1-180)",
        example=90,
    )
    astronaut_id: Optional[str] = Field(
        default=None,
        description="Astronaut profile identifier",
        example="1",
    )
    disclaimer: str = Field(
        default=(
            "Notice: AstroTrack provides automated mission support evaluations and anomaly detection. "
            "It does not substitute for certified aerospace medical diagnosis or flight surgeon protocol."
        ),
        description="Clinical demonstration disclaimer",
    )
