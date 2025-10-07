# PostgreSQL Practical Interview Questions

## Table of Contents

- [Database Design](#database-design)
- [Query Optimization](#query-optimization)
- [Real-World Scenarios](#real-world-scenarios)
- [Debugging](#debugging)

---

## Database Design

### Q1: Design a database schema for a social media platform

**Answer:**

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Follows table (many-to-many self-reference)
CREATE TABLE follows (
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
```

**Common Queries:**

```sql
-- Get user's feed (posts from people they follow)
SELECT p.*, u.username, u.avatar_url
FROM posts p
INNER JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
  SELECT following_id
  FROM follows
  WHERE follower_id = $1
)
ORDER BY p.created_at DESC
LIMIT 50;

-- Get post with comments and likes
SELECT
  p.*,
  u.username as author,
  COUNT(DISTINCT l.id) as likes_count,
  COUNT(DISTINCT c.id) as comments_count
FROM posts p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.id = $1
GROUP BY p.id, u.username;

-- Get user's followers
SELECT u.id, u.username, u.avatar_url
FROM users u
INNER JOIN follows f ON u.id = f.follower_id
WHERE f.following_id = $1;
```

---

## Query Optimization

### Q2: Optimize this slow query

**Problem:**

```sql
-- Slow query (5 seconds)
SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01'
GROUP BY u.id, u.name
ORDER BY total_spent DESC;
```

**Solution:**

**Step 1: Add EXPLAIN ANALYZE**

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01'
GROUP BY u.id, u.name
ORDER BY total_spent DESC;

-- Look for:
-- - Seq Scan (bad)
-- - Hash Join vs Nested Loop
-- - Execution time
```

**Step 2: Create Indexes**

```sql
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX idx_orders_created ON orders(created_at);
```

**Step 3: Rewrite Query**

```sql
-- Use INNER JOIN if only users with orders are needed
SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 100;  -- Add limit if showing top users
```

**Step 4: Consider Materialized View**

```sql
-- For frequently accessed statistics
CREATE MATERIALIZED VIEW user_stats AS
SELECT
  u.id,
  u.name,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent,
  MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

CREATE INDEX idx_user_stats_total_spent ON user_stats(total_spent DESC);

-- Query is now instant
SELECT * FROM user_stats ORDER BY total_spent DESC LIMIT 100;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
```

---

## Real-World Scenarios

### Q3: Implement pagination efficiently

**Answer:**

**Offset-based Pagination (Simple but slow for large offsets):**

```sql
-- Page 1
SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 0;

-- Page 2
SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 20;

-- Page 100 (slow! scans 2000 rows)
SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 2000;
```

**Cursor-based Pagination (Better for large datasets):**

```sql
-- First page
SELECT * FROM posts
ORDER BY id
LIMIT 20;

-- Next page (using last id from previous page)
SELECT * FROM posts
WHERE id > $last_id  -- e.g., 20
ORDER BY id
LIMIT 20;

-- Previous page
SELECT * FROM posts
WHERE id < $first_id  -- e.g., 21
ORDER BY id DESC
LIMIT 20;
```

**Keyset Pagination (Best performance):**

```sql
-- First page
SELECT * FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Next page
SELECT * FROM posts
WHERE (created_at, id) < ($last_created_at, $last_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Need composite index
CREATE INDEX idx_posts_created_id ON posts(created_at DESC, id DESC);
```

**With Prisma:**

```javascript
// Cursor-based
const posts = await prisma.post.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastId },
  orderBy: { id: "asc" },
});
```

---

### Q4: Implement soft delete pattern

**Answer:**

```sql
-- Add deleted_at column
ALTER TABLE users
ADD COLUMN deleted_at TIMESTAMP;

-- Soft delete
UPDATE users
SET deleted_at = NOW()
WHERE id = $1;

-- Query only active users
SELECT * FROM users WHERE deleted_at IS NULL;

-- Create view for active users
CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;

-- Use view in queries
SELECT * FROM active_users WHERE email = 'test@example.com';

-- Permanently delete old soft-deleted records
DELETE FROM users
WHERE deleted_at < NOW() - INTERVAL '90 days';
```

**With Prisma:**

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  deletedAt DateTime? @map("deleted_at")

  @@map("users")
}
```

```javascript
// Soft delete
await prisma.user.update({
  where: { id: 1 },
  data: { deletedAt: new Date() },
});

// Query only active
const activeUsers = await prisma.user.findMany({
  where: { deletedAt: null },
});
```

---

## Debugging

### Q5: Debug a deadlock issue

**Answer:**

**Scenario:**

```sql
-- Transaction 1
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- (waiting for lock on id = 2)
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Transaction 2 (concurrent)
BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 2;
-- (waiting for lock on id = 1)
UPDATE accounts SET balance = balance + 50 WHERE id = 1;
COMMIT;

-- DEADLOCK!
```

**Solution 1: Consistent Lock Order**

```sql
-- Always lock accounts in ID order
BEGIN;
UPDATE accounts SET balance = balance - 100
WHERE id = LEAST($1, $2);

UPDATE accounts SET balance = balance + 100
WHERE id = GREATEST($1, $2);
COMMIT;
```

**Solution 2: Lock All Resources Upfront**

```sql
BEGIN;
-- Lock both accounts first
SELECT * FROM accounts
WHERE id IN ($1, $2)
ORDER BY id
FOR UPDATE;

-- Then perform updates
UPDATE accounts SET balance = balance - 100 WHERE id = $1;
UPDATE accounts SET balance = balance + 100 WHERE id = $2;
COMMIT;
```

**Solution 3: Use Advisory Locks**

```sql
BEGIN;
-- Acquire locks in order
SELECT pg_advisory_lock(LEAST($1, $2));
SELECT pg_advisory_lock(GREATEST($1, $2));

-- Perform operations
UPDATE accounts SET balance = balance - 100 WHERE id = $1;
UPDATE accounts SET balance = balance + 100 WHERE id = $2;

-- Locks released on COMMIT
COMMIT;
```

**Monitor Deadlocks:**

```sql
-- Enable deadlock logging (postgresql.conf)
deadlock_timeout = 1s
log_lock_waits = on

-- View current locks
SELECT * FROM pg_locks WHERE NOT granted;

-- View blocking queries
SELECT
  blocked_locks.pid AS blocked_pid,
  blocking_locks.pid AS blocking_pid,
  blocked_activity.query AS blocked_query,
  blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_locks blocking_locks
  ON blocking_locks.locktype = blocked_locks.locktype
WHERE NOT blocked_locks.granted
  AND blocking_locks.granted;
```

---

This covers practical PostgreSQL scenarios. Practice these patterns in real applications!
