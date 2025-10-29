# MongoDB Schema Design & Database Design Questions

## Schema Design Fundamentals

### Q1: What are the key principles of MongoDB schema design?

**Answer:**
MongoDB schema design follows these key principles:

1. **Design for your application's queries** - Structure documents to match how your application will query and update data
2. **Embed related data when possible** - Take advantage of MongoDB's document model to embed related data in a single document
3. **Use references for many-to-many relationships** - When data is accessed independently or grows unbounded
4. **Consider document size limits** - Maximum document size is 16MB
5. **Optimize for read/write patterns** - Design based on whether your application is read-heavy or write-heavy
6. **Denormalize when beneficial** - Accept data duplication for better query performance
7. **Consider atomicity requirements** - Operations on a single document are atomic

### Q2: When should you embed documents vs. reference them?

**Answer:**

**Embed when:**

- Data is frequently accessed together (1-to-1 or 1-to-few relationships)
- Data has strong ownership relationship (e.g., order items within an order)
- Relationship is "contains" or "has-a"
- You want atomic updates
- Child documents are small and won't exceed 16MB limit

```javascript
// Embedded Example - User with addresses
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  addresses: [
    {
      type: "home",
      street: "123 Main St",
      city: "Boston"
    },
    {
      type: "work",
      street: "456 Office Blvd",
      city: "Boston"
    }
  ]
}
```

**Reference when:**

- Data is accessed independently (many-to-many relationships)
- Relationships are dynamic and unbounded
- Need to avoid data duplication when updates are frequent
- Related data is large and could exceed 16MB
- Need to maintain referential integrity across collections

```javascript
// Referenced Example - Posts and Authors
// Authors collection
{
  _id: ObjectId("author123"),
  name: "Jane Smith",
  bio: "Tech writer"
}

// Posts collection
{
  _id: ObjectId("post456"),
  title: "MongoDB Best Practices",
  author_id: ObjectId("author123"),
  content: "..."
}
```

### Q3: What is the "bucket pattern" in MongoDB and when should it be used?

**Answer:**
The bucket pattern groups related documents into buckets to optimize storage and query performance.

**Use cases:**

- Time-series data (IoT sensor readings, logs, metrics)
- Event tracking
- Stock prices
- Large volumes of similar data points

**Example - IoT Temperature Readings:**

```javascript
// Instead of one document per reading (inefficient)
{
  _id: ObjectId("..."),
  sensor_id: "sensor_1",
  timestamp: ISODate("2024-01-01T10:00:00Z"),
  temperature: 22.5
}

// Use bucket pattern (efficient)
{
  _id: ObjectId("..."),
  sensor_id: "sensor_1",
  start_date: ISODate("2024-01-01T00:00:00Z"),
  end_date: ISODate("2024-01-01T23:59:59Z"),
  count: 1440, // number of readings
  readings: [
    { timestamp: ISODate("2024-01-01T10:00:00Z"), temp: 22.5 },
    { timestamp: ISODate("2024-01-01T10:01:00Z"), temp: 22.7 },
    // ... more readings
  ],
  avg_temp: 22.3,
  max_temp: 25.1,
  min_temp: 19.8
}
```

**Benefits:**

- Reduces number of documents
- Improves index efficiency
- Better query performance
- Pre-computed aggregations

### Q4: What is the "subset pattern" and when is it useful?

**Answer:**
The subset pattern stores a subset of frequently accessed data in the main document and keeps the full dataset elsewhere.

**Example - Product Reviews:**

```javascript
// Products collection with subset of recent reviews
{
  _id: ObjectId("product123"),
  name: "Laptop",
  price: 999,
  recent_reviews: [ // Only last 10 reviews
    {
      user: "John",
      rating: 5,
      comment: "Great laptop!",
      date: ISODate("2024-01-15")
    }
    // ... 9 more recent reviews
  ],
  total_reviews: 1543,
  avg_rating: 4.5
}

// All Reviews collection (referenced)
{
  _id: ObjectId("..."),
  product_id: ObjectId("product123"),
  user: "Jane",
  rating: 4,
  comment: "Good value",
  date: ISODate("2023-06-10")
}
```

**Benefits:**

