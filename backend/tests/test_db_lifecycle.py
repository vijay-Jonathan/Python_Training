"""The builder-owned schema and seed honour the template's database lifecycle.

Runs against whatever ``app.db_schema`` currently contains, so a generated
application's own ``SCHEMA_SQL``, ``MIGRATIONS`` and ``seed`` are held to:
tables exist before seed runs, initialisation is repeatable, seeding never
duplicates, and the read-only drift check never writes.
"""

import sqlite3

import pytest

from app import db_schema, migrations
from app.config import settings
from app.db import init_db


def _counts(path) -> dict[str, int]:
    with sqlite3.connect(path) as conn:
        names = [
            row[0]
            for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
            )
        ]
        return {name: conn.execute(f'SELECT COUNT(*) FROM "{name}"').fetchone()[0] for name in names}


def test_fresh_database_initialises_and_seed_runs_after_schema(tmp_path, monkeypatch):
    path = tmp_path / "fresh.db"
    monkeypatch.setattr(settings, "database_path", str(path))
    monkeypatch.setattr(settings, "database_url", "")
    tables_at_seed: list[set[str]] = []
    real_seed = db_schema.seed

    def spy(conn):
        tables_at_seed.append({r[0] for r in conn.execute("SELECT name FROM sqlite_master")})
        real_seed(conn)

    monkeypatch.setattr(db_schema, "seed", spy)
    init_db()
    expected, _ = migrations._statements(db_schema.SCHEMA_SQL)
    assert len(tables_at_seed) == 1
    assert "schema_migrations" in tables_at_seed[0]
    assert migrations.check(path, db_schema)["ok"]
    assert len(expected) == len([n for n in _counts(path) if n != "schema_migrations"])


def test_repeated_initialisation_is_idempotent_and_seed_does_not_duplicate(tmp_path, monkeypatch):
    path = tmp_path / "repeat.db"
    monkeypatch.setattr(settings, "database_path", str(path))
    monkeypatch.setattr(settings, "database_url", "")
    init_db()
    first = _counts(path)
    init_db()
    init_db()
    assert _counts(path) == first


def test_drift_check_is_read_only(tmp_path, monkeypatch):
    path = tmp_path / "ro.db"
    monkeypatch.setattr(settings, "database_path", str(path))
    monkeypatch.setattr(settings, "database_url", "")
    init_db()
    before, mtime = path.read_bytes(), path.stat().st_mtime_ns
    assert migrations.check(path, db_schema)["ok"]
    assert path.read_bytes() == before
    assert path.stat().st_mtime_ns == mtime


def test_seed_failure_is_reported_as_actionable_migration_error(tmp_path):
    def bad_seed(conn):
        conn.execute("SELECT * FROM collections")

    schema = type("S", (), {"SCHEMA_SQL": "", "MIGRATIONS": [], "seed": staticmethod(bad_seed)})
    with sqlite3.connect(tmp_path / "x.db") as conn:
        with pytest.raises(migrations.MigrationError, match="seed\\(\\) failed.*collections"):
            migrations.initialize(conn, schema)
