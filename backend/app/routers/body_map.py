"""Interactive body map anatomical mapping router."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.astronaut import Astronaut
from app.routers.auth import get_current_astronaut
from app.schemas.body_map import BodyMapResponse
from app.services.guidance_data import BODY_MAP_REGIONS, get_body_map_region
from app.services.readings_service import latest_readings, worst_status

router = APIRouter()


@router.get("/{body_part}", response_model=BodyMapResponse, summary="Get indicators mapped to anatomical body part")
def get_body_part_indicators(
    body_part: str,
    db: Session = Depends(get_db),
    current_astro: Astronaut = Depends(get_current_astronaut),
):
    """Indicators monitored for a body region and the worst latest status among them.

    Regions: head, chest, abdomen, limbs, full_body (aliases such as heart, brain,
    arms, legs are accepted). Status is 'normal' when no readings exist yet.
    Unknown body part returns 404.
    """
    region = get_body_map_region(body_part)
    if region is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown body part '{body_part}'. Use one of: {', '.join(BODY_MAP_REGIONS)}",
        )
    latest = latest_readings(db, current_astro.id)
    region["status"] = worst_status([latest[i].status for i in region["indicators"] if i in latest])
    return BodyMapResponse(**region)
