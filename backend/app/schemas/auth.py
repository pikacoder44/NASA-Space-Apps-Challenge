"""Authentication request and response schemas."""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """User credentials for authentication."""
    email: str = Field(..., example="crew@astrotrack.space")
    password: str = Field(..., example="SpaceOps2026!")


class RegisterRequest(BaseModel):
    """Crew member registration data."""
    email: str = Field(..., example="astronaut@astrotrack.space")
    password: str = Field(..., min_length=6, example="SpaceOps2026!")
    name: str = Field(..., example="Commander Sarah Walker")
    role: Optional[str] = Field(default="CDR-01", example="CDR-01")


class TokenResponse(BaseModel):
    """JWT bearer access token response."""
    access_token: str
    token_type: str = "bearer"
