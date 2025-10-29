// Simple In-Memory Cache Implementation
// Demonstrates basic caching concepts with TTL support

class SimpleCache {
  constructor() {
    this.cache = new Map();      // Store data
    this.timers = new Map();      // Store timeout handles
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    
    this.stats.misses++;
    return undefined;
  }

  /**
   * Set value in cache with optional TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   */
  set(key, value, ttl = null) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store value
    this.cache.set(key, value);
    this.stats.sets++;

    // Set expiration if TTL provided
    if (ttl !== null && ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl * 1000);
      
      this.timers.set(key, timer);
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {boolean} True if deleted, false if not found
   */
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
    }
    return deleted;
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Clear all cached items
   */
  clear() {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    
    this.cache.clear();
    this.timers.clear();
    this.stats.deletes += this.cache.size;
  }

  /**
   * Get cache size
   * @returns {number}
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   * @returns {object}
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      hitRate: `${hitRate}%`,
      size: this.cache.size
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }
}

// ============================================================================
// EXAMPLES
// ============================================================================

console.log('=== Simple Cache Examples ===\n');

// Example 1: Basic usage
console.log('Example 1: Basic Get/Set');
const cache = new SimpleCache();

cache.set('user:1', { name: 'John', age: 30 });
cache.set('user:2', { name: 'Jane', age: 25 });

console.log('Get user:1:', cache.get('user:1'));
console.log('Get user:2:', cache.get('user:2'));
console.log('Get user:3:', cache.get('user:3'));  // Cache miss
console.log();

// Example 2: TTL (Time To Live)
console.log('Example 2: TTL Expiration');
cache.set('session:abc', { userId: 1 }, 2);  // Expires in 2 seconds

console.log('Immediately:', cache.get('session:abc'));

setTimeout(() => {
  console.log('After 1 second:', cache.get('session:abc'));
}, 1000);

setTimeout(() => {
  console.log('After 3 seconds:', cache.get('session:abc'));  // Expired
  console.log();
  
  // Example 3: Statistics
  console.log('Example 3: Cache Statistics');
  console.log(cache.getStats());
  console.log();
  
  // Example 4: Cache with database fallback
  console.log('Example 4: Cache-Aside Pattern');
  runCacheAsideExample();
}, 3500);

// Example 4: Cache-Aside Pattern with database
async function runCacheAsideExample() {
  // Simulate database
  const database = {
    users: {
      '1': { id: 1, name: 'John', email: 'john@example.com' },
      '2': { id: 2, name: 'Jane', email: 'jane@example.com' },
      '3': { id: 3, name: 'Bob', email: 'bob@example.com' }
    },
    
    query(userId) {
      console.log(`  [DB] Querying user ${userId}...`);
      return this.users[userId] || null;
    }
  };

  // Get user with cache-aside pattern
  async function getUser(userId) {
    const cacheKey = `user:${userId}`;
    
    // Try cache first
    let user = cache.get(cacheKey);
    
    if (user) {
      console.log(`  [CACHE HIT] Found user ${userId} in cache`);
      return user;
    }
    
    // Cache miss - fetch from database
    console.log(`  [CACHE MISS] User ${userId} not in cache`);
    user = database.query(userId);
    
    if (user) {
      // Store in cache with 1 hour TTL
      cache.set(cacheKey, user, 3600);
      console.log(`  [CACHE] Stored user ${userId} in cache`);
    }
    
    return user;
  }

  // First call - cache miss
  console.log('First call to getUser(1):');
  await getUser('1');
  console.log();

  // Second call - cache hit
  console.log('Second call to getUser(1):');
  await getUser('1');
  console.log();

  // Different user - cache miss
  console.log('First call to getUser(2):');
  await getUser('2');
  console.log();

  // Final statistics
  console.log('Final Cache Statistics:');
  console.log(cache.getStats());
}

// ============================================================================
// USAGE PATTERNS
// ============================================================================

/*
// Pattern 1: Simple caching
const cache = new SimpleCache();
cache.set('key', 'value');
const value = cache.get('key');

// Pattern 2: With TTL
cache.set('session:123', sessionData, 3600);  // 1 hour

// Pattern 3: Cache-aside
async function getData(key) {
  let data = cache.get(key);
  if (!data) {
    data = await database.query(key);
    cache.set(key, data, 300);  // 5 minutes
  }
  return data;
}

// Pattern 4: Cache invalidation
function updateUser(userId, newData) {
  database.update(userId, newData);
  cache.delete(`user:${userId}`);  // Invalidate cache
}

// Pattern 5: Monitoring
setInterval(() => {
  console.log('Cache stats:', cache.getStats());
}, 60000);  // Every minute
*/

// ============================================================================
// EXPORT
// ============================================================================

module.exports = SimpleCache;

