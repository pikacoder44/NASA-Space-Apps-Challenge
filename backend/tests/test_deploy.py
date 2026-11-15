"""Deployment readiness: the backend/ folder alone must contain everything it needs
(Vercel uploads only the Root Directory), and hosted PostgreSQL URLs must be accepted."""

import filecmp
import os
import sys
import unittest

_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_REPO_ROOT = os.path.abspath(os.path.join(_BACKEND_DIR, ".."))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.core.database import normalize_database_url
from app.routers.dashboard import get_simulator_data_path
from app.services.nasa_data import CSV_NAME, get_nasa_csv_path

NASA_REL = os.path.join("data", "nasa", "inspiration4", "original", CSV_NAME)
SIM_REL = os.path.join("data", "simulator", "mission_data.json")


class TestBundledData(unittest.TestCase):
    def test_nasa_csv_is_bundled_in_backend_and_used(self):
        bundled = os.path.join(_BACKEND_DIR, NASA_REL)
        self.assertTrue(os.path.exists(bundled))
        self.assertEqual(os.path.abspath(get_nasa_csv_path()), os.path.abspath(bundled))

    def test_simulator_data_is_bundled_in_backend_and_used(self):
        bundled = os.path.join(_BACKEND_DIR, SIM_REL)
        self.assertTrue(os.path.exists(bundled))
        self.assertEqual(os.path.abspath(get_simulator_data_path()), os.path.abspath(bundled))

    def test_bundled_copies_match_repo_root_originals(self):
        for rel in (NASA_REL, SIM_REL):
            original = os.path.join(_REPO_ROOT, rel)
            if not os.path.exists(original):
                self.skipTest("repo-root data not present (backend-only checkout)")
            self.assertTrue(
                filecmp.cmp(original, os.path.join(_BACKEND_DIR, rel), shallow=False),
                f"{rel} differs from the repo-root copy; copy it into backend/ again",
            )


class TestDatabaseUrl(unittest.TestCase):
    def test_hosted_postgres_urls_use_psycopg2(self):
        # Neon gives postgresql://...; some hosts give postgres://... Both must use psycopg2
        # (plain postgresql:// would pick the uninstalled psycopg v3 driver in SQLAlchemy 2.1+).
        for url in ("postgres://u:p@host.neon.tech/db?sslmode=require",
                    "postgresql://u:p@host.neon.tech/db?sslmode=require"):
            self.assertEqual(
                normalize_database_url(url),
                "postgresql+psycopg2://u:p@host.neon.tech/db?sslmode=require",
            )

    def test_other_urls_unchanged(self):
        for url in ("sqlite:///./aahms.db", "postgresql+psycopg2://u:p@h/db", "postgresql+asyncpg://u:p@h/db"):
            self.assertEqual(normalize_database_url(url), url)


if __name__ == "__main__":
    unittest.main()
