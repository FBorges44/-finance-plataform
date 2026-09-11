from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.accounts import repository
from app.modules.accounts.models import Account
from app.modules.accounts.schemas import AccountCreate
from app.modules.users.models import User


async def list_accounts(db: AsyncSession, user: User) -> list[Account]:
    return await repository.list_accounts(db, user.id)


async def create_account(db: AsyncSession, user: User, data: AccountCreate) -> Account:
    return await repository.create_account(
        db, user.id, data.name, data.institution, data.account_type, data.initial_balance
    )


async def update_account(db: AsyncSession, user: User, account_id, data):
    return await repository.update_account(db, user.id, account_id, data)


async def delete_account(db: AsyncSession, user: User, account_id) -> None:
    await repository.delete_account(db, user.id, account_id)
