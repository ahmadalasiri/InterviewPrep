# Caching - Complete Learning Guide

A comprehensive guide to caching strategies, implementations, and best practices for building high-performance applications.

## 📚 Contents

### 00. Interview Preparation

Complete set of caching interview questions with detailed answers:

- [Basic Caching Questions](00-interview-preparation/01-basic-questions.md) - Fundamentals, cache types, eviction policies
- [Caching Strategies Questions](00-interview-preparation/02-strategy-questions.md) - Cache-aside, write-through, read-through patterns
- [Redis Questions](00-interview-preparation/03-redis-questions.md) - Redis data structures, persistence, clustering
- [Distributed Caching Questions](00-interview-preparation/04-distributed-questions.md) - Consistency, invalidation, scalability
- [Advanced Questions](00-interview-preparation/05-advanced-questions.md) - Performance optimization, edge cases, system design
- [Practical Scenarios](00-interview-preparation/06-practical-questions.md) - Real-world problems and solutions

### 01. Basics

Fundamental caching concepts and simple implementations:

- [Cache Fundamentals](01-basics/cache-fundamentals.js) - Basic cache implementation
- [LRU Cache](01-basics/lru-cache.go) - Least Recently Used cache
- [Simple Cache](01-basics/simple-cache.js) - In-memory cache basics
- [TTL Cache](01-basics/ttl-cache.js) - Time-to-live implementation

### 02. Caching Strategies

Different caching patterns and when to use them:

- [Cache-Aside Pattern](02-strategies/cache-aside.js) - Lazy loading
- [Write-Through Pattern](02-strategies/write-through.js) - Write to cache and DB
- [Write-Behind Pattern](02-strategies/write-behind.js) - Async writes
- [Read-Through Pattern](02-strategies/read-through.js) - Cache loads data
- [Refresh-Ahead Pattern](02-strategies/refresh-ahead.js) - Proactive refresh

### 03. Redis Caching

Redis-specific implementations and patterns:

- [Redis Basics](03-redis/redis-basics.js) - Connection and basic operations
- [Redis Cache Layer](03-redis/cache-layer.js) - Application cache with Redis
- [Redis Pub/Sub](03-redis/pubsub-invalidation.js) - Cache invalidation
- [Redis Clustering](03-redis/redis-cluster.js) - Distributed Redis

### 04. In-Memory Caching

Application-level caching solutions:

- [Node.js Cache](04-in-memory/node-cache.js) - node-cache library
- [Golang Cache](04-in-memory/go-cache.go) - In-memory cache in Go
- [Memory Cache Manager](04-in-memory/cache-manager.js) - Advanced memory cache
- [LFU Cache](04-in-memory/lfu-cache.go) - Least Frequently Used

### 05. Distributed Caching

Multi-server caching strategies:

- [Consistent Hashing](05-distributed/consistent-hashing.js) - Key distribution
- [Cache Warming](05-distributed/cache-warming.js) - Pre-loading cache
- [Cache Invalidation](05-distributed/invalidation-strategies.js) - Multi-level invalidation
- [Cache Stampede Prevention](05-distributed/stampede-prevention.js) - Thundering herd solution

## 🎯 What is Caching?

Caching is a technique to store frequently accessed data in a temporary storage location (cache) for faster retrieval, reducing the need to fetch data from slower primary sources.

### Why Use Caching?

- **Performance**: Reduce response time by serving data from fast storage
- **Scalability**: Handle more requests with less backend load
- **Cost Reduction**: Decrease database queries and API calls
- **Availability**: Serve stale data when backend is unavailable
- **User Experience**: Faster load times improve satisfaction

### Common Use Cases

1. **Database Query Results** - Cache expensive queries
2. **API Responses** - Store external API data
3. **Session Data** - User session information
4. **Computed Results** - Cache complex calculations
5. **Static Assets** - CSS, JS, images (CDN caching)
6. **HTML Fragments** - Page sections or full pages

## 🔑 Key Concepts

### Cache Types

