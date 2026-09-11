from datetime import date

from fastapi import APIRouter, Depends, status
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.accounts.models import Account
from app.modules.planning.models import Budget, Goal, Investment
from app.modules.planning.schemas import BudgetCreate, BudgetResponse, GoalCreate, GoalResponse, InvestmentCreate, InvestmentResponse, ReportResponse
from app.modules.transactions.models import Transaction
from app.modules.users.models import User

router = APIRouter(tags=["Planning"])


@router.get("/goals", response_model=list[GoalResponse])
async def list_goals(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Goal).where(Goal.user_id == user.id).order_by(Goal.created_at.desc()))
    return list(result.scalars().all())


@router.post("/goals", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(data: GoalCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    goal = Goal(user_id=user.id, **data.model_dump())
    db.add(goal)
    await db.commit()
    await db.refresh(goal)
    return goal


@router.get("/budgets", response_model=list[BudgetResponse])
async def list_budgets(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Budget).where(Budget.user_id == user.id).order_by(Budget.month.desc()))
    budgets = list(result.scalars().all())
    response = []
    for budget in budgets:
        spent = await db.scalar(select(func.coalesce(func.sum(Transaction.amount), 0)).where(Transaction.user_id == user.id, Transaction.category == budget.category, Transaction.transaction_type == "expense", Transaction.transaction_date >= budget.month, Transaction.transaction_date < date(budget.month.year + (budget.month.month == 12), budget.month.month % 12 + 1, 1)))
        response.append(BudgetResponse.model_validate(budget).model_copy(update={"spent_amount": spent or 0}))
    return response


@router.post("/budgets", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget(data: BudgetCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    budget = Budget(user_id=user.id, **data.model_dump())
    db.add(budget)
    await db.commit()
    await db.refresh(budget)
    return budget


@router.get("/investments", response_model=list[InvestmentResponse])
async def list_investments(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Investment).where(Investment.user_id == user.id).order_by(Investment.created_at.desc()))
    return list(result.scalars().all())


@router.post("/investments", response_model=InvestmentResponse, status_code=status.HTTP_201_CREATED)
async def create_investment(data: InvestmentCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    investment = Investment(user_id=user.id, **data.model_dump())
    db.add(investment)
    await db.commit()
    await db.refresh(investment)
    return investment


@router.get("/reports/summary", response_model=ReportResponse)
async def report_summary(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    totals = await db.execute(select(func.coalesce(func.sum(case((Transaction.transaction_type == "income", Transaction.amount), else_=0)), 0), func.coalesce(func.sum(case((Transaction.transaction_type == "expense", Transaction.amount), else_=0)), 0)).where(Transaction.user_id == user.id))
    income, expenses = totals.one()
    account_balance = await db.scalar(select(func.coalesce(func.sum(Account.balance), 0)).where(Account.user_id == user.id, Account.deleted_at.is_(None)))
    investments = await db.scalar(select(func.coalesce(func.sum(Investment.amount), 0)).where(Investment.user_id == user.id))
    categories = await db.execute(select(Transaction.category, func.sum(Transaction.amount)).where(Transaction.user_id == user.id, Transaction.transaction_type == "expense").group_by(Transaction.category))
    return ReportResponse(income=income, expenses=expenses, cash_flow=income - expenses, account_balance=account_balance or 0, investments=investments or 0, net_worth=(account_balance or 0) + (investments or 0), by_category={category: amount for category, amount in categories.all()})