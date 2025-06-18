from fastapi import HTTPException

from repositories.task_repository import TaskRepository
from schemas.tasks import STaskId, STaskAdd, STask, STaskUpdate


class TaskService:
    @classmethod
    async def add_task(cls, task: STaskAdd, uid: int) -> STaskId:
        task_id = await TaskRepository.add_one(task, uid)
        return STaskId(ok=True, task_id=task_id)

    @classmethod
    async def get_tasks(cls, uid: int) -> list[STask]:
        tasks = await TaskRepository.find_all(uid)
        return tasks

    @classmethod
    async def delete_task(cls, task_id:int):
        result = await TaskRepository.delete_by_id(task_id)
        if result:
            return STaskId(ok=True, task_id=task_id)
        raise HTTPException(
            status_code=404,
            detail=f"Task with id={task_id} not found"
        )

    @classmethod
    async def get_one_task(cls, task_id: int):
        task = await TaskRepository.get_one(task_id)
        if task is None:
            raise HTTPException(
                status_code=404,
                detail=f"Task with id={task_id} not found"
            )
        return task

    @classmethod
    async def update_task(cls, task_id: int, task_data: STaskUpdate,):
        task = await TaskRepository.update_one(task_id, task_data)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task