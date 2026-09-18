"""
Admin support router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin, get_current_user
from app.models.user import User
from app.schemas.support import SupportTicketUpdate, SupportTicketListOut, SupportTicketOut
from app.schemas.common import PaginatedResponse
from app.services.admin_support_service import (
    get_all_tickets,
    get_ticket_by_id,
    update_ticket
)

router = APIRouter(
    prefix="/support", 
    tags=["Admin Support"],
    dependencies=[Depends(require_admin)]
)


@router.get("", response_model=PaginatedResponse)
def list_all_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all support tickets."""
    tickets, total = get_all_tickets(db, page, page_size)
    
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
    db: Session = Depends(get_db),
):
    """Get details for a specific support ticket."""
    ticket = get_ticket_by_id(db, ticket_id)
    
    return {
        "success": True,
        "data": SupportTicketOut.model_validate(ticket).model_dump(mode="json")
    }


@router.patch("/{ticket_id}")
def edit_ticket(
    ticket_id: UUID,
    data: SupportTicketUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a support ticket."""
    ticket = update_ticket(db, current_user, ticket_id, data)
    
    return {
        "success": True,
        "message": "Ticket updated successfully",
        "data": SupportTicketOut.model_validate(ticket).model_dump(mode="json")
    }
