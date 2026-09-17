"""
Central v1 API router — aggregates all sub-routers.
"""
from fastapi import APIRouter

from app.api.v1 import auth, tracking
from app.api.v1.client import router as client_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(tracking.router)
api_router.include_router(client_router.client_router, prefix="/client")

# Future routers will be added here:
# from app.api.v1 import admin, shipments, quotes, documents, invoices, support, notifications, analytics
# api_router.include_router(admin.router)
# api_router.include_router(shipments.router)
# api_router.include_router(quotes.router)
# api_router.include_router(documents.router)
# api_router.include_router(invoices.router)
# api_router.include_router(support.router)
# api_router.include_router(notifications.router)
# api_router.include_router(analytics.router)
