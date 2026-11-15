"""Interactive body map anatomical mapping router."""

from fastapi import APIRouter
from app.schemas.body_map import BodyMapResponse
from app.services.guidance_data import get_body_map_region

router = APIRouter()


@router.get("/{body_part}", response_model=BodyMapResponse, summary="Get indicators mapped to anatomical body part")
def get_body_part_indicators(body_part: str):
    """Retrieve the physiological telemetry indicators monitored for a specific body region."""
    data = get_body_map_region(body_part)
    return BodyMapResponse(**data)
