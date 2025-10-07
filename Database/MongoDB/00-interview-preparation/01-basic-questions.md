# Basic MongoDB Interview Questions

## Table of Contents

- [What is MongoDB?](#what-is-mongodb)
- [MongoDB Basics](#mongodb-basics)
- [CRUD Operations](#crud-operations)
- [Data Types and Documents](#data-types-and-documents)
- [Query Operators](#query-operators)

---

## What is MongoDB?

### Q1: What is MongoDB and why is it popular?

**Answer:**
MongoDB is a NoSQL, document-oriented database that stores data in flexible, JSON-like documents (BSON format).

**Key Features:**

- **Document-Oriented**: Stores data in BSON (Binary JSON) documents
- **Flexible Schema**: No predefined schema required
- **Scalable**: Horizontal scaling through sharding
- **High Performance**: In-memory operations and indexing
- **Rich Query Language**: Powerful querying and aggregation
- **Replication**: Built-in replication for high availability

**Popular Because:**

- Easy to get started
- Flexible data model
- Scales horizontally
- Great for agile development
- Strong community and ecosystem
- Cloud-native (MongoDB Atlas)

---

### Q2: What is BSON and how is it different from JSON?

**Answer:**
BSON (Binary JSON) is a binary-encoded serialization of JSON-like documents.

**Differences:**

| Feature        | JSON              | BSON                  |
| -------------- | ----------------- | --------------------- |
| Format         | Text              | Binary                |
| Size           | Larger (text)     | Smaller (binary)      |
| Speed          | Slower to parse   | Faster to parse       |
| Data Types     | Limited (6 types) | Extended (more types) |
| Traversal      | Requires parsing  | Direct access         |
| Human-readable | Yes               | No                    |

**BSON Additional Types:**

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // ObjectId
  date: ISODate("2023-10-06T10:00:00Z"),      // Date
  binary: BinData(0, "JVBERi0xLjMKJcTl8uXrp"),// Binary
  decimal: NumberDecimal("1234.56"),          // High-precision decimal
  int32: NumberInt(42),                       // 32-bit integer
  int64: NumberLong(42)                       // 64-bit integer
}
```

---

### Q3: What is the structure of MongoDB?

**Answer:**
MongoDB has a hierarchical structure:

```
MongoDB Server
  └── Database (e.g., "myapp")
      └── Collection (e.g., "users")
          └── Document (BSON document)
              └── Field: Value
```

**Example:**

```javascript
// Database: ecommerce
// Collection: products
{
  _id: ObjectId("..."),
  name: "Laptop",
  price: 999.99,
  category: "Electronics",
  specs: {
    ram: "16GB",
    storage: "512GB SSD"
  },
  tags: ["computer", "portable"]
}
```

**Key Concepts:**

- **Database**: Container for collections
- **Collection**: Group of documents (similar to table in SQL)
- **Document**: Single record in BSON format (similar to row in SQL)
- **Field**: Key-value pair in a document (similar to column in SQL)

---

## MongoDB Basics

### Q4: What is the difference between MongoDB and SQL databases?

**Answer:**

| Feature        | MongoDB                 | SQL Database             |
| -------------- | ----------------------- | ------------------------ |
| Data Model     | Document-oriented       | Relational (tables)      |
| Schema         | Flexible                | Fixed schema             |
| Scalability    | Horizontal (sharding)   | Vertical (usually)       |
| Query Language | MongoDB query language  | SQL                      |
| Joins          | $lookup (limited)       | Native JOINs             |
| Transactions   | Multi-document (4.0+)   | Full ACID support        |
| Use Case       | Flexible, evolving data | Structured data          |
| Performance    | Fast for reads/writes   | Fast for complex queries |

**Example Comparison:**

```sql
-- SQL
SELECT users.name, posts.title
FROM users
JOIN posts ON users.id = posts.user_id
WHERE users.age > 18;
```

```javascript
// MongoDB (Aggregation)
db.users.aggregate([
  { $match: { age: { $gt: 18 } } },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "userId",
      as: "posts",
    },
  },
  { $project: { name: 1, "posts.title": 1 } },
]);
```

---

### Q5: What is ObjectId in MongoDB?

**Answer:**
ObjectId is a 12-byte unique identifier automatically generated for the `_id` field if not provided.

**Structure (12 bytes):**

```
ObjectId("507f1f77bcf86cd799439011")
         |------|--|--|--------|
            4     2  2     4
         Timestamp|Machine|Counter
                 Process
```

- **4 bytes**: Timestamp (seconds since Unix epoch)
- **2 bytes**: Process ID
- **2 bytes**: Machine identifier
- **4 bytes**: Counter (incrementing)

**Properties:**

```javascript
const id = ObjectId();

id.getTimestamp(); // Returns creation date
id.toString(); // Convert to string
ObjectId.isValid(id); // Check if valid
```

**Usage:**

```javascript
// Auto-generated
db.users.insertOne({ name: "John" });
// { _id: ObjectId("..."), name: "John" }

// Custom _id
db.users.insertOne({ _id: "custom-id", name: "Jane" });

// Querying
db.users.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") });
```

---

### Q6: What are collections in MongoDB?

**Answer:**
A collection is a group of MongoDB documents, similar to a table in relational databases.

**Key Features:**

- **Dynamic Schema**: Documents can have different fields
- **No Schema Required**: Can insert any document structure
- **Scalable**: Can grow to any size
- **Indexed**: Support various index types

**Creating Collections:**

```javascript
// Implicit creation (on first insert)
db.users.insertOne({ name: "John" });

// Explicit creation
db.createCollection("products");

// With options
db.createCollection("logs", {
  capped: true,
  size: 5242880, // 5MB
  max: 5000, // max documents
});
```

**Collection Operations:**

```javascript
// List collections
show collections

// Drop collection
db.users.drop()

// Rename collection
db.users.renameCollection("customers")

// Collection stats
db.users.stats()
```

---

## CRUD Operations

### Q7: How do you insert documents in MongoDB?

**Answer:**
MongoDB provides multiple methods to insert documents.

**Insert One:**

```javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30
})

