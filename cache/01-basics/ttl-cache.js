// TTL (Time To Live) Cache Implementation
// Items automatically expire after specified duration

class TTLCache {
  constructor() {
    this.cache = new Map();       // Store: key -> { value, expiresAt }
    this.cleanupInterval = null;
  }

  /**
   * Get value from cache (returns undefined if expired)
   * @param {string} key 
   * @returns {*} value or undefined
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Set value with TTL
   * @param {string} key
   * @param {*} value
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl) {
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Get remaining TTL in milliseconds
   * @param {string} key
   * @returns {number} milliseconds until expiration, or -1 if expired/not found
   */
  ttl(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return -1;
    }

    const remaining = item.expiresAt - Date.now();
    return remaining > 0 ? remaining : -1;
  }

  /**
   * Delete specific key
   * @param {string} key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all items
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Start automatic cleanup of expired items
   * @param {number} interval - Cleanup interval in milliseconds
   */
  startCleanup(interval = 60000) {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, interval);
  }

  /**
   * Stop automatic cleanup
   */
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Manually trigger cleanup of expired items
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    console.log(`Cleaned up ${cleaned} expired items`);
    return cleaned;
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }
}

// ============================================================================
// EXAMPLES
// ============================================================================

console.log('=== TTL Cache Examples ===\n');

// Example 1: Basic TTL
console.log('Example 1: Basic TTL');
const cache = new TTLCache();

cache.set('session:abc', { userId: 123 }, 5000);  // 5 seconds
cache.set('token:xyz', 'secret-token', 2000);     // 2 seconds

console.log('Immediately:', cache.get('session:abc'));
console.log('TTL remaining:', cache.ttl('session:abc'), 'ms');

setTimeout(() => {
  console.log('After 3 seconds:', cache.get('session:abc'));
  console.log('After 3 seconds (token):', cache.get('token:xyz')); // Expired
}, 3000);

setTimeout(() => {
  console.log('After 6 seconds:', cache.get('session:abc')); // Expired
  console.log();
  example2();
}, 6500);

// Example 2: Different TTLs for different data types
function example2() {
  console.log('Example 2: Different TTLs');
  const cache = new TTLCache();

  const TTL = {
    STATIC: 86400000,    // 24 hours
    DYNAMIC: 3600000,    // 1 hour
    VOLATILE: 300000,    // 5 minutes
    SESSION: 1800000     // 30 minutes
  };

  // Cache with appropriate TTLs
  cache.set('config', { theme: 'dark' }, TTL.STATIC);
  cache.set('user:profile', { name: 'John' }, TTL.DYNAMIC);
  cache.set('feed:latest', [...], TTL.VOLATILE);
  cache.set('session:123', { loggedIn: true }, TTL.SESSION);

  console.log('Cached items with different TTLs:');
  console.log('  Config TTL:', cache.ttl('config'), 'ms (24h)');
  console.log('  Profile TTL:', cache.ttl('user:profile'), 'ms (1h)');
  console.log('  Feed TTL:', cache.ttl('feed:latest'), 'ms (5m)');
  console.log('  Session TTL:', cache.ttl('session:123'), 'ms (30m)');
  console.log();

  example3();
}

// Example 3: Automatic cleanup
function example3() {
  console.log('Example 3: Automatic Cleanup');
  const cache = new TTLCache();

  // Add items with short TTL
  for (let i = 0; i < 5; i++) {
    cache.set(`temp:${i}`, `value${i}`, 100);  // 100ms TTL
  }

  console.log('Initial size:', cache.size());

  setTimeout(() => {
    console.log('Before cleanup:', cache.size());
    const cleaned = cache.cleanup();
    console.log('After cleanup:', cache.size());
    console.log();
    
    example4();
  }, 200);
}

