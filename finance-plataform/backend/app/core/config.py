from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Folio API"
    app_version: str = "0.1.0"
    environment: str = "development"

    database_url: str = (
        "postgresql+asyncpg://"
        "finance:finance_dev_password@127.0.0.1:5433/"
        "finance_platform"
    )

    redis_url: str = "redis://localhost:6379/0"

    jwt_secret_key: str = Field(min_length=32)
    access_token_expire_minutes: int = 60 * 24 * 7

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()