- Reduces working set size
- Improves application performance
- Avoids 16MB document limit
- Maintains quick access to most relevant data

### Q5: Explain the "extended reference pattern" in MongoDB.

**Answer:**
The extended reference pattern duplicates frequently accessed fields from referenced documents to avoid joins.

**Example - E-commerce Orders:**

```javascript
// Instead of just storing customer_id
{
  _id: ObjectId("order123"),
  customer_id: ObjectId("cust456"), // Reference
  customer_name: "John Doe", // Duplicated for quick access
  customer_email: "john@example.com", // Duplicated
  items: [...],
  total: 299.99
}

// Customer collection (full data)
{
  _id: ObjectId("cust456"),
  name: "John Doe",
  email: "john@example.com",
  address: {...},
  payment_methods: [...],
  // ... more customer data
}
```

**Benefits:**

- Avoids $lookup operations for common queries
- Improves read performance
- Acceptable data duplication for frequently accessed fields

**Trade-offs:**

- Data duplication
- Need to update multiple places when data changes

## Normalization vs. Denormalization

### Q6: How does normalization in MongoDB differ from relational databases?

**Answer:**

**Relational Database Normalization:**

- Strictly enforced through foreign keys
- Reduces redundancy through multiple tables
- Requires joins for related data
- Optimizes for storage and write consistency

**MongoDB Approach:**

- Flexible - can normalize or denormalize based on use case
- Often denormalized for performance
- No joins until MongoDB 3.2+ ($lookup)
- Optimizes for application performance

**Example Comparison:**

Relational (Normalized):

```sql
-- Users table
id | name | email

-- Posts table
id | user_id | title | content

-- Comments table
id | post_id | user_id | comment
```

MongoDB (Denormalized):

```javascript
{
  _id: ObjectId("..."),
  title: "My Post",
  content: "...",
  author: {
    id: ObjectId("..."),
    name: "John Doe" // Denormalized
  },
  comments: [
    {
      user: { id: ObjectId("..."), name: "Jane" }, // Denormalized
      text: "Great post!",
      date: ISODate("...")
    }
  ]
}
```

### Q7: When should you denormalize data in MongoDB?

**Answer:**

**Denormalize when:**

1. **Read-heavy workloads** - Reading is more frequent than writing
2. **Data is read together** - Related data is always queried together
3. **Acceptable staleness** - Duplicated data doesn't need real-time consistency
4. **Bounded arrays** - Embedded arrays won't grow indefinitely
5. **Performance critical** - Query performance is more important than storage

**Example - Blog Platform:**

```javascript
{
  _id: ObjectId("..."),
  title: "Understanding MongoDB",
  author: {
    id: ObjectId("..."),
    name: "John Doe", // Denormalized - rarely changes
    avatar: "https://..."
  },
  category: {
    id: ObjectId("..."),
    name: "Database", // Denormalized
    slug: "database"
  },
  tags: ["mongodb", "nosql", "database"], // Denormalized
  views: 1543,
  likes: 89
}
```

**Don't denormalize when:**

- Data changes frequently
- Consistency is critical
- Unbounded growth
- Complex update patterns

## One-to-Many Relationships

### Q8: What are the different ways to model one-to-many relationships in MongoDB?

**Answer:**

**1. Embedded Documents (One-to-Few):**

```javascript
// Blog post with comments (few comments expected)
{
  _id: ObjectId("..."),
  title: "My Post",
  comments: [
    { user: "John", text: "Great!" },
    { user: "Jane", text: "Thanks!" }
  ]
}
```

**2. Child Referencing (One-to-Many):**

```javascript
// Parent document with array of child references
{
  _id: ObjectId("post123"),
  title: "My Post",
  comment_ids: [
    ObjectId("comment1"),
    ObjectId("comment2"),
    // ... could be hundreds
  ]
}
```

**3. Parent Referencing (One-to-Squillions):**

```javascript
// Child documents reference parent
// Product
{
  _id: ObjectId("product123"),
  name: "Laptop"
}

// Reviews (could be millions)
{
  _id: ObjectId("review1"),
  product_id: ObjectId("product123"),
  rating: 5,
  text: "Excellent!"
}

{
  _id: ObjectId("review2"),
  product_id: ObjectId("product123"),
  rating: 4,
  text: "Good value"
}
```

