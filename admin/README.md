# Expense Tracker — Admin Dashboard

A standalone admin panel for managing the Expense Tracker platform. Built with React + Vite + Tailwind CSS v4.

## Features

- **Dashboard** — Stats overview with charts (category breakdown, daily activity, top spenders)
- **User Management** — View, edit, delete users; navigate to their expenses
- **Expense Management** — Filter, inline-edit, bulk delete, CSV export
- **Data Explorer** — Raw table view with sortable columns, JSON viewer, field patching
- **DB Operations** — Run schema migrations, seed data, clear user data with terminal-style log

## Setup

### 1. Install dependencies

```bash
cd admin
npm install
```

### 2. Configure environment

Copy the example env file and update the values:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8001
VITE_ADMIN_SECRET=admin_super_secret_key_2026
```

### 3. Configure backend

Make sure the backend `.env` has the matching `ADMIN_SECRET`:

```env
ADMIN_SECRET=admin_super_secret_key_2026
```

### 4. Run the admin dashboard

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173` (or next available port).

### 5. Login

Use the following credentials:

| Field    | Value         |
|----------|---------------|
| User ID  | `admin`       |
| Password | `password123` |

## Architecture

```
admin/
├── src/
│   ├── api/
│   │   └── adminApi.js        # Axios API layer
│   ├── components/
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── Modal.jsx          # Reusable modal
│   │   ├── StatsCards.jsx     # Animated stat cards
│   │   ├── Charts.jsx         # Recharts visualizations
│   │   ├── UserTable.jsx      # User management table
│   │   ├── ExpenseTable.jsx   # Expense table with inline edit
│   │   ├── RawDataExplorer.jsx # Sortable data table + JSON viewer
│   │   └── DBOperationsPanel.jsx # Terminal-style DB ops
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Expenses.jsx
│   │   ├── DataExplorer.jsx
│   │   └── DBOps.jsx
│   ├── App.jsx                # Login gate + layout + routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind v4 + design system
├── index.html
├── package.json
├── vite.config.js
├── .env
└── .env.example
```

## Backend Endpoints

All admin endpoints are mounted at `/admin` and require the `x-admin-secret` header.

| Method | Endpoint                       | Description                    |
|--------|-------------------------------|--------------------------------|
| GET    | `/admin/users`                | Paginated user list            |
| GET    | `/admin/users/:id/expenses`   | User's expenses                |
| PUT    | `/admin/users/:id`            | Update user                    |
| DELETE | `/admin/users/:id`            | Delete user + cascade          |
| GET    | `/admin/expenses`             | Filtered expense list          |
| PUT    | `/admin/expenses/:id`         | Update expense                 |
| DELETE | `/admin/expenses/:id`         | Delete expense                 |
| POST   | `/admin/expenses/bulk-delete` | Bulk delete                    |
| GET    | `/admin/expenses/export`      | CSV export                     |
| GET    | `/admin/categories`           | All categories                 |
| GET    | `/admin/stats`                | Dashboard statistics           |
| POST   | `/admin/db/run-script`        | Execute SQL script             |
| DELETE | `/admin/db/clear-user/:id`    | Clear user data                |
| POST   | `/admin/patch-field`          | Patch individual record field  |

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (CSS-first config)
- **Recharts** (data visualization)
- **Axios** (HTTP client)
- **React Router v7** (client-side routing)
