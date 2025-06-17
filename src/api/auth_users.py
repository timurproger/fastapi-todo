from typing import Annotated

from fastapi import Depends, HTTPException, APIRouter, Response, Request

from src.config.auth import config
from src.repository.user_repository import UserRepository
from src.schemas.users import SUsersAdd, SUserLogin,SToken, SUserReg

router = APIRouter(prefix='/auth', tags=['Users'])

# --- Регистрация пользователя ---
@router.post("/register")
async def register(data: SUsersAdd, request: Request) -> SUserReg:
    print(data)
    client_host = request.client.host
    user_id = await UserRepository.add_one(data, client_host)

    return SUserReg(ok=True, ip=client_host, user_id=user_id)


@router.post("/login")
async def login(data: SUserLogin, response: Response) -> SToken:
    token = str(await UserRepository.login(data))
    if not token:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    response.set_cookie(config.JWT_ACCESS_COOKIE_NAME, token)
    return SToken(ok=True, access_token=token)