**Decision criteria:**

- **One-to-Few** (< 10-100): Embed
- **One-to-Many** (100s): Child referencing
- **One-to-Squillions** (1000s+): Parent referencing

## Many-to-Many Relationships

### Q9: How do you model many-to-many relationships in MongoDB?

**Answer:**

**Approach 1: Array of References (Bidirectional)**

```javascript
// Students collection
{
  _id: ObjectId("student1"),
  name: "John Doe",
  course_ids: [
    ObjectId("course1"),
    ObjectId("course2")
  ]
}

// Courses collection
{
  _id: ObjectId("course1"),
  name: "Database Design",
  student_ids: [
    ObjectId("student1"),
    ObjectId("student2")
  ]
}
```

**Approach 2: Array of References (Unidirectional)**

```javascript
// Store references on the side queried most often
// Users collection
{
  _id: ObjectId("user1"),
  name: "John"
}

// Groups collection (if you mostly query "what groups does user belong to?")
{
  _id: ObjectId("group1"),
  name: "Developers",
  member_ids: [ObjectId("user1"), ObjectId("user2")]
}
```

**Approach 3: Separate Junction Collection (with metadata)**

```javascript
// Students collection
{
  _id: ObjectId("student1"),
  name: "John Doe"
}

// Courses collection
{
  _id: ObjectId("course1"),
  name: "Database Design"
}

// Enrollments collection (junction with metadata)
{
  _id: ObjectId("..."),
  student_id: ObjectId("student1"),
  course_id: ObjectId("course1"),
  enrolled_date: ISODate("2024-01-15"),
  grade: "A",
  status: "active"
}
```

**Choose based on:**

- Query patterns
- Need for metadata
- Update frequency
- Array size limits

### Q10: What is the "computed pattern" in MongoDB schema design?

**Answer:**
The computed pattern pre-calculates and stores computed values to avoid expensive operations at query time.

**Example - Movie Ratings:**

```javascript
{
  _id: ObjectId("movie123"),
  title: "The Great Film",

  // Computed fields (updated when new rating added)
  rating_summary: {
    average: 4.5,
    total_ratings: 1543,
    five_star: 823,
    four_star: 456,
    three_star: 189,
    two_star: 54,
    one_star: 21
  },

  // Individual ratings stored separately
  last_updated: ISODate("2024-01-15T10:30:00Z")
}
```

**Benefits:**

- Faster queries (no aggregation needed)
- Reduced CPU usage
- Better user experience

**Trade-offs:**

- More complex update logic
- Potential for stale data
- Additional storage

## Schema Design Patterns

### Q11: What is the "attribute pattern" and when should you use it?

**Answer:**
The attribute pattern is used when documents have many similar fields but you only query on a subset, or when fields vary across documents.

**Problem - Product Specifications:**

```javascript
// Without attribute pattern - sparse indexes, many fields
{
  _id: ObjectId("..."),
  name: "Laptop",
  screen_size: 15.6,
  ram: 16,
  storage: 512,
  color: "silver"
  // Different products have different attributes
}
```

**Solution - Attribute Pattern:**

```javascript
{
  _id: ObjectId("..."),
  name: "Laptop",
  specs: [
    { k: "screen_size", v: 15.6, unit: "inches" },
    { k: "ram", v: 16, unit: "GB" },
    { k: "storage", v: 512, unit: "GB" },
    { k: "color", v: "silver" }
  ]
}

// Create index on specs.k and specs.v for efficient queries
db.products.createIndex({ "specs.k": 1, "specs.v": 1 })
```

**Benefits:**

- Easier to query across different attributes
- Fewer indexes needed
- Handles sparse or varying attributes well
- Better for product catalogs, metadata

### Q12: Explain the "schema versioning pattern" in MongoDB.

**Answer:**
The schema versioning pattern helps manage schema evolution in a running application.

**Implementation:**

