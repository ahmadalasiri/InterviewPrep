# System Design Questions for Node.js

## Scalability, Architecture, and Design Patterns

### Q1: Design a URL Shortener Service

**Requirements:**

- Generate short URLs
- Redirect to original URL
- Track analytics
- Handle millions of requests
- High availability

**Architecture:**

```
┌─────────────┐
│   Client    │
└─────┬───────┘
      │
┌─────▼──────────┐
│  Load Balancer │
└─────┬──────────┘
      │
      ├──────────┬──────────┬──────────┐
      │          │          │          │
┌─────▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
│ Node.js  │ │ Node  │ │ Node  │ │ Node  │
│ Server 1 │ │ Srv 2 │ │ Srv 3 │ │ Srv 4 │
└─────┬────┘ └───┬───┘ └───┬───┘ └───┬───┘
      │          │          │          │
      └──────────┴──────────┴──────────┘
                 │
        ┌────────┴─────────┐
        │                  │
   ┌────▼─────┐      ┌────▼──────┐
   │  Redis   │      │ PostgreSQL│
   │  Cache   │      │ Database  │
   └──────────┘      └───────────┘
```

**Implementation:**

```javascript
const express = require("express");
const redis = require("redis");
const { Pool } = require("pg");

const app = express();
const cache = redis.createClient();
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// Base62 encoding for short URLs
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeId(id) {
  if (id === 0) return BASE62[0];

  let encoded = "";
  while (id > 0) {
    encoded = BASE62[id % 62] + encoded;
    id = Math.floor(id / 62);
  }
  return encoded;
}

function decodeId(encoded) {
  let id = 0;
  for (let char of encoded) {
    id = id * 62 + BASE62.indexOf(char);
  }
  return id;
}

// Create short URL
app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;

  // Validate URL
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Check if URL already exists
  const existing = await db.query(
    "SELECT short_code FROM urls WHERE original_url = $1",
    [url]
  );

  if (existing.rows.length > 0) {
    return res.json({
      shortUrl: `https://short.url/${existing.rows[0].short_code}`,
    });
  }

  // Insert new URL
  const result = await db.query(
    "INSERT INTO urls (original_url) VALUES ($1) RETURNING id",
    [url]
  );

  const shortCode = encodeId(result.rows[0].id);

  await db.query("UPDATE urls SET short_code = $1 WHERE id = $2", [
    shortCode,
    result.rows[0].id,
  ]);

  // Cache the mapping
  await cache.setEx(shortCode, 3600, url);

  res.json({
    shortUrl: `https://short.url/${shortCode}`,
    shortCode,
  });
});

// Redirect
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  // Check cache first
  let url = await cache.get(shortCode);

  if (!url) {
    // Cache miss, query database
    const result = await db.query(
      "SELECT original_url FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    url = result.rows[0].original_url;

    // Update cache
    await cache.setEx(shortCode, 3600, url);
  }

  // Track analytics (async, non-blocking)
  trackAnalytics(shortCode, req);

  res.redirect(url);
});

async function trackAnalytics(shortCode, req) {
  await db.query(
    `INSERT INTO analytics (short_code, ip, user_agent, referer, timestamp)
     VALUES ($1, $2, $3, $4, $5)`,
    [shortCode, req.ip, req.get("user-agent"), req.get("referer"), new Date()]
  );
}

// Get analytics
app.get("/api/analytics/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  const stats = await db.query(
    `SELECT 
      COUNT(*) as total_clicks,
      COUNT(DISTINCT ip) as unique_visitors,
      DATE_TRUNC('day', timestamp) as date,
      COUNT(*) as clicks_per_day
     FROM analytics
     WHERE short_code = $1
     GROUP BY DATE_TRUNC('day', timestamp)
     ORDER BY date DESC`,
    [shortCode]
  );

  res.json(stats.rows);
});
```

**Scaling Considerations:**

- Use read replicas for database
- CDN for static content
- Sharding for large datasets
- Rate limiting per IP/user
- Auto-scaling based on traffic

---

### Q2: Design a Rate Limiting System

**Approaches:**

**1. Token Bucket:**

```javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  consume(tokens = 1) {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }
}
```

**2. Sliding Window Log:**

```javascript
class SlidingWindowLog {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(userId) {
    const now = Date.now();

    if (!this.requests.has(userId)) {
      this.requests.set(userId, []);
    }

    const userRequests = this.requests.get(userId);

    // Remove old requests
    const validRequests = userRequests.filter(
      (time) => now - time < this.windowMs
    );

    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      this.requests.set(userId, validRequests);
      return true;
    }

    this.requests.set(userId, validRequests);
    return false;
  }
}
```

**3. Distributed Rate Limiting with Redis:**

```javascript
const redis = require("redis");
const client = redis.createClient();

