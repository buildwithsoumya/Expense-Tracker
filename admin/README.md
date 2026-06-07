# SmartSpend AI — Admin Dashboard

> A secure, standalone admin panel for managing the SmartSpend AI platform. Full visibility into users, expenses, and platform health — with live data editing and export tools.

---

##  Features

###  Dashboard
- Platform-wide stats: total users, total expenses, total spend, avg per user
- Top spenders leaderboard
- Category breakdown chart
- Daily activity bar chart

###  User Management
- Paginated user list with spend totals and transaction counts
- **Inline expense drawer** — click the `⌄` chevron on any user row to expand their expenses in-place
- Edit user details (name, email) via modal
- Delete user with cascade confirmation

###  Expense Management (Expenses Page)
- Search and filter by: User ID, Category, Date Range, Min/Max Amount
- Inline edit expenses
- Bulk select and delete
- CSV export (with active filters applied)

###  Raw Data Explorer
- Live table view of any database table
- Sortable columns
- JSON record inspector
- Individual field patching without running SQL

###  DB Operations
- Terminal-style SQL script runner
- Seed data utilities
- Clear individual user data

---

##  Security

All admin API endpoints require the `x-admin-secret` header. This is set automatically from your `.env` file. Keep the secret strong — it's the only protection on the admin API.

---

##  Setup

### 1. Install dependencies

```bash
cd admin
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8001
VITE_ADMIN_SECRET=your_admin_secret_key
```

The `ADMIN_SECRET` in the backend `.env` must match `VITE_ADMIN_SECRET` here.

### 3. Run the dashboard

```bash
npm run dev
```

Available at: `http://localhost:5174` (or next available port)

---

## Folder Structure

```
admin/
├── src/
│   ├── api/
│   │   └── adminApi.js           # Axios API layer with admin secret header
│   ├── components/
│   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   ├── Modal.jsx              # Reusable modal
│   │   ├── StatsCards.jsx         # Animated stat cards
│   │   ├── Charts.jsx             # Recharts visualisations
│   │   ├── UserTable.jsx          # User table + inline expense drawer
│   │   ├── ExpenseTable.jsx       # Expense table with inline edit
│   │   ├── RawDataExplorer.jsx    # Live data table + JSON viewer
│   │   └── DBOperationsPanel.jsx  # Terminal-style DB ops
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Expenses.jsx           # Filter/search-focused expense view
│   │   ├── DataExplorer.jsx
│   │   └── DBOps.jsx
│   ├── App.jsx                    # Login gate + layout + routing
│   ├── main.jsx
│   └── index.css                  # Tailwind v4 + design tokens
├── index.html
├── package.json
├── vite.config.js
├── .env
└── .env.example
```

---

##  Admin API Reference

All endpoints are mounted at `/admin` and require the `x-admin-secret` header.

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users` | Paginated user list with stats |
| GET | `/admin/users/:id/expenses` | All expenses for a specific user |
| PUT | `/admin/users/:id` | Update user name / email |
| DELETE | `/admin/users/:id` | Delete user + cascade all data |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/expenses` | Filtered expense list |
| PUT | `/admin/expenses/:id` | Update expense |
| DELETE | `/admin/expenses/:id` | Delete expense |
| POST | `/admin/expenses/bulk-delete` | Bulk delete by IDs |
| GET | `/admin/expenses/export` | Export as CSV |

### Platform

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/categories` | All categories |
| GET | `/admin/stats` | Platform-wide stats |

### Database

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/db/run-script` | Execute raw SQL script |
| DELETE | `/admin/db/clear-user/:id` | Clear all data for a user |
| POST | `/admin/patch-field` | Patch a single record field live |

---

##  Tech Stack

| | |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 (CSS-first config) |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Theme** | Black + Amber two-tone dark UI |
