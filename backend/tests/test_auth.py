"""Tests for authentication and astronaut endpoints."""

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
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.astronaut import Astronaut


class TestAuth(unittest.TestCase):
    """Test astronaut registration, authentication, and profile endpoints."""

    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    def test_register_and_login_flow(self):
        """Crew member registration should succeed and allow subsequent login."""
        email = f"test_astro_{os.getpid()}@astrotrack.space"
        password = "SecurePassword123!"

        # Register
        reg_res = self.client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": password,
                "name": "Dr. Alex Vance",
                "role": "Science Officer",
            },
        )
        self.assertEqual(reg_res.status_code, 201)
        data = reg_res.json()
        self.assertEqual(data["email"], email)
        self.assertEqual(data["name"], "Dr. Alex Vance")
        self.assertTrue("id" in data)

        # Login
        login_res = self.client.post(
            "/api/auth/login",
            json={"email": email, "password": password},
        )
        self.assertEqual(login_res.status_code, 200)
        token_data = login_res.json()
        self.assertTrue("access_token" in token_data)
        self.assertEqual(token_data["token_type"], "bearer")

        # Access /api/astronauts/me with token
        token = token_data["access_token"]
        me_res = self.client.get(
            "/api/astronauts/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.json()
        self.assertEqual(me_data["email"], email)
        self.assertEqual(me_data["name"], "Dr. Alex Vance")

    def test_login_invalid_password_rejected(self):
        """Incorrect password must return 401 Unauthorized."""
        res = self.client.post(
            "/api/auth/login",
            json={"email": settings.DEFAULT_ASTRONAUT_EMAIL, "password": "WrongPassword999!"},
        )
        self.assertEqual(res.status_code, 401)

    def test_anonymous_me_endpoint_in_demo_mode(self):
        """When AUTH_REQUIRED is false, /api/astronauts/me returns the default demo astronaut."""
        res = self.client.get("/api/astronauts/me")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], settings.DEFAULT_ASTRONAUT_ID)
        self.assertEqual(data["email"], settings.DEFAULT_ASTRONAUT_EMAIL)


if __name__ == "__main__":
    unittest.main()
