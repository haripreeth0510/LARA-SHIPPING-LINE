"""
Authentication router — login, register, me, change-password.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserInfo,
)
from app.services.auth_service import (
    authenticate_user,
    change_password,
    create_user_token,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT access token.

    In local dev mode, this issues a local JWT.
    In production, Supabase Auth handles login directly — this endpoint
    is kept for backwards compatibility and testing.
    """
    user = authenticate_user(db, data.email, data.password)
    token = create_user_token(user)

    return {
        "success": True,
        "message": "Login successful",
        "data": TokenResponse(
            access_token=token,
            user=UserInfo(
                id=user.id,
                full_name=user.full_name,
                email=user.email,
                role=user.role.value,
                client_id=user.client_id,
            ),
        ).model_dump(mode="json"),
    }


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user. Creates client profile for CLIENT role."""
    user = register_user(db, data)
    token = create_user_token(user)

    return {
        "success": True,
        "message": "Registration successful",
        "data": TokenResponse(
            access_token=token,
            user=UserInfo(
                id=user.id,
                full_name=user.full_name,
                email=user.email,
                role=user.role.value,
                client_id=user.client_id,
            ),
        ).model_dump(mode="json"),
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return {
        "success": True,
        "data": UserInfo(
            id=current_user.id,
            full_name=current_user.full_name,
            email=current_user.email,
            role=current_user.role.value,
            client_id=current_user.client_id,
        ).model_dump(mode="json"),
    }


@router.post("/change-password")
def change_user_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change the current user's password (local dev mode)."""
    change_password(db, current_user, data.current_password, data.new_password)
    return {"success": True, "message": "Password changed successfully"}


@router.post("/logout")
def logout():
    """Logout endpoint placeholder.

    In production, Supabase Auth handles session invalidation.
    The client should discard the token.
    """
    return {"success": True, "message": "Logged out successfully"}
