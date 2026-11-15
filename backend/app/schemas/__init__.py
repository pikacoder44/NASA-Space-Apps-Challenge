"""Schemas package consolidating all request and response models."""

from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.astronaut import AstronautResponse
from app.schemas.reading import NewReading, ReadingResponse
from app.schemas.dashboard import DashboardSummaryResponse, IndicatorSummary
from app.schemas.guidance import GuidanceResponse
from app.schemas.routine import RoutineTask
from app.schemas.body_map import BodyMapResponse
from app.schemas.ai_explanation import AIExplanationRequest, AIExplanationResponse

__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "TokenResponse",
    "AstronautResponse",
    "NewReading",
    "ReadingResponse",
    "DashboardSummaryResponse",
    "IndicatorSummary",
    "GuidanceResponse",
    "RoutineTask",
    "BodyMapResponse",
    "AIExplanationRequest",
    "AIExplanationResponse",
]
