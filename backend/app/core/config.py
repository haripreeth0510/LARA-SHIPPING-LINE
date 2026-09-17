"""
Application configuration loaded from environment variables.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Application
    APP_ENV: str = "development"
    APP_NAME: str = "LARA Shipping Backend"

    # Database
    DATABASE_URL: str = "postgresql+psycopg://postgres@localhost:5432/lara_shipping"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Local Dev Auth (fallback when Supabase is not configured)
    LOCAL_JWT_SECRET: str = "lara-dev-secret-change-in-production"
    LOCAL_JWT_ALGORITHM: str = "HS256"
    LOCAL_JWT_EXPIRE_MINUTES: int = 60

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Logging
    LOG_LEVEL: str = "INFO"

    # File uploads
    MAX_UPLOAD_SIZE_MB: int = 10
    SUPABASE_STORAGE_BUCKET: str = "shipment-documents"

    # External (future)
    SENTRY_DSN: str = ""
    REDIS_URL: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_ANON_KEY and self.SUPABASE_JWT_SECRET)

    @property
    def jwt_secret(self) -> str:
        """Return the appropriate JWT secret based on configuration."""
        return self.SUPABASE_JWT_SECRET if self.is_supabase_configured else self.LOCAL_JWT_SECRET

    @property
    def jwt_algorithm(self) -> str:
        return self.LOCAL_JWT_ALGORITHM

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


@lru_cache
def get_settings() -> Settings:
    """Return cached Settings instance."""
    return Settings()
