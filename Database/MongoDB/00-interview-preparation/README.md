# MongoDB Interview Preparation Guide

This folder contains the most common MongoDB interview questions organized by difficulty and topic. Use this resource to prepare for database and backend developer interviews.

## 📋 Table of Contents

### 1. [Basic MongoDB Questions](01-basic-questions.md)

- MongoDB fundamentals
- CRUD operations
- Data types and documents
- Basic queries

### 2. [Advanced MongoDB Questions](02-advanced-questions.md)

- Aggregation framework
- Indexing and performance
- Replication and sharding
- Transactions

### 3. [Mongoose Questions](03-mongoose-questions.md)

- Mongoose schemas and models
- Validation and middleware
- Relationships and population
- Query building

### 4. [Practical Questions](04-practical-questions.md)

- Real-world scenarios
- Data modeling problems
- Performance optimization
- System design with MongoDB

## 🎯 Interview Preparation Strategy

### Before the Interview

1. **Review Fundamentals** - Understand CRUD operations and basic queries
2. **Practice Aggregation** - Master the aggregation pipeline
3. **Learn Schema Design** - Embedded vs Referenced documents
4. **Understand Indexing** - When and how to create indexes
5. **Prepare Examples** - Have real projects to discuss

### During the Interview

1. **Clarify Requirements** - Understand data access patterns
2. **Think About Scale** - Consider read/write patterns
3. **Discuss Trade-offs** - Embedded vs referenced, consistency vs performance
4. **Write Clean Queries** - Use proper operators and syntax
5. **Consider Indexes** - Mention indexing for optimization

### Common Interview Formats

- **Technical Questions** - MongoDB concepts and features
- **Query Writing** - Write queries to solve problems
- **Schema Design** - Design database schema for use cases
- **Debugging** - Fix or optimize existing queries
- **System Design** - Design scalable database architecture

## 📚 Key Topics to Master

### Essential MongoDB Concepts

- [ ] Documents, collections, and databases
- [ ] CRUD operations (Create, Read, Update, Delete)
- [ ] Query operators ($eq, $gt, $in, $regex, etc.)
- [ ] Update operators ($set, $inc, $push, etc.)
- [ ] Data types (ObjectId, Date, Array, Embedded documents)
- [ ] Basic indexing

### Aggregation Framework

- [ ] Aggregation pipeline stages
- [ ] $match, $group, $project, $sort
- [ ] $lookup (joins)
- [ ] $unwind (array deconstruction)
- [ ] Aggregation operators and expressions
- [ ] Performance considerations

### Advanced Topics

- [ ] Indexing strategies (compound, text, geospatial)
- [ ] Index types and performance
- [ ] Replication and replica sets
- [ ] Sharding and horizontal scaling
- [ ] Transactions and ACID properties
- [ ] Change streams

### Mongoose ODM

- [ ] Schema definition and types
- [ ] Schema validation
- [ ] Middleware (pre/post hooks)
- [ ] Virtual properties
- [ ] Instance and static methods
- [ ] Query helpers and population
- [ ] Relationships (embedded vs referenced)

### Schema Design

- [ ] Embedded documents vs references
- [ ] One-to-one relationships
- [ ] One-to-many relationships
- [ ] Many-to-many relationships
- [ ] Denormalization strategies
- [ ] Document size limitations

### Performance & Optimization

- [ ] Query optimization with explain()
- [ ] Index selection and usage
- [ ] Query patterns and anti-patterns
- [ ] Connection pooling
- [ ] Caching strategies
- [ ] Bulk operations

## 🚀 Quick Reference

### MongoDB Shell Commands

```bash
# Database operations
show dbs                        # List databases
use mydb                        # Switch database
db.dropDatabase()               # Drop database

# Collection operations
show collections                # List collections
db.createCollection("users")   # Create collection
db.users.drop()                 # Drop collection

# CRUD operations
db.users.insertOne({})          # Insert one document
db.users.find()                 # Find all documents
db.users.updateOne({}, {$set: {}})  # Update one
db.users.deleteOne({})          # Delete one

# Indexing
db.users.createIndex({email: 1})    # Create index
db.users.getIndexes()               # List indexes
db.users.dropIndex("email_1")       # Drop index

# Performance
db.users.find().explain("executionStats")  # Query plan
db.users.stats()                           # Collection stats
```

### Common Query Patterns

```javascript
// Find with conditions
db.users.find({ age: { $gte: 18 } });

// Projection
db.users.find({}, { name: 1, email: 1 });

// Sorting and limiting
db.users.find().sort({ createdAt: -1 }).limit(10);

// Update operators
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    $set: { name: "John" },
    $inc: { age: 1 },
    $push: { hobbies: "reading" },
  }
);

// Aggregation
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
]);
```

### Mongoose Patterns

```javascript
// Schema definition
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  age: { type: Number, min: 0 },
});

// Middleware
userSchema.pre("save", async function () {
  // Logic before save
});

// Virtual
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Population
await User.findById(id).populate("posts");
```

## 📖 Additional Resources

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)

## 💡 Pro Tips

1. **Practice Queries** - Write queries daily on sample datasets
2. **Understand Trade-offs** - Know when to embed vs reference
3. **Learn Aggregation** - Most advanced questions involve aggregation
4. **Study Real Examples** - Look at production schema designs
5. **Monitor Performance** - Use explain() to understand query execution
6. **Know Your Tools** - Familiar with MongoDB Compass or Studio 3T
7. **Build Projects** - Create applications using MongoDB

## Common Interview Mistakes to Avoid

1. ❌ Not understanding embedded vs referenced documents
2. ❌ Forgetting to create indexes on frequently queried fields
3. ❌ Not handling ObjectId conversions properly
4. ❌ Ignoring array size limitations in documents
5. ❌ Not considering query performance and scalability
6. ❌ Confusing MongoDB operators ($set, $push, $inc, etc.)
7. ❌ Not properly handling errors and edge cases

## Sample Interview Questions Preview

**Question:** "How would you design a blog system with users, posts, and comments?"

**Good Answer:**

- Users: Separate collection with authentication info
- Posts: Separate collection with userId reference
- Comments: Embedded in posts (if limited) OR separate collection (if many)
- Considerations: Query patterns, update frequency, document size

**Question:** "How do you optimize a slow query?"

**Good Answer:**

1. Use explain() to analyze query execution
2. Check if indexes are being used
3. Create appropriate indexes
4. Use projection to limit returned fields
5. Consider query structure and operators
6. Check document size and collection size

---

**Good luck with your MongoDB interview! 🍀**

Remember: Understanding schema design and aggregation framework are key to MongoDB success!
