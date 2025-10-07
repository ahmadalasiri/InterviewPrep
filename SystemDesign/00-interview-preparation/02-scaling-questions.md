# Scaling & Performance Questions

## Scalability Concepts

### 1. How do you scale a web application to handle millions of users?

**Answer:**
Scaling to millions of users requires a multi-layered approach:

**Phase 1: Single Server (0-1K users)**

```
Client ──► Web Server + Database (single machine)
```

- Everything on one server
- Simple but limited

**Phase 2: Separate Database (1K-10K users)**

```
Client ──► Web Server ──► Database Server
```

- Separate web and data tiers
- Independent scaling possible

**Phase 3: Load Balancer + Multiple Servers (10K-100K users)**

```
           ┌──► Web Server 1
Client ──► LB ──► Web Server 2 ──► Database (Master-Slave)
           └──► Web Server 3         ├─► Slave 1
                                      └─► Slave 2
```

- Horizontal scaling of web tier
- Database replication for reads
- Session storage (Redis/Memcached)

**Phase 4: Caching Layer (100K-1M users)**

```
           ┌──► Web Server 1 ──┐
Client ──► LB ──► Web Server 2 ──┤──► Cache (Redis) ──► DB Master
           └──► Web Server 3 ──┘                          └─► Slaves
```

- Add caching layer (Redis, Memcached)
- Cache frequently accessed data
- Reduce database load

**Phase 5: CDN + Database Sharding (1M-10M users)**

```
Client ──► CDN ──► LB ──► Web Servers ──► Cache ──► DB Shards
                                                     ├─► Shard 1
                                                     ├─► Shard 2
                                                     └─► Shard 3
```

- CDN for static content
- Database sharding for writes
- Geographic distribution

**Phase 6: Microservices + Message Queues (10M+ users)**

```
Client ──► API Gateway ──┬──► Auth Service ──► DB
                         ├──► User Service ──► DB
                         ├──► Order Service ──► DB
                         └──► Message Queue ──► Workers
```

- Break into microservices
- Async processing with queues
- Independent service scaling

**Key Principles:**

1. **Stateless servers**: Session data in external store
2. **Horizontal scaling**: Add more servers
3. **Cache everything**: Reduce database load
4. **Async processing**: Use queues for heavy tasks
5. **Monitor and measure**: Track metrics continuously

### 2. How do you handle database scalability?

**Answer:**
Database scalability can be achieved through multiple strategies:

**1. Vertical Scaling (Scale Up)**

```
Small DB ──► Medium DB ──► Large DB
(4GB RAM)    (32GB RAM)    (256GB RAM)
```

- **Pros**: Simple, no code changes
- **Cons**: Expensive, hard limit, downtime
- **When**: Quick fix, up to moderate scale

**2. Read Replicas (Read Scaling)**

```
Master (Writes) ──► Slave 1 (Reads)
                ──► Slave 2 (Reads)
                ──► Slave 3 (Reads)
```

- **Pros**: Scale reads, high availability
- **Cons**: Replication lag, write bottleneck
- **When**: Read-heavy workloads (90%+ reads)

**3. Database Sharding (Write Scaling)**

```
Shard 1: Users 0-99M
Shard 2: Users 100M-199M
Shard 3: Users 200M-299M
```

- **Pros**: Scale both reads and writes
- **Cons**: Complex, cross-shard queries hard
- **When**: Write-heavy workloads

**4. Denormalization**

```
Instead of:
Users table + Posts table + Comments table

Combined:
Posts table with user info and comment count embedded
```

- **Pros**: Fewer joins, faster queries
- **Cons**: Data duplication, update complexity
- **When**: Read performance critical

**5. Caching Layer**

```
Application ──► Cache (Redis) ──► Database
                  (hit)              (miss)
```

- **Pros**: Dramatically reduce DB load
- **Cons**: Cache invalidation complexity
- **When**: Frequently accessed data

**6. NoSQL Database**

```
Relational DB ──► NoSQL DB
(PostgreSQL)      (Cassandra/MongoDB)
```

- **Pros**: Better horizontal scaling
- **Cons**: Less ACID guarantees, different query model
- **When**: Schema flexibility needed, write-heavy

**7. CQRS (Command Query Responsibility Segregation)**

```
Write Path: Commands ──► Write DB (optimized for writes)
Read Path:  Queries  ──► Read DB (optimized for reads)
```

- **Pros**: Optimize each path separately
- **Cons**: Complexity, eventual consistency
- **When**: Very different read/write patterns

### 3. How do you optimize query performance?

**Answer:**

**1. Indexing**

```sql
-- Without index: Full table scan O(n)
SELECT * FROM users WHERE email = 'user@example.com';

-- With index: O(log n)
CREATE INDEX idx_users_email ON users(email);
```

**Types of Indexes:**

