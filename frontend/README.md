# SmartSpend AI Frontend

Frontend application for the SmartSpend AI Expense Tracker platform.

Built using React, Vite, Tailwind CSS, Framer Motion, and Recharts.

This frontend provides a premium fintech-style dashboard inspired by modern SaaS platforms like CRED.club.

---

# Tech Stack

## Core

* React
* Vite
* React Router DOM

## Styling

* Tailwind CSS
* Framer Motion
* Lucide React Icons

## Charts & Analytics

* Recharts

## API Communication

* Axios

---

# Features

## Authentication

* User Login
* User Registration
* JWT Token Authentication
* Protected Routes

## Dashboard

* Expense Overview
* Monthly Trends
* Category Breakdown
* Recent Transactions
* Analytics Cards

## Expense Management

* Add Expense
* Edit Expense
* Delete Expense
* Filter Expenses

## Categories

* Dynamic Categories
* Custom Category Creation

## Analytics

* Spending Insights
* Interactive Charts
* Monthly Reports

---

# Design Philosophy

The UI is inspired by:

* CRED.club
* modern fintech dashboards
* premium SaaS products

Design characteristics:

* dark premium theme
* glassmorphism
* smooth animations
* responsive layouts
* minimalistic UI
* modern typography

---

# Folder Structure

```bash
frontend/
│
├── public/
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

# Installation

## Move into frontend directory

```bash
cd frontend
```

---

# Install Dependencies

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# Backend Connection

The frontend connects to the FastAPI backend running at:

```bash
http://127.0.0.1:8000
```

---

# Required Backend Features

The backend should support:

* JWT Authentication
* Expense CRUD APIs
* Category APIs
* Analytics APIs
* Filtering APIs

---

# Environment Variables

Create a `.env` file inside frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

# Available Scripts

## Start Development Server

```bash
npm run dev
```

## Build Production Version

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Planned Features

* AI Financial Insights
* Spending Prediction
* Budget Recommendation System
* Smart Expense Categorization
* Real-time Analytics
* Mobile Optimization
* Cloud Deployment

---

# UI/UX Notes

The exported Stitch AI designs are used as:

* visual reference
* layout inspiration
* component structure guide

The final implementation follows:

* reusable React components
* scalable architecture
* responsive design system

---

