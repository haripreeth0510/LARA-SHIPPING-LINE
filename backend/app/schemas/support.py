"""
Support schemas for API responses and requests.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SupportTicketCreate(BaseModel):
    """Data required to create a new support ticket."""
    subject: str
    description: str
    priority: str | None = "MEDIUM"


class SupportTicketOut(BaseModel):
    """Detailed support ticket data."""
    id: UUID
    ticket_number: str
    subject: str
    description: str
    priority: str
    status: str
    
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class SupportTicketListOut(BaseModel):
    """Summary support ticket data for list views."""
    id: UUID
    ticket_number: str
    subject: str
    priority: str
    status: str
    created_at: datetime
    
    model_config = {"from_attributes": True}
