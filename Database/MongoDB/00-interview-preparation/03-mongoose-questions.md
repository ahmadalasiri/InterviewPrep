# Mongoose Interview Questions

## Table of Contents

- [Mongoose Basics](#mongoose-basics)
- [Schemas and Models](#schemas-and-models)
- [Validation](#validation)
- [Middleware and Hooks](#middleware-and-hooks)
- [Queries and Population](#queries-and-population)
- [Virtuals and Methods](#virtuals-and-methods)

---

## Mongoose Basics

### Q1: What is Mongoose and why use it?

**Answer:**
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that provides schema-based data modeling.

**Key Features:**

- Schema definition and validation
- Type casting
- Query building
- Middleware/hooks support
- Business logic methods
- Default values
- Virtuals and computed properties

**Why Use Mongoose:**

**Pros:**

- Structure and validation for MongoDB
- Cleaner, more maintainable code
- Built-in data validation
- Middleware for business logic
- Better TypeScript support
- Query helpers and population

**Cons:**

- Additional abstraction layer
- Slightly slower than native driver
- Learning curve
- Bundle size overhead

**Basic Setup:**

```javascript
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection events
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
```

---

### Q2: What is the difference between Mongoose and MongoDB native driver?

**Answer:**

| Feature        | Mongoose          | MongoDB Native Driver |
| -------------- | ----------------- | --------------------- |
| Schema         | Required          | No schema             |
| Validation     | Built-in          | Manual                |
| Middleware     | Yes               | No                    |
| Query Building | Chainable methods | Object-based          |
| Type Casting   | Automatic         | Manual                |
| Virtuals       | Yes               | No                    |
| Population     | Yes               | Manual lookup         |
| Bundle Size    | Larger (~300KB)   | Smaller (~100KB)      |
| Learning Curve | Moderate          | Lower                 |

**MongoDB Native Driver:**

```javascript
const { MongoClient } = require("mongodb");

const client = new MongoClient(url);
await client.connect();
const db = client.db("myapp");

// Insert
await db.collection("users").insertOne({
  name: "John",
  email: "john@example.com",
});

// Find
const users = await db.collection("users").find().toArray();
```

**Mongoose:**

```javascript
const mongoose = require("mongoose");

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

// Insert
await User.create({
  name: "John",
  email: "john@example.com",
});

// Find
const users = await User.find();
```

---

## Schemas and Models

### Q3: What is a Mongoose schema and model?

**Answer:**
A **schema** defines the structure, types, and validation rules for documents. A **model** is a compiled version of the schema that provides an interface to the database.

**Schema - Blueprint:**

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Field definitions
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Model - Compiled from schema
const User = mongoose.model("User", userSchema);

module.exports = User;
```

**Schema Types:**

```javascript
{
  // Primitive types
  name: String,
  age: Number,
  isActive: Boolean,
  birthDate: Date,
  bio: Buffer,
  _id: mongoose.Schema.Types.ObjectId,

  // Complex types
  tags: [String],  // Array of strings
  address: {       // Embedded document
    street: String,
    city: String,
    zip: String
  },

  // References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Mixed type (any structure)
  metadata: mongoose.Schema.Types.Mixed,

  // Decimal for precision
  price: mongoose.Schema.Types.Decimal128
}
```

---

### Q4: How do you define relationships in Mongoose?

**Answer:**
Mongoose supports two main relationship patterns: referenced (normalized) and embedded (denormalized).

**1. One-to-One (Embedded):**

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  profile: {
    bio: String,
    website: String,
    avatar: String,
  },
});
```

**2. One-to-One (Referenced):**

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
});

const profileSchema = new mongoose.Schema({
  bio: String,
  website: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
```

**3. One-to-Many (Embedded):**

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  addresses: [
    {
      street: String,
      city: String,
      zip: String,
    },
  ],
});
```

**4. One-to-Many (Referenced - Child Referencing):**

```javascript
const userSchema = new mongoose.Schema({
  name: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
```

**5. One-to-Many (Referenced - Parent Referencing):**

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
```

**6. Many-to-Many:**

```javascript
const studentSchema = new mongoose.Schema({
  name: String,
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const courseSchema = new mongoose.Schema({
  title: String,
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});
```

**When to Embed vs Reference:**

**Embed When:**

- One-to-few relationship
- Data is always accessed together
- Data doesn't change often
- Bounded array size

**Reference When:**

- One-to-many with many being large
- Data accessed independently
- Data changes frequently
- Need to maintain referential integrity

---

## Validation

### Q5: How does validation work in Mongoose?

**Answer:**
Mongoose provides built-in validators and supports custom validation.

**Built-in Validators:**

```javascript
const productSchema = new mongoose.Schema({
  // Required
  name: {
    type: String,
    required: true, // or [true, 'Custom error message']
  },

  // String validators
  email: {
    type: String,
    minlength: 5,
    maxlength: 100,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"],
  },

  // Number validators
  price: {
    type: Number,
    min: 0,
    max: 10000,
  },

  // Enum validator
  status: {
    type: String,
    enum: {
      values: ["pending", "active", "inactive"],
      message: "{VALUE} is not supported",
    },
  },

  // Array validators
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "At least one tag is required",
    },
  },
});
```

**Custom Validators:**

```javascript
const userSchema = new mongoose.Schema({
  age: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 18;
      },
      message: "Age must be at least 18",
    },
  },

  password: {
    type: String,
    validate: {
      validator: function (value) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
      },
      message:
        "Password must be at least 8 characters with uppercase, lowercase, and number",
    },
  },

  // Async validator
  username: {
    type: String,
    validate: {
      validator: async function (value) {
        const user = await mongoose.model("User").findOne({ username: value });
        return !user;
      },
      message: "Username already exists",
    },
  },
});
```

**Validation Timing:**

```javascript
// Validate before save
const user = new User({ name: "John" });
await user.validate(); // Throws validation error

// Save with validation
await user.save(); // Validates automatically

// Update with validation
await User.findByIdAndUpdate(
  id,
  { age: 15 },
  {
    runValidators: true, // Enable validation on update
    new: true,
  }
);

// Skip validation
user.save({ validateBeforeSave: false });
```

---

## Middleware and Hooks

### Q6: What are Mongoose middleware (hooks)?

**Answer:**
Middleware are functions that run at specific stages of document lifecycle. They allow you to add custom logic before or after operations.

**Types of Middleware:**

1. **Document Middleware** - Runs on document methods
2. **Query Middleware** - Runs on query methods
3. **Aggregate Middleware** - Runs on aggregations
4. **Model Middleware** - Runs on model methods

**Document Middleware:**

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Pre-save hook
userSchema.pre("save", async function (next) {
  // 'this' refers to the document
  if (this.isModified("password")) {
    const bcrypt = require("bcrypt");
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Post-save hook
userSchema.post("save", function (doc, next) {
  console.log(`User ${doc.name} was saved`);
  next();
});

// Pre-remove hook
userSchema.pre("remove", async function (next) {
  // Delete user's posts when user is deleted
  await mongoose.model("Post").deleteMany({ author: this._id });
  next();
});
```

**Query Middleware:**

```javascript
// Pre-find hook
userSchema.pre(/^find/, function (next) {
  // 'this' refers to the query
  this.find({ isActive: true });
  this.startTime = Date.now();
  next();
});

// Post-find hook
userSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.startTime}ms`);
  next();
});

