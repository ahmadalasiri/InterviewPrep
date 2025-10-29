# Distributed Caching Interview Questions

## Q1: What is consistent hashing and why is it important for distributed caching?

**Answer:**

Consistent hashing is an algorithm that minimizes cache redistribution when nodes are added or removed.

**Problem with simple hashing:**
```javascript
// Simple mod hashing
const serverId = hash(key) % serverCount;

// With 3 servers:
hash('user:1') % 3 = 1  → Server 1
hash('user:2') % 3 = 2  → Server 2
hash('user:3') % 3 = 0  → Server 0

// Add 1 server (now 4 servers):
hash('user:1') % 4 = ?  → Different server! (cache miss)
hash('user:2') % 4 = ?  → Different server! (cache miss)
// Almost ALL keys remap = cache invalidation storm
```

**Consistent hashing solution:**
- Maps keys and servers to points on a circle (0-360°)
- Adding/removing server only affects adjacent keys
- ~1/N keys affected instead of ~100%

**Implementation:**
```javascript
class ConsistentHash {
  constructor(replicas = 150) {
    this.replicas = replicas;  // Virtual nodes per server
    this.ring = new Map();     // Hash ring
    this.sortedKeys = [];      // Sorted hash values
  }
  
  // Add server to ring
  addServer(server) {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hash(`${server}:${i}`);
      this.ring.set(hash, server);
      this.sortedKeys.push(hash);
    }
    this.sortedKeys.sort((a, b) => a - b);
  }
  
  // Remove server from ring
  removeServer(server) {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hash(`${server}:${i}`);
      this.ring.delete(hash);
      this.sortedKeys = this.sortedKeys.filter(k => k !== hash);
    }
  }
  
  // Get server for key
  getServer(key) {
    if (this.ring.size === 0) return null;
    
    const hash = this.hash(key);
    
    // Find first server clockwise from key
    let idx = this.sortedKeys.findIndex(k => k >= hash);
    
    if (idx === -1) {
      idx = 0;  // Wrap around
    }
    
    return this.ring.get(this.sortedKeys[idx]);
  }
  
  hash(key) {
    // Simple hash function (use better one in production)
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;  // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Usage
const ch = new ConsistentHash();
ch.addServer('server1');
ch.addServer('server2');
ch.addServer('server3');

console.log(ch.getServer('user:123'));  // server2
console.log(ch.getServer('user:456'));  // server1

// Add new server - only affects ~25% of keys
ch.addServer('server4');
console.log(ch.getServer('user:123'));  // Still server2 (mostly)
```

---

## Q2: How do you handle cache invalidation in a distributed system?

**Answer:**

**Strategies:**

**1. Time-based (TTL) - Simplest**
```javascript
await cache.setex('user:123', 300, data);  // Auto-expire in 5 min
// Pros: Simple, no coordination needed
// Cons: Stale data for up to TTL duration
```

**2. Event-based - Pub/Sub**
```javascript
// Server 1: Data updated
await database.update('users', userId, newData);
await redis.publish('cache:invalidate', `user:${userId}`);

// Server 2, 3, 4: Listen and invalidate
subscriber.on('message', (channel, key) => {
  localCache.delete(key);
});
// Pros: Real-time invalidation
// Cons: Pub/Sub not reliable (messages can be lost)
```

**3. Write-through - Always consistent**
```javascript
await Promise.all([
  database.update(userId, data),
  cache.set(userId, data)
]);
// Pros: Cache always current
// Cons: Slower writes
```

**4. Versioning**
```javascript
await cache.set('user:123:v2', data);  // Include version in key
// Pros: Old cache naturally expires
// Cons: More cache keys
```

---

## Q3: What is cache stampede in distributed systems and how do you prevent it?

See [02-strategy-questions.md Q7](02-strategy-questions.md) for detailed answer.

**Distributed-specific solution:**

```javascript
// Use Redis for distributed locking
async function getWithDistributedLock(key) {
  const lockKey = `lock:${key}`;
  const lockValue = Date.now() + Math.random();
  
  // Try to acquire lock
  const locked = await redis.set(
    lockKey, 
    lockValue, 
    'EX', 10,  // 10 second lock
    'NX'  // Only set if not exists
  );
  
  if (!locked) {
    // Another server is fetching, wait and retry
    await sleep(100);
    return await cache.get(key);  // Should be populated now
  }
  
  try {
    // We have the lock, fetch from database
    const data = await database.query(key);
    await cache.set(key, data, 3600);
    return data;
  } finally {
    // Release lock only if we still own it
    const currentLock = await redis.get(lockKey);
    if (currentLock === lockValue) {
      await redis.del(lockKey);
    }
  }
}
```

