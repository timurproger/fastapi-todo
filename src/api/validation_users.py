from typing import Annotated


from fastapi import HTTPException, APIRouter, Depends

from service.user_service import UserService
from src.api.dependencies import dep_auth
from src.repositories.user_repository import UserRepository
from src.schemas.users import SUserLogin, UserRole, SUsers, SUserDel

router = APIRouter(prefix='/users', tags=['Users'], dependencies=[dep_auth])



@router.get('')
async def get_users(pyload=dep_auth)-> list[SUsers]:
    return await UserService.get_users(pyload.role)


@router.put('/change_password', response_model=SUsers)
async def change_password(
    data: Annotated[SUserLogin, Depends()],
    pyload=dep_auth):
    return await UserService.change_password(user_id=int(pyload.sub), data=data)


@router.delete('/delete_user/{username}')
async def delete_user(username, pyload=dep_auth) -> SUserDel:
    return await UserService.delete_user(username, pyload)









