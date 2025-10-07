// Caching Strategies and Implementation Examples

import * as crypto from "crypto";

// ============================================
// Cache Interface
// ============================================

interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// ============================================
// 1. In-Memory Cache (Simple LRU)
// ============================================

class LRUCache implements Cache {
  private cache: Map<string, { value: string; expires?: number }>;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);

    return item.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    // If at max size, remove least recently used (first item)
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const expires = ttl ? Date.now() + ttl * 1000 : undefined;
    this.cache.set(key, { value, expires });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// ============================================
// 2. Cache-Aside (Lazy Loading) Pattern
// ============================================

class Database {
  private data: Map<string, any> = new Map();

  constructor() {
    // Simulate some data
    this.data.set("user:1", {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
    });
    this.data.set("user:2", { id: 2, name: "Bob", email: "bob@example.com" });
    this.data.set("user:3", {
      id: 3,
      name: "Charlie",
      email: "charlie@example.com",
    });
  }

  async get(key: string): Promise<any> {
    // Simulate database latency
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.data.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.data.set(key, value);
  }
}

class CacheAsideService {
  private cache: Cache;
  private db: Database;

  constructor(cache: Cache, db: Database) {
    this.cache = cache;
    this.db = db;
  }

  async getUser(userId: number): Promise<any> {
    const key = `user:${userId}`;

    // 1. Try cache first
    const cached = await this.cache.get(key);
    if (cached) {
      console.log(`Cache HIT for ${key}`);
      return JSON.parse(cached);
    }

    console.log(`Cache MISS for ${key}`);

    // 2. Fetch from database
    const user = await this.db.get(key);
    if (!user) {
      return null;
    }

    // 3. Store in cache for future requests
    await this.cache.set(key, JSON.stringify(user), 300); // 5 min TTL

    return user;
  }

  async updateUser(userId: number, data: any): Promise<void> {
    const key = `user:${userId}`;

    // Update database
    await this.db.set(key, data);

    // Invalidate cache
    await this.cache.delete(key);
  }
}

// ============================================
// 3. Write-Through Cache Pattern
// ============================================

class WriteThroughService {
  private cache: Cache;
  private db: Database;

  constructor(cache: Cache, db: Database) {
    this.cache = cache;
    this.db = db;
  }

  async getUser(userId: number): Promise<any> {
    const key = `user:${userId}`;

    // Try cache first
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from database
    const user = await this.db.get(key);
    if (user) {
      await this.cache.set(key, JSON.stringify(user), 300);
    }

    return user;
  }

  async updateUser(userId: number, data: any): Promise<void> {
    const key = `user:${userId}`;

    // Write to cache AND database simultaneously
    await Promise.all([
      this.cache.set(key, JSON.stringify(data), 300),
      this.db.set(key, data),
    ]);
  }
}

// ============================================
// 4. Write-Behind (Write-Back) Cache Pattern
// ============================================

class WriteBehindService {
  private cache: Cache;
  private db: Database;
  private writeQueue: Map<string, any>;
  private flushInterval: NodeJS.Timeout;

  constructor(cache: Cache, db: Database) {
    this.cache = cache;
    this.db = db;
    this.writeQueue = new Map();

    // Flush queue every 5 seconds
    this.flushInterval = setInterval(() => this.flushWrites(), 5000);
  }

  async getUser(userId: number): Promise<any> {
    const key = `user:${userId}`;

    // Try cache first
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from database
    const user = await this.db.get(key);
    if (user) {
      await this.cache.set(key, JSON.stringify(user), 300);
    }

    return user;
  }

  async updateUser(userId: number, data: any): Promise<void> {
    const key = `user:${userId}`;

    // Write to cache immediately
    await this.cache.set(key, JSON.stringify(data), 300);

    // Queue for async database write
    this.writeQueue.set(key, data);
  }

