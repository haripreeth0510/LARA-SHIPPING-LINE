"""
Client shipments router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_client, get_db
from app.models.client import Client
from app.models.shipment import ShipmentStatus
from app.schemas.shipment import ShipmentListOut, ShipmentOut, ShipmentEventOut
from app.schemas.common import PaginatedResponse
from app.services.client_shipment_service import (
    get_client_shipments,
    get_client_shipment_by_id,
    get_client_shipment_events
)

router = APIRouter(prefix="/shipments", tags=["Client Shipments"])


@router.get("", response_model=PaginatedResponse)
def list_shipments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: ShipmentStatus | None = None,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """List client's shipments."""
    shipments, total = get_client_shipments(db, client, page, page_size, status)
    
    return {
        "success": True,
        "items": [ShipmentListOut.model_validate(s).model_dump(mode="json") for s in shipments],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.get("/{shipment_id}")
def get_shipment(
    shipment_id: UUID,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Get details for a specific shipment."""
    shipment = get_client_shipment_by_id(db, client, shipment_id)
    
    return {
        "success": True,
        "data": ShipmentOut.model_validate(shipment).model_dump(mode="json")
    }


@router.get("/{shipment_id}/tracking")
def get_shipment_tracking(
    shipment_id: UUID,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Get timeline events for a shipment."""
    events = get_client_shipment_events(db, client, shipment_id)
    
    return {
        "success": True,
        "data": [ShipmentEventOut.model_validate(e).model_dump(mode="json") for e in events]
    }
