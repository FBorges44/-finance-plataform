from uuid import UUID

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
    account = Account(user_id=user_id, name=name, institution=institution, account_type=account_type, balance=initial_balance)
    db.add(account)
    await db.commit()
    await db.refresh(account)
    return account
