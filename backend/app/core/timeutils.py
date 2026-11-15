"""UTC time helpers.

The database stores timestamps as naive UTC (SQLite drops timezone info).
Every timestamp leaving the API is ISO 8601 with a trailing "Z", so browsers
never mistake it for local time.
"""

from datetime import datetime, timezone
from typing import Optional


def utcnow() -> datetime:
    """Current time as naive UTC (the storage format)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def to_naive_utc(dt: datetime) -> datetime:
    """Convert any datetime to naive UTC. Naive input is assumed to already be UTC."""
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt


def parse_iso_utc(value: str) -> datetime:
    """Parse an ISO 8601 string (with 'Z' or an offset) to naive UTC. Raises ValueError if invalid."""
    text = value.strip()
    if text.endswith(("Z", "z")):
        text = text[:-1] + "+00:00"
    return to_naive_utc(datetime.fromisoformat(text))


def iso_utc(dt: Optional[datetime]) -> Optional[str]:
    """Format a stored timestamp as ISO 8601 UTC with a trailing 'Z'."""
    if dt is None:
        return None
    return to_naive_utc(dt).isoformat() + "Z"
