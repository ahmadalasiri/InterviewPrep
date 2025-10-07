# Database Design Questions

## Database Selection & Design

### 1. SQL vs NoSQL: When to use each?

**Answer:**

**SQL (Relational Databases)**

**Characteristics:**

- Structured schema (tables, rows, columns)
- ACID compliance
- Strong consistency
- Relationships via foreign keys
- SQL query language
- Vertical scaling primarily

**Examples:** PostgreSQL, MySQL, Oracle, SQL Server

**Use Cases:**

- **E-commerce**: Orders, inventory, payments (need ACID)
- **Banking**: Transactions, accounts (need strong consistency)
- **CRM**: Customer relationships, structured data
- **ERP**: Business processes, complex joins
- **Analytics**: Complex queries, reporting

**When to Use:**

- ✅ Structured data with clear schema
- ✅ Complex queries with JOINs
- ✅ Transactions required (ACID)
- ✅ Strong consistency needed
- ✅ Relationships between entities
- ✅ Data integrity critical

**NoSQL (Non-Relational Databases)**

**Types:**

**1. Document Databases (MongoDB, CouchDB)**

```json
{
  "id": "123",
  "name": "John",
  "address": {
    "street": "Main St",
    "city": "NYC"
  },
  "tags": ["vip", "premium"]
}
```

- **Use**: Flexible schema, nested data
- **Example**: Content management, user profiles

**2. Key-Value Stores (Redis, DynamoDB)**

```
user:123 -> {name: "John", email: "john@example.com"}
session:abc -> {userId: 123, expires: 1234567890}
```

- **Use**: Caching, session storage, simple lookups
- **Example**: Session management, shopping cart

**3. Wide-Column Stores (Cassandra, HBase)**

```
Row Key: user123
  name:first -> "John"
  name:last -> "Doe"
  contact:email -> "john@example.com"
  contact:phone -> "555-1234"
```

- **Use**: Time-series data, large amounts of data
- **Example**: IoT data, analytics, logs

**4. Graph Databases (Neo4j, Neptune)**

```
(Person:John)-[:FRIENDS_WITH]->(Person:Jane)
(Person:John)-[:WORKS_AT]->(Company:Acme)
```

- **Use**: Relationship-heavy data
- **Example**: Social networks, recommendation engines

**When to Use NoSQL:**

- ✅ Flexible/evolving schema
- ✅ Massive scale (horizontal scaling)
- ✅ High write throughput
- ✅ Eventual consistency acceptable
- ✅ Denormalized data
- ✅ Simple queries (key-based lookup)

**Comparison:**

| Feature        | SQL                  | NoSQL                     |
| -------------- | -------------------- | ------------------------- |
| Schema         | Fixed                | Flexible                  |
| Scaling        | Vertical (primarily) | Horizontal                |
| Consistency    | Strong (ACID)        | Eventual (BASE)           |
| Transactions   | Multi-row            | Limited                   |
| Query          | Complex (JOINs)      | Simple (key-based)        |
| Data Structure | Tables               | Documents/Key-Value/Graph |
| Use Case       | Complex queries      | High throughput           |

### 2. How do you design a database schema?

**Answer:**

**Step-by-Step Process:**

**1. Gather Requirements**

- What entities exist?
- What operations are needed?
- What relationships exist?
- What are the access patterns?
- What is the expected scale?

**2. Identify Entities**

```
E-commerce example:
- Users
- Products
- Orders
- Payments
- Reviews
```

**3. Define Relationships**

```
User --1:M--> Orders (one user, many orders)
Order --M:M--> Products (many-to-many via order_items)
Product --1:M--> Reviews (one product, many reviews)
Order --1:1--> Payment (one order, one payment)
```

**4. Normalization (SQL)**

**1NF (First Normal Form):**

- Atomic values (no arrays)
- Each row unique

```sql
-- Bad
CREATE TABLE orders (
    id INT,
    product_ids TEXT -- "1,2,3" ❌
);

-- Good
CREATE TABLE order_items (
    order_id INT,
    product_id INT
);
```

**2NF (Second Normal Form):**

