from fastapi import Depends

from src.config.auth import security

dep_auth = Depends(security.access_token_required)