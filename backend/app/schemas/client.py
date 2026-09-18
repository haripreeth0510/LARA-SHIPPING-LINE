"""
Client schemas for API responses and requests.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class ClientCreate(BaseModel):
    """Data required to create a new client."""
    company_name: str
    contact_name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    country: str | None = None
    tax_id: str | None = None


class ClientUpdate(BaseModel):
    """Data to update an existing client."""
    company_name: str | None = None
    contact_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None
    country: str | None = None
    tax_id: str | None = None
    status: str | None = None


class ClientOut(BaseModel):
    """Detailed client data."""
    id: UUID
    company_name: str
    contact_name: str
    email: str
    phone: str | None = None
    address: str | None = None
    country: str | None = None
    tax_id: str | None = None
    status: str
    
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class ClientListOut(BaseModel):
    """Summary client data for list views."""
    id: UUID
    company_name: str
    contact_name: str
    email: str
    country: str | None = None
    status: str
    
    model_config = {"from_attributes": True}
