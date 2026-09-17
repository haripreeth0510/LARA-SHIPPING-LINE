"""
Client support service.
"""
from uuid import UUID
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.support_ticket import SupportTicket, TicketStatus
from app.schemas.support import SupportTicketCreate
from app.middleware.error_handler import NotFoundError


def get_client_tickets(db: Session, client: Client, page: int = 1, page_size: int = 20) -> tuple[list[SupportTicket], int]:
    """Get paginated list of support tickets for a client."""
    query = db.query(SupportTicket).filter(SupportTicket.client_id == client.id)
    total = query.count()
    tickets = (
        query
        .order_by(SupportTicket.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return tickets, total


def get_client_ticket_by_id(db: Session, client: Client, ticket_id: UUID) -> SupportTicket:
    """Get a single ticket, ensuring it belongs to the client."""
    ticket = (
        db.query(SupportTicket)
        .filter(SupportTicket.id == ticket_id)
        .filter(SupportTicket.client_id == client.id)
        .first()
    )
    if not ticket:
        raise NotFoundError(message="Support ticket not found", code="TICKET_NOT_FOUND")
    return ticket


def _generate_ticket_number(db: Session) -> str:
    """Generate a unique ticket number (TKT-YYYY-XXXX)."""
    year = datetime.now(timezone.utc).year
    count = db.query(SupportTicket).count()
    return f"TKT-{year}-{count + 1:04d}"


def create_ticket(db: Session, client: Client, data: SupportTicketCreate) -> SupportTicket:
    """Create a new support ticket."""
    ticket_num = _generate_ticket_number(db)
    
    ticket = SupportTicket(
        ticket_number=ticket_num,
        client_id=client.id,
        subject=data.subject,
        description=data.description,
        priority=data.priority,
        status=TicketStatus.OPEN,
    )
    
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket
