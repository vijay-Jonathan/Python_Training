from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Every environment value the API reads, in one place.

    Nothing else in the app touches ``os.environ``. A value read inline in a route is one
    nobody can find later.
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"

    # Comma-separated rather than a JSON list, because pydantic-settings parses list
    # fields as JSON and `CORS_ORIGINS=http://localhost:5100` would fail to decode.
    cors_origins: str = "http://localhost:5100"

    # SQLite database file, relative to the backend working directory. Used
    # when DATABASE_URL is not set — local development, preview and tests.
    database_path: str = "data/app.db"

    # Postgres connection string, e.g. postgresql://user:pass@host:5432/name.
    # Set by the environment the app is deployed into; empty means SQLite.
    database_url: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached so the env is read once per process and can be overridden in tests."""
    return Settings()


settings = get_settings()
