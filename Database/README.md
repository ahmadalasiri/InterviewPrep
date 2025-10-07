# Database - Complete Learning Guide

This repository contains a comprehensive guide to learning databases with practical examples for both NoSQL (MongoDB) and SQL (PostgreSQL) databases.

## Table of Contents

### MongoDB (NoSQL Database)

A document-oriented NoSQL database that stores data in flexible, JSON-like documents.

- [MongoDB Complete Guide](MongoDB/README.md)
- [MongoDB Interview Preparation](MongoDB/00-interview-preparation/README.md)

**Key Topics:**

- MongoDB basics and CRUD operations
- Aggregation framework
- Indexing and performance
- Mongoose ODM for Node.js
- Schema design and best practices

### PostgreSQL (SQL Database)

A powerful, open-source relational database management system.

- [PostgreSQL Complete Guide](PostgreSQL/README.md)
- [PostgreSQL Interview Preparation](PostgreSQL/00-interview-preparation/README.md)

**Key Topics:**

- PostgreSQL fundamentals
- Advanced SQL queries
- Prisma ORM
- Drizzle ORM
- Database design and optimization

## Getting Started

### MongoDB Setup

```bash
# Install MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod

# Connect to MongoDB shell
mongosh
```

### PostgreSQL Setup

```bash
# Install PostgreSQL
# Visit: https://www.postgresql.org/download/

# Start PostgreSQL service
pg_ctl start

# Connect to PostgreSQL
psql -U postgres
```

## Database Comparison

### When to Use MongoDB?

- **Flexible Schema**: Data structure changes frequently
- **Rapid Development**: Need to iterate quickly
- **Hierarchical Data**: Document-oriented data
- **Horizontal Scaling**: Need to scale across multiple servers
- **Real-time Analytics**: High write loads

**Use Cases:**

- Content management systems
- Real-time analytics
- IoT applications
- Mobile applications
- Catalogs and profiles

### When to Use PostgreSQL?

- **ACID Compliance**: Need strong data consistency
- **Complex Queries**: Joins, aggregations, transactions
- **Data Integrity**: Referential integrity is critical
- **Structured Data**: Well-defined schema
- **Reporting**: Complex analytical queries

**Use Cases:**

- Financial applications
- E-commerce systems
- ERP systems
- Data warehousing
- Traditional web applications

## Key Database Concepts

### NoSQL (MongoDB)

**Advantages:**

- Flexible schema design
- Horizontal scalability
- High performance for simple queries
- Easy to get started
- JSON-like document structure

**Disadvantages:**

- Limited transaction support (improved in recent versions)
- No JOIN operations (need to denormalize)
- Eventual consistency in distributed setups
- Memory intensive

### SQL (PostgreSQL)

**Advantages:**

- ACID compliance
- Complex queries with JOINs
- Strong data integrity
- Mature ecosystem
- Advanced features (CTEs, window functions, etc.)

**Disadvantages:**

- Schema changes can be challenging
- Vertical scaling limitations
- Can be complex for simple use cases
- Slower for some write-heavy workloads

## ORMs and ODMs

### MongoDB ODMs

**Mongoose:**

- Schema-based modeling for MongoDB
- Validation and type casting
- Middleware and hooks
- Query building
- Most popular MongoDB ODM for Node.js

### PostgreSQL ORMs

**Prisma:**

- Modern ORM with type safety
- Auto-generated TypeScript types
- Intuitive data modeling
- Migration system
- Great developer experience

**Drizzle:**

- Lightweight TypeScript ORM
- SQL-like syntax
- Zero dependencies
- Edge-ready (works in serverless)
- Excellent performance

## Best Practices

### General Database Practices

1. **Indexing**: Create indexes on frequently queried fields
2. **Connection Pooling**: Reuse database connections
3. **Error Handling**: Always handle database errors gracefully
4. **Security**: Use parameterized queries to prevent injection
5. **Backups**: Regular automated backups
6. **Monitoring**: Track query performance and database health

### MongoDB Specific

1. **Embedded vs Referenced**: Choose based on data access patterns
2. **Indexes**: Create compound indexes for common queries
3. **Aggregation**: Use pipeline for complex data transformations
4. **Schema Design**: Design for your query patterns
5. **Connection Management**: Use connection pooling

### PostgreSQL Specific

1. **Normalization**: Normalize data to reduce redundancy
2. **Transactions**: Use transactions for data consistency
3. **Indexes**: Create indexes on foreign keys and search columns
4. **Query Optimization**: Use EXPLAIN to analyze query plans
5. **Vacuum**: Regular maintenance to reclaim storage

## Project Structure Example

### Node.js with MongoDB

```
my-mongo-project/
├── models/
│   ├── User.js
│   └── Post.js
├── controllers/
│   ├── userController.js
│   └── postController.js
├── routes/
│   ├── users.js
│   └── posts.js
├── config/
│   └── database.js
├── .env
├── package.json
└── server.js
```

### Node.js with PostgreSQL

```
my-postgres-project/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   └── utils/
├── .env
├── package.json
└── server.js
```

## Popular Packages

### MongoDB

```json
{
  "dependencies": {
    "mongodb": "^5.0.0",
    "mongoose": "^7.0.0"
  }
}
```

### PostgreSQL

```json
{
  "dependencies": {
    "pg": "^8.10.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "drizzle-orm": "^0.28.0",
    "drizzle-kit": "^0.19.0"
  }
}
```

## Resources

### MongoDB

- [Official MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)

### PostgreSQL

- [Official PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Drizzle Documentation](https://orm.drizzle.team/)

## Performance Tips

### MongoDB Performance

- Use indexes strategically
- Limit document size (< 16MB)
- Use projection to return only needed fields
- Use aggregation pipeline efficiently
- Enable sharding for large datasets

### PostgreSQL Performance

- Create appropriate indexes
- Use connection pooling
- Optimize queries with EXPLAIN ANALYZE
- Use materialized views for complex queries
- Regular VACUUM and ANALYZE operations

---

Happy learning databases! 🚀

Choose the right database for your use case, and master both SQL and NoSQL paradigms for maximum flexibility!
