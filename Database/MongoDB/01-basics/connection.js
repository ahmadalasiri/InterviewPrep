/**
 * MongoDB Connection Examples
 * Demonstrates different ways to connect to MongoDB
 */

// Using MongoDB Native Driver
const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017";
const dbName = "myapp";

// ============================================
// Method 1: MongoDB Native Driver
// ============================================

async function connectNativeDriver() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB using Native Driver");

    // Get database
    const db = client.db(dbName);

    // Perform operations
    const collections = await db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );

    return { client, db };
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
}

// ============================================
// Method 2: Mongoose ODM
// ============================================

const mongoose = require("mongoose");

async function connectMongoose() {
  try {
    await mongoose.connect("mongodb://localhost:27017/myapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB using Mongoose");
  } catch (error) {
    console.error("Mongoose connection error:", error);
    throw error;
  }
}

// Connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// ============================================
// Method 3: Connection with Options
// ============================================

async function connectWithOptions() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maximum connections in pool
    minPoolSize: 2, // Minimum connections in pool
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    socketTimeoutMS: 45000, // Socket timeout
    family: 4, // Use IPv4
  };

  await mongoose.connect("mongodb://localhost:27017/myapp", options);
  console.log("Connected with custom options");
}

// ============================================
// Method 4: MongoDB Atlas (Cloud)
// ============================================

async function connectToAtlas() {
  const atlasUri =
    "mongodb+srv://username:password@cluster0.mongodb.net/myapp?retryWrites=true&w=majority";

  await mongoose.connect(atlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Connected to MongoDB Atlas");
}

// ============================================
// Method 5: Connection with Authentication
// ============================================

async function connectWithAuth() {
  const authUri =
    "mongodb://username:password@localhost:27017/myapp?authSource=admin";

  const client = new MongoClient(authUri);
  await client.connect();

  console.log("Connected with authentication");
  return client;
}

// ============================================
// Method 6: Replica Set Connection
// ============================================

async function connectToReplicaSet() {
  const replicaUri =
    "mongodb://host1:27017,host2:27017,host3:27017/myapp?replicaSet=myReplSet";

  await mongoose.connect(replicaUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Connected to Replica Set");
}

// ============================================
// Connection Pool Management
// ============================================

function monitorConnectionPool() {
  // Monitor pool size
  setInterval(() => {
    const poolSize = mongoose.connection.client.topology.s.pool.size;
    const availableConnections =
      mongoose.connection.client.topology.s.pool.availableConnectionCount;

    console.log("Connection Pool Stats:", {
      totalConnections: poolSize,
      available: availableConnections,
      inUse: poolSize - availableConnections,
    });
  }, 10000);
}

// ============================================
// Graceful Shutdown
// ============================================

async function gracefulShutdown() {
  // Handle SIGINT (Ctrl+C)
  process.on("SIGINT", async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });

  // Handle SIGTERM
  process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  });
}

// ============================================
// Environment-based Connection
// ============================================

async function connectBasedOnEnvironment() {
  const env = process.env.NODE_ENV || "development";

  const configs = {
    development: {
      uri: "mongodb://localhost:27017/myapp-dev",
      options: { maxPoolSize: 5 },
    },
    test: {
      uri: "mongodb://localhost:27017/myapp-test",
      options: { maxPoolSize: 3 },
    },
    production: {
      uri: process.env.MONGODB_URI,
      options: {
        maxPoolSize: 50,
        minPoolSize: 10,
      },
    },
  };

  const config = configs[env];
  await mongoose.connect(config.uri, config.options);

  console.log(`Connected to MongoDB in ${env} environment`);
}

// ============================================
// Retry Logic
// ============================================

async function connectWithRetry(maxRetries = 5) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect("mongodb://localhost:27017/myapp");
      console.log("Connected successfully");
      return;
    } catch (error) {
      retries++;
      console.error(`Connection attempt ${retries} failed:`, error.message);

      if (retries < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retries), 10000);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error("Max connection retries exceeded");
      }
    }
  }
}

// ============================================
// Health Check
// ============================================

async function checkConnection() {
  try {
    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      // Ping database
      await mongoose.connection.db.admin().ping();
      console.log("Database connection is healthy");
      return true;
    } else {
      console.log("Database connection is not active");
      return false;
    }
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}

// ============================================
// Export Functions
// ============================================

module.exports = {
  connectNativeDriver,
  connectMongoose,
  connectWithOptions,
  connectToAtlas,
  connectWithAuth,
  connectToReplicaSet,
  monitorConnectionPool,
  gracefulShutdown,
  connectBasedOnEnvironment,
  connectWithRetry,
  checkConnection,
};

// ============================================
// Usage Example
// ============================================

if (require.main === module) {
  (async () => {
    try {
      // Connect to MongoDB
      await connectMongoose();

      // Set up graceful shutdown
      gracefulShutdown();

      // Check connection health
      setInterval(checkConnection, 30000);

      // Keep the app running
      console.log("Application is running...");
    } catch (error) {
      console.error("Failed to start application:", error);
      process.exit(1);
    }
  })();
}
