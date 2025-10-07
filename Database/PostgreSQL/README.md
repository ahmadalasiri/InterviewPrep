# PostgreSQL - Complete Learning Guide

This repository contains a comprehensive guide to learning PostgreSQL with practical examples, Prisma ORM, and Drizzle ORM.

## Table of Contents

### 1. PostgreSQL Basics

- [Connection and Setup](01-basics/connection.js) - Connecting to PostgreSQL
- [Database Operations](01-basics/database-operations.sql) - Creating and managing databases
- [Table Operations](01-basics/table-operations.sql) - Creating and managing tables
- [Data Types](01-basics/data-types.sql) - PostgreSQL data types

### 2. SQL Queries

- [Basic Queries](02-queries/basic-queries.sql) - SELECT, WHERE, ORDER BY
- [Joins](02-queries/joins.sql) - INNER, LEFT, RIGHT, FULL joins
- [Aggregations](02-queries/aggregations.sql) - GROUP BY, HAVING, aggregate functions
- [Subqueries](02-queries/subqueries.sql) - Nested queries and CTEs
- [Advanced Queries](02-queries/advanced-queries.sql) - Window functions, complex queries

### 3. Prisma ORM

- [Prisma Setup](03-prisma/setup.js) - Installation and configuration
- [Schema Definition](03-prisma/schema.prisma) - Defining models
- [CRUD Operations](03-prisma/crud.js) - Create, Read, Update, Delete
- [Relations](03-prisma/relations.js) - One-to-one, one-to-many, many-to-many
- [Advanced Queries](03-prisma/advanced.js) - Complex queries with Prisma
- [Migrations](03-prisma/migrations.md) - Database migrations

### 4. Drizzle ORM

- [Drizzle Setup](04-drizzle/setup.js) - Installation and configuration
- [Schema Definition](04-drizzle/schema.js) - Defining tables
- [CRUD Operations](04-drizzle/crud.js) - Database operations
- [Queries](04-drizzle/queries.js) - Query building
- [Migrations](04-drizzle/migrations.js) - Database migrations

## Getting Started

### Installation

**PostgreSQL:**

```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows - Download from postgresql.org
```

**Using Docker:**

```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### Node.js Setup

```bash
# PostgreSQL driver
npm install pg

# Prisma ORM
npm install prisma @prisma/client
npx prisma init

# Drizzle ORM
npm install drizzle-orm pg
npm install -D drizzle-kit
```

### Basic Connection

**Using pg (node-postgres):**

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "mydb",
});

const result = await pool.query("SELECT NOW()");
console.log(result.rows[0]);
```

**Using Prisma:**

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const users = await prisma.user.findMany();
```

**Using Drizzle:**

```javascript
const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const users = await db.select().from(usersTable);
```

## Key PostgreSQL Concepts

### What is PostgreSQL?

- **Relational Database**: ACID-compliant RDBMS
- **Open Source**: Free and open-source
- **Advanced Features**: JSON support, full-text search, geospatial data
- **Extensible**: Custom types, functions, and extensions
- **ACID Compliance**: Atomicity, Consistency, Isolation, Durability

### PostgreSQL Features

**Advanced Data Types:**

- JSON and JSONB
- Arrays
- UUID
- Geometric types
- Network address types
- Full-text search types

**Advanced Features:**

- Window functions
- Common Table Expressions (CTEs)
- Recursive queries
- Full-text search
- Triggers and stored procedures
- Partitioning
- Replication

**Performance:**

- Indexing (B-tree, Hash, GiST, GIN, BRIN)
- Query optimization
- Parallel queries
- Materialized views

## ORMs Comparison

### Prisma

**Pros:**

- Type-safe database client
- Auto-generated TypeScript types
- Intuitive API
- Built-in migrations
- Database introspection
- Prisma Studio (GUI)

**Cons:**

- Query overhead
- Limited raw SQL support
- Bundle size
- Learning curve for complex queries

**Best For:**

- TypeScript projects
- Rapid development
- Type safety requirements
- Teams needing good DX

### Drizzle

**Pros:**

- Lightweight (minimal overhead)
- SQL-like syntax
- Full TypeScript support
- Edge-ready (Cloudflare Workers, etc.)
- Raw SQL access
- Zero dependencies

**Cons:**

- Smaller community
- Less tooling
- Manual type definitions
- Newer (less mature)

**Best For:**

- Performance-critical applications
- Serverless/Edge environments
- Developers who prefer SQL-like syntax
- Small bundle size requirements

### Raw pg (node-postgres)

**Pros:**

- Minimal overhead
- Full SQL control
- Lightweight
- Well-established

**Cons:**

- No type safety
- Manual query building
- No schema management
- More boilerplate

**Best For:**

- Simple applications
- Maximum performance
- Full SQL control
- Minimal dependencies

## Best Practices

### Database Design

1. **Normalization**: Reduce data redundancy
2. **Primary Keys**: Every table should have one
3. **Foreign Keys**: Maintain referential integrity
4. **Indexes**: Create on frequently queried columns
5. **Constraints**: Use NOT NULL, CHECK, UNIQUE appropriately

### Query Optimization

1. **Use Indexes Wisely**

   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
   ```