- 1NF + No partial dependencies
- Non-key attributes depend on entire primary key

**3NF (Third Normal Form):**

- 2NF + No transitive dependencies
- Non-key attributes depend only on primary key

**Example Schema:**

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_email (email)
);

-- Products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_category (category_id),
    INDEX idx_price (price)
);

-- Orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Order items (many-to-many relationship)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_id (order_id)
);
```

**5. Denormalization (for Performance)**

Sometimes break normalization rules for performance:

```sql
-- Add commonly accessed data
ALTER TABLE orders
ADD COLUMN user_email VARCHAR(255);  -- Denormalized from users

-- Computed columns
ALTER TABLE products
ADD COLUMN average_rating DECIMAL(3,2);  -- Computed from reviews

-- Add redundant counts
ALTER TABLE users
ADD COLUMN order_count INT DEFAULT 0;  -- Cached count
```

**When to Denormalize:**

- Frequent JOINs causing performance issues
- Read-heavy workloads
- Data rarely changes
- Complex aggregations

### 3. Explain database sharding strategies

**Answer:**

Database sharding horizontally partitions data across multiple databases.

**Sharding Strategies:**

**1. Range-Based Sharding**

```
Shard 1: User IDs 1-1000000
Shard 2: User IDs 1000001-2000000
Shard 3: User IDs 2000001-3000000
```

**Pros:**

- Simple to implement
- Easy to add new ranges
- Range queries easy

**Cons:**

- Uneven distribution (hotspots)
- Some shards busier than others

**Example:**

```go
func GetShard(userID int) int {
    if userID <= 1000000 {
        return 1
    } else if userID <= 2000000 {
        return 2
    }
    return 3
}
```

**2. Hash-Based Sharding**

```
Shard = hash(user_id) % number_of_shards
```

**Pros:**

- Even distribution
- No hotspots
- Predictable

**Cons:**

- Adding shards requires resharding
- Range queries difficult
- Related data might split

**Example:**

```go
func GetShard(userID string) int {
    hash := hashFunction(userID)
    return hash % numberOfShards
}
```

**3. Consistent Hashing**

```
Hash ring:
  Shard 1 at position 0
  Shard 2 at position 85
  Shard 3 at position 170

User hashed to position 100 -> goes to Shard 2
```

**Pros:**

- Adding/removing shards affects fewer keys
- Better than simple hash

**Cons:**

- More complex implementation
- Need virtual nodes for balance

**4. Geographic Sharding**

```
Shard 1: US users
Shard 2: EU users
Shard 3: Asia users
```

**Pros:**

- Low latency for users
- Compliance (data locality)

**Cons:**

- Uneven load
- Cross-region queries expensive

**5. Entity-Based Sharding**

```
Shard 1: User data
Shard 2: Product data
Shard 3: Order data
```

**Pros:**

- Natural boundaries
- Services can own shards

**Cons:**

- JOINs across shards difficult
- Uneven growth

**Challenges:**

**1. Cross-Shard Queries**

```sql
-- Can't do this across shards:
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'pending'
```

**Solutions:**

- Denormalize data
- Application-level joins
- Scatter-gather queries
- Keep related data on same shard

**2. Distributed Transactions**

```
Transfer money from User A (Shard 1) to User B (Shard 2)
```

**Solutions:**

- Two-phase commit (slow)
- Saga pattern
- Eventual consistency

**3. Rebalancing**

When adding new shards:

```
Before: 3 shards
After: 4 shards
Need to: Move ~25% of data
```

**Solutions:**

- Consistent hashing
- Virtual shards
- Planned downtime
- Double-write then migrate

**Implementation Example:**

```go
type ShardManager struct {
    shards map[int]*sql.DB
}

func (sm *ShardManager) GetUserShard(userID int) *sql.DB {
    shardID := userID % len(sm.shards)
    return sm.shards[shardID]
}

func (sm *ShardManager) GetUser(userID int) (*User, error) {
    shard := sm.GetUserShard(userID)
    return shard.QueryUser(userID)
}

