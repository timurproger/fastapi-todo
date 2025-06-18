from typing import Annotated

from fastapi import Depends, HTTPException, APIRouter, Response, Request

from src.service.user_service import UserService
from src.config.auth import config
from src.repositories.user_repository import UserRepository
from src.schemas.users import SUsersAdd, SUserLogin,SToken, SUserReg

router = APIRouter(prefix='/auth', tags=['Users'])

# --- Регистрация пользователя ---
@router.post("/register")
async def register(data: SUsersAdd, request: Request) -> SUserReg:
    return await UserService.register(data, request)


@router.post("/login")
async def login(data: SUserLogin, response: Response) -> SToken:
    return await UserService.login(data, response)