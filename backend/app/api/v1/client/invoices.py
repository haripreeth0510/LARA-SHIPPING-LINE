"""
Client invoices router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_client, get_db
from app.models.client import Client
from app.models.invoice import InvoiceStatus
from app.schemas.invoice import InvoiceListOut, InvoiceOut
from app.schemas.common import PaginatedResponse
from app.services.client_invoice_service import (
    get_client_invoices,
    get_client_invoice_by_id
)

router = APIRouter(prefix="/invoices", tags=["Client Invoices"])


@router.get("", response_model=PaginatedResponse)
def list_invoices(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: InvoiceStatus | None = None,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """List client's invoices."""
    invoices, total = get_client_invoices(db, client, page, page_size, status)
    
    return {
        "success": True,
        "items": [InvoiceListOut.model_validate(i).model_dump(mode="json") for i in invoices],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.get("/{invoice_id}")
def get_invoice(
    invoice_id: UUID,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Get details for a specific invoice."""
    invoice = get_client_invoice_by_id(db, client, invoice_id)
    
    return {
        "success": True,
        "data": InvoiceOut.model_validate(invoice).model_dump(mode="json")
    }
