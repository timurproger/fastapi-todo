import os

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

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
    db_exists = os.path.exists(DB_PATH)

    if not db_exists:
        print("БД не найдена. Создаём...")
        await create_tables()
        print("БД успешно создана.")
    else:
        print("БД уже существует. Пропускаем создание.")
