"""
LARA Shipping Line — FastAPI Application Entry Point.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.logging import setup_logging
from app.middleware.error_handler import register_exception_handlers
from app.middleware.request_id import RequestIdMiddleware

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events."""
    setup_logging()
    yield


app = FastAPI(
    title="LARA Shipping Line API",
    description=(
        "Production backend API for the LARA Shipping Line platform — "
        "shipment tracking, quotes, documents, invoices, and more."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────
app.add_middleware(RequestIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exception Handlers ───────────────────────────────────────
register_exception_handlers(app)

# ── Routers ──────────────────────────────────────────────────
app.include_router(api_router)


# ── Health Checks ────────────────────────────────────────────

@app.get("/health", tags=["Health"])
def health():
    """Basic health check."""
    return {"status": "healthy", "version": "0.1.0"}


@app.get("/health/live", tags=["Health"])
def health_live():
    """Liveness probe — is the process running?"""
    return {"status": "alive"}


@app.get("/health/ready", tags=["Health"])
def health_ready(db: Session = Depends(get_db)):
    """Readiness probe — can the app handle requests?"""
    try:
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"

    return {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "database": db_status,
        "version": "0.1.0",
    }
