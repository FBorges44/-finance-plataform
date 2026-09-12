"""add password reset fields

Revision ID: 7e2a9c5d1f3b
Revises: 6d1f4a8b2c7e
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7e2a9c5d1f3b"
down_revision: Union[str, Sequence[str], None] = "6d1f4a8b2c7e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("password_reset_token_hash", sa.String(length=64), nullable=True))
    op.add_column("users", sa.Column("password_reset_expires_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_users_password_reset_token_hash", "users", ["password_reset_token_hash"])


def downgrade() -> None:
    op.drop_index("ix_users_password_reset_token_hash", table_name="users")
    op.drop_column("users", "password_reset_expires_at")
    op.drop_column("users", "password_reset_token_hash")
