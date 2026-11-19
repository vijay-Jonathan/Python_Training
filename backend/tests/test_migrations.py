import os
import sqlite3
import subprocess
import sys
from types import SimpleNamespace

import pytest

from app import db_schema, migrations
from app.config import settings
from app.db import init_db

ROOMS = """
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image_url TEXT,
    photo_credit TEXT
);
CREATE INDEX IF NOT EXISTS rooms_image ON rooms(image_url);
"""


def schema(sql=ROOMS, seed=lambda conn: None, versions=()):
    return SimpleNamespace(SCHEMA_SQL=sql, seed=seed, MIGRATIONS=list(versions))


def old_rooms(path):
    with sqlite3.connect(path) as conn:
        conn.execute("CREATE TABLE rooms (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE)")
        conn.execute("INSERT INTO rooms VALUES (42, 'Living room')")


@pytest.fixture()
def framework_schema(monkeypatch):
    """Run the framework against the ROOMS fixture, not the builder's own schema.

    These tests prove the migration framework with a fixture schema. ``db_schema``
    is builder-owned, so its real ``seed`` and ``MIGRATIONS`` reference tables that
    ROOMS never creates; the whole module state is swapped, not just ``SCHEMA_SQL``.
    The real schema and seed are covered by ``test_db_lifecycle.py``.
    """
    monkeypatch.setattr(db_schema, "SCHEMA_SQL", ROOMS)
    monkeypatch.setattr(db_schema, "MIGRATIONS", [])
    monkeypatch.setattr(db_schema, "seed", lambda conn: None)


def test_fresh_and_old_rooms_end_to_end(tmp_path, monkeypatch, framework_schema):
    fresh = tmp_path / "fresh.db"
    with sqlite3.connect(fresh) as conn:
        migrations.initialize(conn, schema())
        assert migrations.check(conn, schema())["ok"]

    path = tmp_path / "old.db"
    old_rooms(path)
    with sqlite3.connect(path) as conn:
        with pytest.raises(sqlite3.OperationalError, match="image_url"):
            conn.execute("SELECT id, name, image_url, photo_credit FROM rooms").fetchall()
    monkeypatch.setattr(settings, "database_path", str(path))
    monkeypatch.setattr(settings, "database_url", "")
    init_db()
    init_db()
    with sqlite3.connect(path) as conn:
        assert conn.execute("SELECT id, name, image_url, photo_credit FROM rooms").fetchall() == [
            (42, "Living room", None, None)
        ]
        assert conn.execute("SELECT name FROM sqlite_master WHERE name='rooms_image'").fetchone()
        assert migrations.check(conn, db_schema)["ok"]


def test_seed_helpers_preserve_existing_and_add_new(tmp_path):
    path = tmp_path / "rooms.db"
    old_rooms(path)
    rows = [
        {"name": "Living room", "image_url": "seed image", "photo_credit": "Alice"},
        {"name": "Bedroom", "image_url": "bed image", "photo_credit": "Bob"},
    ]

    def seed(conn):
        migrations.insert_missing(conn, "rooms", rows, ("name",))
        migrations.backfill_nulls(conn, "rooms", rows, ("name",), ("image_url", "photo_credit"))

    with sqlite3.connect(path) as conn:
        migrations.initialize(conn, schema(seed=seed))
        conn.execute("UPDATE rooms SET image_url='user image', photo_credit=NULL WHERE id=42")
        migrations.initialize(conn, schema(seed=seed))
        assert conn.execute(
            "SELECT id, name, image_url, photo_credit FROM rooms ORDER BY id"
        ).fetchall() == [
            (42, "Living room", "user image", "Alice"),
            (43, "Bedroom", "bed image", "Bob"),
        ]
        assert migrations.insert_missing(conn, "rooms", rows, ("name",)) == 0
        assert (
            migrations.backfill_nulls(conn, "rooms", rows, ("name",), ("image_url", "photo_credit"))
            == 0
        )


