# Redis Caching Interview Questions

## Redis Fundamentals

### Q1: What is Redis and what makes it different from other caching solutions?

**Answer:**

Redis (REmote DIctionary Server) is an in-memory data structure store that can be used as a database, cache, message broker, and streaming engine.

**Key Differentiators:**

**1. Rich Data Structures**
```javascript
// Not just strings - Redis supports:
await redis.set('key', 'value');              // String
await redis.lpush('list', 'item');            // List
await redis.sadd('set', 'member');            // Set
await redis.hset('hash', 'field', 'value');   // Hash
await redis.zadd('zset', 100, 'member');      // Sorted Set
await redis.pfadd('hyperloglog', 'element');  // HyperLogLog
await redis.geoadd('geo', long, lat, 'loc'); // Geospatial
await redis.xadd('stream', '*', 'field', 'val'); // Stream
```

**2. Persistence Options**
- RDB (Snapshot): Point-in-time snapshots
- AOF (Append Only File): Log of every write operation
- Both: Combine for durability

**3. Replication & High Availability**
- Master-slave replication
- Redis Sentinel for automatic failover
- Redis Cluster for horizontal scaling

**4. Single-Threaded**
- All operations are atomic
- No race conditions
- Predictable performance

**Comparison with Memcached:**
| Feature | Redis | Memcached |
|---------|-------|-----------|
| Data structures | Many | Key-value only |
| Persistence | Yes | No |
| Replication | Yes | No |
| Pub/Sub | Yes | No |
| Scripting | Lua | No |
| Max value size | 512MB | 1MB |
| Multi-threading | No (I/O threaded in 6+) | Yes |

---

### Q2: Explain Redis data structures and when to use each.

**Answer:**

**1. Strings**
Most basic type, binary-safe up to 512MB.

```javascript
// Use cases: Cache, counters, flags
await redis.set('user:1000:name', 'John Doe');
await redis.incr('page:views');  // Atomic counter
await redis.setex('session:abc123', 3600, sessionData); // With TTL
```

**2. Lists**
Linked lists, fast insert/delete at head/tail.

```javascript
// Use cases: Queues, activity feeds, recent items
await redis.lpush('queue:jobs', job1);  // Push left
await redis.rpop('queue:jobs');         // Pop right
await redis.lrange('feed:user:123', 0, 9); // Get 10 recent items
```

**3. Sets**
Unordered collection of unique strings.

```javascript
// Use cases: Tags, unique visitors, relationships
await redis.sadd('user:123:tags', 'premium', 'verified');
await redis.sismember('user:123:tags', 'premium'); // Check membership
await redis.sinter('users:online', 'users:premium'); // Intersection
```

**4. Hashes**
Field-value pairs, like objects.

```javascript
// Use cases: Object storage, user profiles
await redis.hset('user:123', {
  name: 'John',
  email: 'john@example.com',
  age: 30
});
await redis.hget('user:123', 'name');     // Get field
await redis.hincrby('user:123', 'age', 1); // Increment field
```

**5. Sorted Sets**
Sets with scores, sorted by score.

```javascript
// Use cases: Leaderboards, priority queues, time series
await redis.zadd('leaderboard', 100, 'player1');
await redis.zadd('leaderboard', 200, 'player2');
await redis.zrange('leaderboard', 0, 9); // Top 10
await redis.zrevrank('leaderboard', 'player1'); // Get rank
```

**When to use which:**

```javascript
// Cache user object → Hash
await redis.hset('user:123', {name: 'John', age: 30});

// Cache API response → String
await redis.set('api:weather:NYC', JSON.stringify(weatherData));

// Recent posts → List
await redis.lpush('posts:recent', postId);

// User tags → Set
await redis.sadd('user:123:tags', 'premium');

// Leaderboard → Sorted Set
await redis.zadd('scores', score, userId);

// Real-time analytics → HyperLogLog
await redis.pfadd('visitors:today', userId);

// Event stream → Stream
await redis.xadd('events', '*', 'type', 'purchase');
```

---

### Q3: How does Redis handle persistence? Explain RDB vs AOF.

**Answer:**

Redis offers two persistence mechanisms:

**1. RDB (Redis Database)**

Point-in-time snapshots at specified intervals.

```bash
# redis.conf
save 900 1      # Save after 900s if 1+ keys changed
save 300 10     # Save after 300s if 10+ keys changed
save 60 10000   # Save after 60s if 10000+ keys changed
```

