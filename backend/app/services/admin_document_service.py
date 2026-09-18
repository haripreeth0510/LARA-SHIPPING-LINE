"""
Admin document service.
"""
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.document import Document, DocumentType
from app.models.audit_log import AuditLog
from app.schemas.document import DocumentCreate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_all_documents(db: Session, page: int = 1, page_size: int = 20) -> tuple[list[Document], int]:
    """Get paginated list of all documents."""
    query = db.query(Document)
    total = query.count()
    documents = (
        query
        .order_by(Document.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return documents, total


def register_document(db: Session, user: User, data: DocumentCreate) -> Document:
    """Register a new document in the database (file upload handled separately via Supabase)."""
    
    try:
        doc_type = DocumentType(data.document_type)
    except ValueError:
        raise BadRequestError(message=f"Invalid document type: {data.document_type}", code="INVALID_DOC_TYPE")
        
    doc = Document(
        shipment_id=data.shipment_id,
        client_id=data.client_id,
        document_type=doc_type,
        file_name=data.file_name,
        storage_path=data.storage_path,
        mime_type=data.mime_type,
        file_size=data.file_size,
        uploaded_by=user.id
    )
    
    db.add(doc)
    db.flush()
    
    db.add(AuditLog(
        actor_user_id=user.id,
        action="REGISTER_DOCUMENT",
        entity_type="DOCUMENT",
        entity_id=doc.id,
        new_data={"file_name": data.file_name, "shipment_id": str(data.shipment_id)}
    ))
    
    db.commit()
    db.refresh(doc)
    return doc


def delete_document(db: Session, user: User, document_id: UUID) -> None:
    """Delete a document record."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise NotFoundError(message="Document not found", code="DOCUMENT_NOT_FOUND")
        
    db.add(AuditLog(
        actor_user_id=user.id,
        action="DELETE_DOCUMENT",
        entity_type="DOCUMENT",
        entity_id=doc.id,
        old_data={"file_name": doc.file_name, "storage_path": doc.storage_path}
    ))
    
    db.delete(doc)
    db.commit()
