"""
Public quotes router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.public_quote import PublicQuoteRequest
from app.services.public_quote_service import request_public_quote

# Unauthenticated router
router = APIRouter(
    prefix="/quotes", 
    tags=["Public Quotes"]
)


@router.post("/request")
def submit_quote_request(
    data: PublicQuoteRequest,
    db: Session = Depends(get_db),
):
    """
    Submit a quote request from the public website.
    """
    quote = request_public_quote(db, data)
    
    return {
        "success": True,
        "message": "Quote request submitted successfully.",
        # Do not return full quote data publicly to prevent information leakage
        "data": {
            "quote_id": quote.id,
            "status": quote.status.value
        }
    }
