# MongoDB - Complete Learning Guide

This repository contains a comprehensive guide to learning MongoDB with practical examples and Mongoose integration.

## Table of Contents

### 1. MongoDB Basics

- [Connection and Setup](01-basics/connection.js) - Connecting to MongoDB
- [Database Operations](01-basics/database-operations.js) - Create, drop, and list databases
- [Collection Operations](01-basics/collection-operations.js) - Collection management
- [Data Types](01-basics/data-types.js) - MongoDB data types

### 2. CRUD Operations

- [Create Operations](02-crud-operations/create.js) - insertOne, insertMany
- [Read Operations](02-crud-operations/read.js) - find, findOne, query operators
- [Update Operations](02-crud-operations/update.js) - updateOne, updateMany, findAndUpdate
- [Delete Operations](02-crud-operations/delete.js) - deleteOne, deleteMany

### 3. Aggregation Framework

- [Basic Aggregation](03-aggregation/basic-aggregation.js) - $match, $group, $sort
- [Advanced Pipelines](03-aggregation/advanced-pipelines.js) - $lookup, $unwind, $project
- [Aggregation Operators](03-aggregation/operators.js) - Various aggregation operators
- [Performance](03-aggregation/performance.js) - Optimizing aggregation queries

### 4. Mongoose ODM

- [Mongoose Setup](04-mongoose/setup.js) - Installation and configuration
- [Schemas and Models](04-mongoose/schemas.js) - Defining schemas and models
- [Validation](04-mongoose/validation.js) - Built-in and custom validators
- [Middleware](04-mongoose/middleware.js) - Pre and post hooks
- [Relationships](04-mongoose/relationships.js) - Referenced and embedded documents
- [Queries](04-mongoose/queries.js) - Query building and population
- [Virtuals and Methods](04-mongoose/virtuals-methods.js) - Instance and static methods

## Getting Started

### Installation

```bash
# Install MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Node.js Setup

```bash
# Install MongoDB driver
npm install mongodb

# Install Mongoose ODM
npm install mongoose
```

### Basic Connection

```javascript
// Using MongoDB Driver
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connect() {
  await client.connect();
  console.log("Connected to MongoDB");
}

// Using Mongoose
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/mydb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));
```

## Key MongoDB Concepts

### What is MongoDB?

- **Document-Oriented**: Stores data in JSON-like documents (BSON)
- **Flexible Schema**: No predefined schema required
- **Scalable**: Horizontal scaling through sharding
- **High Performance**: Indexing and in-memory speed
- **Rich Query Language**: Powerful querying capabilities

### MongoDB Structure

```
MongoDB Server
  └── Database
      └── Collection
          └── Document (BSON)
              └── Field: Value
```

### Document Example

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    country: "USA"
  },
  hobbies: ["reading", "coding", "gaming"],
  createdAt: ISODate("2023-10-06T10:00:00Z")
}
```

## MongoDB vs Mongoose

### Native MongoDB Driver

**Pros:**

- Lightweight and fast
- Full control over queries
- No abstraction layer
- Smaller bundle size

**Cons:**

- No schema validation
- Manual data modeling
- More boilerplate code
- No built-in middleware

**Use when:**

- Simple applications
- Maximum performance needed
- Flexible data structure
- Minimal dependencies

### Mongoose ODM

**Pros:**

- Schema-based modeling
- Built-in validation
- Middleware/hooks support
- Query building helpers
- Type casting
- Virtuals and methods

**Cons:**

- Additional abstraction layer
- Slightly slower
- Larger bundle size
- Learning curve

**Use when:**

- Complex applications
- Need data validation
- Want structured models
- Team collaboration

## Best Practices

### Schema Design

1. **Embed vs Reference**

   - Embed: One-to-few, data accessed together
   - Reference: One-to-many, independent data

2. **Denormalization**

   - Acceptable for read performance
   - Consider data duplication vs consistency

3. **Document Size**
   - Keep documents under 16MB limit
   - Consider splitting large arrays

### Indexing

1. **Create Indexes on Frequent Queries**

   ```javascript
   db.users.createIndex({ email: 1 });
   db.posts.createIndex({ userId: 1, createdAt: -1 });
   ```

2. **Compound Indexes**

   - Order matters for queries
   - Most selective field first

3. **Index Types**
   - Single field
   - Compound
   - Text
   - Geospatial
   - TTL (Time To Live)

### Query Optimization

1. **Use Projections**

   ```javascript
   db.users.find({}, { name: 1, email: 1 });
   ```

2. **Limit Results**

   ```javascript
   db.users.find().limit(10);
   ```

3. **Use Explain**
   ```javascript
   db.users.find({ email: "test@example.com" }).explain("executionStats");
   ```

### Connection Management

1. **Connection Pooling**

   ```javascript
   mongoose.connect("mongodb://localhost:27017/mydb", {
     maxPoolSize: 10,
     minPoolSize: 2,
   });
   ```

2. **Error Handling**

   ```javascript
   mongoose.connection.on("error", console.error);
   mongoose.connection.on("disconnected", reconnect);
   ```

3. **Graceful Shutdown**
   ```javascript
   process.on("SIGINT", async () => {
     await mongoose.connection.close();
     process.exit(0);
   });
   ```

## Common Patterns

### Repository Pattern

```javascript
class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id);
  }

  async update(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}
```

### Pagination

```javascript
async function paginate(model, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find().skip(skip).limit(limit),
    model.countDocuments(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

### Soft Delete

```javascript
const schema = new mongoose.Schema({
  name: String,
  deleted: { type: Boolean, default: false },
  deletedAt: Date,
});

schema.methods.softDelete = function () {
  this.deleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Query helper
schema.query.notDeleted = function () {
  return this.where({ deleted: false });
};

// Usage
const activeUsers = await User.find().notDeleted();
```

## Security Best Practices

1. **Input Validation**

   - Always validate user input
   - Use Mongoose validators
   - Sanitize data

2. **Authentication**

   - Hash passwords (bcrypt)
   - Use secure session management
   - Implement rate limiting

3. **Authorization**

   - Role-based access control
   - Field-level permissions
   - Validate ownership

4. **Query Injection Prevention**

   - Use parameterized queries
   - Sanitize user input
   - Avoid eval() or $where

5. **Connection Security**
   - Use SSL/TLS
   - Whitelist IPs
   - Use authentication
   - Encrypt sensitive data

## Performance Tips

1. **Indexing Strategy**

   - Index frequently queried fields
   - Remove unused indexes
   - Monitor index usage

2. **Query Optimization**

   - Use projections
   - Avoid $where operator
   - Use covered queries
   - Batch operations

3. **Connection Pooling**

   - Reuse connections
   - Appropriate pool size
   - Monitor connections

4. **Caching**

   - Cache frequently accessed data
   - Use Redis for caching
   - Implement cache invalidation

5. **Monitoring**
   - Track slow queries
   - Monitor database metrics
   - Use profiling

## Resources

- [Official MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

---

Happy coding with MongoDB! 🚀
