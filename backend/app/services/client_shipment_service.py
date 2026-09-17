"""
Client shipment service.
"""
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.shipment import Shipment, ShipmentStatus
from app.models.shipment_event import ShipmentEvent
from app.middleware.error_handler import NotFoundError


def get_client_shipments(
    db: Session, 
    client: Client, 
    page: int = 1, 
    page_size: int = 20, 
    status: ShipmentStatus | None = None
) -> tuple[list[Shipment], int]:
    """Get paginated list of shipments for a client."""
    
    query = db.query(Shipment).filter(Shipment.client_id == client.id)
    
    if status:
        query = query.filter(Shipment.status == status)
        
    total = query.count()
    
    shipments = (
        query
        .order_by(Shipment.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    
    return shipments, total


def get_client_shipment_by_id(db: Session, client: Client, shipment_id: UUID) -> Shipment:
    """Get a single shipment, ensuring it belongs to the client."""
    
    shipment = (
        db.query(Shipment)
        .filter(Shipment.id == shipment_id)
        .filter(Shipment.client_id == client.id)
        .first()
    )
    
    if not shipment:
        raise NotFoundError(message="Shipment not found", code="SHIPMENT_NOT_FOUND")
        
    return shipment


def get_client_shipment_events(db: Session, client: Client, shipment_id: UUID) -> list[ShipmentEvent]:
    """Get timeline events for a shipment, ensuring it belongs to the client."""
    
    # First ensure the shipment belongs to the client
    shipment = get_client_shipment_by_id(db, client, shipment_id)
    
    events = (
        db.query(ShipmentEvent)
        .filter(ShipmentEvent.shipment_id == shipment.id)
        .order_by(ShipmentEvent.event_time.asc())
        .all()
    )
    
    return events
