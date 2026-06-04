from pydantic import BaseModel
from datetime import date


class ExpenseCreate(BaseModel):

    category_id: int

    amount: float

    description: str

    payment_method: str

    expense_date: date


class ExpenseResponse(BaseModel):

    expense_id: int

    category_id: int

    category_name: str

    amount: float

    description: str

    payment_method: str

    expense_date: date

    class Config:

        from_attributes = True