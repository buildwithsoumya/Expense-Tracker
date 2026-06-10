"""
Database-backed OTP store for password reset.
"""

import secrets
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.otp_model import OTPToken

OTP_TTL_SECONDS = 600   # 10 minutes
OTP_LENGTH = 6


def generate_and_store_otp(db: Session, email: str) -> str:
    """Generate a new 6-digit OTP, persist it, and return the plain value."""
    # First, invalidate any existing OTPs for this email
    db.query(OTPToken).filter(OTPToken.email == email).delete()
    
    otp = str(secrets.randbelow(10 ** OTP_LENGTH)).zfill(OTP_LENGTH)
    expires_at = datetime.utcnow() + timedelta(seconds=OTP_TTL_SECONDS)

    new_token = OTPToken(
        email=email,
        otp=otp,
        expires_at=expires_at
    )
    db.add(new_token)
    db.commit()

    return otp


def verify_otp(db: Session, email: str, otp: str) -> bool:
    """
    Return True if the OTP matches and has not expired.
    Does NOT consume the OTP — call consume_otp() after a successful verify.
    """
    entry = db.query(OTPToken).filter(OTPToken.email == email).first()

    if entry is None:
        return False

    if datetime.utcnow() > entry.expires_at:
        db.delete(entry)
        db.commit()
        return False

    return secrets.compare_digest(entry.otp, otp)


def consume_otp(db: Session, email: str) -> None:
    """Remove the OTP entry once it has been successfully used."""
    db.query(OTPToken).filter(OTPToken.email == email).delete()
    db.commit()
