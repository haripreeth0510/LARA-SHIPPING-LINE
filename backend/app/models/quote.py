"""
Quote model — pricing requests and responses.
"""
import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class QuoteStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"


class Quote(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A shipping quote request and response."""

    __tablename__ = "quotes"

    quote_number: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True,
    )
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    cargo_details: Mapped[str | None] = mapped_column(Text, nullable=True)
    shipping_method: Mapped[str | None] = mapped_column(String(50), nullable=True)
    estimated_transit_time: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Pricing
    base_amount: Mapped[float | None] = mapped_column(Float, nullable=True)
    tax_amount: Mapped[float | None] = mapped_column(Float, nullable=True)
    total_amount: Mapped[float | None] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)

    status: Mapped[QuoteStatus] = mapped_column(
        Enum(QuoteStatus, name="quote_status", create_constraint=True),
        nullable=False,
        default=QuoteStatus.DRAFT,
    )
    valid_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    client: Mapped["Client"] = relationship(back_populates="quotes")  # noqa: F821

    def __repr__(self) -> str:
        return f"<Quote(id={self.id}, number={self.quote_number!r}, status={self.status.value})>"
