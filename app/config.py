from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Config(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / '.env',
        env_file_encoding='utf-8',
        extra='ignore',
    )

    SECRET_KEY: str
    DEBUG: bool = False
    ALLOWED_HOSTS: list[str] = ['127.0.0.1', 'localhost']

    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str = 'localhost'
    DB_PORT: int = 5432

    VOCABULARY_CREATE_CARDS_COUNT: int


config = Config()  # type: ignore[call-arg]
