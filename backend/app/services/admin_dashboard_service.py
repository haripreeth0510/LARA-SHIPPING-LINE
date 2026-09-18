"""
Admin dashboard service.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.shipment import Shipment, ShipmentStatus
from app.models.quote import Quote, QuoteStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.models.support_ticket import SupportTicket, TicketStatus
from app.models.client import Client


def get_admin_dashboard_kpis(db: Session) -> dict:
    """Get global aggregated KPI metrics for the admin dashboard."""

    total_clients = db.query(func.count(Client.id)).scalar()

    # Shipment metrics
    active_shipments = (
        db.query(func.count(Shipment.id))
        .filter(Shipment.status != ShipmentStatus.DELIVERED)
        .filter(Shipment.status != ShipmentStatus.CANCELLED)
        .scalar()
    )

    in_transit_shipments = (
        db.query(func.count(Shipment.id))
        .filter(Shipment.status == ShipmentStatus.IN_TRANSIT)
        .scalar()
    )

    # Quotes
    pending_quotes = (
        db.query(func.count(Quote.id))
        .filter(Quote.status == QuoteStatus.DRAFT)
        .scalar()
    )

    # Invoices
    unpaid_invoices = (
        db.query(func.count(Invoice.id))
        .filter(Invoice.status.in_([InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE]))
        .scalar()
    )
    
    total_unpaid_amount = (
        db.query(func.sum(Invoice.total))
        .filter(Invoice.status.in_([InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE]))
        .scalar() or 0.0
    )

    # Support Tickets
    open_tickets = (
        db.query(func.count(SupportTicket.id))
        .filter(SupportTicket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS]))
        .scalar()
    )

    return {
        "total_clients": total_clients,
        "active_shipments": active_shipments,
        "in_transit_shipments": in_transit_shipments,
        "pending_quotes": pending_quotes,
        "unpaid_invoices_count": unpaid_invoices,
        "unpaid_invoices_amount": float(total_unpaid_amount),
        "open_support_tickets": open_tickets,
    }
