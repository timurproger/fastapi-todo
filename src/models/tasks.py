from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, DeclarativeBase, mapped_column, relationship

from src.models.base import Model


class TaskOrm(Model):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[Optional[str]]

    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    deadline: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    is_done: Mapped[bool] = mapped_column(default=False)
    task_type: Mapped[str] = mapped_column(default="general")  # например, "work", "home", и т.п.

    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    user = relationship("UserOrm", back_populates="tasks")