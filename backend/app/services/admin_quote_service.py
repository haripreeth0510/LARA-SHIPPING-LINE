"""
Admin quote service.
"""
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.quote import Quote, QuoteStatus
from app.models.audit_log import AuditLog
from app.schemas.quote import QuoteUpdate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_all_quotes(db: Session, page: int = 1, page_size: int = 20) -> tuple[list[Quote], int]:
    """Get paginated list of all quotes."""
    query = db.query(Quote)
    total = query.count()
    quotes = (
        query
        .order_by(Quote.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return quotes, total


def get_quote_by_id(db: Session, quote_id: UUID) -> Quote:
    """Get a single quote."""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise NotFoundError(message="Quote not found", code="QUOTE_NOT_FOUND")
    return quote


def update_quote(db: Session, user: User, quote_id: UUID, data: QuoteUpdate) -> Quote:
    """Update a quote (pricing, status)."""
    quote = get_quote_by_id(db, quote_id)
    
    update_data = data.model_dump(exclude_unset=True)
    
    if "status" in update_data:
        try:
            update_data["status"] = QuoteStatus(update_data["status"])
        except ValueError:
            raise BadRequestError(message=f"Invalid status: {update_data['status']}", code="INVALID_STATUS")
            
    old_data = {k: getattr(quote, k) for k in update_data.keys()}
    
    for key, value in update_data.items():
        setattr(quote, key, value)
        
    db.add(AuditLog(
        actor_user_id=user.id,
        action="UPDATE_QUOTE",
        entity_type="QUOTE",
        entity_id=quote.id,
        old_data={k: str(v) if v is not None else None for k, v in old_data.items()},
        new_data={k: str(v) if v is not None else None for k, v in update_data.items()}
    ))
        
    db.commit()
    db.refresh(quote)
    return quote
