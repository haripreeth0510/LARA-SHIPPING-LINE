"""
Admin invoices router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin, get_current_user
from app.models.user import User
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceListOut, InvoiceOut
from app.schemas.common import PaginatedResponse
from app.services.admin_invoice_service import (
    get_all_invoices,
    get_invoice_by_id,
    create_invoice,
    update_invoice
)

router = APIRouter(
    prefix="/invoices", 
    tags=["Admin Invoices"],
    dependencies=[Depends(require_admin)]
)


@router.get("", response_model=PaginatedResponse)
def list_all_invoices(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all invoices."""
    invoices, total = get_all_invoices(db, page, page_size)
    
    return {
        "success": True,
        "items": [InvoiceListOut.model_validate(i).model_dump(mode="json") for i in invoices],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.post("")
def add_invoice(
    data: InvoiceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new invoice."""
    invoice = create_invoice(db, current_user, data)
    
    return {
        "success": True,
        "message": "Invoice created successfully",
        "data": InvoiceOut.model_validate(invoice).model_dump(mode="json")
    }


@router.get("/{invoice_id}")
def get_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
):
    """Get details for a specific invoice."""
    invoice = get_invoice_by_id(db, invoice_id)
    
    return {
        "success": True,
        "data": InvoiceOut.model_validate(invoice).model_dump(mode="json")
    }


@router.patch("/{invoice_id}")
def edit_invoice(
    invoice_id: UUID,
    data: InvoiceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update invoice status (e.g. mark as PAID)."""
    invoice = update_invoice(db, current_user, invoice_id, data)
    
    return {
        "success": True,
        "message": "Invoice updated successfully",
        "data": InvoiceOut.model_validate(invoice).model_dump(mode="json")
    }
