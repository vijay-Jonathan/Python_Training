"""Safe, additive SQLite schema evolution and versioned migrations."""

from __future__ import annotations

import re
import sqlite3
from collections.abc import Callable
from pathlib import Path
from typing import Any, NamedTuple


class MigrationError(RuntimeError):
    """A schema change requires author intervention."""


class Migration(NamedTuple):
    version: int
    name: str
    apply: Callable[[Any], None]


def _quote(identifier: str) -> str:
    return '"' + identifier.replace('"', '""') + '"'


def _statements(script: str) -> tuple[list[str], list[str]]:
    tables, rest = [], []
    current = ""

    def add(statement: str) -> None:
        leading = re.sub(r"^(?:\s|--[^\n]*(?:\n|$)|/\*.*?\*/)*", "", statement, flags=re.S)
        if not leading or leading == ";":
            return
        target = (
            tables if re.match(r"CREATE\s+(?:TEMP(?:ORARY)?\s+)?TABLE\b", leading, re.I) else rest
        )
        target.append(statement.strip())

    for char in script:
        current += char
        if char != ";" or not sqlite3.complete_statement(current):
            continue
        add(current)
        current = ""
    leading = re.sub(r"^(?:\s|--[^\n]*(?:\n|$)|/\*.*?\*/)*", "", current, flags=re.S)
    if leading:
        if not sqlite3.complete_statement(current + "\n;"):
            raise MigrationError("Incomplete SCHEMA_SQL statement")
        add(current + "\n;")
    return tables, rest


def _parts(sql: str) -> list[str]:
    """Split the contents of a CREATE TABLE definition at top-level commas."""
    start = sql.find("(")
    if start < 0:
        raise MigrationError(
            "Unsupported CREATE TABLE definition; write an explicit versioned migration"
        )
    depth, quote, parts, part = 1, None, [], start + 1
    i = part
    while i < len(sql):
        char = sql[i]
        if quote:
            if char == quote:
                if quote != "]" and i + 1 < len(sql) and sql[i + 1] == quote:
                    i += 1
                else:
                    quote = None
        elif sql[i : i + 2] == "--":
            end = sql.find("\n", i + 2)
            i = len(sql) if end < 0 else end
        elif sql[i : i + 2] == "/*":
            end = sql.find("*/", i + 2)
            i = len(sql) if end < 0 else end + 1
        elif char in "'\"`[":
            quote = "]" if char == "[" else char
        elif char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth == 0:
                parts.append(sql[part:i].strip())
                return parts
        elif char == "," and depth == 1:
            parts.append(sql[part:i].strip())
            part = i + 1
        i += 1
    raise MigrationError(
        "Unsupported CREATE TABLE definition; write an explicit versioned migration"
    )


_IDENTIFIER = re.compile(r'^\s*(?:"((?:[^"]|"")*)"|`((?:[^`]|``)*)`|\[([^]]+)\]|([^\s(]+))')


def _definitions(sql: str) -> dict[str, str]:
    definitions = {}
    for part in _parts(sql):
        part = re.sub(r"^(?:\s|--[^\n]*(?:\n|$)|/\*.*?\*/)*", "", part, flags=re.S)
        match = _IDENTIFIER.match(part)
        if not match:
            continue
        name = next(value for value in match.groups() if value is not None)
        name = name.replace('""', '"').replace("``", "`")
        if match.group(4) and name.upper() in {
            "CONSTRAINT",
            "PRIMARY",
            "UNIQUE",
            "CHECK",
            "FOREIGN",
        }:
            continue
        definitions[name.casefold()] = part
    return definitions


def _expected(tables: list[str]) -> sqlite3.Connection:
    conn = sqlite3.connect(":memory:")
    try:
        for statement in tables:
            conn.execute(statement)
    except Exception:
        conn.close()
        raise
    return conn


def _table_names(conn: sqlite3.Connection) -> dict[str, str]:
    return {
        row[0].casefold(): row[0]
        for row in conn.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
        )
    }


def _constant_default(default: str | None) -> bool:
    if default is None or default.upper() == "NULL":
        return False
    return bool(
        re.fullmatch(
            r"""(?:[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?|"""
            r"""'(?:[^']|'')*'|[xX]'[0-9a-fA-F]*'|TRUE|FALSE)""",
            default.strip(),
            re.I,
        )
    )


