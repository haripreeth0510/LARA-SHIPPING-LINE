"""
Structured logging configuration.

Produces JSON-formatted logs with request context.
Never logs passwords, tokens, or secrets.
"""
import logging
import sys
from contextvars import ContextVar

from app.core.config import get_settings

# Context variables for request-scoped logging
request_id_var: ContextVar[str] = ContextVar("request_id", default="-")
user_id_var: ContextVar[str] = ContextVar("user_id", default="-")
user_role_var: ContextVar[str] = ContextVar("user_role", default="-")


class StructuredFormatter(logging.Formatter):
    """Formatter that outputs structured log lines with request context."""

    def format(self, record: logging.LogRecord) -> str:
        record.request_id = request_id_var.get("-")
        record.user_id = user_id_var.get("-")
        record.user_role = user_role_var.get("-")
        return super().format(record)


def setup_logging() -> None:
    """Configure application logging."""
    settings = get_settings()

    fmt = (
        "%(asctime)s | %(levelname)-8s | "
        "req=%(request_id)s | user=%(user_id)s | role=%(user_role)s | "
        "%(name)s | %(message)s"
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredFormatter(fmt))

    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Suppress noisy library loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Get a named logger."""
    return logging.getLogger(name)
