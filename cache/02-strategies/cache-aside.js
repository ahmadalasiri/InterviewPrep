// Cache-Aside Pattern (Lazy Loading)
// Most common caching pattern where application manages cache explicitly

/*
Flow:
1. Application checks cache first
2. If HIT → return cached data
3. If MISS → fetch from database
4. Store in cache
5. Return data
*/

class CacheAsideExample {
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
    this.stats = { hits: 0, misses: 0 };
  }

  async get(key) {
    // Step 1: Try cache first
    let data = await this.cache.get(key);
    
    if (data !== undefined) {
      console.log(`  [HIT] Found ${key} in cache`);
      this.stats.hits++;
      return data;
    }

    // Step 2: Cache miss - fetch from database
    console.log(`  [MISS] ${key} not in cache - querying database`);
    this.stats.misses++;
    data = await this.database.query(key);
    
    if (data === null) {
      return null;  // Don't cache null results
    }

    // Step 3: Store in cache
    await this.cache.set(key, data, 3600);  // 1 hour TTL
    console.log(`  [CACHED] Stored ${key} in cache`);
    
    return data;
  }

  async update(key, newData) {
    // Update database
    await this.database.update(key, newData);
    
    // Strategy 1: Invalidate cache (lazy reload)
    await this.cache.delete(key);
    console.log(`  [INVALIDATED] ${key} removed from cache`);
    
    // Alternative Strategy 2: Update cache immediately
    // await this.cache.set(key, newData, 3600);
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;
    
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: `${hitRate}%`
    };
  }
}

// ============================================================================
// IMPLEMENTATION WITH REDIS (Production-ready)
// ============================================================================

class ProductionCacheAside {
  constructor(redisClient, database) {
    this.redis = redisClient;
    this.db = database;
  }

