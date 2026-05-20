import logging
import os
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from jose import JWTError, jwt

logger = logging.getLogger("auth.jwt")

from app.config import settings


def create_access_token(user_id: int, email: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": str(user_id),
        "user_id": user_id,
        "email": email,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }

    logger.debug("Creating access token for user_id=%s exp=%s", user_id, expire.isoformat())

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require_exp": True, "require_sub": True},
        )

        subject = payload.get("sub")
        user_id = payload.get("user_id") or subject

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            raise HTTPException(status_code=401, detail="Invalid token")

        payload["user_id"] = user_id
        return payload
    except JWTError as exc:
        logger.warning("JWT decode failed: %s", str(exc))
        raise HTTPException(status_code=401, detail="Invalid or expired token")