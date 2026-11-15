"""Astronaut profile management endpoints."""

from fastapi import APIRouter, Depends
from app.models.astronaut import Astronaut
from app.schemas.astronaut import AstronautResponse
from app.routers.auth import get_current_astronaut

router = APIRouter()


@router.get("/me", response_model=AstronautResponse, summary="Get active astronaut profile")
def get_me(current_astro: Astronaut = Depends(get_current_astronaut)):
    """Retrieve the current authenticated astronaut profile."""
    return AstronautResponse(
        id=str(current_astro.id),
        email=current_astro.email,
        name=current_astro.name,
        role=current_astro.role,
        mission_day=current_astro.mission_day,
    )
