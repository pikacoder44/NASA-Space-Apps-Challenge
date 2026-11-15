"""Telemetry readings endpoint: ingestion, clinical evaluation, and historical queries."""

from datetime import timedelta
from typing import List, Literal, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.timeutils import iso_utc, parse_iso_utc, utcnow
from app.models.astronaut import Astronaut
from app.models.reading import Reading
from app.routers.auth import get_current_astronaut
from app.schemas.reading import NewReading, ReadingResponse
from app.services.evaluator import evaluate
from app.services.readings_service import get_history
from app.services.reference_data import PLAUSIBLE_LIMITS, REFERENCE_RANGES, get_unit

router = APIRouter()

# Small allowance for clock differences between the client and the server.
FUTURE_TOLERANCE = timedelta(minutes=5)


def _unknown_indicator(indicator: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=f"Unknown indicator '{indicator}'. Supported indicators: {list(REFERENCE_RANGES.keys())}",
    )


def to_response(r: Reading) -> ReadingResponse:
    """Convert a stored reading to the API response (UTC timestamp with 'Z')."""
    return ReadingResponse(
        id=r.id,
        indicator=r.indicator,
        value=r.value,
        unit=r.unit,
        status=r.status,
        measured_at=iso_utc(r.measured_at),
        message=r.reason or f"{r.indicator} recorded successfully.",
        reason=r.reason,
    )


@router.post(
    "",
    response_model=ReadingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit and clinically evaluate a physiological reading",
)
def submit_reading(
    reading_in: NewReading,
    db: Session = Depends(get_db),
    current_astro: Astronaut = Depends(get_current_astronaut),
):
    """Ingest a new measurement, evaluate it against the astronaut's personal baseline,
    persist the record, and return the evaluation status and reason.

    - Unknown indicator, NaN/infinite value, physically impossible value,
      invalid or future `measured_at`: 422.
    - The stored unit is always the indicator's standard unit.
    - History = up to 30 previous values of this indicator measured before this reading.
    """
    indicator = reading_in.indicator
    if indicator not in REFERENCE_RANGES:
        raise _unknown_indicator(indicator)

    lo, hi = PLAUSIBLE_LIMITS[indicator]
    if not lo <= reading_in.value <= hi:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"Value {reading_in.value} is not a possible {indicator} measurement "
                f"(accepted range {lo:g}-{hi:g} {get_unit(indicator)})."
            ),
        )

    now = utcnow()
    if reading_in.measured_at:
        try:
            measured_dt = parse_iso_utc(reading_in.measured_at)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="measured_at must be an ISO 8601 timestamp, e.g. 2026-11-15T08:00:00Z.",
            )
        if measured_dt > now + FUTURE_TOLERANCE:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="measured_at cannot be in the future.",
            )
    else:
        measured_dt = now

    history = get_history(db, current_astro.id, indicator, before=measured_dt)
    eval_res = evaluate(indicator, reading_in.value, history=history)

    db_reading = Reading(
        astronaut_id=current_astro.id,
        indicator=indicator,
        value=reading_in.value,
        unit=get_unit(indicator),
        status=eval_res.status,
        reason=eval_res.reason,
        measured_at=measured_dt,
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return to_response(db_reading)


@router.get(
    "",
    response_model=List[ReadingResponse],
    summary="Query historical telemetry readings",
)
def get_readings(
    indicator: Optional[str] = Query(None, description="Optional indicator filter"),
    days: int = Query(30, ge=1, le=365, description="Only readings from the last N days"),
    skip: int = Query(0, ge=0, description="Pagination: number of readings to skip (newest first)"),
    limit: int = Query(100, ge=1, le=1000, description="Pagination: maximum readings to return (max 1000)"),
    order: Literal["asc", "desc"] = Query(
        "asc", description="Order of the returned page: 'asc' = oldest first (charts), 'desc' = newest first"
    ),
    db: Session = Depends(get_db),
    current_astro: Astronaut = Depends(get_current_astronaut),
):
    """Readings of the active astronaut from the last `days` days (UTC timestamps), paginated.

    Pages are always cut from a stable newest-first order (timestamp desc, then id desc):
    `skip=0&limit=100` returns the 100 most recent readings, `skip=100` the next 100.
    `order` only controls how the returned page is sorted (default 'asc', oldest first,
    so existing chart calls without these parameters behave as before).
    """
    now = utcnow()
    query = db.query(Reading).filter(
        Reading.astronaut_id == current_astro.id,
        Reading.measured_at >= now - timedelta(days=days),
        Reading.measured_at <= now + FUTURE_TOLERANCE,
    )
    if indicator:
        if indicator not in REFERENCE_RANGES:
            raise _unknown_indicator(indicator)
        query = query.filter(Reading.indicator == indicator)

    records = (
        query.order_by(Reading.measured_at.desc(), Reading.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    if order == "asc":
        records.reverse()
    return [to_response(r) for r in records]