---

## Q4: How do you implement a multi-level cache?

**Answer:**

Multiple cache layers for optimal performance:

```
Client Request
   ↓
L1: Browser Cache (client-side)
   ↓ (miss)
L2: CDN Cache (edge)
   ↓ (miss)
L3: Application Cache (in-memory)
   ↓ (miss)
L4: Redis Cache (shared)
   ↓ (miss)
L5: Database Query Cache
   ↓ (miss)
Database
```

**Implementation:**
```javascript
class MultiLevelCache {
  constructor() {
    this.l1 = new Map();  // Local memory
    this.l2 = redisClient;  // Redis
  }
  
  async get(key) {
    // Level 1: In-memory (fastest, ~0.1ms)
    if (this.l1.has(key)) {
      console.log('L1 cache hit');
      return this.l1.get(key);
    }
    
    // Level 2: Redis (~1-2ms)
    let data = await this.l2.get(key);
    if (data) {
      console.log('L2 cache hit');
      // Promote to L1
      this.l1.set(key, data);
      return data;
    }
    
    // Level 3: Database (~50-100ms)
    console.log('Cache miss - querying database');
    data = await database.query(key);
    
    // Populate both caches
    await this.l2.setex(key, 3600, data);  // 1 hour in Redis
    this.l1.set(key, data);  // Immediate in memory
    
    return data;
  }
  
  async set(key, value) {
    // Write to both levels
    this.l1.set(key, value);
    await this.l2.setex(key, 3600, value);
  }
  
  async invalidate(key) {
    // Invalidate all levels
    this.l1.delete(key);
    await this.l2.del(key);
    // Notify other servers via pub/sub
    await this.l2.publish('cache:invalidate', key);
  }
}
```

**Key principles:**
- Faster caches are smaller (L1 < L2 < L3)
- Shorter TTL in faster caches
- Promote frequently accessed items up levels
- Invalidate all levels on update

---

## Q5: How do you monitor and debug distributed cache issues?

**Answer:**

**Key Metrics:**

```javascript
class CacheMonitoring {
  constructor() {
    this.metrics = {
      hits: 0,
      misses: 0,
      errors: 0,
      latencies: []
    };
  }
  
  async get(key) {
    const start = Date.now();
    
    try {
      const value = await cache.get(key);
      
      const latency = Date.now() - start;
      this.metrics.latencies.push(latency);
      
      if (value) {
        this.metrics.hits++;
      } else {
        this.metrics.misses++;
      }
      
      return value;
    } catch (error) {
      this.metrics.errors++;
      throw error;
    }
  }
  
  getStats() {
    const total = this.metrics.hits + this.metrics.misses;
    
    return {
      hitRate: (this.metrics.hits / total * 100).toFixed(2) + '%',
      avgLatency: (
        this.metrics.latencies.reduce((a, b) => a + b, 0) / 
        this.metrics.latencies.length
      ).toFixed(2) + 'ms',
      errors: this.metrics.errors
    };
  }
}
```

**What to monitor:**
1. ✅ Cache hit ratio (target: 80-95%)
2. ✅ Latency (P50, P95, P99)
3. ✅ Memory usage
4. ✅ Eviction rate
5. ✅ Network bandwidth
6. ✅ Error rate

**Debugging techniques:**
```javascript
// 1. Add cache key to response headers
res.setHeader('X-Cache-Key', cacheKey);
res.setHeader('X-Cache-Status', hit ? 'HIT' : 'MISS');

// 2. Log cache operations
console.log(`[CACHE] ${hit ? 'HIT' : 'MISS'} ${key} ${latency}ms`);

// 3. Use Redis MONITOR (carefully, it's slow)
redis-cli MONITOR

// 4. Check cache size
redis-cli INFO memory
redis-cli DBSIZE
```

---

## Quick Reference

**Consistent Hashing:** Use when adding/removing cache servers frequently  
**Cache Invalidation:** Prefer TTL + explicit invalidation  
**Cache Stampede:** Use distributed locks with Redis  
**Multi-level Cache:** L1 (memory) → L2 (Redis) → L3 (Database)  
**Monitoring:** Track hit rate, latency, memory usage

**Next:** Advanced topics in [05-advanced-questions.md](05-advanced-questions.md)

