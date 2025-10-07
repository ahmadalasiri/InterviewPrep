# Basic PostgreSQL Interview Questions

## Table of Contents

- [PostgreSQL Fundamentals](#postgresql-fundamentals)
- [Basic SQL Queries](#basic-sql-queries)
- [Data Types and Constraints](#data-types-and-constraints)
- [Joins](#joins)
- [Indexes](#indexes)

---

## PostgreSQL Fundamentals

### Q1: What is PostgreSQL and why is it popular?

**Answer:**
PostgreSQL is an open-source, object-relational database management system (ORDBMS) known for its robustness, extensibility, and standards compliance.

**Key Features:**

- **Open Source**: Free and community-driven
- **ACID Compliant**: Reliable transactions
- **SQL Standards**: Comprehensive SQL support
- **Extensible**: Custom data types, functions, operators
- **Advanced Features**: JSON/JSONB, full-text search, GIS support
- **Cross-Platform**: Works on multiple operating systems

**Popular Because:**

- Reliability and data integrity
- Advanced features beyond basic SQL
- Strong community and ecosystem
- Excellent performance
- Support for complex queries
- Regular updates and long-term support

---

### Q2: What are the main differences between PostgreSQL and MySQL?

**Answer:**

| Feature              | PostgreSQL                  | MySQL                       |
| -------------------- | --------------------------- | --------------------------- |
| **Type**             | Object-Relational           | Relational                  |
| **ACID Compliance**  | Full ACID                   | InnoDB engine only          |
| **JSON Support**     | JSONB (binary, indexed)     | JSON (text-based)           |
| **Standards**        | More SQL standard compliant | Some proprietary extensions |
| **Concurrency**      | MVCC                        | Row-level locking           |
| **Full-Text Search** | Built-in                    | Limited                     |
| **Window Functions** | Yes                         | Yes (5.7+)                  |
| **CTEs**             | Yes, including recursive    | Yes (8.0+)                  |
| **Replication**      | Streaming, logical          | Master-slave, group         |
| **Extensibility**    | Highly extensible           | Limited                     |

**Use PostgreSQL When:**

- Need complex queries and data integrity
- Advanced data types (JSONB, arrays, etc.)
- Full-text search
- Geospatial data (PostGIS)
- Need extensibility

**Use MySQL When:**

- Simple read-heavy applications
- Web applications with simple queries
- Need master-master replication
- Prefer simplicity over features

---

### Q3: What is ACID in PostgreSQL?

**Answer:**
ACID represents four key properties that guarantee database transactions are processed reliably.

**A - Atomicity:**

- Transaction is all-or-nothing
- Either all operations succeed or all fail

```sql
BEGIN;
  INSERT INTO accounts (name, balance) VALUES ('Alice', 1000);
  INSERT INTO accounts (name, balance) VALUES ('Bob', 500);
COMMIT;  -- Both inserts succeed or both fail
```

**C - Consistency:**

- Database moves from one valid state to another
- Constraints are enforced

```sql
-- Check constraint ensures consistency
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  balance DECIMAL(10,2) CHECK (balance >= 0)  -- Cannot be negative
);
```

**I - Isolation:**

- Concurrent transactions don't interfere
- Different isolation levels available

```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT balance FROM accounts WHERE id = 1;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

**D - Durability:**

- Once committed, changes persist even after system failure
- Written to disk and logged

---

## Basic SQL Queries

### Q4: How do you create, read, update, and delete data in PostgreSQL?

**Answer:**

**CREATE (INSERT):**

```sql
-- Insert single row
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@example.com', 30);

-- Insert multiple rows
INSERT INTO users (name, email, age)
VALUES
  ('Alice Smith', 'alice@example.com', 25),
  ('Bob Johnson', 'bob@example.com', 35);

-- Insert and return inserted row
INSERT INTO users (name, email)
VALUES ('Charlie', 'charlie@example.com')
RETURNING *;

-- Insert from SELECT
INSERT INTO archived_users
SELECT * FROM users WHERE last_login < '2020-01-01';
```

**READ (SELECT):**

```sql
-- Select all
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- With WHERE clause
SELECT * FROM users WHERE age >= 18;

-- With ORDER BY
SELECT * FROM users ORDER BY age DESC;

-- With LIMIT
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- With OFFSET (pagination)
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;
```

**UPDATE:**

```sql
-- Update single column
UPDATE users SET age = 31 WHERE id = 1;

-- Update multiple columns
UPDATE users
SET age = 32, updated_at = NOW()
WHERE id = 1;

-- Update with calculation
UPDATE products
SET price = price * 1.1  -- 10% increase
WHERE category = 'Electronics';

-- Update and return
UPDATE users SET age = age + 1 WHERE id = 1 RETURNING *;
```

**DELETE:**

```sql
-- Delete specific row
DELETE FROM users WHERE id = 1;

-- Delete with condition
DELETE FROM users WHERE last_login < '2020-01-01';

-- Delete all (careful!)
DELETE FROM users;

-- Delete and return
DELETE FROM users WHERE id = 1 RETURNING *;

-- Truncate (faster for all rows)
TRUNCATE TABLE users;
```

---

### Q5: How do you filter and sort data?

**Answer:**

**WHERE Clause:**

```sql
-- Equality
SELECT * FROM users WHERE age = 30;

-- Comparison operators
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE age >= 18 AND age <= 65;

-- BETWEEN
SELECT * FROM users WHERE age BETWEEN 18 AND 65;

-- IN
SELECT * FROM users WHERE status IN ('active', 'pending');

-- NOT IN
SELECT * FROM users WHERE status NOT IN ('banned', 'suspended');

-- LIKE (pattern matching)
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM users WHERE name LIKE 'John%';  -- Starts with John

-- ILIKE (case-insensitive)
SELECT * FROM users WHERE name ILIKE 'john%';

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;

-- Multiple conditions
SELECT * FROM users
WHERE age >= 18
  AND status = 'active'
  AND (city = 'NYC' OR city = 'LA');
```

**ORDER BY:**

```sql
-- Ascending (default)
SELECT * FROM users ORDER BY age;
SELECT * FROM users ORDER BY age ASC;

-- Descending
SELECT * FROM users ORDER BY age DESC;

-- Multiple columns
SELECT * FROM users ORDER BY age DESC, name ASC;

-- NULL handling
SELECT * FROM users ORDER BY last_login NULLS LAST;
SELECT * FROM users ORDER BY last_login NULLS FIRST;

-- Order by expression
SELECT * FROM products ORDER BY price * discount DESC;
```

**LIMIT and OFFSET:**

```sql
-- Top 10
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Pagination (page 3, 20 per page)
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 40;

-- Alternative syntax (PostgreSQL specific)
SELECT * FROM users ORDER BY id OFFSET 40 LIMIT 20;
```

---

## Data Types and Constraints

### Q6: What are the common data types in PostgreSQL?

**Answer:**

**Numeric Types:**

```sql
-- Integer types
SMALLINT        -- 2 bytes, -32,768 to 32,767
INTEGER / INT   -- 4 bytes, -2 billion to 2 billion
BIGINT          -- 8 bytes, very large numbers

-- Auto-increment
SERIAL          -- Auto-incrementing integer (1 to 2 billion)
BIGSERIAL       -- Auto-incrementing bigint

-- Decimal types
DECIMAL(p, s)   -- Exact numeric, p = precision, s = scale
NUMERIC(p, s)   -- Same as DECIMAL
REAL            -- 4 bytes, floating-point
DOUBLE PRECISION -- 8 bytes, floating-point
```

**String Types:**

```sql
-- Character types
CHAR(n)         -- Fixed length, padded with spaces
VARCHAR(n)      -- Variable length with limit
TEXT            -- Variable unlimited length

-- Common usage
name VARCHAR(100)    -- Name with max 100 chars
description TEXT     -- Long text content
code CHAR(10)        -- Fixed-length code
```

**Date/Time Types:**

```sql
DATE            -- Date only (2024-01-15)
TIME            -- Time only (14:30:00)
TIMESTAMP       -- Date and time (2024-01-15 14:30:00)
TIMESTAMPTZ     -- Timestamp with timezone
INTERVAL        -- Time interval

-- Example
created_at TIMESTAMP DEFAULT NOW()
expires_at TIMESTAMPTZ
duration INTERVAL
```

**Boolean:**

```sql
BOOLEAN         -- TRUE, FALSE, NULL
is_active BOOLEAN DEFAULT TRUE
```

**JSON Types:**

```sql
JSON            -- Text-based JSON
JSONB           -- Binary JSON (faster, indexable)

-- Example
metadata JSONB
preferences JSON
```

**Arrays:**

```sql
-- Array of any type
tags TEXT[]
scores INTEGER[]

-- Example
INSERT INTO posts (title, tags)
VALUES ('My Post', ARRAY['tech', 'tutorial']);
```

**Special Types:**

```sql
UUID            -- Universally unique identifier
INET            -- IP address
MACADDR         -- MAC address
MONEY           -- Currency
```

---

### Q7: What are constraints in PostgreSQL?

**Answer:**
Constraints enforce rules on data in tables to maintain data integrity.

**PRIMARY KEY:**

```sql
-- Single column
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255)
);

-- Composite primary key
CREATE TABLE order_items (
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  PRIMARY KEY (order_id, product_id)
);
```

**FOREIGN KEY:**

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  user_id INTEGER REFERENCES users(id),
  category_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ON DELETE options:
-- CASCADE - Delete dependent rows
-- SET NULL - Set foreign key to NULL
-- SET DEFAULT - Set foreign key to default value
-- RESTRICT - Prevent deletion (default)
-- NO ACTION - Same as RESTRICT
```

**UNIQUE:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE
);

-- Composite unique constraint
CREATE TABLE user_roles (
  user_id INTEGER,
  role_id INTEGER,
  UNIQUE (user_id, role_id)
);
```

**NOT NULL:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL
);
```

**CHECK:**

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2) CHECK (price > 0),
  stock INTEGER CHECK (stock >= 0),
  discount DECIMAL(3,2) CHECK (discount BETWEEN 0 AND 1)
);

