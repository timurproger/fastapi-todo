from fastapi import APIRouter, HTTPException


from src.api.dependencies import dep_auth
from database.db import create_tables, delete_tables
from src.schemas.users import UserRole
from src.schemas.db import SCreateOrDownDB

router = APIRouter(prefix='/db', tags=['DB'], dependencies=[dep_auth])


@router.post('/start')
async def start(pyload=dep_auth) -> SCreateOrDownDB:
    if UserRole.is_root_user(pyload.role):
        await delete_tables()
        await create_tables()
        return SCreateOrDownDB(ok=True, ditail='The database has been cleared and is ready for work.')
    else:
        raise HTTPException(status_code=404, detail="You don't have access")

@router.post('/down')
async def down(pyload=dep_auth) -> SCreateOrDownDB:
    if UserRole.is_root_user(pyload.role):
        await delete_tables()
        return SCreateOrDownDB(ok=True, ditail='The base is stopped (tables are deleted).')
    else:
        raise HTTPException(status_code=404, detail="You don't have access")
