import logging

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from app.models.user_model import User

from app.database.db_dependency import get_db

from app.auth.hashing import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import create_access_token

from app.utils.otp_store import (
    generate_and_store_otp,
    verify_otp,
    consume_otp,
)

from app.services.email_service import send_otp_email

logger = logging.getLogger("auth.routes")


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_pw = hash_password(user.password)

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_pw
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    valid_password = verify_password(
        user.password,
        existing_user.password_hash
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        user_id=existing_user.user_id,
        email=existing_user.email,
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Send a 6-digit OTP to the registered email address.
    Always returns 200 (to avoid leaking whether the email exists).
    """

    user = db.query(User).filter(
        User.email == payload.email
    ).first()

    if user:
        otp = generate_and_store_otp(payload.email)
        sent = send_otp_email(
            recipient_email=payload.email,
            otp=otp,
            first_name=user.first_name,
        )

        if not sent:
            logger.warning(
                f"OTP generated but email delivery failed for {payload.email}"
            )

    return {
        "message": "If this email is registered, an OTP has been sent."
    }


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Verify the OTP and update the user's password.
    """

    if not verify_otp(payload.email, payload.otp):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP. Please request a new one."
        )

    user = db.query(User).filter(
        User.email == payload.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters."
        )

    user.password_hash = hash_password(payload.new_password)
    db.commit()

    consume_otp(payload.email)

    return {
        "message": "Password reset successfully. You can now log in."
    }