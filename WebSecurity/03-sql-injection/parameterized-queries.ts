// SQL Injection Prevention with Parameterized Queries
// Safe database query patterns

import { Pool, QueryResult } from 'pg';
import mysql from 'mysql2/promise';

// ============================================================================
// 1. POSTGRESQL PARAMETERIZED QUERIES
// ============================================================================

/**
 * PostgreSQL parameterized queries
 * Uses $1, $2, etc. as placeholders
 */
export class PostgreSQLQueries {
  constructor(private pool: Pool) {}
  
  /**
   * Safe SELECT query
   */
  async getUserById(userId: number): Promise<any> {
    // ✅ Safe: Parameterized query
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows[0];
  }
  
  /**
   * Safe INSERT query
   */
  async createUser(username: string, email: string, password: string): Promise<any> {
    // ✅ Safe: Parameters
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `;
    const result = await this.pool.query(query, [username, email, password]);
    return result.rows[0];
  }
  
  /**
   * Safe UPDATE query
   */
  async updateUser(userId: number, updates: { username?: string; email?: string }): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updates.username) {
      fields.push(`username = $${paramIndex++}`);
      values.push(updates.username);
    }
    
    if (updates.email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}`;
    
    await this.pool.query(query, values);
  }
  
  /**
   * Safe DELETE query
   */
  async deleteUser(userId: number): Promise<void> {
    // ✅ Safe: Parameterized
    const query = 'DELETE FROM users WHERE id = $1';
    await this.pool.query(query, [userId]);
  }
  
  /**
   * Safe search with LIKE
   */
  async searchUsers(searchTerm: string): Promise<any[]> {
    // ✅ Safe: Parameterized LIKE
    const query = 'SELECT * FROM users WHERE username LIKE $1';
    const result = await this.pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
  
  /**
   * Safe IN clause
   */
  async getUsersByIds(userIds: number[]): Promise<any[]> {
    // ✅ Safe: Use ANY with array
    const query = 'SELECT * FROM users WHERE id = ANY($1::int[])';
    const result = await this.pool.query(query, [userIds]);
    return result.rows;
  }
}

// ============================================================================
// 2. MYSQL PARAMETERIZED QUERIES
// ============================================================================

/**
 * MySQL parameterized queries
 * Uses ? as placeholders
 */
export class MySQLQueries {
  constructor(private connection: mysql.Pool) {}
  
  /**
   * Safe SELECT query
   */
  async getUserById(userId: number): Promise<any> {
    // ✅ Safe: Parameterized query
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await this.connection.execute(query, [userId]);
    return (rows as any[])[0];
  }
  