- **B-Tree**: Default, good for range queries
- **Hash**: Exact matches only, very fast
- **Full-text**: Text search
- **Composite**: Multiple columns

**When to Index:**

- Columns used in WHERE clauses
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Columns with high cardinality

**When NOT to Index:**

- Small tables (overhead > benefit)
- Columns frequently updated
- Low cardinality columns (gender, boolean)

**2. Query Optimization**

```sql
-- Bad: Select all columns
SELECT * FROM users;

-- Good: Select only needed columns
SELECT id, name, email FROM users;

-- Bad: N+1 query problem
SELECT * FROM posts; -- 100 posts
-- Then for each post:
SELECT * FROM comments WHERE post_id = ?; -- 100 queries

-- Good: JOIN or batch fetch
SELECT p.*, c.* FROM posts p
LEFT JOIN comments c ON p.id = c.post_id;
```

**3. Pagination**

```sql
-- Bad: Offset pagination for large offsets
SELECT * FROM posts ORDER BY created_at LIMIT 100 OFFSET 100000;
-- Database still scans first 100,000 rows

-- Good: Cursor-based pagination
SELECT * FROM posts
WHERE created_at < ?
ORDER BY created_at DESC
LIMIT 100;
```

**4. Caching**

- Cache query results
- Use Redis/Memcached
- Set appropriate TTL
- Invalidate on updates

**5. Connection Pooling**

```
Instead of: New connection per request
Use: Pool of reusable connections
```

**6. Read Replicas**

- Route read queries to replicas
- Keep master for writes only

**7. Denormalization**

- Store computed values
- Trade storage for speed
- Update in background

### 4. How do you implement effective caching?

**Answer:**

**Caching Levels:**

**1. Client-Side Caching**

```
Browser cache, localStorage, IndexedDB
```

- **Pros**: Fastest, reduces server load
- **Cons**: Limited control, security concerns

**2. CDN Caching**

```
CloudFlare, CloudFront, Akamai
```

- **What**: Static assets (images, CSS, JS)
- **TTL**: Hours to days
- **Invalidation**: Version URLs or purge

**3. Application-Level Caching**

```go
// In-memory cache
var cache = make(map[string]string)

func GetUser(id string) User {
    if cached, ok := cache[id]; ok {
        return cached
    }
    user := db.QueryUser(id)
    cache[id] = user
    return user
}
```

- **Pros**: Very fast, no network
- **Cons**: Not shared, memory limited

**4. Distributed Caching**

```
Redis, Memcached cluster
```

- **Pros**: Shared across servers, scalable
- **Cons**: Network latency, serialization

**5. Database Query Caching**

```
Database caches query results
```

- **Pros**: Automatic, transparent
- **Cons**: Limited control

**Caching Strategies:**

**Cache-Aside (Lazy Loading)**

```go
func GetProduct(id string) Product {
    // 1. Check cache
    if product, found := cache.Get(id); found {
        return product
    }

    // 2. Cache miss - fetch from DB
    product := db.GetProduct(id)

    // 3. Update cache
    cache.Set(id, product, 1*time.Hour)

    return product
}
```

**Write-Through**

```go
func UpdateProduct(product Product) {
    // 1. Update cache
    cache.Set(product.ID, product, 1*time.Hour)

    // 2. Update database
    db.UpdateProduct(product)
}
```

**Write-Behind**

```go
func UpdateProduct(product Product) {
    // 1. Update cache immediately
    cache.Set(product.ID, product, 1*time.Hour)

    // 2. Queue for async DB update
    queue.Push(UpdateJob{product})
}
```

**What to Cache:**

- Frequently accessed data
- Expensive to compute data
- Relatively static data
- User sessions
- API responses

**What NOT to Cache:**

- Highly dynamic data
- Personalized data (unless user-specific cache)
- Large datasets (cache important parts only)
- Sensitive data (or encrypt)

**Cache Invalidation Strategies:**

**1. TTL (Time To Live)**

```go
cache.Set("user:123", user, 5*time.Minute)
```

**2. Write Invalidation**

```go
func UpdateUser(user User) {
    db.Update(user)
    cache.Delete("user:" + user.ID)
}
```

**3. Event-Based Invalidation**

```go
eventBus.Subscribe("user.updated", func(userID string) {
    cache.Delete("user:" + userID)
})
```

**4. Cache Tags**

```go
cache.Set("user:123", user, WithTags("users", "user:123"))
cache.InvalidateTag("users") // Clear all users
```

### 5. How do you handle session management at scale?

**Answer:**

**Approaches:**

**1. Sticky Sessions (Session Affinity)**

```
Load Balancer remembers which server handled user
Always route same user to same server
```

- **Pros**: Simple, session in memory
- **Cons**: Uneven load, loss on server failure
- **When**: Small scale, no HA required

