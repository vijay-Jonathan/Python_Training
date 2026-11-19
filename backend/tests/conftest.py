"""Test isolation: each test gets its own SQLite database, and a client.

The lifespan that calls ``init_db`` only runs when TestClient is used as a
context manager, and most tests build a plain client — so this fixture points
``settings.database_path`` at a tmp file and initialises it directly.

``client`` is here for a reason beyond convenience. Without it every suite
written against this template needs one, and the cheapest way to add a fixture
is to write ``conftest.py`` — which replaces this file and takes the isolation
above with it. The tests can then seed the real ``data/app.db`` instead of an
isolated database. Shipping the fixture removes the reason to rewrite the file.
"""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.db import init_db
from app.main import app


@pytest.fixture(autouse=True)
def _isolated_db(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr(settings, "database_path", str(tmp_path / "test.db"))
    init_db()


@pytest.fixture()
def client(_isolated_db: None) -> Iterator[TestClient]:
    """The app under test, against this test's own seeded database.

    A context manager, so the lifespan runs and the app is exercised the way
    it starts for real. Depends on ``_isolated_db`` so the database is pointed
    somewhere temporary before the app opens it.
    """
    with TestClient(app) as test_client:
        yield test_client