  private async flushWrites(): Promise<void> {
    if (this.writeQueue.size === 0) {
      return;
    }

    console.log(`Flushing ${this.writeQueue.size} writes to database...`);

    const writes = Array.from(this.writeQueue.entries());
    this.writeQueue.clear();

    // Write all queued items to database
    await Promise.all(writes.map(([key, value]) => this.db.set(key, value)));

    console.log("Flush complete");
  }

  stop(): void {
    clearInterval(this.flushInterval);
    this.flushWrites(); // Final flush
  }
}

// ============================================
// 5. Cache Eviction Policies
// ============================================

// LRU (Least Recently Used) - Already implemented above

// LFU (Least Frequently Used)
class LFUCache implements Cache {
  private cache: Map<
    string,
    { value: string; frequency: number; expires?: number }
  >;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    // Increment frequency
    item.frequency++;

    return item.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    // If at max size, remove least frequently used
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      let minFreq = Infinity;
      let leastUsedKey = "";

      for (const [k, v] of this.cache.entries()) {
        if (v.frequency < minFreq) {
          minFreq = v.frequency;
          leastUsedKey = k;
        }
      }

      this.cache.delete(leastUsedKey);
    }

    const expires = ttl ? Date.now() + ttl * 1000 : undefined;
    const existing = this.cache.get(key);
    const frequency = existing ? existing.frequency : 1;

    this.cache.set(key, { value, frequency, expires });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// ============================================
// 6. Distributed Cache Simulation
// ============================================

class DistributedCache {
  private nodes: LRUCache[];
  private nodeCount: number;

  constructor(nodeCount: number = 3) {
    this.nodeCount = nodeCount;
    this.nodes = Array.from({ length: nodeCount }, () => new LRUCache(100));
  }

  private getNodeIndex(key: string): number {
    // Consistent hashing (simplified)
    const hash = crypto.createHash("md5").update(key).digest("hex");
    const hashValue = parseInt(hash.substring(0, 8), 16);
    return hashValue % this.nodeCount;
  }

  async get(key: string): Promise<string | null> {
    const nodeIndex = this.getNodeIndex(key);
    return this.nodes[nodeIndex].get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const nodeIndex = this.getNodeIndex(key);
    return this.nodes[nodeIndex].set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    const nodeIndex = this.getNodeIndex(key);
    return this.nodes[nodeIndex].delete(key);
  }
}

// ============================================
// 7. Cache Stampede Prevention
// ============================================

class StampedeProtectedCache {
  private cache: Cache;
  private db: Database;
  private locks: Map<string, Promise<any>>;

  constructor(cache: Cache, db: Database) {
    this.cache = cache;
    this.db = db;
    this.locks = new Map();
  }

  async getUser(userId: number): Promise<any> {
    const key = `user:${userId}`;

    // Try cache first
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // Check if another request is already fetching this key
    if (this.locks.has(key)) {
      console.log(`Waiting for lock on ${key}`);
      return this.locks.get(key);
    }

    // Create promise for this fetch
    const fetchPromise = (async () => {
      try {
        // Fetch from database
        const user = await this.db.get(key);
        if (user) {
          await this.cache.set(key, JSON.stringify(user), 300);
        }
        return user;
      } finally {
        // Release lock
        this.locks.delete(key);
      }
    })();

    // Store promise in locks
    this.locks.set(key, fetchPromise);

    return fetchPromise;
  }
}

// ============================================
// 8. Example Usage and Testing
// ============================================

