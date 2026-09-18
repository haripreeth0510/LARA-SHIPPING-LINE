"""
Document schemas for API responses.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class DocumentOut(BaseModel):
    """Document metadata."""
    id: UUID
    shipment_id: UUID
    document_type: str
    file_name: str
    mime_type: str | None = None
    file_size: int | None = None
    created_at: datetime
    
    # We do not expose storage_path directly; the API will provide a signed URL in Phase 4+
    
    model_config = {"from_attributes": True}


class DocumentCreate(BaseModel):
    """Data required to register a new document."""
    shipment_id: UUID
    client_id: UUID
    document_type: str
    file_name: str
    mime_type: str | None = None
    file_size: int | None = None
    storage_path: str
