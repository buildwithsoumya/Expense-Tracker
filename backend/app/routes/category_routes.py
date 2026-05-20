from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from typing import List

from app.database.db_dependency import get_db

from app.models.category_model import Category

from app.schemas.category_schema import (
    CategoryCreate,
    CategoryResponse
)

from app.auth.auth_bearer import JWTBearer


router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


# GET ALL CATEGORIES
@router.get(
    "/",
    response_model=List[CategoryResponse]
)
def get_categories(
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    categories = db.query(Category).filter(

        (Category.is_default == True)

    |   (Category.user_id == payload["user_id"])

    ).all()

    return categories


# ADD CUSTOM CATEGORY
@router.post("/add")
def add_category(
    category: CategoryCreate,
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    existing_category = db.query(Category).filter(

        Category.category_name == category.category_name,

        Category.user_id == payload["user_id"]

    ).first()

    if existing_category:

        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )

    new_category = Category(

        user_id=payload["user_id"],

        category_name=category.category_name,

        is_default=False
    )

    db.add(new_category)

    db.commit()

    db.refresh(new_category)

    return {
        "message": "Category added successfully"
    }