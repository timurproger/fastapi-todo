import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import inspect

from models.base import Model

DB_PATH = "tasks.db"

engine = create_async_engine(f'sqlite+aiosqlite:///{DB_PATH}')
new_session = async_sessionmaker(engine, expire_on_commit=False)


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.create_all)

async def delete_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.drop_all)


async def initialize_database():
    if not os.path.exists(DB_PATH):
        print("БД не найдена. Создаём...")
        await create_tables()
        print("БД успешно создана.")
        return

    async with engine.begin() as conn:
        def check_tables(connection):
            inspector = inspect(connection)
            return inspector.get_table_names()

        tables = await conn.run_sync(check_tables)

    if not tables:
        print("БД существует, но таблиц нет. Создаём таблицы...")
        await create_tables()
        print("Таблицы успешно созданы.")
    else:
        print(f"БД и таблицы уже существуют ({tables}). Пропускаем создание.")