async function rateLimitRedis(userId, maxRequests, windowSeconds) {
  const key = `rate_limit:${userId}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  // Use sorted set with timestamps as scores
  await client.zRemRangeByScore(key, 0, windowStart);

  const count = await client.zCard(key);

  if (count < maxRequests) {
    await client.zAdd(key, { score: now, value: now.toString() });
    await client.expire(key, windowSeconds);
    return { allowed: true, remaining: maxRequests - count - 1 };
  }

  return { allowed: false, remaining: 0 };
}
```

---

### Q3: Design a Real-Time Notification System

**Architecture:**

```javascript
// WebSocket server with Redis pub/sub
const WebSocket = require("ws");
const redis = require("redis");
const express = require("express");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// Redis clients for pub/sub
const publisher = redis.createClient();
const subscriber = redis.createClient();

// Store user connections
const userConnections = new Map();

// WebSocket connection
wss.on("connection", (ws, req) => {
  // Extract user ID from token/session
  const userId = authenticateUser(req);

  if (!userId) {
    ws.close(1008, "Unauthorized");
    return;
  }

  // Store connection
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  userConnections.get(userId).add(ws);

  // Send pending notifications
  sendPendingNotifications(userId, ws);

  ws.on("close", () => {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.delete(ws);
      if (connections.size === 0) {
        userConnections.delete(userId);
      }
    }
  });
});

// Subscribe to notifications channel
subscriber.subscribe("notifications");

subscriber.on("message", (channel, message) => {
  const notification = JSON.parse(message);
  const { userId, data } = notification;

  // Send to user's active connections
  const connections = userConnections.get(userId);
  if (connections) {
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  } else {
    // User not connected, store in database
    storeNotification(userId, data);
  }
});

// API to send notification
app.post("/api/notify", async (req, res) => {
  const { userId, message, type } = req.body;

  const notification = {
    userId,
    data: {
      id: generateId(),
      message,
      type,
      timestamp: new Date().toISOString(),
    },
  };

  // Publish to Redis
  await publisher.publish("notifications", JSON.stringify(notification));

  res.json({ success: true });
});

server.listen(3000);
```

**Scaling:**

- Multiple WebSocket servers
- Redis pub/sub for communication between servers
- Database for offline notifications
- Message queue for reliability

---

### Q4: Design a Caching Strategy

**Multi-Level Caching:**

```javascript
class CacheStrategy {
  constructor() {
    // L1: In-memory cache (fast, limited size)
    this.memoryCache = new Map();
    this.maxMemorySize = 1000;

    // L2: Redis cache (medium speed, larger size)
    this.redisClient = redis.createClient();

    // L3: Database (slow, unlimited)
    this.db = new Pool();
  }

  async get(key) {
    // Check L1 cache
    if (this.memoryCache.has(key)) {
      console.log("L1 Cache hit");
      return this.memoryCache.get(key);
    }

    // Check L2 cache (Redis)
    const redisValue = await this.redisClient.get(key);
    if (redisValue) {
      console.log("L2 Cache hit");
      const value = JSON.parse(redisValue);

      // Populate L1
      this.setMemoryCache(key, value);

      return value;
    }

    // L3: Query database
    console.log("Cache miss, querying database");
    const dbValue = await this.queryDatabase(key);

    if (dbValue) {
      // Populate caches
      this.setMemoryCache(key, dbValue);
      await this.redisClient.setEx(key, 3600, JSON.stringify(dbValue));
    }

    return dbValue;
  }

  setMemoryCache(key, value) {
    // LRU eviction if cache is full
    if (this.memoryCache.size >= this.maxMemorySize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(key, value);
  }

  async invalidate(key) {
    this.memoryCache.delete(key);
    await this.redisClient.del(key);
  }

  async queryDatabase(key) {
    const result = await this.db.query("SELECT * FROM data WHERE key = $1", [
      key,
    ]);
    return result.rows[0];
  }
}
```

**Cache Patterns:**

1. **Cache-Aside (Lazy Loading)**
2. **Write-Through** - Write to cache and DB
3. **Write-Behind** - Write to cache, async to DB
4. **Refresh-Ahead** - Proactive refresh

---

### Q5: Design a Job Queue System

**Bull Queue Implementation:**

```javascript
const Queue = require("bull");
const redis = require("redis");

// Create queues
const emailQueue = new Queue("email", {
  redis: { port: 6379, host: "localhost" },
});

const imageQueue = new Queue("image-processing", {
  redis: { port: 6379, host: "localhost" },
});

// Email processor
emailQueue.process(5, async (job) => {
  const { to, subject, body } = job.data;

  console.log(`Sending email to ${to}`);

  // Simulate email sending
  await sendEmail(to, subject, body);

  return { sent: true, to };
});

// Image processor
imageQueue.process("resize", 3, async (job) => {
  const { imagePath, width, height } = job.data;

  console.log(`Resizing image: ${imagePath}`);

  await resizeImage(imagePath, width, height);

  return { resized: true, path: imagePath };
});

// Add jobs
async function queueEmail(to, subject, body) {
  await emailQueue.add(
    {
      to,
      subject,
      body,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
    }
  );
}

// Event handlers
emailQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

emailQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

// API endpoints
app.post("/api/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

  await queueEmail(to, subject, body);

  res.json({ queued: true });
});

app.post("/api/resize-image", async (req, res) => {
  const { imagePath, width, height } = req.body;

  const job = await imageQueue.add("resize", {
    imagePath,
    width,
    height,
  });

  res.json({ jobId: job.id });
});

// Get job status
app.get("/api/job/:id", async (req, res) => {
  const job = await emailQueue.getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const state = await job.getState();
  const progress = job.progress();

  res.json({
    id: job.id,
    state,
    progress,
    data: job.data,
  });
});
```

**Benefits:**

- Async processing
- Retry logic
- Priority queues
- Delayed jobs
- Rate limiting
- Monitoring

---

These system design patterns are essential for building scalable Node.js applications!

