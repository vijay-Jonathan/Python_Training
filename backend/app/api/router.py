from fastapi import APIRouter

from app.api import greeting, health

router = APIRouter()

router.include_router(health.router)
router.include_router(greeting.router)
