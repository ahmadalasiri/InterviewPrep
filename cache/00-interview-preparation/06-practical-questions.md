# Practical Caching Scenarios - Interview Questions

## Scenario 1: Design a caching layer for an e-commerce product catalog

**Question:** You have 1 million products. Design an efficient caching strategy.

**Answer:**

```javascript
class ProductCatalog {
  constructor() {
    this.redis = redisClient;
    this.localCache = new Map();  // For hot products
  }
  
  async getProduct(productId) {
    // 1. Check local cache (hot products)
    if (this.localCache.has(productId)) {
      return this.localCache.get(productId);
    }
    
    // 2. Check Redis
    const cached = await this.redis.get(`product:${productId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // 3. Fetch from database
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );
    
    if (!product) return null;
    
    // 4. Cache with TTL based on update frequency
    const ttl = product.isPopular ? 3600 : 7200;  // 1-2 hours
    await this.redis.setex(
      `product:${productId}`,
      ttl,
      JSON.stringify(product)
    );
    
    // 5. Add to local cache if popular
    if (product.views > 10000) {
      this.localCache.set(productId, product);
      setTimeout(() => this.localCache.delete(productId), 60000);
    }
    
    return product;
  }
  
  async updateProduct(productId, updates) {
    // 1. Update database
    await db.update('products', productId, updates);
    
    // 2. Invalidate caches
    this.localCache.delete(productId);
    await this.redis.del(`product:${productId}`);
    
    // 3. Invalidate related caches
    await this.redis.del(`category:${updates.categoryId}`);
    await this.redis.del('products:featured');
  }
  
  async searchProducts(query, page = 1) {
    const cacheKey = `search:${query}:${page}`;
    
    // Search results cached for 5 minutes
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    const results = await db.search(query, page);
    await this.redis.setex(cacheKey, 300, JSON.stringify(results));
    
    return results;
  }
}
```

**Key decisions:**
- Multi-level cache (local + Redis)
- Different TTLs based on popularity
- Invalidate related caches on update
- Short TTL for search results

---

## Scenario 2: Design a caching strategy for a social media news feed

**Question:** Design caching for a Twitter-like feed that shows latest posts.

**Answer:**

```javascript
class FeedCache {
  async getUserFeed(userId, page = 0, limit = 20) {
    const cacheKey = `feed:${userId}:${page}`;
    
    // Very short TTL (30 seconds) - feeds update frequently
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Fetch feed
    const feed = await this.generateFeed(userId, page, limit);
    
    // Cache for 30 seconds
    await redis.setex(cacheKey, 30, JSON.stringify(feed));
    
    return feed;
  }
  