-- Named constraint
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  age INTEGER,
  CONSTRAINT valid_age CHECK (age >= 18 AND age <= 100)
);
```

**DEFAULT:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  is_verified BOOLEAN DEFAULT FALSE
);
```

---

## Joins

### Q8: What are the different types of JOINs?

**Answer:**

**Sample Data:**

```sql
-- users table
id | name     | email
---|----------|------------------
1  | Alice    | alice@example.com
2  | Bob      | bob@example.com
3  | Charlie  | charlie@example.com

-- posts table
id | user_id | title
---|---------|-------------
1  | 1       | Post by Alice
2  | 1       | Another by Alice
3  | 2       | Post by Bob
4  | 99      | Orphaned Post
```

**INNER JOIN:**
Returns only matching rows from both tables.

```sql
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- Result:
-- Alice | Post by Alice
-- Alice | Another by Alice
-- Bob   | Post by Bob
```

**LEFT JOIN (LEFT OUTER JOIN):**
Returns all rows from left table, matching rows from right table (NULL if no match).

```sql
SELECT u.name, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

-- Result:
-- Alice   | Post by Alice
-- Alice   | Another by Alice
-- Bob     | Post by Bob
-- Charlie | NULL  (Charlie has no posts)
```

**RIGHT JOIN (RIGHT OUTER JOIN):**
Returns all rows from right table, matching rows from left table.

