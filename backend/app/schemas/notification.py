"""
Notification schemas for API responses.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class NotificationOut(BaseModel):
    """Notification data."""
    id: UUID
    type: str
    title: str
    message: str
    is_read: bool
    link_entity_id: UUID | None = None
    created_at: datetime
    
    model_config = {"from_attributes": True}
