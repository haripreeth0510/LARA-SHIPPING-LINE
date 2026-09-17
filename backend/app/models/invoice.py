"""
Invoice model — billing records.
"""
import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class InvoiceStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ISSUED = "ISSUED"
    PARTIALLY_PAID = "PARTIALLY_PAID"
    PAID = "PAID"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"


class Invoice(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Invoice issued to a client for a shipment."""

    __tablename__ = "invoices"

    invoice_number: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True,
    )
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    shipment_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("shipments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    tax: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    issue_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[InvoiceStatus] = mapped_column(
        Enum(InvoiceStatus, name="invoice_status", create_constraint=True),
        nullable=False,
        default=InvoiceStatus.DRAFT,
    )
    payment_reference: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationships
    client: Mapped["Client"] = relationship(back_populates="invoices")  # noqa: F821
    shipment: Mapped["Shipment"] = relationship(back_populates="invoices")  # noqa: F821

    def __repr__(self) -> str:
        return f"<Invoice(id={self.id}, number={self.invoice_number!r}, status={self.status.value})>"
