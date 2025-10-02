// PostgreSQL with Node.js
// Install: npm install pg sequelize

console.log("=== PostgreSQL with Node.js ===\n");

// 1. Using node-postgres (pg)
console.log("--- node-postgres (pg) Driver ---");

/*
const { Pool, Client } = require('pg');

// Connection configuration
const config = {
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Using Pool (recommended for applications)
const pool = new Pool(config);

// Test connection
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✓ Connected to PostgreSQL');
    console.log('Current time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('✗ Connection error:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  console.log('PostgreSQL pool closed');
  process.exit(0);
});
*/

console.log("✓ PostgreSQL connection setup");

// 2. Basic Queries
console.log("\n--- Basic Queries ---");

/*
// Simple SELECT
async function getAllUsers() {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Found users:', result.rows.length);
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Parameterized query (prevents SQL injection)
async function getUserById(id) {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Multiple parameters
async function findUsers(minAge, role) {
  const query = `
    SELECT id, name, email, age, role
    FROM users
    WHERE age >= $1 AND role = $2
    ORDER BY age DESC
  `;
  const result = await pool.query(query, [minAge, role]);
  return result.rows;
}
*/

console.log("✓ Basic queries defined");

// 3. INSERT Operations
console.log("\n--- INSERT Operations ---");

/*
// Insert single record
async function createUser(userData) {
  const query = `
    INSERT INTO users (name, email, age, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [
    userData.name,
    userData.email,
    userData.age,
    userData.role || 'user'
  ];
  
  try {
    const result = await pool.query(query, values);
    console.log('✓ User created:', result.rows[0].id);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Insert multiple records
async function createMultipleUsers(users) {
  const query = `
    INSERT INTO users (name, email, age)
    VALUES ${users.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}
    RETURNING *
  `;
  
  const values = users.flatMap(u => [u.name, u.email, u.age]);
  
  try {
    const result = await pool.query(query, values);
    console.log('✓ Users created:', result.rows.length);
    return result.rows;
  } catch (error) {
    console.error('Error creating users:', error);
    throw error;
  }
}
*/

console.log("✓ INSERT operations defined");

// 4. UPDATE Operations
console.log("\n--- UPDATE Operations ---");

/*
// Update record
async function updateUser(id, updates) {
  const query = `
    UPDATE users
    SET name = $1, email = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `;
  const values = [updates.name, updates.email, id];
  
  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    console.log('✓ User updated:', result.rows[0].id);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Update multiple records
async function deactivateOldUsers(daysInactive) {
  const query = `
    UPDATE users
    SET is_active = false
    WHERE last_login < NOW() - INTERVAL '${daysInactive} days'
    RETURNING id
  `;
  
  try {
    const result = await pool.query(query);
    console.log('✓ Deactivated users:', result.rowCount);
    return result.rows;
  } catch (error) {
    console.error('Error deactivating users:', error);
    throw error;
  }
}

// Conditional update
async function incrementLoginCount(userId) {
  const query = `
    UPDATE users
    SET 
      login_count = login_count + 1,
      last_login = NOW()
    WHERE id = $1
    RETURNING login_count
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}
*/

console.log("✓ UPDATE operations defined");

// 5. DELETE Operations
console.log("\n--- DELETE Operations ---");

/*
// Delete record
async function deleteUser(id) {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  
  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    console.log('✓ User deleted:', result.rows[0].id);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Delete multiple records
async function deleteInactiveUsers() {
  const query = 'DELETE FROM users WHERE is_active = false RETURNING id';
  
  try {
    const result = await pool.query(query);
    console.log('✓ Deleted users:', result.rowCount);
    return result.rows;
  } catch (error) {
    console.error('Error deleting users:', error);
    throw error;
  }
}
*/

console.log("✓ DELETE operations defined");

// 6. Transactions
console.log("\n--- Transactions ---");

/*
async function transferMoney(fromUserId, toUserId, amount) {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Deduct from sender
    const deductQuery = `
      UPDATE accounts
      SET balance = balance - $1
      WHERE user_id = $2 AND balance >= $1
      RETURNING balance
    `;
    const deductResult = await client.query(deductQuery, [amount, fromUserId]);
    
    if (deductResult.rowCount === 0) {
      throw new Error('Insufficient funds');
    }
    
    // Add to receiver
    const addQuery = `
      UPDATE accounts
      SET balance = balance + $1
      WHERE user_id = $2
      RETURNING balance
    `;
    await client.query(addQuery, [amount, toUserId]);
    
    // Record transaction
    const recordQuery = `
      INSERT INTO transactions (from_user_id, to_user_id, amount, type)
      VALUES ($1, $2, $3, 'transfer')
    `;
    await client.query(recordQuery, [fromUserId, toUserId, amount]);
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('✓ Transaction completed');
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('✗ Transaction failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Transaction with isolation level
async function transactionWithIsolation() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
    // ... your queries
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
*/

console.log("✓ Transactions defined");

// 7. Advanced Queries
console.log("\n--- Advanced Queries ---");

