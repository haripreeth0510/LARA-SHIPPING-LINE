"""
Client quotes router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_client, get_current_user, get_db
from app.models.client import Client
from app.models.user import User
from app.schemas.quote import QuoteCreate, QuoteListOut, QuoteOut
from app.schemas.common import PaginatedResponse
from app.services.client_quote_service import (
    get_client_quotes,
    get_client_quote_by_id,
    request_quote,
    accept_quote,
    reject_quote,
)

router = APIRouter(prefix="/quotes", tags=["Client Quotes"])


@router.post("")
def create_quote(
    data: QuoteCreate,
    current_user: User = Depends(get_current_user),
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Request a new shipping quote."""
    quote = request_quote(db, client, current_user, data)
    return {
        "success": True,
        "message": "Quote requested successfully",
        "data": QuoteOut.model_validate(quote).model_dump(mode="json")
    }


@router.get("", response_model=PaginatedResponse)
def list_quotes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """List client's quotes."""
    quotes, total = get_client_quotes(db, client, page, page_size)
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
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Get details for a specific quote."""
    quote = get_client_quote_by_id(db, client, quote_id)
    return {
        "success": True,
        "data": QuoteOut.model_validate(quote).model_dump(mode="json")
    }


@router.post("/{quote_id}/accept")
def accept_client_quote(
    quote_id: UUID,
    current_user: User = Depends(get_current_user),
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Accept a quote."""
    quote = accept_quote(db, client, current_user, quote_id)
    return {
        "success": True,
        "message": "Quote accepted successfully",
        "data": QuoteOut.model_validate(quote).model_dump(mode="json")
    }


@router.post("/{quote_id}/reject")
def reject_client_quote(
    quote_id: UUID,
    current_user: User = Depends(get_current_user),
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Reject a quote."""
    quote = reject_quote(db, client, current_user, quote_id)
    return {
        "success": True,
        "message": "Quote rejected successfully",
        "data": QuoteOut.model_validate(quote).model_dump(mode="json")
    }
