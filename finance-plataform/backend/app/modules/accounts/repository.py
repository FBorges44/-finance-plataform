from uuid import UUID

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.accounts.models import Account


async def list_accounts(db: AsyncSession, user_id: UUID) -> list[Account]:
    result = await db.execute(
        select(Account).where(Account.user_id == user_id, Account.deleted_at.is_(None)).order_by(Account.created_at)
    )
    return list(result.scalars().all())


async def create_account(
    db: AsyncSession,
    user_id: UUID,
    name: str,
    institution: str,
    account_type: str,
    initial_balance,
) -> Account:
    account = Account(user_id=user_id, name=name, institution=institution, account_type=account_type, balance=initial_balance, opening_balance=initial_balance)
    db.add(account)
    await db.commit()
    await db.refresh(account)
    return account


async def get_account(db: AsyncSession, user_id: UUID, account_id: UUID) -> Account | None:
    return await db.scalar(select(Account).where(Account.id == account_id, Account.user_id == user_id, Account.deleted_at.is_(None)))


async def update_account(db: AsyncSession, user_id: UUID, account_id: UUID, data) -> Account:
    account = await get_account(db, user_id, account_id)
    if account is None:
        raise ValueError("Account not found")
    account.name = data.name
    account.institution = data.institution
    account.account_type = data.account_type
    await db.commit()
    await db.refresh(account)
    return account


async def delete_account(db: AsyncSession, user_id: UUID, account_id: UUID) -> None:
    account = await get_account(db, user_id, account_id)
    if account is None:
        raise ValueError("Account not found")
    account.deleted_at = datetime.now(timezone.utc)
    await db.commit()
