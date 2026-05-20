-- ============================================================
-- Schema for Expense Tracker (MariaDB)
-- Database: expense_tracker
-- ============================================================

-- Create database (if it doesn't already exist)
CREATE DATABASE IF NOT EXISTS expense_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Use the database
USE expense_tracker;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: categories
-- Supports:
-- 1) Default categories (user_id = NULL, is_default = 1)
-- 2) User custom categories (user_id = <user_id>, is_default = 0)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  category_name VARCHAR(60) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_categories_user_id (user_id),
  KEY idx_categories_name (category_name),
  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: expenses
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
  expense_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NULL,
  payment_method ENUM('Cash', 'UPI', 'Debit Card', 'Credit Card', 'Net Banking') NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_expenses_user_id (user_id),
  KEY idx_expenses_category_id (category_id),
  KEY idx_expenses_expense_date (expense_date),
  CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_expenses_category
    FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Default categories (global for all users)
-- ------------------------------------------------------------
INSERT INTO categories (user_id, category_name, is_default)
VALUES
  (NULL, 'Food', 1),
  (NULL, 'Travel', 1),
  (NULL, 'Shopping', 1),
  (NULL, 'Bills', 1),
  (NULL, 'Entertainment', 1);
