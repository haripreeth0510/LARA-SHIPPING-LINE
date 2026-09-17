"""
Client support router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_client, get_db
from app.models.client import Client
from app.schemas.support import SupportTicketCreate, SupportTicketListOut, SupportTicketOut
from app.schemas.common import PaginatedResponse
from app.services.client_support_service import (
    get_client_tickets,
    get_client_ticket_by_id,
    create_ticket,
)

router = APIRouter(prefix="/support", tags=["Client Support"])


@router.post("")
def raise_ticket(
    data: SupportTicketCreate,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Create a new support ticket."""
    ticket = create_ticket(db, client, data)
    return {
        "success": True,
        "message": "Support ticket created successfully",
        "data": SupportTicketOut.model_validate(ticket).model_dump(mode="json")
    }


@router.get("", response_model=PaginatedResponse)
def list_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """List client's support tickets."""
    tickets, total = get_client_tickets(db, client, page, page_size)
    return {
        "success": True,
        "items": [SupportTicketListOut.model_validate(t).model_dump(mode="json") for t in tickets],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.get("/{ticket_id}")
def get_ticket(
    ticket_id: UUID,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Get details for a specific support ticket."""
    ticket = get_client_ticket_by_id(db, client, ticket_id)
    return {
        "success": True,
        "data": SupportTicketOut.model_validate(ticket).model_dump(mode="json")
    }
