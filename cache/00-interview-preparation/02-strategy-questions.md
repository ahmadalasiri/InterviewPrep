# Caching Strategies Interview Questions

## Caching Patterns

### Q1: Explain the Cache-Aside (Lazy Loading) pattern in detail.

**Answer:**

Cache-Aside is the most common caching pattern where the application code directly manages the cache.

**How it works:**
1. Application checks cache first
2. If cache hit → return cached data
3. If cache miss → fetch from database
4. Store fetched data in cache
5. Return data to caller

**Implementation:**
```javascript
async function getUserCacheAside(userId) {
  // 1. Try to get from cache
  const cacheKey = `user:${userId}`;
  let user = await cache.get(cacheKey);
  
  if (user) {
    console.log('Cache HIT');
    return JSON.parse(user);
  }
  
  // 2. Cache miss - fetch from database
  console.log('Cache MISS');
  user = await database.query(
    'SELECT * FROM users WHERE id = ?', 
    [userId]
  );
  
  if (!user) {
    return null; // User not found
  }
  
  // 3. Store in cache with TTL
  await cache.set(
    cacheKey, 
    JSON.stringify(user), 
    3600 // 1 hour TTL
  );
  
  return user;
}
```

**Pros:**
- ✅ Application has full control over caching logic
- ✅ Cache failures don't break the application (fallback to database)
- ✅ Can cache selectively (only cache what's needed)
- ✅ Easy to implement and understand
- ✅ Works with any cache technology

**Cons:**
- ❌ More boilerplate code in application
- ❌ Cache miss penalty (two round trips: cache + database)
- ❌ Potential for inconsistency between cache and database
- ❌ Initial requests to new data always miss (cold start)

**When to use:**
- ✅ Read-heavy applications
- ✅ When you need control over caching logic
- ✅ When cache failures should be transparent
- ✅ Most web applications

**Write operations:**
```javascript
async function updateUser(userId, userData) {
  // Update database
  await database.update('users', userId, userData);
  
  // Invalidate cache (let next read repopulate it)
  await cache.delete(`user:${userId}`);
  
  // Alternative: Update cache immediately
  // await cache.set(`user:${userId}`, JSON.stringify(userData), 3600);
}
```

---

### Q2: What is the Write-Through caching pattern?

**Answer:**

Write-Through is a pattern where data is written to the cache and database simultaneously.

**How it works:**
1. Application writes data
2. Data goes to cache AND database (both updated)
3. Reads always hit cache (cache always has latest data)

**Implementation:**
```javascript
async function writeThrough(key, value) {
  // Write to both cache and database simultaneously
  await Promise.all([
    cache.set(key, JSON.stringify(value), 3600),
    database.save(key, value)
  ]);
}

async function readThrough(key) {
  // Read from cache first
  let data = await cache.get(key);
  
  if (data) {
    return JSON.parse(data);
  }
  
  // Cache miss - load from database
  data = await database.query(key);
  
  // Populate cache
  await cache.set(key, JSON.stringify(data), 3600);
  
  return data;
}

// Usage
await writeThrough('user:123', userData);  // Updates both
const user = await readThrough('user:123'); // Always from cache
```

**Pros:**
- ✅ Cache always has latest data (strong consistency)
- ✅ Reads are always fast (cache hit)
- ✅ Simpler read logic
- ✅ Good for read-heavy workloads

**Cons:**
- ❌ Write latency (must wait for both cache and database)
- ❌ Every write hits cache (even if data rarely read)
- ❌ More write traffic to cache
- ❌ Cache failure affects write operations

**When to use:**
- Read-heavy workloads where consistency is important
- When reads must be fast
- When writes are infrequent
- Financial applications, inventory systems

**Comparison:**
```
Cache-Aside:   Write DB → Invalidate cache → Next read populates cache
Write-Through: Write DB + cache together → Reads always hit cache
```

---

### Q3: Explain the Write-Behind (Write-Back) pattern.

**Answer:**

Write-Behind is a pattern where writes go to cache immediately, and database writes are queued and processed asynchronously.

**How it works:**
1. Application writes to cache only (fast)
2. Cache immediately returns success
3. Write operation queued for database
4. Background worker processes queue and updates database

**Implementation:**
```javascript
// Write-behind cache implementation
class WriteBehindCache {
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
    this.writeQueue = [];
    this.processing = false;
    
    // Process queue every 5 seconds
    setInterval(() => this.flushQueue(), 5000);
  }
  
  async write(key, value) {
    // 1. Write to cache immediately (fast!)
    await this.cache.set(key, JSON.stringify(value), 3600);
    
    // 2. Queue database write
    this.writeQueue.push({ key, value, timestamp: Date.now() });
    
    // 3. Return immediately (don't wait for database)
    return true;
  }
  
  async read(key) {
    // Always read from cache first
    let data = await this.cache.get(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    // Cache miss - read from database
    data = await this.database.query(key);
    
    if (data) {
      await this.cache.set(key, JSON.stringify(data), 3600);
    }
    
    return data;
  }
  
  async flushQueue() {
    if (this.processing || this.writeQueue.length === 0) {
      return;
    }
    
    this.processing = true;
    
    // Process writes in batches
    const batch = this.writeQueue.splice(0, 100);
    
    try {
      // Batch write to database
      await this.database.batchWrite(batch);
      console.log(`Flushed ${batch.length} writes to database`);
    } catch (error) {
      console.error('Error flushing writes:', error);
      // Re-queue failed writes
      this.writeQueue.unshift(...batch);
    } finally {
      this.processing = false;
    }
  }
}

// Usage
const cache = new WriteBehindCache(redisClient, database);
await cache.write('user:123', userData);  // Returns immediately!
const user = await cache.read('user:123'); // Read from cache
```

**Pros:**
- ✅ Extremely fast writes (no database wait)
- ✅ Can batch database writes for efficiency
- ✅ Reduces database load
- ✅ Good for write-heavy workloads
- ✅ Better write throughput

**Cons:**
- ❌ Risk of data loss (if cache fails before flush)
- ❌ Complex implementation
- ❌ Eventual consistency (database lags behind)
- ❌ Need to handle queue failures
- ❌ Harder to debug

**When to use:**
- Write-heavy applications (logging, analytics)
- When write performance is critical
- When eventual consistency is acceptable
- Gaming leaderboards, view counts, metrics

**Risk mitigation:**
```javascript
// Persist queue to disk to prevent data loss
class PersistentWriteBehindCache extends WriteBehindCache {
  async write(key, value) {
    await super.write(key, value);
    
    // Also persist queue to disk (Redis, file, etc.)
    await this.persistQueue();
  }
  
  async persistQueue() {
    await fs.writeFile(
      'write-queue.json',
      JSON.stringify(this.writeQueue)
    );
  }
  
  async loadQueue() {
    try {
      const data = await fs.readFile('write-queue.json');
      this.writeQueue = JSON.parse(data);
    } catch (err) {
      this.writeQueue = [];
    }
  }
}
```

---

### Q4: What is the Read-Through pattern?

**Answer:**

Read-Through is a pattern where the cache itself is responsible for loading data from the database on a cache miss.

**How it works:**
1. Application requests data from cache
2. If cache hit → return data
3. If cache miss → cache loads from database automatically
4. Cache stores and returns data

**Difference from Cache-Aside:**
- **Cache-Aside**: Application loads database → stores in cache
- **Read-Through**: Cache loads database automatically

**Implementation:**
```javascript
// Read-through cache wrapper
class ReadThroughCache {
  constructor(cache, dataLoader) {
    this.cache = cache;
    this.dataLoader = dataLoader; // Function to load from database
  }
  
  async get(key) {
    // Try cache first
    let data = await this.cache.get(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    // Cache miss - loader automatically fetches from database
    data = await this.dataLoader(key);
    
    if (data) {
      // Cache automatically populates
      await this.cache.set(key, JSON.stringify(data), 3600);
    }
    
    return data;
  }
}

// Define data loaders
const userLoader = async (key) => {
  const userId = key.split(':')[1];
  return await database.query('SELECT * FROM users WHERE id = ?', [userId]);
};

const productLoader = async (key) => {
  const productId = key.split(':')[1];
  return await database.query('SELECT * FROM products WHERE id = ?', [productId]);
};

// Usage
const userCache = new ReadThroughCache(redisClient, userLoader);
const user = await userCache.get('user:123'); // Cache handles everything
```

**Pros:**
- ✅ Cleaner application code
- ✅ Cache logic centralized
- ✅ Consistent loading behavior
- ✅ Easy to implement caching across application

**Cons:**
- ❌ Cache layer is now critical (single point of failure)
- ❌ Less flexible than cache-aside
- ❌ Requires abstraction layer

**When to use:**
- Enterprise applications
- When you want centralized cache management
- With cache libraries that support it
- When consistency is important

---

### Q5: Explain the Refresh-Ahead pattern.

**Answer:**

Refresh-Ahead is a pattern where the cache proactively refreshes data before it expires, ensuring hot data is always available.

**How it works:**
1. Set TTL for cached data
2. Monitor TTL remaining
3. When TTL drops below threshold, refresh in background
4. Users always get cached data (never wait for refresh)

**Implementation:**
```javascript
class RefreshAheadCache {
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
    this.refreshThreshold = 0.2; // Refresh when 20% TTL remaining
    this.refreshing = new Set(); // Track items being refreshed
  }
  
  async get(key, ttl = 3600) {
    // Get data and TTL from cache
    const data = await this.cache.get(key);
    const remainingTTL = await this.cache.ttl(key);
    
    if (data) {
      // Check if refresh needed (20% TTL remaining)
      const refreshPoint = ttl * this.refreshThreshold;
      
      if (remainingTTL > 0 && remainingTTL < refreshPoint) {
        // Refresh in background (don't wait)
        this.refreshInBackground(key, ttl);
      }
      
      return JSON.parse(data);
    }
    
    // Cache miss - load and cache
    return await this.loadAndCache(key, ttl);
  }
  
  async refreshInBackground(key, ttl) {
    // Prevent duplicate refreshes
    if (this.refreshing.has(key)) {
      return;
    }
    
    this.refreshing.add(key);
    
    try {
      console.log(`Refreshing ${key} in background...`);
      
      // Load fresh data from database
      const freshData = await this.loadFromDatabase(key);
      
      // Update cache with new TTL
      await this.cache.set(
        key,
        JSON.stringify(freshData),
        ttl
      );
      
      console.log(`Refreshed ${key} successfully`);
    } catch (error) {
      console.error(`Failed to refresh ${key}:`, error);
    } finally {
      this.refreshing.delete(key);
    }
  }
  
  async loadAndCache(key, ttl) {
    const data = await this.loadFromDatabase(key);
    
    if (data) {
      await this.cache.set(key, JSON.stringify(data), ttl);
    }
    
    return data;
  }
  
  async loadFromDatabase(key) {
    const [type, id] = key.split(':');
    
    if (type === 'user') {
      return await this.database.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
    }
    
    return null;
  }
}

// Usage
const cache = new RefreshAheadCache(redisClient, database);

// First call: Cache miss, loads from database
const user1 = await cache.get('user:123', 3600);

// Later calls: Cache hit, returns immediately
const user2 = await cache.get('user:123', 3600);

// When TTL < 720s (20% of 3600): Background refresh starts
// User still gets cached data immediately!
const user3 = await cache.get('user:123', 3600);
```

**Pros:**
- ✅ Hot data never expires (always fresh)
- ✅ Users never wait for refresh
- ✅ Predictable performance
- ✅ Good for frequently accessed data

**Cons:**
- ❌ More complex implementation
- ❌ Unnecessary refreshes if access pattern changes
- ❌ More database load (proactive refreshes)
- ❌ Need to track TTL

**When to use:**
- High-traffic data (homepage, popular products)
- When consistency is important
- When you can predict access patterns
- Mission-critical data that must be fast

**Key insight:**
```
Regular Cache:     [Hit Hit Hit Miss Wait...]
Refresh-Ahead:    [Hit Hit Hit Hit Hit...] (refresh happens in background)
```

---

### Q6: How do you choose the right caching strategy?

**Answer:**

**Decision Matrix:**

| Pattern | Best For | Read Pattern | Write Pattern | Consistency |
|---------|----------|--------------|---------------|-------------|
| **Cache-Aside** | General purpose | Read-heavy | Write-light | Eventual |
| **Write-Through** | Read-heavy | Fast reads | Slow writes | Strong |
| **Write-Behind** | Write-heavy | Fast reads | Fast writes | Eventual |
| **Read-Through** | Enterprise | Consistent | Any | Strong |
| **Refresh-Ahead** | Hot data | High traffic | Any | Strong |

**Questions to ask:**

**1. Read vs Write Ratio?**
```
90% Reads, 10% Writes → Cache-Aside or Read-Through
50% Reads, 50% Writes → Write-Through
10% Reads, 90% Writes → Write-Behind
```

**2. Consistency Requirements?**
```
Strong Consistency → Write-Through or Read-Through
Eventual Consistency → Cache-Aside or Write-Behind
```

**3. Performance Requirements?**
```
Fast Reads Critical → Write-Through or Refresh-Ahead
Fast Writes Critical → Write-Behind
Balanced → Cache-Aside
```

**4. Data Access Pattern?**
```
Predictable (same data accessed often) → Refresh-Ahead
Unpredictable → Cache-Aside
Bursty → Cache-Aside with warming
```

**Real-world examples:**

```javascript
// E-commerce product catalog
// - Read-heavy (browse products)
// - Infrequent updates
// - Eventual consistency OK
// → Cache-Aside

async function getProduct(productId) {
  const cached = await cache.get(`product:${productId}`);
  if (cached) return cached;
  
  const product = await database.query(productId);
  await cache.set(`product:${productId}`, product, 3600);
  return product;
}

// Social media feed
// - High read traffic
// - Frequent updates
// - Real-time important
// → Refresh-Ahead with short TTL

async function getUserFeed(userId) {
  return await refreshAheadCache.get(`feed:${userId}`, 60); // 1 min TTL
}

// Analytics/Logging
// - Write-heavy
// - Batch processing OK
// - Read rarely
// → Write-Behind

async function logEvent(event) {
  await writeBehindCache.write(`event:${event.id}`, event);
}

// User session
// - Read and write frequently
// - Consistency critical
// → Write-Through

async function updateSession(sessionId, data) {
  await Promise.all([
    cache.set(`session:${sessionId}`, data),
    database.update('sessions', sessionId, data)
  ]);
}
```

---

### Q7: What is cache stampede and how do you prevent it?

**Answer:**

**Cache Stampede** (also called "Thundering Herd") occurs when many requests try to regenerate the same expired cache entry simultaneously, overwhelming the database.

**Scenario:**
```
1. Popular cache entry expires (e.g., homepage data)
2. 10,000 concurrent users request same data
3. All see cache miss
4. All query database simultaneously
5. Database overloaded/crashes
```

**Illustration:**
```
Time: 10:00:00 - Cache expires
Time: 10:00:01 - 10,000 requests hit at once
                  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ (all miss)
                 DATABASE OVERLOAD!
```

**Prevention Strategies:**

**1. Mutex/Lock Pattern**
```javascript
const locks = new Map();

async function getDataWithLock(key) {
  // Try cache first
  let data = await cache.get(key);
  if (data) return data;
  
  // Check if another request is already fetching
  if (locks.has(key)) {
    // Wait for the other request to finish
    return await locks.get(key);
  }
  
  // Create lock (promise) for this fetch
  const fetchPromise = fetchAndCache(key);
  locks.set(key, fetchPromise);
  
  try {
    data = await fetchPromise;
    return data;
  } finally {
    locks.delete(key);
  }
}

async function fetchAndCache(key) {
  const data = await database.query(key);
  await cache.set(key, data, 3600);
  return data;
}

// Result: Only ONE database query for concurrent requests!
```

**2. Probabilistic Early Expiration**
```javascript
async function getDataProbabilistic(key, ttl = 3600) {
  const data = await cache.get(key);
  
  if (data) {
    const remainingTTL = await cache.ttl(key);
    const delta = Date.now() % ttl;
    const expiry = ttl - remainingTTL;
    
    // Probability increases as expiration approaches
    const shouldRefresh = (delta * expiry) > (ttl * Math.random());
    
    if (shouldRefresh) {
      // Refresh in background
      refreshCache(key, ttl);
    }
    
    return data;
  }
  
  // Cache miss - fetch and cache
  return await fetchAndCache(key, ttl);
}

// Result: Refreshes happen randomly before expiration
// Only some requests trigger refresh, not all
```

**3. Stale-While-Revalidate**
```javascript
async function getDataStaleWhileRevalidate(key, ttl = 3600) {
  const data = await cache.get(key);
  const remainingTTL = await cache.ttl(key);
  
  if (data) {
    // Serve stale data if recently expired
    if (remainingTTL < 0 && remainingTTL > -300) { // 5 min grace
      // Refresh in background
      refreshCache(key, ttl);
      // Return stale data immediately
      return data;
    }
    
    return data;
  }
  
  return await fetchAndCache(key, ttl);
}

// Result: Users get stale data instantly while fresh data loads
```

**4. Never Expire (External Invalidation)**
```javascript
// Set very long TTL, invalidate explicitly
async function getDataNeverExpire(key) {
  let data = await cache.get(key);
  
  if (!data) {
    data = await database.query(key);
    await cache.set(key, data, 86400 * 30); // 30 days
  }
  
  return data;
}

// Explicitly invalidate when data changes
database.on('product.updated', (productId) => {
  cache.delete(`product:${productId}`);
});

// Result: No expiration stampede, only invalidation stampede
// Which can be controlled with locks
```

**5. Cache Warming**
```javascript
// Pre-populate cache before expiration
setInterval(async () => {
  const popularItems = ['homepage', 'product:123', 'user:top'];
  
  for (const key of popularItems) {
    const ttl = await cache.ttl(key);
    
    // Refresh if < 5 minutes remaining
    if (ttl < 300 && ttl > 0) {
      const data = await database.query(key);
      await cache.set(key, data, 3600);
    }
  }
}, 60000); // Every minute

// Result: Hot keys never expire
```

**Best Practice - Combined Approach:**
```javascript
class StampedeResistantCache {
  constructor() {
    this.cache = new Map();
    this.locks = new Map();
  }
  
  async get(key, fetcher, ttl = 3600) {
    // 1. Try cache
    let data = await this.cache.get(key);
    const remainingTTL = await this.cache.ttl(key);
    
    if (data) {
      // 2. Probabilistic early refresh
      if (this.shouldRefreshEarly(remainingTTL, ttl)) {
        this.refreshInBackground(key, fetcher, ttl);
      }
      
      // 3. Stale-while-revalidate
      if (remainingTTL < 0 && remainingTTL > -300) {
        this.refreshInBackground(key, fetcher, ttl);
      }
      
      return data;
    }
    
    // 4. Lock to prevent stampede
    return await this.fetchWithLock(key, fetcher, ttl);
  }
  
  async fetchWithLock(key, fetcher, ttl) {
    if (this.locks.has(key)) {
      return await this.locks.get(key);
    }
    
    const promise = this.fetchAndCache(key, fetcher, ttl);
    this.locks.set(key, promise);
    
    try {
      return await promise;
    } finally {
      this.locks.delete(key);
    }
  }
  
  async fetchAndCache(key, fetcher, ttl) {
    const data = await fetcher();
    await this.cache.set(key, data, ttl);
    return data;
  }
  
  shouldRefreshEarly(remaining, total) {
    const expiry = total - remaining;
    return (expiry * Math.random()) > (total * 0.8);
  }
  
  async refreshInBackground(key, fetcher, ttl) {
    setImmediate(async () => {
      try {
        await this.fetchAndCache(key, fetcher, ttl);
      } catch (err) {
        console.error('Background refresh failed:', err);
      }
    });
  }
}
```

---

## Key Takeaways

**Strategy Selection:**
1. **Default choice**: Cache-Aside (most flexible)
2. **Read-heavy + consistency**: Write-Through
3. **Write-heavy**: Write-Behind
4. **Hot data**: Refresh-Ahead
5. **Enterprise**: Read-Through

**Cache Stampede Prevention:**
1. Use locks for concurrent requests
2. Implement probabilistic early expiration
3. Serve stale while revalidating
4. Never expire hot data
5. Warm cache proactively

**Remember:**
- No one-size-fits-all solution
- Understand your access patterns
- Measure and iterate
- Start simple (Cache-Aside)
- Add complexity only when needed

**Next:** Study Redis-specific patterns in [03-redis-questions.md](03-redis-questions.md)

