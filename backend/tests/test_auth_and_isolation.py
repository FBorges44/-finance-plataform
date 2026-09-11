from unittest.mock import AsyncMock
from uuid import uuid4

import jwt
import pytest
from sqlalchemy.dialects import postgresql

from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.modules.accounts import repository


def test_access_token_round_trip():
    user_id = str(uuid4())
    token = create_access_token(user_id)

    payload = decode_access_token(token)

    assert payload["sub"] == user_id
    assert payload["type"] == "access"


def test_invalid_access_token_is_rejected():
    with pytest.raises(jwt.PyJWTError):
        decode_access_token("not-a-valid-token")


@pytest.mark.asyncio
async def test_account_query_is_scoped_to_user():
    db = AsyncMock()
    result = AsyncMock()
    result.scalars.return_value.all.return_value = []
    db.execute.return_value = result
    user_id = uuid4()

    await repository.list_accounts(db, user_id)

    statement = db.execute.await_args.args[0]
    sql = str(statement.compile(dialect=postgresql.dialect()))
    assert "accounts.user_id" in sql
    assert "accounts.deleted_at IS NULL" in sql
    assert statement.compile().params["user_id_1"] == user_id