```sql
SELECT u.name, p.title
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;

-- Result:
-- Alice | Post by Alice
-- Alice | Another by Alice
-- Bob   | Post by Bob
-- NULL  | Orphaned Post  (No user with id 99)
```

**FULL OUTER JOIN:**
Returns all rows from both tables, NULL where no match.

```sql
SELECT u.name, p.title
FROM users u
FULL OUTER JOIN posts p ON u.id = p.user_id;

-- Result:
-- Alice   | Post by Alice
-- Alice   | Another by Alice
-- Bob     | Post by Bob
-- Charlie | NULL
-- NULL    | Orphaned Post
```

**CROSS JOIN:**
Cartesian product - every row from first table with every row from second.

```sql
SELECT u.name, p.title
FROM users u
CROSS JOIN posts p;

-- Returns: 3 users × 4 posts = 12 rows
```

**Self JOIN:**
Join table with itself.

```sql
-- Find users from same city
SELECT u1.name as user1, u2.name as user2, u1.city
FROM users u1
INNER JOIN users u2 ON u1.city = u2.city AND u1.id < u2.id;
```

---

### Q9: How do you perform aggregate functions and GROUP BY?

**Answer:**

**Aggregate Functions:**

```sql
-- COUNT
SELECT COUNT(*) FROM users;  -- Count all rows
SELECT COUNT(phone) FROM users;  -- Count non-NULL values
SELECT COUNT(DISTINCT city) FROM users;  -- Count unique cities

-- SUM
SELECT SUM(amount) FROM orders;

-- AVG
SELECT AVG(price) FROM products;

-- MAX / MIN
SELECT MAX(price), MIN(price) FROM products;

-- Multiple aggregates
SELECT
  COUNT(*) as total_users,
  AVG(age) as average_age,
  MAX(created_at) as latest_signup
FROM users;
```

