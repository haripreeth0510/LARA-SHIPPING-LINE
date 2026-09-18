"""
Admin invoice service.
"""
from uuid import UUID
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.invoice import Invoice, InvoiceStatus
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_all_invoices(db: Session, page: int = 1, page_size: int = 20) -> tuple[list[Invoice], int]:
    """Get paginated list of all invoices."""
    query = db.query(Invoice)
    total = query.count()
    invoices = (
        query
        .order_by(Invoice.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return invoices, total


def get_invoice_by_id(db: Session, invoice_id: UUID) -> Invoice:
    """Get a single invoice."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise NotFoundError(message="Invoice not found", code="INVOICE_NOT_FOUND")
    return invoice


def _generate_invoice_number(db: Session) -> str:
    """Generate a unique invoice number (INV-YYYY-XXXX)."""
    year = datetime.now(timezone.utc).year
    count = db.query(Invoice).count()
    return f"INV-{year}-{count + 1:04d}"


def create_invoice(db: Session, user: User, data: InvoiceCreate) -> Invoice:
    """Create a new invoice."""
    
    invoice_num = _generate_invoice_number(db)
    
    invoice = Invoice(
        invoice_number=invoice_num,
        client_id=data.client_id,
        shipment_id=data.shipment_id,
        amount=data.amount,
        tax=data.tax,
        total=data.total,
        currency=data.currency,
        issue_date=data.issue_date or datetime.now(timezone.utc),
        due_date=data.due_date,
        status=InvoiceStatus.ISSUED,
    )
    
    db.add(invoice)
    db.flush()
    
    db.add(AuditLog(
        actor_user_id=user.id,
        action="CREATE_INVOICE",
        entity_type="INVOICE",
        entity_id=invoice.id,
        new_data={"invoice_number": invoice_num, "total": data.total}
    ))
    
    # Notify client
    client_users = db.query(User).filter(User.client_id == data.client_id).all()
    for c_user in client_users:
        db.add(Notification(
            user_id=c_user.id,
            type="INVOICE",
            title=f"New Invoice: {invoice_num}",
            message=f"A new invoice has been issued for {data.currency} {data.total}.",
            reference_id=invoice.id,
            reference_type="INVOICE"
        ))
    
    db.commit()
    db.refresh(invoice)
    return invoice


def update_invoice(db: Session, user: User, invoice_id: UUID, data: InvoiceUpdate) -> Invoice:
    """Update an invoice (e.g. mark as PAID)."""
    invoice = get_invoice_by_id(db, invoice_id)
    
    update_data = data.model_dump(exclude_unset=True)
    
    if "status" in update_data:
        try:
            update_data["status"] = InvoiceStatus(update_data["status"])
        except ValueError:
            raise BadRequestError(message=f"Invalid status: {update_data['status']}", code="INVALID_STATUS")
            
    old_data = {k: getattr(invoice, k) for k in update_data.keys()}
    
    for key, value in update_data.items():
        setattr(invoice, key, value)
        
    db.add(AuditLog(
        actor_user_id=user.id,
        action="UPDATE_INVOICE",
        entity_type="INVOICE",
        entity_id=invoice.id,
        old_data={k: str(v) if v is not None else None for k, v in old_data.items()},
        new_data={k: str(v) if v is not None else None for k, v in update_data.items()}
    ))
    
    db.commit()
    db.refresh(invoice)
    return invoice
