"""
Public shipment tracking service.
"""
from sqlalchemy.orm import Session

from app.models.shipment import Shipment
from app.middleware.error_handler import NotFoundError


def get_public_shipment_by_tracking_number(db: Session, tracking_number: str) -> Shipment:
    """Get a shipment by tracking number for public viewing.
    
    This does NOT check ownership and relies on the tracking number being a secure identifier.
    The returned schema must not include sensitive client/financial info.
    """
    shipment = (
        db.query(Shipment)
        .filter(Shipment.tracking_number == tracking_number)
        .first()
    )
    
    if not shipment:
        raise NotFoundError(message="Shipment not found", code="SHIPMENT_NOT_FOUND")
        
    return shipment
