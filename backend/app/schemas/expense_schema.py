from pydantic import BaseModel, Field
from datetime import date


class ExpenseCreate(BaseModel):

    category_id: int

    amount: float = Field(..., gt=0, description="Expense amount must be strictly greater than 0")

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