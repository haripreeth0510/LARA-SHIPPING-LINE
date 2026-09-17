"""
Security utilities: JWT verification, password hashing, and token creation.

Supports two modes:
  - Supabase mode: Verifies Supabase-issued JWTs (production)
  - Local mode: Issues and verifies local JWTs (development)
"""
from datetime import datetime, timedelta, timezone

import jwt
from passlib.context import CryptContext

from app.core.config import get_settings

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Password Hashing ────────────────────────────────────────────


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ── JWT Token Operations ────────────────────────────────────────


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a local JWT access token (development mode).

    Args:
        data: Payload to encode (should include 'sub' for user_id).
        expires_delta: Optional custom expiration.

    Returns:
        Encoded JWT string.
    """
    settings = get_settings()
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.LOCAL_JWT_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})

    return jwt.encode(
        to_encode,
        settings.LOCAL_JWT_SECRET,
        algorithm=settings.jwt_algorithm,
    )


def verify_token(token: str) -> dict | None:
    """Verify and decode a JWT token.

    Works in both modes:
      - Supabase: verifies with SUPABASE_JWT_SECRET, audience="authenticated"
      - Local: verifies with LOCAL_JWT_SECRET

    Returns:
        Decoded payload dict, or None if invalid/expired.
    """
    settings = get_settings()

    try:
        decode_kwargs: dict = {
            "algorithms": [settings.jwt_algorithm],
        }

        # Supabase tokens use audience="authenticated"
        if settings.is_supabase_configured:
            decode_kwargs["audience"] = "authenticated"

        payload = jwt.decode(
            token,
            settings.jwt_secret,
            **decode_kwargs,
        )
        return payload
    except jwt.PyJWTError:
        return None
