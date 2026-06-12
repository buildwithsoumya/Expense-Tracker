"""
Admin routes for the Expense Tracker Admin Dashboard.
All endpoints are protected by the x-admin-secret header.
"""

import csv
import io
import os
import subprocess
from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.config import settings
from app.database.db_dependency import get_db
from app.models.user_model import User
from app.models.expense_model import Expense
from app.models.category_model import Category
from app.models.feedback_model import Feedback


from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

class AdminLogin(BaseModel):
    username: str
    password: str

admin_scheme = HTTPBearer(auto_error=False)

def admin_auth(credentials: HTTPAuthorizationCredentials = Depends(admin_scheme)):
    if not credentials or credentials.scheme != "Bearer":
        raise HTTPException(status_code=401, detail="Invalid token")
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not an admin token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ── Pydantic Schemas ──────────────────────────────────────────────────

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


class ExpenseUpdate(BaseModel):
    category_id: Optional[int] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    payment_method: Optional[str] = None
    expense_date: Optional[date] = None


class BulkDeleteRequest(BaseModel):
    ids: List[int]


class RunScriptRequest(BaseModel):
    script: str  # "schema.sql" or "sample_data.sql"


class FieldPatchRequest(BaseModel):
    table: str
    record_id: int
    field: str
    value: str


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.post("/login")
def admin_login(creds: AdminLogin):
    if creds.username == settings.ADMIN_USERNAME and creds.password == settings.ADMIN_PASSWORD:
        now = datetime.now(timezone.utc)
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {
            "sub": "admin",
            "role": "admin",
            "iat": int(now.timestamp()),
            "exp": int(expire.timestamp()),
        }
        token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return {"access_token": token, "token_type": "bearer"}
    
    raise HTTPException(status_code=401, detail="Invalid admin credentials")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# USER MANAGEMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/users")
def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Get all users with pagination and total expense count."""
    offset = (page - 1) * limit

    total = db.query(func.count(User.user_id)).scalar()

    users = db.query(
        User.user_id,
        User.first_name,
        User.last_name,
        User.email,
        User.created_at,
        func.coalesce(func.sum(Expense.amount), 0).label("total_expenses"),
        func.coalesce(func.count(Expense.expense_id), 0).label("expense_count")
    ).outerjoin(
        Expense, User.user_id == Expense.user_id
    ).group_by(
        User.user_id
    ).offset(offset).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "users": [
            {
                "user_id": u.user_id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "total_expenses": float(u.total_expenses),
                "expense_count": int(u.expense_count)
            }
            for u in users
        ]
    }


@router.get("/users/{user_id}/expenses")
def get_user_expenses(
    user_id: int,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Get all expenses for a specific user."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    expenses = db.query(
        Expense, Category.category_name
    ).outerjoin(
        Category, Expense.category_id == Category.category_id
    ).filter(
        Expense.user_id == user_id
    ).order_by(Expense.expense_date.desc()).all()

    return {
        "user": {
            "user_id": user.user_id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        },
        "expenses": [
            {
                "expense_id": exp.expense_id,
                "category_id": exp.category_id,
                "category_name": cat_name or "Unknown",
                "amount": float(exp.amount),
                "description": exp.description,
                "payment_method": exp.payment_method,
                "expense_date": exp.expense_date.isoformat() if exp.expense_date else None,
                "created_at": exp.created_at.isoformat() if exp.created_at else None,
            }
            for exp, cat_name in expenses
        ]
    }


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Update user fields."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.first_name is not None:
        user.first_name = data.first_name
    if data.last_name is not None:
        user.last_name = data.last_name
    if data.email is not None:
        existing = db.query(User).filter(
            User.email == data.email, User.user_id != user_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = data.email

    db.commit()
    return {"message": "User updated successfully"}


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Delete user and cascade delete all associated expenses and categories."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete user expenses
    db.query(Expense).filter(Expense.user_id == user_id).delete()
    # Delete user custom categories
    db.query(Category).filter(Category.user_id == user_id).delete()
    # Delete the user
    db.delete(user)
    db.commit()

    return {"message": "User and associated data deleted successfully"}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# EXPENSE / TRANSACTION MANAGEMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/expenses")
def get_all_expenses(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[int] = None,
    category_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Get all expenses with optional filters and pagination."""
    query = db.query(
        Expense,
        Category.category_name,
        User.first_name,
        User.last_name,
        User.email
    ).outerjoin(
        Category, Expense.category_id == Category.category_id
    ).outerjoin(
        User, Expense.user_id == User.user_id
    )

    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)
    if category_id is not None:
        query = query.filter(Expense.category_id == category_id)
    if start_date is not None:
        query = query.filter(Expense.expense_date >= start_date)
    if end_date is not None:
        query = query.filter(Expense.expense_date <= end_date)
    if min_amount is not None:
        query = query.filter(Expense.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Expense.amount <= max_amount)

    total = query.count()
    offset = (page - 1) * limit

    rows = query.order_by(
        Expense.expense_date.desc()
    ).offset(offset).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "expenses": [
            {
                "expense_id": exp.expense_id,
                "user_id": exp.user_id,
                "user_name": f"{fname} {lname}" if fname else "Unknown",
                "user_email": email or "",
                "category_id": exp.category_id,
                "category_name": cat_name or "Unknown",
                "amount": float(exp.amount),
                "description": exp.description,
                "payment_method": exp.payment_method,
                "expense_date": exp.expense_date.isoformat() if exp.expense_date else None,
                "created_at": exp.created_at.isoformat() if exp.created_at else None,
            }
            for exp, cat_name, fname, lname, email in rows
        ]
    }


