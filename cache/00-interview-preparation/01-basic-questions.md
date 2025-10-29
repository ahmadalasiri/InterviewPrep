# Basic Caching Interview Questions

## Caching Fundamentals

### Q1: What is caching and why is it important?

**Answer:**

Caching is a technique of storing frequently accessed data in a temporary storage location (cache) for faster retrieval. It reduces the need to fetch data from slower primary sources like databases or external APIs.

**Why it's important:**
- **Performance**: Reduces response time significantly (ms vs seconds)
- **Scalability**: Reduces load on backend systems
- **Cost**: Fewer database queries = lower infrastructure costs
- **Availability**: Can serve stale data if backend is down
- **User Experience**: Faster load times improve user satisfaction

**Real-world example:**
```javascript
// Without cache: ~500ms database query
const user = await database.query('SELECT * FROM users WHERE id = ?', userId);

// With cache: ~1-5ms cache lookup
const cachedUser = await cache.get(`user:${userId}`);
if (cachedUser) return cachedUser; // Fast path!

// Cache miss - fetch from database and cache
const user = await database.query('SELECT * FROM users WHERE id = ?', userId);
await cache.set(`user:${userId}`, user, 3600); // Cache for 1 hour
return user;
```

---

### Q2: What is the difference between cache hit and cache miss?

**Answer:**

- **Cache Hit**: Requested data is found in the cache
  - Fastest response time
  - No backend query needed
  - Contributes to cache hit ratio

- **Cache Miss**: Requested data is NOT in the cache
  - Must fetch from primary source (database)
  - Slower response time
  - Opportunity to populate cache

**Cache Hit Ratio:**
```
Hit Ratio = Cache Hits / (Cache Hits + Cache Misses)

Example:
- 800 hits, 200 misses
- Hit Ratio = 800 / (800 + 200) = 0.80 or 80%
```

**Target hit ratios:**
- 80-90% is good for most applications
- 95%+ is excellent
- < 70% means caching strategy needs improvement

---

### Q3: Explain the different types of caching.

**Answer:**

**1. Client-Side Caching:**
- **Browser Cache**: HTTP caching headers
- **Local Storage**: Persistent client storage
- **Session Storage**: Per-session client storage
- **Service Workers**: Offline-first caching
- **CDN Edge Cache**: Content delivery network

**2. Server-Side Caching:**
- **Application Cache**: In-memory caching (node-cache, Redis)
- **Database Query Cache**: Caching query results
- **Object Cache**: Serialized objects in memory
- **Full-Page Cache**: Complete HTML pages
- **Fragment Cache**: Page sections/components

**3. Database Caching:**
- **Query Result Cache**: Cache query results
- **Connection Pool**: Reuse database connections
- **Buffer Pool**: Database keeps frequently accessed pages in memory

**4. Distributed Caching:**
- **Redis**: In-memory data store
- **Memcached**: High-performance distributed cache
- **Hazelcast**: Distributed in-memory data grid

---

### Q4: What is TTL (Time To Live) and why is it important?

**Answer:**

TTL is the duration for which cached data remains valid before it expires and must be refreshed.

**Why TTL is important:**
1. **Prevents Stale Data**: Ensures data doesn't become too old
2. **Memory Management**: Old entries are automatically removed
3. **Consistency**: Balance between performance and freshness
4. **Resource Control**: Prevents cache from growing indefinitely

**TTL Strategies:**
```javascript
const TTL = {
  // Static content - rarely changes
  STATIC: 86400,        // 24 hours
  
  // Semi-static - changes occasionally
  CATALOG: 3600,        // 1 hour
  
  // Dynamic - changes frequently
  USER_DATA: 300,       // 5 minutes
  
  // Real-time - needs to be fresh
  LIVE_FEED: 60,        // 1 minute
  
  // Volatile - changes very frequently
  STOCK_PRICE: 10       // 10 seconds
};

// Usage
await cache.set('user:123', userData, TTL.USER_DATA);
await cache.set('product:456', productData, TTL.CATALOG);
```

