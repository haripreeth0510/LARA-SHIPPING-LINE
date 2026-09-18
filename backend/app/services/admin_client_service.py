"""
Admin client service.
"""
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.client import Client, ClientStatus
from app.schemas.client import ClientCreate, ClientUpdate
from app.middleware.error_handler import NotFoundError, BadRequestError


def get_all_clients(db: Session, page: int = 1, page_size: int = 20) -> tuple[list[Client], int]:
    """Get paginated list of all clients."""
    query = db.query(Client)
    total = query.count()
    clients = (
        query
        .order_by(Client.company_name.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return clients, total


def get_client_by_id(db: Session, client_id: UUID) -> Client:
    """Get a single client."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise NotFoundError(message="Client not found", code="CLIENT_NOT_FOUND")
    return client


def create_client(db: Session, data: ClientCreate) -> Client:
    """Create a new client."""
    
    # Check for existing email
    if db.query(Client).filter(Client.email == data.email).first():
        raise BadRequestError(message="Client with this email already exists", code="EMAIL_ALREADY_EXISTS")
        
    client = Client(
        company_name=data.company_name,
        contact_name=data.contact_name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        country=data.country,
        tax_id=data.tax_id,
        status=ClientStatus.ACTIVE,
    )
    
    db.add(client)
    try:
        db.commit()
        db.refresh(client)
    except IntegrityError:
        db.rollback()
        raise BadRequestError(message="Failed to create client due to database constraint", code="DB_CONSTRAINT_ERROR")
        
    return client


def update_client(db: Session, client_id: UUID, data: ClientUpdate) -> Client:
    """Update an existing client."""
    client = get_client_by_id(db, client_id)
    
    # Check for email conflicts if changing email
    if data.email and data.email != client.email:
        if db.query(Client).filter(Client.email == data.email).first():
            raise BadRequestError(message="Client with this email already exists", code="EMAIL_ALREADY_EXISTS")
    
    update_data = data.model_dump(exclude_unset=True)
    
    # Map string status to enum if provided
    if "status" in update_data:
        try:
            update_data["status"] = ClientStatus(update_data["status"])
        except ValueError:
            raise BadRequestError(message=f"Invalid status: {update_data['status']}", code="INVALID_STATUS")
            
    for key, value in update_data.items():
        setattr(client, key, value)
        
    db.commit()
    db.refresh(client)
    return client
