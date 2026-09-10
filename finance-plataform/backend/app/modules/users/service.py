from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.modules.users import repository
from app.modules.users.models import User
from app.modules.users.schemas import UserCreate


async def create_user(db: AsyncSession, data: UserCreate) -> User:
	email = str(data.email).lower()
	existing_user = await repository.get_user_by_email(db, email)

	if existing_user:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="E-mail já cadastrado.",
		)

	if len(data.password) < 8:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail="A senha deve possuir pelo menos 8 caracteres.",
		)

	return await repository.create_user(db, email, hash_password(data.password))
