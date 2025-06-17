from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class STaskAdd(BaseModel):
    name: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    task_type: Optional[str] = Field(default="general", description="Тип задачи (например, work, home, study)")


class STask(STaskAdd):
    id: int
    created_at: datetime
    is_done: bool = False

    class Config:
        from_attributes = True  # Позволяет создавать из ORM-объектов

class STaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_done: Optional[bool] = None
    due_time: Optional[datetime] = None
    type: Optional[str] = None

class STaskId(BaseModel):
    ok: bool = True
    task_id: int
