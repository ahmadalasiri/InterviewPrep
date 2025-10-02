// MongoDB with Node.js
// Install: npm install mongodb mongoose

console.log("=== MongoDB with Node.js ===\n");

// 1. MongoDB Native Driver
console.log("--- MongoDB Native Driver ---");

/*
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'myapp';

// Create client
const client = new MongoClient(uri);

async function connectMongoDB() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('✗ Connection error:', error);
    throw error;
  }
}
*/

console.log("✓ MongoDB native driver setup");

// 2. Mongoose ODM (Object Document Mapper)
console.log("\n--- Mongoose ODM ---");

/*
const mongoose = require('mongoose');

// Connection
async function connectMongoose() {
  try {
    await mongoose.connect('mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Mongoose connected');
  } catch (error) {
    console.error('✗ Mongoose connection error:', error);
    process.exit(1);
  }
}

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed');
  process.exit(0);
});
*/

console.log("✓ Mongoose ODM setup");

// 3. Defining Schemas
console.log("\n--- Mongoose Schemas ---");

/*
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age seems unrealistic']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Virtual property
userSchema.virtual('fullInfo').get(function() {
  return `${this.name} (${this.email})`;
});

// Instance method
userSchema.methods.isAdult = function() {
  return this.age >= 18;
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  console.log('About to save user:', this.name);
  next();
});

// Post-save middleware
userSchema.post('save', function(doc, next) {
  console.log('User saved:', doc._id);
  next();
});

// Create Model
const User = mongoose.model('User', userSchema);
*/

console.log("✓ Mongoose schemas defined");

// 4. CRUD Operations - Create
console.log("\n--- Create Operations ---");

/*
// Method 1: Using create()
async function createUser() {
  try {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log('✓ User created:', user._id);
    return user;
  } catch (error) {
    console.error('✗ Error creating user:', error.message);
  }
}

// Method 2: Using save()
async function createUserWithSave() {
  try {
    const user = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25
    });
    await user.save();
    console.log('✓ User saved:', user._id);
    return user;
  } catch (error) {
    console.error('✗ Error saving user:', error.message);
  }
}

// Method 3: Insert many
async function createMultipleUsers() {
  try {
    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@example.com', age: 28 },
      { name: 'Bob', email: 'bob@example.com', age: 32 },
      { name: 'Charlie', email: 'charlie@example.com', age: 45 }
    ]);
    console.log('✓ Created users:', users.length);
    return users;
  } catch (error) {
    console.error('✗ Error creating users:', error.message);
  }
}
*/

console.log("✓ Create operations defined");

// 5. CRUD Operations - Read
console.log("\n--- Read Operations ---");

/*
// Find all
async function findAllUsers() {
  const users = await User.find();
  console.log('Found users:', users.length);
  return users;
}

// Find with conditions
async function findActiveUsers() {
  const users = await User.find({ isActive: true });
  return users;
}

// Find one
async function findUserByEmail(email) {
  const user = await User.findOne({ email });
  return user;
}

// Find by ID
async function findUserById(id) {
  const user = await User.findById(id);
  return user;
}

// Find with query operators
async function findUsersWithQuery() {
  const users = await User.find({
    age: { $gte: 18, $lte: 65 }, // Age between 18 and 65
    role: { $in: ['user', 'admin'] }, // Role is user or admin
    isActive: true
  });
  return users;
}

// Select specific fields
async function findUsersWithProjection() {
  const users = await User.find()
    .select('name email') // Only return name and email
    .select('-__v'); // Exclude __v field
  return users;
}

// Sorting
async function findUsersSorted() {
  const users = await User.find()
    .sort({ age: -1 }) // Sort by age descending
    .sort({ name: 1 }); // Then by name ascending
  return users;
}

// Pagination
async function findUsersPaginated(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const users = await User.find()
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments();
  return {
    users,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
}

// Count documents
async function countUsers() {
  const count = await User.countDocuments({ isActive: true });
  console.log('Active users:', count);
  return count;
}
*/

console.log("✓ Read operations defined");

// 6. CRUD Operations - Update
console.log("\n--- Update Operations ---");

/*
// Update one
async function updateUser(id, updates) {
  const user = await User.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true } // Return updated doc & run validators
  );
  console.log('✓ User updated:', user._id);
  return user;
}

// Update many
async function updateMultipleUsers() {
  const result = await User.updateMany(
    { age: { $lt: 18 } }, // Condition
    { role: 'minor' } // Update
  );
  console.log('✓ Updated users:', result.modifiedCount);
  return result;
}

// Find and update
async function findAndUpdate(email, updates) {
  const user = await User.findOneAndUpdate(
    { email },
    updates,
    { new: true, upsert: true } // Create if not exists
  );
  return user;
}

// Update with operators
async function incrementAge(id) {
  const user = await User.findByIdAndUpdate(
    id,
    { 
      $inc: { age: 1 }, // Increment age by 1
      $set: { updatedAt: Date.now() }
    },
    { new: true }
  );
  return user;
}
*/