**GROUP BY:**

```sql
-- Group by single column
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city;

-- Group by multiple columns
SELECT city, status, COUNT(*) as count
FROM users
GROUP BY city, status;

-- With aggregate functions
SELECT
  category,
  COUNT(*) as product_count,
  AVG(price) as avg_price,
  MAX(price) as max_price
FROM products
GROUP BY category;

-- With ORDER BY
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
ORDER BY count DESC;
```

**HAVING:**
Filter groups (use after GROUP BY).

```sql
-- Find categories with more than 10 products
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
HAVING COUNT(*) > 10;

-- Average price filter
SELECT category, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 100;

-- Multiple conditions
SELECT
  city,
  COUNT(*) as user_count,
  AVG(age) as avg_age
FROM users
GROUP BY city
HAVING COUNT(*) > 100 AND AVG(age) < 40;
```

**Difference: WHERE vs HAVING:**

```sql
-- WHERE filters rows BEFORE grouping
-- HAVING filters groups AFTER grouping

SELECT category, COUNT(*) as count
FROM products
WHERE price > 10        -- Filter products before grouping
GROUP BY category
HAVING COUNT(*) > 5;    -- Filter categories after grouping
```

---

## Indexes

### Q10: What are indexes and why are they important?

**Answer:**
Indexes are data structures that improve query performance by allowing faster data retrieval.

**Creating Indexes:**

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (multiple columns)
CREATE INDEX idx_users_city_age ON users(city, age);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Partial index (conditional)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Expression index
CREATE INDEX idx_lower_email ON users(LOWER(email));
```

**When to Use Indexes:**

✅ **Use Indexes For:**

- Primary keys (automatic)
- Foreign keys
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Columns in GROUP BY

❌ **Don't Index:**

- Small tables
- Columns with low selectivity (e.g., boolean)
- Columns rarely used in queries
- Tables with frequent INSERT/UPDATE

**Benefits:**

- Faster SELECT queries
- Faster JOIN operations
- Improved sorting performance

**Trade-offs:**

- Slower INSERT/UPDATE/DELETE
- Additional storage space
- Maintenance overhead

**Viewing Indexes:**

```sql
-- List indexes on a table
\di users

-- Show index definition
\d users

-- Query system catalog
SELECT * FROM pg_indexes WHERE tablename = 'users';
```

**Analyzing Index Usage:**

```sql
-- Check if index is used
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- Detailed analysis
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

---

This covers basic PostgreSQL concepts. Practice these fundamentals before moving to advanced topics!
