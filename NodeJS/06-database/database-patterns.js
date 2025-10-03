/**
 * Database Design Patterns in Node.js
 * 
 * Common patterns for database interactions:
 * 1. Repository Pattern
 * 2. Active Record Pattern
 * 3. Data Mapper Pattern
 * 4. Unit of Work Pattern
 * 5. Query Object Pattern
 * 6. Connection Pool Pattern
 * 7. Database Factory Pattern
 * 8. Transaction Script Pattern
 */

// ============================================
// 1. REPOSITORY PATTERN
// ============================================
// Mediates between domain and data mapping layers
// Provides collection-like interface for accessing domain objects

class User {
  constructor(id, name, email, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }
}

// Abstract Repository Interface
class IRepository {
  async findById(id) {
    throw new Error('Method not implemented');
  }
  async findAll() {
    throw new Error('Method not implemented');
  }
  async save(entity) {
    throw new Error('Method not implemented');
  }
  async delete(id) {
    throw new Error('Method not implemented');
  }
}

// User Repository Implementation
class UserRepository extends IRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(row.id, row.name, row.email, row.created_at);
  }

  async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await this.db.query(query);
    
    return result.rows.map(row => 
      new User(row.id, row.name, row.email, row.created_at)
    );
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.db.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(row.id, row.name, row.email, row.created_at);
  }

  async save(user) {
    if (user.id) {
      // Update existing user
      const query = `
        UPDATE users 
        SET name = $1, email = $2 
        WHERE id = $3 
        RETURNING *
      `;
      const result = await this.db.query(query, [user.name, user.email, user.id]);
      const row = result.rows[0];
      return new User(row.id, row.name, row.email, row.created_at);
    } else {
      // Insert new user
      const query = `
        INSERT INTO users (name, email, created_at) 
        VALUES ($1, $2, NOW()) 
        RETURNING *
      `;
      const result = await this.db.query(query, [user.name, user.email]);
      const row = result.rows[0];
      return new User(row.id, row.name, row.email, row.created_at);
    }
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await this.db.query(query, [id]);
    return true;
  }

  async count() {
    const query = 'SELECT COUNT(*) FROM users';
    const result = await this.db.query(query);
    return parseInt(result.rows[0].count);
  }
}

// Usage Example
async function repositoryPatternExample() {
  const db = await getDatabase(); // Your database connection
  const userRepo = new UserRepository(db);

  // Create new user
  const newUser = new User(null, 'Alice Johnson', 'alice@example.com');
  const savedUser = await userRepo.save(newUser);
  console.log('Saved user:', savedUser);

  // Find user by ID
  const user = await userRepo.findById(savedUser.id);
  console.log('Found user:', user);

  // Find all users
  const allUsers = await userRepo.findAll();
  console.log('All users:', allUsers.length);

  // Delete user
  await userRepo.delete(savedUser.id);
  console.log('User deleted');
}

// ============================================
// 2. ACTIVE RECORD PATTERN
// ============================================
// Object carries both data and database operations

class ActiveRecordUser {
  constructor(db, id = null, name = '', email = '') {
    this.db = db;
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = null;
  }

