// Write-Through Pattern
// Data is written to cache AND database simultaneously

/*
Flow:
1. Application writes data
2. Data goes to BOTH cache and database (synchronously)
3. Write only succeeds if both succeed
4. Reads always hit cache (fast)
*/

class WriteThroughCache {
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
  }

  async write(key, value, ttl = 3600) {
    console.log(`  [WRITE-THROUGH] Writing ${key}`);

    // Write to both cache and database simultaneously
    await Promise.all([
      this.cache.set(key, value, ttl),
      this.database.save(key, value)
    ]);

    console.log(`  [SUCCESS] ${key} written to cache and database`);
  }

  async read(key) {
    // Always read from cache first (should always be there)
    let data = await this.cache.get(key);

    if (data) {
      console.log(`  [HIT] ${key} from cache`);
      return data;
    }

    // Cache miss (shouldn't happen often with write-through)
    console.log(`  [MISS] ${key} - loading from database`);
    data = await this.database.query(key);

    if (data) {
      await this.cache.set(key, data, 3600);
    }

    return data;
  }

  async update(key, updates, ttl = 3600) {
    console.log(`  [UPDATE] Updating ${key}`);

    // Read current data
    const current = await this.read(key);
    if (!current) {
      throw new Error(`${key} not found`);
    }

    // Merge updates
    const updated = { ...current, ...updates };

    // Write through to both
    await this.write(key, updated, ttl);
  }

  async delete(key) {
    console.log(`  [DELETE] Deleting ${key}`);

    // Delete from both cache and database
    await Promise.all([
      this.cache.delete(key),
      this.database.delete(key)
    ]);

    console.log(`  [SUCCESS] ${key} deleted from both`);
  }
}

// ============================================================================
// PRODUCTION IMPLEMENTATION WITH ERROR HANDLING
// ============================================================================

class ProductionWriteThrough {
  constructor(redisClient, database) {
    this.redis = redisClient;
    this.db = database;
  }

  async writeUser(userId, userData) {
    const cacheKey = `user:${userId}`;

    try {
      // Write to both cache and database
      await Promise.all([
        this.redis.setex(cacheKey, 3600, JSON.stringify(userData)),
        this.db.query(
          'INSERT INTO users SET ? ON DUPLICATE KEY UPDATE ?',
          [userData, userData]
        )
      ]);

      console.log(`✓ User ${userId} written through`);
      return userData;
    } catch (error) {
      // If either fails, rollback
      console.error('Write-through failed:', error);

      // Attempt to remove from cache if DB write failed
      try {
        await this.redis.del(cacheKey);
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }

      throw error;
    }
  }

