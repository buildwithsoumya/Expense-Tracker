from sqlalchemy import (
    Column,
    Integer,
    String,
    DECIMAL,
    ForeignKey,
    TIMESTAMP,
    Date,
    Enum
)

from sqlalchemy.sql import func

from app.database.connection import Base


class Expense(Base):

    __tablename__ = "expenses"

    expense_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.category_id"),
        nullable=False
    )

    amount = Column(
        DECIMAL(10, 2),
        nullable=False
    )

    description = Column(
        String(255)
    )

    payment_method = Column(
        Enum(
            "Cash",
            "UPI",
            "Debit Card",
            "Credit Card",
            "Net Banking",
            name="payment_methods"
        ),
        default="UPI"
    )

    expense_date = Column(
        Date,
        nullable=False
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )