"""
User model — authentication entity for all roles.
"""
import enum
import uuid

from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class UserRole(str, enum.Enum):
    """User role enumeration."""
    CLIENT = "CLIENT"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"
    OPERATIONS = "OPERATIONS"
    SUPPORT = "SUPPORT"
    FINANCE = "FINANCE"


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """User account — the authentication entity for all roles."""

    __tablename__ = "users"

    # Supabase Auth link — set when using Supabase Auth
    auth_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), unique=True, nullable=True, index=True,
    )

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(
        String(255), nullable=True,
        doc="Only used in local dev mode; Supabase Auth handles passwords in production.",
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role", create_constraint=True),
        nullable=False,
        default=UserRole.CLIENT,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # FK to clients (nullable — only CLIENT users have a client_id)
    client_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clients.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Relationships
    client: Mapped["Client"] = relationship(  # noqa: F821
        back_populates="users",
        foreign_keys=[client_id],
        lazy="joined",
    )
    notifications: Mapped[list["Notification"]] = relationship(  # noqa: F821
        back_populates="user",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email!r}, role={self.role.value})>"
