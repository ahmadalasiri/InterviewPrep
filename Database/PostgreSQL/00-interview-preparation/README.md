# PostgreSQL Interview Preparation Guide

This folder contains the most common PostgreSQL interview questions organized by difficulty and topic. Use this resource to prepare for database and backend developer interviews.

## 📋 Table of Contents

### 1. [Basic PostgreSQL Questions](01-basic-questions.md)

- PostgreSQL fundamentals
- SQL basics (SELECT, INSERT, UPDATE, DELETE)
- Data types and constraints
- Basic joins and queries

### 2. [Advanced PostgreSQL Questions](02-advanced-questions.md)

- Complex queries and joins
- Indexes and performance optimization
- Transactions and ACID properties
- Window functions and CTEs
- Triggers and stored procedures

### 3. [Prisma Questions](03-prisma-questions.md)

- Prisma schema and models
- CRUD operations with Prisma
- Relations and includes
- Migrations and database management
- Advanced Prisma features

### 4. [Drizzle Questions](04-drizzle-questions.md)

- Drizzle ORM basics
- Schema definition
- Query building
- Migrations
- Performance considerations

### 5. [Practical Questions](05-practical-questions.md)

- Real-world scenarios
- Database design problems
- Query optimization challenges
- System design with PostgreSQL
- Debugging and troubleshooting

## 🎯 Interview Preparation Strategy

### Before the Interview

1. **Review SQL Fundamentals** - Master SELECT, JOIN, GROUP BY
2. **Understand ACID** - Transactions, isolation levels
3. **Practice Queries** - Write complex queries daily
4. **Learn Indexing** - When and how to create indexes
5. **Know Your ORM** - If using Prisma/Drizzle, know it well
6. **Prepare Examples** - Have real projects to discuss

### During the Interview

1. **Clarify Requirements** - Understand the data model
2. **Think About Normalization** - Proper database design
3. **Consider Performance** - Indexes, query optimization
4. **Explain Your Approach** - Think out loud
5. **Write Clean SQL** - Use proper formatting and aliases
6. **Discuss Trade-offs** - Performance vs. simplicity

### Common Interview Formats

- **Technical Questions** - SQL and PostgreSQL concepts
- **Query Writing** - Write SQL queries to solve problems
- **Schema Design** - Design database schema for use cases
- **Query Optimization** - Optimize slow queries
- **System Design** - Design scalable database architecture

## 📚 Key Topics to Master

### Essential SQL Concepts

- [ ] SELECT, WHERE, ORDER BY, LIMIT
- [ ] INSERT, UPDATE, DELETE
- [ ] JOINs (INNER, LEFT, RIGHT, FULL, CROSS)
- [ ] GROUP BY, HAVING
- [ ] Aggregate functions (COUNT, SUM, AVG, MAX, MIN)
- [ ] Subqueries
- [ ] DISTINCT, UNION, INTERSECT, EXCEPT

### PostgreSQL-Specific Features

- [ ] Data types (SERIAL, UUID, JSONB, ARRAY)
- [ ] Indexes (B-tree, Hash, GiST, GIN, BRIN)
- [ ] Constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)
- [ ] Views and materialized views
- [ ] Triggers and functions
- [ ] Full-text search
- [ ] Extensions (PostGIS, pg_trgm, etc.)

### Advanced Topics

- [ ] Window functions (ROW_NUMBER, RANK, DENSE_RANK)
- [ ] Common Table Expressions (CTEs)
- [ ] Recursive CTEs
- [ ] LATERAL joins
- [ ] EXPLAIN and query plans
- [ ] Partitioning
- [ ] Replication

### Transactions & Concurrency

- [ ] ACID properties
- [ ] Isolation levels
- [ ] MVCC (Multi-Version Concurrency Control)
- [ ] Deadlocks
- [ ] Transaction commands (BEGIN, COMMIT, ROLLBACK)

### Performance Optimization

- [ ] Query optimization with EXPLAIN ANALYZE
- [ ] Index selection and creation
- [ ] Query rewriting
- [ ] Connection pooling
- [ ] Caching strategies
- [ ] Vacuuming and maintenance

