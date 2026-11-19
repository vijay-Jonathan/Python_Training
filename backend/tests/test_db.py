"""init_db is safe to run repeatedly — restarts must not fail or re-seed."""

import os
from types import SimpleNamespace
from unittest.mock import Mock

import pytest

from app import db_schema
from app.config import settings
from app.db import _PgShim, _row_factory, init_db


def test_init_db_is_idempotent() -> None:
    init_db()
    init_db()


def test_postgres_adapter_has_sqlite_cursor_and_row_interface() -> None:
    raw = Mock()
    conn = _PgShim(raw)
    cur = conn.cursor()
    cur.execute("SELECT id FROM tasks WHERE title = ?", ("first",))
    raw.cursor.return_value.execute.assert_called_with(
        "SELECT id FROM tasks WHERE title = %s", ("first",)
    )
    cur.executemany("INSERT INTO tasks (title) VALUES (?)", [("a",), ("b",)])
    raw.cursor.return_value.executemany.assert_called_with(
        "INSERT INTO tasks (title) VALUES (%s)", [("a",), ("b",)]
    )

    make_row = _row_factory(SimpleNamespace(description=[SimpleNamespace(name="id")]))
    row = make_row((3,))
    assert row[0] == row["id"] == 3
    assert tuple(row) == (3,)
    assert dict(row) == {"id": 3}


def test_postgres_cursor_and_seed(monkeypatch: pytest.MonkeyPatch) -> None:
    url = os.environ.get("TEST_GENERATED_POSTGRES_URL")
    if not url:
        pytest.skip("TEST_GENERATED_POSTGRES_URL is not set")

    from app.db import _connect

    monkeypatch.setattr(settings, "database_url", url)
    monkeypatch.setattr(
        db_schema,
        "SCHEMA_SQL",
        "CREATE TEMP TABLE tasks (id SERIAL PRIMARY KEY, title TEXT NOT NULL);",
    )

    def seed(conn: object) -> None:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM tasks")
        assert cur.fetchone()[0] == 0
        cur.execute("INSERT INTO tasks (title) VALUES (?) RETURNING id", ("first",))
        assert cur.fetchone()["id"] == 1
        conn.commit()
        row = cur.execute("SELECT id, title FROM tasks WHERE title = ?", ("first",)).fetchone()
        assert row[0] == row["id"] == 1
        assert dict(row) == {"id": 1, "title": "first"}
        cur.close()

    monkeypatch.setattr(db_schema, "seed", seed)
    init_db()

    # The same cursor API is used by generated endpoints, not just seed().
    conn = _connect()
    try:
        cur = conn.cursor()
        cur.execute("CREATE TEMP TABLE items (name TEXT)")
        cur.executemany("INSERT INTO items (name) VALUES (?)", [("a",), ("b",)])
        assert [row["name"] for row in cur.execute("SELECT name FROM items").fetchall()] == [
            "a",
            "b",
        ]
    finally:
        conn.close()
