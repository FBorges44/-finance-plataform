from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.transactions import service
from app.modules.transactions.schemas import CategoryCreate, CategoryResponse, TransactionCreate, TransactionResponse, TransactionUpdate
from app.modules.users.models import User


router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/categories", response_model=list[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await service.list_categories(db, user.id)


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await service.create_category(db, user.id, data.name, data.category_type)


@router.get("", response_model=list[TransactionResponse])
async def list_transactions(
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[TransactionResponse]:
    return await service.list_transactions(db, user.id, limit)


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    data: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> TransactionResponse:
    return await service.create_transaction(
        db,
        user.id,
        data.account_id,
        data.description,
        data.category,
        data.transaction_type,
        data.amount,
        data.transaction_date,
    )


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(transaction_id: UUID, data: TransactionUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return await service.update_transaction(db, user.id, transaction_id, data)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: UUID, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        await service.delete_transaction(db, user.id, transaction_id)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
