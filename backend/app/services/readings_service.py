"""Database helpers for readings, shared by the readings, dashboard, routine and body-map routers."""

from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.timeutils import utcnow
from app.models.reading import Reading
from app.services.reference_data import REFERENCE_RANGES

HISTORY_LIMIT = 30
_SEVERITY = {"normal": 0, "warning": 1, "critical": 2}


def get_history(
    db: Session, astronaut_id: str, indicator: str, before: datetime, limit: int = HISTORY_LIMIT
) -> List[float]:
    """Values of one indicator measured at or before `before`, oldest to newest, at most `limit`.

    This is the `history` argument of evaluate(): previous values only, never
    readings timestamped after the one being evaluated.
    """
    rows = (
        db.query(Reading.value)
        .filter(
            Reading.astronaut_id == astronaut_id,
            Reading.indicator == indicator,
            Reading.measured_at <= before,
        )
        .order_by(Reading.measured_at.desc(), Reading.id.desc())
        .limit(limit)
        .all()
    )
    return [r[0] for r in reversed(rows)]


def latest_readings(db: Session, astronaut_id: str, now: Optional[datetime] = None) -> Dict[str, Reading]:
    """Most recent reading (not in the future) per indicator for one astronaut."""
    now = now or utcnow()
    latest: Dict[str, Reading] = {}
    for indicator in REFERENCE_RANGES:
        row = (
            db.query(Reading)
            .filter(
                Reading.astronaut_id == astronaut_id,
                Reading.indicator == indicator,
                Reading.measured_at <= now,
            )
            .order_by(Reading.measured_at.desc(), Reading.id.desc())
            .first()
        )
        if row is not None:
            latest[indicator] = row
    return latest


def recent_values(
    db: Session, astronaut_id: str, indicator: str, limit: int, now: Optional[datetime] = None
) -> List[Reading]:
    """Up to `limit` most recent readings (not in the future) of one indicator, NEWEST first."""
    now = now or utcnow()
    return (
        db.query(Reading)
        .filter(
            Reading.astronaut_id == astronaut_id,
            Reading.indicator == indicator,
            Reading.measured_at <= now,
        )
        .order_by(Reading.measured_at.desc(), Reading.id.desc())
        .limit(limit)
        .all()
    )


def worst_status(statuses: List[str]) -> str:
    """Worst of a list of statuses ('normal' when empty)."""
    return max(statuses, key=lambda s: _SEVERITY.get(s, 0), default="normal")