**2. Session Replication**

```
Server 1 ◄──► Server 2 ◄──► Server 3
All servers have copy of all sessions
```

- **Pros**: High availability
- **Cons**: Network overhead, doesn't scale
- **When**: Small cluster (2-5 servers)

**3. Centralized Session Store (Recommended)**

```
Server 1 ──┐
Server 2 ──┼──► Redis Cluster (Session Store)
Server 3 ──┘
```

- **Pros**: Scalable, HA, stateless servers
- **Cons**: Network latency, single point of failure (mitigated with clustering)
- **When**: Production, scale required

**4. Client-Side Sessions (JWT)**

```
Client stores token with claims
Server validates signature
```

- **Pros**: Stateless, scales infinitely
- **Cons**: Can't invalidate, token size, security
- **When**: Microservices, APIs

**Implementation with Redis:**

```go
// Store session
func CreateSession(userID string) string {
    sessionID := generateUUID()
    sessionData := map[string]interface{}{
        "user_id": userID,
        "created": time.Now(),
    }

    redis.Set("session:"+sessionID, sessionData, 24*time.Hour)
    return sessionID
}

// Retrieve session
func GetSession(sessionID string) Session {
    data := redis.Get("session:" + sessionID)
    return parseSession(data)
}

// Delete session (logout)
func DeleteSession(sessionID string) {
    redis.Del("session:" + sessionID)
}
```

**Best Practices:**

1. **Short TTL**: Expire inactive sessions
2. **Sliding Expiration**: Extend on activity
3. **Secure**: HttpOnly, Secure, SameSite cookies
4. **Compression**: Compress large sessions
5. **Monitoring**: Track session counts, expiry

### 6. How do you implement rate limiting at scale?

**Answer:**

**Algorithms:**

**1. Token Bucket (Most Common)**

```go
type TokenBucket struct {
    capacity    int       // Max tokens
    tokens      int       // Current tokens
    refillRate  int       // Tokens per second
    lastRefill  time.Time
}

func (tb *TokenBucket) Allow() bool {
    tb.refill()

    if tb.tokens > 0 {
        tb.tokens--
        return true
    }
    return false
}

func (tb *TokenBucket) refill() {
    now := time.Now()
    elapsed := now.Sub(tb.lastRefill).Seconds()
    tokensToAdd := int(elapsed * float64(tb.refillRate))

    tb.tokens = min(tb.capacity, tb.tokens + tokensToAdd)
    tb.lastRefill = now
}
```

- **Pros**: Handles bursts, smooth rate
- **Cons**: Memory per user

**2. Fixed Window Counter**

```go
func Allow(userID string) bool {
    key := fmt.Sprintf("rate:%s:%d", userID, time.Now().Unix()/60)
    count := redis.Incr(key)
    redis.Expire(key, 60)

    return count <= 100 // 100 requests per minute
}
```

- **Pros**: Simple, low memory
- **Cons**: Burst at window boundaries

**3. Sliding Window Log**

```go
func Allow(userID string) bool {
    now := time.Now().Unix()
    key := "rate:" + userID

    // Remove old entries
    redis.ZRemRangeByScore(key, 0, now-60)

    // Count recent requests
    count := redis.ZCard(key)

    if count < 100 {
        redis.ZAdd(key, now, generateID())
        return true
    }
    return false
}
```

- **Pros**: Accurate, no burst issues
- **Cons**: Memory intensive

**4. Sliding Window Counter (Best of Both)**

```go
func Allow(userID string) bool {
    now := time.Now().Unix()
    currentWindow := now / 60
    previousWindow := currentWindow - 1

    currentCount := redis.Get(fmt.Sprintf("rate:%s:%d", userID, currentWindow))
    previousCount := redis.Get(fmt.Sprintf("rate:%s:%d", userID, previousWindow))

    // Weighted count based on time in current window
    elapsedInCurrent := float64(now % 60) / 60
    estimatedCount := previousCount*(1-elapsedInCurrent) + currentCount

    if estimatedCount < 100 {
        redis.Incr(fmt.Sprintf("rate:%s:%d", userID, currentWindow))
        return true
    }
    return false
}
```

**Distributed Rate Limiting:**

**Redis-Based:**

```go
// Use Redis for centralized counters
func RateLimit(userID string, limit int, window time.Duration) bool {
    key := fmt.Sprintf("rl:%s", userID)

    count, err := redis.Incr(key)
    if err != nil {
        return false // Fail open or closed?
    }

    if count == 1 {
        redis.Expire(key, window)
    }

    return count <= limit
}
```

**Best Practices:**

1. **Multiple Tiers**: Global, per-user, per-IP
2. **Graceful Degradation**: Return 429 with Retry-After
3. **Monitoring**: Track rate limit hits
4. **Whitelisting**: Exclude trusted clients
5. **Different Limits**: Free vs paid tiers

