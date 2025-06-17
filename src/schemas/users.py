from enum import Enum

from pydantic import BaseModel, IPvAnyAddress
from typing import ClassVar, Dict, List


class UserRole(str, Enum):
    admin = "admin"
    user = "user"

    __ROOTS_USER = [admin]

    @classmethod
    def is_root_user(cls, role:str)->bool:
        if(role in cls.__ROOTS_USER):
            return True
        return False


class SUsersAdd(BaseModel):
    username: str
    password : str

class SUsers(SUsersAdd):
    id: int
    ip: str  # Можно использовать для валидации IP
    role: UserRole

    class Config:
        from_attributes = True

class SUserLogin(BaseModel):
    username: str
    password: str

# --- Схемы ответов ---
class SToken(BaseModel):
    ok: bool
    access_token: str

class SUserReg(BaseModel):
    ok: bool
    ip: str
    user_id: int

class SUserDel(BaseModel):
    ok: bool
    username: str
