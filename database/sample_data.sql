-- ============================================================
-- Sample data for Expense Tracker
-- Database: expense_tracker
-- ============================================================

USE expense_tracker;

-- ------------------------------------------------------------
-- Sample users
-- Password hashes are placeholders for demo purposes
-- ------------------------------------------------------------
INSERT INTO users (first_name, last_name, email, password_hash)
VALUES
  ('Aarav', 'Sharma', 'aarav.sharma@example.com', '$2b$12$Qv7J0r5aS1N4Y0kH7Qm8fOxQxLr8aU6l3XvQm1p6s6E2M1uXy0jRm'),
  ('Diya', 'Iyer', 'diya.iyer@example.com', '$2b$12$R1x2b8mPz2QeT7o2L7m0hOuCz8m9jT1a2m3n4p5q6r7s8t9u0v1w');

-- ------------------------------------------------------------
-- Custom categories (user-specific)
-- ------------------------------------------------------------
INSERT INTO categories (user_id, category_name, is_default)
VALUES
  ((SELECT user_id FROM users WHERE email = 'aarav.sharma@example.com'), 'Gym', 0),
  ((SELECT user_id FROM users WHERE email = 'diya.iyer@example.com'), 'Books', 0);

-- ------------------------------------------------------------
-- Sample expenses
-- ------------------------------------------------------------
INSERT INTO expenses (user_id, category_id, amount, description, payment_method, expense_date)
VALUES
  (
    (SELECT user_id FROM users WHERE email = 'aarav.sharma@example.com'),
    (SELECT category_id FROM categories WHERE category_name = 'Food' AND is_default = 1 LIMIT 1),
    220.50,
    'Lunch at campus canteen',
    'UPI',
    '2026-05-05'
  ),
  (
    (SELECT user_id FROM users WHERE email = 'aarav.sharma@example.com'),
    (SELECT category_id FROM categories WHERE category_name = 'Travel' AND is_default = 1 LIMIT 1),
    480.00,
    'Metro card recharge',
    'Debit Card',
    '2026-05-07'
  ),
  (
    (SELECT user_id FROM users WHERE email = 'aarav.sharma@example.com'),
    (SELECT category_id FROM categories WHERE category_name = 'Gym' AND is_default = 0 LIMIT 1),
    999.00,
    'Monthly gym membership',
    'Net Banking',
    '2026-05-01'
  ),
  (
    (SELECT user_id FROM users WHERE email = 'diya.iyer@example.com'),
    (SELECT category_id FROM categories WHERE category_name = 'Shopping' AND is_default = 1 LIMIT 1),
    1250.00,
    'New headphones',
    'Credit Card',
    '2026-05-09'
  ),
  (
    (SELECT user_id FROM users WHERE email = 'diya.iyer@example.com'),
    (SELECT category_id FROM categories WHERE category_name = 'Books' AND is_default = 0 LIMIT 1),
    540.00,
    'Data Structures textbook',
    'Cash',
    '2026-05-11'
  );