### 7. How do you optimize API performance?

**Answer:**

**1. Pagination**

```
// Bad: Return all data
GET /api/posts -> 10,000 posts

// Good: Paginate
GET /api/posts?page=1&limit=20
GET /api/posts?cursor=xyz&limit=20
```

**2. Field Selection**

```
// Bad: Return all fields
GET /api/users/123
{id, name, email, address, phone, bio, preferences, ...}

// Good: Allow field selection
GET /api/users/123?fields=id,name,email
{id, name, email}
```

**3. Compression**

```
// Enable gzip compression
Content-Encoding: gzip
```

- 60-80% size reduction
- Faster transfer
- Minimal CPU overhead

**4. Caching Headers**

```
// Cache static data
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

// Client sends:
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

// Server returns:
304 Not Modified
```

**5. Batch Endpoints**

```
// Bad: N requests
GET /api/users/1
GET /api/users/2
GET /api/users/3

// Good: Batch request
POST /api/users/batch
{ids: [1, 2, 3]}
```

**6. Async Processing**

```
// Heavy operation
POST /api/reports
202 Accepted
{job_id: "abc123"}

// Check status
GET /api/jobs/abc123
{status: "processing"}

// Get result when ready
GET /api/jobs/abc123
{status: "completed", result_url: "/reports/abc123"}
```

**7. Database Optimization**

- Use indexes
- Avoid N+1 queries
- Use connection pooling
- Implement query timeout

**8. HTTP/2**

- Multiplexing (multiple requests over single connection)
- Server push
- Header compression

### 8. How do you handle real-time updates at scale?

**Answer:**

**Technologies:**

**1. WebSockets**

```javascript
// Client
const ws = new WebSocket("wss://api.example.com/ws");
ws.onmessage = (event) => {
  console.log("Update:", event.data);
};
```

- **Pros**: Full-duplex, low latency, efficient
- **Cons**: Scaling challenges, load balancer issues
- **When**: Chat, gaming, real-time collaboration

**2. Server-Sent Events (SSE)**

```javascript
// Client
const events = new EventSource("/api/updates");
events.onmessage = (event) => {
  console.log("Update:", event.data);
};
```

- **Pros**: Simpler than WebSocket, auto-reconnect, HTTP-based
- **Cons**: Unidirectional only
- **When**: Live feeds, notifications, stock tickers

**3. Long Polling**

```javascript
// Client
async function poll() {
  const response = await fetch("/api/updates");
  const data = await response.json();
  processUpdate(data);
  poll(); // Poll again
}
```

- **Pros**: Works with any HTTP server
- **Cons**: Inefficient, higher latency
- **When**: Legacy browser support needed

**4. Push Notifications**

```
Server ──► Firebase/APNs ──► Mobile Device
```

- **When**: Mobile apps, offline delivery needed

**Scaling WebSockets:**

**Architecture:**

```
Clients ──► Load Balancer ──┬──► WS Server 1 ──┐
                            ├──► WS Server 2 ──┤
                            └──► WS Server 3 ──┘
                                                └──► Redis Pub/Sub
```

**Implementation:**

```go
// Server publishes update
redis.Publish("updates", message)

// Each WS server subscribes
redis.Subscribe("updates", func(msg string) {
    // Broadcast to connected clients
    for _, conn := range connections {
        conn.WriteMessage(msg)
    }
})
```

**Challenges:**

1. **Sticky Sessions**: Route user to same server
2. **Scaling**: More servers = more complexity
3. **Message Delivery**: Ensure delivery to offline users
4. **Connection Limits**: Server can handle ~10K-50K connections

**Best Practices:**

1. **Heartbeats**: Keep connections alive
2. **Reconnection**: Auto-reconnect with backoff
3. **Message Queue**: Buffer messages for offline users
4. **Compression**: Compress messages
5. **Authentication**: Secure WebSocket connections

---

## Performance Optimization Checklist

### Backend

- [ ] Database indexes on frequently queried columns
- [ ] Connection pooling
- [ ] Query optimization (avoid N+1)
- [ ] Caching layer (Redis/Memcached)
- [ ] Async processing for heavy tasks
- [ ] CDN for static assets
- [ ] Compression (gzip/brotli)
- [ ] Load balancing
- [ ] Database read replicas
- [ ] API pagination

### Frontend

- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle minification
- [ ] Browser caching
- [ ] Service workers
- [ ] Prefetching/preloading
- [ ] Debouncing/throttling

### Infrastructure

- [ ] Horizontal scaling
- [ ] Auto-scaling policies
- [ ] Multi-region deployment
- [ ] Health checks
- [ ] Circuit breakers
- [ ] Rate limiting
- [ ] Monitoring and alerting

---

**Master these scaling concepts to build systems that can handle millions of users!**
