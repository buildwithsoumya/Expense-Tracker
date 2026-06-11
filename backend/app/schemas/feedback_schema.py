from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5")
    comment: str = Field(None, max_length=500)
