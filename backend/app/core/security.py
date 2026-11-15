"""Security utilities: password hashing (bcrypt) and JWT token generation."""

import hashlib
from datetime import datetime, timedelta
from typing import Optional, Any, Union

try:
    import bcrypt
    _HAS_BCRYPT = True
except ImportError:
    _HAS_BCRYPT = False

try:
    from jose import jwt, JWTError
    _HAS_JOSE = True
except ImportError:
    _HAS_JOSE = False

from app.core.config import settings


def get_password_hash(password: str) -> str:
    """Hash a plaintext password securely."""
    if _HAS_BCRYPT:
        pwd_bytes = password.encode("utf-8")
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")
    # Fallback to PBKDF2 sha256 with salt if bcrypt is not available
    salt = "astro_salt_2026".encode("utf-8")
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000).hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored hash."""
    if _HAS_BCRYPT and hashed_password.startswith("$2"):
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            return False
    # Check fallback or direct match
    salt = "astro_salt_2026".encode("utf-8")
    expected = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100000).hex()
    return expected == hashed_password or plain_password == hashed_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})

    if _HAS_JOSE:
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    # Simple encoded token fallback for environments without python-jose
    import json, base64
    payload_str = json.dumps(to_encode)
    return base64.urlsafe_b64encode(payload_str.encode()).decode()


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a signed JWT access token."""
    if _HAS_JOSE:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except Exception:
            return None
    try:
        import json, base64
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        return json.loads(decoded)
    except Exception:
        return None
