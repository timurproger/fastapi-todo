from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status

from src.api.dependencies import dep_auth
from src.config.auth import security
from src.repository.task_repository import TaskRepository
from src.schemas.tasks import STaskAdd, STask, STaskId, STaskUpdate

router = APIRouter(prefix='/tasks', tags=['Tasks'], dependencies=[dep_auth])


@router.post('')
async def add_task(
    task: STaskAdd,
        pyload=dep_auth ) -> STaskId:
    uid = pyload.sub
    print(uid)
    task_id = await TaskRepository.add_one(task, uid)
    return STaskId(ok=True, task_id=task_id)


@router.get('')
async def get_tasks(pyload=dep_auth) -> list[STask]:
    uid = int(pyload.sub)
    tasks = await TaskRepository.find_all(uid)
    return tasks


@router.delete('/{task_id}')
async def delete_task(
    task_id: int,
    pyload=dep_auth) -> STaskId:

    result = await TaskRepository.delete_by_id(task_id)
    if result:
        return STaskId(ok=True, task_id=task_id)
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Task with id={task_id} not found"
    )


@router.get('/{task_id}')
async def get_one_task(
    task_id: int,
    pyload=dep_auth) -> STask:

    task = await TaskRepository.get_one(task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id={task_id} not found"
        )
    return task


@router.put('/{task_id}')
async def update_task(
    task_id: int,
    task_data: Annotated[STaskUpdate, Depends()],
    pyload=dep_auth)->STask:
    task = await TaskRepository.update_one(task_id, task_data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