  async generateFeed(userId, page, limit) {
    // Get user's following list (cached longer - rarely changes)
    const following = await this.getFollowing(userId);
    
    // Get posts from followed users
    const posts = await db.query(`
      SELECT * FROM posts 
      WHERE user_id IN (?) 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [following, limit, page * limit]);
    
    return posts;
  }
  
  async getFollowing(userId) {
    const cacheKey = `following:${userId}`;
    
    // Following list changes rarely, cache longer (1 hour)
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    const following = await db.query(`
      SELECT followed_id FROM follows WHERE follower_id = ?
    `, [userId]);
    
    await redis.setex(cacheKey, 3600, JSON.stringify(following));
    return following;
  }
  
  async invalidateFeedOnNewPost(userId) {
    // Get user's followers
    const followers = await db.query(`
      SELECT follower_id FROM follows WHERE followed_id = ?
    `, [userId]);
    
    // Invalidate first page of each follower's feed
    const pipeline = redis.pipeline();
    for (const follower of followers) {
      pipeline.del(`feed:${follower.follower_id}:0`);
    }
    await pipeline.exec();
  }
}
```

**Key decisions:**
- Short TTL for feeds (30s)
- Longer TTL for following list (1h)
- Invalidate only first page
- Fan-out invalidation on new post

---

## Scenario 3: Rate limiting API endpoints

**Question:** Implement rate limiting: 100 requests per minute per user.

**Answer:**

```javascript
async function rateLimitMiddleware(req, res, next) {
  const userId = req.user?.id || req.ip;
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  const windowMs = 60000;  // 1 minute
  const limit = 100;
  
  // Use sorted set to store timestamps
  const pipeline = redis.pipeline();
  
  // Remove old entries
  pipeline.zremrangebyscore(key, 0, now - windowMs);
  
  // Add current request
  pipeline.zadd(key, now, `${now}-${Math.random()}`);
  
  // Count requests in window
  pipeline.zcard(key);
  
  // Set expiry
  pipeline.expire(key, 60);
  
  const results = await pipeline.exec();
  const count = results[2][1];
  
  if (count > limit) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: 60
    });
  }
  
  next();
}
```

---

## Scenario 4: Session management with Redis

**Question:** Design a session store using Redis with automatic cleanup.

**Answer:**

```javascript
class SessionStore {
  constructor(redis) {
    this.redis = redis;
    this.ttl = 3600;  // 1 hour
  }
  
  async createSession(userId, data) {
    const sessionId = crypto.randomUUID();
    const key = `session:${sessionId}`;
    
    await this.redis.hset(key, {
      userId,
      createdAt: Date.now(),
      ...data
    });
    
    await this.redis.expire(key, this.ttl);
    
    return sessionId;
  }
  
  async getSession(sessionId) {
    const key = `session:${sessionId}`;
    const session = await this.redis.hgetall(key);
    
    if (!session || Object.keys(session).length === 0) {
      return null;
    }
    
    // Refresh TTL on access (sliding expiration)
    await this.redis.expire(key, this.ttl);
    
    return session;
  }
  
  async updateSession(sessionId, data) {
    const key = `session:${sessionId}`;
    await this.redis.hset(key, data);
    await this.redis.expire(key, this.ttl);
  }
  
  async destroySession(sessionId) {
    await this.redis.del(`session:${sessionId}`);
  }
  
  async getAllUserSessions(userId) {
    // Get all session keys
    const keys = await this.redis.keys('session:*');
    const sessions = [];
    
    for (const key of keys) {
      const session = await this.redis.hgetall(key);
      if (session.userId === userId) {
        sessions.push({ sessionId: key.split(':')[1], ...session });
      }
    }
    
    return sessions;
  }
}
```

---

## Scenario 5: Caching with complex invalidation

**Question:** You have posts, comments, and users. Design cache invalidation.

**Answer:**

```javascript
class SocialPlatformCache {
  async invalidateOnPostUpdate(postId) {
    const pipeline = redis.pipeline();
    
    // 1. Invalidate post itself
    pipeline.del(`post:${postId}`);
    
    // 2. Invalidate post's comments
    pipeline.del(`post:${postId}:comments`);
    
    // 3. Invalidate author's posts list
    const post = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
    pipeline.del(`user:${post.user_id}:posts`);
    
    // 4. Invalidate feeds (only first page)
    const followers = await db.query(`
      SELECT follower_id FROM follows WHERE followed_id = ?
    `, [post.user_id]);
    
    for (const follower of followers) {
      pipeline.del(`feed:${follower.follower_id}:0`);
    }
    
    await pipeline.exec();
  }
  
  async invalidateOnCommentAdd(commentId) {
    const comment = await db.query('SELECT post_id FROM comments WHERE id = ?', [commentId]);
    
    // Invalidate post's comments
    await redis.del(`post:${comment.post_id}:comments`);
    
    // Increment comment count
    await redis.hincrby(`post:${comment.post_id}`, 'comment_count', 1);
  }
}
```

---

## Quick Tips for Interviews

**1. Always ask clarifying questions:**
- Read/write ratio?
- Data size?
- Consistency requirements?
- Latency requirements?

**2. Consider trade-offs:**
- TTL length vs staleness
- Cache size vs hit rate
- Complexity vs maintainability

**3. Think about scale:**
- What happens at 10x traffic?
- What happens when cache fills up?
- What happens if cache fails?

**4. Don't over-engineer:**
- Start simple (cache-aside)
- Add complexity only if needed
- Measure before optimizing

---

**Congratulations!** You've completed the caching interview preparation guide.

**Review these key topics before your interview:**
1. Cache-aside pattern (most common)
2. LRU cache implementation
3. Redis data structures
4. Cache invalidation strategies
5. Distributed caching basics
6. Rate limiting with Redis
7. Common pitfalls and how to avoid them

Good luck! 🍀

