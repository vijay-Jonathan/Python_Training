from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class Greeting(BaseModel):
    message: str


@router.get("/greeting", response_model=Greeting)
def get_greeting() -> Greeting:
    return Greeting(message="Hello, World!")