**Choosing TTL:**
- Too long: Risk of stale data
- Too short: More cache misses, less benefit
- Consider: How often data changes, how critical freshness is

---

### Q5: What are cache eviction policies?

**Answer:**

Cache eviction policies determine which items to remove when the cache reaches its size limit.

**Common Policies:**

**1. LRU (Least Recently Used)**
- Removes items not accessed recently
- Most popular and widely used
- Good general-purpose policy

```javascript
// LRU Example
Cache: [A, B, C, D] (max size = 4)
Access B: [A, C, D, B] (B moves to end)
Add E: [C, D, B, E] (A evicted as least recently used)
```

**2. LFU (Least Frequently Used)**
- Removes items accessed least often
- Good for stable access patterns
- More complex to implement

```javascript
// LFU Example
Cache: [A(5), B(3), C(8), D(2)] (access counts)
Add E: [A(5), B(3), C(8), E(1)] (D evicted with lowest count)
```

**3. FIFO (First In First Out)**
- Removes oldest items first
- Simple but not optimal
- Ignores access patterns

**4. Random**
- Randomly selects items to evict
- Simple implementation
- Surprisingly effective in some cases

**5. TTL-based**
- Items expire after set time
- Automatic cleanup
- Based on time, not access pattern

**When to use which:**
- **LRU**: Most general cases, web applications
- **LFU**: Content delivery, stable patterns
- **TTL**: Time-sensitive data, automatic cleanup
- **FIFO**: Simple cases, predictable access
- **Random**: Simple implementation, memory-constrained

---

### Q6: Explain the concept of "cache warming".

**Answer:**

Cache warming (or cache priming) is the process of proactively loading data into the cache before it's requested by users.

**Why use cache warming:**
1. **Avoid Cold Start**: First users don't experience cache misses
2. **Predictable Performance**: Consistent response times from the start
3. **Handle Traffic Spikes**: Cache is ready for sudden load
4. **Post-Deployment**: Ensure cache is populated after restart

**When to warm cache:**
- Application startup
- After cache invalidation
- Before expected traffic spike
- Post-deployment
- Scheduled maintenance windows

**Example:**
```javascript
// Cache warming on application startup
async function warmCache() {
  console.log('Starting cache warming...');
  
  // 1. Load popular items
  const popularProducts = await database.query(
    'SELECT * FROM products ORDER BY views DESC LIMIT 100'
  );
  
  for (const product of popularProducts) {
    await cache.set(`product:${product.id}`, product, 3600);
  }
  
  // 2. Load common configurations
  const config = await database.query('SELECT * FROM config');
  await cache.set('app:config', config, 86400);
  
  // 3. Load frequently accessed users
  const activeUsers = await database.query(
    'SELECT * FROM users WHERE last_active > NOW() - INTERVAL 1 DAY'
  );
  
  for (const user of activeUsers) {
    await cache.set(`user:${user.id}`, user, 300);
  }
  
  console.log('Cache warming complete!');
}

// Run on startup
warmCache().catch(console.error);
```

**Best practices:**
- Don't warm entire dataset (memory limit)
- Prioritize frequently accessed data
- Use analytics to identify hot data
- Warm in batches to avoid overwhelming database
- Monitor warming time and adjust

---

### Q7: What is cache invalidation and why is it difficult?

**Answer:**

Cache invalidation is the process of removing or updating cached data when the underlying source data changes.

**Famous quote:** *"There are only two hard things in Computer Science: cache invalidation and naming things."* - Phil Karlton

**Why it's difficult:**

1. **Timing Issues**
   - When exactly should cache be invalidated?
   - Race conditions between read and write operations

2. **Distributed Systems**
   - Multiple cache servers need synchronization
   - Network delays cause inconsistencies

3. **Complex Dependencies**
   - One data change might affect multiple cached items
   - Hard to track all relationships

4. **Trade-offs**
   - Too aggressive: Performance suffers (more cache misses)
   - Too lazy: Stale data served to users

