# Expense Tracker Database

**Database name:** `expense_tracker`

This folder contains the SQL files you need to create the schema and load sample data for your MariaDB-based expense tracker.

## Database structure

**users**
- `user_id` (PK, auto increment)
- `first_name`
- `last_name`
- `email` (unique)
- `password_hash`
- `created_at`

**categories**
- `category_id` (PK, auto increment)
- `user_id` (nullable FK → users.user_id)
- `category_name`
- `is_default` (boolean)
- `created_at`

**expenses**
- `expense_id` (PK, auto increment)
- `user_id` (FK → users.user_id)
- `category_id` (FK → categories.category_id)
- `amount`
- `description`
- `payment_method` (ENUM)
- `expense_date`
- `created_at`

## Relationships (brief)

Each **user** can have many **categories** and many **expenses**. Each **expense** belongs to exactly one **user** and one **category**. Default categories are stored with `user_id = NULL`, while custom categories are linked to a specific user.

## ER diagram (text)

```
users      ||--o{  categories   : creates
users      ||--o{  expenses     : records
categories ||--o{  expenses     : classifies
```

## How to run `schema.sql` in HeidiSQL

1. Open HeidiSQL and connect to your MariaDB server.
2. Click **File → Load SQL file...** and choose `schema.sql`.
3. Press **F9** or click **Run** to execute the script.
4. Confirm that the `expense_tracker` database appears in the left sidebar.

## How to run `sample_data.sql`

1. With the same server connection open, click **File → Load SQL file...** and choose `sample_data.sql`.
2. Press **F9** or click **Run** to insert the sample data.
3. Refresh the database tree to see the inserted rows.
