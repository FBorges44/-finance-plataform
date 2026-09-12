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
    # Lista separada por vírgulas. Ex.: https://meu-app.vercel.app
    cors_origins: str = "http://localhost:3000"
    auth_cookie_name: str = "folio_session"
    auth_cookie_secure: bool = False
    auth_cookie_samesite: str = "lax"
    login_max_attempts: int = Field(default=5, ge=1, le=20)
    login_window_minutes: int = Field(default=15, ge=1, le=60)
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    frontend_url: str = "http://localhost:3000"

    jwt_secret_key: str = Field(min_length=32)
    access_token_expire_minutes: int = 60 * 24 * 7

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
