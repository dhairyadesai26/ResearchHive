"""Initial migration

Revision ID: 2cc3fe611200
Revises: 
Create Date: 2026-07-29 17:22:05.048887

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '2cc3fe611200'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('ResearchRun', 'id',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'runId',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'userId',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'topic',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'status',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'createdAt',
               existing_type=postgresql.TIMESTAMP(precision=3),
               type_=sa.DateTime(timezone=True),
               existing_nullable=False,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))
    op.alter_column('ResearchRun', 'updatedAt',
               existing_type=postgresql.TIMESTAMP(precision=3),
               type_=sa.DateTime(timezone=True),
               existing_nullable=False)
    op.drop_index(op.f('ResearchRun_runId_key'), table_name='ResearchRun')
    op.create_unique_constraint(None, 'ResearchRun', ['runId'])


def downgrade() -> None:
    op.drop_constraint(None, 'ResearchRun', type_='unique')
    op.create_index(op.f('ResearchRun_runId_key'), 'ResearchRun', ['runId'], unique=True)
    op.alter_column('ResearchRun', 'updatedAt',
               existing_type=sa.DateTime(timezone=True),
               type_=postgresql.TIMESTAMP(precision=3),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'createdAt',
               existing_type=sa.DateTime(timezone=True),
               type_=postgresql.TIMESTAMP(precision=3),
               existing_nullable=False,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))
    op.alter_column('ResearchRun', 'status',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'topic',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'userId',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'runId',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
    op.alter_column('ResearchRun', 'id',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
