"""
Client dashboard service.
"""
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.shipment import Shipment, ShipmentStatus
from app.models.quote import Quote, QuoteStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.models.support_ticket import SupportTicket, TicketStatus
from app.models.notification import Notification
from app.models.client import Client


def get_client_dashboard_kpis(db: Session, client: Client) -> dict:
    """Get aggregated KPI metrics for a client's dashboard."""

    client_id = client.id

    # Shipment metrics
    active_shipments = (
        db.query(func.count(Shipment.id))
        .filter(Shipment.client_id == client_id)
        .filter(Shipment.status != ShipmentStatus.DELIVERED)
        .filter(Shipment.status != ShipmentStatus.CANCELLED)
        .scalar()
    )

    in_transit_shipments = (
        db.query(func.count(Shipment.id))
        .filter(Shipment.client_id == client_id)
        .filter(Shipment.status == ShipmentStatus.IN_TRANSIT)
        .scalar()
    )

    delivered_shipments = (
        db.query(func.count(Shipment.id))
        .filter(Shipment.client_id == client_id)
        .filter(Shipment.status == ShipmentStatus.DELIVERED)
        .scalar()
    )

    # Quotes
    pending_quotes = (
        db.query(func.count(Quote.id))
        .filter(Quote.client_id == client_id)
        .filter(Quote.status.in_([QuoteStatus.SENT, QuoteStatus.DRAFT]))
        .scalar()
    )

    # Invoices
    unpaid_invoices = (
        db.query(func.count(Invoice.id))
        .filter(Invoice.client_id == client_id)
        .filter(Invoice.status.in_([InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE]))
        .scalar()
    )

    # Support Tickets
    open_tickets = (
        db.query(func.count(SupportTicket.id))
        .filter(SupportTicket.client_id == client_id)
        .filter(SupportTicket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS]))
        .scalar()
    )

    # We return the data as a dictionary
    return {
        "active_shipments": active_shipments,
        "in_transit_shipments": in_transit_shipments,
        "delivered_shipments": delivered_shipments,
        "pending_quotes": pending_quotes,
        "unpaid_invoices": unpaid_invoices,
        "open_support_tickets": open_tickets,
    }
