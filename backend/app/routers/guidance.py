"""Clinical guidance router."""

from fastapi import APIRouter, HTTPException, status
from app.schemas.guidance import GuidanceResponse
from app.services.guidance_data import get_clinical_guidance
from app.services.reference_data import REFERENCE_RANGES

router = APIRouter()


@router.get(
    "/{indicator}/{eval_status}",
    response_model=GuidanceResponse,
    summary="Get clinical guidance for indicator status",
)
def get_guidance(indicator: str, eval_status: str):
    """Retrieve operational space medicine guidance for an indicator and status classification."""
    valid_statuses = {"normal", "warning", "critical"}
    if eval_status.lower() not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{eval_status}'. Expected one of: {sorted(valid_statuses)}",
        )

    if indicator not in REFERENCE_RANGES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Indicator '{indicator}' not found in reference medical catalog.",
        )

    data = get_clinical_guidance(indicator, eval_status.lower())
    return GuidanceResponse(**data)