**How it works:**
1. Redis forks a child process
2. Child writes snapshot to temporary RDB file
3. Child replaces old RDB file with new one
4. Parent continues serving requests

**Pros:**
- ✅ Compact single file
- ✅ Fast restart (loads entire dataset)
- ✅ Good for backups
- ✅ Better performance (less disk I/O)

**Cons:**
- ❌ Data loss between snapshots
- ❌ Fork can be slow with large datasets
- ❌ Not suitable for minimal data loss requirements

**2. AOF (Append Only File)**

Logs every write operation.

```bash
# redis.conf
appendonly yes
appendfsync everysec  # always, everysec, or no
```

**Fsync policies:**
- `always`: Fsync after every write (slowest, safest)
- `everysec`: Fsync every second (good compromise)
- `no`: Let OS decide when to fsync (fastest, least safe)

**How it works:**
1. Every write operation logged to AOF file
2. Redis replays AOF file on restart
3. AOF rewrite compacts log periodically

**Pros:**
- ✅ Better durability (minimal data loss)
- ✅ Append-only (safer, no corruption)
- ✅ Human-readable log
- ✅ Automatic rewrite/compaction

**Cons:**
- ❌ Larger files than RDB
- ❌ Slower restart (replay all operations)
- ❌ Slightly slower than RDB

**3. Both (Recommended)**

```bash
# redis.conf
save 900 1
appendonly yes
appendfsync everysec
```

**On restart:**
- Redis uses AOF if available (more complete)
- Falls back to RDB if AOF doesn't exist

**Comparison:**

```
RDB: 
[Snapshot]---15min---[Snapshot]---15min---[Snapshot]
↑ Fast restart, but lose up to 15min of data

AOF:
[Write][Write][Write][Write][Write][Write]...
↑ Lose max 1 second of data, slower restart
```

**Which to choose:**

```javascript
// Caching only (data loss acceptable)
save ""          // Disable RDB
appendonly no    // Disable AOF

// Important data
appendonly yes
appendfsync everysec

// Critical data
appendonly yes  
appendfsync always

// Balance (most common)
save 900 1
appendonly yes
appendfsync everysec
```

---

### Q4: What is Redis pipelining and when should you use it?

**Answer:**

Pipelining allows sending multiple commands to Redis without waiting for individual responses, then reading all responses at once.

**Without Pipelining:**
```javascript
// 4 round trips
await redis.set('key1', 'value1');  // RTT 1
await redis.set('key2', 'value2');  // RTT 2
await redis.set('key3', 'value3');  // RTT 3
await redis.set('key4', 'value4');  // RTT 4

// Total time: 4 × RTT
```

**With Pipelining:**
```javascript
const pipeline = redis.pipeline();

// Queue commands (no network traffic yet)
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
pipeline.set('key4', 'value4');

// Execute all at once
const results = await pipeline.exec();

// Total time: 1 × RTT + processing time
```

**Performance improvement:**
```
RTT (Round Trip Time) = 1ms

Without pipelining: 4 × 1ms = 4ms
With pipelining: 1ms + 0.1ms = 1.1ms

~73% faster!
```

**Real-world example:**
```javascript
// Cache 1000 users - without pipelining
async function cacheUsersSequential(users) {
  for (const user of users) {
    await redis.hset(`user:${user.id}`, user);
  }
}
// Time: 1000 × 1ms = 1000ms = 1 second

// Cache 1000 users - with pipelining
async function cacheUsersPipelined(users) {
  const pipeline = redis.pipeline();
  
  for (const user of users) {
    pipeline.hset(`user:${user.id}`, user);
  }
  
  await pipeline.exec();
}
// Time: ~100ms = 10× faster!
```

**When to use pipelining:**
- ✅ Batch operations
- ✅ Multiple independent commands
- ✅ High latency networks
- ✅ Bulk cache warming
- ✅ Data migrations

**When NOT to use:**
- ❌ Commands depend on previous results
- ❌ Single command
- ❌ Need immediate feedback per command
- ❌ Memory-constrained (pipelines buffer in memory)

**Limitations:**
```javascript
// ❌ Don't do this - second command depends on first
pipeline.get('counter');
pipeline.incr('counter');  // Needs result of first command

// ✅ Do this instead - use Lua script or transactions
const script = `
  local val = redis.call('GET', KEYS[1])
  redis.call('INCR', KEYS[1])
  return val
