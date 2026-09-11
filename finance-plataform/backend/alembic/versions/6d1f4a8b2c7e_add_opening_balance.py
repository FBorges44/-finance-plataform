"""add opening balance to accounts

Revision ID: 6d1f4a8b2c7e
Revises: 5c9e3f7a1b2d
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "6d1f4a8b2c7e"
down_revision: Union[str, Sequence[str], None] = "5c9e3f7a1b2d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("accounts", sa.Column("opening_balance", sa.Numeric(14, 2), nullable=False, server_default="0"))
    op.execute("UPDATE accounts SET opening_balance = balance")
    op.alter_column("accounts", "opening_balance", server_default=None)


def downgrade() -> None:
    op.drop_column("accounts", "opening_balance")