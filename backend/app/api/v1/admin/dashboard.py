"""
Admin dashboard router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin
from app.services.admin_dashboard_service import get_admin_dashboard_kpis

# The router requires ADMIN role for all endpoints
router = APIRouter(
    prefix="/dashboard", 
    tags=["Admin Dashboard"],
    dependencies=[Depends(require_admin)]
)


@router.get("")
def get_dashboard(db: Session = Depends(get_db)):
    """Get global KPIs for the admin dashboard."""
    kpis = get_admin_dashboard_kpis(db)
    
    return {
        "success": True,
        "data": kpis
    }