**Common Invalidation Strategies:**

**1. Time-based (TTL)**
```javascript
// Simple: Let data expire automatically
cache.set('user:123', userData, 300); // Auto-invalidate after 5 minutes
```

**2. Explicit Invalidation**
```javascript
// Invalidate when data changes
async function updateUser(userId, newData) {
  await database.update('users', userId, newData);
  await cache.delete(`user:${userId}`); // Explicit invalidation
}
```

**3. Event-based Invalidation**
```javascript
// Use pub/sub to notify all cache servers
database.on('user.updated', async (userId) => {
  await cache.delete(`user:${userId}`);
  // Notify other cache servers via Redis pub/sub
  await redis.publish('cache:invalidate', `user:${userId}`);
});
```

**4. Write-through**
```javascript
// Update cache and database together
async function updateUser(userId, newData) {
  await Promise.all([
    database.update('users', userId, newData),
    cache.set(`user:${userId}`, newData, 300)
  ]);
}
```

---

### Q8: What is the difference between cache-aside and cache-through patterns?

**Answer:**

**Cache-Aside (Lazy Loading):**

Application manages cache explicitly.

```javascript
async function getUser(userId) {
  // 1. Try cache first
  let user = await cache.get(`user:${userId}`);
  
  if (user) {
    return user; // Cache hit
  }
  
  // 2. Cache miss - fetch from database
  user = await database.query('SELECT * FROM users WHERE id = ?', userId);
  
  // 3. Store in cache
  await cache.set(`user:${userId}`, user, 3600);
  
  return user;
}
```

**Pros:**
- Application has full control
- Cache failures don't break the application
- Can cache selectively

**Cons:**
- More boilerplate code
- Cache and database might be inconsistent
- Each cache miss requires two round trips

**Cache-Through (Read-Through/Write-Through):**

Cache itself manages data loading.

```javascript
// Cache handles database queries automatically
const user = await cache.get(`user:${userId}`);
// If not in cache, cache library queries database automatically
```

**Read-Through:**
- Cache automatically loads from database on miss
- Application doesn't need to manage it

**Write-Through:**
- Writes go to cache and database simultaneously
- Cache always consistent with database

**Pros:**
- Simpler application code
- Guaranteed consistency (write-through)
- Cache library handles complexity

**Cons:**
- Less flexible
- Requires cache library support
- All reads/writes go through cache layer

**When to use which:**
- **Cache-Aside**: Most common, flexible, web applications
- **Cache-Through**: Enterprise applications, consistency critical

---

### Q9: How do you measure cache performance?

**Answer:**

**Key Metrics:**

**1. Hit Rate/Ratio**
```
Hit Rate = Cache Hits / (Cache Hits + Cache Misses)
Target: 80-95%
```

**2. Miss Rate**
```
Miss Rate = 1 - Hit Rate
Lower is better
```

**3. Response Time**
```
- Cache Hit Latency: ~1-5ms
- Cache Miss Latency: 50-500ms (includes database query)
Average Response Time = (Hit Rate × Hit Latency) + (Miss Rate × Miss Latency)
```

**4. Eviction Rate**
```
How often items are being evicted
High eviction rate = cache too small
```

**5. Memory Usage**
```
Current size / Max size
Monitor to prevent OOM
```

**Implementation:**
```javascript
class MonitoredCache {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      hitLatency: [],
      missLatency: []
    };
  }
  
  get(key) {
    const start = Date.now();
    const value = this.cache.get(key);
    const latency = Date.now() - start;
    
    if (value !== undefined) {
      this.stats.hits++;
      this.stats.hitLatency.push(latency);
    } else {
      this.stats.misses++;
      this.stats.missLatency.push(latency);
    }
    
    return value;
  }
  
  getMetrics() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? this.stats.hits / total : 0;
    
    return {
      hitRate: (hitRate * 100).toFixed(2) + '%',
      missRate: ((1 - hitRate) * 100).toFixed(2) + '%',
      totalRequests: total,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      avgHitLatency: this.avg(this.stats.hitLatency),
      avgMissLatency: this.avg(this.stats.missLatency)
    };
  }
  
  avg(arr) {
    return arr.length > 0 
      ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) + 'ms'
      : 'N/A';
  }
}

// Usage
const cache = new MonitoredCache();
setInterval(() => {
  console.log('Cache Metrics:', cache.getMetrics());
}, 60000); // Log every minute
```

