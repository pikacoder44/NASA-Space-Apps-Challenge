"""FastAPI application entry point for AstroTrack AAHMS."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import (
    auth,
    astronauts,
    readings,
    dashboard,
    guidance,
    routine,
    body_map,
    ai_explanation,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Ensure all database tables exist
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database schema initialization notice: {e}")

    # Seed default astronaut and simulated dataset if needed
    try:
        from scripts.seed import seed_database
        seed_database(force=False)
    except Exception as e:
        print(f"Automatic seed skipped or completed: {e}")

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Autonomous Astronaut Health Monitoring System (AAHMS) backend API for deep space transit. "
        "Provides physiological telemetry evaluation, personal baseline anomaly detection, "
        "space medicine guidance, routine task management, and dashboard summary services."
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/docs", include_in_schema=False)
def docs_redirect():
    """Redirect local /docs requests to /api/docs."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/docs")


@app.get("/redoc", include_in_schema=False)
def redoc_redirect():
    """Redirect local /redoc requests to /api/redoc."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/redoc")


@app.get("/openapi.json", include_in_schema=False)
def openapi_redirect():
    """Redirect local /openapi.json requests to /api/openapi.json."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/openapi.json")


# Top-level operational endpoints
@app.get("/", tags=["health"], summary="Root service status")
@app.get("/api", tags=["health"], summary="Root service status (mounted)")
@app.get("/api/", tags=["health"], summary="Root service status (mounted slash)")
def root():
    """Service status and API documentation entry point."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/api/docs",
    }


@app.get("/health", tags=["health"], summary="Health check endpoint")
@app.get("/api/health", tags=["health"], summary="Health check endpoint (mounted)")
def health_check():
    """Verify application liveness and database connectivity."""
    db_status = "connected"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unavailable: {str(e)}"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status,
        "version": settings.VERSION,
    }


# Register resource routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(astronauts.router, prefix="/api/astronauts", tags=["astronauts"])
app.include_router(readings.router, prefix="/api/readings", tags=["readings"])
app.include_router(dashboard.router, tags=["dashboard"])
app.include_router(guidance.router, prefix="/api/guidance", tags=["guidance"])
app.include_router(routine.router, prefix="/api/routine", tags=["routine"])
app.include_router(body_map.router, prefix="/api/body-map", tags=["body-map"])
app.include_router(ai_explanation.router, tags=["ai-explanation"])
