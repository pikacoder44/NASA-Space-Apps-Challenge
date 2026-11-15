"""Tests for telemetry readings submission and historical queries."""

import os
import sys
import unittest

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine


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


if __name__ == "__main__":
    unittest.main()
