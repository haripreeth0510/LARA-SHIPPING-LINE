"""
Admin quotes router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin, get_current_user
from app.models.user import User
from app.schemas.quote import QuoteUpdate, QuoteListOut, QuoteOut
from app.schemas.common import PaginatedResponse
from app.services.admin_quote_service import (
    get_all_quotes,
    get_quote_by_id,
    update_quote
)

router = APIRouter(
    prefix="/quotes", 
    tags=["Admin Quotes"],
    dependencies=[Depends(require_admin)]
)


@router.get("", response_model=PaginatedResponse)
def list_all_quotes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all quotes."""
    quotes, total = get_all_quotes(db, page, page_size)
    
    return {
        "success": True,
        "items": [QuoteListOut.model_validate(q).model_dump(mode="json") for q in quotes],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.get("/{quote_id}")
def get_quote(
    quote_id: UUID,
    db: Session = Depends(get_db),
):
    """Get details for a specific quote."""
    quote = get_quote_by_id(db, quote_id)
    
    return {
        "success": True,
        "data": QuoteOut.model_validate(quote).model_dump(mode="json")
    }


@router.patch("/{quote_id}")
def edit_quote(
    quote_id: UUID,
    data: QuoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update quote pricing and status."""
    quote = update_quote(db, current_user, quote_id, data)
    
    return {
        "success": True,
        "message": "Quote updated successfully",
        "data": QuoteOut.model_validate(quote).model_dump(mode="json")
    }
