"""Database seeding script for AstroTrack.

Loads data/simulator/mission_data.json into the database and provisions the default demo astronaut.
"""

import json
import os
import sys
from datetime import datetime, timedelta

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
from app.models.astronaut import Astronaut
from app.models.reading import Reading
from app.services.evaluator import evaluate
from app.services.reference_data import get_unit


def seed_database(force: bool = False):
    """Seed the database with the default astronaut and simulated mission telemetry."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already seeded
        existing_astro = db.query(Astronaut).filter(Astronaut.id == settings.DEFAULT_ASTRONAUT_ID).first()
        if existing_astro and not force:
            count = db.query(Reading).filter(Reading.astronaut_id == settings.DEFAULT_ASTRONAUT_ID).count()
            if count > 0:
                print(f"Database already contains astronaut '{settings.DEFAULT_ASTRONAUT_ID}' with {count} readings.")
                return

        # Provision demo astronaut
        if not existing_astro:
            astro = Astronaut(
                id=settings.DEFAULT_ASTRONAUT_ID,
                email=settings.DEFAULT_ASTRONAUT_EMAIL,
                password_hash=get_password_hash("SpaceOps2026!"),
                name=settings.DEFAULT_ASTRONAUT_NAME,
                role=settings.DEFAULT_ASTRONAUT_ROLE,
                mission_day=settings.DEFAULT_MISSION_DAY,
            )
            db.add(astro)
            db.commit()
            print(f"Created demo astronaut: {astro.name} ({astro.email})")
        else:
            astro = existing_astro

        # Resolve path to mission_data.json
        candidate_paths = [
            os.path.join(_REPO_ROOT, "data", "simulator", "mission_data.json"),
            "/data/simulator/mission_data.json",
            os.path.join(os.getcwd(), "data", "simulator", "mission_data.json"),
        ]
        json_path = None
        for p in candidate_paths:
            if os.path.exists(p):
                json_path = p
                break

        if not json_path:
            print("Warning: data/simulator/mission_data.json not found. Skipping telemetry seed.")
            return

        with open(json_path, "r", encoding="utf-8") as f:
            records = json.load(f)

        print(f"Loading {len(records)} simulated mission records from {json_path}...")

        # Clear existing readings if force
        if force:
            db.query(Reading).filter(Reading.astronaut_id == astro.id).delete()
            db.commit()

        # Mission anchor date: Day 90 is 2026-11-15T08:00:00Z
        anchor_date = datetime(2026, 11, 15, 8, 0, 0)
        readings_to_add = []
        batch_size = 500

        # Maintain running history dictionary per indicator for clinical evaluation
        history_by_ind = {}

        # Sort records by day ascending
        sorted_records = sorted(records, key=lambda r: (r["day"], r["indicator"]))

        for r in sorted_records:
            day = r["day"]
            ind = r["indicator"]
            val = float(r["value"])

            # Compute observation timestamp relative to Day 90
            obs_dt = anchor_date - timedelta(days=(90 - day))

            # History is the last up to 30 values prior to this day
            past = history_by_ind.get(ind, [])
            eval_res = evaluate(ind, val, history=past[-30:] if past else None)

            # Update running history
            past.append(val)
            history_by_ind[ind] = past

            reading = Reading(
                astronaut_id=astro.id,
                indicator=ind,
                value=val,
                unit=get_unit(ind),
                status=eval_res.status,
                reason=eval_res.reason,
                measured_at=obs_dt,
            )
            readings_to_add.append(reading)

            if len(readings_to_add) >= batch_size:
                db.bulk_save_objects(readings_to_add)
                db.commit()
                readings_to_add = []

        if readings_to_add:
            db.bulk_save_objects(readings_to_add)
            db.commit()

        total = db.query(Reading).filter(Reading.astronaut_id == astro.id).count()
        print(f"Successfully seeded {total} readings for astronaut '{astro.id}'.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
