"""
Shipment model — core operational entity.
"""
import enum
import uuid

from sqlalchemy import DateTime, Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ShipmentType(str, enum.Enum):
    LCL = "LCL"
    FCL = "FCL"
    AIR = "AIR"
    ROAD = "ROAD"
    MULTIMODAL = "MULTIMODAL"


class ShipmentStatus(str, enum.Enum):
    BOOKING_CONFIRMED = "BOOKING_CONFIRMED"
    CARGO_RECEIVED = "CARGO_RECEIVED"
    CONTAINER_LOADED = "CONTAINER_LOADED"
    DEPARTED = "DEPARTED"
    IN_TRANSIT = "IN_TRANSIT"
    ARRIVED = "ARRIVED"
    CUSTOMS_CLEARANCE = "CUSTOMS_CLEARANCE"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    ON_HOLD = "ON_HOLD"
    DELAYED = "DELAYED"
    CANCELLED = "CANCELLED"


class Shipment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A shipment managed by LARA Shipping Line."""

    __tablename__ = "shipments"

    tracking_number: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True,
    )
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    reference_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    shipment_type: Mapped[ShipmentType] = mapped_column(
        Enum(ShipmentType, name="shipment_type", create_constraint=True),
        nullable=False,
    )
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    origin_port: Mapped[str | None] = mapped_column(String(255), nullable=True)
    destination_port: Mapped[str | None] = mapped_column(String(255), nullable=True)
    carrier: Mapped[str | None] = mapped_column(String(255), nullable=True)
    vessel_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    voyage_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    container_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    container_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    cargo_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    weight: Mapped[float | None] = mapped_column(Float, nullable=True)
    volume: Mapped[float | None] = mapped_column(Float, nullable=True)

    from datetime import datetime as _dt
    booking_date: Mapped[_dt | None] = mapped_column(DateTime(timezone=True), nullable=True)
    estimated_departure: Mapped[_dt | None] = mapped_column(DateTime(timezone=True), nullable=True)
    actual_departure: Mapped[_dt | None] = mapped_column(DateTime(timezone=True), nullable=True)
    estimated_arrival: Mapped[_dt | None] = mapped_column(DateTime(timezone=True), nullable=True)
    actual_arrival: Mapped[_dt | None] = mapped_column(DateTime(timezone=True), nullable=True)

    status: Mapped[ShipmentStatus] = mapped_column(
        Enum(ShipmentStatus, name="shipment_status", create_constraint=True),
        nullable=False,
        default=ShipmentStatus.BOOKING_CONFIRMED,
    )

    # Relationships
    client: Mapped["Client"] = relationship(back_populates="shipments")  # noqa: F821
    events: Mapped[list["ShipmentEvent"]] = relationship(  # noqa: F821
        back_populates="shipment",
        lazy="select",
        order_by="ShipmentEvent.event_time.desc()",
    )
    documents: Mapped[list["Document"]] = relationship(  # noqa: F821
        back_populates="shipment", lazy="select",
    )
    invoices: Mapped[list["Invoice"]] = relationship(  # noqa: F821
        back_populates="shipment", lazy="select",
    )

    def __repr__(self) -> str:
        return f"<Shipment(id={self.id}, tracking={self.tracking_number!r}, status={self.status.value})>"
