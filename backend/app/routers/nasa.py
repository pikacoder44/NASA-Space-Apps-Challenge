"""Real NASA data endpoints (kept separate from simulated telemetry)."""

from typing import List
from fastapi import APIRouter, HTTPException, status

from app.schemas.nasa import NasaGlucoseResponse, NasaSource
from app.services.nasa_data import NASA_SOURCES, NasaDataUnavailable, get_inspiration4_glucose

router = APIRouter()


@router.get("/sources", response_model=List[NasaSource], summary="NASA data and resources used by AstroTrack")
def list_nasa_sources():
    """NASA datasets, repositories and references AstroTrack uses, with how each is used."""
    return NASA_SOURCES


@router.get(
    "/inspiration4/glucose",
    response_model=NasaGlucoseResponse,
    summary="Real blood glucose of the SpaceX Inspiration4 crew (NASA OSDR OSD-575)",
)
def get_inspiration4_glucose_data():
    """Blood glucose of the 4 Inspiration4 crew members before and after flight.

    Real NASA data from OSDR study OSD-575, unchanged. Each value is flagged
    low / normal / high against the lab's own reference range in the file.
    Returns 503 if the data file is not available on the server.
    """
    try:
        return get_inspiration4_glucose()
    except NasaDataUnavailable as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