// Pre-update hook
userSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});
```

**Aggregate Middleware:**

```javascript
userSchema.pre("aggregate", function (next) {
  // Add stage to pipeline
  this.pipeline().unshift({ $match: { isActive: true } });
  next();
});
```

**Error Handling in Middleware:**

```javascript
userSchema.pre("save", function (next) {
  if (!this.email) {
    next(new Error("Email is required"));
  } else {
    next();
  }
});

// Or throw error
userSchema.pre("save", async function () {
  if (!this.email) {
    throw new Error("Email is required");
  }
});
```

---

### Q7: What's the difference between pre and post hooks?

**Answer:**

**Pre Hooks (Before Operation):**

- Run before the operation
- Can modify the document/query
- Can cancel the operation by throwing error
- Receive `next()` callback

```javascript
// Pre-save: modify document before saving
userSchema.pre("save", async function (next) {
  // Hash password before saving
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Set default values
  if (!this.createdAt) {
    this.createdAt = new Date();
  }

  next();
});
```

**Post Hooks (After Operation):**

- Run after the operation completes
- Receive the result document/query
- Cannot modify the operation (already done)
- Useful for logging, notifications, cleanup

```javascript
// Post-save: perform actions after saving
userSchema.post("save", function (doc, next) {
  // Send welcome email
  sendWelcomeEmail(doc.email);

  // Log activity
  console.log(`User ${doc.name} created with ID ${doc._id}`);

  // Trigger event
  eventEmitter.emit("user:created", doc);

  next();
});
```

**Example - Complete Flow:**

```javascript
const orderSchema = new mongoose.Schema({
  items: [{ product: String, quantity: Number, price: Number }],
  total: Number,
  status: String,
});

// PRE: Calculate total before saving
orderSchema.pre("save", function (next) {
  this.total = this.items.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);
  next();
});

// POST: Send confirmation after saving
orderSchema.post("save", async function (doc, next) {
  await sendOrderConfirmation(doc);
  next();
});

// Usage:
const order = new Order({
  items: [
    { product: "Laptop", quantity: 1, price: 999 },
    { product: "Mouse", quantity: 2, price: 25 },
  ],
});

await order.save();
// 1. Pre hook calculates total = 1049
// 2. Document is saved
// 3. Post hook sends confirmation email
```

---

## Queries and Population

### Q8: How do queries work in Mongoose?

**Answer:**
Mongoose provides a fluent, chainable API for building queries.

**Basic Queries:**

```javascript
// Find all
const users = await User.find();

// Find with conditions
const adults = await User.find({ age: { $gte: 18 } });

// Find one
const user = await User.findOne({ email: "john@example.com" });

