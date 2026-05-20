# Expense Tracker

A full-stack personal expense tracker application built using FastAPI, MariaDB, SQLAlchemy, and JWT Authentication.

This project is designed to help users securely manage their daily expenses, track spending patterns, and later integrate intelligent ML-based financial insights.

---

# Features

## Authentication

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Token Authentication
* Protected Routes

## Expense Management

* Add Expenses
* View Expenses
* Update Expenses
* Delete Expenses

## Analytics

* Monthly Expense Summary
* User-specific Expense Data

## Database

* MariaDB Integration
* SQLAlchemy ORM
* Relational Database Design

---

# Tech Stack

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Passlib
* Bcrypt

## Database

* MariaDB
* HeidiSQL

## Frontend (Planned)

* React
* Tailwind CSS
* Axios

## ML Module (Planned)

* Expense Prediction
* Smart Spending Suggestions
* Expense Categorization

---

# Project Structure

```bash
Expense_Tracker/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── venv/
│
├── database/
│
├── frontend/
│
├── ml-model/
│
└── README.md
```

---

# Database Schema

## Users Table

Stores user authentication details.

## Categories Table

Stores default and user-defined expense categories.

## Expenses Table

Stores all expense records linked to users and categories.

---

# API Features

## Authentication APIs

* POST `/auth/register`
* POST `/auth/login`

## Expense APIs

* POST `/expenses/add`
* GET `/expenses/`
* PUT `/expenses/update/{expense_id}`
* DELETE `/expenses/delete/{expense_id}`

## Analytics APIs

* GET `/expenses/monthly-summary`

---

# Authentication Flow

1. User registers an account
2. Password is securely hashed
3. User logs in
4. JWT token is generated
5. Protected APIs require Bearer token authorization

---

# Current Status

## Completed

* Backend Setup
* Database Connection
* JWT Authentication
* Expense CRUD APIs
* Monthly Summary API

## In Progress

* Category APIs
* Expense Filtering
* Dashboard Analytics

## Planned

* React Frontend
* Data Visualization
* ML Recommendation Engine
* Deployment

---

# Installation

## Clone Repository

```bash
git clone https://github.com/brovoski69/Expense-Tracker.git
```

## Move into Project Directory

```bash
cd Expense-Tracker
```

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Run Backend Server

```bash
uvicorn app.main:app --reload
```

---

# API Documentation

FastAPI Swagger UI:

```bash
http://127.0.0.1:8000/docs
```

---

# Future Enhancements

* Expense Charts & Visualization
* AI-based Expense Insights
* Budget Recommendation System
* Expense Prediction using Machine Learning
* Cloud Deployment
* Mobile Responsive Frontend

---

# Learning Goals

This project is being built to gain hands-on experience with:

* Backend Development
* Database Design
* REST APIs
* Authentication Systems
* Software Architecture
* Machine Learning Integration

---