```javascript
// Version 1
{
  _id: ObjectId("..."),
  schema_version: 1,
  name: "John Doe",
  address: "123 Main St, Boston, MA"
}

// Version 2 - Address broken down
{
  _id: ObjectId("..."),
  schema_version: 2,
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "Boston",
    state: "MA",
    zip: "02101"
  }
}

// Application code handles both versions
function getAddress(user) {
  if (user.schema_version === 1) {
    // Parse old format
    return parseOldAddress(user.address);
  } else {
    // Use new format
    return user.address;
  }
}

// Background migration
db.users.find({ schema_version: 1 }).forEach(user => {
  const newAddress = parseOldAddress(user.address);
  db.users.updateOne(
    { _id: user._id },
    {
      $set: {
        schema_version: 2,
        address: newAddress
      }
    }
  );
});
```

**Benefits:**

- Zero downtime migrations
- Gradual rollout
- Rollback capability
- Version-specific logic

## Indexes and Performance

### Q13: How should schema design consider indexing strategy?

**Answer:**

**Design principles:**

1. **Query-driven indexes:**

```javascript
// If you frequently query users by email and status
{
  _id: ObjectId("..."),
  email: "user@example.com",
  status: "active",
  created_at: ISODate("...")
}

// Create compound index
db.users.createIndex({ status: 1, email: 1 })
```

2. **Embedded vs. Referenced - Index implications:**

```javascript
// Embedded - Single query, single index
{
  _id: ObjectId("..."),
  order_number: "ORD-123",
  customer: {
    name: "John",
    email: "john@example.com"
  }
}
db.orders.createIndex({ "customer.email": 1 })

// Referenced - Multiple queries, multiple indexes
// Orders
{ _id: ObjectId("..."), customer_id: ObjectId("...") }
db.orders.createIndex({ customer_id: 1 })

// Customers
{ _id: ObjectId("..."), email: "john@example.com" }
db.customers.createIndex({ email: 1 })
```

3. **Array indexing considerations:**

```javascript
{
  _id: ObjectId("..."),
  title: "Post",
  tags: ["mongodb", "database", "nosql"]
}

// Multi-key index on array
db.posts.createIndex({ tags: 1 })

// Careful with compound indexes on arrays
// Only ONE array field per compound index
```

4. **Index size vs. document size:**

- Smaller indexed fields = more efficient
- Consider substring indexing for large strings
- Use hash indexes for equality queries on large fields

### Q14: How do you design schemas for optimal write performance?

**Answer:**

**Strategies:**

1. **Minimize index count:**

```javascript
// Bad - Too many indexes
db.users.createIndex({ email: 1 });
db.users.createIndex({ username: 1 });
db.users.createIndex({ created_at: 1 });
db.users.createIndex({ status: 1 });
db.users.createIndex({ last_login: 1 });

// Better - Compound indexes for common queries
db.users.createIndex({ status: 1, created_at: 1 });
db.users.createIndex({ email: 1 }); // Unique constraint
```

2. **Use embedded documents to reduce writes:**

```javascript
// Multiple writes needed
// Update order status
db.orders.updateOne({ _id: orderId }, { $set: { status: "shipped" } })
// Add tracking info
db.tracking.insertOne({ order_id: orderId, ... })

// Single atomic write
db.orders.updateOne(
  { _id: orderId },
  {
    $set: {
      status: "shipped",
      tracking: {
        carrier: "FedEx",
        number: "123456"
      }
    }
  }
)
```

3. **Avoid document growth:**

```javascript
// Bad - Unbounded array growth
{
  _id: ObjectId("..."),
  logs: [
    { timestamp: ISODate("..."), message: "..." },
    // ... thousands of logs
  ]
}

// Good - Use parent referencing or bucketing
{
  _id: ObjectId("..."),
  entity_id: ObjectId("..."),
  date: ISODate("2024-01-01"),
  logs: [
    // Only logs for this day (bounded)
  ]
}
```

4. **Use $inc for counters instead of read-modify-write:**

```javascript
// Efficient atomic increment
db.posts.updateOne({ _id: postId }, { $inc: { views: 1 } });
```

## Data Modeling for Specific Use Cases

### Q15: How would you design a schema for a social media application?

**Answer:**

**Users Collection:**

