from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from authx.exceptions import MissingTokenError, JWTDecodeError

from database.db import create_tables, delete_tables
from api import main_router
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    await delete_tables()
    print('база очищина')
    await create_tables()
    print('база готова к работе')
    yield
    print('Выключение')

app = FastAPI()
@app.exception_handler(MissingTokenError)
async def missing_token_handler(request: Request, exc: MissingTokenError):
    return JSONResponse(
        status_code=401,
        content={"detail": "Пользователь не авторизован. Токен доступа отсутствует."}
    )

@app.exception_handler(JWTDecodeError)
async def expired_token_handler(request: Request, exc: JWTDecodeError):
    return JSONResponse(
        status_code=401,
        content={"detail": "Токен просрочен. Пожалуйста, авторизуйтесь снова."},
    )
app.include_router(main_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




if(__name__ == '__main__'):
    uvicorn.run('main:app', reload=True)