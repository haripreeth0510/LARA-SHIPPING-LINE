"""
Admin shipment service.
"""
from uuid import UUID
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.client import Client
from app.models.shipment import Shipment, ShipmentStatus, ShipmentType
from app.models.shipment_event import ShipmentEvent
from app.models.notification import Notification
from app.models.audit_log import AuditLog
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentEventCreate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_all_shipments(db: Session, page: int = 1, page_size: int = 20, status: ShipmentStatus | None = None) -> tuple[list[Shipment], int]:
    """Get paginated list of all shipments."""
    query = db.query(Shipment)
    if status:
        query = query.filter(Shipment.status == status)
        
    total = query.count()
    shipments = (
        query
        .order_by(Shipment.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return shipments, total


def get_shipment_by_id(db: Session, shipment_id: UUID) -> Shipment:
    """Get a single shipment."""
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise NotFoundError(message="Shipment not found", code="SHIPMENT_NOT_FOUND")
    return shipment


def _generate_tracking_number(db: Session) -> str:
    """Generate a unique tracking number (LARA-YYYY-XXXX)."""
    year = datetime.now(timezone.utc).year
    count = db.query(Shipment).count()
    return f"LARA-{year}-{count + 1:04d}"


def create_shipment(db: Session, user: User, data: ShipmentCreate) -> Shipment:
    """Create a new shipment for a client."""
    
    # Ensure client exists
    client = db.query(Client).filter(Client.id == data.client_id).first()
    if not client:
        raise BadRequestError(message="Client does not exist", code="INVALID_CLIENT")
        
    tracking_number = _generate_tracking_number(db)
    
    try:
        shipment_type = ShipmentType(data.shipment_type)
    except ValueError:
        raise BadRequestError(message=f"Invalid shipment type: {data.shipment_type}", code="INVALID_SHIPMENT_TYPE")
        
    shipment = Shipment(
        tracking_number=tracking_number,
        client_id=data.client_id,
        reference_number=data.reference_number,
        shipment_type=shipment_type,
        origin=data.origin,
        destination=data.destination,
        origin_port=data.origin_port,
        destination_port=data.destination_port,
        carrier=data.carrier,
        vessel_name=data.vessel_name,
        voyage_number=data.voyage_number,
        container_number=data.container_number,
        container_type=data.container_type,
        cargo_description=data.cargo_description,
        weight=data.weight,
        volume=data.volume,
        booking_date=data.booking_date or datetime.now(timezone.utc),
        estimated_departure=data.estimated_departure,
        estimated_arrival=data.estimated_arrival,
        status=ShipmentStatus.BOOKING_CONFIRMED,
    )
    
    db.add(shipment)
    db.flush()
    
    # Create initial event
    event = ShipmentEvent(
        shipment_id=shipment.id,
        status=ShipmentStatus.BOOKING_CONFIRMED.value,
        title="Booking Confirmed",
        description="Shipment booking has been confirmed.",
        location=data.origin,
        event_time=datetime.now(timezone.utc),
        created_by=user.id
    )
    db.add(event)
    
    # Audit log
    db.add(AuditLog(
        actor_user_id=user.id,
        action="CREATE_SHIPMENT",
        entity_type="SHIPMENT",
        entity_id=shipment.id,
        new_data={"tracking_number": tracking_number, "client_id": str(data.client_id)}
    ))
    
    db.commit()
    db.refresh(shipment)
    return shipment


def update_shipment(db: Session, user: User, shipment_id: UUID, data: ShipmentUpdate) -> Shipment:
    """Update an existing shipment."""
    shipment = get_shipment_by_id(db, shipment_id)
    
    update_data = data.model_dump(exclude_unset=True)
    old_data = {k: getattr(shipment, k) for k in update_data.keys()}
    
    for key, value in update_data.items():
        setattr(shipment, key, value)
        
    db.add(AuditLog(
        actor_user_id=user.id,
        action="UPDATE_SHIPMENT",
        entity_type="SHIPMENT",
        entity_id=shipment.id,
        old_data={k: str(v) if v is not None else None for k, v in old_data.items()},
        new_data={k: str(v) if v is not None else None for k, v in update_data.items()}
    ))
        
    db.commit()
    db.refresh(shipment)
    return shipment


def add_shipment_event(db: Session, user: User, shipment_id: UUID, data: ShipmentEventCreate) -> ShipmentEvent:
    """Add a tracking event and update the shipment's current status."""
    shipment = get_shipment_by_id(db, shipment_id)
    
    try:
        new_status = ShipmentStatus(data.status)
    except ValueError:
        raise BadRequestError(message=f"Invalid status: {data.status}", code="INVALID_STATUS")
        
    old_status = shipment.status
    
    event_time = data.event_time or datetime.now(timezone.utc)
    
    event = ShipmentEvent(
        shipment_id=shipment.id,
        status=new_status.value,
        title=data.title or new_status.value.replace("_", " ").title(),
        description=data.description or "Tracking status updated.",
        location=data.location,
        event_time=event_time,
        created_by=user.id
    )
    db.add(event)
    
    # Update shipment status
    shipment.status = new_status
    
    # Audit log
    db.add(AuditLog(
        actor_user_id=user.id,
        action="ADD_SHIPMENT_EVENT",
        entity_type="SHIPMENT",
        entity_id=shipment.id,
        old_data={"status": old_status.value},
        new_data={"status": new_status.value}
    ))
    
    # Notify client
    # Find users attached to the client
    client_users = db.query(User).filter(User.client_id == shipment.client_id).all()
    for c_user in client_users:
        db.add(Notification(
            user_id=c_user.id,
            type="SHIPMENT_STATUS",
            title=f"Shipment Update: {shipment.tracking_number}",
            message=f"Your shipment is now {new_status.value.replace('_', ' ')}.",
            reference_id=shipment.id,
            reference_type="SHIPMENT"
        ))
    
    db.commit()
    db.refresh(event)
    return event