  async getUser(userId) {
    const cacheKey = `user:${userId}`;
    
    try {
      // Try Redis cache
      const cached = await this.redis.get(cacheKey);
      
      if (cached) {
        console.log(`✓ Cache hit: user ${userId}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Cache error:', error);
      // Continue to database if cache fails
    }

    // Cache miss - query database
    console.log(`✗ Cache miss: user ${userId}`);
    const user = await this.db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (!user) {
      return null;
    }

    // Store in cache
    try {
      await this.redis.setex(cacheKey, 3600, JSON.stringify(user));
      console.log(`  Cached user ${userId}`);
    } catch (error) {
      console.error('Failed to cache:', error);
      // Not critical - return data anyway
    }
    
    return user;
  }

  async updateUser(userId, updates) {
    const cacheKey = `user:${userId}`;
    
    // Update database
    await this.db.query(
      'UPDATE users SET ? WHERE id = ?',
      [updates, userId]
    );
    
    // Invalidate cache
    await this.redis.del(cacheKey);
    
    // Also invalidate related caches
    await this.redis.del(`user:${userId}:profile`);
    await this.redis.del(`user:${userId}:posts`);
    
    console.log(`  Updated and invalidated caches for user ${userId}`);
  }

  async deleteUser(userId) {
    // Delete from database
    await this.db.query('DELETE FROM users WHERE id = ?', [userId]);
    
    // Clean up all related caches
    const pattern = `user:${userId}*`;
    const keys = await this.redis.keys(pattern);
    
    if (keys.length > 0) {
      await this.redis.del(...keys);
      console.log(`  Deleted ${keys.length} cache entries for user ${userId}`);
    }
  }
}

// ============================================================================
// ADVANCED: CACHE-ASIDE WITH STAMPEDE PREVENTION
// ============================================================================

class CacheAsideWithStampedePrevention {
  constructor(cache, database) {
    this.cache = cache;
    this.db = database;
    this.locks = new Map();  // In-flight requests
  }

  async get(key) {
    // Try cache
    let data = await this.cache.get(key);
    if (data) return data;

    // Check if another request is already fetching this key
    if (this.locks.has(key)) {
      console.log(`  [WAITING] Another request is fetching ${key}`);
      return await this.locks.get(key);
    }

    // Create promise for this fetch
    const fetchPromise = this.fetchAndCache(key);
    this.locks.set(key, fetchPromise);

    try {
      data = await fetchPromise;
      return data;
    } finally {
      this.locks.delete(key);
    }
  }

  async fetchAndCache(key) {
    console.log(`  [FETCHING] ${key} from database`);
    const data = await this.db.query(key);
    
    if (data) {
      await this.cache.set(key, data, 3600);
    }
    
    return data;
  }
}

// ============================================================================
// EXAMPLES
// ============================================================================

async function runExamples() {
  console.log('=== Cache-Aside Pattern Examples ===\n');

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
    users: {
      '1': { id: 1, name: 'John Doe', email: 'john@example.com' },
      '2': { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    },
    async query(key) {
      await new Promise(resolve => setTimeout(resolve, 100));  // Simulate delay
      const userId = key.split(':')[1];
      return this.users[userId] || null;
    },
    async update(key, data) {
      await new Promise(resolve => setTimeout(resolve, 50));
      const userId = key.split(':')[1];
      if (this.users[userId]) {
        this.users[userId] = { ...this.users[userId], ...data };
      }
    }
  };

  // Example 1: Basic cache-aside
  console.log('Example 1: Basic Cache-Aside\n');
  const cacheAside = new CacheAsideExample(mockCache, mockDatabase);

  await cacheAside.get('user:1');  // Miss
  await cacheAside.get('user:1');  // Hit
  await cacheAside.get('user:2');  // Miss
  await cacheAside.get('user:1');  // Hit

  console.log('\nStatistics:', cacheAside.getStats());
  console.log();

  // Example 2: Update with invalidation
  console.log('Example 2: Update with Invalidation\n');

  console.log('Before update:');
  let user = await cacheAside.get('user:1');
  console.log('  User:', user);

  console.log('\nUpdating user...');
  await cacheAside.update('user:1', { name: 'John Updated' });

  console.log('\nAfter update (will refetch from DB):');
  user = await cacheAside.get('user:1');
  console.log('  User:', user);
  console.log();

  // Example 3: Stampede prevention
  console.log('Example 3: Stampede Prevention\n');
  const stampedeCache = new CacheAsideWithStampedePrevention(mockCache, mockDatabase);

  // Simulate 5 concurrent requests for same key
  console.log('5 concurrent requests for user:2:');
  await Promise.all([
    stampedeCache.get('user:2'),
    stampedeCache.get('user:2'),
    stampedeCache.get('user:2'),
    stampedeCache.get('user:2'),
    stampedeCache.get('user:2')
  ]);
  console.log('(Only 1 database query executed!)');
}

// Run examples
runExamples().catch(console.error);

// ============================================================================
// PROS AND CONS
// ============================================================================

/*
PROS:
✅ Application has full control over cache logic
✅ Cache failures don't break application (graceful degradation)
✅ Can cache selectively
✅ Simple to understand and implement
✅ Works with any cache technology
✅ Most flexible pattern

CONS:
❌ More boilerplate code
❌ Cache miss penalty (two round trips)
❌ Potential inconsistency between cache and database
❌ Initial requests always miss (cold start)
❌ Need to handle cache errors explicitly

WHEN TO USE:
✅ Read-heavy applications
✅ When you need control over caching logic
✅ When cache failures should be transparent
✅ Most web applications (default choice)
✅ When data can be slightly stale

BEST PRACTICES:
1. Always set TTL to prevent stale data
2. Handle cache errors gracefully
3. Invalidate on update (or update cache)
4. Don't cache null/error results
5. Use appropriate TTL based on data volatility
6. Monitor cache hit rate (target: 80-90%)
7. Prevent cache stampede for hot keys
8. Consider local cache for hot data

COMMON MISTAKES:
❌ Not setting TTL (memory leak)
❌ Caching errors or null values
❌ Not handling cache failures
❌ Cache keys without namespace
❌ Not monitoring cache performance
❌ Invalidating too aggressively (poor hit rate)
❌ Not preventing cache stampede
*/

module.exports = { CacheAsideExample, ProductionCacheAside, CacheAsideWithStampedePrevention };

