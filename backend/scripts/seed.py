"""Database seeding script for AstroTrack.

Loads the SIMULATED mission data (data/simulator/mission_data.json, clearly
labelled synthetic) into the database for the demo astronaut.

Usage (from backend/):
    python -m scripts.seed                    # load days 1-90 if the demo astronaut has no readings
    python -m scripts.seed --up-to-day 90 --force   # wipe demo readings and reload

Timestamps are relative to now: the last loaded day (--up-to-day) is "today",
Day 1 is (up_to_day - 1) days ago. So the 30-day charts always show the story,
whatever day the demo runs. Each value is evaluated with the same evaluate()
and the same history rule (up to 30 previous values) as POST /api/readings.
"""

import argparse
import json
import os
import sys
from datetime import timedelta
from typing import List, Optional

# Ensure repo root and backend dir are in sys.path
_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.core.timeutils import utcnow
from app.models.astronaut import Astronaut
from app.models.reading import Reading
from app.services.evaluator import evaluate
from app.services.readings_service import HISTORY_LIMIT
from app.services.reference_data import REFERENCE_RANGES, get_unit

MAX_MISSION_DAY = 180


def _find_mission_data() -> Optional[str]:
    candidate_paths = [
        os.environ.get("SIMULATOR_DATA_PATH") or "",
        os.path.join(_REPO_ROOT, "data", "simulator", "mission_data.json"),
        "/data/simulator/mission_data.json",
        "/app/data/simulator/mission_data.json",
        os.path.join(os.getcwd(), "data", "simulator", "mission_data.json"),
    ]
    return next((p for p in candidate_paths if p and os.path.exists(p)), None)


def _ensure_demo_astronaut(db) -> Astronaut:
    astro = db.query(Astronaut).filter(Astronaut.id == settings.DEFAULT_ASTRONAUT_ID).first()
    if astro is None:
        astro = Astronaut(
            id=settings.DEFAULT_ASTRONAUT_ID,
            email=settings.DEFAULT_ASTRONAUT_EMAIL,
            password_hash=get_password_hash(settings.DEMO_PASSWORD),
            name=settings.DEFAULT_ASTRONAUT_NAME,
            role=settings.DEFAULT_ASTRONAUT_ROLE,
            mission_day=settings.DEFAULT_MISSION_DAY,
        )
        db.add(astro)
        db.commit()
        print(f"Created demo astronaut: {astro.name} ({astro.email})")
    return astro


def seed_database(force: bool = False, up_to_day: Optional[int] = None) -> int:
    """Seed the demo astronaut with simulated readings for days 1..up_to_day.

    Skips if the demo astronaut already has readings, unless `force` is True or
    the existing seed is stale (rows dated more than a day in the future, left
    by an older seed version). Returns the number of readings inserted.
    """
    if up_to_day is None:
        up_to_day = settings.SEED_MISSION_DAY
    if not 1 <= up_to_day <= MAX_MISSION_DAY:
        raise ValueError(f"up_to_day must be between 1 and {MAX_MISSION_DAY}, got {up_to_day}")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        astro = _ensure_demo_astronaut(db)
        demo_rows = db.query(Reading).filter(Reading.astronaut_id == astro.id)
        count = demo_rows.count()
        now = utcnow()

        stale = demo_rows.filter(Reading.measured_at > now + timedelta(days=1)).count() > 0
        if count and not force and not stale:
            print(f"Database already contains astronaut '{astro.id}' with {count} readings. Use --force to reload.")
            return 0
        if stale and not force:
            print("Existing demo readings are dated in the future (old seed). Reloading.")
        if count:
            demo_rows.delete(synchronize_session=False)
            db.commit()

        json_path = _find_mission_data()
        if not json_path:
            print("Warning: data/simulator/mission_data.json not found. Skipping telemetry seed.")
            return 0
        with open(json_path, "r", encoding="utf-8") as f:
            records = json.load(f)

        rows = []
        for r in records:
            if r.get("indicator") in REFERENCE_RANGES and isinstance(r.get("day"), int) and 1 <= r["day"] <= up_to_day:
                rows.append((r["day"], r["indicator"], float(r["value"])))
        rows.sort(key=lambda t: (t[0], t[1]))

        # Last seeded day = now (rounded to the minute, slightly in the past).
        anchor = now.replace(second=0, microsecond=0) - timedelta(minutes=1)
        history_by_ind: dict = {}
        readings: List[Reading] = []
        for day, ind, val in rows:
            past = history_by_ind.setdefault(ind, [])
            eval_res = evaluate(ind, val, history=past[-HISTORY_LIMIT:])
            past.append(val)
            readings.append(
                Reading(
                    astronaut_id=astro.id,
                    indicator=ind,
                    value=val,
                    unit=get_unit(ind),
                    status=eval_res.status,
                    reason=eval_res.reason,
                    measured_at=anchor - timedelta(days=up_to_day - day),
                )
            )

        db.bulk_save_objects(readings)
        astro.mission_day = up_to_day
        db.commit()
        print(f"Seeded {len(readings)} simulated readings (days 1-{up_to_day}, day {up_to_day} = now UTC) "
              f"for astronaut '{astro.id}' from {json_path}.")
        return len(readings)
    finally:
        db.close()


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Seed simulated mission data for the demo astronaut.")
    parser.add_argument("--up-to-day", type=int, default=None,
                        help=f"Last mission day to load (default {settings.SEED_MISSION_DAY}).")
    parser.add_argument("--force", action="store_true", help="Delete existing demo readings and reload.")
    args = parser.parse_args(argv)
    seed_database(force=args.force, up_to_day=args.up_to_day)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
