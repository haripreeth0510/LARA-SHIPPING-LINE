"""
Client module router aggregator.
"""
from fastapi import APIRouter

from app.api.v1.client import (
    dashboard,
    shipments,
    quotes,
    documents,
    invoices,
    support,
    notifications,
)

client_router = APIRouter()

client_router.include_router(dashboard.router)
client_router.include_router(shipments.router)
client_router.include_router(quotes.router)
client_router.include_router(documents.router)
client_router.include_router(invoices.router)
client_router.include_router(support.router)
client_router.include_router(notifications.router)