`;
await redis.eval(script, 1, 'counter');
```

---

### Q5: Explain Redis Pub/Sub and its use cases for caching.

**Answer:**

Pub/Sub is a messaging pattern where publishers send messages to channels, and subscribers receive messages from channels they're subscribed to.

**Basic Pub/Sub:**
```javascript
// Subscriber 1
const subscriber1 = redis.duplicate();
await subscriber1.subscribe('cache:invalidate');

subscriber1.on('message', (channel, message) => {
  console.log(`Received: ${message} on ${channel}`);
  // Invalidate local cache
  localCache.delete(message);
});

// Subscriber 2
const subscriber2 = redis.duplicate();
await subscriber2.subscribe('cache:invalidate');

subscriber2.on('message', (channel, message) => {
  // Invalidate this server's cache
  localCache.delete(message);
});

// Publisher
await redis.publish('cache:invalidate', 'user:123');
// Both subscribers receive message and invalidate cache
```

**Cache Invalidation Pattern:**
```javascript
// Multi-server cache invalidation
class DistributedCache {
  constructor(redisClient) {
    this.redis = redisClient;
    this.localCache = new Map();
    
    // Subscribe to invalidation messages
    this.subscriber = redisClient.duplicate();
    this.subscriber.subscribe('cache:invalidate');
    
    this.subscriber.on('message', (channel, key) => {
      console.log(`Invalidating ${key} on this server`);
      this.localCache.delete(key);
    });
  }
  
  async get(key) {
    // 1. Check local cache (fastest)
    if (this.localCache.has(key)) {
      return this.localCache.get(key);
    }
    
    // 2. Check Redis (shared cache)
    const cached = await this.redis.get(key);
    if (cached) {
      // Store in local cache
      this.localCache.set(key, cached);
      return cached;
    }
    
    // 3. Fetch from database
    const data = await database.query(key);
    
    // Cache in both places
    await this.redis.setex(key, 3600, data);
    this.localCache.set(key, data);
    
    return data;
  }
  
  async invalidate(key) {
    // 1. Remove from local cache
    this.localCache.delete(key);
    
    // 2. Remove from Redis
    await this.redis.del(key);
    
    // 3. Notify all servers via pub/sub
    await this.redis.publish('cache:invalidate', key);
  }
}

// Server 1
const cache1 = new DistributedCache(redis1);

// Server 2
const cache2 = new DistributedCache(redis2);

// When data changes on Server 1
await cache1.invalidate('user:123');
// Server 2 automatically invalidates its local cache!
```

**Use Cases:**

**1. Cache Invalidation (most common)**
```javascript
// Invalidate across all app servers
await redis.publish('cache:invalidate', JSON.stringify({
  pattern: 'user:*',
  reason: 'user_update'
}));
```

**2. Real-time Notifications**
```javascript
// Notify all servers of new data
await redis.publish('new:order', JSON.stringify(orderData));
```

**3. Configuration Updates**
```javascript
// Reload config on all servers
await redis.publish('config:reload', JSON.stringify(newConfig));
```

**Pattern Subscriptions:**
```javascript
// Subscribe to patterns
await subscriber.psubscribe('cache:invalidate:*');

subscriber.on('pmessage', (pattern, channel, message) => {
  // channel might be: cache:invalidate:user, cache:invalidate:product
  console.log(`Pattern ${pattern} matched channel ${channel}`);
});

// Publish to specific channels
await redis.publish('cache:invalidate:user', 'user:123');
await redis.publish('cache:invalidate:product', 'product:456');
```

**Important Considerations:**

**⚠️ Pub/Sub is fire-and-forget:**
- Messages not persisted
- Offline subscribers miss messages
- No delivery guarantees

**For reliable messaging, use Redis Streams:**
```javascript
// Producer
await redis.xadd('cache:events', '*', 
  'action', 'invalidate',
  'key', 'user:123'
);

// Consumer
const messages = await redis.xread(
  'BLOCK', 5000,
  'STREAMS', 'cache:events', lastId
);

// Messages are persisted and can be replayed!
```

---

### Q6: What is Redis Cluster and when do you need it?

**Answer:**

