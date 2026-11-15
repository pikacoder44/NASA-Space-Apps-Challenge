"""Tests for clinical guidance, routine tasks, and body map endpoints."""

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
from app.services.reference_data import REFERENCE_RANGES


class TestGuidance(unittest.TestCase):
    """Test guidance and ancillary endpoints."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_guidance_for_all_indicators_and_statuses(self):
        """Every supported indicator must return guidance for normal, warning, and critical."""
        statuses = ["normal", "warning", "critical"]
        for ind in REFERENCE_RANGES.keys():
            for st in statuses:
                res = self.client.get(f"/api/guidance/{ind}/{st}")
                self.assertEqual(res.status_code, 200, f"Failed for {ind}/{st}")
                data = res.json()
                self.assertEqual(data["indicator"], ind)
                self.assertEqual(data["status"], st)
                self.assertTrue(len(data["title"]) > 0)
                self.assertTrue(len(data["explanation"]) > 0)
                self.assertTrue(len(data["action"]) > 0)
                self.assertTrue("disclaimer" in data)

    def test_guidance_invalid_status_rejected(self):
        """Invalid status returns 400."""
        res = self.client.get("/api/guidance/heart_rate/invalid_status")
        self.assertEqual(res.status_code, 400)

    def test_guidance_unknown_indicator_rejected(self):
        """Unknown indicator returns 404."""
        res = self.client.get("/api/guidance/warp_drive_flux/normal")
        self.assertEqual(res.status_code, 404)

    def test_body_map_endpoint(self):
        """Body map endpoint returns region indicators and status."""
        for part in ["chest", "head", "abdomen", "limbs"]:
            res = self.client.get(f"/api/body-map/{part}")
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertEqual(data["body_part"], part)
            self.assertIsInstance(data["indicators"], list)
            self.assertTrue(len(data["indicators"]) > 0)

    def test_routine_today_endpoint(self):
        """Routine endpoint returns daily checklist items."""
        res = self.client.get("/api/routine/today")
        self.assertEqual(res.status_code, 200)
        tasks = res.json()
        self.assertIsInstance(tasks, list)
        self.assertGreaterEqual(len(tasks), 4)
        for t in tasks:
            self.assertTrue("id" in t)
            self.assertTrue("title" in t)
            self.assertTrue("category" in t)
            self.assertIsInstance(t["completed"], bool)



class TestBodyMapAndRoutineFromReadings(unittest.TestCase):
    """Body map status and routine tasks follow the astronaut's logged readings."""

    @classmethod
    def setUpClass(cls):
        from app.core.database import Base, engine
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    def setUp(self):
        import uuid
        email = f"routine_{uuid.uuid4().hex[:10]}@astrotrack.space"
        self.client.post("/api/auth/register", json={"email": email, "password": "TestPass123!", "name": "Routine Crew"})
        token = self.client.post("/api/auth/login", json={"email": email, "password": "TestPass123!"}).json()["access_token"]
        self.h = {"Authorization": f"Bearer {token}"}

    def test_unknown_body_part_returns_404(self):
        self.assertEqual(self.client.get("/api/body-map/tail", headers=self.h).status_code, 404)

    def test_body_map_aliases(self):
        body = self.client.get("/api/body-map/heart", headers=self.h).json()
        self.assertEqual(body["body_part"], "chest")
        self.assertEqual(self.client.get("/api/body-map/Full-Body", headers=self.h).json()["body_part"], "full_body")

    def test_body_map_status_is_worst_latest_reading(self):
        self.assertEqual(self.client.get("/api/body-map/chest", headers=self.h).json()["status"], "normal")
        self.client.post("/api/readings", json={"indicator": "heart_rate", "value": 190}, headers=self.h)
        self.assertEqual(self.client.get("/api/body-map/chest", headers=self.h).json()["status"], "critical")
        self.assertEqual(self.client.get("/api/body-map/head", headers=self.h).json()["status"], "normal")

    def test_routine_without_readings_has_nothing_completed(self):
        tasks = self.client.get("/api/routine/today", headers=self.h).json()
        self.assertEqual([t["id"] for t in tasks], ["task-1", "task-2", "task-3", "task-4"])
        self.assertFalse(any(t["completed"] for t in tasks))

    def test_routine_marks_logged_tasks_and_adds_follow_ups(self):
        self.client.post("/api/readings", json={"indicator": "heart_rate", "value": 70}, headers=self.h)
        self.client.post("/api/readings", json={"indicator": "sleep_hours", "value": 3.0}, headers=self.h)
        tasks = {t["id"]: t for t in self.client.get("/api/routine/today", headers=self.h).json()}
        self.assertTrue(tasks["task-1"]["completed"])
        self.assertTrue(tasks["task-4"]["completed"])
        self.assertEqual(tasks["follow-up-sleep_hours"]["indicator"], "sleep_hours")
        self.assertNotIn("follow-up-heart_rate", tasks)

if __name__ == "__main__":
    unittest.main()
