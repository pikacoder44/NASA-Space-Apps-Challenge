"""Tests for telemetry readings submission and historical queries."""

import os
import sys
import unittest
import uuid
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from app.services.evaluator import evaluate


class TestReadings(unittest.TestCase):
    """Test telemetry ingestion and queries."""

    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    def test_submit_valid_reading(self):
        """Submitting a valid reading returns 201 with status and clinical message."""
        payload = {
            "indicator": "heart_rate",
            "value": 72.0,
            "unit": "bpm",
            "measured_at": "2026-11-15T08:00:00Z",
        }
        res = self.client.post("/api/readings", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["indicator"], "heart_rate")
        self.assertEqual(data["value"], 72.0)
        self.assertEqual(data["unit"], "bpm")
        self.assertIn(data["status"], ["normal", "warning", "critical"])
        self.assertTrue(len(data["message"]) > 0)
        self.assertTrue("id" in data)

    def test_invalid_indicator_returns_422(self):
        """Submitting an unknown indicator must be rejected with 422 Unprocessable Entity."""
        payload = {
            "indicator": "unknown_metabolic_flux",
            "value": 99.0,
        }
        res = self.client.post("/api/readings", json=payload)
        self.assertEqual(res.status_code, 422)

    def test_get_readings_filter_by_indicator(self):
        """Querying readings by indicator returns a list of chronological observations."""
        res = self.client.get("/api/readings?indicator=heart_rate&days=30")
        self.assertEqual(res.status_code, 200)
        readings = res.json()
        self.assertIsInstance(readings, list)
        for r in readings:
            self.assertEqual(r["indicator"], "heart_rate")
            self.assertIn(r["status"], ["normal", "warning", "critical"])


class TestReadingsValidationAndHistory(unittest.TestCase):
    """Input validation, time handling, days filter and evaluator history."""

    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    def setUp(self):
        # A fresh astronaut per test keeps readings isolated.
        email = f"readings_{uuid.uuid4().hex[:10]}@astrotrack.space"
        self.client.post("/api/auth/register", json={"email": email, "password": "TestPass123!", "name": "Test Crew"})
        token = self.client.post("/api/auth/login", json={"email": email, "password": "TestPass123!"}).json()["access_token"]
        self.headers = {"Authorization": f"Bearer {token}"}

    def post(self, **body):
        return self.client.post("/api/readings", json=body, headers=self.headers)

    def iso(self, **delta):
        return (datetime.now(timezone.utc) - timedelta(**delta)).strftime("%Y-%m-%dT%H:%M:%SZ")

    def test_timestamps_are_utc_with_z(self):
        res = self.post(indicator="body_temp", value=36.6, measured_at="2026-11-15T13:00:00+05:00")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json()["measured_at"], "2026-11-15T08:00:00Z")

    def test_unit_is_always_the_standard_unit(self):
        res = self.post(indicator="body_temp", value=36.6, unit="F")
        self.assertEqual(res.json()["unit"], "°C")

    def test_invalid_values_rejected_with_422(self):
        self.assertEqual(self.post(indicator="heart_rate", value="NaN").status_code, 422)
        self.assertEqual(self.post(indicator="heart_rate", value=-50).status_code, 422)
        self.assertEqual(self.post(indicator="body_temp", value=98.6).status_code, 422)  # Fahrenheit typo
        self.assertEqual(self.post(indicator="mood_score", value=11).status_code, 422)
        self.assertEqual(self.post(indicator="heart_rate", value=72, measured_at="garbage").status_code, 422)
        self.assertEqual(self.post(indicator="heart_rate", value=72, measured_at=self.iso(days=-1)).status_code, 422)

    def test_days_filter_and_order(self):
        self.post(indicator="heart_rate", value=60, measured_at=self.iso(days=40))
        self.post(indicator="heart_rate", value=62, measured_at=self.iso(days=5))
        self.post(indicator="heart_rate", value=64, measured_at=self.iso(days=1))
        self.post(indicator="sleep_hours", value=7, measured_at=self.iso(days=1))

        week = self.client.get("/api/readings?indicator=heart_rate&days=7", headers=self.headers).json()
        self.assertEqual([r["value"] for r in week], [62, 64])
        all_hr = self.client.get("/api/readings?indicator=heart_rate&days=60", headers=self.headers).json()
        self.assertEqual([r["value"] for r in all_hr], [60, 62, 64])
        self.assertEqual(len(self.client.get("/api/readings?days=7", headers=self.headers).json()), 3)

    def test_history_contains_only_earlier_readings(self):
        calls = []

        def fake_evaluate(indicator, value, history=None):
            calls.append(list(history or []))
            return evaluate(indicator, value, history=history)

        with patch("app.routers.readings.evaluate", side_effect=fake_evaluate):
            self.post(indicator="heart_rate", value=61, measured_at=self.iso(days=3))
            self.post(indicator="heart_rate", value=63, measured_at=self.iso(days=1))
            # Back-dated reading: must not see the later 63.
            self.post(indicator="heart_rate", value=62, measured_at=self.iso(days=2))
        self.assertEqual(calls, [[], [61.0], [61.0]])


    # ---- Issue #12: pagination (skip / limit / stable order) ----
    def add_hourly(self, count):
        """Log `count` heart-rate readings one hour apart; value = 60 + i (oldest first)."""
        for i in range(count):
            self.post(indicator="heart_rate", value=60 + i, measured_at=self.iso(hours=count - i))

    def get(self, query):
        return self.client.get(f"/api/readings?indicator=heart_rate&days=30{query}", headers=self.headers)

    def test_pagination_default_limit_is_100_newest_readings(self):
        self.add_hourly(105)
        values = [r["value"] for r in self.get("").json()]
        self.assertEqual(len(values), 100)
        self.assertEqual(values[0], 65.0)    # oldest 5 are on the next page
        self.assertEqual(values[-1], 164.0)  # newest reading included
        self.assertEqual(values, sorted(values))  # default order asc (charts unchanged)

    def test_pagination_skip_limit_and_desc_order(self):
        self.add_hourly(10)
        page1 = [r["value"] for r in self.get("&limit=4&order=desc").json()]
        page2 = [r["value"] for r in self.get("&skip=4&limit=4&order=desc").json()]
        page3 = [r["value"] for r in self.get("&skip=8&limit=4&order=desc").json()]
        self.assertEqual(page1, [69.0, 68.0, 67.0, 66.0])
        self.assertEqual(page2, [65.0, 64.0, 63.0, 62.0])
        self.assertEqual(page3, [61.0, 60.0])
        self.assertEqual(self.get("&skip=50").json(), [])

    def test_pagination_order_is_stable_for_equal_timestamps(self):
        same_time = self.iso(hours=2)
        for v in (70, 71, 72):
            self.post(indicator="heart_rate", value=v, measured_at=same_time)
        first = [r["id"] for r in self.get("&order=desc").json()]
        second = [r["id"] for r in self.get("&order=desc").json()]
        self.assertEqual(first, second)
        self.assertEqual(first, sorted(first, reverse=True))  # ties broken by id desc

    def test_pagination_invalid_params_return_422(self):
        for query in ("&skip=-1", "&limit=0", "&limit=1001", "&order=random"):
            self.assertEqual(self.get(query).status_code, 422, query)
        self.assertEqual(self.get("&limit=1000").status_code, 200)

    def test_existing_calls_without_new_params_still_work(self):
        self.add_hourly(3)
        res = self.client.get("/api/readings?indicator=heart_rate&days=7", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual([r["value"] for r in res.json()], [60.0, 61.0, 62.0])


if __name__ == "__main__":
    unittest.main()
