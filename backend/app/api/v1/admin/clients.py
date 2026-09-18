"""
Admin clients router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin
from app.schemas.client import ClientCreate, ClientUpdate, ClientListOut, ClientOut
from app.schemas.common import PaginatedResponse
from app.services.admin_client_service import (
    get_all_clients,
    get_client_by_id,
    create_client,
    update_client
)

router = APIRouter(
    prefix="/clients", 
    tags=["Admin Clients"],
    dependencies=[Depends(require_admin)]
)


@router.get("", response_model=PaginatedResponse)
def list_clients(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all clients."""
    clients, total = get_all_clients(db, page, page_size)
    
    return {
        "success": True,
        "items": [ClientListOut.model_validate(c).model_dump(mode="json") for c in clients],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.post("")
def register_client(
    data: ClientCreate,
    db: Session = Depends(get_db),
):
    """Create a new client profile."""
    client = create_client(db, data)
    
    return {
        "success": True,
        "message": "Client created successfully",
        "data": ClientOut.model_validate(client).model_dump(mode="json")
    }


@router.get("/{client_id}")
def get_client(
    client_id: UUID,
    db: Session = Depends(get_db),
):
    """Get details for a specific client."""
    client = get_client_by_id(db, client_id)
    
    return {
        "success": True,
        "data": ClientOut.model_validate(client).model_dump(mode="json")
    }


@router.patch("/{client_id}")
def update_client_profile(
    client_id: UUID,
    data: ClientUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing client profile."""
    client = update_client(db, client_id, data)
    
    return {
        "success": True,
        "message": "Client updated successfully",
        "data": ClientOut.model_validate(client).model_dump(mode="json")
    }
