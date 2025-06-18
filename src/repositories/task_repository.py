from datetime import datetime

from sqlalchemy import select, delete

from database.db import new_session
from models.tasks import TaskOrm
from schemas.tasks import STaskAdd, STask, STaskUpdate


class TaskRepository:
    @classmethod
    async def add_one(cls, data: STaskAdd, uid: int) -> int:
        async with new_session() as session:
            task_dict = data.model_dump()
            print(task_dict)
            task_dict["user_id"] = uid
            task_dict["created_at"] = datetime.utcnow()
            task_dict["is_done"] = False

            task = TaskOrm(**task_dict)

            session.add(task)
            await session.flush()
            await session.commit()
            return task.id

    @classmethod
    async def find_all(cls, uid:int) -> list[STask]:
        async with new_session() as session:
            query = select(TaskOrm).where(TaskOrm.user_id == uid)
            result = await session.execute(query)
            task_models = result.scalars().all()
            #task_schemas = [STask.from_orm(task_model) for task_model in task_models]
            return task_models

    @classmethod
    async def delete_by_id(cls, task_id: int) -> bool:
        async with new_session() as session:
            query = delete(TaskOrm).where(TaskOrm.id == task_id)
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0

    @classmethod
    async def get_one(cls, task_id: int) -> STask | None:
        async with new_session() as session:
            query = select(TaskOrm).where(TaskOrm.id == task_id)
            result = await session.execute(query)
            task = result.scalar_one_or_none()
            return task

    @classmethod
    async def update_one(cls, task_id: int, task_data: STaskUpdate):
        async with new_session() as session:
            task_dict = task_data.model_dump()
            query = select(TaskOrm).where(TaskOrm.id == task_id)
            result = await session.execute(query)
            task = result.scalar_one_or_none()

            if task is None:
                return None  # или можно raise HTTPException(status_code=404)

            for key, value in task_dict.items():
                if hasattr(task, key) and value is not None:
                    setattr(task, key, value)

            await session.commit()
            await session.refresh(task)
            return task

