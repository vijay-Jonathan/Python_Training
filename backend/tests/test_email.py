"""The baseline supports generated models using Pydantic EmailStr."""

import pytest
from pydantic import BaseModel, EmailStr, ValidationError


class Contact(BaseModel):
    email: EmailStr


def test_emailstr_validates_email_addresses() -> None:
    assert Contact(email="person@example.com").email == "person@example.com"
    with pytest.raises(ValidationError):
        Contact(email="not-an-email")