```javascript
{
  _id: ObjectId("user123"),
  username: "johndoe",
  email: "john@example.com",
  profile: {
    full_name: "John Doe",
    avatar: "https://...",
    bio: "Software Developer",
    location: "Boston, MA"
  },
  stats: { // Computed pattern
    followers_count: 1543,
    following_count: 432,
    posts_count: 234
  },
  settings: {
    privacy: "public",
    notifications: true
  },
  created_at: ISODate("2023-01-15"),
  last_active: ISODate("2024-01-20")
}

// Indexes
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

**Posts Collection:**

```javascript
{
  _id: ObjectId("post456"),
  author: { // Extended reference pattern
    id: ObjectId("user123"),
    username: "johndoe",
    avatar: "https://..."
  },
  content: "Great day for coding!",
  media: [
    { type: "image", url: "https://..." }
  ],
  stats: { // Computed pattern
    likes_count: 89,
    comments_count: 12,
    shares_count: 5
  },
  hashtags: ["coding", "developer"],
  created_at: ISODate("2024-01-20T10:30:00Z"),
  updated_at: ISODate("2024-01-20T10:30:00Z")
}

// Indexes
db.posts.createIndex({ "author.id": 1, created_at: -1 })
db.posts.createIndex({ hashtags: 1, created_at: -1 })
db.posts.createIndex({ created_at: -1 })
```

**Follows Collection (Many-to-Many):**

```javascript
{
  _id: ObjectId("..."),
  follower_id: ObjectId("user123"),
  following_id: ObjectId("user456"),
  created_at: ISODate("2024-01-15")
}

// Indexes for both directions
db.follows.createIndex({ follower_id: 1, created_at: -1 })
db.follows.createIndex({ following_id: 1, created_at: -1 })
db.follows.createIndex({ follower_id: 1, following_id: 1 }, { unique: true })
```

**Comments Collection (Parent referencing):**

```javascript
{
  _id: ObjectId("..."),
  post_id: ObjectId("post456"),
  author: {
    id: ObjectId("user789"),
    username: "janedoe",
    avatar: "https://..."
  },
  content: "Great post!",
  likes_count: 5,
  created_at: ISODate("2024-01-20T11:00:00Z")
}

// Index
db.comments.createIndex({ post_id: 1, created_at: -1 })
```

### Q16: How would you design a schema for an e-commerce application?

**Answer:**

**Products Collection:**

```javascript
{
  _id: ObjectId("product123"),
  sku: "LAPTOP-001",
  name: "Professional Laptop",
  description: "High-performance laptop...",
  category: {
    id: ObjectId("..."),
    name: "Electronics",
    path: ["Electronics", "Computers", "Laptops"]
  },
  price: {
    amount: 999.99,
    currency: "USD",
    discount: {
      percentage: 10,
      valid_until: ISODate("2024-02-01")
    }
  },
  inventory: {
    quantity: 50,
    warehouse: "WH-001",
    reserved: 5
  },
  specs: [ // Attribute pattern
    { k: "ram", v: 16, unit: "GB" },
    { k: "storage", v: 512, unit: "GB" }
  ],
  images: [
    { url: "https://...", alt: "Front view", order: 1 }
  ],
  rating_summary: { // Computed pattern
    average: 4.5,
    count: 234
  },
  created_at: ISODate("2023-06-15"),
  updated_at: ISODate("2024-01-20")
}

// Indexes
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ "category.path": 1 })
db.products.createIndex({ "rating_summary.average": -1 })
```

**Orders Collection:**

```javascript
{
  _id: ObjectId("order789"),
  order_number: "ORD-2024-001",
  customer: { // Extended reference
    id: ObjectId("user123"),
    name: "John Doe",
    email: "john@example.com"
  },
  items: [ // Embedded - snapshot at order time
    {
      product_id: ObjectId("product123"),
      sku: "LAPTOP-001",
      name: "Professional Laptop",
      price: 999.99,
      quantity: 1,
      subtotal: 999.99
    }
  ],
  shipping_address: {
    street: "123 Main St",
    city: "Boston",
    state: "MA",
    zip: "02101",
    country: "USA"
  },
  billing_address: { /* ... */ },
  payment: {
    method: "credit_card",
    last4: "4242",
    transaction_id: "txn_123",
    amount: 999.99,
    currency: "USD"
  },
  totals: {
    subtotal: 999.99,
    tax: 70.00,
    shipping: 10.00,
    discount: 0,
    total: 1079.99
  },
  status: "processing",
  status_history: [
    { status: "pending", timestamp: ISODate("2024-01-20T10:00:00Z") },
    { status: "processing", timestamp: ISODate("2024-01-20T10:05:00Z") }
  ],
  created_at: ISODate("2024-01-20T10:00:00Z"),
  updated_at: ISODate("2024-01-20T10:05:00Z")
}