func (sm *ShardManager) GetUsersByCountry(country string) ([]*User, error) {
    // Scatter-gather: Query all shards
    results := make([]*User, 0)
    for _, shard := range sm.shards {
        users, _ := shard.QueryUsersByCountry(country)
        results = append(results, users...)
    }
    return results, nil
}
```

### 4. How do you ensure data consistency in distributed databases?

**Answer:**

**Consistency Models:**

**1. Strong Consistency**

- All reads see most recent write
- ACID transactions
- Higher latency, lower availability

**Example: Banking**

```
Account balance: $100
Write: -$50
All subsequent reads must show: $50
```

**Implementation:**

- Two-phase commit (2PC)
- Raft/Paxos consensus
- Synchronous replication

**2. Eventual Consistency**

- Reads may see stale data temporarily
- All replicas eventually converge
- Higher availability, lower latency

**Example: Social Media Likes**

```
Post likes: 100
User likes post
Some users see 100, others see 101
Eventually all see 101
```

**Implementation:**

- Asynchronous replication
- Last-Write-Wins (LWW)
- CRDTs

**3. Causal Consistency**

- Related operations seen in order
- Unrelated operations may vary

**Example: Comments**

```
User A: "What's your favorite color?"
User B: "Blue"
Everyone sees question before answer
```

**Strategies:**

**1. Two-Phase Commit (2PC)**

```
Coordinator: "Prepare to commit"
Participant 1: "Ready"
Participant 2: "Ready"
Coordinator: "Commit"
Participant 1: "Done"
Participant 2: "Done"
```

**Pros:**

- Strong consistency
- ACID guarantees

**Cons:**

- Slow (multiple round trips)
- Blocking (coordinator fails = stuck)
- Not partition tolerant

**2. Saga Pattern**

```
Long transaction split into local transactions
Each with compensating transaction

Example: Order Processing
1. Reserve inventory (compensate: release inventory)
2. Charge payment (compensate: refund)
3. Ship order (compensate: cancel shipment)
```

**Implementation:**

```typescript
class OrderSaga {
  async execute(order: Order) {
    try {
      // Step 1: Reserve inventory
      await inventoryService.reserve(order.items);

      // Step 2: Charge payment
      await paymentService.charge(order.total);

      // Step 3: Create shipment
      await shippingService.createShipment(order);

      return { success: true };
    } catch (error) {
      // Compensate in reverse order
      await shippingService.cancelShipment(order);
      await paymentService.refund(order.total);
      await inventoryService.release(order.items);

      return { success: false, error };
    }
  }
}
```

**3. Event Sourcing**

```
Store all state changes as events
Current state = replay all events

Events:
1. AccountCreated { balance: 0 }
2. MoneyDeposited { amount: 100 }
3. MoneyWithdrawn { amount: 30 }

Current State: balance = 70
```

**Pros:**

- Complete audit trail
- Can rebuild state
- Time travel

**Cons:**

- Event storage grows
- Complexity
- Eventual consistency

**4. CRDTs (Conflict-Free Replicated Data Types)**

```typescript
// G-Counter (Grow-only Counter)
// Each replica maintains its own counter
// Final value = sum of all counters

class GCounter {
  private counters: Map<string, number> = new Map();

  increment(replicaId: string) {
    const current = this.counters.get(replicaId) || 0;
    this.counters.set(replicaId, current + 1);
  }

  value(): number {
    return Array.from(this.counters.values()).reduce(
      (sum, val) => sum + val,
      0
    );
  }

  merge(other: GCounter) {
    for (const [id, count] of other.counters) {
      const current = this.counters.get(id) || 0;
      this.counters.set(id, Math.max(current, count));
    }
  }
}
```

**5. Quorum Reads/Writes**

```
N = number of replicas
W = write quorum
R = read quorum

If W + R > N, guaranteed consistency

Example: N=5, W=3, R=3
Write to 3 replicas
Read from 3 replicas (at least 1 overlap)
```

### 5. Explain database indexing and when to use it

**Answer:**

**What is an Index?**
A data structure that improves query speed at the cost of additional storage and slower writes.

**Types of Indexes:**

**1. B-Tree Index (Default)**

```sql
CREATE INDEX idx_users_email ON users(email);
```

**Structure:**

```
        [M]
       /   \
    [D,H]  [Q,T]
   / | \    / | \
