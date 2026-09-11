"""create planning tables

Revision ID: 4b8d2e6f1a3c
Revises: 3a7c9d1e4b2f
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "4b8d2e6f1a3c"
down_revision: Union[str, Sequence[str], None] = "3a7c9d1e4b2f"
branch_labels = None
depends_on = None

def upgrade() -> None:
    for table, columns in {
        "goals": [sa.Column("name", sa.String(120), nullable=False), sa.Column("target_amount", sa.Numeric(14, 2), nullable=False), sa.Column("current_amount", sa.Numeric(14, 2), nullable=False), sa.Column("deadline", sa.Date(), nullable=True)],
        "budgets": [sa.Column("category", sa.String(80), nullable=False), sa.Column("limit_amount", sa.Numeric(14, 2), nullable=False), sa.Column("month", sa.Date(), nullable=False)],
        "investments": [sa.Column("name", sa.String(120), nullable=False), sa.Column("asset_type", sa.String(60), nullable=False), sa.Column("amount", sa.Numeric(14, 2), nullable=False), sa.Column("institution", sa.String(120), nullable=False)],
    }.items():
        op.create_table(table, sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=False), *columns, sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
        op.create_index(f"ix_{table}_user_id", table, ["user_id"])

def downgrade() -> None:
    for table in ("investments", "budgets", "goals"):
        op.drop_index(f"ix_{table}_user_id", table_name=table)
        op.drop_table(table)