#### 1. Client-Side Caching
- Browser cache
- Local storage
- Service workers
- CDN edge caching

#### 2. Server-Side Caching
- Application cache (in-memory)
- Database query cache
- Object cache
- Full-page cache

#### 3. Distributed Caching
- Redis
- Memcached
- Hazelcast
- Apache Ignite

### Cache Eviction Policies

- **LRU (Least Recently Used)** - Remove least recently accessed items
- **LFU (Least Frequently Used)** - Remove least frequently accessed items
- **FIFO (First In First Out)** - Remove oldest items first
- **TTL (Time To Live)** - Items expire after set time
- **Random Replacement** - Remove random items

### Caching Strategies

#### 1. Cache-Aside (Lazy Loading)
```javascript
async function getData(key) {
  // Try cache first
  let data = await cache.get(key);
  
  if (!data) {
    // Cache miss - fetch from DB
    data = await database.query(key);
    
    // Store in cache
    await cache.set(key, data, ttl);
  }
  
  return data;
}
```

#### 2. Write-Through
```javascript
async function saveData(key, value) {
  // Write to cache and database simultaneously
  await Promise.all([
    cache.set(key, value),
    database.save(key, value)
  ]);
}
```

#### 3. Write-Behind (Write-Back)
```javascript
async function saveData(key, value) {
  // Write to cache immediately
  await cache.set(key, value);
  
  // Queue DB write for later
  await queue.add({ key, value });
}
```

#### 4. Read-Through
```javascript
// Cache automatically loads data from DB on miss
const data = await cache.get(key); // Cache handles DB query
```

#### 5. Refresh-Ahead
```javascript
// Proactively refresh before expiration
if (cache.ttl(key) < threshold) {
  // Refresh in background
  refreshCache(key);
}
```

## 🚀 Quick Start

### Simple In-Memory Cache (Node.js)

```javascript
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl = 3600) {
    this.cache.set(key, value);
    
    // Set expiration
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl * 1000);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

// Usage
const cache = new SimpleCache();
cache.set('user:1', { name: 'John', age: 30 }, 60);
const user = cache.get('user:1');
```

### Redis Cache (Node.js)

```javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key) {
  // Try cache
  const cached = await client.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const data = await database.query(key);
  
  // Cache with 1 hour expiration
  await client.setEx(key, 3600, JSON.stringify(data));
  
  return data;
}
```

### LRU Cache (Go)

```go
package main

import (
    "container/list"
    "sync"
)

type LRUCache struct {
    capacity int
    cache    map[string]*list.Element
    list     *list.List
    mu       sync.RWMutex
}

type entry struct {
    key   string
    value interface{}
}

func NewLRUCache(capacity int) *LRUCache {
    return &LRUCache{
        capacity: capacity,
        cache:    make(map[string]*list.Element),
        list:     list.New(),
    }
}

func (c *LRUCache) Get(key string) (interface{}, bool) {
    c.mu.Lock()
    defer c.mu.Unlock()
    
    if elem, ok := c.cache[key]; ok {
        c.list.MoveToFront(elem)
        return elem.Value.(*entry).value, true
    }
    
    return nil, false
}

func (c *LRUCache) Set(key string, value interface{}) {
    c.mu.Lock()
    defer c.mu.Unlock()
    
    if elem, ok := c.cache[key]; ok {
        c.list.MoveToFront(elem)
        elem.Value.(*entry).value = value
        return
    }
    
    if c.list.Len() >= c.capacity {
        oldest := c.list.Back()
        if oldest != nil {
            c.list.Remove(oldest)
            delete(c.cache, oldest.Value.(*entry).key)
        }
    }
    
    elem := c.list.PushFront(&entry{key, value})
    c.cache[key] = elem
}
```

## 📊 Performance Considerations

### Cache Hit Ratio

```
Cache Hit Ratio = Cache Hits / (Cache Hits + Cache Misses)
```

**Target**: 80-90% for most applications

### Cache Size Calculation

