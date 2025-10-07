/**
 * MongoDB Create (Insert) Operations
 * Demonstrates different ways to insert documents
 */

const mongoose = require("mongoose");

// ============================================
// Define Sample Schema
// ============================================

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  city: String,
  hobbies: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// ============================================
// Method 1: insertOne (Native Driver)
// ============================================

async function insertOneDocument(db) {
  const collection = db.collection("users");

  const user = {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    city: "New York",
    hobbies: ["reading", "coding"],
    createdAt: new Date(),
  };

  try {
    const result = await collection.insertOne(user);

    console.log("Inserted document:", {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });

    return result;
  } catch (error) {
    console.error("Insert error:", error);
    throw error;
  }
}

// ============================================
// Method 2: insertMany (Native Driver)
// ============================================

async function insertManyDocuments(db) {
  const collection = db.collection("users");

  const users = [
    {
      name: "Alice Smith",
      email: "alice@example.com",
      age: 25,
      city: "Boston",
      hobbies: ["music", "travel"],
    },
    {
      name: "Bob Johnson",
      email: "bob@example.com",
      age: 35,
      city: "Chicago",
      hobbies: ["sports", "gaming"],
    },
    {
      name: "Carol White",
      email: "carol@example.com",
      age: 28,
      city: "Seattle",
      hobbies: ["art", "photography"],
    },
  ];

  try {
    const result = await collection.insertMany(users);

    console.log("Inserted documents:", {
      acknowledged: result.acknowledged,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    });

    return result;
  } catch (error) {
    console.error("Insert many error:", error);
    throw error;
  }
}

// ============================================
// Method 3: Mongoose create()
// ============================================

async function createWithMongoose() {
  try {
    const user = await User.create({
      name: "David Brown",
      email: "david@example.com",
      age: 32,
      city: "Austin",
      hobbies: ["cooking", "hiking"],
    });

    console.log("Created user with Mongoose:", user);
    return user;
  } catch (error) {
    console.error("Mongoose create error:", error);
    throw error;
  }
}

// ============================================
// Method 4: Mongoose save()
// ============================================

async function saveWithMongoose() {
  try {
    const user = new User({
      name: "Emma Wilson",
      email: "emma@example.com",
      age: 27,
      city: "Portland",
      hobbies: ["yoga", "reading"],
    });

    const savedUser = await user.save();

    console.log("Saved user:", savedUser);
    return savedUser;
  } catch (error) {
    console.error("Mongoose save error:", error);
    throw error;
  }
}

// ============================================
// Method 5: Mongoose insertMany()
// ============================================

async function insertManyWithMongoose() {
  const users = [
    {
      name: "Frank Miller",
      email: "frank@example.com",
      age: 40,
      city: "Denver",
    },
    {
      name: "Grace Lee",
      email: "grace@example.com",
      age: 29,
      city: "Miami",
    },
  ];

  try {
    const insertedUsers = await User.insertMany(users);

    console.log("Inserted users:", insertedUsers.length);
    return insertedUsers;
  } catch (error) {
    console.error("Insert many error:", error);
    throw error;
  }
}

// ============================================
// Insert with Validation
// ============================================

const validatedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const ValidatedUser = mongoose.model("ValidatedUser", validatedUserSchema);

async function insertWithValidation() {
  try {
    const user = await ValidatedUser.create({
      name: "Test User",
      email: "test@example.com",
      age: 25,
      password: "securepass123",
    });

    console.log("User created with validation:", user);
    return user;
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Insert error:", error);
    }
    throw error;
  }
}

// ============================================
// Insert with Pre-save Hook
// ============================================

const bcrypt = require("bcrypt");

const userWithHookSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Hash password before saving
userWithHookSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const UserWithHook = mongoose.model("UserWithHook", userWithHookSchema);

async function insertWithHook() {
  try {
    const user = await UserWithHook.create({
      name: "Secure User",
      email: "secure@example.com",
      password: "plainpassword",
    });

    console.log("User created with hashed password");
    console.log("Password is hashed:", user.password !== "plainpassword");

    return user;
  } catch (error) {
    console.error("Insert error:", error);
    throw error;
  }
}

// ============================================
// Bulk Insert with Error Handling
// ============================================

async function bulkInsertWithErrorHandling() {
  const users = [
    { name: "User 1", email: "user1@example.com" },
    { name: "User 2", email: "duplicate@example.com" },
    { name: "User 3", email: "duplicate@example.com" }, // Duplicate
    { name: "User 4", email: "user4@example.com" },
  ];

  try {
    // ordered: false continues on error
    const result = await User.insertMany(users, { ordered: false });
    console.log("Inserted:", result.length);
  } catch (error) {
    if (error.name === "BulkWriteError") {
      console.log("Some inserts failed:");
      console.log("Inserted:", error.insertedDocs.length);
      console.log("Errors:", error.writeErrors.length);
    }
  }
}

// ============================================
// Insert with Custom _id
// ============================================

async function insertWithCustomId(db) {
  const collection = db.collection("products");

  const product = {
    _id: "PROD-001", // Custom _id instead of ObjectId
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
  };

  try {
    await collection.insertOne(product);
    console.log("Inserted product with custom _id");
  } catch (error) {
    console.error("Insert error:", error);
  }
}

// ============================================
// Insert with Timestamps
// ============================================

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

async function insertWithTimestamps() {
  const product = await Product.create({
    name: "Smartphone",
    price: 699.99,
    category: "Electronics",
  });

  console.log("Product with timestamps:", {
    name: product.name,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });

  return product;
}

// ============================================
// Batch Insert with Progress
// ============================================

async function batchInsertWithProgress(totalUsers = 1000) {
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < totalUsers; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < totalUsers; j++) {
      batch.push({
        name: `User ${i + j}`,
        email: `user${i + j}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
      });
    }

    await User.insertMany(batch);
    inserted += batch.length;

    console.log(`Progress: ${inserted}/${totalUsers} users inserted`);
  }

  console.log("Batch insert completed!");
}

// ============================================
// Export Functions
// ============================================

module.exports = {
  insertOneDocument,
  insertManyDocuments,
  createWithMongoose,
  saveWithMongoose,
  insertManyWithMongoose,
  insertWithValidation,
  insertWithHook,
  bulkInsertWithErrorHandling,
  insertWithCustomId,
  insertWithTimestamps,
  batchInsertWithProgress,
};

// ============================================
// Usage Example
// ============================================

if (require.main === module) {
  (async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect("mongodb://localhost:27017/testdb");

      // Run examples
      console.log("=== Creating Documents ===\n");

      await createWithMongoose();
      await saveWithMongoose();
      await insertManyWithMongoose();
      await insertWithTimestamps();

      console.log("\n=== All operations completed ===");

      // Close connection
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  })();
}
