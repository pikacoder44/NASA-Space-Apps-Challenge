"""Telemetry readings endpoint: ingestion, clinical evaluation, and historical queries."""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.astronaut import Astronaut
from app.models.reading import Reading
from app.routers.auth import get_current_astronaut
from app.schemas.reading import NewReading, ReadingResponse
from app.services.evaluator import evaluate
from app.services.reference_data import REFERENCE_RANGES, get_unit

router = APIRouter()


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

    persist the record, and return the immediate evaluation status and clinical guidance reason.
    """
    indicator = reading_in.indicator
    if indicator not in REFERENCE_RANGES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unknown indicator '{indicator}'. Supported indicators: {list(REFERENCE_RANGES.keys())}",
        )

    # Resolve unit
    unit = reading_in.unit or get_unit(indicator)

    # Parse measured_at timestamp
    if reading_in.measured_at:
        try:
            measured_dt = datetime.fromisoformat(reading_in.measured_at.replace("Z", "+00:00"))
        except Exception:
            measured_dt = datetime.utcnow()
    else:
        measured_dt = datetime.utcnow()

    # Query up to 30 past historical values for this astronaut and indicator (chronological: oldest to newest)
    past_records = (
        db.query(Reading.value)
        .filter(
            Reading.astronaut_id == current_astro.id,
            Reading.indicator == indicator,
        )
        .order_by(desc(Reading.measured_at))
        .limit(30)
        .all()
    )
    # Reverse so oldest to newest, as expected by baseline evaluator
    history = [r[0] for r in reversed(past_records)]

    # Clinical evaluation using Track B brain
    eval_res = evaluate(indicator, reading_in.value, history=history)

    # Save to database
    db_reading = Reading(
        astronaut_id=current_astro.id,
        indicator=indicator,
        value=reading_in.value,
        unit=unit,
        status=eval_res.status,
        reason=eval_res.reason,
        measured_at=measured_dt,
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)

    return ReadingResponse(
        id=db_reading.id,
        indicator=db_reading.indicator,
        value=db_reading.value,
        unit=db_reading.unit,
        status=db_reading.status,
        measured_at=db_reading.measured_at.isoformat(),
        message=db_reading.reason or f"{indicator} recorded successfully.",
        reason=db_reading.reason,
    )


@router.get(
    "",
    response_model=List[ReadingResponse],
    summary="Query historical telemetry readings",
)
def get_readings(
    indicator: Optional[str] = Query(None, description="Optional indicator filter"),
    days: int = Query(30, ge=1, le=180, description="Number of past days to query"),
    db: Session = Depends(get_db),
    current_astro: Astronaut = Depends(get_current_astronaut),
):
    """Retrieve historical chronological readings for the active astronaut."""
    query = db.query(Reading).filter(Reading.astronaut_id == current_astro.id)

    if indicator:
        if indicator not in REFERENCE_RANGES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Unknown indicator '{indicator}'. Supported indicators: {list(REFERENCE_RANGES.keys())}",
            )
        query = query.filter(Reading.indicator == indicator)

    # Order by timestamp ascending for chart timelines
    records = query.order_by(Reading.measured_at.asc()).all()

    # If database has few/no records for this indicator (e.g. before full seed),
    # return the available records
    return [
        ReadingResponse(
            id=r.id,
            indicator=r.indicator,
            value=r.value,
            unit=r.unit,
            status=r.status,
            measured_at=r.measured_at.isoformat(),
            message=r.reason or f"{r.indicator} nominal observation.",
            reason=r.reason,
        )
        for r in records
    ]
