"""
Admin module router aggregator.
"""
from fastapi import APIRouter

from app.api.v1.admin import (
    dashboard,
    clients,
    shipments,
    quotes,
    documents,
    invoices,
    support,
    users,
)

admin_router = APIRouter()

admin_router.include_router(dashboard.router)
admin_router.include_router(clients.router)
admin_router.include_router(shipments.router)
admin_router.include_router(quotes.router)
admin_router.include_router(documents.router)
admin_router.include_router(invoices.router)
admin_router.include_router(support.router)
admin_router.include_router(users.router)
