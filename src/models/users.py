
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Model
from src.models.tasks import TaskOrm


class UserOrm(Model):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str]
    password: Mapped[str]
    role: Mapped[str]
    ip: Mapped[str]
    tasks: Mapped[list["TaskOrm"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )