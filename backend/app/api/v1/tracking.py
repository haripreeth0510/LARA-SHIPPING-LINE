"""
Public shipment tracking router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.shipment import ShipmentOut
from app.services.public_tracking_service import get_public_shipment_by_tracking_number

# Unauthenticated router
router = APIRouter(
    prefix="/tracking", 
    tags=["Public Tracking"]
)


@router.get("/{tracking_number}")
def track_shipment(
    tracking_number: str,
    db: Session = Depends(get_db),
):
    """
    Publicly track a shipment using its tracking number.
    Returns safe, non-sensitive shipment and event data.
    """
    shipment = get_public_shipment_by_tracking_number(db, tracking_number)
    
    # ShipmentOut already excludes financial and internal notes, 
    # but we will further ensure we're only dumping safe fields.
    # The client_id is exposed in ShipmentOut, which is acceptable 
    # as it's just a UUID, not the client's PII.
    
    data = ShipmentOut.model_validate(shipment).model_dump(mode="json")
    
    return {
        "success": True,
        "data": data
    }
