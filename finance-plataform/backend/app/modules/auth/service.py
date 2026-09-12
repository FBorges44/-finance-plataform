import hashlib
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.users import repository


_failed_login_attempts: dict[str, list[datetime]] = {}


def _attempt_key(email: str, client_ip: str) -> str:
    return f"{email.lower()}:{client_ip}"


def ensure_login_allowed(email: str, client_ip: str) -> None:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(minutes=settings.login_window_minutes)
    key = _attempt_key(email, client_ip)
    attempts = [attempt for attempt in _failed_login_attempts.get(key, []) if attempt > cutoff]
    _failed_login_attempts[key] = attempts
    if len(attempts) >= settings.login_max_attempts:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Muitas tentativas. Tente novamente mais tarde.")


def record_failed_login(email: str, client_ip: str) -> None:
    key = _attempt_key(email, client_ip)
    _failed_login_attempts.setdefault(key, []).append(datetime.now(timezone.utc))


def clear_failed_logins(email: str, client_ip: str) -> None:
    _failed_login_attempts.pop(_attempt_key(email, client_ip), None)


async def login(db: AsyncSession, email: str, password: str) -> str:
    user = await repository.get_user_by_email(db, email.lower())

    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário desativado.",
        )

    return create_access_token(str(user.id))


async def request_password_reset(db: AsyncSession, email: str) -> str | None:
    user = await repository.get_user_by_email(db, email.lower())
    if user is None or not user.is_active:
        return None

    token = secrets.token_urlsafe(32)
    user.password_reset_token_hash = hashlib.sha256(token.encode()).hexdigest()
    user.password_reset_expires_at = datetime.now(timezone.utc) + timedelta(minutes=20)
    await db.commit()
    return token


async def reset_password(db: AsyncSession, token: str, password: str) -> None:
    if len(password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A senha deve possuir pelo menos 8 caracteres.")
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    user = await repository.get_user_by_reset_token_hash(db, token_hash)
    if user is None or user.password_reset_expires_at is None or user.password_reset_expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Link de recuperação inválido ou expirado.")
    user.password_hash = hash_password(password)
    user.password_reset_token_hash = None
    user.password_reset_expires_at = None
    await db.commit()


def send_password_reset_email(email: str, token: str) -> None:
    if not all([settings.smtp_host, settings.smtp_from_email]):
        return
    message = EmailMessage()
    message["Subject"] = "Redefina sua senha do Folio"
    message["From"] = settings.smtp_from_email
    message["To"] = email
    reset_url = f"{settings.frontend_url.rstrip('/')}/reset-password?token={token}"
    message.set_content(f"Use este link para redefinir sua senha (válido por 20 minutos): {reset_url}")
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
        server.starttls()
        if settings.smtp_username and settings.smtp_password:
            server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)


async def create_demo_session(db: AsyncSession) -> str:
    demo_email = "demo@folio.local"
    user = await repository.get_user_by_email(db, demo_email)
    if user is None:
        user = await repository.create_user(db, demo_email, hash_password("folio-demo-session"))

    if not user.is_active:
        user.is_active = True
        await db.commit()

    return create_access_token(str(user.id))
