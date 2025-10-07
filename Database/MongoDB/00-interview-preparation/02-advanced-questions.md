# Advanced MongoDB Interview Questions

## Table of Contents

- [Aggregation Framework](#aggregation-framework)
- [Indexing and Performance](#indexing-and-performance)
- [Replication and Sharding](#replication-and-sharding)
- [Transactions](#transactions)
- [Advanced Queries](#advanced-queries)

---

## Aggregation Framework

### Q1: What is the MongoDB Aggregation Framework?

**Answer:**
The Aggregation Framework is a powerful data processing pipeline that performs operations on documents and returns computed results.

**Key Features:**

- Pipeline-based processing
- Multiple stages
- Data transformation and analysis
- Similar to SQL GROUP BY

**Basic Structure:**

```javascript
db.collection.aggregate([
  { $stage1: {...} },
  { $stage2: {...} },
  { $stage3: {...} }
])
```

**Example:**

```javascript
// Calculate total sales by category
db.orders.aggregate([
  // Stage 1: Filter completed orders
  { $match: { status: "completed" } },

  // Stage 2: Group by category and sum amounts
  {
    $group: {
      _id: "$category",
      totalSales: { $sum: "$amount" },
      count: { $sum: 1 },
    },
  },

  // Stage 3: Sort by total sales descending
  { $sort: { totalSales: -1 } },

  // Stage 4: Limit to top 10
  { $limit: 10 },
]);
```

---

### Q2: Explain common aggregation pipeline stages

**Answer:**
Aggregation pipelines consist of multiple stages that process documents sequentially.

**Common Stages:**

**$match** - Filter documents:

```javascript
{ $match: { status: "active", age: { $gte: 18 } } }
```

**$group** - Group documents and perform calculations:

```javascript
{
  $group: {
    _id: "$category",
    total: { $sum: "$amount" },
    avg: { $avg: "$price" },
    max: { $max: "$score" },
    min: { $min: "$score" },
    count: { $sum: 1 }
  }
}
```

**$project** - Select/reshape fields:

```javascript
{
  $project: {
    name: 1,
    total: { $add: ["$price", "$tax"] },
    _id: 0
  }
}
```

**$sort** - Sort documents:

```javascript
{ $sort: { createdAt: -1, name: 1 } }
```

**$limit** - Limit number of documents:

```javascript
{
  $limit: 10;
}
```

**$skip** - Skip documents:

```javascript
{
  $skip: 20;
}
```

**$lookup** - Join with another collection:

```javascript
{
  $lookup: {
    from: "orders",
    localField: "_id",
    foreignField: "userId",
    as: "userOrders"
  }
}
```

**$unwind** - Deconstruct array:

```javascript
{
  $unwind: "$items";
}
```

**$addFields** - Add new fields:

```javascript
{
  $addFields: {
    fullName: {
      $concat: ["$firstName", " ", "$lastName"];
    }
  }
}
```

---

### Q3: What is $lookup and how does it work?

**Answer:**
$lookup performs a left outer join to combine documents from two collections.

**Syntax:**

```javascript
{
  $lookup: {
    from: "collection_to_join",
    localField: "field_in_current_collection",
    foreignField: "field_in_other_collection",
    as: "output_array_field"
  }
}
```

**Example - Users and Orders:**

```javascript
// Users collection
{ _id: 1, name: "John" }
{ _id: 2, name: "Jane" }

// Orders collection
{ _id: 101, userId: 1, amount: 99.99 }
{ _id: 102, userId: 1, amount: 149.99 }
{ _id: 103, userId: 2, amount: 79.99 }

// Join query
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders"
    }
  }
])

// Result:
{
  _id: 1,
  name: "John",
  orders: [
    { _id: 101, userId: 1, amount: 99.99 },
    { _id: 102, userId: 1, amount: 149.99 }
  ]
}
```

**Advanced $lookup with Pipeline:**

```javascript
{
  $lookup: {
    from: "orders",
    let: { userId: "$_id" },
    pipeline: [
      { $match: {
          $expr: {
            $and: [
              { $eq: ["$userId", "$$userId"] },
              { $eq: ["$status", "completed"] }
            ]
          }
      }},
      { $project: { amount: 1, date: 1 } }
    ],
    as: "completedOrders"
  }
}
```

---

## Indexing and Performance

### Q4: What are indexes in MongoDB and why are they important?

**Answer:**
Indexes are data structures that improve query performance by allowing MongoDB to quickly locate documents.

**Benefits:**

- Faster queries
- Reduced disk I/O
- Efficient sorting
- Improved query performance

**Trade-offs:**

- Slower write operations
- Additional storage space
- Memory overhead

**Creating Indexes:**

```javascript
// Single field index
db.users.createIndex({ email: 1 }); // 1 = ascending, -1 = descending

// Compound index
db.users.createIndex({ lastName: 1, firstName: 1 });

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Text index for full-text search
db.articles.createIndex({ title: "text", content: "text" });

// TTL index (auto-delete after time)
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Sparse index (only index documents with field)
db.users.createIndex({ phone: 1 }, { sparse: true });
```

**Viewing Indexes:**

```javascript
// List all indexes
db.users.getIndexes();

// Index statistics
db.users.stats();
```

---

### Q5: What is a compound index and when should you use it?

**Answer:**
A compound index is an index on multiple fields, creating a single index structure.

**Creating Compound Index:**

```javascript
db.users.createIndex({ city: 1, age: -1 });
```

**Index Usage:**

This index can be used for queries on:

- `{ city: "NYC" }` ✅
- `{ city: "NYC", age: 30 }` ✅
- `{ age: 30 }` ❌ (doesn't use index efficiently)

**Order Matters:**

```javascript
// Index: { city: 1, age: 1 }

// Efficient queries:
db.users.find({ city: "NYC" });
db.users.find({ city: "NYC", age: 30 });
db.users.find({ city: "NYC" }).sort({ age: 1 });

// Less efficient:
db.users.find({ age: 30 }); // Skips first field
```

**Best Practices:**

1. **Equality, Sort, Range (ESR) Rule:**

```javascript
// Query: city = "NYC", sort by age, age > 25
// Good index:
db.users.createIndex({
  city: 1, // Equality
  age: 1, // Sort and Range
});
```

2. **Most Selective Field First:**

```javascript
// If lastName is more selective than city
db.users.createIndex({ lastName: 1, city: 1 });
```

3. **Consider Query Patterns:**

```javascript
// Frequent query: { status: "active", city: "NYC" }
db.users.createIndex({ status: 1, city: 1 });
```

---

### Q6: How do you optimize slow queries in MongoDB?

**Answer:**
Use multiple techniques to identify and optimize slow queries.

**1. Use explain() to Analyze:**

```javascript
db.users.find({ email: "test@example.com" }).explain("executionStats");
```

**Key Metrics:**

- `executionTimeMillis`: Query execution time
- `totalDocsExamined`: Documents scanned
- `totalKeysExamined`: Index keys scanned
- `executionStages`: Query execution plan

**2. Create Appropriate Indexes:**

```javascript
// Slow query without index
db.users.find({ email: "test@example.com" });
// totalDocsExamined: 1000000

// Create index
db.users.createIndex({ email: 1 });

// Fast query with index
db.users.find({ email: "test@example.com" });
// totalDocsExamined: 1
```

**3. Use Projections:**

```javascript
// Fetch only needed fields
db.users.find({ city: "NYC" }, { name: 1, email: 1, _id: 0 });
```

**4. Use Covered Queries:**

```javascript
// Create compound index
db.users.createIndex({ city: 1, name: 1, email: 1 });

// Query that only uses index (very fast)
db.users.find({ city: "NYC" }, { name: 1, email: 1, _id: 0 });
// totalDocsExamined: 0 (covered query)
```

**5. Optimize Aggregation:**

```javascript
// Put $match early to filter documents
db.orders.aggregate([
  { $match: { status: "completed" } },  // Filter first
  { $lookup: {...} },                   // Then join
  { $group: {...} }                     // Then aggregate
])
```

**6. Use Indexes for Sorting:**

```javascript
// Create index for sorting
db.posts.createIndex({ createdAt: -1 });

// Query uses index for sorting
db.posts.find().sort({ createdAt: -1 }).limit(10);
```

---

## Replication and Sharding

### Q7: What is replication in MongoDB?

**Answer:**
Replication is the process of synchronizing data across multiple servers for high availability and data redundancy.

**Replica Set:**

- **Primary**: Receives all write operations
- **Secondary**: Replicates primary's data
- **Arbiter**: Participates in elections (no data)

```
         Primary Node (Read/Write)
              /    \
             /      \
            /        \
    Secondary 1    Secondary 2
    (Read Only)    (Read Only)
```

**Benefits:**

- High availability
- Data redundancy
- Automatic failover
- Read scaling (read from secondaries)
- Disaster recovery

**Configuration:**

```javascript
// Initialize replica set
rs.initiate({
  _id: "myReplicaSet",
  members: [
    { _id: 0, host: "mongodb0.example.com:27017" },
    { _id: 1, host: "mongodb1.example.com:27017" },
    { _id: 2, host: "mongodb2.example.com:27017" }
  ]
})

// Check status
rs.status()

// Connection string
mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/?replicaSet=myReplicaSet
```

---

### Q8: What is sharding in MongoDB?

**Answer:**
Sharding is MongoDB's method for horizontal scaling by distributing data across multiple servers.

**Components:**

- **Shard**: Subset of data
- **Config Servers**: Store metadata
- **Mongos**: Query router

```
      Application
           |
        Mongos (Router)
        /      \
       /        \
    Shard 1   Shard 2   Shard 3
    (data A)  (data B)  (data C)
```

**Shard Key:**

- Field that determines data distribution
- Must exist in every document
- Immutable after sharding

**Example:**

```javascript
// Enable sharding on database
sh.enableSharding("mydb");

// Shard collection by userId
sh.shardCollection("mydb.users", { userId: 1 });

// Range-based sharding
sh.shardCollection("mydb.orders", { orderDate: 1 });

// Hash-based sharding (even distribution)
sh.shardCollection("mydb.logs", { _id: "hashed" });
```

**Choosing Shard Key:**

```javascript
// Good shard keys:
// 1. High cardinality
sh.shardCollection("users", { userId: 1 });

// 2. Even distribution
sh.shardCollection("logs", { timestamp: 1, userId: 1 });

// 3. Query isolation
sh.shardCollection("tenants", { tenantId: 1 });

// Bad shard keys:
// - Low cardinality (status, boolean)
// - Monotonically increasing (_id, timestamp only)
// - Non-existent in queries
```

---

## Transactions

### Q9: What are transactions in MongoDB?

**Answer:**
Transactions allow you to execute multiple operations atomically across multiple documents or collections.

**ACID Properties:**

- **Atomicity**: All or nothing
- **Consistency**: Valid state transitions
- **Isolation**: Concurrent execution isolation
- **Durability**: Committed changes persist

**Requirements:**

- MongoDB 4.0+ for replica sets
- MongoDB 4.2+ for sharded clusters

**Example:**

```javascript
// Start session
const session = client.startSession();

try {
  // Start transaction
  session.startTransaction();

  // Operations within transaction
  await accounts.updateOne(
    { userId: "user1" },
    { $inc: { balance: -100 } },
    { session }
  );

  await accounts.updateOne(
    { userId: "user2" },
    { $inc: { balance: 100 } },
    { session }
  );

  // Commit transaction
  await session.commitTransaction();
  console.log("Transaction committed");
} catch (error) {
  // Abort on error
  await session.abortTransaction();
  console.error("Transaction aborted:", error);
} finally {
  session.endSession();
}
```

**With Mongoose:**

```javascript
const session = await mongoose.startSession();

await session.withTransaction(async () => {
  await User.findByIdAndUpdate(
    userId1,
    { $inc: { balance: -100 } },
    { session }
  );

  await User.findByIdAndUpdate(
    userId2,
    { $inc: { balance: 100 } },
    { session }
  );
});
```

---

### Q10: What are the limitations of MongoDB transactions?

**Answer:**
MongoDB transactions have several limitations to consider:

**Performance Impact:**

- Transactions are slower than individual operations
- Lock resources during execution
- Can cause write conflicts

**Limitations:**

1. **Time Limit:**

```javascript
// Default 60 seconds timeout
// Can be configured but not recommended > 60s
```

2. **Document Size:**

```javascript
// Transaction operations limit: 16MB total
// Single document still 16MB max
```

3. **DDL Operations:**

```javascript
// Cannot create collections or indexes in transaction
// Must exist before transaction starts
```

4. **Cross-Shard Queries:**

```javascript
// Distributed transactions are slower
// Avoid if possible
```

**Best Practices:**

```javascript
// 1. Keep transactions short
await session.withTransaction(
  async () => {
    // Quick operations only
  },
  {
    maxCommitTimeMS: 30000, // 30 seconds
  }
);

// 2. Handle retry logic
let retries = 3;
while (retries > 0) {
  try {
    await session.withTransaction(async () => {
      // Operations
    });
    break;
  } catch (error) {
    if (error.hasErrorLabel("TransientTransactionError")) {
      retries--;
    } else {
      throw error;
    }
  }
}

// 3. Use only when necessary
// Often denormalization is better than transactions
```

---

## Advanced Queries

### Q11: What are array query operators?

**Answer:**
MongoDB provides specialized operators for querying arrays.

**Array Operators:**

```javascript
// Sample document
{
  name: "John",
  tags: ["javascript", "mongodb", "nodejs"],
  scores: [85, 92, 88]
}

// $all - Array contains all specified elements
db.users.find({ tags: { $all: ["javascript", "mongodb"] } })

// $elemMatch - Array element matches all conditions
db.users.find({
  scores: { $elemMatch: { $gte: 80, $lte: 90 } }
})

// $size - Array has specific length
db.users.find({ tags: { $size: 3 } })

// Array element by position
db.users.find({ "tags.0": "javascript" })

// Array element in range
db.users.find({ "scores.1": { $gt: 90 } })
```

**Advanced Array Queries:**

```javascript
// Array of documents
{
  items: [
    { name: "apple", qty: 5, price: 1.5 },
    { name: "banana", qty: 10, price: 0.5 },
  ];
}

// Query nested array documents
db.orders.find({
  items: {
    $elemMatch: {
      name: "apple",
      qty: { $gte: 5 },
    },
  },
});

// Projection with $ operator (first match)
db.orders.find({ "items.name": "apple" }, { "items.$": 1 });
```

---

### Q12: How do you perform text search in MongoDB?

**Answer:**
MongoDB supports full-text search using text indexes.

**Create Text Index:**

```javascript
// Single field
db.articles.createIndex({ content: "text" });

// Multiple fields
db.articles.createIndex({
  title: "text",
  content: "text",
  tags: "text",
});

// With weights
db.articles.createIndex(
  {
    title: "text",
    content: "text",
  },
  {
    weights: {
      title: 10,
      content: 5,
    },
  }
);
```

**Text Search:**

```javascript
// Simple search
db.articles.find({ $text: { $search: "mongodb tutorial" } });

// Exact phrase
db.articles.find({ $text: { $search: '"mongodb tutorial"' } });

// Exclude words
db.articles.find({ $text: { $search: "mongodb -sql" } });

// Multiple words (OR)
db.articles.find({ $text: { $search: "mongodb nodejs express" } });
```

**Text Search Score:**

```javascript
// Get relevance score
db.articles
  .find({ $text: { $search: "mongodb" } }, { score: { $meta: "textScore" } })
  .sort({ score: { $meta: "textScore" } });
```

**Language Support:**

```javascript
// Create index with language
db.articles.createIndex({ content: "text" }, { default_language: "spanish" });

// Search with specific language
db.articles.find({
  $text: {
    $search: "amor",
    $language: "spanish",
  },
});
```

---

This covers advanced MongoDB concepts. Master these topics to excel in MongoDB interviews!
