"""
Quote schemas for API responses and requests.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class QuoteCreate(BaseModel):
    """Data required to request a new quote."""
    origin: str
    destination: str
    cargo_details: str | None = None
    shipping_method: str | None = None
    currency: str = Field(default="USD")


class QuoteOut(BaseModel):
    """Detailed quote data."""
    id: UUID
    quote_number: str
    origin: str
    destination: str
    cargo_details: str | None = None
    shipping_method: str | None = None
    estimated_transit_time: str | None = None
    
    base_amount: float | None = None
    tax_amount: float | None = None
    total_amount: float | None = None
    currency: str
    
    status: str
    valid_until: datetime | None = None
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class QuoteListOut(BaseModel):
    """Summary quote data for list views."""
    id: UUID
    quote_number: str
    origin: str
    destination: str
    total_amount: float | None = None
    currency: str
    status: str
    created_at: datetime
    
    model_config = {"from_attributes": True}


class QuoteUpdate(BaseModel):
    """Data to update an existing quote (Admin only)."""
    base_amount: float | None = None
    tax_amount: float | None = None
    total_amount: float | None = None
    currency: str | None = None
    valid_until: datetime | None = None
    status: str | None = None
