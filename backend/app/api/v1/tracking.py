"""
Public tracking router — no authentication required.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.middleware.error_handler import NotFoundError
from app.models.shipment import Shipment
from app.models.shipment_event import ShipmentEvent

router = APIRouter(prefix="/public", tags=["Public Tracking"])


@router.get("/tracking/{tracking_number}")
def track_shipment(tracking_number: str, db: Session = Depends(get_db)):
    """Public shipment tracking — no login required.

    Returns only safe information. Never exposes:
      - internal database IDs
      - client private information
      - invoices, private documents
      - admin information
    """
    shipment = (
        db.query(Shipment)
        .filter(Shipment.tracking_number == tracking_number)
        .first()
    )

    if shipment is None:
        raise NotFoundError(
            message=f"No shipment found with tracking number: {tracking_number}",
            code="SHIPMENT_NOT_FOUND",
        )

    # Fetch events ordered by time
    events = (
        db.query(ShipmentEvent)
        .filter(ShipmentEvent.shipment_id == shipment.id)
        .order_by(ShipmentEvent.event_time.asc())
        .all()
    )

    return {
        "success": True,
        "data": {
            "tracking_number": shipment.tracking_number,
            "status": shipment.status.value,
            "origin": shipment.origin,
            "destination": shipment.destination,
            "eta": shipment.estimated_arrival.isoformat() if shipment.estimated_arrival else None,
            "carrier": shipment.carrier,
            "vessel": shipment.vessel_name,
            "shipment_type": shipment.shipment_type.value,
            "events": [
                {
                    "status": e.status,
                    "title": e.title or e.status.replace("_", " ").title(),
                    "description": e.description,
                    "location": e.location,
                    "event_time": e.event_time.isoformat() if e.event_time else None,
                }
                for e in events
            ],
        },
    }
