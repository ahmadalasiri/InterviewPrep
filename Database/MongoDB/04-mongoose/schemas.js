/**
 * Mongoose Schemas and Models
 * Comprehensive examples of schema definitions
 */

const mongoose = require("mongoose");

// ============================================
// Basic Schema
// ============================================

const basicUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const BasicUser = mongoose.model("BasicUser", basicUserSchema);

// ============================================
// Schema with Validation
// ============================================

const validatedUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username cannot exceed 30 characters"],
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  age: {
    type: Number,
    min: [0, "Age cannot be negative"],
    max: [120, "Age seems unrealistic"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin", "moderator"],
      message: "{VALUE} is not a valid role",
    },
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const ValidatedUser = mongoose.model("ValidatedUser", validatedUserSchema);

// ============================================
// Schema with Nested Objects
// ============================================

const userWithAddressSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: "USA",
    },
  },
  socialMedia: {
    twitter: String,
    linkedin: String,
    github: String,
  },
});

const UserWithAddress = mongoose.model(
  "UserWithAddress",
  userWithAddressSchema
);

// ============================================
// Schema with Arrays
// ============================================

const userWithArraysSchema = new mongoose.Schema({
  name: String,
  email: String,
  tags: [String], // Array of strings
  scores: [Number], // Array of numbers
  hobbies: {
    type: [String],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "At least one hobby is required",
    },
  },
  // Array of embedded documents
  addresses: [
    {
      type: {
        type: String,
        enum: ["home", "work", "other"],
      },
      street: String,
      city: String,
      isPrimary: Boolean,
    },
  ],
});

const UserWithArrays = mongoose.model("UserWithArrays", userWithArraysSchema);

// ============================================
// Schema with References
// ============================================

const authorSchema = new mongoose.Schema({
  name: String,
  email: String,
  bio: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  tags: [String],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Author = mongoose.model("Author", authorSchema);
const Post = mongoose.model("Post", postSchema);

// ============================================
// Schema with Timestamps
// ============================================

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: String,
    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Product = mongoose.model("Product", productSchema);

// ============================================
// Schema with Virtual Properties
// ============================================

const personSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    birthDate: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
personSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
personSchema.virtual("age").get(function () {
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

const Person = mongoose.model("Person", personSchema);

// ============================================
// Schema with Instance Methods
// ============================================

const userWithMethodsSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  loginAttempts: {
    type: Number,
    default: 0,
  },
});

// Instance method
userWithMethodsSchema.methods.comparePassword = async function (
  candidatePassword
) {
  const bcrypt = require("bcrypt");
  return await bcrypt.compare(candidatePassword, this.password);
};

userWithMethodsSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempts += 1;
  return this.save();
};

const UserWithMethods = mongoose.model(
  "UserWithMethods",
  userWithMethodsSchema
);

// ============================================
// Schema with Static Methods
// ============================================

const userWithStaticsSchema = new mongoose.Schema({
  email: String,
  isActive: Boolean,
  role: String,
});

// Static method
userWithStaticsSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

userWithStaticsSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

userWithStaticsSchema.statics.findByRole = function (role) {
  return this.find({ role });
};

const UserWithStatics = mongoose.model(
  "UserWithStatics",
  userWithStaticsSchema
);

// ============================================
// Schema with Query Helpers
// ============================================

const productWithQuerySchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  isActive: Boolean,
});

// Query helper
productWithQuerySchema.query.byCategory = function (category) {
  return this.where({ category });
};

productWithQuerySchema.query.active = function () {
  return this.where({ isActive: true });
};

productWithQuerySchema.query.priceRange = function (min, max) {
  return this.where("price").gte(min).lte(max);
};

const ProductWithQuery = mongoose.model(
  "ProductWithQuery",
  productWithQuerySchema
);

// ============================================
// Schema with Middleware (Hooks)
// ============================================

const userWithHooksSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Pre-save hook
userWithHooksSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const bcrypt = require("bcrypt");
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Post-save hook
userWithHooksSchema.post("save", function (doc, next) {
  console.log(`User ${doc.email} was saved`);
  next();
});

const UserWithHooks = mongoose.model("UserWithHooks", userWithHooksSchema);

// ============================================
// Schema with Indexes
// ============================================

const indexedUserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Creates unique index
  },
  email: {
    type: String,
    unique: true,
    index: true, // Creates regular index
  },
  firstName: String,
  lastName: String,
  city: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index
indexedUserSchema.index({ firstName: 1, lastName: 1 });

// Text index for search
indexedUserSchema.index({ firstName: "text", lastName: "text" });

// TTL index (auto-delete after 30 days)
indexedUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const IndexedUser = mongoose.model("IndexedUser", indexedUserSchema);

// ============================================
// Schema with Custom Validation
// ============================================

const customValidationSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: async function (value) {
        const user = await mongoose
          .model("CustomValidation")
          .findOne({ email: value });
        return !user || user._id.equals(this._id);
      },
      message: "Email already exists",
    },
  },
  age: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 18;
      },
      message: "You must be at least 18 years old",
    },
  },
  website: {
    type: String,
    validate: {
      validator: function (value) {
        return /^https?:\/\/.+/.test(value);
      },
      message: "Website must be a valid URL",
    },
  },
});

const CustomValidation = mongoose.model(
  "CustomValidation",
  customValidationSchema
);

// ============================================
// Complex E-commerce Schema Example
// ============================================

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
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String, // Snapshot of product name
        price: Number, // Snapshot of price at time of order
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"],
    },
    subtotal: Number,
    tax: Number,
    shippingCost: Number,
    total: Number,
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
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
orderSchema.pre("save", function (next) {
  // Calculate subtotal for each item
  this.items.forEach((item) => {
    item.subtotal = item.price * item.quantity;
  });

  // Calculate order subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Calculate total
  this.total = this.subtotal + this.tax + this.shippingCost;

  next();
});

const Order = mongoose.model("Order", orderSchema);

// ============================================
// Export All Models
// ============================================

module.exports = {
  BasicUser,
  ValidatedUser,
  UserWithAddress,
  UserWithArrays,
  Author,
  Post,
  Product,
  Person,
  UserWithMethods,
  UserWithStatics,
  ProductWithQuery,
  UserWithHooks,
  IndexedUser,
  CustomValidation,
  Order,
};
