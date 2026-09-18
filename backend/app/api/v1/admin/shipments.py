"""
Admin shipments router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin, get_current_user
from app.models.user import User
from app.models.shipment import ShipmentStatus
from app.schemas.shipment import (
    ShipmentCreate, 
    ShipmentUpdate, 
    ShipmentEventCreate, 
    ShipmentListOut, 
    ShipmentOut, 
    ShipmentEventOut
)
from app.schemas.common import PaginatedResponse
from app.services.admin_shipment_service import (
    get_all_shipments,
    get_shipment_by_id,
    create_shipment,
    update_shipment,
    add_shipment_event
)

router = APIRouter(
    prefix="/shipments", 
    tags=["Admin Shipments"],
    dependencies=[Depends(require_admin)]
)


@router.get("", response_model=PaginatedResponse)
def list_all_shipments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: ShipmentStatus | None = None,
    db: Session = Depends(get_db),
):
    """List all shipments."""
    shipments, total = get_all_shipments(db, page, page_size, status)
    
    return {
        "success": True,
        "items": [ShipmentListOut.model_validate(s).model_dump(mode="json") for s in shipments],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.post("")
def add_new_shipment(
    data: ShipmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new shipment for a client."""
    shipment = create_shipment(db, current_user, data)
    
    return {
        "success": True,
        "message": "Shipment created successfully",
        "data": ShipmentOut.model_validate(shipment).model_dump(mode="json")
    }


@router.get("/{shipment_id}")
def get_shipment(
    shipment_id: UUID,
    db: Session = Depends(get_db),
):
    """Get details for a specific shipment."""
    shipment = get_shipment_by_id(db, shipment_id)
    
    return {
        "success": True,
        "data": ShipmentOut.model_validate(shipment).model_dump(mode="json")
    }


@router.patch("/{shipment_id}")
def edit_shipment(
    shipment_id: UUID,
    data: ShipmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update shipment details."""
    shipment = update_shipment(db, current_user, shipment_id, data)
    
    return {
        "success": True,
        "message": "Shipment updated successfully",
        "data": ShipmentOut.model_validate(shipment).model_dump(mode="json")
    }


@router.post("/{shipment_id}/events")
def add_tracking_event(
    shipment_id: UUID,
    data: ShipmentEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new tracking event and update the shipment status."""
    event = add_shipment_event(db, current_user, shipment_id, data)
    
    return {
        "success": True,
        "message": "Tracking event added successfully",
        "data": ShipmentEventOut.model_validate(event).model_dump(mode="json")
    }
