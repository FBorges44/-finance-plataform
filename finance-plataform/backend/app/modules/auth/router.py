import asyncio

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.auth.schemas import LoginRequest, PasswordResetConfirm, PasswordResetRequest, SessionResponse
from app.modules.auth.service import (clear_failed_logins, create_demo_session, ensure_login_allowed, login, record_failed_login, request_password_reset, reset_password, send_password_reset_email)
from app.modules.users.models import User
from app.modules.users.schemas import UserResponse


router = APIRouter(prefix="/auth", tags=["Authentication"])


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(key=settings.auth_cookie_name, value=token, httponly=True, secure=settings.auth_cookie_secure, samesite=settings.auth_cookie_samesite, max_age=settings.access_token_expire_minutes * 60, path="/")


@router.post("/login", response_model=SessionResponse)
async def login_user(
    data: LoginRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> SessionResponse:
    client_ip = request.client.host if request.client else "unknown"
    email = str(data.email)
    ensure_login_allowed(email, client_ip)
    try:
        token = await login(db, email, data.password)
    except HTTPException as error:
        if error.status_code == status.HTTP_401_UNAUTHORIZED:
            record_failed_login(email, client_ip)
        raise
    clear_failed_logins(email, client_ip)
    set_session_cookie(response, token)
    return SessionResponse()


@router.post("/demo", response_model=SessionResponse)
async def demo_session(
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> SessionResponse:
    if settings.environment != "development":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Não encontrado.")
    token = await create_demo_session(db)
    set_session_cookie(response, token)
    return SessionResponse()


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> Response:
    response.delete_cookie(settings.auth_cookie_name, path="/")
    return response


@router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
async def password_reset_request(data: PasswordResetRequest, db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    token = await request_password_reset(db, str(data.email))
    if token:
        await asyncio.to_thread(send_password_reset_email, str(data.email), token)
    return {"detail": "Se houver uma conta para este e-mail, enviaremos as instruções de recuperação."}


@router.post("/password-reset/confirm", status_code=status.HTTP_204_NO_CONTENT)
async def password_reset_confirm(data: PasswordResetConfirm, db: AsyncSession = Depends(get_db)) -> Response:
    await reset_password(db, data.token, data.password)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserResponse)
async def current_user(user: User = Depends(get_current_user)) -> User:
    return user
