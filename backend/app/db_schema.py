"""The application's schema and seed data — the builder owns this file.

Rules for whoever writes it:
- ``SCHEMA_SQL`` contains CREATE statements with IF NOT EXISTS. Add nullable
  or safely defaulted columns to CREATE TABLE; SQLite reconciles them at startup.
- For NOT NULL without a default, renames, type changes, or data transforms,
  append a Migration with a new higher version. Never edit an applied migration.
- ``seed(conn)`` is idempotent by natural key: use ``insert_missing`` and
  ``backfill_nulls`` from ``app.migrations``. Never return early because a table
  is non-empty, never overwrite existing values, and only access tables created
  by ``SCHEMA_SQL`` or ``MIGRATIONS``.
"""

SCHEMA_SQL = ""
MIGRATIONS: list = []


def seed(conn) -> None:
    pass