@pytest.mark.parametrize(
    "declaration",
    [
        "required TEXT NOT NULL",
        "required TEXT UNIQUE",
        "required TEXT NOT NULL DEFAULT NULL",
        "required TEXT GENERATED ALWAYS AS (name || '!') VIRTUAL",
        "required TEXT NOT NULL DEFAULT (lower('ABC'))",
    ],
)
def test_unsafe_columns_report_and_leave_existing_table_unchanged(tmp_path, declaration):
    path = tmp_path / "unsafe.db"
    old_rooms(path)
    sql = f"CREATE TABLE IF NOT EXISTS rooms (id INTEGER PRIMARY KEY, name TEXT, {declaration});"
    with sqlite3.connect(path) as conn:
        before = conn.execute("SELECT sql FROM sqlite_master WHERE name='rooms'").fetchone()
        report = migrations.check(conn, schema(sql))
        assert report["missing_columns"] == {"rooms": ["required"]}
        assert "explicit versioned migration" in report["unsafe"][0]
        with pytest.raises(migrations.MigrationError, match="rooms.*required.*versioned migration"):
            migrations.initialize(conn, schema(sql))
        assert conn.execute("SELECT sql FROM sqlite_master WHERE name='rooms'").fetchone() == before
        assert conn.execute("SELECT * FROM rooms").fetchall() == [(42, "Living room")]


def test_constant_and_current_timestamp_defaults(tmp_path):
    path = tmp_path / "default.db"
    old_rooms(path)
    sql = """CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY, name TEXT,
        quantity INTEGER NOT NULL DEFAULT 7,
        created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );"""
    with sqlite3.connect(path) as conn:
        migrations.initialize(conn, schema(sql))
        value = conn.execute("SELECT quantity, created FROM rooms").fetchone()
        assert value[0] == 7
        assert len(value[1]) == 19


def test_versioned_migrations_order_transaction_and_retry(tmp_path):
    path = tmp_path / "versions.db"
    calls = []

    def first(conn):
        calls.append(1)
        conn.execute("INSERT INTO entries VALUES ('first')")

    def second(conn):
        calls.append(2)
        conn.execute("INSERT INTO entries VALUES ('rolled back')")
        raise ValueError("broken transform")

    sql = "CREATE TABLE IF NOT EXISTS entries (value TEXT);"
    versions = [migrations.Migration(2, "second", second), migrations.Migration(1, "first", first)]
    with sqlite3.connect(path) as conn:
        with pytest.raises(
            migrations.MigrationError, match="Migration 2.*second.*broken transform"
        ):
            migrations.initialize(conn, schema(sql, versions=versions))
        assert calls == [1, 2]
        assert conn.execute("SELECT * FROM entries").fetchall() == [("first",)]
        assert conn.execute("SELECT version FROM schema_migrations").fetchall() == [(1,)]
        assert migrations.check(conn, schema(sql, versions=versions))["pending_migrations"] == [2]
        good = migrations.Migration(
            2, "second", lambda c: c.execute("INSERT INTO entries VALUES ('second')")
        )
        migrations.initialize(conn, schema(sql, versions=[good, versions[1]]))
        migrations.initialize(conn, schema(sql, versions=[good, versions[1]]))
        assert calls == [1, 2]
        assert conn.execute("SELECT * FROM entries").fetchall() == [("first",), ("second",)]
        with pytest.raises(migrations.MigrationError, match="Duplicate migration versions"):
            migrations.initialize(conn, schema(sql, versions=[good, good]))


