from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db_dependency import get_db
from app.auth.auth_bearer import JWTBearer
from app.models.feedback_model import Feedback
from app.schemas.feedback_schema import FeedbackCreate

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)

@router.post("/")
def submit_feedback(
    feedback: FeedbackCreate,
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    new_feedback = Feedback(
        user_id=payload["user_id"],
        rating=feedback.rating,
        comment=feedback.comment
    )
    db.add(new_feedback)
    db.commit()
    
    return {"message": "Thank you for your feedback!"}
