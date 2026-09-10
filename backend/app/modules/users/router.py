from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.users import service
from app.modules.users.schemas import UserCreate, UserResponse


router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
	data: UserCreate,
	db: AsyncSession = Depends(get_db),
) -> UserResponse:
	return await service.create_user(db, data)
