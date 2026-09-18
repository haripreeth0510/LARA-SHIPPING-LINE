"""
Admin support service.
"""
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.support_ticket import SupportTicket, TicketStatus
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.schemas.support import SupportTicketUpdate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_all_tickets(db: Session, page: int = 1, page_size: int = 20) -> tuple[list[SupportTicket], int]:
    """Get paginated list of all support tickets."""
    query = db.query(SupportTicket)
    total = query.count()
    tickets = (
        query
        .order_by(SupportTicket.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return tickets, total


def get_ticket_by_id(db: Session, ticket_id: UUID) -> SupportTicket:
    """Get a single support ticket."""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise NotFoundError(message="Support ticket not found", code="TICKET_NOT_FOUND")
    return ticket


def update_ticket(db: Session, user: User, ticket_id: UUID, data: SupportTicketUpdate) -> SupportTicket:
    """Update a support ticket (status, assignment)."""
    ticket = get_ticket_by_id(db, ticket_id)
    
    update_data = data.model_dump(exclude_unset=True)
    
    if "status" in update_data:
        try:
            update_data["status"] = TicketStatus(update_data["status"])
        except ValueError:
            raise BadRequestError(message=f"Invalid status: {update_data['status']}", code="INVALID_STATUS")
            
    old_data = {k: getattr(ticket, k) for k in update_data.keys()}
    
    for key, value in update_data.items():
        setattr(ticket, key, value)
        
    db.add(AuditLog(
        actor_user_id=user.id,
        action="UPDATE_TICKET",
        entity_type="TICKET",
        entity_id=ticket.id,
        old_data={k: str(v) if v is not None else None for k, v in old_data.items()},
        new_data={k: str(v) if v is not None else None for k, v in update_data.items()}
    ))
    
    if "status" in update_data and update_data["status"] != old_data.get("status"):
        # Notify client
        client_users = db.query(User).filter(User.client_id == ticket.client_id).all()
        for c_user in client_users:
            db.add(Notification(
                user_id=c_user.id,
                type="TICKET_STATUS",
                title=f"Ticket Update: {ticket.ticket_number}",
                message=f"Your support ticket is now {update_data['status'].value.replace('_', ' ')}.",
                reference_id=ticket.id,
                reference_type="SUPPORT_TICKET"
            ))
    
    db.commit()
    db.refresh(ticket)
    return ticket
