# python -m src.scripts.create_admin -u admin2 -p admin
import argparse
import asyncio

from src.repositories.user_repository import UserRepository


from src.schemas.users import SUsersAdd, UserRole


async def create_admin(username: str, password: str):
    user = SUsersAdd(username=username, password=password)
    user_id = await UserRepository.add_one(user, '127.0.0.1', UserRole.admin)
    print(f"✅ Админ создан! ID: {user_id}")


def cli():
    parser = argparse.ArgumentParser(description="Создать администратора")
    parser.add_argument("-u", "--username", required=True)
    parser.add_argument("-p", "--password", required=True)
    args = parser.parse_args()

    asyncio.run(create_admin(args.username, args.password))

if __name__ == "__main__":
    cli()