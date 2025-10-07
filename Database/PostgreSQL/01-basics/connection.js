/**
 * PostgreSQL Connection Examples
 * Demonstrates different ways to connect to PostgreSQL
 */

const { Pool, Client } = require("pg");

// ============================================
// Method 1: Using Pool (Recommended)
// ============================================

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "mydb",
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function queryWithPool() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Current time:", result.rows[0].now);
  } catch (error) {
    console.error("Query error:", error);
  }
}

// ============================================
// Method 2: Using Client (Single Connection)
// ============================================

async function queryWithClient() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "mydb",
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    const result = await client.query("SELECT * FROM users LIMIT 5");
    console.log("Users:", result.rows);
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    await client.end();
  }
}

// ============================================
// Method 3: Environment Variables
// ============================================

const poolWithEnv = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Or individual environment variables
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME
});

// ============================================
// Method 4: SSL Connection (Production)
// ============================================

const securePool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // For self-signed certificates
  },
});

// ============================================
// Parameterized Queries (Prevent SQL Injection)
// ============================================

async function safeQuery(email) {
  // Bad: SQL injection risk
  // const query = `SELECT * FROM users WHERE email = '${email}'`;

  // Good: Parameterized query
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
}

// ============================================
// Transaction Example
// ============================================

async function transferMoney(fromUserId, toUserId, amount) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Deduct from sender
    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE user_id = $2",
      [amount, fromUserId]
    );

    // Add to receiver
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE user_id = $2",
      [amount, toUserId]
    );

    await client.query("COMMIT");
    console.log("Transaction completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

// ============================================
// Prepared Statements
// ============================================

async function preparedStatement() {
  const client = await pool.connect();

  try {
    // Prepare statement
    await client.query({
      name: "find-user-by-email",
      text: "SELECT * FROM users WHERE email = $1",
      values: ["test@example.com"],
    });

    // Reuse prepared statement (faster)
    const result = await client.query({
      name: "find-user-by-email",
      values: ["another@example.com"],
    });

    console.log("User:", result.rows[0]);
  } finally {
    client.release();
  }
}

// ============================================
// Connection Pool Events
// ============================================

pool.on("connect", (client) => {
  console.log("New client connected to pool");
});

pool.on("acquire", (client) => {
  console.log("Client acquired from pool");
});

pool.on("remove", (client) => {
  console.log("Client removed from pool");
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

// ============================================
// Health Check
// ============================================

async function checkHealth() {
  try {
    const result = await pool.query("SELECT 1");
    console.log("Database is healthy");
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

// ============================================
// Graceful Shutdown
// ============================================

async function gracefulShutdown() {
  console.log("Closing database connections...");
  await pool.end();
  console.log("Database connections closed");
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// ============================================
// Connection Retry Logic
// ============================================

async function connectWithRetry(maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("Connected to database");
      return;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);

      if (i < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error("Failed to connect to database after max retries");
      }
    }
  }
}

// ============================================
// Export Functions
// ============================================

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  checkHealth,
  safeQuery,
  transferMoney,
};

// ============================================
// Usage Example
// ============================================

if (require.main === module) {
  (async () => {
    try {
      await connectWithRetry();
      await checkHealth();

      // Test query
      const result = await safeQuery("test@example.com");
      console.log("Query result:", result);
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  })();
}
