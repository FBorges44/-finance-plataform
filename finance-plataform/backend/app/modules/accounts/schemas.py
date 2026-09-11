from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AccountCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    institution: str = Field(min_length=1, max_length=120)
    account_type: str = Field(min_length=1, max_length=40)
    initial_balance: Decimal = Field(default=Decimal("0"), max_digits=14, decimal_places=2)


class AccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    institution: str
    account_type: str
    balance: Decimal
    created_at: datetime


class AccountUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    institution: str = Field(min_length=1, max_length=120)
    account_type: str = Field(min_length=1, max_length=40)
