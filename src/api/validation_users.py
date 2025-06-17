from typing import Annotated


from fastapi import HTTPException, APIRouter, Depends


from src.api.dependencies import dep_auth
from src.repository.user_repository import UserRepository
from src.schemas.users import SUserLogin, UserRole, SUsers, SUserDel

router = APIRouter(prefix='/users', tags=['Users'], dependencies=[dep_auth])



@router.get('')
async def get_users(pyload=dep_auth)-> list[SUsers]:
    if UserRole.is_root_user(pyload.role):
        users = await UserRepository.find_all()
        return users
    else:
        raise HTTPException(status_code=401, detail="You don't have access")


@router.put('/change_password')
async def change_password(data: Annotated[SUserLogin, Depends()], pyload=dep_auth) -> SUsers:
    user_id = int(pyload.sub)
    print(user_id)
    user = await UserRepository.update_one(user_id, data)
    if user is None:
        raise HTTPException(status_code=401, detail="DB don't have this id")

    return user

@router.delete('/delete_user/{username}')
async def delete_user(username, pyload=dep_auth) -> SUserDel:
    if UserRole.is_root_user(pyload.role) or pyload.username==username:
        result = await UserRepository.delete_by_id(username)
        if result:
            return SUserDel(ok=True, username=username)
        raise HTTPException(
            status_code=404,
            detail=f"Task with username={username} not found"
        )
    else:
        raise HTTPException(
            status_code=404,
            detail="You don't have access")









