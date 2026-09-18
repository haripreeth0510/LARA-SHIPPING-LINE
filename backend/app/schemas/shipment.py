"""
Shipment schemas for API responses.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ShipmentEventOut(BaseModel):
    """Event timeline entry."""
    id: UUID
    status: str
    title: str | None = None
    description: str | None = None
    location: str | None = None
    event_time: datetime
    
    model_config = {"from_attributes": True}


class ShipmentOut(BaseModel):
    """Detailed shipment data."""
    id: UUID
    tracking_number: str
    reference_number: str | None = None
    shipment_type: str
    origin: str
    destination: str
    origin_port: str | None = None
    destination_port: str | None = None
    carrier: str | None = None
    vessel_name: str | None = None
    voyage_number: str | None = None
    container_number: str | None = None
    container_type: str | None = None
    cargo_description: str | None = None
    weight: float | None = None
    volume: float | None = None
    
    booking_date: datetime | None = None
    estimated_departure: datetime | None = None
    actual_departure: datetime | None = None
    estimated_arrival: datetime | None = None
    actual_arrival: datetime | None = None
    
    status: str
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class ShipmentListOut(BaseModel):
    """Summary shipment data for list views."""
    id: UUID
    tracking_number: str
    reference_number: str | None = None
    shipment_type: str
    origin: str
    destination: str
    estimated_arrival: datetime | None = None
    status: str
    
    model_config = {"from_attributes": True}


class ShipmentCreate(BaseModel):
    """Data required to create a new shipment."""
    client_id: UUID
    reference_number: str | None = None
    shipment_type: str
    origin: str
    destination: str
    origin_port: str | None = None
    destination_port: str | None = None
    carrier: str | None = None
    vessel_name: str | None = None
    voyage_number: str | None = None
    container_number: str | None = None
    container_type: str | None = None
    cargo_description: str | None = None
    weight: float | None = None
    volume: float | None = None
    
    booking_date: datetime | None = None
    estimated_departure: datetime | None = None
    estimated_arrival: datetime | None = None


class ShipmentUpdate(BaseModel):
    """Data to update an existing shipment."""
    reference_number: str | None = None
    origin_port: str | None = None
    destination_port: str | None = None
    carrier: str | None = None
    vessel_name: str | None = None
    voyage_number: str | None = None
    container_number: str | None = None
    container_type: str | None = None
    weight: float | None = None
    volume: float | None = None
    
    estimated_departure: datetime | None = None
    actual_departure: datetime | None = None
    estimated_arrival: datetime | None = None
    actual_arrival: datetime | None = None


class ShipmentEventCreate(BaseModel):
    """Data to create a new shipment tracking event."""
    status: str
    title: str | None = None
    description: str | None = None
    location: str | None = None
    event_time: datetime | None = None
