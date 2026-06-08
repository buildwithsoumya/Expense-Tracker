from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base

from app.models.user_model import User
from app.models.category_model import Category
from app.models.expense_model import Expense

from app.routes.auth_routes import router as auth_router
from app.routes.expense_routes import router as expense_router
from app.routes.category_routes import router as category_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.admin_routes import router as admin_router

app = FastAPI()

# CORS — allow admin frontend and user frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(expense_router)
app.include_router(category_router)
app.include_router(analytics_router)
app.include_router(admin_router)

@app.get("/")
def home():

    return {
        "message": "Expense Tracker Backend Running"
    }