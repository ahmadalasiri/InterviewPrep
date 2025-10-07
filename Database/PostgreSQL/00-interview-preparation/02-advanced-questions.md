# Advanced PostgreSQL Interview Questions

## Table of Contents

- [Window Functions](#window-functions)
- [Common Table Expressions (CTEs)](#common-table-expressions-ctes)
- [Transactions and Isolation Levels](#transactions-and-isolation-levels)
- [Performance Optimization](#performance-optimization)
- [Advanced Features](#advanced-features)

---

## Window Functions

### Q1: What are window functions and how do they differ from aggregate functions?

**Answer:**
Window functions perform calculations across a set of rows related to the current row, without collapsing rows like GROUP BY.

**Key Differences:**

| Feature     | Aggregate Functions                | Window Functions                              |
| ----------- | ---------------------------------- | --------------------------------------------- |
| Groups rows | Yes                                | No                                            |
| Returns     | One row per group                  | One row per input row                         |
| Syntax      | `SELECT AVG(salary) GROUP BY dept` | `SELECT AVG(salary) OVER (PARTITION BY dept)` |

**Common Window Functions:**

```sql
-- ROW_NUMBER: Unique number for each row
SELECT
  name,
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) as row_num
FROM employees;

-- RANK: Ranking with gaps for ties
SELECT
  name,
  salary,
  RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- DENSE_RANK: Ranking without gaps
SELECT
  name,
  salary,
  DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank
FROM employees;

-- PARTITION BY: Window per group
SELECT
  name,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) as dept_avg,
  salary - AVG(salary) OVER (PARTITION BY department) as diff_from_avg
FROM employees;

-- Running totals
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;

-- LAG and LEAD: Previous/next row values
SELECT
  date,
  amount,
  LAG(amount, 1) OVER (ORDER BY date) as previous_amount,
  LEAD(amount, 1) OVER (ORDER BY date) as next_amount,
  amount - LAG(amount, 1) OVER (ORDER BY date) as change
FROM transactions;

-- NTILE: Divide into buckets
SELECT
  name,
  salary,
  NTILE(4) OVER (ORDER BY salary) as quartile
FROM employees;
```

**Practical Example - Top N per Group:**

```sql
-- Get top 3 salaries per department
WITH ranked_employees AS (
  SELECT
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
  FROM employees
)
SELECT name, department, salary
FROM ranked_employees
WHERE rank <= 3;
```

---

## Common Table Expressions (CTEs)

### Q2: What are CTEs and when should you use them?

**Answer:**
CTEs (Common Table Expressions) are temporary named result sets that exist within the scope of a single query.

**Basic CTE:**

```sql
WITH active_users AS (
  SELECT * FROM users WHERE status = 'active'
)
SELECT * FROM active_users WHERE created_at > '2024-01-01';
```

**Multiple CTEs:**

```sql
WITH
  active_users AS (
    SELECT * FROM users WHERE status = 'active'
  ),
  recent_orders AS (
    SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '30 days'
  )
SELECT u.name, COUNT(o.id) as order_count
FROM active_users u
LEFT JOIN recent_orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

**Recursive CTEs:**

```sql
-- Organization hierarchy
WITH RECURSIVE employee_hierarchy AS (
  -- Base case: top-level employees
  SELECT id, name, manager_id, 1 as level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive case: employees under managers
  SELECT e.id, e.name, e.manager_id, eh.level + 1
  FROM employees e
  INNER JOIN employee_hierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM employee_hierarchy ORDER BY level, name;

-- Generate series
WITH RECURSIVE date_series AS (
  SELECT DATE '2024-01-01' as date
  UNION ALL
  SELECT date + INTERVAL '1 day'
  FROM date_series
  WHERE date < '2024-12-31'
)
SELECT * FROM date_series;
```

**When to Use CTEs:**

✅ **Use CTEs When:**

- Improving query readability
- Need to reference same subquery multiple times
- Recursive queries (hierarchies, graphs)
- Breaking complex queries into steps

❌ **Consider Alternatives When:**

- Simple subqueries are clearer
- Performance is critical (sometimes subqueries are faster)
- Result set is large (consider temp tables)

---

## Transactions and Isolation Levels

### Q3: What are transaction isolation levels?

**Answer:**
Isolation levels control how transaction integrity is visible to other transactions.

**Four Isolation Levels:**

**1. READ UNCOMMITTED (Not supported in PostgreSQL):**

- Can read uncommitted changes from other transactions
- "Dirty reads" possible

**2. READ COMMITTED (PostgreSQL default):**

- Only reads committed data
- No dirty reads
- Non-repeatable reads possible

```sql
-- Session 1
BEGIN;
SELECT balance FROM accounts WHERE id = 1;  -- Returns 1000
-- (Session 2 commits update: balance = 500)
SELECT balance FROM accounts WHERE id = 1;  -- Returns 500 (non-repeatable read)
COMMIT;
```

**3. REPEATABLE READ:**

- Consistent reads within transaction
- Prevents non-repeatable reads
- Phantom reads possible

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT * FROM products WHERE price > 100;
-- (Session 2 inserts new product with price = 150)
SELECT * FROM products WHERE price > 100;  -- Same results (no phantom)
COMMIT;
```

**4. SERIALIZABLE (Strictest):**

- Complete isolation
- Transactions appear to run sequentially
- May cause serialization failures

```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT SUM(amount) FROM accounts;
  INSERT INTO transactions (amount) VALUES (100);
COMMIT;
```

**Transaction Commands:**

```sql
-- Start transaction
BEGIN;
START TRANSACTION;

-- Save point
BEGIN;
  INSERT INTO users (name) VALUES ('Alice');
  SAVEPOINT sp1;
  INSERT INTO users (name) VALUES ('Bob');
  ROLLBACK TO SAVEPOINT sp1;  -- Undo Bob, keep Alice
COMMIT;

-- Commit or rollback
COMMIT;
ROLLBACK;
```

---

## Performance Optimization

### Q4: How do you optimize slow queries in PostgreSQL?

**Answer:**

**Step 1: Identify Slow Queries**

```sql
-- Enable slow query logging (postgresql.conf)
log_min_duration_statement = 1000  -- Log queries > 1 second

-- View slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

**Step 2: Analyze Query Plan**

```sql
-- EXPLAIN: Show query plan
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- EXPLAIN ANALYZE: Show actual execution
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Key metrics to look for:
-- - Seq Scan (table scan) - BAD for large tables
-- - Index Scan - GOOD
-- - execution time
-- - rows returned vs rows scanned
```

**Step 3: Create Appropriate Indexes**

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Partial index
CREATE INDEX idx_active_users_email ON users(email) WHERE status = 'active';

-- Covering index
CREATE INDEX idx_users_covering ON users(email) INCLUDE (name, created_at);
```

**Step 4: Rewrite Query**

```sql
-- BAD: Function on indexed column prevents index usage
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';

-- GOOD: Use functional index
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
-- Or store email as lowercase

-- BAD: OR prevents index usage
SELECT * FROM users WHERE city = 'NYC' OR city = 'LA';

-- GOOD: Use IN
SELECT * FROM users WHERE city IN ('NYC', 'LA');

-- BAD: SELECT *
SELECT * FROM users WHERE id = 1;

-- GOOD: Select only needed columns
SELECT name, email FROM users WHERE id = 1;
```

**Step 5: Table Maintenance**

```sql
-- Update statistics
ANALYZE users;

-- Vacuum to reclaim space
VACUUM users;

-- Full vacuum (locks table)
VACUUM FULL users;

-- Reindex
REINDEX TABLE users;
```

**Common Optimization Techniques:**

1. **Use LIMIT**

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 100;
```

2. **Avoid N+1 Queries**

```sql
-- Bad: N+1 queries
for user in users:
    posts = query("SELECT * FROM posts WHERE user_id = ?", user.id)

-- Good: Single query with JOIN
SELECT u.*, p.*
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;
```

3. **Use EXISTS instead of IN for large datasets**

```sql
-- Slower for large subqueries
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);

-- Faster
SELECT * FROM users u WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

4. **Batch Operations**

```sql
-- Instead of multiple inserts
INSERT INTO users (name) VALUES ('Alice');
INSERT INTO users (name) VALUES ('Bob');

-- Use single insert
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
```

---

## Advanced Features

### Q5: What is JSONB and how do you use it?

**Answer:**
JSONB is PostgreSQL's binary JSON format - faster and indexable compared to JSON.

**Creating JSONB Columns:**

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  attributes JSONB
);
```

**Inserting JSONB Data:**

```sql
INSERT INTO products (name, attributes)
VALUES (
  'Laptop',
  '{"brand": "Apple", "specs": {"ram": "16GB", "storage": "512GB"}, "tags": ["tech", "premium"]}'::jsonb
);
```

**Querying JSONB:**

```sql
-- Extract value with ->
SELECT attributes -> 'brand' FROM products;  -- Returns JSON

-- Extract as text with ->>
SELECT attributes ->> 'brand' FROM products;  -- Returns 'Apple'

-- Nested access
SELECT attributes -> 'specs' ->> 'ram' FROM products;

-- Array elements
SELECT attributes -> 'tags' -> 0 FROM products;

-- Check key existence
SELECT * FROM products WHERE attributes ? 'brand';

-- Check value
SELECT * FROM products WHERE attributes @> '{"brand": "Apple"}';

-- Contains in array
SELECT * FROM products WHERE attributes -> 'tags' ? 'tech';
```

**JSONB Operators:**

```sql
-- @> contains
SELECT * FROM products WHERE attributes @> '{"brand": "Apple"}';

-- <@ contained by
SELECT * FROM products WHERE '{"brand": "Apple"}' <@ attributes;

-- ? key exists
SELECT * FROM products WHERE attributes ? 'brand';

-- ?| any key exists
SELECT * FROM products WHERE attributes ?| array['brand', 'price'];

-- ?& all keys exist
SELECT * FROM products WHERE attributes ?& array['brand', 'specs'];
```

**JSONB Indexing:**

```sql
-- GIN index for general queries
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);

-- Index specific path
CREATE INDEX idx_products_brand ON products ((attributes -> 'brand'));

-- Index for containment queries
CREATE INDEX idx_products_attributes_path ON products USING GIN (attributes jsonb_path_ops);
```

**Updating JSONB:**

```sql
-- Add/update key
UPDATE products
SET attributes = attributes || '{"color": "silver"}'::jsonb
WHERE id = 1;

-- Remove key
UPDATE products
SET attributes = attributes - 'color'
WHERE id = 1;

-- Update nested value
UPDATE products
SET attributes = jsonb_set(attributes, '{specs,ram}', '"32GB"')
WHERE id = 1;
```

---

### Q6: What are materialized views?

**Answer:**
Materialized views store query results physically, unlike regular views which are virtual.

**Creating Materialized View:**

```sql
CREATE MATERIALIZED VIEW sales_summary AS
SELECT
  DATE_TRUNC('month', order_date) as month,
  category,
  COUNT(*) as order_count,
  SUM(amount) as total_sales,
  AVG(amount) as avg_order_value
FROM orders
JOIN products ON orders.product_id = products.id
GROUP BY month, category;

-- Create index on materialized view
CREATE INDEX idx_sales_summary_month ON sales_summary(month);
```

**Using Materialized View:**

```sql
-- Query like a regular table
SELECT * FROM sales_summary WHERE month = '2024-01-01';
```

**Refreshing:**

```sql
-- Refresh (blocks concurrent access)
REFRESH MATERIALIZED VIEW sales_summary;

-- Concurrent refresh (allows queries during refresh)
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_summary;
```

**When to Use:**

✅ **Use Materialized Views:**

- Complex aggregations used frequently
- Reports and dashboards
- Data doesn't need to be real-time
- Expensive joins

❌ **Don't Use When:**

- Data must be real-time
- Source data changes frequently
- Simple queries
- Storage is limited

---

This covers advanced PostgreSQL concepts. Master these for senior-level interviews!
