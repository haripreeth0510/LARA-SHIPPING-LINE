"""
Authentication service — login, register, user management.
"""
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.middleware.error_handler import BadRequestError, ConflictError, UnauthorizedError
from app.models.client import Client
from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest


def authenticate_user(db: Session, email: str, password: str) -> User:
    """Authenticate a user by email and password (local dev mode).

    Raises:
        UnauthorizedError: If credentials are invalid or user is inactive.
    """
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise UnauthorizedError(
            message="Invalid email or password",
            code="INVALID_CREDENTIALS",
        )

    if not user.password_hash or not verify_password(password, user.password_hash):
        raise UnauthorizedError(
            message="Invalid email or password",
            code="INVALID_CREDENTIALS",
        )

    if not user.is_active:
        raise UnauthorizedError(
            message="User account is deactivated",
            code="ACCOUNT_INACTIVE",
        )

    return user


def create_user_token(user: User) -> str:
    """Create a local JWT access token for the given user."""
    return create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role.value,
        }
    )


def register_user(db: Session, data: RegisterRequest) -> User:
    """Register a new user and optionally create a client profile.

    Raises:
        ConflictError: If email already exists.
        BadRequestError: If CLIENT role is missing company details.
    """
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise ConflictError(
            message="A user with this email already exists",
            code="EMAIL_EXISTS",
        )

    role = UserRole(data.role)
    if role == UserRole.CLIENT and not data.company_name:
        raise BadRequestError(
            message="Company name is required for client registration",
            code="MISSING_COMPANY_NAME",
        )

    # Create client first if CLIENT role
    client = None
    if role == UserRole.CLIENT:
        client = Client(
            company_name=data.company_name or data.full_name,
            contact_name=data.contact_name or data.full_name,
            email=data.email,
            phone=data.phone,
        )
        db.add(client)
        db.flush()

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
        phone=data.phone,
        role=role,
        is_active=True,
        client_id=client.id if client else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def change_password(
    db: Session,
    user: User,
    current_password: str,
    new_password: str,
) -> None:
    """Change a user's password (local dev mode).

    Raises:
        UnauthorizedError: If current password is wrong.
        BadRequestError: If new password is too short.
    """
    if not user.password_hash or not verify_password(current_password, user.password_hash):
        raise UnauthorizedError(
            message="Current password is incorrect",
            code="INVALID_CURRENT_PASSWORD",
        )

    if len(new_password) < 8:
        raise BadRequestError(
            message="New password must be at least 8 characters",
            code="PASSWORD_TOO_SHORT",
        )

    user.password_hash = hash_password(new_password)
    db.commit()
