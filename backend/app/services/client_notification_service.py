"""
Client notification service.
"""
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.notification import Notification
from app.middleware.error_handler import NotFoundError


def get_user_notifications(db: Session, user: User, page: int = 1, page_size: int = 20) -> tuple[list[Notification], int]:
    """Get paginated list of notifications for a user."""
    query = db.query(Notification).filter(Notification.user_id == user.id)
    total = query.count()
    notifications = (
        query
        .order_by(Notification.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return notifications, total


def mark_notification_as_read(db: Session, user: User, notification_id: UUID) -> Notification:
    """Mark a specific notification as read."""
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .filter(Notification.user_id == user.id)
        .first()
    )
    
    if not notification:
        raise NotFoundError(message="Notification not found", code="NOTIFICATION_NOT_FOUND")
        
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
