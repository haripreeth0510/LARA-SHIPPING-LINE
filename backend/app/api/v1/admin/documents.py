"""
Admin documents router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin, get_current_user
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentOut
from app.schemas.common import PaginatedResponse
from app.services.admin_document_service import (
    get_all_documents,
    register_document,
    delete_document
)

router = APIRouter(
    prefix="/documents", 
    tags=["Admin Documents"],
    dependencies=[Depends(require_admin)]
)


@router.get("", response_model=PaginatedResponse)
def list_all_documents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all documents."""
    documents, total = get_all_documents(db, page, page_size)
    
    return {
        "success": True,
        "items": [DocumentOut.model_validate(d).model_dump(mode="json") for d in documents],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.post("")
def add_document(
    data: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register a new document record.
    (Note: The actual file should be uploaded directly to Supabase Storage by the client/admin app,
    and this endpoint is called with the resulting path).
    """
    doc = register_document(db, current_user, data)
    
    return {
        "success": True,
        "message": "Document registered successfully",
        "data": DocumentOut.model_validate(doc).model_dump(mode="json")
    }


@router.delete("/{document_id}")
def remove_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a document record."""
    delete_document(db, current_user, document_id)
    
    return {
        "success": True,
        "message": "Document deleted successfully"
    }
