"""SQLAlchemy database engine, session management, and Base declaration."""

from typing import Generator
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings


def normalize_database_url(url: str) -> str:
    """Make hosted PostgreSQL URLs (e.g. Neon) use the installed psycopg2 driver.

    - 'postgres://' is rejected by SQLAlchemy 2.
    - Plain 'postgresql://' defaults to the psycopg (v3) driver in SQLAlchemy 2.1+,
      which is not installed; requirements.txt ships psycopg2-binary.
    URLs that already name a driver (postgresql+...://) and SQLite URLs are unchanged.
    """
    url = url.strip()
    for scheme in ("postgres://", "postgresql://"):
        if url.startswith(scheme):
            return "postgresql+psycopg2://" + url[len(scheme):]
    return url


DATABASE_URL = normalize_database_url(settings.DATABASE_URL)

# SQLite requires check_same_thread=False. For PostgreSQL (e.g. Neon) idle
# connections are recycled after 5 minutes, since serverless databases close them.
engine_kwargs = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(DATABASE_URL, **engine_kwargs)

if engine.dialect.name == "postgresql":
    @event.listens_for(engine, "connect")
    def _use_utc(dbapi_connection, _record):
        """Timestamps are stored as naive UTC: make PostgreSQL read and return them as UTC,
        whatever the database's default time zone is."""
        with dbapi_connection.cursor() as cur:
            cur.execute("SET TIME ZONE 0")  # UTC as an offset: works even without tz names
        dbapi_connection.commit()  # psycopg2 opens a transaction; commit so a rollback can't undo the SET

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a database session for requests."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
