from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.models import User


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
	result = await db.execute(
		select(User).where(User.email == email, User.deleted_at.is_(None))
	)
	return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: UUID) -> User | None:
	result = await db.execute(
		select(User).where(User.id == user_id, User.deleted_at.is_(None))
	)
	return result.scalar_one_or_none()


async def get_user_by_reset_token_hash(db: AsyncSession, token_hash: str) -> User | None:
	result = await db.execute(
		select(User).where(User.password_reset_token_hash == token_hash, User.deleted_at.is_(None))
	)
	return result.scalar_one_or_none()


async def create_user(
	db: AsyncSession,
	email: str,
	password_hash: str,
) -> User:
	user = User(email=email, password_hash=password_hash)
	db.add(user)
	await db.commit()
	await db.refresh(user)
	return user
