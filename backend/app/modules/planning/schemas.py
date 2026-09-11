from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GoalCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    target_amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    current_amount: Decimal = Field(default=Decimal("0"), ge=0, max_digits=14, decimal_places=2)
    deadline: date | None = None


class GoalResponse(GoalCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    created_at: datetime


class BudgetCreate(BaseModel):
    category: str = Field(min_length=1, max_length=80)
    limit_amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    month: date


class BudgetResponse(BudgetCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    created_at: datetime
    spent_amount: Decimal = Decimal("0")


class InvestmentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    asset_type: str = Field(min_length=1, max_length=60)
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    institution: str = Field(min_length=1, max_length=120)


class InvestmentResponse(InvestmentCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    created_at: datetime


class ReportResponse(BaseModel):
    income: Decimal = Decimal("0")
    expenses: Decimal = Decimal("0")
    cash_flow: Decimal = Decimal("0")
    account_balance: Decimal = Decimal("0")
    investments: Decimal = Decimal("0")
    net_worth: Decimal = Decimal("0")
    by_category: dict[str, Decimal] = {}