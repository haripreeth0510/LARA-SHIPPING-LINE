"""
Invoice schemas for API responses.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class InvoiceOut(BaseModel):
    """Detailed invoice data."""
    id: UUID
    invoice_number: str
    shipment_id: UUID | None = None
    
    amount: float
    tax: float
    total: float
    currency: str
    
    issue_date: datetime | None = None
    due_date: datetime | None = None
    status: str
    payment_reference: str | None = None
    
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class InvoiceListOut(BaseModel):
    """Summary invoice data for list views."""
    id: UUID
    invoice_number: str
    shipment_id: UUID | None = None
    total: float
    currency: str
    due_date: datetime | None = None
    status: str
    
    model_config = {"from_attributes": True}
