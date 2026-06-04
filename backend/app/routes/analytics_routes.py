from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database.db_dependency import get_db

from app.auth.auth_bearer import JWTBearer

from app.models.expense_model import Expense
from app.models.category_model import Category


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# CATEGORY-WISE SPENDING
@router.get("/category-breakdown")
def category_breakdown(
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    result = db.query(

        Category.category_name,

        func.sum(Expense.amount).label("total")

    ).join(

        Category,
        Expense.category_id == Category.category_id

    ).filter(

        Expense.user_id == payload["user_id"]

    ).group_by(

        Category.category_name

    ).all()

    return [
        {
            "category": row[0],
            "total": float(row[1])
        }

        for row in result
    ]


# MONTHLY EXPENSE TREND
@router.get("/monthly-trend")
def monthly_trend(
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    result = db.query(

        extract("month", Expense.expense_date).label("month"),

        func.sum(Expense.amount).label("total")

    ).filter(

        Expense.user_id == payload["user_id"]

    ).group_by(

        extract("month", Expense.expense_date)

    ).all()

    return [
        {
            "month": int(row[0]),
            "total": float(row[1])
        }

        for row in result
    ]


# HIGHEST SPENDING CATEGORY
@router.get("/top-category")
def top_category(
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    result = db.query(

        Category.category_name,

        func.sum(Expense.amount).label("total")

    ).join(

        Category,
        Expense.category_id == Category.category_id

    ).filter(

        Expense.user_id == payload["user_id"]

    ).group_by(

        Category.category_name

    ).order_by(

        func.sum(Expense.amount).desc()

    ).first()

    if not result:

        return {
            "message": "No expenses found"
        }

    return {
        "top_category": result[0],
        "total_spent": float(result[1])
    }


# RECENT TRANSACTIONS
@router.get("/recent-transactions")
def recent_transactions(
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    expenses = db.query(Expense).filter(

        Expense.user_id == payload["user_id"]

    ).order_by(

        Expense.expense_date.desc()

    ).limit(5).all()

    return expenses


# TOTAL EXPENSE OVERVIEW
@router.get("/overview")
def expense_overview(
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    total_expense = db.query(

        func.sum(Expense.amount)

    ).filter(

        Expense.user_id == payload["user_id"]

    ).scalar()

    total_transactions = db.query(

        func.count(Expense.expense_id)

    ).filter(

        Expense.user_id == payload["user_id"]

    ).scalar()

    return {
        "total_expense": float(total_expense or 0),
        "total_transactions": total_transactions
    }