### Prisma ORM

- [ ] Schema definition
- [ ] CRUD operations
- [ ] Relations (one-to-one, one-to-many, many-to-many)
- [ ] Nested writes
- [ ] Transactions
- [ ] Migrations
- [ ] Raw queries

### Drizzle ORM

- [ ] Schema definition with drizzle-orm
- [ ] Query builder
- [ ] Type safety
- [ ] Migrations with drizzle-kit
- [ ] Relations
- [ ] Performance considerations

## 🚀 Quick Reference

### PostgreSQL Commands

```bash
# Connect to database
psql -U username -d database

# Common psql commands
\l                  # List databases
\c database_name    # Connect to database
\dt                 # List tables
\d table_name       # Describe table
\du                 # List users
\q                  # Quit
```

### Common SQL Patterns

```sql
-- Basic SELECT
SELECT name, email FROM users WHERE age >= 18;

-- JOIN
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- GROUP BY
SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING COUNT(*) > 10;

-- Subquery
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total > 1000);

-- CTE
WITH active_users AS (
  SELECT * FROM users WHERE status = 'active'
)
SELECT * FROM active_users WHERE created_at > NOW() - INTERVAL '30 days';

-- Window Function
SELECT name, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;
```

### Prisma Examples

```javascript
// Find many with where
const users = await prisma.user.findMany({
  where: { age: { gte: 18 } },
  include: { posts: true },
});

// Create with nested relations
const user = await prisma.user.create({
  data: {
    email: "test@example.com",
    posts: {
      create: [{ title: "Post 1" }, { title: "Post 2" }],
    },
  },
});

// Transaction
await prisma.$transaction([
  prisma.user.create({ data: { email: "user1@example.com" } }),
  prisma.post.create({ data: { title: "Post 1", userId: 1 } }),
]);
```

### Drizzle Examples

```javascript
// Select with where
const users = await db.select().from(usersTable).where(gte(usersTable.age, 18));

// Insert
await db.insert(usersTable).values({ email: "test@example.com", name: "John" });

// Update
await db.update(usersTable).set({ name: "Jane" }).where(eq(usersTable.id, 1));
```

## 📖 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Drizzle Documentation](https://orm.drizzle.team/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [SQL Style Guide](https://www.sqlstyle.guide/)

## 💡 Pro Tips

1. **Practice Daily** - Write at least one SQL query per day
2. **Use EXPLAIN** - Understand query execution plans
3. **Read Documentation** - Official docs are the best resource
4. **Study Real Schemas** - Look at production database designs
5. **Understand Trade-offs** - Know when to denormalize
6. **Build Projects** - Create applications using PostgreSQL
7. **Learn psql** - Master the command-line tool
8. **Know Your ORM** - But also understand the SQL it generates

## Common Interview Mistakes to Avoid

1. ❌ Not understanding the difference between WHERE and HAVING
2. ❌ Forgetting to add indexes on foreign keys
3. ❌ Using SELECT \* in production code
4. ❌ Not understanding N+1 query problems
5. ❌ Ignoring NULL handling in queries
6. ❌ Not considering transaction isolation levels
7. ❌ Overusing JOINs when subqueries would be better
8. ❌ Not validating SQL injection prevention

## Sample Interview Questions Preview

**Question:** "Write a query to find the top 5 customers by total order amount"

**Good Answer:**

```sql
SELECT
  c.id,
  c.name,
  SUM(o.total) as total_spent,
  COUNT(o.id) as order_count
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 5;
```

**Question:** "How would you optimize a slow query?"

**Good Answer:**

1. Use EXPLAIN ANALYZE to understand the query plan
2. Check if indexes are being used
3. Create appropriate indexes on WHERE/JOIN columns
4. Consider query rewriting (e.g., JOIN vs subquery)
5. Look at table statistics (ANALYZE command)
6. Check for sequential scans on large tables

---

**Good luck with your PostgreSQL interview! 🍀**

Remember: Understanding both SQL fundamentals and your chosen ORM is key to success!
