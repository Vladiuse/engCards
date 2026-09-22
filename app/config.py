# ruff: noqa: INP001
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Config(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    SECRET_KEY: str
    DEBUG: bool = False
    ALLOWED_HOSTS: list[str] = ["127.0.0.1", "localhost"]
    CSRF_TRUSTED_ORIGINS: list[str] = []

    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    DJANGO_SUPERUSER_USERNAME: str = ""
    DJANGO_SUPERUSER_PASSWORD: str = ""

    VOCABULARY_CREATE_CARDS_COUNT: int


config = Config()  # type: ignore[call-arg]
