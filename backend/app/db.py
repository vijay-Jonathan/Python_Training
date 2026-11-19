"""Database access for the generated application.

``get_db`` is the FastAPI dependency every endpoint uses; ``init_db`` runs at
startup (and in tests) to create the schema and seed it.

When ``DATABASE_URL`` is set the app connects to PostgreSQL; otherwise it
uses the local SQLite file. Endpoints always write parameterised ``?`` SQL —
the Postgres path translates the placeholders itself, so the same queries run
on both engines.
"""

from __future__ import annotations

import sqlite3
from collections.abc import Iterator
from pathlib import Path
from typing import Any

try:
    import psycopg
except ImportError:  # Postgres is optional until a DATABASE_URL exists
    psycopg = None

from app import db_schema, migrations
from app.config import settings


class _PgRow:
    """Expose both sqlite3.Row's integer and column-name access."""

    def __init__(self, names: tuple[str, ...], values: tuple[Any, ...]) -> None:
        self._values = values
        self._data = dict(zip(names, values, strict=True))

    def __getitem__(self, key: str | int) -> Any:
        return self._values[key] if isinstance(key, int) else self._data[key]

    def __iter__(self) -> Any:
        return iter(self._values)

    def __len__(self) -> int:
        return len(self._values)

    def keys(self) -> Any:
        return self._data.keys()


def _row_factory(cursor: Any) -> Any:
    names = tuple(column.name for column in cursor.description or ())
    return lambda values: _PgRow(names, values)


class _PgCursor:
    def __init__(self, cursor: Any) -> None:
        self._cursor = cursor

    def execute(self, sql: str, params: Any = ()) -> _PgCursor:
        self._cursor.execute(sql.replace("?", "%s"), params)
        return self

    def executemany(self, sql: str, params: Any) -> _PgCursor:
        self._cursor.executemany(sql.replace("?", "%s"), params)
        return self

    def fetchone(self) -> Any:
        return self._cursor.fetchone()

    def fetchall(self) -> Any:
        return self._cursor.fetchall()

    def close(self) -> None:
        self._cursor.close()


class _PgShim:
    """A psycopg connection shaped like the sqlite3 one endpoints expect.

    sqlite3 accepts ``?`` placeholders; psycopg wants ``%s`` — swapped here so
    services keep one SQL style. Rows support both integer and column-name
    access, as sqlite3.Row does.
    """

    def __init__(self, conn: Any) -> None:
        self._conn = conn

    def cursor(self) -> _PgCursor:
        return _PgCursor(self._conn.cursor())

    def execute(self, sql: str, params: Any = ()) -> Any:
        return self.cursor().execute(sql, params)

    def executescript(self, script: str) -> None:
        with self._conn.cursor() as cur:
            for statement in script.split(";"):
                if statement.strip():
                    cur.execute(statement)

    def commit(self) -> None:
        self._conn.commit()

    def close(self) -> None:
        self._conn.close()


def _connect() -> Any:
    if settings.database_url:
        if psycopg is None:
            raise RuntimeError("DATABASE_URL is set but psycopg is not installed")
        return _PgShim(psycopg.connect(settings.database_url, row_factory=_row_factory))
    conn = sqlite3.connect(settings.database_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn


def get_db() -> Iterator[Any]:
    conn = _connect()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    if not settings.database_url:
        path = Path(settings.database_path)
        path.parent.mkdir(parents=True, exist_ok=True)
    conn = _connect()
    try:
        migrations.initialize(conn, db_schema)
    finally:
        conn.close()
