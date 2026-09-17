"""
Export all models for easy importing and Alembic discovery.
"""
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.client import Client, ClientStatus
from app.models.shipment import Shipment, ShipmentStatus, ShipmentType
from app.models.shipment_event import ShipmentEvent
from app.models.quote import Quote, QuoteStatus
from app.models.document import Document, DocumentType
from app.models.invoice import Invoice, InvoiceStatus
from app.models.support_ticket import SupportTicket, TicketPriority, TicketStatus
from app.models.notification import Notification
from app.models.audit_log import AuditLog

__all__ = [
    "Base",
    "User", "UserRole",
    "Client", "ClientStatus",
    "Shipment", "ShipmentStatus", "ShipmentType",
    "ShipmentEvent",
    "Quote", "QuoteStatus",
    "Document", "DocumentType",
    "Invoice", "InvoiceStatus",
    "SupportTicket", "TicketPriority", "TicketStatus",
    "Notification",
    "AuditLog",
]