  // Instance methods
  async save() {
    if (this.id) {
      // Update
      const query = `
        UPDATE users 
        SET name = $1, email = $2 
        WHERE id = $3 
        RETURNING *
      `;
      const result = await this.db.query(query, [this.name, this.email, this.id]);
      return this.loadFromRow(result.rows[0]);
    } else {
      // Insert
      const query = `
        INSERT INTO users (name, email, created_at) 
        VALUES ($1, $2, NOW()) 
        RETURNING *
      `;
      const result = await this.db.query(query, [this.name, this.email]);
      return this.loadFromRow(result.rows[0]);
    }
  }

  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete unsaved record');
    }
    const query = 'DELETE FROM users WHERE id = $1';
    await this.db.query(query, [this.id]);
    this.id = null;
    return true;
  }

  async reload() {
    if (!this.id) {
      throw new Error('Cannot reload unsaved record');
    }
    const user = await ActiveRecordUser.find(this.db, this.id);
    Object.assign(this, user);
    return this;
  }

  // Static methods (class-level queries)
  static async find(db, id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return new ActiveRecordUser(db).loadFromRow(result.rows[0]);
  }

  static async findAll(db) {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await db.query(query);
    
    return result.rows.map(row => 
      new ActiveRecordUser(db).loadFromRow(row)
    );
  }

  static async where(db, conditions) {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    
    const whereClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    
    const query = `SELECT * FROM users WHERE ${whereClause}`;
    const result = await db.query(query, values);
    
    return result.rows.map(row => 
      new ActiveRecordUser(db).loadFromRow(row)
    );
  }

  static async create(db, attributes) {
    const user = new ActiveRecordUser(db, null, attributes.name, attributes.email);
    return await user.save();
  }

  // Helper method
  loadFromRow(row) {
    this.id = row.id;
    this.name = row.name;
    this.email = row.email;
    this.createdAt = row.created_at;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    };
  }
}

// Usage Example
async function activeRecordExample() {
  const db = await getDatabase();

  // Create and save
  const user = await ActiveRecordUser.create(db, {
    name: 'Bob Smith',
    email: 'bob@example.com'
  });
  console.log('Created user:', user.toJSON());

  // Find
  const foundUser = await ActiveRecordUser.find(db, user.id);
  console.log('Found user:', foundUser.toJSON());

  // Update
  foundUser.name = 'Robert Smith';
  await foundUser.save();
  console.log('Updated user:', foundUser.toJSON());

  // Query with conditions
  const users = await ActiveRecordUser.where(db, { 
    email: 'bob@example.com' 
  });
  console.log('Found users:', users.length);

  // Delete
  await foundUser.delete();
  console.log('User deleted');
}

// ============================================
// 3. DATA MAPPER PATTERN
// ============================================
// Separates in-memory objects from database

// Domain Object (Plain JavaScript Object)
class UserEntity {
  constructor(id, name, email, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }

  // Business logic only - no database operations
  getDisplayName() {
    return this.name.toUpperCase();
  }

  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// Data Mapper (handles all database operations)
class UserMapper {
  constructor(database) {
    this.db = database;
  }

  // Map database row to domain object
  toDomainObject(row) {
    if (!row) return null;
    return new UserEntity(
      row.id,
      row.name,
      row.email,
      row.created_at
    );
  }

  // Map domain object to database row
  toDatabase(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt
    };
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return this.toDomainObject(result.rows[0]);
  }