// Indexes
db.orders.createIndex({ order_number: 1 }, { unique: true })
db.orders.createIndex({ "customer.id": 1, created_at: -1 })
db.orders.createIndex({ status: 1, created_at: -1 })
```

**Shopping Carts Collection:**

```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("user123"),
  items: [
    {
      product_id: ObjectId("product123"),
      quantity: 1,
      added_at: ISODate("2024-01-20")
    }
  ],
  updated_at: ISODate("2024-01-20"),
  expires_at: ISODate("2024-01-27") // TTL index
}

// TTL index to auto-delete old carts
db.carts.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 })
db.carts.createIndex({ user_id: 1 }, { unique: true })
```

## Anti-Patterns

### Q17: What are common MongoDB schema design anti-patterns?

**Answer:**

**1. Massive Arrays:**

```javascript
// Bad - Unbounded array growth
{
  _id: ObjectId("user123"),
  name: "John",
  activities: [
    // Could grow to millions of items
  ]
}

// Good - Use parent referencing
// Activities collection
{
  _id: ObjectId("..."),
  user_id: ObjectId("user123"),
  activity: "logged_in",
  timestamp: ISODate("...")
}
```

**2. Massive Documents:**

```javascript
// Bad - Approaching 16MB limit
{
  _id: ObjectId("..."),
  data: "very large text field...", // MBs of data
  embedded_files: [ /* large files */ ]
}

// Good - Use GridFS or external storage
{
  _id: ObjectId("..."),
  file_id: "gridfs_id",
  metadata: { /* small metadata */ }
}
```

**3. Unnecessary Normalization:**

```javascript
// Bad - Too normalized for MongoDB
// Users
{ _id: ObjectId("user1"), name: "John" }
// UserProfiles
{ _id: ObjectId("..."), user_id: ObjectId("user1"), bio: "..." }
// UserSettings
{ _id: ObjectId("..."), user_id: ObjectId("user1"), theme: "dark" }

// Good - Embed related data
{
  _id: ObjectId("user1"),
  name: "John",
  profile: { bio: "..." },
  settings: { theme: "dark" }
}
```

**4. One Collection Per Everything:**

```javascript
// Bad - Mixing unrelated documents in one collection
db.data.insert({ type: "user", name: "John" });
db.data.insert({ type: "product", title: "Laptop" });
db.data.insert({ type: "order", number: "ORD-001" });

// Good - Separate collections
db.users.insert({ name: "John" });
db.products.insert({ title: "Laptop" });
db.orders.insert({ number: "ORD-001" });
```

**5. Not Using \_id Effectively:**

```javascript
// Bad - Custom IDs when ObjectId would work
{
  _id: "user_john_doe_123",
  name: "John Doe"
}

// Good - Let MongoDB generate ObjectId
{
  _id: ObjectId("..."), // Contains timestamp
  username: "johndoe", // Separate indexed field
  name: "John Doe"
}
```

**6. Storing Time Series Data Poorly:**

```javascript
// Bad - One document per event
{
  _id: ObjectId("..."),
  sensor: "temp_1",
  value: 22.5,
  timestamp: ISODate("...")
}

// Good - Use bucket pattern
{
  _id: ObjectId("..."),
  sensor: "temp_1",
  hour: ISODate("2024-01-20T10:00:00Z"),
  readings: [
    { minute: 0, value: 22.5 },
    { minute: 1, value: 22.6 },
    // ...
  ]
}
```

### Q18: What are the key considerations for schema migration in MongoDB?

**Answer:**

**Strategies:**

1. **Schema Versioning:**

```javascript
{
  _id: ObjectId("..."),
  schema_version: 2,
  // ... document fields
}
```

2. **Gradual Migration:**

```javascript
// Application handles both old and new schemas
function getUser(id) {
  const user = db.users.findOne({ _id: id });

  if (user.schema_version === 1) {
    // Migrate on read
    const migratedUser = migrateToV2(user);
    db.users.updateOne({ _id: id }, { $set: migratedUser });
    return migratedUser;
  }

  return user;
}
```

3. **Background Migration:**

```javascript
// Batch migration script
const batchSize = 100;
let processedCount = 0;

