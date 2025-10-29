# Advanced Caching Interview Questions

## Q1: Explain the CAP theorem in the context of caching.

**Answer:**

CAP theorem states you can only achieve 2 of 3 guarantees:
- **C**onsistency: All nodes see same data
- **A**vailability: Every request gets a response
- **P**artition tolerance: System works despite network failures

**In caching:**

**CP (Consistency + Partition Tolerance):**
```javascript
// Redis with strong consistency
// If partition occurs, unavailable until resolved
await redis.set('user:123', data);  // Waits for replication
```

**AP (Availability + Partition Tolerance):**
```javascript
// Memcached, eventual consistency
// Always responds, might be stale data
const data = await cache.get('user:123');  // May be outdated
```

**Most caches choose AP** because:
- Stale data > no data
- Cache is not source of truth
- Can always fall back to database

---

## Q2: How do you handle hot keys in a distributed cache?

**Answer:**

**Hot key** = key accessed very frequently, becoming bottleneck.

**Problems:**
- Single server overloaded
- Network bandwidth saturated
- Latency increases

**Solutions:**

**1. Local Caching**
```javascript
const localCache = new Map();

async function getWithLocal(key) {
  // Check local cache first (very fast)
  if (localCache.has(key)) {
    return localCache.get(key);
  }
  
  // Fetch from Redis
  const value = await redis.get(key);
  
  // Cache locally for 10 seconds
  localCache.set(key, value);
  setTimeout(() => localCache.delete(key), 10000);
  
  return value;
}
```

**2. Replication**
```javascript
// Replicate hot keys to multiple Redis instances
const servers = [redis1, redis2, redis3];

async function getHotKey(key) {
  // Random server selection
  const server = servers[Math.floor(Math.random() * servers.length)];
  return await server.get(key);
}
```

**3. Request Coalescing**
```javascript
const pending = new Map();

async function getCoalesced(key) {
  if (pending.has(key)) {
    return await pending.get(key);
  }
  
  const promise = redis.get(key);
  pending.set(key, promise);
  
  try {
    return await promise;
  } finally {
    pending.delete(key);
  }
}
```

---

## Q3: What are cache coherence protocols?

**Answer:**

Ensures all caches have consistent view of data.

**Write-Invalidate Protocol:**
```javascript
// When data updated, invalidate all cached copies
async function updateUser(userId, data) {
  await database.update(userId, data);
  
  // Invalidate in all caches
  await Promise.all([
    cache1.delete(`user:${userId}`),
    cache2.delete(`user:${userId}`),
    cache3.delete(`user:${userId}`)
  ]);
  
  // Next read will fetch fresh data
}
```

**Write-Update Protocol:**
```javascript
// When data updated, update all cached copies
async function updateUser(userId, data) {
  await database.update(userId, data);
  
  // Update in all caches
  await Promise.all([
    cache1.set(`user:${userId}`, data),
    cache2.set(`user:${userId}`, data),
    cache3.set(`user:${userId}`, data)
  ]);
}
```

**Trade-offs:**
- Invalidate: Less traffic, stale until next read
- Update: More traffic, always fresh

---

## Q4: How do you implement cache warming strategies?

**Answer:**

**1. Startup Warming:**
```javascript
async function warmCacheOnStartup() {
  console.log('Warming cache...');
  
  // Load top 1000 products
  const products = await db.query(`
    SELECT * FROM products 
    ORDER BY views DESC 
    LIMIT 1000
  `);
  
  for (const product of products) {
    await cache.setex(
      `product:${product.id}`,
      3600,
      JSON.stringify(product)
    );
  }
  
  console.log('Cache warmed!');
}

// Run on application start
warmCacheOnStartup();
```

**2. Scheduled Warming:**
```javascript
// Refresh cache every hour
setInterval(async () => {
  const hotKeys = ['homepage', 'trending', 'featured'];
  
  for (const key of hotKeys) {
    const data = await database.query(key);
    await cache.setex(key, 3600, data);
  }
}, 3600000);
```

**3. Predictive Warming:**
```javascript
// Warm based on analytics
async function predictiveWarm() {
  // Get items likely to be accessed soon
  const predictions = await analytics.getPredictions();
  
  for (const item of predictions) {
    await cache.setex(item.key, 3600, item.data);
  }
}
```

---

## Q5: Explain cache aside vs cache through performance characteristics.

**Answer:**

**Latency comparison:**

```
Cache-Aside:
- Hit: 1-5ms (single cache lookup)
- Miss: 50-100ms (cache lookup + DB query + cache write)

Write-Through:
- Read Hit: 1-5ms
- Read Miss: 50-100ms
- Write: 50-100ms (cache + DB both updated)
```

**Best for:**
- Cache-Aside: Read-heavy (90%+ reads)
- Write-Through: Balanced read/write, consistency critical

---

## Q6: How do you handle cache poisoning/pollution?

**Answer:**

**Problem:** Caching bad data (errors, null results, temporary data)

**Solutions:**

```javascript
async function smartCache(key) {
  const cached = await cache.get(key);
  if (cached) return cached;
  
  const data = await database.query(key);
  
  // Don't cache nulls
  if (!data) return null;
  
  // Don't cache errors
  if (data.error) return data;
  
  // Cache with appropriate TTL
  const ttl = data.isVolatile ? 60 : 3600;
  await cache.setex(key, ttl, data);
  
  return data;
}
```

---

## Quick Reference

**Hot Keys:** Use local caching + replication  
**CAP:** Most caches choose AP (availability)  
**Coherence:** Invalidate or update on write  
**Warming:** Startup, scheduled, or predictive  
**Pollution:** Don't cache nulls or errors

**Next:** Practice with real scenarios in [06-practical-questions.md](06-practical-questions.md)

