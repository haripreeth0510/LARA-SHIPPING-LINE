"""
Authentication request/response schemas.
"""
from uuid import UUID

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Login credentials (local dev mode)."""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """New user registration data."""
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    role: str = "CLIENT"
    # Client-specific fields (required when role=CLIENT)
    company_name: str | None = None
    contact_name: str | None = None


class ChangePasswordRequest(BaseModel):
    """Password change request."""
    current_password: str
    new_password: str


class UserInfo(BaseModel):
    """Minimal user info embedded in token response."""
    id: UUID
    full_name: str
    email: str
    role: str
    client_id: UUID | None = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """JWT token response after login."""
    access_token: str
    token_type: str = "bearer"
    user: UserInfo
