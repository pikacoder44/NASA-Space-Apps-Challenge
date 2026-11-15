"""End-to-end integration test validating the entire API flow across all endpoints."""

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


class TestAPIFlow(unittest.TestCase):
    """Complete integration flow across every endpoint."""

    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    def test_root_and_health_endpoints(self):
        """Top-level health and root service status."""
        root_res = self.client.get("/")
        self.assertEqual(root_res.status_code, 200)
        self.assertEqual(root_res.json()["status"], "operational")

        health_res = self.client.get("/health")
        self.assertEqual(health_res.status_code, 200)
        self.assertEqual(health_res.json()["status"], "ok")

    def test_complete_crew_lifecycle_and_telemetry_flow(self):
        """Full scenario: registration, login, profile check, telemetry entry, dashboard, and AI explanation."""
        email = f"flight_cdr_{os.getpid()}@astrotrack.space"
        password = "MarsTransit2026!"

        # 1. Register
        reg_res = self.client.post(
            "/api/auth/register",
            json={"email": email, "password": password, "name": "Commander Mark Watney", "role": "Botanist / CDR"},
        )
        self.assertEqual(reg_res.status_code, 201)

        # 2. Login
        login_res = self.client.post(
            "/api/auth/login",
            json={"email": email, "password": password},
        )
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Profile
        me_res = self.client.get("/api/astronauts/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["name"], "Commander Mark Watney")

        # 4. Ingest Reading
        read_res = self.client.post(
            "/api/readings",
            headers=headers,
            json={"indicator": "heart_rate", "value": 75.0, "unit": "bpm"},
        )
        self.assertEqual(read_res.status_code, 201)
        self.assertEqual(read_res.json()["status"], "normal")

        # 5. Query Readings
        query_res = self.client.get("/api/readings?indicator=heart_rate&days=7", headers=headers)
        self.assertEqual(query_res.status_code, 200)
        self.assertGreaterEqual(len(query_res.json()), 1)

        # 6. Dashboard Summary (Day 90 story)
        dash_res = self.client.get("/api/dashboard/summary?day=90", headers=headers)
        self.assertEqual(dash_res.status_code, 200)
        dash_data = dash_res.json()
        self.assertEqual(dash_data["overall_status"], "warning")
        self.assertEqual(dash_data["mission_day"], 90)
        self.assertEqual(len(dash_data["indicators"]), 7)

        # 7. Clinical Guidance
        guid_res = self.client.get("/api/guidance/sleep_hours/warning", headers=headers)
        self.assertEqual(guid_res.status_code, 200)
        self.assertEqual(guid_res.json()["status"], "warning")

        # 8. Routine Tasks
        rout_res = self.client.get("/api/routine/today", headers=headers)
        self.assertEqual(rout_res.status_code, 200)
        self.assertGreaterEqual(len(rout_res.json()), 1)

        # 9. Body Map
        bm_res = self.client.get("/api/body-map/chest", headers=headers)
        self.assertEqual(bm_res.status_code, 200)
        self.assertIn("heart_rate", bm_res.json()["indicators"])

        # 10. AI Telemetry Explanation (both v1 and standard routes)
        for route in ["/api/v1/health/ai-explanation", "/api/health/ai-explanation"]:
            ai_res = self.client.post(
                route,
                headers=headers,
                json={"indicator": "sleep_hours", "status": "warning", "prompt": "Why is my sleep debt critical?"},
            )
            self.assertEqual(ai_res.status_code, 200)
            self.assertEqual(ai_res.json()["indicator"], "sleep_hours")


if __name__ == "__main__":
    unittest.main()
