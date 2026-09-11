from decimal import Decimal

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    net_worth: Decimal = Decimal("0")
    total_balance: Decimal = Decimal("0")
    income: Decimal = Decimal("0")
    expenses: Decimal = Decimal("0")
    cash_flow: Decimal = Decimal("0")
    accounts_count: int = 0
    cards_count: int = 0
    transactions_count: int = 0
