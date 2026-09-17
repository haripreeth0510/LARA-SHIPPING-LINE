"""
Client quote service.
"""
from uuid import UUID
from datetime import datetime, timezone

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.client import Client
from app.models.user import User
from app.models.quote import Quote, QuoteStatus
from app.models.audit_log import AuditLog
from app.schemas.quote import QuoteCreate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_client_quotes(db: Session, client: Client, page: int = 1, page_size: int = 20) -> tuple[list[Quote], int]:
    """Get paginated list of quotes for a client."""
    query = db.query(Quote).filter(Quote.client_id == client.id)
    total = query.count()
    quotes = (
        query
        .order_by(Quote.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return quotes, total


def get_client_quote_by_id(db: Session, client: Client, quote_id: UUID) -> Quote:
    """Get a single quote, ensuring it belongs to the client."""
    quote = (
        db.query(Quote)
        .filter(Quote.id == quote_id)
        .filter(Quote.client_id == client.id)
        .first()
    )
    if not quote:
        raise NotFoundError(message="Quote not found", code="QUOTE_NOT_FOUND")
    return quote


def _generate_quote_number(db: Session) -> str:
    """Generate a unique quote number (QT-YYYY-XXXX)."""
    year = datetime.now(timezone.utc).year
    # Simple generation logic — in production this might use a sequence
    count = db.query(Quote).count()
    return f"QT-{year}-{count + 1:04d}"


def request_quote(db: Session, client: Client, user: User, data: QuoteCreate) -> Quote:
    """Create a new quote request in DRAFT status."""
    quote_num = _generate_quote_number(db)
    
    quote = Quote(
        quote_number=quote_num,
        client_id=client.id,
        origin=data.origin,
        destination=data.destination,
        cargo_details=data.cargo_details,
        shipping_method=data.shipping_method,
        currency=data.currency,
        status=QuoteStatus.DRAFT,
    )
    db.add(quote)
    db.flush()
    
    # Audit log
    db.add(AuditLog(
        actor_user_id=user.id,
        action="REQUEST_QUOTE",
        entity_type="QUOTE",
        entity_id=quote.id,
        new_data={"quote_number": quote_num}
    ))
    
    db.commit()
    db.refresh(quote)
    return quote


def accept_quote(db: Session, client: Client, user: User, quote_id: UUID) -> Quote:
    """Accept a quote."""
    quote = get_client_quote_by_id(db, client, quote_id)
    
    if quote.status != QuoteStatus.SENT:
        raise BadRequestError(
            message=f"Only SENT quotes can be accepted. Current status: {quote.status.value}",
            code="INVALID_QUOTE_STATUS"
        )
        
    if quote.valid_until and quote.valid_until < datetime.now(timezone.utc):
        quote.status = QuoteStatus.EXPIRED
        db.commit()
        raise BadRequestError(message="Quote has expired", code="QUOTE_EXPIRED")
        
    old_status = quote.status.value
    quote.status = QuoteStatus.ACCEPTED
    
    db.add(AuditLog(
        actor_user_id=user.id,
        action="ACCEPT_QUOTE",
        entity_type="QUOTE",
        entity_id=quote.id,
        old_data={"status": old_status},
        new_data={"status": quote.status.value}
    ))
    
    db.commit()
    db.refresh(quote)
    return quote


def reject_quote(db: Session, client: Client, user: User, quote_id: UUID) -> Quote:
    """Reject a quote."""
    quote = get_client_quote_by_id(db, client, quote_id)
    
    if quote.status != QuoteStatus.SENT:
        raise BadRequestError(
            message=f"Only SENT quotes can be rejected. Current status: {quote.status.value}",
            code="INVALID_QUOTE_STATUS"
        )
        
    old_status = quote.status.value
    quote.status = QuoteStatus.REJECTED
    
    db.add(AuditLog(
        actor_user_id=user.id,
        action="REJECT_QUOTE",
        entity_type="QUOTE",
        entity_id=quote.id,
        old_data={"status": old_status},
        new_data={"status": quote.status.value}
    ))
    
    db.commit()
    db.refresh(quote)
    return quote
