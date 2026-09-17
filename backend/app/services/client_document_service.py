"""
Client document service.
"""
from uuid import UUID
from typing import Optional

from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.document import Document
from app.middleware.error_handler import NotFoundError


def get_client_documents(db: Session, client: Client, shipment_id: Optional[UUID] = None) -> list[Document]:
    """Get documents for a client, optionally filtered by shipment."""
    query = db.query(Document).filter(Document.client_id == client.id)
    
    if shipment_id:
        query = query.filter(Document.shipment_id == shipment_id)
        
    return query.order_by(Document.created_at.desc()).all()


def get_client_document_by_id(db: Session, client: Client, document_id: UUID) -> Document:
    """Get a single document metadata."""
    doc = (
        db.query(Document)
        .filter(Document.id == document_id)
        .filter(Document.client_id == client.id)
        .first()
    )
    if not doc:
        raise NotFoundError(message="Document not found", code="DOCUMENT_NOT_FOUND")
    return doc
