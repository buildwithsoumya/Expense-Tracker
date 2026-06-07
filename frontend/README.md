# SmartSpend AI — User Frontend

> Premium fintech-style expense dashboard. Dark-themed, glassmorphic, and fast — built for a CRED-level experience.

---

## ✅ Features

### 🔐 Authentication
- Login & Registration with JWT
- Protected route guards
- **Forgot Password** — OTP sent to registered email
- **Reset Password** — 6-digit code input with resend cooldown and password strength meter

### 🏠 Dashboard
- Total spend, monthly average, transaction count cards
- Monthly trend line chart
- Category-wise spending breakdown
- Recent transactions feed

### 💸 Expense Management
- Add, edit, delete expenses via modal
- Filter by date range, category, amount
- Paginated expense list with category badges

### 📊 Analytics
- Interactive Recharts visualisations
- Monthly comparison bar charts
- Category pie/donut charts
- Spending insights

### 🗂️ Categories
- Default + user-created custom categories
- Manage, rename, delete categories

### 🔗 Clickable Logo
- Logo always navigates back to home page from anywhere in the app

---

## 🛠️ Tech Stack

| | |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Auth** | JWT stored in localStorage |

---

## 📁 Folder Structure

```
frontend/
├── public/
└── src/
    ├── api/
    │   └── axios.js            # Axios instance with JWT interceptor
    ├── components/
    │   ├── Button.jsx
    │   ├── Input.jsx
    │   ├── Logo.jsx             # Clickable brand logo
    │   ├── Modal.jsx
    │   ├── Navbar.jsx
    │   ├── Sidebar.jsx
    │   ├── ExpenseTable.jsx
    │   └── ...
    ├── context/
    ├── hooks/
    │   └── useAuth.js
    ├── layouts/
    │   └── AppLayout.jsx
    ├── pages/
    │   ├── Landing.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── ForgotPassword.jsx   # OTP request page
    │   ├── ResetPassword.jsx    # OTP entry + new password
    │   ├── Dashboard.jsx
    │   ├── Expenses.jsx
    │   ├── Analytics.jsx
    │   ├── Categories.jsx
    │   └── Settings.jsx
    ├── routes/
    │   ├── AppRoutes.jsx
    │   └── ProtectedRoute.jsx
    ├── App.jsx
    └── main.jsx
```

---

## ⚙️ Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

The Vite dev server proxies `/api/*` → `http://127.0.0.1:8001` automatically.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 🔌 Backend Connection

The Vite dev proxy in `vite.config.js` forwards all `/api` requests to the backend:

```js
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8001',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  }
}
```

No `.env` file needed for local development.

---

## 🎨 Design System

- **Theme**: Dark premium (`bg-ink`, `text-silver`)
- **Glass panels**: `backdrop-filter: blur` with border overlays
- **Animations**: Framer Motion page transitions and micro-animations
- **Typography**: Hanken Grotesk + Inter via Google Fonts
- **Color accent**: Indigo-violet (`#6c63ff`) + Teal (`#48cfad`)
