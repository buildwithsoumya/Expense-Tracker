# SmartSpend AI — Expense Tracker

> A full-stack AI-powered personal finance platform. Track expenses, visualise spending patterns, manage budgets, and get intelligent insights — all in one premium dark-themed dashboard.

---

##  Project Architecture

```
Expense_Tracker/
│
├── backend/          # FastAPI REST API + Auth + Business Logic
├── frontend/         # React user-facing dashboard (Vite + Tailwind)
├── admin/            # React admin panel (Vite + Tailwind)
├── database/         # SQL schema & seed scripts
└── ml-model/         # ML recommendation engine (in progress)
```

---

##  What's Built

###  Authentication System
- User registration & login
- JWT Bearer token authentication
- Password hashing with bcrypt (passlib)
- Protected route guards (frontend)
- **Forgot Password via OTP** — 6-digit OTP sent to registered email, 10-minute expiry, timing-safe verification

###  Expense Management
- Full CRUD — add, view, edit, delete expenses
- Category tagging (default + custom user categories)
- Date, amount, and description tracking
- Filtering by date range, category, and amount

###  Analytics & Dashboard
- Monthly expense trend charts
- Category-wise spending breakdown (pie + bar charts)
- Total spend, average, and transaction count cards
- Recent transactions feed

###  Admin Panel (Separate App)
- Secure access via `x-admin-secret` header
- Dashboard with platform-wide stats and charts
- User management — view, edit, delete users with inline expense drawer (per-user expenses expandable in-place)
- Expense management — filter by user/category/date/amount, inline edit, bulk delete, CSV export
- Raw Data Explorer — sortable live table view with JSON inspector and field patching
- DB Operations — terminal-style SQL script runner, seed data, clear user data

###  Email Service
- Styled HTML OTP emails sent via Gmail SMTP
- Branded as **SmartSpend AI**
- Configurable via `.env` — plug in any Gmail + App Password

---

##  Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python, FastAPI, SQLAlchemy ORM, Pydantic v2, Passlib + Bcrypt, python-jose (JWT) |
| **Database** | MySQL / MariaDB |
| **User Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Recharts, React Router v7, Axios |
| **Admin Frontend** | React 19, Vite, Tailwind CSS v4, Recharts, React Router v7, Axios |
| **Email** | Python `smtplib` + Gmail SMTP (SSL) |
| **Auth** | JWT Bearer tokens, bcrypt password hashing, OTP-based password reset |

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/brovoski69/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/expense_tracker
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_SECRET=your_admin_secret_key
EMAIL_SENDER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16char_app_password
```

Run the backend:

```bash
uvicorn app.main:app --reload --port 8001
```

API docs available at: `http://127.0.0.1:8001/docs`

---

### 3. User Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

The Vite dev proxy forwards `/api/*` → `http://127.0.0.1:8001`

---

### 4. Admin Panel Setup

```bash
cd admin
cp .env.example .env
# Edit .env: set VITE_API_URL and VITE_ADMIN_SECRET
npm install
npm run dev
```

Runs at: `http://localhost:5174` (or next available port)

---

##  API Overview

### Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/forgot-password` | Send OTP to registered email |
| POST | `/auth/reset-password` | Verify OTP and set new password |

### Expense Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/expenses/add` | Add new expense |
| GET | `/expenses/` | Get user's expenses (with filters) |
| PUT | `/expenses/update/{id}` | Update an expense |
| DELETE | `/expenses/delete/{id}` | Delete an expense |

### Analytics Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/monthly-summary` | Monthly breakdown |
| GET | `/analytics/category-summary` | Category-wise totals |

### Admin Endpoints (require `x-admin-secret` header)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users` | Paginated user list |
| GET | `/admin/users/:id/expenses` | All expenses for a user |
| PUT | `/admin/users/:id` | Edit user |
| DELETE | `/admin/users/:id` | Delete user (cascade) |
| GET | `/admin/expenses` | Filtered global expense list |
| POST | `/admin/expenses/bulk-delete` | Bulk delete expenses |
| GET | `/admin/expenses/export` | Export CSV |
| GET | `/admin/stats` | Platform-wide statistics |
| POST | `/admin/db/run-script` | Run SQL script |
| POST | `/admin/patch-field` | Patch a record field live |

---

##  Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| user_id | INT PK | Auto-increment |
| first_name | VARCHAR(50) | |
| last_name | VARCHAR(50) | |
| email | VARCHAR(150) | Unique |
| password_hash | VARCHAR(255) | bcrypt |
| created_at | TIMESTAMP | Auto |

### `categories`
| Column | Type | Notes |
|---|---|---|
| category_id | INT PK | |
| category_name | VARCHAR(100) | |
| user_id | INT FK | NULL = default/global |

### `expenses`
| Column | Type | Notes |
|---|---|---|
| expense_id | INT PK | |
| user_id | INT FK | |
| category_id | INT FK | |
| amount | DECIMAL(10,2) | |
| description | TEXT | |
| date | DATE | |
| created_at | TIMESTAMP | Auto |

---

##  Current Status

| Module | Status |
|---|---|
| Backend API | ✅ Complete |
| JWT Auth | ✅ Complete |
| Forgot Password (OTP) | ✅ Complete |
| User Frontend | ✅ Complete |
| Admin Panel | ✅ Complete |
| Email Service | ✅ Complete |
| ML Model | 🔄 In Progress |
| Cloud Deployment | 📋 Planned |

---

##  Upcoming

- ML-based spending prediction and smart budget recommendations
- AI expense categorization
- Mobile-responsive optimisations
- Cloud deployment (Render + Vercel + Railway)

---

##  Security Notes

- Never commit real `.env` files — they are `.gitignore`d
- The `ADMIN_SECRET` is the only guard on admin routes — keep it strong
- OTPs are stored in-memory and expire in 10 minutes
- All passwords are hashed with bcrypt before storage
