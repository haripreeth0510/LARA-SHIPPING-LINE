"""
Client documents router.
"""
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_client, get_db
from app.models.client import Client
from app.schemas.document import DocumentOut
from app.services.client_document_service import get_client_documents, get_client_document_by_id

router = APIRouter(prefix="/documents", tags=["Client Documents"])


@router.get("")
def list_documents(
    shipment_id: Optional[UUID] = Query(None, description="Filter by shipment ID"),
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """List client's documents."""
    docs = get_client_documents(db, client, shipment_id)
    return {
        "success": True,
        "data": [DocumentOut.model_validate(d).model_dump(mode="json") for d in docs]
    }


@router.get("/{document_id}")
def get_document(
    document_id: UUID,
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """Get metadata for a specific document."""
    doc = get_client_document_by_id(db, client, document_id)
    
    # In Phase 4, we will integrate Supabase Storage to generate a signed URL here.
    # For now, we return the metadata.
    data = DocumentOut.model_validate(doc).model_dump(mode="json")
    data["download_url"] = None  # Placeholder
    
    return {
        "success": True,
        "data": data
    }
