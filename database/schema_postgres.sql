-- PostgreSQL Schema for Supabase

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  user_id INT NULL,
  category_name VARCHAR(60) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(category_name);

-- Create ENUM type for payment methods if it doesn't exist
DO $$ BEGIN
    CREATE TYPE payment_methods AS ENUM ('Cash', 'UPI', 'Debit Card', 'Credit Card', 'Net Banking');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS expenses (
  expense_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NULL,
  payment_method payment_methods NOT NULL DEFAULT 'UPI',
  expense_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_expenses_category
    FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);

INSERT INTO categories (user_id, category_name, is_default) VALUES
  (NULL, 'Food', TRUE),
  (NULL, 'Travel', TRUE),
  (NULL, 'Shopping', TRUE),
  (NULL, 'Bills', TRUE),
  (NULL, 'Entertainment', TRUE);