console.log("✓ Update operations defined");

// 7. CRUD Operations - Delete
console.log("\n--- Delete Operations ---");

/*
// Delete one
async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  console.log('✓ User deleted:', user._id);
  return user;
}

// Delete many
async function deleteInactiveUsers() {
  const result = await User.deleteMany({ isActive: false });
  console.log('✓ Deleted users:', result.deletedCount);
  return result;
}

// Find and delete
async function findAndDelete(email) {
  const user = await User.findOneAndDelete({ email });
  return user;
}
*/

console.log("✓ Delete operations defined");

// 8. Relationships
console.log("\n--- Relationships ---");

/*
// One-to-Many: User has many Posts
const postSchema = new Schema({
  title: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Create post with reference
async function createPost(userId, postData) {
  const post = await Post.create({
    ...postData,
    author: userId
  });
  return post;
}

// Populate references
async function getPostWithAuthor(postId) {
  const post = await Post.findById(postId)
    .populate('author', 'name email') // Populate author, select name and email
    .populate('comments.user', 'name'); // Populate comment users
  return post;
}

// Nested populate
async function getPostWithNestedPopulate(postId) {
  const post = await Post.findById(postId)
    .populate({
      path: 'author',
      select: 'name email',
      match: { isActive: true }
    });
  return post;
}
*/

console.log("✓ Relationships defined");

// 9. Aggregation
console.log("\n--- Aggregation ---");

/*
// Basic aggregation
async function getUserStatistics() {
  const stats = await User.aggregate([
    // Match active users
    { $match: { isActive: true } },
    
    // Group by role
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        avgAge: { $avg: '$age' },
        minAge: { $min: '$age' },
        maxAge: { $max: '$age' }
      }
    },
    
    // Sort by count
    { $sort: { count: -1 } },
    
    // Project fields
    {
      $project: {
        role: '$_id',
        count: 1,
        avgAge: { $round: ['$avgAge', 2] },
        minAge: 1,
        maxAge: 1,
        _id: 0
      }
    }
  ]);
  
  return stats;
}

// Complex aggregation with lookup (join)
async function getPostsWithAuthorInfo() {
  const posts = await Post.aggregate([
    // Lookup (join) with users
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorInfo'
      }
    },
    
    // Unwind author array
    { $unwind: '$authorInfo' },
    
    // Project fields
    {
      $project: {
        title: 1,
        content: 1,
        'authorInfo.name': 1,
        'authorInfo.email': 1,
        commentCount: { $size: '$comments' }
      }
    }
  ]);
  
  return posts;
}
*/

console.log("✓ Aggregation pipelines defined");

// 10. Transactions
console.log("\n--- Transactions ---");

/*
async function transferCredits(fromUserId, toUserId, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Deduct from sender
    await User.findByIdAndUpdate(
      fromUserId,
      { $inc: { credits: -amount } },
      { session }
    );
    
    // Add to receiver
    await User.findByIdAndUpdate(
      toUserId,
      { $inc: { credits: amount } },
      { session }
    );
    
    // Commit transaction
    await session.commitTransaction();
    console.log('✓ Transaction completed');
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    console.error('✗ Transaction failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
}
*/

console.log("✓ Transactions defined");

// 11. Indexes
console.log("\n--- Indexes ---");

/*
// Create indexes in schema
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 1, age: -1 });
userSchema.index({ createdAt: -1 });

// Text index for search
postSchema.index({ title: 'text', content: 'text' });

// Geospatial index
userSchema.index({ location: '2dsphere' });

// Create index programmatically
async function createIndexes() {
  await User.createIndexes();
  console.log('✓ Indexes created');
}

// Text search
async function searchPosts(query) {
  const posts = await Post.find({ $text: { $search: query } })
    .sort({ score: { $meta: 'textScore' } });
  return posts;
}
*/

console.log("✓ Indexes defined");

// 12. Best Practices
console.log("\n--- Best Practices ---");

/*
1. Connection Management:
   - Use connection pooling
   - Handle connection errors
   - Implement graceful shutdown

2. Schema Design:
   - Add validation rules
   - Use appropriate data types
   - Create indexes for frequently queried fields

3. Error Handling:
   - Always use try-catch
   - Handle validation errors
   - Log errors appropriately

4. Performance:
   - Use lean() for read-only queries
   - Select only needed fields
   - Implement pagination
   - Use indexes effectively

5. Security:
   - Validate input data
   - Use parameterized queries (Mongoose does this)
   - Don't expose sensitive data
   - Use environment variables for connection strings

6. Transactions:
   - Use for operations that must be atomic
   - Keep transactions short
   - Handle errors properly

7. Relationships:
   - Use references for one-to-many
   - Use embedding for one-to-few
   - Use populate wisely (can be expensive)

8. Testing:
   - Use separate database for testing
   - Clean up test data
   - Mock database calls in unit tests
*/

console.log("\n✓ MongoDB concepts completed");
console.log("\nNote: Install required packages:");
console.log("  npm install mongodb mongoose");