```javascript
// Estimate memory usage
const itemSize = 1000; // bytes per item
const itemCount = 10000; // number of items
const overhead = 0.2; // 20% overhead

const totalMemory = itemSize * itemCount * (1 + overhead);
console.log(`Required: ${totalMemory / 1024 / 1024} MB`);
```

### TTL Strategy

```javascript
const TTL_STRATEGIES = {
  static: 86400,        // 24 hours - rarely changes
  dynamic: 3600,        // 1 hour - changes occasionally
  volatile: 300,        // 5 minutes - changes frequently
  realtime: 60          // 1 minute - near real-time
};
```

## 🛠️ Best Practices

### 1. Cache Key Design

```javascript
// ✅ Good: Descriptive and structured
'user:123:profile'
'product:456:details'
'order:789:items'

// ❌ Bad: Ambiguous or collision-prone
'u123'
'data'
'cache1'
```

### 2. Handle Cache Failures

```javascript
async function getData(key) {
  try {
    const cached = await cache.get(key);
    if (cached) return cached;
  } catch (error) {
    console.error('Cache error:', error);
    // Continue to database
  }
  
  // Always have fallback to database
  return await database.query(key);
}
```

### 3. Cache Invalidation

```javascript
// Clear related caches
async function updateUser(userId, data) {
  await database.updateUser(userId, data);
  
  // Invalidate related caches
  await cache.delete(`user:${userId}:profile`);
  await cache.delete(`user:${userId}:settings`);
  await cache.delete(`user:${userId}:posts`);
}
```

### 4. Prevent Cache Stampede

```javascript
const locks = new Map();

async function getData(key) {
  const cached = await cache.get(key);
  if (cached) return cached;
  
  // Check if another request is already fetching
  if (locks.has(key)) {
    return locks.get(key);
  }
  
  // Create promise and store in locks
  const promise = fetchAndCache(key);
  locks.set(key, promise);
  
  try {
    const data = await promise;
    return data;
  } finally {
    locks.delete(key);
  }
}

async function fetchAndCache(key) {
  const data = await database.query(key);
  await cache.set(key, data);
  return data;
}
```

### 5. Monitor Cache Performance

```javascript
class MonitoredCache {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }
  
  get(key) {
    const value = this.cache.get(key);
    
    if (value !== undefined) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    
    return value;
  }
  
  set(key, value) {
    this.stats.sets++;
    this.cache.set(key, value);
  }
  
  getHitRatio() {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? this.stats.hits / total : 0;
  }
}
```

## 🎓 Learning Path

### Week 1: Fundamentals
- [ ] Understand caching concepts
- [ ] Learn cache eviction policies
- [ ] Implement simple in-memory cache
- [ ] Study cache-aside pattern
- [ ] Practice with TTL and expiration

### Week 2: Caching Strategies
- [ ] Implement cache-aside
- [ ] Implement write-through
- [ ] Implement write-behind
- [ ] Learn read-through pattern
- [ ] Study refresh-ahead strategy

### Week 3: Redis
- [ ] Install and configure Redis
- [ ] Learn Redis data structures
- [ ] Implement Redis cache layer
- [ ] Study Redis persistence
- [ ] Practice pub/sub patterns

### Week 4: Distributed Caching
- [ ] Learn consistent hashing
- [ ] Study cache invalidation strategies
- [ ] Implement distributed cache
- [ ] Handle cache stampede
- [ ] Practice cache warming

### Week 5: Advanced Topics
- [ ] Multi-level caching
- [ ] Cache coherence
- [ ] Performance optimization
- [ ] Monitoring and metrics
- [ ] Production deployment

### Week 6: Interview Preparation
- [ ] Review all question files
- [ ] Practice coding problems
- [ ] Study system design scenarios
- [ ] Build sample projects
- [ ] Review best practices

## 🔧 Common Tools

### In-Memory Caching
- **Node.js**: node-cache, lru-cache, memory-cache
- **Go**: go-cache, groupcache, bigcache
- **Python**: cachetools, functools.lru_cache
- **Java**: Caffeine, Guava Cache, Ehcache