def test_check_cli_is_read_only_and_one_json_line(tmp_path):
    import json

    path = tmp_path / "old space.db"
    old_rooms(path)
    before, mtime = path.read_bytes(), path.stat().st_mtime_ns
    env = dict(os.environ, DATABASE_PATH=str(path), DATABASE_URL="")
    script = (
        "import runpy; from app import db_schema; "
        f"db_schema.SCHEMA_SQL = {ROOMS!r}; db_schema.MIGRATIONS = []; "
        "db_schema.seed = lambda conn: None; "
        "runpy.run_module('app.migrate', run_name='__main__')"
    )
    result = subprocess.run(
        [sys.executable, "-c", script, "--check"],
        env=env,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 1, result.stderr
    assert len(result.stdout.splitlines()) == 1
    report = json.loads(result.stdout)
    assert report == {
        "ok": False,
        "missing_columns": {"rooms": ["image_url", "photo_credit"]},
        "missing_tables": [],
        "pending_migrations": [],
        "unsafe": [],
    }
    assert path.read_bytes() == before
    assert path.stat().st_mtime_ns == mtime
    result = subprocess.run([sys.executable, "-c", script], env=env, capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    result = subprocess.run(
        [sys.executable, "-c", script, "--check"], env=env, capture_output=True, text=True
    )
    assert result.returncode == 0, result.stderr
    assert json.loads(result.stdout)["ok"]


def test_check_missing_database_does_not_create_it(tmp_path):
    path = tmp_path / "missing.db"
    report = migrations.check(path, schema())
    assert report["missing_tables"] == ["rooms"]
    assert not report["ok"]
    assert not path.exists()


def test_quoted_names_comments_and_trigger(tmp_path):
    sql = """
    -- table and index include semicolons in comments and strings;
    CREATE TABLE IF NOT EXISTS "a""b" ("key" TEXT, "extra" TEXT DEFAULT 'x;y');
    CREATE TRIGGER IF NOT EXISTS trg AFTER INSERT ON "a""b"
    BEGIN UPDATE "a""b" SET "extra"='ok;' WHERE "key"=NEW."key"; END;
    """
    with sqlite3.connect(tmp_path / "quoted.db") as conn:
        conn.execute('CREATE TABLE "a""b" ("key" TEXT)')
        conn.execute('INSERT INTO "a""b" VALUES (?)', ("one",))
        migrations.initialize(conn, schema(sql))
        assert conn.execute('SELECT "extra" FROM "a""b"').fetchone()[0] == "x;y"
        conn.execute('INSERT INTO "a""b" ("key") VALUES (?)', ("two",))
        assert (
            conn.execute('SELECT "extra" FROM "a""b" WHERE "key"=?', ("two",)).fetchone()[0]
            == "ok;"
        )


def test_postgres_style_connection_skips_sqlite_reconciliation(tmp_path):
    class PostgresStyle:
        def __init__(self):
            self.conn = sqlite3.connect(tmp_path / "shim.db")
            self.sql = []

        def execute(self, sql, params=()):
            self.sql.append(sql)
            return self.conn.execute(sql, params)

        def commit(self):
            self.conn.commit()

    conn = PostgresStyle()
    versions = [
        migrations.Migration(
            1, "add entry", lambda c: c.execute("INSERT INTO entries VALUES ('migration')")
        )
    ]
    model = schema("CREATE TABLE IF NOT EXISTS entries (value TEXT)", versions=versions)
    migrations.initialize(conn, model)
    migrations.initialize(conn, model)
    assert conn.conn.execute("SELECT * FROM entries").fetchall() == [("migration",)]
    assert not any("PRAGMA" in sql.upper() for sql in conn.sql)
    conn.conn.close()


def test_table_level_foreign_key_requires_versioned_migration(tmp_path):
    path = tmp_path / "constraints.db"
    with sqlite3.connect(path) as conn:
        conn.execute("CREATE TABLE parent (id INTEGER PRIMARY KEY)")
        conn.execute("CREATE TABLE child (id INTEGER PRIMARY KEY)")
        model = schema("""CREATE TABLE IF NOT EXISTS parent (id INTEGER PRIMARY KEY);
            CREATE TABLE IF NOT EXISTS child (
                id INTEGER PRIMARY KEY, parent_id INTEGER,
                FOREIGN KEY (parent_id) REFERENCES parent(id)
            );""")
        with pytest.raises(migrations.MigrationError, match="child.*parent_id.*FOREIGN KEY"):
            migrations.initialize(conn, model)
        assert [r[1] for r in conn.execute("PRAGMA table_info(child)")] == ["id"]