db.users
  .find({ schema_version: 1 })
  .batchSize(batchSize)
  .forEach((user) => {
    const migratedUser = migrateToV2(user);
    db.users.updateOne({ _id: user._id }, { $set: migratedUser });
    processedCount++;

    if (processedCount % 1000 === 0) {
      print(`Migrated ${processedCount} documents`);
    }
  });
```

4. **Dual Write:**

```javascript
// During transition, write to both old and new format
function updateUser(id, data) {
  db.users.updateOne(
    { _id: id },
    {
      $set: {
        // Old format
        address_line1: data.street,
        city: data.city,
        // New format
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
        },
        schema_version: 2,
      },
    }
  );
}
```

**Best practices:**

- Test migrations thoroughly
- Monitor performance during migration
- Have rollback plan
- Maintain backward compatibility during transition
- Use feature flags to control migration rollout

## Performance Optimization

### Q19: How do you design schemas for optimal read performance?

**Answer:**

**Strategies:**

1. **Denormalize for Common Queries:**

```javascript
// Instead of joining
{
  _id: ObjectId("post123"),
  title: "My Post",
  author_id: ObjectId("user456")
}

// Embed frequently accessed data
{
  _id: ObjectId("post123"),
  title: "My Post",
  author: {
    id: ObjectId("user456"),
    name: "John Doe",
    avatar: "https://..."
  }
}
```

2. **Use Covered Queries:**

```javascript
// Query that can be satisfied entirely from index
db.users.createIndex({ email: 1, name: 1, status: 1 });

db.users.find(
  { email: "john@example.com" },
  { _id: 0, email: 1, name: 1, status: 1 } // Projection
);
```

3. **Optimize Array Queries:**

```javascript
// Store commonly queried values separately
{
  _id: ObjectId("..."),
  title: "Post",
  tag_list: ["mongodb", "database"], // For queries
  tags: [ // Full tag objects
    { name: "mongodb", slug: "mongodb", count: 1543 }
  ]
}

db.posts.createIndex({ tag_list: 1 })
```

4. **Pre-compute Aggregations:**

```javascript
{
  _id: ObjectId("product123"),
  name: "Laptop",
  reviews_summary: {
    count: 234,
    average: 4.5,
    breakdown: {
      5: 150,
      4: 60,
      3: 20,
      2: 3,
      1: 1
    }
  }
}
```

### Q20: How do you handle document size limitations in schema design?

**Answer:**

**Approaches:**

1. **GridFS for Large Files:**

```javascript
// Instead of storing large files in document
{
  _id: ObjectId("..."),
  title: "Video Tutorial",
  video: GridFSFile("gridfs_file_id"), // Reference
  metadata: {
    duration: 3600,
    format: "mp4"
  }
}
```

2. **External Storage References:**

```javascript
{
  _id: ObjectId("..."),
  title: "Document",
  file_url: "s3://bucket/path/to/file",
  file_metadata: {
    size: 104857600, // 100MB
    type: "application/pdf"
  }
}
```

3. **Split Large Arrays:**

```javascript
// Main document
{
  _id: ObjectId("user123"),
  name: "John",
  recent_activities: [ /* last 10 */ ],
  total_activities: 10543
}

// Activities collection
{
  _id: ObjectId("..."),
  user_id: ObjectId("user123"),
  activity: "...",
  timestamp: ISODate("...")
}
```

4. **Use References for Large Embedded Docs:**

```javascript
// Instead of huge embedded document
{
  _id: ObjectId("order123"),
  customer_full_profile: { /* huge object */ }
}

// Reference
{
  _id: ObjectId("order123"),
  customer_id: ObjectId("user456"),
  customer_snapshot: { // Only essential fields
    name: "John",
    email: "john@example.com"
  }
}
```

---

## Additional Resources

- [MongoDB Schema Design Best Practices](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- [MongoDB Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)
- [MongoDB University - Data Modeling Course](https://learn.mongodb.com/)
