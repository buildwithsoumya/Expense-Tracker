from datetime import date
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from sqlalchemy import extract, func

from typing import List

from app.database.db_dependency import get_db

from app.schemas.expense_schema import (
    ExpenseCreate,
    ExpenseResponse
)

from app.models.expense_model import Expense

from app.auth.auth_bearer import JWTBearer


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


# ADD EXPENSE
@router.post("/add")
def add_expense(
    expense: ExpenseCreate,
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    new_expense = Expense(

        user_id=payload["user_id"],

        category_id=expense.category_id,

        amount=expense.amount,

        description=expense.description,

        payment_method=expense.payment_method,

        expense_date=expense.expense_date
    )

    db.add(new_expense)

    db.commit()

    db.refresh(new_expense)

    return {
        "message": "Expense added successfully"
    }


# GET ALL USER EXPENSES
@router.get(
    "/",
    response_model=List[ExpenseResponse]
)
def get_expenses(
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    expenses = db.query(Expense).filter(
        Expense.user_id == payload["user_id"]
    ).all()

    return expenses


# UPDATE EXPENSE
@router.put("/update/{expense_id}")
def update_expense(
    expense_id: int,
    updated_expense: ExpenseCreate,
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.expense_id == expense_id,
        Expense.user_id == payload["user_id"]
    ).first()

    if not expense:

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    expense.category_id = updated_expense.category_id
    expense.amount = updated_expense.amount
    expense.description = updated_expense.description
    expense.payment_method = updated_expense.payment_method
    expense.expense_date = updated_expense.expense_date

    db.commit()

    return {
        "message": "Expense updated successfully"
    }


# DELETE EXPENSE
@router.delete("/delete/{expense_id}")
def delete_expense(
    expense_id: int,
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.expense_id == expense_id,
        Expense.user_id == payload["user_id"]
    ).first()

    if not expense:

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(expense)

    db.commit()

    return {
        "message": "Expense deleted successfully"
    }


# MONTHLY SUMMARY
@router.get("/monthly-summary")
def monthly_summary(
    year: int,
    month: int,
    payload=Depends(JWTBearer()),
    db: Session = Depends(get_db)
):

    total = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == payload["user_id"],
        extract("year", Expense.expense_date) == year,
        extract("month", Expense.expense_date) == month
    ).scalar()

    return {
        "year": year,
        "month": month,
        "total_expense": total or 0
    }

@router.get("/filter")
def filter_expenses(

    category_id: int = None,

    payment_method: str = None,

    start_date: date = None,

    end_date: date = None,

    payload=Depends(JWTBearer()),

    db: Session = Depends(get_db)
):

    query = db.query(Expense).filter(
        Expense.user_id == payload["user_id"]
    )

    # FILTER BY CATEGORY
    if category_id:

        query = query.filter(
            Expense.category_id == category_id
        )

    # FILTER BY PAYMENT METHOD
    if payment_method:

        query = query.filter(
            Expense.payment_method == payment_method
        )

    # FILTER BY START DATE
    if start_date:

        query = query.filter(
            Expense.expense_date >= start_date
        )

    # FILTER BY END DATE
    if end_date:

        query = query.filter(
            Expense.expense_date <= end_date
        )

    expenses = query.all()

    return expenses