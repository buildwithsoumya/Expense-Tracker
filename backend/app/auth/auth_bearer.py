import logging

from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.auth.jwt_handler import verify_access_token

logger = logging.getLogger("auth.bearer")

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = False):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)

        if credentials is None:
            raise HTTPException(
                status_code=401,
                detail="Missing authorization header",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if credentials.scheme != "Bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication scheme",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = credentials.credentials.strip() if credentials.credentials else ""
        if token.lower().startswith("bearer "):
            logger.warning("Authorization token included 'Bearer' prefix; normalizing.")
            token = token.split(" ", 1)[1].strip()

        if not token:
            raise HTTPException(
                status_code=401,
                detail="Empty token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        logger.debug("Verifying bearer token")
        payload = verify_access_token(token)
        return payload