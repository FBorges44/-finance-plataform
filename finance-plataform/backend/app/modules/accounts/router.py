from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.accounts import service
from app.modules.accounts.schemas import AccountCreate, AccountResponse, AccountUpdate
from app.modules.users.models import User

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("", response_model=list[AccountResponse])
async def list_accounts(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[AccountResponse]:
    return await service.list_accounts(db, user)


@router.post("", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
async def create_account(
    data: AccountCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> AccountResponse:
    return await service.create_account(db, user, data)


@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(account_id: UUID, data: AccountUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return await service.update_account(db, user, account_id, data)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(account_id: UUID, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        await service.delete_account(db, user, account_id)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
