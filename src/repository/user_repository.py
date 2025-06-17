from fastapi import HTTPException
from sqlalchemy import select, delete

from src.config.auth import security
from database.db import new_session
from src.models.users import UserOrm
from utils.password import hash_password, verify_password
from src.schemas.users import SUsersAdd, SUsers, SUserLogin, UserRole


class UserRepository:
    @classmethod
    async def add_one(cls, data: SUsersAdd, client_host:str, role=UserRole.user):
        async with new_session() as session:
            # Проверка на существующий username
            query = select(UserOrm).where(UserOrm.username == data.username)
            result = await session.execute(query)
            existing_user = result.scalar_one_or_none()

            if existing_user:
                raise HTTPException(status_code=409, detail="Username already exists")

            # Добавляем IP и создаём пользователя
            user_data = data.model_dump()
            hashed_password = hash_password(user_data.pop("password"))
            new_user = UserOrm(
                username=user_data["username"],
                role=role,
                password=hashed_password,
                ip=client_host
            )

            session.add(new_user)
            await session.flush()
            await session.commit()
            return new_user.id

    @classmethod
    async def find_all(cls) -> list[SUsers]:
        async with new_session() as session:
            query = select(UserOrm)
            result = await session.execute(query)
            users_models = result.scalars().all()
            #task_schemas = [STask.from_orm(task_model) for task_model in task_models]
            return users_models

    @classmethod
    async def delete_by_id(cls, username: str) -> bool:
        async with new_session() as session:
            query = delete(UserOrm).where(UserOrm.username == username)
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0

    @classmethod
    async def login(cls, data: SUserLogin) -> bool:
        async with new_session() as session:
            result = await session.execute(
                select(UserOrm).where(UserOrm.username == data.username)
            )
            user:SUsers = result.scalar_one_or_none()

            if not user or not verify_password(data.password, user.password):
                raise HTTPException(status_code=401, detail="Неверный логин или пароль")

            # Создание токена: UID может быть user.id или username
            token = security.create_access_token(uid=str(user.id), data={"role": user.role, 'username':user.username})
            return token

    @classmethod
    async def update_one(cls, user_id: int, user_data: SUserLogin):
        async with new_session() as session:
            user_dict = user_data.model_dump()
            query = select(UserOrm).where(UserOrm.id == user_id)
            result = await session.execute(query)
            user = result.scalar_one_or_none()

            if user is None:
                return None  # или можно raise HTTPException(status_code=404)

            user_dict['password'] = hash_password(user_dict.pop("password"))
            print(user_dict)
            for key, value in user_dict.items():
                if hasattr(user, key) and value is not None:
                    setattr(user, key, value)

            await session.commit()
            await session.refresh(user)
            return user

