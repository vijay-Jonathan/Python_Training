from typing import Literal

from pydantic import BaseModel


class Health(BaseModel):
    """The health payload, typed so it appears in the OpenAPI schema."""

    status: Literal["ok"] = "ok"
