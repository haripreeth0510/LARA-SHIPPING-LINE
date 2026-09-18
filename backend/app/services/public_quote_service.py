"""
Public quote service.
"""
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.client import Client, ClientStatus
from app.models.quote import Quote, QuoteStatus
from app.schemas.public_quote import PublicQuoteRequest
from app.middleware.error_handler import BadRequestError


def request_public_quote(db: Session, data: PublicQuoteRequest) -> Quote:
    """Process a public quote request."""
    
    # 1. Find or create client
    client = db.query(Client).filter(Client.email == data.email).first()
    
    if not client:
        # Create a new INACTIVE client
        client = Client(
            company_name=data.company_name,
            contact_name=data.contact_name,
            email=data.email,
            phone=data.phone,
            status=ClientStatus.INACTIVE
        )
        db.add(client)
        db.flush()  # To get the client ID
    
    # 2. Generate a quote number
    from datetime import datetime, timezone
    year = datetime.now(timezone.utc).year
    count = db.query(Quote).count()
    quote_num = f"QTE-{year}-{count + 1:04d}"
    
    cargo_str = data.cargo_details
    if data.weight:
        cargo_str += f" | Weight: {data.weight}kg"
    if data.volume:
        cargo_str += f" | Volume: {data.volume}cbm"
        
    # 3. Create the Quote
    quote = Quote(
        quote_number=quote_num,
        client_id=client.id,
        origin=data.origin,
        destination=data.destination,
        cargo_details=cargo_str,
        shipping_method=data.shipping_method,
        status=QuoteStatus.DRAFT
    )
    
    db.add(quote)
    
    try:
        db.commit()
        db.refresh(quote)
    except IntegrityError:
        db.rollback()
        raise BadRequestError("Failed to process quote request.")
        
    return quote