// Returns:
{
  acknowledged: true,
  insertedId: ObjectId("...")
}
```

**Insert Many:**

```javascript
db.users.insertMany([
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" }
])

// Returns:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId("..."),
    '1': ObjectId("..."),
    '2': ObjectId("...")
  }
}
```

**With Options:**

```javascript
// Ordered insert (stops on error)
db.users.insertMany([...], { ordered: true })

// Unordered insert (continues on error)
db.users.insertMany([...], { ordered: false })
```

---

### Q8: How do you query documents in MongoDB?

**Answer:**
MongoDB provides various methods to query documents.

**Find All:**

```javascript
db.users.find();
// Returns cursor with all documents
```

**Find One:**

```javascript
db.users.findOne({ email: "john@example.com" });
// Returns single document or null
```

**Find with Conditions:**

```javascript
// Exact match
db.users.find({ age: 30 });

// Multiple conditions (AND)
db.users.find({ age: 30, city: "NYC" });

// OR condition
db.users.find({
  $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }],
});
```

**Projection (selecting fields):**

```javascript
// Include fields
db.users.find({}, { name: 1, email: 1 });
// Returns: { _id: ..., name: "...", email: "..." }

// Exclude fields
db.users.find({}, { password: 0 });
// Returns all fields except password

// Exclude _id
db.users.find({}, { _id: 0, name: 1 });
```

**Sorting and Limiting:**

```javascript
// Sort ascending (1) or descending (-1)
db.users.find().sort({ age: 1 });

// Limit results
db.users.find().limit(10);

// Skip and limit (pagination)
db.users.find().skip(20).limit(10);

// Chaining
db.users
  .find({ age: { $gte: 18 } })
  .sort({ createdAt: -1 })
  .limit(10);
```

---

### Q9: How do you update documents in MongoDB?

**Answer:**
MongoDB provides multiple update methods with various update operators.

**Update One:**

```javascript
db.users.updateOne(
  { email: "john@example.com" },  // Filter
  { $set: { age: 31 } }           // Update
)

