"""
Client invoice service.
"""
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.invoice import Invoice, InvoiceStatus
from app.middleware.error_handler import NotFoundError


def get_client_invoices(
    db: Session, 
    client: Client, 
    page: int = 1, 
    page_size: int = 20, 
    status: InvoiceStatus | None = None
) -> tuple[list[Invoice], int]:
    """Get paginated list of invoices for a client."""
    query = db.query(Invoice).filter(Invoice.client_id == client.id)
    
    if status:
        query = query.filter(Invoice.status == status)
        
    total = query.count()
    
    invoices = (
        query
        .order_by(Invoice.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    
    return invoices, total


def get_client_invoice_by_id(db: Session, client: Client, invoice_id: UUID) -> Invoice:
    """Get a single invoice, ensuring it belongs to the client."""
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .filter(Invoice.client_id == client.id)
        .first()
    )
    
    if not invoice:
        raise NotFoundError(message="Invoice not found", code="INVOICE_NOT_FOUND")
        
    return invoice
