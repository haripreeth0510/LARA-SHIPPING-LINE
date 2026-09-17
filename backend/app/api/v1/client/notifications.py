"""
Client notifications router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.schemas.common import PaginatedResponse
from app.services.client_notification_service import (
    get_user_notifications,
    mark_notification_as_read
)

router = APIRouter(prefix="/notifications", tags=["Client Notifications"])


@router.get("", response_model=PaginatedResponse)
def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List user's notifications."""
    notifications, total = get_user_notifications(db, current_user, page, page_size)
    return {
        "success": True,
        "items": [NotificationOut.model_validate(n).model_dump(mode="json") for n in notifications],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.patch("/{notification_id}/read")
def read_notification(
    notification_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a notification as read."""
    notification = mark_notification_as_read(db, current_user, notification_id)
    return {
        "success": True,
        "data": NotificationOut.model_validate(notification).model_dump(mode="json")
    }
