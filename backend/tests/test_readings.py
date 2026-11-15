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


if __name__ == "__main__":
    unittest.main()
