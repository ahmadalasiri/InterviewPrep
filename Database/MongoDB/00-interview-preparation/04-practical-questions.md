# MongoDB Practical Interview Questions

## Table of Contents

- [Real-World Scenarios](#real-world-scenarios)
- [Schema Design Problems](#schema-design-problems)
- [Performance Optimization](#performance-optimization)
- [System Design with MongoDB](#system-design-with-mongodb)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)

---

## Real-World Scenarios

### Q1: Design a schema for a blog application with users, posts, and comments

**Answer:**

**Requirements:**

- Users can create multiple posts
- Posts can have multiple comments
- Comments belong to a user
- Need to show post with comments efficiently
- Need to show user's all posts

**Schema Design:**

```javascript
// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: String,
  bio: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Post Schema (with embedded comments)
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Embed comments (if limited number expected)
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
```

**Alternative: Separate Comments Collection (if many comments expected):**

```javascript
const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // For nested comments
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

const Comment = mongoose.model("Comment", commentSchema);
```

**Common Queries:**

```javascript
// Get post with author and comments
const post = await Post.findById(postId)
  .populate("author", "username avatar")
  .populate("comments.user", "username avatar");

// Get user's posts
const userPosts = await Post.find({ author: userId })
  .sort({ createdAt: -1 })
  .select("title createdAt likes")
  .limit(10);

// Get latest posts by tag
const posts = await Post.find({
  tags: "javascript",
  status: "published",
})
  .populate("author", "username")
  .sort({ createdAt: -1 })
  .limit(20);

// Add comment to post
await Post.findByIdAndUpdate(postId, {
  $push: {
    comments: {
      user: userId,
      text: commentText,
    },
  },
});

// Increment views
await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });
```

---

### Q2: Design a schema for an e-commerce application

**Answer:**

```javascript
// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: Number, // Original price for discount display
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    variants: [
      {
        name: String, // e.g., "Size: Large, Color: Red"
        sku: String,
        price: Number,
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    tags: [String],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text" });

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variant: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: String,
    paymentId: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Calculate total before saving
orderSchema.pre("save", function (next) {
  this.total = this.subtotal + this.shippingCost + this.tax;
  next();
});

// Shopping Cart Schema (separate from Order)
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      variant: String,
      quantity: {
        type: Number,
        min: 1,
        default: 1,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: String,
    comment: String,
    verified: {
      type: Boolean,
      default: false, // Set true if user purchased the product
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product rating after review
reviewSchema.post("save", async function () {
  const Review = mongoose.model("Review");
  const Product = mongoose.model("Product");

  const stats = await Review.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      "ratings.average": stats[0].avgRating,
      "ratings.count": stats[0].count,
    });
  }
});
```

---

## Schema Design Problems

### Q3: When should you embed documents vs reference them?

**Answer:**

**Embed When:**

1. **One-to-Few Relationship:**

```javascript
// User with few addresses
const userSchema = new mongoose.Schema({
  name: String,
  addresses: [
    {
      // Embed (limited number)
      street: String,
      city: String,
    },
  ],
});
```

2. **Data Always Accessed Together:**

```javascript
// Post with metadata
const postSchema = new mongoose.Schema({
  title: String,
  metadata: {
    // Embed (always needed with post)
    views: Number,
    likes: Number,
    shares: Number,
  },
});
```

3. **Data Doesn't Change Often:**

```javascript
// Order with product snapshot
const orderSchema = new mongoose.Schema({
  items: [
    {
      productSnapshot: {
        // Embed (preserve price/details at time of order)
        name: String,
        price: Number,
        image: String,
      },
      quantity: Number,
    },
  ],
});
```

**Reference When:**

1. **One-to-Many with Large "Many":**

```javascript
// User with many posts
const userSchema = new mongoose.Schema({
  name: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  author: {
    // Reference (user can have thousands of posts)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
```

2. **Data Accessed Independently:**

```javascript
// Products and Categories
const productSchema = new mongoose.Schema({
  name: String,
  category: {
    // Reference (category used in many contexts)
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});
```

3. **Data Changes Frequently:**

```javascript
// User profile that updates often
const postSchema = new mongoose.Schema({
  title: String,
  author: {
    // Reference (if embedded, would need to update everywhere)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
```

**Hybrid Approach:**

```javascript
// Store reference + frequently accessed data
const postSchema = new mongoose.Schema({
  title: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String, // Denormalized for quick access
    avatar: String,
  },
});

// Update denormalized data when user changes
userSchema.post("findOneAndUpdate", async function (doc) {
  await mongoose.model("Post").updateMany(
    { "author.id": doc._id },
    {
      $set: {
        "author.username": doc.username,
        "author.avatar": doc.avatar,
      },
    }
  );
});
```

---

## Performance Optimization

### Q4: How do you optimize this slow query?

**Problem:**

```javascript
// Slow query taking 5000ms
const users = await User.find({
  age: { $gte: 18 },
  city: "NYC",
  isActive: true,
})
  .sort({ createdAt: -1 })
  .limit(20);
```

**Answer:**

**Step 1: Analyze with explain():**

```javascript
const result = await User.find({
  age: { $gte: 18 },
  city: "NYC",
  isActive: true,
})
  .sort({ createdAt: -1 })
  .limit(20)
  .explain("executionStats");

console.log(result.executionStats);
// totalDocsExamined: 1000000
// executionTimeMillis: 5000
// No index used - COLLSCAN
```

**Step 2: Create Appropriate Index:**

```javascript
// ESR Rule: Equality, Sort, Range
User.createIndex({
  city: 1, // Equality
  isActive: 1, // Equality
  createdAt: -1, // Sort
  age: 1, // Range
});
```

**Step 3: Verify Improvement:**

```javascript
const result = await User.find({
  age: { $gte: 18 },
  city: "NYC",
  isActive: true,
})
  .sort({ createdAt: -1 })
  .limit(20)
  .explain("executionStats");

// totalDocsExamined: 20
// executionTimeMillis: 5ms
// Uses: city_1_isActive_1_createdAt_-1_age_1 index
```

**Step 4: Add Projection:**

```javascript
// Only select needed fields
const users = await User.find(
  {
    age: { $gte: 18 },
    city: "NYC",
    isActive: true,
  },
  {
    name: 1,
    email: 1,
    avatar: 1,
  }
)
  .sort({ createdAt: -1 })
  .limit(20)
  .lean(); // Return plain JavaScript object (faster)
```

**Additional Optimizations:**

```javascript
// 1. Use covered query (all fields in index)
User.createIndex({
  city: 1,
  isActive: 1,
  createdAt: -1,
  name: 1,
  email: 1,
});

// Query only indexed fields
const users = await User.find(
  {
    city: "NYC",
    isActive: true,
  },
  {
    _id: 0, // Exclude _id
    name: 1,
    email: 1,
    createdAt: 1,
  }
)
  .sort({ createdAt: -1 })
  .limit(20);
// totalDocsExamined: 0 (covered query - fastest!)

// 2. Use pagination with skip efficiently
// Bad: Large skip values scan all skipped documents
const page = await User.find().skip(10000).limit(20);

// Good: Use range query instead
const lastId = previousPageLastDocument._id;
const page = await User.find({
  _id: { $gt: lastId },
}).limit(20);
```

---

### Q5: Optimize an aggregation pipeline that's timing out

**Problem:**

```javascript
// Aggregation timing out (>60s)
const stats = await Order.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "items.product",
      foreignField: "_id",
      as: "productDetails",
    },
  },
  {
    $match: {
      status: "completed",
      createdAt: { $gte: startDate },
    },
  },
  {
    $group: {
      _id: "$user",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 },
    },
  },
  {
    $sort: { totalSpent: -1 },
  },
]);
```

**Answer:**

**Optimization Steps:**

```javascript
// 1. Move $match to beginning (filter early)
// 2. Add indexes
// 3. Limit data in $lookup
// 4. Use $project to reduce document size

Order.createIndex({ status: 1, createdAt: -1 });
Order.createIndex({ user: 1 });

const stats = await Order.aggregate([
  // STEP 1: Filter first (most important!)
  {
    $match: {
      status: "completed",
      createdAt: { $gte: startDate },
    },
  },

  // STEP 2: Project only needed fields
  {
    $project: {
      user: 1,
      total: 1,
      items: 1,
    },
  },

  // STEP 3: Lookup with pipeline (more control)
  {
    $lookup: {
      from: "products",
      let: { productIds: "$items.product" },
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$productIds"] },
          },
        },
        {
          $project: { name: 1, category: 1 }, // Only needed fields
        },
      ],
      as: "productDetails",
    },
  },

  // STEP 4: Group
  {
    $group: {
      _id: "$user",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 },
    },
  },

  // STEP 5: Sort (use index if possible)
  {
    $sort: { totalSpent: -1 },
  },

  // STEP 6: Limit results if showing top users
  {
    $limit: 100,
  },
]);
```

**Alternative: Pre-aggregate Data:**

```javascript
// Instead of real-time aggregation, maintain summary collection
const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
  lastOrderDate: Date,
});

// Update stats when order is completed
orderSchema.post("save", async function () {
  if (this.status === "completed") {
    await UserStats.findOneAndUpdate(
      { user: this.user },
      {
        $inc: {
          totalSpent: this.total,
          orderCount: 1,
        },
        $set: {
          lastOrderDate: this.createdAt,
        },
      },
      { upsert: true }
    );
  }
});

// Now query is instant
const topSpenders = await UserStats.find()
  .sort({ totalSpent: -1 })
  .limit(100)
  .populate("user", "name email");
```

---

## System Design with MongoDB

### Q6: Design a notification system with MongoDB

**Answer:**

```javascript
// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow", "mention", "system"],
    required: true,
  },
  actor: {
    // Who triggered the notification
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  target: {
    // What was acted upon
    kind: String, // 'Post', 'Comment', etc.
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "target.kind",
    },
  },
  message: String,
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// TTL index to auto-delete old notifications
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
);

// Static method to create notification
notificationSchema.statics.notify = async function (data) {
  const notification = await this.create(data);

  // Emit real-time event (Socket.io, etc.)
  eventEmitter.emit("notification", {
    recipient: data.recipient,
    notification,
  });

  return notification;
};

// Common queries
class NotificationService {
  // Get user's unread notifications
  static async getUnread(userId, limit = 20) {
    return await Notification.find({
      recipient: userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("actor", "username avatar")
      .lean();
  }

  // Mark notifications as read
  static async markAsRead(userId, notificationIds) {
    return await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: userId,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );
  }

  // Get unread count
  static async getUnreadCount(userId) {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }

  // Group similar notifications
  static async getGrouped(userId, limit = 20) {
    return await Notification.aggregate([
      {
        $match: {
          recipient: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            type: "$type",
            target: "$target.item",
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
          count: { $sum: 1 },
          actors: { $push: "$actor" },
          latestNotification: { $first: "$$ROOT" },
          isRead: { $min: "$isRead" },
        },
      },
      {
        $limit: limit,
      },
    ]);
  }
}

// Usage:
// Create notification when user likes a post
await Notification.notify({
  recipient: post.author,
  type: "like",
  actor: currentUser._id,
  target: {
    kind: "Post",
    item: post._id,
  },
  message: `${currentUser.username} liked your post`,
});
```

---

## Debugging and Troubleshooting

### Q7: How do you debug and fix a memory leak in a MongoDB application?

**Answer:**

**Common Causes:**

1. **Cursor Not Closed:**

```javascript
// Bad: Cursor not closed
async function badQuery() {
  const cursor = User.find().cursor();
  // Process documents but never close cursor
}

// Good: Close cursor or use for-await
async function goodQuery() {
  const cursor = User.find().cursor();
  try {
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      await processDoc(doc);
    }
  } finally {
    await cursor.close();
  }
}

// Best: Use for-await-of (auto-closes)
async function bestQuery() {
  for await (const doc of User.find().cursor()) {
    await processDoc(doc);
  }
}
```

2. **Loading Too Much Data:**

```javascript
// Bad: Load all documents into memory
const users = await User.find(); // 1M documents!

// Good: Use pagination or streaming
const limit = 100;
let skip = 0;
let hasMore = true;

while (hasMore) {
  const users = await User.find().skip(skip).limit(limit).lean();

  await processUsers(users);

  hasMore = users.length === limit;
  skip += limit;
}
```

3. **Event Listeners Not Removed:**

```javascript
// Bad: Adding listeners in loop
for (let i = 0; i < 1000; i++) {
  mongoose.connection.on("connected", handler);
}

// Good: Add once
mongoose.connection.once("connected", handler);
```

4. **Connection Pool Exhaustion:**

```javascript
// Monitor connections
mongoose.connection.on("connected", () => {
  const { connections } = mongoose.connection;
  console.log(`Active connections: ${connections.length}`);
});

// Configure pool size
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
});
```

**Debugging Tools:**

```javascript
// 1. Enable query logging
mongoose.set("debug", true);

// 2. Monitor memory usage
const used = process.memoryUsage();
console.log({
  rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
});

// 3. Use profiling
mongoose.set("debug", function (collectionName, methodName, ...args) {
  console.log(`${collectionName}.${methodName}`, JSON.stringify(args));
});

// 4. Check for slow queries
db.setProfilingLevel(2); // Profile all queries
db.system.profile.find().sort({ ts: -1 }).limit(10);
```

---

This covers practical MongoDB interview scenarios. Practice building real applications to master these concepts!
