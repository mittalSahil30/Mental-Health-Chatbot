from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    # JWT
    SECRET_KEY: str = "change_me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days

    # DB
    DATABASE_URL: str = "sqlite:///./serenemind.db"

    # Gemini
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=("backend/.env", ".env"), env_file_encoding="utf-8", extra="ignore")

    @field_validator("DATABASE_URL")
    @classmethod
    def normalize_sqlite(cls, v: str) -> str:
        if v.startswith("sqlite") and ":///" in v and not v.startswith("sqlite:////") and v.startswith("sqlite:///./"):
            # leave relative path as is
            return v
        return v


settings = Settings()  # singleton