Redis Cluster is Redis's distributed implementation that provides:
1. **Horizontal scaling**: Partition data across multiple nodes
2. **High availability**: Automatic failover
3. **Performance**: Distributed read/write operations

**Architecture:**
```
         Client
           ↓
    ┌──────┼──────┐
    ↓      ↓      ↓
 Master1 Master2 Master3  (16384 hash slots distributed)
    ↓      ↓      ↓
 Slave1  Slave2  Slave3   (Replicas for failover)
```

**Hash Slots:**
- 16,384 hash slots total
- Each master owns subset of slots
- Keys mapped to slots using CRC16

```javascript
// Key routing
const slot = CRC16(key) % 16384;

// Example distribution:
Master1: slots 0-5460     (33%)
Master2: slots 5461-10922 (33%)
Master3: slots 10923-16383(34%)
```

**Clustering Example:**
```javascript
const Redis = require('ioredis');

// Connect to cluster
const cluster = new Redis.Cluster([
  { port: 7000, host: '127.0.0.1' },
  { port: 7001, host: '127.0.0.1' },
  { port: 7002, host: '127.0.0.1' }
]);

// Client handles routing automatically
await cluster.set('user:123', userData);  // Goes to correct node
await cluster.get('user:123');            // Retrieved from correct node

// Multi-key operations require same slot
await cluster.mget('user:123', 'user:456');  // ❌ Might be on different nodes

// Use hash tags to force same slot
await cluster.set('{user}:123', data1);  // Hashed on 'user'
await cluster.set('{user}:456', data2);  // Hashed on 'user'
await cluster.mget('{user}:123', '{user}:456');  // ✅ Same slot
```

**When do you need Redis Cluster?**

**Need Cluster if:**
- ✅ Dataset > single Redis instance memory (> 25GB typically)
- ✅ Write load > single instance can handle
- ✅ Need horizontal scaling
- ✅ Geographic distribution needed

**Don't need Cluster if:**
- ❌ Dataset fits in single instance
- ❌ Read-heavy (use read replicas instead)
- ❌ Okay with vertical scaling
- ❌ Want simplicity

**Alternatives to Cluster:**

**1. Single Instance with Replication:**
```
Master (writes)
  ↓
Replica 1 (reads)
Replica 2 (reads)
Replica 3 (reads)

Good for: Read-heavy workloads, < 25GB data
```

**2. Redis Sentinel (High Availability):**
```
Sentinel 1
Sentinel 2  →  Monitor  →  Master + Replicas
Sentinel 3

Provides: Automatic failover, no sharding
```

**3. Application-level Sharding:**
```javascript
// Shard by user ID
const shardId = userId % 4;
const redis = redisConnections[shardId];
await redis.set(`user:${userId}`, data);
```

**Trade-offs:**

| Solution | Scaling | Failover | Complexity | Best For |
|----------|---------|----------|------------|----------|
| Single | Vertical | Manual | Low | < 25GB, simple |
| Sentinel | Vertical | Automatic | Medium | HA, < 25GB |
| Cluster | Horizontal | Automatic | High | > 25GB, distributed |

---

### Q7: How do you implement rate limiting with Redis?

**Answer:**

Rate limiting controls how many requests a user can make in a time window.

**1. Fixed Window Counter:**

Simplest approach, counts requests per time window.

```javascript
async function rateLimitFixed(userId, limit = 100, window = 60) {
  const key = `ratelimit:${userId}:${Math.floor(Date.now() / 1000 / window)}`;
  
  const count = await redis.incr(key);
  
  if (count === 1) {
    // Set expiry on first request
    await redis.expire(key, window);
  }
  
  if (count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: Math.ceil(Date.now() / 1000 / window) * window
    };
  }
  
  return {
    allowed: true,
    remaining: limit - count,
    resetAt: Math.ceil(Date.now() / 1000 / window) * window
  };
}

// Usage
const result = await rateLimitFixed('user:123', 100, 60); // 100 req/min
if (!result.allowed) {
  throw new Error('Rate limit exceeded');
}
```

**Problem:** Burst at window boundaries
```
Window 1: .......................[50 requests]  (last second)
Window 2: [50 requests].......................  (first second)
         ↑
    100 requests in 2 seconds! (but technically within limits)
```

**2. Sliding Window Log:**

Track individual request timestamps.

