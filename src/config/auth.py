from authx import AuthX, AuthXConfig
from fastapi import Depends, HTTPException

from config.config import settings

config = AuthXConfig()
config.JWT_SECRET_KEY = settings.JWT_SECRET_KEY
config.JWT_ACCESS_COOKIE_NAME = settings.JWT_ACCESS_COOKIE_NAME
config.JWT_TOKEN_LOCATION = ['cookies', 'headers']
config.JWT_COOKIE_CSRF_PROTECT = False

security = AuthX(config=config)