  async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await this.db.query(query);
    return result.rows.map(row => this.toDomainObject(row));
  }

  async insert(user) {
    const query = `
      INSERT INTO users (name, email, created_at) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const result = await this.db.query(query, [
      user.name,
      user.email,
      user.createdAt || new Date()
    ]);
    return this.toDomainObject(result.rows[0]);
  }

  async update(user) {
    const query = `
      UPDATE users 
      SET name = $1, email = $2 
      WHERE id = $3 
      RETURNING *
    `;
    const result = await this.db.query(query, [
      user.name,
      user.email,
      user.id
    ]);
    return this.toDomainObject(result.rows[0]);
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await this.db.query(query, [id]);
    return true;
  }
}

// Usage Example
async function dataMapperExample() {
  const db = await getDatabase();
  const mapper = new UserMapper(db);

  // Create domain object
  const user = new UserEntity(null, 'Charlie Brown', 'charlie@example.com', new Date());
  
  // Use business logic
  console.log('Display name:', user.getDisplayName());
  console.log('Valid email:', user.isValidEmail());

  // Save through mapper
  const savedUser = await mapper.insert(user);
  console.log('Saved user:', savedUser);

  // Update
  savedUser.name = 'Charles Brown';
  const updatedUser = await mapper.update(savedUser);
  console.log('Updated user:', updatedUser);

  // Find
  const foundUser = await mapper.findById(updatedUser.id);
  console.log('Found user:', foundUser);

  // Delete
  await mapper.delete(foundUser.id);
  console.log('User deleted');
}

// ============================================
// 4. UNIT OF WORK PATTERN
// ============================================
// Maintains list of objects affected by business transaction
// Coordinates writing changes and resolving concurrency

class UnitOfWork {
  constructor(database) {
    this.db = database;
    this.newObjects = new Set();
    this.dirtyObjects = new Set();
    this.removedObjects = new Set();
    this.isCommitting = false;
  }

  registerNew(obj) {
    if (this.removedObjects.has(obj)) {
      throw new Error('Cannot register removed object as new');
    }
    if (!this.dirtyObjects.has(obj)) {
      this.newObjects.add(obj);
    }
  }

  registerDirty(obj) {
    if (!this.removedObjects.has(obj) && !this.newObjects.has(obj)) {
      this.dirtyObjects.add(obj);
    }
  }

  registerRemoved(obj) {
    if (this.newObjects.has(obj)) {
      this.newObjects.delete(obj);
      return;
    }
    this.dirtyObjects.delete(obj);
    this.removedObjects.add(obj);
  }

  async commit() {
    if (this.isCommitting) {
      throw new Error('Already committing');
    }

    this.isCommitting = true;
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Insert new objects
      for (const obj of this.newObjects) {
        await this.insertObject(client, obj);
      }

      // Update dirty objects
      for (const obj of this.dirtyObjects) {
        await this.updateObject(client, obj);
      }

      // Delete removed objects
      for (const obj of this.removedObjects) {
        await this.deleteObject(client, obj);
      }

      await client.query('COMMIT');

      // Clear tracking sets
      this.newObjects.clear();
      this.dirtyObjects.clear();
      this.removedObjects.clear();

      console.log('✓ Transaction committed successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('✗ Transaction rolled back:', error.message);
      throw error;
    } finally {
      client.release();
      this.isCommitting = false;
    }
  }

  async insertObject(client, obj) {
    if (obj.constructor.name === 'UserEntity') {
      const query = `
        INSERT INTO users (name, email, created_at) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `;
      const result = await client.query(query, [
        obj.name,
        obj.email,
        new Date()
      ]);
      obj.id = result.rows[0].id;
    }
    // Add more object types as needed
  }

  async updateObject(client, obj) {
    if (obj.constructor.name === 'UserEntity') {
      const query = `
        UPDATE users 
        SET name = $1, email = $2 
        WHERE id = $3
      `;
      await client.query(query, [obj.name, obj.email, obj.id]);
    }
  }

  async deleteObject(client, obj) {
    if (obj.constructor.name === 'UserEntity') {
      const query = 'DELETE FROM users WHERE id = $1';
      await client.query(query, [obj.id]);
    }
  }

  rollback() {
    this.newObjects.clear();
    this.dirtyObjects.clear();
    this.removedObjects.clear();
  }
}

// Usage Example
async function unitOfWorkExample() {
  const db = await getDatabase();
  const uow = new UnitOfWork(db);

  // Create multiple objects
  const user1 = new UserEntity(null, 'User 1', 'user1@example.com');
  const user2 = new UserEntity(null, 'User 2', 'user2@example.com');
  const user3 = new UserEntity(3, 'User 3', 'user3@example.com');

  // Register changes
  uow.registerNew(user1);
  uow.registerNew(user2);
  
  user3.name = 'Updated User 3';
  uow.registerDirty(user3);

  // Commit all changes in single transaction
  try {
    await uow.commit();
    console.log('All changes committed');
    console.log('User 1 ID:', user1.id);
    console.log('User 2 ID:', user2.id);
  } catch (error) {
    console.error('Commit failed:', error);
  }
}

// ============================================
// 5. QUERY OBJECT PATTERN
// ============================================
// Encapsulates database queries in objects

class QueryObject {
  constructor(database) {
    this.db = database;
    this.table = '';
    this.selectFields = ['*'];
    this.whereConditions = [];
    this.parameters = [];
    this.orderByFields = [];
    this.limitValue = null;
    this.offsetValue = null;
    this.joins = [];
  }

  from(table) {
    this.table = table;
    return this;
  }

  select(...fields) {
    this.selectFields = fields;
    return this;
  }

  where(condition, ...params) {
    this.whereConditions.push(condition);
    this.parameters.push(...params);
    return this;
  }

  andWhere(condition, ...params) {
    return this.where(condition, ...params);
  }

  orWhere(condition, ...params) {
    if (this.whereConditions.length > 0) {
      this.whereConditions.push('OR ' + condition);
    } else {
      this.whereConditions.push(condition);
    }
    this.parameters.push(...params);
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this.orderByFields.push(`${field} ${direction}`);
    return this;
  }

  limit(value) {
    this.limitValue = value;
    return this;
  }

  offset(value) {
    this.offsetValue = value;
    return this;
  }

  join(table, condition) {
    this.joins.push(`JOIN ${table} ON ${condition}`);
    return this;
  }

  leftJoin(table, condition) {
    this.joins.push(`LEFT JOIN ${table} ON ${condition}`);
    return this;
  }

  build() {
    let sql = `SELECT ${this.selectFields.join(', ')} FROM ${this.table}`;

    if (this.joins.length > 0) {
      sql += ' ' + this.joins.join(' ');
    }

    if (this.whereConditions.length > 0) {
      sql += ' WHERE ' + this.whereConditions.join(' AND ');
    }

    if (this.orderByFields.length > 0) {
      sql += ' ORDER BY ' + this.orderByFields.join(', ');
    }

    if (this.limitValue !== null) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== null) {
      sql += ` OFFSET ${this.offsetValue}`;
    }

    return { sql, parameters: this.parameters };
  }

  async execute() {
    const { sql, parameters } = this.build();
    console.log('Executing:', sql, parameters);
    const result = await this.db.query(sql, parameters);
    return result.rows;
  }

  async first() {
    this.limit(1);
    const results = await this.execute();
    return results[0] || null;
  }

  async count() {
    this.selectFields = ['COUNT(*) as count'];
    const results = await this.execute();
    return parseInt(results[0].count);
  }
}

// Usage Example
async function queryObjectExample() {
  const db = await getDatabase();

  // Simple query
  const users = await new QueryObject(db)
    .from('users')
    .where('email LIKE $1', '%@example.com')
    .orderBy('created_at', 'DESC')
    .limit(10)
    .execute();
  console.log('Users:', users);

  // Complex query with joins
  const usersWithOrders = await new QueryObject(db)
    .select('users.id', 'users.name', 'COUNT(orders.id) as order_count')
    .from('users')
    .leftJoin('orders', 'users.id = orders.user_id')
    .where('users.created_at > $1', '2024-01-01')
    .orderBy('order_count', 'DESC')
    .limit(5)
    .execute();
  console.log('Users with orders:', usersWithOrders);

  // Get first result
  const user = await new QueryObject(db)
    .from('users')
    .where('email = $1', 'alice@example.com')
    .first();
  console.log('User:', user);

  // Count query
  const userCount = await new QueryObject(db)
    .from('users')
    .where('created_at > $1', '2024-01-01')
    .count();
  console.log('User count:', userCount);
}

// ============================================
// 6. CONNECTION POOL PATTERN
// ============================================
// Manages database connections efficiently

class ConnectionPool {
  constructor(config) {
    this.config = config;
    this.pool = [];
    this.activeConnections = new Set();
    this.maxConnections = config.max || 10;
    this.minConnections = config.min || 2;
    this.idleTimeout = config.idleTimeout || 30000;
  }

  async initialize() {
    // Create minimum number of connections
    for (let i = 0; i < this.minConnections; i++) {
      const conn = await this.createConnection();
      this.pool.push(conn);
    }
    console.log(`✓ Connection pool initialized with ${this.minConnections} connections`);
  }

  async createConnection() {
    // Simulate creating database connection
    const connection = {
      id: Math.random().toString(36).substring(7),
      lastUsed: Date.now(),
      query: async (sql, params) => {
        // Simulate query execution
        console.log(`[${connection.id}] Executing query`);
        return { rows: [] };
      }
    };
    return connection;
  }

  async acquire() {
    // Check for available connection in pool
    if (this.pool.length > 0) {
      const connection = this.pool.pop();
      this.activeConnections.add(connection);
      connection.lastUsed = Date.now();
      console.log(`✓ Acquired connection ${connection.id} from pool`);
      return connection;
    }

    // Create new connection if under max limit
    if (this.activeConnections.size < this.maxConnections) {
      const connection = await this.createConnection();
      this.activeConnections.add(connection);
      console.log(`✓ Created new connection ${connection.id}`);
      return connection;
    }

    // Wait for available connection
    console.log('⏳ Waiting for available connection...');
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.acquire();
  }

  release(connection) {
    if (!this.activeConnections.has(connection)) {
      throw new Error('Connection not in active pool');
    }

    this.activeConnections.delete(connection);
    connection.lastUsed = Date.now();
    this.pool.push(connection);
    console.log(`✓ Released connection ${connection.id} back to pool`);
  }

  async execute(callback) {
    const connection = await this.acquire();
    try {
      return await callback(connection);
    } finally {
      this.release(connection);
    }
  }

  async cleanup() {
    const now = Date.now();
    const toRemove = [];

    for (const conn of this.pool) {
      if (now - conn.lastUsed > this.idleTimeout && 
          this.pool.length > this.minConnections) {
        toRemove.push(conn);
      }
    }

    for (const conn of toRemove) {
      const index = this.pool.indexOf(conn);
      this.pool.splice(index, 1);
      console.log(`✓ Removed idle connection ${conn.id}`);
    }
  }

  getStats() {
    return {
      poolSize: this.pool.length,
      activeConnections: this.activeConnections.size,
      totalConnections: this.pool.length + this.activeConnections.size
    };
  }

  async close() {
    // Close all connections
    for (const conn of this.pool) {
      console.log(`✓ Closing connection ${conn.id}`);
    }
    for (const conn of this.activeConnections) {
      console.log(`✓ Closing active connection ${conn.id}`);
    }
    this.pool = [];
    this.activeConnections.clear();
  }
}

// Usage Example
async function connectionPoolExample() {
  const pool = new ConnectionPool({
    max: 10,
    min: 2,
    idleTimeout: 30000
  });

  await pool.initialize();

  // Execute query using pool
  const result = await pool.execute(async (connection) => {
    return await connection.query('SELECT * FROM users WHERE id = $1', [1]);
  });

  console.log('Query result:', result);
  console.log('Pool stats:', pool.getStats());

  // Cleanup idle connections
  await pool.cleanup();

  // Close pool
  await pool.close();
}

// ============================================
// 7. DATABASE FACTORY PATTERN
// ============================================
// Creates appropriate database adapter based on configuration

class DatabaseFactory {
  static create(type, config) {
    switch (type.toLowerCase()) {
      case 'postgresql':
      case 'postgres':
        return new PostgreSQLAdapter(config);
      case 'mongodb':
      case 'mongo':
        return new MongoDBAdapter(config);
      case 'mysql':
        return new MySQLAdapter(config);
      case 'sqlite':
        return new SQLiteAdapter(config);
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
}

// Base Database Adapter
class DatabaseAdapter {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    throw new Error('Method must be implemented');
  }

  async disconnect() {
    throw new Error('Method must be implemented');
  }

  async query(sql, params) {
    throw new Error('Method must be implemented');
  }
}

// PostgreSQL Adapter
class PostgreSQLAdapter extends DatabaseAdapter {
  async connect() {
    console.log('Connecting to PostgreSQL...');
    // const { Client } = require('pg');
    // this.connection = new Client(this.config);
    // await this.connection.connect();
  }

  async query(sql, params) {
    console.log('[PostgreSQL] Query:', sql);
    // return await this.connection.query(sql, params);
  }

  async disconnect() {
    console.log('Disconnecting from PostgreSQL...');
    // await this.connection.end();
  }
}

// MongoDB Adapter
class MongoDBAdapter extends DatabaseAdapter {
  async connect() {
    console.log('Connecting to MongoDB...');
    // const { MongoClient } = require('mongodb');
    // this.connection = await MongoClient.connect(this.config.uri);
  }

  async query(collection, filter) {
    console.log('[MongoDB] Query:', collection, filter);
    // const db = this.connection.db(this.config.database);
    // return await db.collection(collection).find(filter).toArray();
  }

  async disconnect() {
    console.log('Disconnecting from MongoDB...');
    // await this.connection.close();
  }
}

// MySQL Adapter
class MySQLAdapter extends DatabaseAdapter {
  async connect() {
    console.log('Connecting to MySQL...');
    // const mysql = require('mysql2/promise');
    // this.connection = await mysql.createConnection(this.config);
  }

  async query(sql, params) {
    console.log('[MySQL] Query:', sql);
    // const [rows] = await this.connection.execute(sql, params);
    // return rows;
  }

  async disconnect() {
    console.log('Disconnecting from MySQL...');
    // await this.connection.end();
  }
}

// SQLite Adapter
class SQLiteAdapter extends DatabaseAdapter {
  async connect() {
    console.log('Connecting to SQLite...');
    // const sqlite3 = require('sqlite3');
    // const { open } = require('sqlite');
    // this.connection = await open({
    //   filename: this.config.filename,
    //   driver: sqlite3.Database
    // });
  }

  async query(sql, params) {
    console.log('[SQLite] Query:', sql);
    // return await this.connection.all(sql, params);
  }

  async disconnect() {
    console.log('Disconnecting from SQLite...');
    // await this.connection.close();
  }
}

// Usage Example
async function databaseFactoryExample() {
  // Create PostgreSQL adapter
  const pgAdapter = DatabaseFactory.create('postgresql', {
    host: 'localhost',
    port: 5432,
    database: 'mydb',
    user: 'user',
    password: 'password'
  });

  await pgAdapter.connect();
  await pgAdapter.query('SELECT * FROM users', []);
  await pgAdapter.disconnect();

  // Create MongoDB adapter
  const mongoAdapter = DatabaseFactory.create('mongodb', {
    uri: 'mongodb://localhost:27017',
    database: 'mydb'
  });

  await mongoAdapter.connect();
  await mongoAdapter.query('users', { email: 'test@example.com' });
  await mongoAdapter.disconnect();
}

// ============================================
// 8. TRANSACTION SCRIPT PATTERN
// ============================================
// Organizes business logic by procedures

class TransactionScript {
  constructor(database) {
    this.db = database;
  }

  async transferMoney(fromAccountId, toAccountId, amount) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Check source account balance
      const sourceQuery = 'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE';
      const sourceResult = await client.query(sourceQuery, [fromAccountId]);
      
      if (sourceResult.rows.length === 0) {
        throw new Error('Source account not found');
      }

      const sourceBalance = parseFloat(sourceResult.rows[0].balance);
      
      if (sourceBalance < amount) {
        throw new Error('Insufficient funds');
      }

      // Deduct from source account
      const deductQuery = 'UPDATE accounts SET balance = balance - $1 WHERE id = $2';
      await client.query(deductQuery, [amount, fromAccountId]);

      // Add to destination account
      const addQuery = 'UPDATE accounts SET balance = balance + $1 WHERE id = $2';
      await client.query(addQuery, [amount, toAccountId]);

      // Record transaction
      const transactionQuery = `
        INSERT INTO transactions (from_account, to_account, amount, created_at)
        VALUES ($1, $2, $3, NOW())
      `;
      await client.query(transactionQuery, [fromAccountId, toAccountId, amount]);

      await client.query('COMMIT');
      
      console.log(`✓ Transferred $${amount} from ${fromAccountId} to ${toAccountId}`);
      return true;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('✗ Transaction failed:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  async placeOrder(userId, items) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Calculate total
      let total = 0;
      for (const item of items) {
        total += item.price * item.quantity;
      }

      // Create order
      const orderQuery = `
        INSERT INTO orders (user_id, total, status, created_at)
        VALUES ($1, $2, 'pending', NOW())
        RETURNING id
      `;
      const orderResult = await client.query(orderQuery, [userId, total]);
      const orderId = orderResult.rows[0].id;

      // Add order items
      for (const item of items) {
        const itemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
        `;
        await client.query(itemQuery, [
          orderId,
          item.productId,
          item.quantity,
          item.price
        ]);

        // Update inventory
        const inventoryQuery = `
          UPDATE products 
          SET stock = stock - $1 
          WHERE id = $2 AND stock >= $1
        `;
        const inventoryResult = await client.query(inventoryQuery, [
          item.quantity,
          item.productId
        ]);

        if (inventoryResult.rowCount === 0) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
      }

      await client.query('COMMIT');
      
      console.log(`✓ Order ${orderId} placed successfully`);
      return orderId;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('✗ Order failed:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Usage Example
async function transactionScriptExample() {
  const db = await getDatabase();
  const script = new TransactionScript(db);

  // Transfer money
  try {
    await script.transferMoney('account-1', 'account-2', 100);
  } catch (error) {
    console.error('Transfer failed:', error);
  }

  // Place order
  try {
    const orderId = await script.placeOrder('user-123', [
      { productId: 'prod-1', quantity: 2, price: 29.99 },
      { productId: 'prod-2', quantity: 1, price: 49.99 }
    ]);
    console.log('Order placed:', orderId);
  } catch (error) {
    console.error('Order failed:', error);
  }
}

// ============================================
// HELPER FUNCTION
// ============================================

async function getDatabase() {
  // Mock database connection
  return {
    query: async (sql, params) => {
      console.log('Query:', sql, params);
      return { rows: [] };
    },
    connect: async () => {
      return {
        query: async (sql, params) => {
          console.log('Query:', sql, params);
          return { rows: [], rowCount: 1 };
        },
        release: () => console.log('Connection released')
      };
    }
  };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Repository Pattern
  IRepository,
  UserRepository,
  
  // Active Record Pattern
  ActiveRecordUser,
  
  // Data Mapper Pattern
  UserEntity,
  UserMapper,
  
  // Unit of Work Pattern
  UnitOfWork,
  
  // Query Object Pattern
  QueryObject,
  
  // Connection Pool Pattern
  ConnectionPool,
  
  // Database Factory Pattern
  DatabaseFactory,
  DatabaseAdapter,
  PostgreSQLAdapter,
  MongoDBAdapter,
  MySQLAdapter,
  SQLiteAdapter,
  
  // Transaction Script Pattern
  TransactionScript
};

// ============================================
// MAIN EXECUTION (for testing)
// ============================================

if (require.main === module) {
  console.log('='.repeat(60));
  console.log('DATABASE DESIGN PATTERNS EXAMPLES');
  console.log('='.repeat(60));

  (async () => {
    console.log('\n1. Repository Pattern Example:');
    console.log('-'.repeat(60));
    // await repositoryPatternExample();

    console.log('\n2. Active Record Pattern Example:');
    console.log('-'.repeat(60));
    // await activeRecordExample();

    console.log('\n3. Data Mapper Pattern Example:');
    console.log('-'.repeat(60));
    // await dataMapperExample();

    console.log('\n4. Unit of Work Pattern Example:');
    console.log('-'.repeat(60));
    // await unitOfWorkExample();

    console.log('\n5. Query Object Pattern Example:');
    console.log('-'.repeat(60));
    // await queryObjectExample();

    console.log('\n6. Connection Pool Pattern Example:');
    console.log('-'.repeat(60));
    await connectionPoolExample();

    console.log('\n7. Database Factory Pattern Example:');
    console.log('-'.repeat(60));
    await databaseFactoryExample();

    console.log('\n8. Transaction Script Pattern Example:');
    console.log('-'.repeat(60));
    // await transactionScriptExample();

    console.log('\n' + '='.repeat(60));
    console.log('All examples completed!');
    console.log('='.repeat(60));
  })();
}

