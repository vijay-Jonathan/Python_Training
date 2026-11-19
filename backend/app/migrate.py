"""Apply or inspect the generated application's SQLite schema."""

import argparse
import json
import re
import sys

from app import db_schema, migrations
from app.config import settings
from app.db import init_db


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check", action="store_true", help="report SQLite schema drift without writing"
    )
    args = parser.parse_args()
    try:
        if args.check:
            if settings.database_url:
                raise migrations.MigrationError(
                    "Read-only drift checks are available for SQLite only"
                )
            report = migrations.check(settings.database_path, db_schema)
            print(json.dumps(report))
            return 0 if report["ok"] else 1
        init_db()
        return 0
    except migrations.MigrationError as exc:
        message = str(exc)
        if settings.database_url:
            message = message.replace(settings.database_url, "[redacted]")
        message = re.sub(
            r"\b(?:postgres(?:ql)?|sqlite)://[^\s]+", "[redacted]", message, flags=re.I
        )
        print(message, file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
