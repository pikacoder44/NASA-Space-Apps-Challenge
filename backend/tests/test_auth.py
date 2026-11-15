"""Tests for authentication and astronaut endpoints."""

import os
import sys
import unittest
from unittest.mock import patch

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



class TestSecurityHardening(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    def test_stored_hash_is_not_accepted_as_password(self):
        email = f"hash_{os.getpid()}_{id(self)}@astrotrack.space"
        self.client.post("/api/auth/register", json={"email": email, "password": "RealPass123!", "name": "Hash Test"})
        with SessionLocal() as db:
            stored = db.query(Astronaut).filter(Astronaut.email == email).first().password_hash
        res = self.client.post("/api/auth/login", json={"email": email, "password": stored})
        self.assertEqual(res.status_code, 401)

    def test_cors_allows_frontend_and_blocks_unknown_origins(self):
        def allowed(origin):
            res = self.client.options("/api/readings", headers={"Origin": origin, "Access-Control-Request-Method": "POST"})
            return res.headers.get("access-control-allow-origin") == origin
        self.assertTrue(allowed("http://localhost:3000"))
        self.assertTrue(allowed("https://astrotrack.vercel.app"))
        self.assertFalse(allowed("https://evil.example.com"))


class TestTokenExpiryConfig(unittest.TestCase):
    """Issue #13: token expiry read from env/.env, default 30 minutes, correct UTC timestamp."""

    def test_default_expiry_is_30_minutes(self):
        from app.core.config import Settings
        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop("ACCESS_TOKEN_EXPIRE_MINUTES", None)
            self.assertEqual(Settings().ACCESS_TOKEN_EXPIRE_MINUTES, 30)

    def test_expiry_read_from_environment(self):
        from app.core.config import Settings
        with patch.dict(os.environ, {"ACCESS_TOKEN_EXPIRE_MINUTES": "45"}):
            self.assertEqual(Settings().ACCESS_TOKEN_EXPIRE_MINUTES, 45)

    def test_token_exp_is_now_plus_configured_minutes_in_utc(self):
        import time
        from app.core.security import create_access_token, decode_access_token
        with patch.object(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 30):
            payload = decode_access_token(create_access_token({"sub": "1"}))
        self.assertIsNotNone(payload, "a fresh token must be valid")
        self.assertAlmostEqual(payload["exp"], time.time() + 30 * 60, delta=60)


if __name__ == "__main__":
    unittest.main()
