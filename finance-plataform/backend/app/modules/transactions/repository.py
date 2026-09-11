from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.accounts.models import Account
from app.modules.transactions.models import Category, Transaction


async def list_categories(db: AsyncSession, user_id: UUID) -> list[Category]:
    result = await db.execute(select(Category).where(Category.user_id == user_id).order_by(Category.name))
    return list(result.scalars().all())


async def create_category(db: AsyncSession, user_id: UUID, name: str, category_type: str) -> Category:
    category = Category(user_id=user_id, name=name, category_type=category_type)
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


async def list_transactions(
    db: AsyncSession,
    user_id: UUID,
    limit: int = 100,
) -> list[Transaction]:
    result = await db.execute(
        select(Transaction)
        .where(Transaction.user_id == user_id)
        .order_by(Transaction.transaction_date.desc(), Transaction.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


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
    account_result = await db.execute(
        select(Account)
        .where(Account.id == account_id, Account.user_id == user_id, Account.deleted_at.is_(None))
        .with_for_update()
    )
    account = account_result.scalar_one_or_none()
    if account is None:
        raise ValueError("Account not found")

    transaction = Transaction(
        user_id=user_id,
        account_id=account_id,
        description=description,
        category=category,
        transaction_type=transaction_type,
        amount=amount,
        transaction_date=transaction_date,
    )
    db.add(transaction)
    await db.commit()
    await recalculate_account_balance(db, account_id, user_id)
    await db.refresh(transaction)
    return transaction


async def get_transaction(db: AsyncSession, user_id: UUID, transaction_id: UUID) -> Transaction | None:
    return await db.scalar(select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == user_id))


async def recalculate_account_balance(db: AsyncSession, account_id: UUID, user_id: UUID) -> None:
    account = await db.scalar(select(Account).where(Account.id == account_id, Account.user_id == user_id, Account.deleted_at.is_(None)).with_for_update())
    if account is None:
        raise ValueError("Account not found")
    total = await db.scalar(select(func.coalesce(func.sum(case((Transaction.transaction_type == "income", Transaction.amount), else_=-Transaction.amount)), 0)).where(Transaction.account_id == account_id, Transaction.user_id == user_id))
    account.balance = account.opening_balance + (total or Decimal("0"))
    await db.commit()


async def update_transaction(db: AsyncSession, user_id: UUID, transaction_id: UUID, data) -> Transaction:
    transaction = await get_transaction(db, user_id, transaction_id)
    if transaction is None:
        raise ValueError("Transaction not found")
    old_account_id = transaction.account_id
    account = await db.scalar(select(Account).where(Account.id == data.account_id, Account.user_id == user_id, Account.deleted_at.is_(None)))
    if account is None:
        raise ValueError("Account not found")
    for field in ("account_id", "description", "category", "transaction_type", "amount", "transaction_date"):
        setattr(transaction, field, getattr(data, field))
    await db.commit()
    await recalculate_account_balance(db, old_account_id, user_id)
    if old_account_id != data.account_id:
        await recalculate_account_balance(db, data.account_id, user_id)
    await db.refresh(transaction)
    return transaction


async def delete_transaction(db: AsyncSession, user_id: UUID, transaction_id: UUID) -> None:
    transaction = await get_transaction(db, user_id, transaction_id)
    if transaction is None:
        raise ValueError("Transaction not found")
    account_id = transaction.account_id
    await db.delete(transaction)
    await db.commit()
    await recalculate_account_balance(db, account_id, user_id)