// Find by ID
const user = await User.findById("507f1f77bcf86cd799439011");
```

**Query Chaining:**

```javascript
const users = await User.find({ age: { $gte: 18 } })
  .select("name email") // Projection
  .sort({ createdAt: -1 }) // Sort
  .limit(10) // Limit
  .skip(20); // Skip (pagination)
```

**Query Helpers:**

```javascript
// Define query helper
userSchema.query.byAge = function (age) {
  return this.where({ age });
};

userSchema.query.active = function () {
  return this.where({ isActive: true });
};

// Use query helper
const activeAdults = await User.find().active().byAge(30);
```

**Query Operators:**

```javascript
// Comparison
await User.find({ age: { $gt: 18, $lt: 65 } });

// Logical
await User.find({
  $or: [{ role: "admin" }, { role: "moderator" }],
});

// Element
await User.find({ phone: { $exists: true } });

// Array
await User.find({ tags: { $in: ["javascript", "nodejs"] } });

// Text search
await Article.find({ $text: { $search: "mongodb tutorial" } });
```

**Lean Queries (Better Performance):**

```javascript
// Returns plain JavaScript object (faster)
const users = await User.find().lean();

// No Mongoose methods, virtuals, or getters
// Use when you only need data, not Mongoose features
```

---

### Q9: What is population in Mongoose?

**Answer:**
Population automatically replaces referenced document IDs with the actual documents from other collections.

**Basic Population:**

```javascript
// Schema definitions
const userSchema = new mongoose.Schema({
  name: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
  },
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// Without population
const post = await Post.findById(postId);
console.log(post.author); // ObjectId('...')

// With population
const post = await Post.findById(postId).populate("author");
console.log(post.author); // { _id: '...', name: 'John' }
```

**Advanced Population:**

```javascript
// Select specific fields
await Post.findById(postId).populate("author", "name email");

// Multiple populations
await Post.findById(postId).populate("author").populate("comments");

// Nested population
await Post.findById(postId).populate({
  path: "comments",
  populate: {
    path: "author",
    select: "name",
  },
});

// Population with conditions
await Post.find().populate({
  path: "author",
  match: { isActive: true },
  select: "name email",
  options: { sort: { name: 1 } },
});

// Populate arrays
const user = await User.findById(userId).populate("posts"); // posts is array of ObjectIds
```

**Manual Population (Aggregation):**

```javascript
const posts = await Post.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author",
    },
  },
  { $unwind: "$author" },
]);
```

---

## Virtuals and Methods

### Q10: What are virtual properties in Mongoose?

**Answer:**
Virtuals are document properties that don't get persisted to MongoDB but are computed from other properties.

**Defining Virtuals:**

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: Date,
});

// Getter virtual
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Getter and setter virtual
userSchema.virtual("age").get(function () {
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// Usage
const user = new User({
  firstName: "John",
  lastName: "Doe",
  birthDate: new Date("1990-01-15"),
});

console.log(user.fullName); // 'John Doe'
console.log(user.age); // 34 (calculated)
```

**Virtual with Setter:**

```javascript
userSchema.virtual("password").set(function (value) {
  this._password = value;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(value);
});
```

**Include in JSON/Object:**

```javascript
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const user = await User.findById(id);
console.log(user.toJSON()); // Includes fullName
```

**Virtual Populate:**

```javascript
// Instead of storing array of post IDs in user
const userSchema = new mongoose.Schema({
  name: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Virtual populate
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

// Usage
const user = await User.findById(id).populate("posts");
console.log(user.posts); // Array of posts by this user
```

---

### Q11: What are instance and static methods in Mongoose?

**Answer:**

**Instance Methods** - Called on document instances:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  loginAttempts: { type: Number, default: 0 },
});

// Instance method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempts += 1;
  return this.save();
};

userSchema.methods.getPublicProfile = function () {
  return {
    name: this.name,
    email: this.email,
  };
};

// Usage
const user = await User.findById(id);
const isValid = await user.comparePassword("password123");
await user.incrementLoginAttempts();
const profile = user.getPublicProfile();
```

**Static Methods** - Called on the Model:

```javascript
// Static method
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

userSchema.statics.createUser = async function (userData) {
  const user = new this(userData);
  await user.save();
  await sendWelcomeEmail(user.email);
  return user;
};

// Usage
const User = mongoose.model("User", userSchema);
const user = await User.findByEmail("john@example.com");
const activeUsers = await User.findActive();
const newUser = await User.createUser({
  name: "John",
  email: "john@example.com",
});
```

**Complete Example:**

```javascript
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
});

// Instance method
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.authenticate = async function (password) {
  if (this.isLocked()) {
    throw new Error("Account is locked");
  }

  const isValid = await bcrypt.compare(password, this.password);

  if (!isValid) {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
      this.lockUntil = Date.now() + 60 * 60 * 1000; // 1 hour
    }
    await this.save();
    return false;
  }

  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
  return true;
};

// Static method
userSchema.statics.findByRole = function (role) {
  return this.find({ role });
};

// Usage
const user = await User.findByEmail("john@example.com");
const isAuthenticated = await user.authenticate("password");

const admins = await User.findByRole("admin");
```

---

This covers Mongoose-specific interview questions. Master these concepts for full-stack development roles!
