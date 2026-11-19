from fastapi import APIRouter

from app.schemas.health import Health

router = APIRouter(tags=["health"])


@router.get("/health", response_model=Health, summary="Liveness check")
def health() -> Health:
    """Reports that the API process is up and serving.

    The platform builds and validates a generated application against this endpoint, so it
    must keep returning 200 with ``{"status": "ok"}``.
    """
    return Health()
