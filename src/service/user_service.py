from fastapi import Depends, HTTPException, APIRouter, Response, Request

from config.auth import config
from src.schemas.users import SUserDel, SUserLogin, SUsers, SUsersAdd, SUserReg, SToken
from src.repositories.user_repository import UserRepository
from src.schemas.users import UserRole

class UserService:
    @classmethod
    async def delete_user(cls, username: str, pyload) -> SUserDel:
        if UserRole.is_root_user(pyload.role) or pyload.username == username:
            result = await UserRepository.delete_by_id(username)
            if result:
                return SUserDel(ok=True, username=username)
            raise HTTPException(
                status_code=404,
                detail=f"User with username={username} not found"
            )
        raise HTTPException(
            status_code=403,
            detail="You don't have access"
        )


    @classmethod
    async def change_password(cls, user_id: int, data: SUserLogin) -> SUsers:
        user = await UserRepository.update_one(user_id, data)
        if user is None:
            raise HTTPException(status_code=401, detail="DB doesn't have this user")
        return user


    @classmethod
    async def get_users(cls, role):
        if UserRole.is_root_user(role):
            users = await UserRepository.find_all()
            return users
        else:
            raise HTTPException(status_code=401, detail="You don't have access")


    @classmethod
    async def register(cls, data: SUsersAdd, request: Request) -> SUserReg:
        client_host = request.client.host
        user_id = await UserRepository.add_one(data, client_host)
        return SUserReg(ok=True, ip=client_host, user_id=user_id)


    @classmethod
    async def login(cls, data: SUserLogin, response: Response):
        token = str(await UserRepository.login(data))
        if not token:
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        response.set_cookie(config.JWT_ACCESS_COOKIE_NAME, token)
        return SToken(ok=True, access_token=token)