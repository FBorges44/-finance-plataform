from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.auth.schemas import LoginRequest, TokenResponse
from app.modules.auth.service import create_demo_session, login
from app.modules.users.models import User
from app.modules.users.schemas import UserResponse


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login_user(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    token = await login(db, str(data.email), data.password)
    return TokenResponse(access_token=token)


@router.post("/demo", response_model=TokenResponse)
async def demo_session(
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    token = await create_demo_session(db)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def current_user(user: User = Depends(get_current_user)) -> User:
    return user
