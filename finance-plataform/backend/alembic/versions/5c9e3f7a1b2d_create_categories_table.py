"""create categories table

Revision ID: 5c9e3f7a1b2d
Revises: 4b8d2e6f1a3c
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "5c9e3f7a1b2d"
down_revision: Union[str, Sequence[str], None] = "4b8d2e6f1a3c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=80), nullable=False),
        sa.Column("category_type", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint("category_type IN ('income', 'expense')", name="ck_categories_type"),
    )
    op.create_index(op.f("ix_categories_user_id"), "categories", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_categories_user_id"), table_name="categories")
    op.drop_table("categories")