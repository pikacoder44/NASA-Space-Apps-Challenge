"""Tests for the simulated-data seed script."""

import os
import sys
import unittest
from datetime import timedelta

_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from fastapi.testclient import TestClient

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.timeutils import to_naive_utc, utcnow
from app.main import app
from app.models.astronaut import Astronaut
from app.models.reading import Reading
from scripts.seed import seed_database


class TestSeed(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def demo_readings(self):
        with SessionLocal() as db:
            return db.query(Reading).filter(Reading.astronaut_id == settings.DEFAULT_ASTRONAUT_ID).all()

    def test_seed_loads_only_up_to_day_and_nothing_in_future(self):
        inserted = seed_database(force=True, up_to_day=90)
        self.assertEqual(inserted, 90 * 7)
        rows = self.demo_readings()
        self.assertEqual(len(rows), 90 * 7)
        self.assertLessEqual(max(to_naive_utc(r.measured_at) for r in rows), utcnow())
        with SessionLocal() as db:
            self.assertEqual(db.get(Astronaut, settings.DEFAULT_ASTRONAUT_ID).mission_day, 90)

        # Charts: last 30 days of the story are visible.
        hr = self.client.get("/api/readings?indicator=heart_rate&days=30").json()
        self.assertTrue(29 <= len(hr) <= 31)
        self.assertTrue(hr[-1]["measured_at"].endswith("Z"))

    def test_seed_skips_when_already_seeded_and_force_reloads(self):
        seed_database(force=True, up_to_day=10)
        self.assertEqual(seed_database(force=False, up_to_day=90), 0)
        self.assertEqual(len(self.demo_readings()), 70)
        self.assertEqual(seed_database(force=True, up_to_day=20), 140)

    def test_stale_future_seed_is_reloaded(self):
        seed_database(force=True, up_to_day=10)
        with SessionLocal() as db:
            db.add(Reading(astronaut_id=settings.DEFAULT_ASTRONAUT_ID, indicator="heart_rate", value=70,
                           unit="bpm", status="normal", reason="old seed", measured_at=utcnow() + timedelta(days=60)))
            db.commit()
        self.assertEqual(seed_database(force=False, up_to_day=10), 70)
        self.assertLessEqual(max(to_naive_utc(r.measured_at) for r in self.demo_readings()), utcnow())

    def test_invalid_up_to_day(self):
        with self.assertRaises(ValueError):
            seed_database(force=True, up_to_day=0)


if __name__ == "__main__":
    unittest.main()
