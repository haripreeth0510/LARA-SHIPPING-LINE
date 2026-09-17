"""
Common response schemas used across the API.
"""
from typing import Any

from pydantic import BaseModel


class ErrorDetail(BaseModel):
    """Error detail in responses."""
    code: str
    message: str
    details: list[dict] | None = None


class SuccessResponse(BaseModel):
    """Standard success response envelope."""
    success: bool = True
    data: Any = None
    message: str = "Success"


class ErrorResponse(BaseModel):
    """Standard error response envelope."""
    success: bool = False
    error: ErrorDetail


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    page: int
    page_size: int
    total: int


class PaginatedResponse(BaseModel):
    """Paginated response envelope."""
    success: bool = True
    items: list[Any]
    page: int
    page_size: int
    total: int