async function demonstrateCaching() {
  console.log("=== Caching Strategies Demo ===\n");

  const cache = new LRUCache(100);
  const db = new Database();

  // 1. Cache-Aside Pattern
  console.log("1. Cache-Aside Pattern");
  console.log("----------------------");
  const cacheAsideService = new CacheAsideService(cache, db);

  console.time("First request (cache miss)");
  await cacheAsideService.getUser(1);
  console.timeEnd("First request (cache miss)");

  console.time("Second request (cache hit)");
  await cacheAsideService.getUser(1);
  console.timeEnd("Second request (cache hit)");

  // 2. Cache Stampede Protection
  console.log("\n2. Cache Stampede Protection");
  console.log("----------------------------");
  const stampedeCache = new StampedeProtectedCache(new LRUCache(100), db);

  // Simulate multiple concurrent requests for same key
  await Promise.all([
    stampedeCache.getUser(2),
    stampedeCache.getUser(2),
    stampedeCache.getUser(2),
  ]);

  // 3. Write-Behind Pattern
  console.log("\n3. Write-Behind Pattern");
  console.log("-----------------------");
  const writeBehindService = new WriteBehindService(new LRUCache(100), db);

  console.time("Update with write-behind");
  await writeBehindService.updateUser(3, { id: 3, name: "Charlie Updated" });
  console.timeEnd("Update with write-behind");

  console.log("Waiting for background flush...");
  await new Promise((resolve) => setTimeout(resolve, 6000));
  writeBehindService.stop();

  // 4. Distributed Cache
  console.log("\n4. Distributed Cache");
  console.log("--------------------");
  const distributedCache = new DistributedCache(3);

  const keys = ["user:1", "user:2", "user:3", "user:4", "user:5"];
  for (const key of keys) {
    await distributedCache.set(key, `data-${key}`, 300);
    console.log(`Stored ${key} in distributed cache`);
  }

  // 5. LFU Cache
  console.log("\n5. LFU Cache Demo");
  console.log("-----------------");
  const lfuCache = new LFUCache(3);

  await lfuCache.set("a", "value-a");
  await lfuCache.set("b", "value-b");
  await lfuCache.set("c", "value-c");

  // Access 'a' and 'b' multiple times
  await lfuCache.get("a");
  await lfuCache.get("a");
  await lfuCache.get("b");

  // Add new item - should evict 'c' (least frequently used)
  await lfuCache.set("d", "value-d");

  console.log("Cache state after adding d:");
  console.log("a:", await lfuCache.get("a"));
  console.log("b:", await lfuCache.get("b"));
  console.log("c:", await lfuCache.get("c")); // Should be null
  console.log("d:", await lfuCache.get("d"));

  console.log("\n=== Demo Complete ===");
}

// Run demonstration
if (require.main === module) {
  demonstrateCaching().catch(console.error);
}

export {
  Cache,
  LRUCache,
  LFUCache,
  CacheAsideService,
  WriteThroughService,
  WriteBehindService,
  DistributedCache,
  StampedeProtectedCache,
};

/*
Expected Output:

=== Caching Strategies Demo ===

1. Cache-Aside Pattern
----------------------
Cache MISS for user:1
First request (cache miss): 105ms
Cache HIT for user:1
Second request (cache hit): 1ms

2. Cache Stampede Protection
----------------------------
Waiting for lock on user:2
Waiting for lock on user:2

3. Write-Behind Pattern
-----------------------
Update with write-behind: 2ms
Waiting for background flush...
Flushing 1 writes to database...
Flush complete

4. Distributed Cache
--------------------
Stored user:1 in distributed cache
Stored user:2 in distributed cache
Stored user:3 in distributed cache
Stored user:4 in distributed cache
Stored user:5 in distributed cache

5. LFU Cache Demo
-----------------
Cache state after adding d:
a: value-a
b: value-b
c: null
d: value-d

=== Demo Complete ===

Key Concepts Demonstrated:
1. LRU Cache: Evicts least recently used items
2. LFU Cache: Evicts least frequently used items
3. Cache-Aside: Application manages cache explicitly
4. Write-Through: Write to cache and DB simultaneously
5. Write-Behind: Write to cache immediately, DB asynchronously
6. Distributed Cache: Consistent hashing across multiple nodes
7. Stampede Protection: Prevent multiple simultaneous DB queries for same key
8. TTL: Automatic expiration of cached items
*/