```javascript
async function rateLimitSlidingLog(userId, limit = 100, window = 60) {
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  const windowStart = now - (window * 1000);
  
  // Use sorted set with timestamps as scores
  const pipeline = redis.pipeline();
  
  // Remove old entries
  pipeline.zremrangebyscore(key, 0, windowStart);
  
  // Add current request
  pipeline.zadd(key, now, `${now}-${Math.random()}`);
  
  // Count requests in window
  pipeline.zcard(key);
  
  // Set expiry
  pipeline.expire(key, window);
  
  const results = await pipeline.exec();
  const count = results[2][1];
  
  if (count > limit) {
    return { allowed: false, remaining: 0 };
  }
  
  return { allowed: true, remaining: limit - count };
}
```

**Pros:** Accurate sliding window
**Cons:** Memory intensive (stores each request)

**3. Sliding Window Counter (Best):**

Hybrid approach, accurate and efficient.

```javascript
async function rateLimitSlidingWindow(userId, limit = 100, window = 60) {
  const now = Date.now() / 1000;
  const currentWindow = Math.floor(now / window);
  const previousWindow = currentWindow - 1;
  
  const currentKey = `ratelimit:${userId}:${currentWindow}`;
  const previousKey = `ratelimit:${userId}:${previousWindow}`;
  
  // Get counts
  const [currentCount, previousCount] = await Promise.all([
    redis.get(currentKey).then(v => parseInt(v) || 0),
    redis.get(previousKey).then(v => parseInt(v) || 0)
  ]);
  
  // Calculate weight of previous window
  const percentageInCurrent = (now % window) / window;
  const estimatedCount = 
    (previousCount * (1 - percentageInCurrent)) + currentCount;
  
  if (estimatedCount >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  // Increment current window
  const pipeline = redis.pipeline();
  pipeline.incr(currentKey);
  pipeline.expire(currentKey, window * 2);
  await pipeline.exec();
  
  return {
    allowed: true,
    remaining: Math.floor(limit - estimatedCount)
  };
}
```

**4. Token Bucket (Complex but flexible):**

```javascript
async function rateLimitTokenBucket(userId, capacity = 100, refillRate = 10) {
  const key = `ratelimit:bucket:${userId}`;
  
  // Lua script for atomic token bucket
  const script = `
    local key = KEYS[1]
    local capacity = tonumber(ARGV[1])
    local refillRate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])
    
    local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
    local tokens = tonumber(bucket[1]) or capacity
    local lastRefill = tonumber(bucket[2]) or now
    
    -- Refill tokens based on time passed
    local timePassed = now - lastRefill
    local tokensToAdd = timePassed * refillRate
    tokens = math.min(capacity, tokens + tokensToAdd)
    
    if tokens < 1 then
      return {0, tokens}
    end
    
    tokens = tokens - 1
    redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)
    redis.call('EXPIRE', key, 3600)
    
    return {1, tokens}
  `;
  
  const result = await redis.eval(
    script,
    1,
    key,
    capacity,
    refillRate,
    Date.now() / 1000
  );
  
  return {
    allowed: result[0] === 1,
    remaining: Math.floor(result[1])
  };
}
```

**Express middleware:**
```javascript
function rateLimitMiddleware(options = {}) {
  const { limit = 100, window = 60 } = options;
  
  return async (req, res, next) => {
    const userId = req.user?.id || req.ip;
    
    const result = await rateLimitSlidingWindow(userId, limit, window);
    
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    
    if (!result.allowed) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: window
      });
    }
    
    next();
  };
}

// Usage
app.use('/api', rateLimitMiddleware({ limit: 100, window: 60 }));
```

---

## Key Takeaways

**Redis Fundamentals:**
1. ✅ Redis supports rich data structures beyond key-value
2. ✅ Choose RDB for performance, AOF for durability, both for production
3. ✅ Use pipelining for batch operations
4. ✅ Pub/Sub great for cache invalidation across servers
5. ✅ Redis Cluster needed for datasets > 25GB or horizontal scaling

**Best Practices:**
1. ✅ Always set TTL to prevent memory leaks
2. ✅ Use appropriate data structures (hashes for objects, sorted sets for leaderboards)
3. ✅ Pipeline batch operations for performance
4. ✅ Monitor memory usage and eviction policy
5. ✅ Use Lua scripts for atomic complex operations

**Next:** Study distributed caching patterns in [04-distributed-questions.md](04-distributed-questions.md)