// Returns:
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1
}
```

**Update Many:**

```javascript
db.users.updateMany({ city: "NYC" }, { $set: { country: "USA" } });
```

**Update Operators:**

```javascript
// $set - Set field value
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { name: "John Smith", age: 31 } }
);

// $inc - Increment numeric value
db.users.updateOne({ _id: ObjectId("...") }, { $inc: { age: 1, points: 10 } });

// $push - Add to array
db.users.updateOne({ _id: ObjectId("...") }, { $push: { hobbies: "reading" } });

// $pull - Remove from array
db.users.updateOne({ _id: ObjectId("...") }, { $pull: { hobbies: "gaming" } });

// $addToSet - Add to array (if not exists)
db.users.updateOne(
  { _id: ObjectId("...") },
  { $addToSet: { tags: "premium" } }
);

// $unset - Remove field
db.users.updateOne(
  { _id: ObjectId("...") },
  { $unset: { temporaryField: "" } }
);
```

**Replace:**

```javascript
// Replace entire document (except _id)
db.users.replaceOne(
  { email: "john@example.com" },
  {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
  }
);
```

**Find and Modify:**

```javascript
// Update and return document
db.users.findOneAndUpdate(
  { email: "john@example.com" },
  { $set: { lastLogin: new Date() } },
  { returnNewDocument: true } // Return updated document
);
```

---

### Q10: How do you delete documents in MongoDB?

**Answer:**
MongoDB provides methods to delete one or multiple documents.

**Delete One:**

```javascript
db.users.deleteOne({ email: "john@example.com" })

// Returns:
{
  acknowledged: true,
  deletedCount: 1
}
```

**Delete Many:**

```javascript
// Delete all inactive users
db.users.deleteMany({ status: "inactive" })

// Delete all documents in collection
db.users.deleteMany({})

// Returns:
{
  acknowledged: true,
  deletedCount: 5
}
```

**Find and Delete:**

```javascript
// Delete and return document
db.users.findOneAndDelete({ email: "john@example.com" })

// Returns the deleted document
{
  _id: ObjectId("..."),
  email: "john@example.com",
  name: "John Doe"
}
```

**Soft Delete Pattern:**

```javascript
// Instead of deleting, mark as deleted
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      deleted: true,
      deletedAt: new Date(),
    },
  }
);

// Query only active users
db.users.find({ deleted: { $ne: true } });
```

---

## Data Types and Documents

### Q11: What data types does MongoDB support?

**Answer:**
MongoDB supports various BSON data types:

**Primitive Types:**

```javascript
{
  // String
  name: "John Doe",

  // Number
  age: 30,                              // Double
  count: NumberInt(42),                 // 32-bit integer
  bigNumber: NumberLong(9007199254740991), // 64-bit integer
  price: NumberDecimal("19.99"),        // Decimal128

  // Boolean
  active: true,

  // Null
  middleName: null,

  // Date
  createdAt: new Date(),
  birthDate: ISODate("1990-01-15T00:00:00Z"),

  // ObjectId
  _id: ObjectId("507f1f77bcf86cd799439011")
}
```

**Complex Types:**

```javascript
{
  // Array
  hobbies: ["reading", "coding", "gaming"],
  scores: [95, 87, 92],

  // Embedded Document (Object)
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001"
  },

  // Array of Documents
  orders: [
    { id: 1, amount: 99.99 },
    { id: 2, amount: 149.99 }
  ],

  // Binary Data
  profilePic: BinData(0, "..."),

  // Regular Expression
  pattern: /^test/i
}
```

**Special Types:**

```javascript
{
  // MinKey / MaxKey (comparison)
  min: MinKey(),
  max: MaxKey(),

  // Undefined (deprecated)
  oldField: undefined,

  // JavaScript code
  code: Code("function() { return 1; }")
}
```

---

### Q12: What is the maximum document size in MongoDB?

**Answer:**
The maximum BSON document size in MongoDB is **16 megabytes (16MB)**.

**Reasons for Limit:**

- Prevents excessive RAM usage
- Ensures reasonable network transmission time
- Encourages proper schema design

**Handling Large Data:**

1. **GridFS**: For files larger than 16MB

```javascript
// Using GridFS for large files
const bucket = new mongodb.GridFSBucket(db);
const uploadStream = bucket.openUploadStream("largefile.mp4");
fs.createReadStream("./largefile.mp4").pipe(uploadStream);
```

2. **Splitting Documents**: Break large documents into smaller ones

```javascript
// Instead of large array in one document
{
  userId: 1,
  events: [/* 1000s of events */]  // ❌ Can exceed 16MB
}