// Example 4: Cache-aside with TTL
async function example4() {
  console.log('Example 4: Cache-Aside with TTL');

  const database = {
    users: {
      '1': { id: 1, name: 'John', role: 'admin' },
      '2': { id: 2, name: 'Jane', role: 'user' }
    },
    
    async query(userId) {
      console.log(`  [DB] Query for user ${userId}`);
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.users[userId];
    }
  };

  const cache = new TTLCache();
  const USER_TTL = 1000;  // 1 second

  async function getUser(userId) {
    const cacheKey = `user:${userId}`;
    
    // Try cache
    let user = cache.get(cacheKey);
    
    if (user) {
      console.log(`  [CACHE HIT] User ${userId}`);
      return user;
    }

    // Cache miss - query database
    console.log(`  [CACHE MISS] User ${userId}`);
    user = await database.query(userId);
    
    if (user) {
      cache.set(cacheKey, user, USER_TTL);
    }
    
    return user;
  }

  // First call - cache miss
  await getUser('1');
  
  // Second call - cache hit
  await getUser('1');

  // Wait for expiration
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Third call - cache miss again (expired)
  await getUser('1');
  
  console.log();
  example5();
}

// Example 5: Sliding expiration
function example5() {
  console.log('Example 5: Sliding Expiration');

  class SlidingTTLCache extends TTLCache {
    get(key) {
      const item = this.cache.get(key);
      
      if (!item) {
        return undefined;
      }

      // Check if expired
      if (Date.now() > item.expiresAt) {
        this.cache.delete(key);
        return undefined;
      }

      // Extend expiration on access (sliding window)
      const originalTTL = item.expiresAt - (item.createdAt || item.expiresAt - 5000);
      item.expiresAt = Date.now() + originalTTL;

      return item.value;
    }

    set(key, value, ttl) {
      const now = Date.now();
      this.cache.set(key, {
        value,
        expiresAt: now + ttl,
        createdAt: now
      });
    }
  }

  const cache = new SlidingTTLCache();
  cache.set('session:abc', { userId: 1 }, 2000);  // 2 second TTL

  console.log('Initial TTL:', cache.ttl('session:abc'), 'ms');

  // Access after 1 second - should extend TTL
  setTimeout(() => {
    cache.get('session:abc');
    console.log('After 1s access, TTL:', cache.ttl('session:abc'), 'ms');
  }, 1000);

  // Without access, would have expired at 2s
  // With sliding, still valid at 3s
  setTimeout(() => {
    const value = cache.get('session:abc');
    console.log('After 3s, still valid?', value !== undefined);
  }, 3000);
}

// ============================================================================
// USAGE PATTERNS
// ============================================================================

/*
// Pattern 1: Session management
const sessionCache = new TTLCache();
sessionCache.set('session:123', sessionData, 30 * 60 * 1000); // 30 min

// Pattern 2: API response caching
const apiCache = new TTLCache();
async function callAPI(endpoint) {
  let response = apiCache.get(endpoint);
  if (!response) {
    response = await fetch(endpoint);
    apiCache.set(endpoint, response, 5 * 60 * 1000); // 5 min
  }
  return response;
}

// Pattern 3: Rate limiting
const rateLimitCache = new TTLCache();
function checkRateLimit(userId) {
  const key = `ratelimit:${userId}`;
  const count = rateLimitCache.get(key) || 0;
  
  if (count >= 100) {
    throw new Error('Rate limit exceeded');
  }
  
  rateLimitCache.set(key, count + 1, 60 * 1000); // 1 minute window
}

// Pattern 4: Temporary tokens
const tokenCache = new TTLCache();
function generateResetToken(userId) {
  const token = crypto.randomUUID();
  tokenCache.set(`reset:${token}`, userId, 15 * 60 * 1000); // 15 min
  return token;
}
*/

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/*
TTL Cache Benefits:
- Automatic expiration (no manual cleanup needed)
- Different TTLs for different data types
- Memory management (expired items removed)
- Prevents stale data

TTL Strategies:
- Static content: Long TTL (hours/days)
- Dynamic content: Medium TTL (minutes/hours)
- Volatile content: Short TTL (seconds/minutes)
- Session data: Based on session timeout

Sliding vs Fixed TTL:
- Fixed: Expires after set time from creation
- Sliding: Extends on each access (like session timeout)

Common use cases:
- Session storage
- API response caching
- Rate limiting
- Temporary tokens
- OTP codes
*/

module.exports = TTLCache;

