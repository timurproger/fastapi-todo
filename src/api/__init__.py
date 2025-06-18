from fastapi import APIRouter

from api.tasks import router as task_router
from api.auth_users import router as user_auth_router
from api.validation_users import router as user_valid_router
from api.db import router as db_router


main_router = APIRouter()

main_router.include_router(task_router)
main_router.include_router(user_auth_router)
main_router.include_router(user_valid_router)
main_router.include_router(db_router)