**What to monitor:**
- ✅ Hit rate trending down → investigate cache size or TTL
- ✅ High miss rate → cache warming needed
- ✅ High eviction rate → increase cache size
- ✅ Increasing latency → cache server overloaded

---

### Q10: What is the difference between Redis and Memcached?

**Answer:**

Both are in-memory caching systems, but with key differences:

| Feature | Redis | Memcached |
|---------|-------|-----------|
| **Data Structures** | Rich (strings, lists, sets, hashes, sorted sets) | Only strings |
| **Persistence** | Yes (RDB, AOF) | No |
| **Replication** | Master-slave | No built-in |
| **Clustering** | Yes | No built-in |
| **Pub/Sub** | Yes | No |
| **Transactions** | Yes | No |
| **Lua Scripting** | Yes | No |
| **Max Key Size** | 512 MB | 1 MB |
| **Threading** | Single-threaded | Multi-threaded |
| **Use Case** | Complex caching, message broker, session store | Simple key-value caching |

**When to use Redis:**
- Need data persistence
- Complex data structures (lists, sets)
- Pub/sub messaging
- Distributed systems
- Session management with complex objects

**When to use Memcached:**
- Simple key-value caching
- Extremely high throughput needed
- Multi-threaded performance advantage
- Simpler deployment

**Example Redis advantages:**
```javascript
// Redis supports complex data structures
await redis.lpush('queue:jobs', jobData);        // List
await redis.sadd('user:123:tags', 'premium');    // Set
await redis.hincrby('stats:views', 'page1', 1);  // Hash
await redis.zadd('leaderboard', score, userId);  // Sorted Set

// Memcached only supports key-value
await memcached.set('user:123', userData);       // String only
```

**Performance:**
- Memcached: Slightly faster for simple gets/sets (multi-threaded)
- Redis: More features, single-threaded but very fast

**Most applications choose Redis** because:
- More features
- Data persistence
- Better for complex use cases
- Active development and community

---

## Quick Reference

### Cache Decision Matrix

```
Should I cache this data?

├─ Frequently accessed? 
│  ├─ YES → Continue
│  └─ NO → Don't cache
│
├─ Expensive to compute/fetch?
│  ├─ YES → Continue
│  └─ NO → Don't cache
│
├─ Okay if slightly stale?
│  ├─ YES → Cache it!
│  └─ NO → Use short TTL or don't cache
│
└─ Memory cost acceptable?
   ├─ YES → Cache it!
   └─ NO → Cache selectively
```

### Common Patterns

```javascript
// 1. Simple cache-aside
const data = cache.get(key) || await fetchAndCache(key);

// 2. Cache with TTL
cache.set(key, value, 3600); // 1 hour

// 3. Namespace keys
const key = `user:${userId}:profile`;

// 4. Handle cache failures gracefully
try {
  return await cache.get(key);
} catch (err) {
  return await database.query(key); // Fallback
}

// 5. Bulk operations
const users = await cache.mget(['user:1', 'user:2', 'user:3']);
```

---

**Key Takeaways:**

1. ✅ Caching improves performance and scalability
2. ✅ Aim for 80-90% cache hit rate
3. ✅ Always set appropriate TTL
4. ✅ Cache invalidation is hard - plan carefully
5. ✅ Monitor cache performance with metrics
6. ✅ Use cache-aside pattern for most cases
7. ✅ Redis is more feature-rich than Memcached
8. ✅ LRU is the most common eviction policy

**Next:** Study caching strategies in [02-strategy-questions.md](02-strategy-questions.md)