@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    data: ExpenseUpdate,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Update an expense record."""
    expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if data.category_id is not None:
        expense.category_id = data.category_id
    if data.amount is not None:
        expense.amount = data.amount
    if data.description is not None:
        expense.description = data.description
    if data.payment_method is not None:
        expense.payment_method = data.payment_method
    if data.expense_date is not None:
        expense.expense_date = data.expense_date

    db.commit()
    return {"message": "Expense updated successfully"}


@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Delete a single expense."""
    expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}


@router.post("/expenses/bulk-delete")
def bulk_delete_expenses(
    data: BulkDeleteRequest,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Bulk delete expenses by IDs."""
    deleted = db.query(Expense).filter(
        Expense.expense_id.in_(data.ids)
    ).delete(synchronize_session=False)
    db.commit()

    return {"message": f"{deleted} expense(s) deleted", "deleted_count": deleted}


@router.get("/expenses/export")
def export_expenses_csv(
    user_id: Optional[int] = None,
    category_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Export filtered expenses as CSV."""
    query = db.query(
        Expense, Category.category_name, User.first_name, User.last_name, User.email
    ).outerjoin(
        Category, Expense.category_id == Category.category_id
    ).outerjoin(
        User, Expense.user_id == User.user_id
    )

    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)
    if category_id is not None:
        query = query.filter(Expense.category_id == category_id)
    if start_date is not None:
        query = query.filter(Expense.expense_date >= start_date)
    if end_date is not None:
        query = query.filter(Expense.expense_date <= end_date)

    rows = query.order_by(Expense.expense_date.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "expense_id", "user_id", "user_name", "user_email",
        "category", "amount", "description", "payment_method",
        "expense_date", "created_at"
    ])

    for exp, cat_name, fname, lname, email in rows:
        writer.writerow([
            exp.expense_id,
            exp.user_id,
            f"{fname} {lname}" if fname else "",
            email or "",
            cat_name or "",
            float(exp.amount),
            exp.description or "",
            exp.payment_method or "",
            exp.expense_date.isoformat() if exp.expense_date else "",
            exp.created_at.isoformat() if exp.created_at else "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=expenses_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        }
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CATEGORIES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/categories")
def get_all_categories(
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Get all categories."""
    categories = db.query(Category).all()
    return [
        {
            "category_id": c.category_id,
            "user_id": c.user_id,
            "category_name": c.category_name,
            "is_default": c.is_default,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in categories
    ]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FEEDBACK MANAGEMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/feedbacks")
def get_all_feedbacks(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Get all feedbacks with user info."""
    offset = (page - 1) * limit
    
    query = db.query(
        Feedback,
        User.first_name,
        User.last_name,
        User.email
    ).join(
        User, Feedback.user_id == User.user_id
    )
    
    total = query.count()
    total_pages = (total + limit - 1) // limit
    
    rows = query.order_by(Feedback.created_at.desc()).offset(offset).limit(limit).all()
    
    return {
        "items": [
            {
                "id": fb.id,
                "user_id": fb.user_id,
                "user_name": f"{fname} {lname}".strip() if fname else "Unknown",
                "user_email": email or "",
                "rating": fb.rating,
                "comment": fb.comment,
                "created_at": fb.created_at.isoformat() if fb.created_at else None
            }
            for fb, fname, lname, email in rows
        ],
        "pages": total_pages,
        "page": page,
        "total": total
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STATS / ANALYTICS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Get aggregate statistics for the dashboard."""
    user_count = db.query(func.count(User.user_id)).scalar() or 0
    transaction_count = db.query(func.count(Expense.expense_id)).scalar() or 0
    total_spend = float(db.query(func.coalesce(func.sum(Expense.amount), 0)).scalar())

    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year

    this_month_spend = float(db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(
        extract("month", Expense.expense_date) == current_month,
        extract("year", Expense.expense_date) == current_year
    ).scalar() or 0)

    # Category breakdown
    cat_breakdown = db.query(
        Category.category_name,
        func.sum(Expense.amount).label("total")
    ).join(
        Expense, Expense.category_id == Category.category_id
    ).group_by(
        Category.category_name
    ).order_by(
        func.sum(Expense.amount).desc()
    ).all()

    # Daily activity (last 30 days)
    daily_activity = db.query(
        Expense.expense_date,
        func.count(Expense.expense_id).label("count"),
        func.sum(Expense.amount).label("total")
    ).group_by(
        Expense.expense_date
    ).order_by(
        Expense.expense_date.asc()
    ).limit(90).all()

    # Top spenders
    top_spenders = db.query(
        User.user_id,
        User.first_name,
        User.last_name,
        User.email,
        func.sum(Expense.amount).label("total_spent"),
        func.count(Expense.expense_id).label("transaction_count")
    ).join(
        Expense, User.user_id == Expense.user_id
    ).group_by(
        User.user_id
    ).order_by(
        func.sum(Expense.amount).desc()
    ).limit(10).all()

    return {
        "user_count": user_count,
        "transaction_count": transaction_count,
        "total_spend": total_spend,
        "this_month_spend": this_month_spend,
        "category_breakdown": [
            {"category": row[0], "amount": float(row[1])}
            for row in cat_breakdown
        ],
        "daily_activity": [
            {
                "date": row[0].isoformat() if row[0] else None,
                "count": int(row[1]),
                "total": float(row[2])
            }
            for row in daily_activity
        ],
        "top_spenders": [
            {
                "user_id": row[0],
                "name": f"{row[1]} {row[2]}",
                "email": row[3],
                "total_spent": float(row[4]),
                "transaction_count": int(row[5])
            }
            for row in top_spenders
        ]
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATABASE OPERATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/db/run-script")
def run_db_script(
    data: RunScriptRequest,
    admin_payload = Depends(admin_auth)
):
    """Run a SQL script from the database/ directory."""
    allowed_scripts = ["schema.sql", "sample_data.sql"]

    if data.script not in allowed_scripts:
        raise HTTPException(
            status_code=400,
            detail=f"Script not allowed. Choose from: {allowed_scripts}"
        )

    # Resolve the script path relative to project root
    project_root = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..")
    )
    script_path = os.path.join(project_root, "database", data.script)

    if not os.path.exists(script_path):
        raise HTTPException(status_code=404, detail=f"Script not found: {data.script}")

    try:
        # Parse DB URL for mysql client connection
        db_url = settings.DATABASE_URL
        # mysql+pymysql://user:pass@host:port/dbname
        from urllib.parse import urlparse
        parsed = urlparse(db_url.replace("mysql+pymysql://", "mysql://"))
        db_user = parsed.username or "root"
        db_pass = parsed.password or ""
        db_host = parsed.hostname or "127.0.0.1"
        db_port = str(parsed.port or 3306)
        db_name = parsed.path.lstrip("/") if parsed.path else "expense_tracker"

        cmd = [
            "mysql",
            f"-u{db_user}",
            f"-p{db_pass}",
            f"-h{db_host}",
            f"-P{db_port}",
            db_name
        ]

        with open(script_path, "r") as f:
            script_content = f.read()

        result = subprocess.run(
            cmd,
            input=script_content,
            capture_output=True,
            text=True,
            timeout=30
        )

        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "script": data.script,
            "return_code": result.returncode
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "stdout": "",
            "stderr": "Script execution timed out after 30 seconds",
            "script": data.script,
            "return_code": -1
        }
    except FileNotFoundError:
        return {
            "success": False,
            "stdout": "",
            "stderr": "mysql client not found. Make sure MySQL/MariaDB client is installed and in PATH.",
            "script": data.script,
            "return_code": -1
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": str(e),
            "script": data.script,
            "return_code": -1
        }


@router.delete("/db/clear-user/{user_id}")
def clear_user_data(
    user_id: int,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Clear all expenses and custom categories for a user (keep the user account)."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    exp_count = db.query(Expense).filter(Expense.user_id == user_id).delete()
    cat_count = db.query(Category).filter(
        Category.user_id == user_id, Category.is_default == False
    ).delete(synchronize_session=False)
    db.commit()

    return {
        "message": f"Cleared {exp_count} expense(s) and {cat_count} custom category(ies) for user {user_id}",
        "expenses_deleted": exp_count,
        "categories_deleted": cat_count
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RAW DATA EXPLORER — PATCH FIELD
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/patch-field")
def patch_field(
    data: FieldPatchRequest,
    db: Session = Depends(get_db),
    admin_payload = Depends(admin_auth)
):
    """Patch a single field on a record for quick fixes."""
    table_map = {
        "users": (User, "user_id"),
        "expenses": (Expense, "expense_id"),
        "categories": (Category, "category_id"),
    }

    if data.table not in table_map:
        raise HTTPException(
            status_code=400,
            detail=f"Table not supported. Choose from: {list(table_map.keys())}"
        )

    model, pk_field = table_map[data.table]

    record = db.query(model).filter(
        getattr(model, pk_field) == data.record_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    if not hasattr(record, data.field):
        raise HTTPException(status_code=400, detail=f"Field '{data.field}' does not exist on {data.table}")

    # Don't allow patching primary keys or password hashes
    forbidden_fields = [pk_field, "password_hash"]
    if data.field in forbidden_fields:
        raise HTTPException(status_code=400, detail=f"Cannot patch field '{data.field}'")

    setattr(record, data.field, data.value)
    db.commit()

    return {"message": f"Updated {data.table}.{data.field} for record {data.record_id}"}