def _column_plan(
    expected: sqlite3.Connection, actual: sqlite3.Connection
) -> tuple[dict[str, list[str]], list[str], list[str], list[tuple[str, str, str | None]]]:
    missing: dict[str, list[str]] = {}
    missing_tables, unsafe, additions = [], [], []
    actual_tables = _table_names(actual)
    for table in _table_names(expected).values():
        real = actual_tables.get(table.casefold())
        if real is None:
            missing_tables.append(table)
            continue
        sql = expected.execute(
            "SELECT sql FROM sqlite_master WHERE type='table' AND name=?", (table,)
        ).fetchone()[0]
        definitions = _definitions(sql)
        table_constraints = any(
            re.match(r"^(?:CONSTRAINT\b.*?\s+)?(?:CHECK|FOREIGN\s+KEY)\s*\(", part, re.I | re.S)
            for part in _parts(sql)
        )
        existing = {
            row[1].casefold() for row in actual.execute(f"PRAGMA table_xinfo({_quote(real)})")
        }
        unique_columns = set()
        for index in expected.execute(f"PRAGMA index_list({_quote(table)})"):
            if index[2]:
                unique_columns.update(
                    row[2].casefold()
                    for row in expected.execute(f"PRAGMA index_info({_quote(index[1])})")
                    if row[2] is not None
                )
        for col in expected.execute(f"PRAGMA table_xinfo({_quote(table)})"):
            _, name, col_type, not_null, default, primary, hidden = col
            if name.casefold() in existing:
                continue
            missing.setdefault(table, []).append(name)
            definition = definitions.get(name.casefold())
            reason = None
            expression = None
            if primary or name.casefold() in unique_columns or hidden:
                reason = "PRIMARY KEY, UNIQUE, or generated columns cannot be added safely"
            elif table_constraints:
                reason = "table-level CHECK or FOREIGN KEY constraints cannot be added safely"
            elif not definition:
                reason = "column declaration could not be parsed"
            elif (
                not_null
                and not _constant_default(default)
                and (default is None or default.upper() == "NULL")
            ):
                reason = "NOT NULL has no non-NULL default"
            elif (
                default is not None and default.upper() != "NULL" and not _constant_default(default)
            ):
                # Only simple declarations can be rebuilt without losing constraints.
                identifier = _IDENTIFIER.match(definition)
                tail = definition[identifier.end() :].strip() if identifier else ""
                simple = re.fullmatch(
                    r"([A-Za-z][A-Za-z0-9_]*(?:\s*\(\s*\d+(?:\s*,\s*\d+)?\s*\))?)?"
                    r"\s*(?:NOT\s+NULL\s+)?DEFAULT\s+(CURRENT_TIMESTAMP|CURRENT_DATE|CURRENT_TIME)",
                    tail,
                    re.I,
                )
                if not simple:
                    reason = "non-constant default cannot be safely backfilled"
                else:
                    expression = simple.group(2).upper()
                    definition = _quote(name) + (" " + col_type if col_type else "")
            if reason:
                unsafe.append(
                    f"Table {table!r}, column {name!r}: {reason}; "
                    "write an explicit versioned migration"
                )
            else:
                additions.append((real, definition, expression))
    return missing, missing_tables, unsafe, additions


def _migrations(schema_module: Any) -> list[Migration]:
    migrations = sorted(getattr(schema_module, "MIGRATIONS", []), key=lambda item: item.version)
    versions = [item.version for item in migrations]
    if len(versions) != len(set(versions)):
        raise MigrationError("Duplicate migration versions; each version must be unique")
    return migrations


def initialize(conn: Any, schema_module: Any) -> None:
    tables, rest = _statements(schema_module.SCHEMA_SQL)
    migrations = _migrations(schema_module)
    for statement in tables:
        conn.execute(statement)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS schema_migrations "
        "(version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL)"
    )
    if isinstance(conn, sqlite3.Connection):
        expected = _expected(tables)
        try:
            _, _, unsafe, additions = _column_plan(expected, conn)
        finally:
            expected.close()
        if unsafe:
            raise MigrationError("; ".join(unsafe))
        # Group additive changes so a failed ALTER or backfill leaves no partial upgrade.
        conn.execute("SAVEPOINT reconcile_schema")
        try:
            for table, definition, expression in additions:
                try:
                    conn.execute(f"ALTER TABLE {_quote(table)} ADD COLUMN {definition}")
                    if expression:
                        match = _IDENTIFIER.match(definition)
                        name = next(value for value in match.groups() if value is not None)
                        name = name.replace('""', '"').replace("``", "`")
                        conn.execute(
                            f"UPDATE {_quote(table)} SET {_quote(name)} = {expression} "
                            f"WHERE {_quote(name)} IS NULL"
                        )
                except Exception as exc:
                    raise MigrationError(
                        f"Table {table!r}, column {definition!r}: {exc}; "
                        "write an explicit versioned migration"
                    ) from exc
            conn.execute("RELEASE SAVEPOINT reconcile_schema")
        except Exception:
            conn.execute("ROLLBACK TO SAVEPOINT reconcile_schema")
            conn.execute("RELEASE SAVEPOINT reconcile_schema")
            raise
    for statement in rest:
        conn.execute(statement)
    conn.commit()
    applied = {row[0] for row in conn.execute("SELECT version FROM schema_migrations").fetchall()}
    for migration in migrations:
        if migration.version in applied:
            continue
        conn.execute("SAVEPOINT apply_migration")
        try:
            migration.apply(conn)
            conn.execute(
                "INSERT INTO schema_migrations (version, name, applied_at) "
                "VALUES (?, ?, CURRENT_TIMESTAMP)",
                (migration.version, migration.name),
            )
            conn.execute("RELEASE SAVEPOINT apply_migration")
            conn.commit()
        except Exception as exc:
            conn.execute("ROLLBACK TO SAVEPOINT apply_migration")
            conn.execute("RELEASE SAVEPOINT apply_migration")
            raise MigrationError(
                f"Migration {migration.version} ({migration.name}) failed: {exc}"
            ) from exc
    try:
        schema_module.seed(conn)
    except MigrationError:
        raise
    except Exception as exc:
        raise MigrationError(
            f"seed() failed: {exc}. seed() runs after SCHEMA_SQL and MIGRATIONS and may only "
            "touch tables they create; add any missing table to SCHEMA_SQL and use "
            "insert_missing/backfill_nulls"
        ) from exc
    conn.commit()


def _where(row: dict, key: tuple[str, ...]) -> tuple[str, list]:
    if not key:
        raise ValueError("A natural key is required")
    clauses, values = [], []
    for column in key:
        value = row[column]
        if value is None:
            clauses.append(f"{_quote(column)} IS NULL")
        else:
            clauses.append(f"{_quote(column)} = ?")
            values.append(value)
    return " AND ".join(clauses), values


def insert_missing(conn: Any, table: str, rows: list[dict], key: tuple[str, ...]) -> int:
    inserted = 0
    for row in rows:
        where, values = _where(row, key)
        if conn.execute(f"SELECT 1 FROM {_quote(table)} WHERE {where}", values).fetchone():
            continue
        columns = list(row)
        conn.execute(
            f"INSERT INTO {_quote(table)} ({', '.join(map(_quote, columns))}) "
            f"VALUES ({', '.join('?' for _ in columns)})",
            [row[column] for column in columns],
        )
        inserted += 1
    return inserted


def backfill_nulls(
    conn: Any,
    table: str,
    rows: list[dict],
    key: tuple[str, ...],
    columns: tuple[str, ...] | list[str],
) -> int:
    updated = 0
    for row in rows:
        where, values = _where(row, key)
        selected = conn.execute(
            f"SELECT {', '.join(map(_quote, columns))} FROM {_quote(table)} WHERE {where}",
            values,
        ).fetchone()
        if selected is None:
            continue
        fill = [
            column
            for i, column in enumerate(columns)
            if selected[i] is None and row[column] is not None
        ]
        if not fill:
            continue
        # Guard each assignment against concurrent user edits.
        assignments = ", ".join(
            f"{_quote(column)} = COALESCE({_quote(column)}, ?)" for column in fill
        )
        conn.execute(
            f"UPDATE {_quote(table)} SET {assignments} WHERE {where}",
            [row[column] for column in fill] + values,
        )
        updated += 1
    return updated


def check(conn_or_path: sqlite3.Connection | str | Path, schema_module: Any) -> dict:
    tables, _ = _statements(schema_module.SCHEMA_SQL)
    migrations = _migrations(schema_module)
    expected = _expected(tables)
    close = not isinstance(conn_or_path, sqlite3.Connection)
    conn = None
    try:
        if close:
            path = Path(conn_or_path).resolve()
            if path.exists():
                conn = sqlite3.connect(path.as_uri() + "?mode=ro", uri=True)
            else:
                conn = sqlite3.connect(":memory:")
        else:
            conn = conn_or_path
        missing, missing_tables, unsafe, _ = _column_plan(expected, conn)
        names = _table_names(conn)
        applied = set()
        if "schema_migrations" in names:
            applied = {row[0] for row in conn.execute("SELECT version FROM schema_migrations")}
        pending = [item.version for item in migrations if item.version not in applied]
        return {
            "ok": not (missing or missing_tables or pending or unsafe),
            "missing_columns": missing,
            "missing_tables": missing_tables,
            "pending_migrations": pending,
            "unsafe": unsafe,
        }
    finally:
        expected.close()
        if close and conn is not None:
            conn.close()
