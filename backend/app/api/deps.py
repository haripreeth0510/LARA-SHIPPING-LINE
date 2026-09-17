"""
FastAPI dependency injection functions.

Provides:
  - Database session
  - JWT user extraction
  - Role-based guards
  - Client profile resolver
"""
from collections.abc import Generator

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import verify_token
from app.middleware.error_handler import ForbiddenError, UnauthorizedError
from app.models.client import Client
from app.models.user import User, UserRole

# HTTPBearer scheme — expects "Authorization: Bearer <token>" header
security = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    """Yield a database session per request, auto-closing on completion."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Extract and return the authenticated user from the JWT.

    Works in both modes:
      - Supabase: uses 'sub' claim (auth_user_id) to find user
      - Local: uses 'sub' claim (user id string) to find user

    Raises:
        UnauthorizedError: If token is invalid or user not found / inactive.
    """
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise UnauthorizedError()

    sub = payload.get("sub")
    if sub is None:
        raise UnauthorizedError()

    # Try to find by auth_user_id first (Supabase mode), then by id (local mode)
    user = db.query(User).filter(User.auth_user_id == sub).first()
    if user is None:
        # Local dev mode: sub is the user's UUID string
        user = db.query(User).filter(User.id == sub).first()

    if user is None:
        raise UnauthorizedError(message="User not found")
    if not user.is_active:
        raise UnauthorizedError(message="User account is deactivated")

    return user


def require_role(*roles: str | UserRole):
    """Factory that returns a dependency checking user.role is in the given roles."""

    def _check(current_user: User = Depends(get_current_user)) -> User:
        role_values = {r.value if isinstance(r, UserRole) else r for r in roles}
        if current_user.role.value not in role_values:
            raise ForbiddenError(
                message=f"Requires one of: {', '.join(role_values)}",
                code="INSUFFICIENT_ROLE",
            )
        return current_user

    return _check


# Convenience role dependencies
require_admin = require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)
require_client = require_role(UserRole.CLIENT)
require_operations = require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS)
require_support = require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
require_finance = require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)


def get_current_client(
    current_user: User = Depends(require_client),
    db: Session = Depends(get_db),
) -> Client:
    """Return the Client record for the authenticated CLIENT user.

    Raises:
        UnauthorizedError: If no client profile exists for this user.
    """
    if current_user.client_id is None:
        raise UnauthorizedError(message="Client profile not linked")

    client = db.query(Client).filter(Client.id == current_user.client_id).first()
    if client is None:
        raise UnauthorizedError(message="Client profile not found")
    return client