```

**Use Cases:**

- Equality: `WHERE email = 'user@example.com'`
- Range: `WHERE age BETWEEN 18 AND 65`
- Sorting: `ORDER BY created_at`
- Prefix: `WHERE name LIKE 'John%'`

**2. Hash Index**

```sql
CREATE INDEX idx_users_id USING HASH ON users(id);
```

**Use Cases:**

- Exact matches only: `WHERE id = 123`
- Very fast lookups
- No range queries

**3. Full-Text Index**

```sql
CREATE FULLTEXT INDEX idx_posts_content ON posts(content);
SELECT * FROM posts WHERE MATCH(content) AGAINST('database');
```

**Use Cases:**

- Text search
- Keyword matching
- Natural language queries

**4. Composite Index**

```sql
CREATE INDEX idx_users_country_city ON users(country, city);
```

**Can use for:**

- `WHERE country = 'US' AND city = 'NYC'` ✅
- `WHERE country = 'US'` ✅ (leftmost prefix)
- `WHERE city = 'NYC'` ❌ (can't skip country)

**5. Covering Index**

```sql
-- Query needs: id, name, email
CREATE INDEX idx_covering ON users(email, name, id);

-- Index contains all needed columns
SELECT id, name FROM users WHERE email = 'user@example.com';
-- No need to access table!
```

**When to Create Indexes:**

**✅ Good Candidates:**

- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Columns in GROUP BY
- Foreign keys
- High cardinality columns (many unique values)

**❌ Bad Candidates:**

- Small tables (< 1000 rows)
- Columns with low cardinality (gender, boolean)
- Columns frequently updated
- Wide columns (large text fields)

**Index Performance:**

**Without Index:**

```sql
SELECT * FROM users WHERE email = 'user@example.com';
-- Full table scan: O(n) - scans all rows
-- 1M rows = 1M comparisons
```

**With Index:**

```sql
-- B-tree lookup: O(log n)
-- 1M rows = ~20 comparisons
```

**Trade-offs:**

**Pros:**

- Faster SELECT queries
- Faster JOIN operations
- Can enforce uniqueness

**Cons:**

- Slower INSERT/UPDATE/DELETE
- Additional storage space
- Index maintenance overhead

**Example: Index Analysis**

```sql
-- Slow query
SELECT * FROM orders
WHERE customer_id = 123
  AND status = 'pending'
  AND created_at > '2024-01-01'
ORDER BY created_at DESC;

-- Add index
CREATE INDEX idx_orders_customer_status_created
ON orders(customer_id, status, created_at);

-- Query now uses index
-- Speed: 2000ms -> 5ms
```

**Monitoring Indexes:**

```sql
-- PostgreSQL: Find unused indexes
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- MySQL: Check index usage
SHOW INDEX FROM users;
```

### 6. How do you handle database migrations in production?

**Answer:**

**Migration Strategies:**

**1. Backward Compatible Migrations**

```sql
-- Phase 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Phase 2: Deploy code that writes to both old and new
-- Code handles both NULL and non-NULL phone

-- Phase 3: Backfill data
UPDATE users SET phone = mobile WHERE phone IS NULL;

-- Phase 4: Make column NOT NULL
ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) NOT NULL;
```

**2. Expand-Contract Pattern**

**Expand:** Add new structure alongside old

```sql
ALTER TABLE users ADD COLUMN email_v2 VARCHAR(255);
```

**Parallel Writing:** Write to both

```go
user.Email = "new@example.com"
user.EmailV2 = "new@example.com"
db.Save(user)
```

**Migrate:** Copy old to new

```sql
UPDATE users SET email_v2 = email WHERE email_v2 IS NULL;
```

**Contract:** Remove old structure

```sql
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN email_v2 TO email;
```

**3. Blue-Green Deployment**

```
Blue (Current): App v1 -> DB v1
Green (New): App v2 -> DB v2

