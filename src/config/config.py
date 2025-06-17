from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    JWT_SECRET_KEY: str
    JWT_ACCESS_COOKIE_NAME: str

    model_config = SettingsConfigDict(env_file='.env')

settings = Settings()
