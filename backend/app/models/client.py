"""
Client model — business entity (company).
"""
import enum

from sqlalchemy import Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ClientStatus(str, enum.Enum):
    """Client account status."""
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"


class Client(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Client business profile (company)."""

    __tablename__ = "clients"

    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tax_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[ClientStatus] = mapped_column(
        Enum(ClientStatus, name="client_status", create_constraint=True),
        nullable=False,
        default=ClientStatus.ACTIVE,
    )

    # Relationships
    users: Mapped[list["User"]] = relationship(  # noqa: F821
        back_populates="client",
        foreign_keys="[User.client_id]",
        lazy="select",
    )
    shipments: Mapped[list["Shipment"]] = relationship(  # noqa: F821
        back_populates="client", lazy="select",
    )
    quotes: Mapped[list["Quote"]] = relationship(  # noqa: F821
        back_populates="client", lazy="select",
    )
    documents: Mapped[list["Document"]] = relationship(  # noqa: F821
        back_populates="client", lazy="select",
    )
    invoices: Mapped[list["Invoice"]] = relationship(  # noqa: F821
        back_populates="client", lazy="select",
    )
    support_tickets: Mapped[list["SupportTicket"]] = relationship(  # noqa: F821
        back_populates="client", lazy="select",
    )

    def __repr__(self) -> str:
        return f"<Client(id={self.id}, company={self.company_name!r})>"
