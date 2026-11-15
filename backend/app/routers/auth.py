"""Authentication router for crew login and registration."""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from app.models.astronaut import Astronaut
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.astronaut import AstronautResponse

router = APIRouter()


def get_current_astronaut(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
) -> Astronaut:
    """Dependency that resolves the active astronaut from JWT token, or demo fallback."""
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()

    if token:
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            astro_id = payload["sub"]
            astro = db.query(Astronaut).filter(Astronaut.id == astro_id).first()
            if astro:
                return astro

    if settings.AUTH_REQUIRED:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide a valid Bearer access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Demo fallback astronaut when AUTH_REQUIRED is false
    demo_astro = db.query(Astronaut).filter(Astronaut.id == settings.DEFAULT_ASTRONAUT_ID).first()
    if not demo_astro:
        # Create demo astronaut in DB if not present
        demo_astro = Astronaut(
            id=settings.DEFAULT_ASTRONAUT_ID,
            email=settings.DEFAULT_ASTRONAUT_EMAIL,
            password_hash=get_password_hash(settings.DEMO_PASSWORD),
            name=settings.DEFAULT_ASTRONAUT_NAME,
            role=settings.DEFAULT_ASTRONAUT_ROLE,
            mission_day=settings.DEFAULT_MISSION_DAY,
        )
        try:
            db.add(demo_astro)
            db.commit()
            db.refresh(demo_astro)
        except Exception:
            db.rollback()
            demo_astro = db.query(Astronaut).filter(Astronaut.id == settings.DEFAULT_ASTRONAUT_ID).first()

    return demo_astro


@router.post("/login", response_model=TokenResponse, summary="Log in astronaut")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate crew member by email and password, returning JWT access token."""
    astro = db.query(Astronaut).filter(Astronaut.email == login_data.email).first()
    if not astro or not verify_password(login_data.password, astro.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or mission credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(astro.id), "email": astro.email})
    return TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/register", response_model=AstronautResponse, status_code=status.HTTP_201_CREATED, summary="Register astronaut")
def register(reg_data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new crew member for flight operations."""
    existing = db.query(Astronaut).filter(Astronaut.email == reg_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An astronaut profile with email '{reg_data.email}' already exists.",
        )

    import uuid
    new_id = str(uuid.uuid4())[:8]

    new_astro = Astronaut(
        id=new_id,
        email=reg_data.email,
        password_hash=get_password_hash(reg_data.password),
        name=reg_data.name,
        role=reg_data.role or "CDR-01",
        mission_day=settings.DEFAULT_MISSION_DAY,
    )
    db.add(new_astro)
    db.commit()
    db.refresh(new_astro)

    return AstronautResponse(
        id=str(new_astro.id),
        email=new_astro.email,
        name=new_astro.name,
        role=new_astro.role,
        mission_day=new_astro.mission_day,
    )