// Store events in separate collection
// users collection
{ _id: 1, name: "John" }

// events collection
{ userId: 1, event: "login", timestamp: ... }
{ userId: 1, event: "purchase", timestamp: ... }
```

3. **Reference Pattern**: Use references instead of embedding

---

## Query Operators

### Q13: What are comparison operators in MongoDB?

**Answer:**
MongoDB provides various operators for comparing values.

**Comparison Operators:**

```javascript
// $eq - Equal to
db.users.find({ age: { $eq: 30 } });
db.users.find({ age: 30 }); // Shorthand

// $ne - Not equal to
db.users.find({ status: { $ne: "inactive" } });

// $gt - Greater than
db.users.find({ age: { $gt: 18 } });

// $gte - Greater than or equal
db.users.find({ age: { $gte: 18 } });

// $lt - Less than
db.users.find({ age: { $lt: 65 } });

// $lte - Less than or equal
db.users.find({ age: { $lte: 65 } });

// $in - Matches any value in array
db.users.find({ status: { $in: ["active", "pending"] } });

// $nin - Not in array
db.users.find({ status: { $nin: ["banned", "suspended"] } });
```

**Combined Conditions:**

```javascript
// Age between 18 and 65
db.users.find({
  age: { $gte: 18, $lte: 65 },
});

// Multiple OR conditions
db.users.find({
  $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }],
});
```

---

### Q14: What are logical operators in MongoDB?

**Answer:**
Logical operators combine multiple query conditions.

**Logical Operators:**

```javascript
// $and - All conditions must be true
db.users.find({
  $and: [{ age: { $gte: 18 } }, { city: "NYC" }, { status: "active" }],
});

// Implicit AND (shorter syntax)
db.users.find({
  age: { $gte: 18 },
  city: "NYC",
  status: "active",
});

// $or - At least one condition must be true
db.users.find({
  $or: [{ age: { $lt: 18 } }, { status: "inactive" }],
});

// $nor - None of the conditions are true
db.users.find({
  $nor: [{ status: "banned" }, { status: "suspended" }],
});

// $not - Inverts query expression
db.users.find({
  age: { $not: { $gte: 18 } },
});
```

**Complex Queries:**

```javascript
// Combination of operators
db.users.find({
  $and: [
    {
      $or: [{ city: "NYC" }, { city: "LA" }],
    },
    { age: { $gte: 18 } },
    { status: "active" },
  ],
});
```

---

### Q15: What are element query operators?

**Answer:**
Element operators query based on field existence and type.

**Element Operators:**

```javascript
// $exists - Check if field exists
db.users.find({ middleName: { $exists: true } });
db.users.find({ phone: { $exists: false } });

// $type - Check field type
db.users.find({ age: { $type: "number" } });
db.users.find({ age: { $type: "string" } });

// Multiple types
db.users.find({ age: { $type: ["int", "long", "double"] } });

// Type by BSON type number
db.users.find({ name: { $type: 2 } }); // 2 = string
```

**Common BSON Types:**

| Type Number | Type Name |
| ----------- | --------- |
| 1           | double    |
| 2           | string    |
| 3           | object    |
| 4           | array     |
| 7           | objectId  |
| 8           | bool      |
| 9           | date      |
| 10          | null      |
| 16          | int       |
| 18          | long      |

**Use Cases:**

```javascript
// Find documents with optional field
db.users.find({
  $or: [{ phone: { $exists: false } }, { phone: null }],
});

// Validate data type
db.products.find({
  price: { $type: "number" },
});
```

---

This covers the basic MongoDB interview questions. Practice these concepts and move on to advanced MongoDB questions!