### Distributed Caching
- **Redis**: Most popular, feature-rich
- **Memcached**: Simple, fast, memory-only
- **Hazelcast**: Java-based, distributed data grid
- **Apache Ignite**: In-memory computing platform

### CDN Caching
- **Cloudflare**: Global CDN with edge caching
- **AWS CloudFront**: AWS CDN service
- **Fastly**: Real-time CDN
- **Akamai**: Enterprise CDN

## 💡 Common Pitfalls

### 1. Cache Inconsistency
```javascript
// ❌ Bad: Race condition
async function updateUser(id, data) {
  await database.update(id, data);
  await cache.set(`user:${id}`, data); // Another request might read old data
}

// ✅ Good: Delete cache, let it reload
async function updateUser(id, data) {
  await database.update(id, data);
  await cache.delete(`user:${id}`); // Next read will load fresh data
}
```

### 2. Cache Stampede
```javascript
// ❌ Bad: All requests hit database simultaneously
if (!cache.get(key)) {
  data = await database.query(key);
  cache.set(key, data);
}

// ✅ Good: Use locking or probabilistic early expiration
```

### 3. Storing Too Much
```javascript
// ❌ Bad: Cache entire datasets
cache.set('all_users', await database.getAllUsers());

// ✅ Good: Cache individual items or paginated results
cache.set(`users:page:${page}`, await database.getUsersPage(page));
```

### 4. No Expiration
```javascript
// ❌ Bad: Data never expires
cache.set(key, data);

// ✅ Good: Always set TTL
cache.set(key, data, { ttl: 3600 });
```

## 🔗 Additional Resources

See [resources.md](resources.md) for:
- Official documentation
- Interactive tutorials
- Video courses
- Books and articles
- Best practices
- Community resources

## 🏆 Skills Checklist

### Basic Skills
- [ ] Understand caching fundamentals
- [ ] Implement simple in-memory cache
- [ ] Use cache-aside pattern
- [ ] Handle TTL and expiration
- [ ] Design cache keys
- [ ] Calculate cache hit ratio

### Intermediate Skills
- [ ] Implement multiple caching strategies
- [ ] Use Redis effectively
- [ ] Handle cache invalidation
- [ ] Prevent cache stampede
- [ ] Monitor cache performance
- [ ] Optimize cache size

### Advanced Skills
- [ ] Design distributed caching systems
- [ ] Implement consistent hashing
- [ ] Handle cache coherence
- [ ] Multi-level caching
- [ ] Production deployment
- [ ] System design with caching

## 📈 Interview Focus Areas

### Most Asked Topics
1. **Cache Eviction Policies** (LRU, LFU, TTL)
2. **Caching Strategies** (Cache-aside, write-through, etc.)
3. **Redis Fundamentals** (Data structures, persistence)
4. **Cache Invalidation** ("There are only two hard problems...")
5. **Distributed Caching** (Consistency, scalability)
6. **System Design** (When and where to cache)

### Common Interview Questions
- Implement LRU cache
- Design a cache system for a social media feed
- How to handle cache invalidation in microservices?
- Trade-offs between different caching strategies
- How to prevent cache stampede?
- Redis vs Memcached comparison

## 📞 Quick Reference

### Cache Decision Tree

```
Should you cache this data?
├─ Is it frequently accessed? YES → Continue
│                            NO  → Don't cache
│
├─ Is it expensive to compute/fetch? YES → Continue
│                                    NO  → Don't cache
│
├─ Is it okay if it's slightly stale? YES → Continue
│                                      NO  → Use short TTL or don't cache
│
├─ Will it consume too much memory? YES → Cache selectively
│                                    NO  → Cache it!
│
└─ Choose strategy:
   ├─ Read-heavy: Cache-aside
   ├─ Write-heavy: Write-through or write-behind
   ├─ Real-time: Short TTL or don't cache
   └─ Static: Long TTL, CDN
```

---

**Happy Learning! 🚀**

"There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton

Remember: Caching is about trade-offs. Always measure and validate your caching strategy!

