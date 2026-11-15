"""Shared test setup.

Runs before any test module is imported, so the app is configured to use a
throwaway SQLite database. Tests never touch the real backend/aahms.db, so a
test run cannot leave rows behind that would stop the demo seed from loading.
"""

import os
import tempfile
from pathlib import Path

_TEST_DB_DIR = Path(tempfile.mkdtemp(prefix="aahms-tests-"))
os.environ["DATABASE_URL"] = f"sqlite:///{(_TEST_DB_DIR / 'test.db').as_posix()}"
os.environ["AUTH_REQUIRED"] = "false"
os.environ["SECRET_KEY"] = "test-only-secret-key"
