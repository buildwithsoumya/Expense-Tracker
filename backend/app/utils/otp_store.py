"""
In-memory OTP store for password reset.

Each entry:  email -> {"otp": str, "expires_at": datetime}

OTPs expire after OTP_TTL_SECONDS seconds.
"""

import secrets
import threading
from datetime import datetime, timedelta

OTP_TTL_SECONDS = 600   # 10 minutes
OTP_LENGTH = 6

_store: dict[str, dict] = {}
_lock = threading.Lock()


def generate_and_store_otp(email: str) -> str:
    """Generate a new 6-digit OTP, persist it, and return the plain value."""
    otp = str(secrets.randbelow(10 ** OTP_LENGTH)).zfill(OTP_LENGTH)
    expires_at = datetime.utcnow() + timedelta(seconds=OTP_TTL_SECONDS)

    with _lock:
        _store[email] = {"otp": otp, "expires_at": expires_at}

    return otp


def verify_otp(email: str, otp: str) -> bool:
    """
    Return True if the OTP matches and has not expired.
    Does NOT consume the OTP — call consume_otp() after a successful verify.
    """
    with _lock:
        entry = _store.get(email)

    if entry is None:
        return False

    if datetime.utcnow() > entry["expires_at"]:
        _evict(email)
        return False

    return secrets.compare_digest(entry["otp"], otp)


def consume_otp(email: str) -> None:
    """Remove the OTP entry once it has been successfully used."""
    _evict(email)


def _evict(email: str) -> None:
    with _lock:
        _store.pop(email, None)
