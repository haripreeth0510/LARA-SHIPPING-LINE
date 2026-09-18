"""
Admin user service.
"""
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.models.audit_log import AuditLog
from app.schemas.user import UserUpdate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_all_users(db: Session, page: int = 1, page_size: int = 20) -> tuple[list[User], int]:
    """Get paginated list of all users."""
    query = db.query(User)
    total = query.count()
    users = (
        query
        .order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return users, total


def get_user_by_id(db: Session, target_user_id: UUID) -> User:
    """Get a single user."""
    user = db.query(User).filter(User.id == target_user_id).first()
    if not user:
        raise NotFoundError(message="User not found", code="USER_NOT_FOUND")
    return user


def update_user(db: Session, current_user: User, target_user_id: UUID, data: UserUpdate) -> User:
    """Update a user (role, status, etc.)."""
    user = get_user_by_id(db, target_user_id)
    
    update_data = data.model_dump(exclude_unset=True)
    
    if "role" in update_data:
        try:
            update_data["role"] = UserRole(update_data["role"])
        except ValueError:
            raise BadRequestError(message=f"Invalid role: {update_data['role']}", code="INVALID_ROLE")
            
        # Prevent non-super-admins from modifying super admins or granting super admin
        if current_user.role != UserRole.SUPER_ADMIN:
            if user.role == UserRole.SUPER_ADMIN or update_data["role"] == UserRole.SUPER_ADMIN:
                raise BadRequestError(message="Only SUPER_ADMIN can grant or modify SUPER_ADMIN roles", code="INSUFFICIENT_ROLE")
            
    old_data = {k: getattr(user, k) for k in update_data.keys()}
    
    for key, value in update_data.items():
        setattr(user, key, value)
        
    db.add(AuditLog(
        actor_user_id=current_user.id,
        action="UPDATE_USER",
        entity_type="USER",
        entity_id=user.id,
        old_data={k: str(v) if v is not None else None for k, v in old_data.items()},
        new_data={k: str(v) if v is not None else None for k, v in update_data.items()}
    ))
    
    db.commit()
    db.refresh(user)
    return user
