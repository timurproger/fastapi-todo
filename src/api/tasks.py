from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status

from service.task_servise import TaskService
from api.dependencies import dep_auth
from config.auth import security
from repositories.task_repository import TaskRepository
from schemas.tasks import STaskAdd, STask, STaskId, STaskUpdate

router = APIRouter(prefix='/tasks', tags=['Tasks'], dependencies=[dep_auth])


@router.post('')
async def add_task(
    task: STaskAdd,
    pyload=dep_auth ) -> STaskId:
    return await TaskService.add_task(task, pyload.sub)


@router.get('')
async def get_tasks(pyload=dep_auth) -> list[STask]:
    return await TaskService.get_tasks(pyload.sub)


@router.delete('/{task_id}')
async def delete_task(
    task_id: int,
    pyload=dep_auth) -> STaskId:

    return await TaskService.delete_task(task_id)


@router.get('/{task_id}')
async def get_one_task(
    task_id: int,
    pyload=dep_auth) -> STask:

    return await TaskService.get_one_task(task_id)


@router.put('/{task_id}')
async def update_task(
    task_id: int,
    task_data: STaskUpdate,
    pyload=dep_auth)->STask:

    return await TaskService.update_task(task_id, task_data)


