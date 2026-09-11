from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.users import repository


async def login(db: AsyncSession, email: str, password: str) -> str:
    user = await repository.get_user_by_email(db, email.lower())

    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário desativado.",
        )

    return create_access_token(str(user.id))


async def create_demo_session(db: AsyncSession) -> str:
    demo_email = "demo@folio.local"
    user = await repository.get_user_by_email(db, demo_email)
    if user is None:
        user = await repository.create_user(db, demo_email, hash_password("folio-demo-session"))

    if not user.is_active:
        user.is_active = True
        await db.commit()

    return create_access_token(str(user.id))