Steps:
1. Deploy Green with DB v2
2. Sync data Blue -> Green
3. Switch traffic to Green
4. Keep Blue for rollback
```

**4. Zero-Downtime Migrations**

**Adding Column:**

```sql
-- Step 1: Add column (fast, no lock)
ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT FALSE;

-- Step 2: Deploy code using new column

-- Step 3: Backfill (in batches to avoid locks)
UPDATE users SET verified = TRUE
WHERE email_confirmed_at IS NOT NULL
LIMIT 1000;
```

**Renaming Column:**

```sql
-- Bad: Causes downtime
ALTER TABLE users RENAME COLUMN name TO full_name;

-- Good: Multi-step process
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

-- Step 2: Deploy code writing to both
-- Step 3: Backfill
UPDATE users SET full_name = name;

-- Step 4: Deploy code reading from new column
-- Step 5: Drop old column
ALTER TABLE users DROP COLUMN name;
```

**Best Practices:**

**1. Always Backup**

```bash
# Before migration
pg_dump -U postgres mydb > backup.sql

# Or point-in-time recovery
```

**2. Test Migrations**

```bash
# Test on staging with production data copy
# Measure execution time
# Check for locks
```

**3. Use Transaction when Possible**

```sql
BEGIN;
ALTER TABLE users ADD COLUMN verified BOOLEAN;
-- If error, auto-rollback
COMMIT;
```

**4. Batch Large Updates**

```sql
-- Bad: Locks table for long time
UPDATE users SET verified = TRUE WHERE email_confirmed_at IS NOT NULL;

-- Good: Process in batches
DECLARE @BatchSize INT = 1000;
WHILE (1=1)
BEGIN
    UPDATE TOP (@BatchSize) users
    SET verified = TRUE
    WHERE email_confirmed_at IS NOT NULL AND verified = FALSE;

    IF @@ROWCOUNT = 0 BREAK;
    WAITFOR DELAY '00:00:01'; -- Pause between batches
END
```

**5. Monitor During Migration**

```
- Lock monitors
- Query performance
- Error logs
- Application metrics
```

**6. Have Rollback Plan**

```sql
-- Migration: Add column
ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT FALSE;

-- Rollback: Drop column
ALTER TABLE users DROP COLUMN verified;
```

**Migration Tools:**

- **Flyway** (Java)
- **Liquibase** (Java, XML/SQL)
- **migrate** (Go)
- **Alembic** (Python)
- **TypeORM** (TypeScript)
- **Prisma** (TypeScript)

**Example with Flyway:**

```sql
-- V1__create_users_table.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- V2__add_verified_column.sql
ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT FALSE;

-- V3__backfill_verified.sql
UPDATE users SET verified = TRUE WHERE email_confirmed_at IS NOT NULL;
```

---

## Quick Reference

### Database Selection Guide

| Requirement           | Database Choice       |
| --------------------- | --------------------- |
| ACID transactions     | PostgreSQL, MySQL     |
| Flexible schema       | MongoDB               |
| High write throughput | Cassandra             |
| Caching               | Redis                 |
| Graph relationships   | Neo4j                 |
| Time-series data      | InfluxDB, TimescaleDB |
| Full-text search      | Elasticsearch         |
| Analytics             | ClickHouse, BigQuery  |

### Indexing Strategy

```sql
-- Primary key: Automatic index
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,  -- Indexed automatically
    email VARCHAR(255) UNIQUE,  -- Indexed automatically
    name VARCHAR(255),
    country VARCHAR(50),
    city VARCHAR(50),
    created_at TIMESTAMP
);

-- Add indexes for common queries
CREATE INDEX idx_users_country_city ON users(country, city);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_name ON users(name); -- If searching by name
```

### Sharding Decision Tree

```
Need to scale writes?
├─ No → Use read replicas
└─ Yes → Consider sharding
    ├─ Related data must be together? → Use shard key wisely
    ├─ Need cross-shard queries? → Denormalize or use separate service
    └─ Even distribution critical? → Use hash-based sharding
```

---

**Master these database concepts to design scalable and reliable data systems!**
