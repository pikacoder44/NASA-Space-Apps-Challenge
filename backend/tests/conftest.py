"""Shared test setup.

Runs before any test module is imported, so the app is configured to use a
throwaway SQLite database. Tests never touch the real backend/aahms.db, so a
test run cannot leave rows behind that would stop the demo seed from loading.
"""

import os
import tempfile
from pathlib import Path

_TEST_DB_DIR = Path(tempfile.mkdtemp(prefix="aahms-tests-"))
# TEST_DATABASE_URL (optional) runs the suite against another empty database, e.g. PostgreSQL.
os.environ["DATABASE_URL"] = os.environ.get("TEST_DATABASE_URL") or f"sqlite:///{(_TEST_DB_DIR / 'test.db').as_posix()}"
os.environ["AUTH_REQUIRED"] = "false"
os.environ["SECRET_KEY"] = "test-only-secret-key"
