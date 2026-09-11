from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransactionCreate(BaseModel):
    account_id: UUID
    description: str = Field(min_length=1, max_length=160)
    category: str = Field(min_length=1, max_length=80)
    transaction_type: str = Field(pattern="^(income|expense)$")
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    transaction_date: date


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    account_id: UUID
    description: str
    category: str
    transaction_type: str
    amount: Decimal
    transaction_date: date
    created_at: datetime


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    category_type: str = Field(pattern="^(income|expense)$")


class CategoryResponse(CategoryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime


class TransactionUpdate(BaseModel):
    account_id: UUID
    description: str = Field(min_length=1, max_length=160)
    category: str = Field(min_length=1, max_length=80)
    transaction_type: str = Field(pattern="^(income|expense)$")
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    transaction_date: date