  async readUser(userId) {
    const cacheKey = `user:${userId}`;

    try {
      // Try cache first
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        console.log(`✓ Cache hit: user ${userId}`);
        return JSON.parse(cached);
      }

      // Cache miss (rare in write-through)
      console.log(`✗ Cache miss: user ${userId}`);
      const user = await this.db.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (user) {
        // Populate cache
        await this.redis.setex(cacheKey, 3600, JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.error('Read failed:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    const cacheKey = `user:${userId}`;

    // Get current data
    const current = await this.readUser(userId);
    if (!current) {
      throw new Error(`User ${userId} not found`);
    }

    const updated = { ...current, ...updates, updated_at: new Date() };

    // Write through
    await this.writeUser(userId, updated);

    console.log(`✓ User ${userId} updated`);
    return updated;
  }
}

// ============================================================================
// ADVANCED: WRITE-THROUGH WITH TRANSACTION
// ============================================================================

class WriteThrough WithTransaction {
  constructor(cache, database) {
    this.cache = cache;
    this.db = database;
  }

  async write(key, value) {
    // Start transaction
    const transaction = await this.db.beginTransaction();

    try {
      // Write to database first
      await transaction.query('INSERT INTO data SET ?', [{ key, value }]);

      // Write to cache
      await this.cache.set(key, value, 3600);

      // Commit transaction
      await transaction.commit();

      console.log(`  [SUCCESS] ${key} committed`);
      return true;
    } catch (error) {
      // Rollback database transaction
      await transaction.rollback();

      // Remove from cache if it was written
      await this.cache.delete(key);

      console.error(`  [FAILED] ${key} rolled back`);
      throw error;
    }
  }
}

// ============================================================================
// EXAMPLES
// ============================================================================

async function runExamples() {
  console.log('=== Write-Through Pattern Examples ===\n');

  // Mock implementations
  const mockCache = {
    storage: new Map(),
    async get(key) {
      return this.storage.get(key);
    },
    async set(key, value, ttl) {
      this.storage.set(key, value);
    },
    async delete(key) {
      this.storage.delete(key);
    }
  };

  const mockDatabase = {
    storage: new Map(),
    async save(key, value) {
      await new Promise(resolve => setTimeout(resolve, 50));
      this.storage.set(key, value);
    },
    async query(key) {
      await new Promise(resolve => setTimeout(resolve, 50));
      return this.storage.get(key);
    },
    async delete(key) {
      await new Promise(resolve => setTimeout(resolve, 50));
      this.storage.delete(key);
    }
  };

  // Example 1: Basic write-through
  console.log('Example 1: Basic Write-Through\n');
  const writeThrough = new WriteThroughCache(mockCache, mockDatabase);

  await writeThrough.write('user:1', {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  });

  // Read - should always hit cache
  await writeThrough.read('user:1');
  await writeThrough.read('user:1');
  await writeThrough.read('user:1');
  console.log('(All reads hit cache)');
  console.log();

  // Example 2: Update operation
  console.log('Example 2: Update Operation\n');

  await writeThrough.update('user:1', { name: 'John Updated' });

  const updated = await writeThrough.read('user:1');
  console.log('  Updated user:', updated);
  console.log();

  // Example 3: Delete operation
  console.log('Example 3: Delete Operation\n');

  await writeThrough.delete('user:1');

  const deleted = await writeThrough.read('user:1');
  console.log('  After delete:', deleted);
  console.log();

  // Example 4: Multiple writes
  console.log('Example 4: Multiple Concurrent Writes\n');

  await Promise.all([
    writeThrough.write('user:1', { id: 1, name: 'User 1' }),
    writeThrough.write('user:2', { id: 2, name: 'User 2' }),
    writeThrough.write('user:3', { id: 3, name: 'User 3' })
  ]);

  console.log('All users written successfully');
}

// Run examples
runExamples().catch(console.error);

// ============================================================================
// COMPARISON: WRITE-THROUGH VS CACHE-ASIDE
// ============================================================================

/*
WRITE-THROUGH:
  Write: Cache + DB (synchronous)
  Read: Cache only (fast)
  
CACHE-ASIDE:
  Write: DB only, invalidate cache
  Read: Cache, if miss then DB

WRITE-THROUGH PROS:
✅ Cache always has latest data
✅ No cache misses for written data
✅ Simpler read logic
✅ Good for read-heavy workloads
✅ Strong consistency

WRITE-THROUGH CONS:
❌ Slower writes (must wait for both)
❌ Write penalty even for data rarely read
❌ More complex error handling
❌ Cache bloat (everything is cached)
❌ Both cache and DB must be available

WHEN TO USE WRITE-THROUGH:
✅ Read-heavy applications
✅ When consistency is critical
✅ When reads must be fast
✅ Financial systems
✅ Inventory management
✅ User profiles

WHEN NOT TO USE:
❌ Write-heavy applications
❌ When writes need to be fast
❌ When eventual consistency is acceptable
❌ When cache failures should be transparent

BEST PRACTICES:
1. Use transactions for atomicity
2. Implement proper rollback
3. Handle cache failures gracefully
4. Monitor write latency
5. Set appropriate TTL
6. Consider write-behind for write-heavy loads
7. Use for critical data only

PERFORMANCE CHARACTERISTICS:
- Read: 1-5ms (cache hit)
- Write: 50-100ms (cache + DB)
- Consistency: Strong (always in sync)
- Complexity: Medium-High

REAL-WORLD USAGE:
- User session data
- Shopping cart contents
- User preferences
- Configuration data
- Account balances
*/

module.exports = { WriteThroughCache, ProductionWriteThrough };