2. **Analyze Queries**

   ```sql
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
   ```

3. **Use Appropriate JOINs**

   ```sql
   -- Prefer specific columns over *
   SELECT u.name, p.title
   FROM users u
   INNER JOIN posts p ON u.id = p.user_id;
   ```

4. **Avoid N+1 Queries**

   ```javascript
   // Bad: N+1 queries
   const users = await prisma.user.findMany();
   for (const user of users) {
     const posts = await prisma.post.findMany({ where: { userId: user.id } });
   }

   // Good: Single query with include
   const users = await prisma.user.findMany({
     include: { posts: true },
   });
   ```

### Connection Management

```javascript
// Use connection pooling
const pool = new Pool({
  max: 20, // Maximum connections
  min: 5, // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Always close connections
process.on("SIGTERM", async () => {
  await pool.end();
  await prisma.$disconnect();
});
```

### Transactions

```javascript
// Prisma transactions
await prisma.$transaction(async (tx) => {
  await tx.user.create({ data: { email: "test@example.com" } });
  await tx.profile.create({ data: { userId: user.id } });
});

// pg transactions
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("INSERT INTO users(email) VALUES($1)", [
    "test@example.com",
  ]);
  await client.query("INSERT INTO profiles(user_id) VALUES($1)", [userId]);
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();
}
```

## Common Patterns

### Pagination

```javascript
// Offset-based pagination
const page = 1;
const pageSize = 20;
const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

// Cursor-based pagination (better for large datasets)
const users = await prisma.user.findMany({
  take: 20,
  skip: 1, // Skip the cursor
  cursor: { id: lastUserId },
});
```

### Soft Delete

```sql
-- Add deleted_at column
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- Query only active records
SELECT * FROM users WHERE deleted_at IS NULL;
```

### Audit Trail

```sql
-- Add audit columns
ALTER TABLE users
ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN created_by INTEGER REFERENCES users(id),
ADD COLUMN updated_by INTEGER REFERENCES users(id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Security Best Practices

1. **Use Parameterized Queries**

   ```javascript
   // Bad: SQL injection risk
   const result = await pool.query(
     `SELECT * FROM users WHERE email = '${email}'`
   );

   // Good: Parameterized query
   const result = await pool.query("SELECT * FROM users WHERE email = $1", [
     email,
   ]);
   ```

2. **Least Privilege Principle**

   ```sql
   -- Create user with limited permissions
   CREATE USER app_user WITH PASSWORD 'secure_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO app_user;
   ```

3. **Use SSL/TLS**

   ```javascript
   const pool = new Pool({
     ssl: {
       rejectUnauthorized: true,
       ca: fs.readFileSync("/path/to/ca-certificate.crt").toString(),
     },
   });
   ```

4. **Encrypt Sensitive Data**
   ```javascript
   const bcrypt = require("bcrypt");
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

## Performance Tips

1. **Index frequently queried columns**
2. **Use EXPLAIN ANALYZE to understand query plans**
3. **Implement connection pooling**
4. **Use prepared statements**
5. **Vacuum and analyze regularly**
6. **Monitor slow query logs**
7. **Use appropriate data types**
8. **Partition large tables**

## Resources

- [Official PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Drizzle Documentation](https://orm.drizzle.team/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

Happy coding with PostgreSQL! 🐘
