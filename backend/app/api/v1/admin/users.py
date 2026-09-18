"""
Admin users router.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin, get_current_user
from app.models.user import User
from app.schemas.user import UserUpdate, UserOut
from app.schemas.common import PaginatedResponse
from app.services.admin_user_service import (
    get_all_users,
    get_user_by_id,
    update_user
)

router = APIRouter(
    prefix="/users", 
    tags=["Admin Users"],
    dependencies=[Depends(require_admin)]
)


@router.get("", response_model=PaginatedResponse)
def list_all_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all users."""
    users, total = get_all_users(db, page, page_size)
    
    return {
        "success": True,
        "items": [UserOut.model_validate(u).model_dump(mode="json") for u in users],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.get("/{user_id}")
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    """Get details for a specific user."""
    user = get_user_by_id(db, user_id)
    
    return {
        "success": True,
        "data": UserOut.model_validate(user).model_dump(mode="json")
    }


@router.patch("/{user_id}")
def edit_user(
    user_id: UUID,
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a user's details or role."""
    user = update_user(db, current_user, user_id, data)
    
    return {
        "success": True,
        "message": "User updated successfully",
        "data": UserOut.model_validate(user).model_dump(mode="json")
    }
