from fastapi import APIRouter, Depends
from datetime import date

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.dashboard.schemas import DashboardSummary
from app.modules.users.models import User
from app.modules.accounts.models import Account
from app.modules.transactions.models import Transaction


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def dashboard_summary(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DashboardSummary:
    result = await db.execute(
        select(func.coalesce(func.sum(Account.balance), 0), func.count(Account.id)).where(
            Account.user_id == user.id,
            Account.deleted_at.is_(None),
        )
    )
    total_balance, accounts_count = result.one()
    month_start = date.today().replace(day=1)
    transaction_result = await db.execute(
        select(
            func.coalesce(
                func.sum(case((Transaction.transaction_type == "income", Transaction.amount), else_=0)), 0
            ),
            func.coalesce(
                func.sum(case((Transaction.transaction_type == "expense", Transaction.amount), else_=0)), 0
            ),
            func.count(Transaction.id),
        ).where(
            Transaction.user_id == user.id,
            Transaction.transaction_date >= month_start,
        )
    )
    income, expenses, transactions_count = transaction_result.one()
    return DashboardSummary(
        total_balance=total_balance,
        net_worth=total_balance,
        income=income,
        expenses=expenses,
        cash_flow=income - expenses,
        accounts_count=accounts_count,
        transactions_count=transactions_count,
    )
