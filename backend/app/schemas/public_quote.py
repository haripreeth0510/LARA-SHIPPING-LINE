"""
Public quote schemas.
"""
from pydantic import BaseModel, EmailStr


class PublicQuoteRequest(BaseModel):
    """Data submitted by an unauthenticated visitor to request a quote."""
    # Contact Info
    company_name: str
    contact_name: str
    email: EmailStr
    phone: str | None = None
    
    # Cargo Details
    origin: str
    destination: str
    cargo_details: str
    weight: float | None = None
    volume: float | None = None
    shipping_method: str | None = None
