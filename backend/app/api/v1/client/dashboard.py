"""
Client dashboard router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_client, get_current_user, get_db
from app.models.client import Client
from app.models.user import User
from app.services.client_dashboard_service import get_client_dashboard_kpis

router = APIRouter(prefix="/dashboard", tags=["Client Dashboard"])


@router.get("")
def get_dashboard(
    current_user: User = Depends(get_current_user),
    client: Client = Depends(get_current_client),
    db: Session = Depends(get_db),
):
    """
    Get the client dashboard KPIs.
    Requires the user to have a linked client profile.
    """
    kpis = get_client_dashboard_kpis(db, client)
    
    # Notifications are linked to the User, not the Client, so we do it here.
    from app.models.notification import Notification
    from sqlalchemy import func
    
    unread_notifications = (
        db.query(func.count(Notification.id))
        .filter(Notification.user_id == current_user.id)
        .filter(Notification.is_read == False)
        .scalar()
    )
    
    kpis["unread_notifications"] = unread_notifications

    return {
        "success": True,
        "data": kpis
    }