  /**
   * Safe INSERT query
   */
  async createUser(username: string, email: string, password: string): Promise<any> {
    // ✅ Safe: Parameters
    const query = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `;
    const [result] = await this.connection.execute(query, [username, email, password]);
    return result;
  }
  
  /**
   * Safe IN clause
   */
  async getUsersByIds(userIds: number[]): Promise<any[]> {
    // ✅ Safe: Build placeholders dynamically
    const placeholders = userIds.map(() => '?').join(',');
    const query = `SELECT * FROM users WHERE id IN (${placeholders})`;
    const [rows] = await this.connection.execute(query, userIds);
    return rows as any[];
  }
  
  /**
   * Safe search with LIKE
   */
  async searchUsers(searchTerm: string): Promise<any[]> {
    // ✅ Safe: Parameterized LIKE
    const query = 'SELECT * FROM users WHERE username LIKE ?';
    const [rows] = await this.connection.execute(query, [`%${searchTerm}%`]);
    return rows as any[];
  }
}

// ============================================================================
// 3. DYNAMIC QUERY BUILDING (Safe)
// ============================================================================

/**
 * Safely build dynamic queries
 * Only use whitelisted columns and operators
 */
export class SafeQueryBuilder {
  private static ALLOWED_COLUMNS = ['id', 'username', 'email', 'created_at'];
  private static ALLOWED_OPERATORS = ['=', '!=', '>', '<', '>=', '<='];
  
  /**
   * Build WHERE clause safely
   */
  static buildWhereClause(filters: Record<string, any>): { query: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;
    
    for (const [column, value] of Object.entries(filters)) {
      // Whitelist check
      if (!this.ALLOWED_COLUMNS.includes(column)) {
        throw new Error(`Invalid column: ${column}`);
      }
      
      // Handle different value types
      if (Array.isArray(value)) {
        // IN clause
        const placeholders = value.map(() => `$${paramIndex++}`).join(',');
        conditions.push(`${column} IN (${placeholders})`);
        params.push(...value);
      } else if (typeof value === 'object' && value.operator && value.value) {
        // Operator-based condition
        if (!this.ALLOWED_OPERATORS.includes(value.operator)) {
          throw new Error(`Invalid operator: ${value.operator}`);
        }
        conditions.push(`${column} ${value.operator} $${paramIndex++}`);
        params.push(value.value);
      } else {
        // Equality
        conditions.push(`${column} = $${paramIndex++}`);
        params.push(value);
      }
    }
    
    return {
      query: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params
    };
  }
  
  /**
   * Build ORDER BY safely
   */
  static buildOrderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): string {
    if (!this.ALLOWED_COLUMNS.includes(column)) {
      throw new Error(`Invalid column: ${column}`);
    }
    
    if (direction !== 'ASC' && direction !== 'DESC') {
      throw new Error('Invalid direction');
    }
    
    return `ORDER BY ${column} ${direction}`;
  }
}

// ============================================================================
// 4. USING ORMS (SAFEST)
// ============================================================================

/**
 * Example using Sequelize ORM
 * ORMs automatically use parameterized queries
 */
/*
import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize('database', 'user', 'password', {
  dialect: 'postgres'
});

class User extends Model {}
User.init({
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, { sequelize, modelName: 'user' });

// ✅ Safe: ORM uses parameterized queries
export async function getUserById(userId: number) {
  return await User.findByPk(userId);
}

export async function createUser(username: string, email: string, password: string) {
  return await User.create({ username, email, password });
}

export async function searchUsers(searchTerm: string) {
  return await User.findAll({
    where: {
      username: {
        [Op.like]: `%${searchTerm}%`
      }
    }
  });
}
*/

// ============================================================================
// 5. PREPARED STATEMENTS
// ============================================================================

/**
 * Using prepared statements (PostgreSQL)
 * Prepared statements are pre-compiled and cached
 */
export class PreparedStatements {
  constructor(private pool: Pool) {}
  
  /**
   * Prepare statement once, reuse multiple times
   */
  async initialize() {
    // Prepare statement
    await this.pool.query(`
      PREPARE get_user AS
      SELECT * FROM users WHERE id = $1
    `);
  }
  
  /**
   * Execute prepared statement
   */
  async getUserById(userId: number): Promise<any> {
    const result = await this.pool.query('EXECUTE get_user($1)', [userId]);
    return result.rows[0];
  }
  
  /**
   * Deallocate prepared statement
   */
  async cleanup() {
    await this.pool.query('DEALLOCATE get_user');
  }
}

// ============================================================================
// 6. TRANSACTION SAFETY
// ============================================================================

/**
 * Safe transactions with parameterized queries
 */
export class SafeTransactions {
  constructor(private pool: Pool) {}
  
  /**
   * Transfer money safely
   */
  async transferMoney(fromUserId: number, toUserId: number, amount: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // ✅ Safe: Parameterized queries in transaction
      await client.query(
        'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
        [amount, fromUserId]
      );
      
      await client.query(
        'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
        [amount, toUserId]
      );
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

// ============================================================================
// 7. INPUT VALIDATION BEFORE QUERIES
// ============================================================================

import { z } from 'zod';

/**
 * Validate input before using in queries
 */
export const userIdSchema = z.number().int().positive();
export const usernameSchema = z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/);
export const emailSchema = z.string().email();

export function validateUserId(input: unknown): number {
  return userIdSchema.parse(input);
}

export function validateUsername(input: unknown): string {
  return usernameSchema.parse(input);
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example: Safe user lookup
async function getUserSafe(userIdInput: unknown) {
  // 1. Validate input
  const userId = validateUserId(userIdInput);
  
  // 2. Use parameterized query
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const queries = new PostgreSQLQueries(pool);
  
  // 3. Execute safely
  return await queries.getUserById(userId);
}
*/

export default {
  PostgreSQLQueries,
  MySQLQueries,
  SafeQueryBuilder,
  PreparedStatements,
  SafeTransactions,
  validateUserId,
  validateUsername
};

