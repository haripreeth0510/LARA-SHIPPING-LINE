"""
User schemas for API responses.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    """User data returned by the API. Never includes password_hash."""
    id: UUID
    email: str
    full_name: str
    phone: str | None = None
    role: str
    is_active: bool
    client_id: UUID | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