/*
// JOIN queries
async function getUsersWithPosts() {
  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(p.id) as post_count,
      MAX(p.created_at) as last_post_date
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    GROUP BY u.id, u.name, u.email
    HAVING COUNT(p.id) > 0
    ORDER BY post_count DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

// Subqueries
async function getUsersAboveAverageAge() {
  const query = `
    SELECT id, name, age
    FROM users
    WHERE age > (SELECT AVG(age) FROM users)
    ORDER BY age DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

// Common Table Expressions (CTEs)
async function getTopUsersWithCTE() {
  const query = `
    WITH user_stats AS (
      SELECT 
        u.id,
        u.name,
        COUNT(p.id) as post_count,
        AVG(p.views) as avg_views
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      GROUP BY u.id, u.name
    )
    SELECT *
    FROM user_stats
    WHERE post_count > 5
    ORDER BY avg_views DESC
    LIMIT 10
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

// Window functions
async function getUserRankings() {
  const query = `
    SELECT 
      id,
      name,
      score,
      RANK() OVER (ORDER BY score DESC) as rank,
      ROW_NUMBER() OVER (ORDER BY score DESC) as row_num,
      DENSE_RANK() OVER (ORDER BY score DESC) as dense_rank
    FROM users
    ORDER BY score DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

// Full-text search
async function searchPosts(searchTerm) {
  const query = `
    SELECT 
      id,
      title,
      content,
      ts_rank(to_tsvector('english', title || ' ' || content), query) as rank
    FROM posts,
    to_tsquery('english', $1) query
    WHERE to_tsvector('english', title || ' ' || content) @@ query
    ORDER BY rank DESC
  `;
  
  const result = await pool.query(query, [searchTerm]);
  return result.rows;
}
*/

console.log("✓ Advanced queries defined");

// 8. Pagination
console.log("\n--- Pagination ---");

/*
async function getUsersPaginated(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  // Get paginated results
  const dataQuery = `
    SELECT id, name, email, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;
  
  // Get total count
  const countQuery = 'SELECT COUNT(*) FROM users';
  
  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [limit, offset]),
    pool.query(countQuery)
  ]);
  
  const total = parseInt(countResult.rows[0].count);
  
  return {
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
}
*/

console.log("✓ Pagination defined");

// 9. Prepared Statements
console.log("\n--- Prepared Statements ---");

/*
// For frequently executed queries
async function usePreparedStatement() {
  const client = await pool.connect();
  
  try {
    // Prepare statement
    await client.query({
      name: 'get-user-by-email',
      text: 'SELECT * FROM users WHERE email = $1',
    });
    
    // Execute prepared statement multiple times
    const user1 = await client.query({
      name: 'get-user-by-email',
      values: ['user1@example.com']
    });
    
    const user2 = await client.query({
      name: 'get-user-by-email',
      values: ['user2@example.com']
    });
    
    return [user1.rows[0], user2.rows[0]];
  } finally {
    client.release();
  }
}
*/

console.log("✓ Prepared statements defined");

// 10. Error Handling
console.log("\n--- Error Handling ---");

/*
async function handleDatabaseErrors() {
  try {
    await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  } catch (error) {
    // PostgreSQL error codes
    switch (error.code) {
      case '23505': // Unique violation
        console.error('Duplicate entry');
        break;
      case '23503': // Foreign key violation
        console.error('Referenced record does not exist');
        break;
      case '22P02': // Invalid text representation
        console.error('Invalid data format');
        break;
      case '42P01': // Undefined table
        console.error('Table does not exist');
        break;
      default:
        console.error('Database error:', error.message);
    }
    throw error;
  }
}
*/

console.log("✓ Error handling defined");

// 11. Best Practices
console.log("\n--- Best Practices ---");

/*
1. Connection Pooling:
   - Use Pool instead of Client for applications
   - Configure appropriate pool size
   - Always release clients back to the pool

2. Parameterized Queries:
   - Always use $1, $2, etc. for parameters
   - Never concatenate user input into SQL
   - Prevents SQL injection

3. Transactions:
   - Use for operations that must be atomic
   - Always include try-catch-finally
   - Rollback on errors
   - Release client in finally block

4. Error Handling:
   - Check PostgreSQL error codes
   - Provide meaningful error messages
   - Log errors appropriately

5. Performance:
   - Create indexes on frequently queried columns
   - Use EXPLAIN ANALYZE to optimize queries
   - Limit result sets with LIMIT
   - Use connection pooling

6. Schema Design:
   - Use appropriate data types
   - Add constraints (NOT NULL, UNIQUE, CHECK)
   - Create foreign keys for referential integrity
   - Use timestamps (created_at, updated_at)

7. Security:
   - Use environment variables for credentials
   - Use SSL for connections in production
   - Implement row-level security if needed
   - Grant minimum necessary privileges

8. Migrations:
   - Use migration tools (node-pg-migrate, knex)
   - Version control your schema
   - Test migrations before production

9. Testing:
   - Use separate database for testing
   - Clean up test data
   - Mock database calls in unit tests

10. Monitoring:
    - Log slow queries
    - Monitor connection pool usage
    - Track query performance
*/

console.log("\n✓ PostgreSQL concepts completed");
console.log("\nNote: Install required packages:");
console.log("  npm install pg");
console.log("  npm install pg-format (for safe SQL formatting)");

