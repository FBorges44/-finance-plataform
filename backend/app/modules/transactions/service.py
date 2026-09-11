from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.transactions import repository
from app.modules.transactions.models import Category, Transaction


async def list_transactions(db: AsyncSession, user_id: UUID, limit: int) -> list[Transaction]:
    return await repository.list_transactions(db, user_id, limit)


async def list_categories(db: AsyncSession, user_id: UUID) -> list[Category]:
    return await repository.list_categories(db, user_id)


async def create_category(db: AsyncSession, user_id: UUID, name: str, category_type: str) -> Category:
    return await repository.create_category(db, user_id, name, category_type)


async def create_transaction(
    db: AsyncSession,
    user_id: UUID,
    account_id: UUID,
    description: str,
    category: str,
    transaction_type: str,
    amount: Decimal,
    transaction_date: date,
) -> Transaction:
    return await repository.create_transaction(
        db, user_id, account_id, description, category, transaction_type, amount, transaction_date
    )


async def update_transaction(db: AsyncSession, user_id: UUID, transaction_id: UUID, data) -> Transaction:
    return await repository.update_transaction(db, user_id, transaction_id, data)


async def delete_transaction(db: AsyncSession, user_id: UUID, transaction_id: UUID) -> None:
    await repository.delete_transaction(db, user_id, transaction_id)
