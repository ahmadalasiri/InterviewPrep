// Write-Behind Pattern (Write-Back)
// Data is written to cache immediately, database writes are queued and processed asynchronously

/*
Flow:
1. Application writes to cache (fast!)
2. Write immediately returns success
3. Write is queued for database
4. Background worker processes queue
5. Database eventually updated
*/

class WriteBehindCache {
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
    this.writeQueue = [];
    this.processing = false;
    this.batchSize = 100;
    this.flushInterval = 5000;  // 5 seconds

    // Start background flushing
    this.startFlushing();
  }

  async write(key, value, ttl = 3600) {
    console.log(`  [WRITE] ${key} to cache`);

    // Write to cache immediately (fast!)
    await this.cache.set(key, value, ttl);

    // Queue database write
    this.writeQueue.push({
      key,
      value,
      timestamp: Date.now(),
      operation: 'SET'
    });

    console.log(`  [QUEUED] ${key} for database write`);

    // Return immediately - don't wait for database
    return true;
  }

  async read(key) {
    // Always read from cache
    let data = await this.cache.get(key);

    if (data) {
      console.log(`  [HIT] ${key} from cache`);
      return data;
    }

    // Cache miss - check database
    console.log(`  [MISS] ${key} - checking database`);
    data = await this.database.query(key);

    if (data) {
      await this.cache.set(key, data, 3600);
    }

    return data;
  }

  async delete(key) {
    console.log(`  [DELETE] ${key}`);

    // Remove from cache immediately
    await this.cache.delete(key);

    // Queue database deletion
    this.writeQueue.push({
      key,
      operation: 'DELETE',
      timestamp: Date.now()
    });

    return true;
  }

  async update(key, updates, ttl = 3600) {
    // Read current value
    const current = await this.read(key);
    if (!current) {
      throw new Error(`${key} not found`);
    }

    // Merge and write
    const updated = { ...current, ...updates };
    await this.write(key, updated, ttl);

    return updated;
  }

  // Background flush process
  async startFlushing() {
    setInterval(async () => {
      await this.flushQueue();
    }, this.flushInterval);
  }

  async flushQueue() {
    if (this.processing || this.writeQueue.length === 0) {
      return;
    }

    this.processing = true;
    console.log(`\n[FLUSH] Processing ${this.writeQueue.length} writes...`);

    // Take a batch from queue
    const batch = this.writeQueue.splice(0, this.batchSize);

    try {
      // Process batch
      for (const item of batch) {
        if (item.operation === 'SET') {
          await this.database.save(item.key, item.value);
        } else if (item.operation === 'DELETE') {
          await this.database.delete(item.key);
        }
      }

      console.log(`[FLUSH] Successfully wrote ${batch.length} items to database`);
    } catch (error) {
      console.error('[FLUSH ERROR]', error);

      // Re-queue failed items
      this.writeQueue.unshift(...batch);
      console.log('[REQUEUED] Failed items re-added to queue');
    } finally {
      this.processing = false;
    }
  }

  // Manual flush (useful for shutdown)
  async flush() {
    console.log('[MANUAL FLUSH] Flushing all pending writes...');

    while (this.writeQueue.length > 0) {
      await this.flushQueue();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('[MANUAL FLUSH] Complete');
  }

  getQueueSize() {
    return this.writeQueue.length;
  }

  stopFlushing() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

// ============================================================================
// PRODUCTION IMPLEMENTATION WITH PERSISTENCE
// ============================================================================

class ProductionWriteBehind {
  constructor(redisClient, database) {
    this.redis = redisClient;
    this.db = database;
    this.queueKey = 'write:queue';
  }

  async write(userId, userData) {
    const cacheKey = `user:${userId}`;

    // Write to Redis immediately
    await this.redis.setex(cacheKey, 3600, JSON.stringify(userData));

    // Queue database write (persist queue in Redis)
    await this.redis.rpush(this.queueKey, JSON.stringify({
      key: cacheKey,
      userId,
      data: userData,
      timestamp: Date.now()
    }));

    console.log(`✓ User ${userId} cached, database write queued`);
    return userData;
  }

  async read(userId) {
    const cacheKey = `user:${userId}`;

    // Try Redis
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Fallback to database
    const user = await this.db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (user) {
      await this.redis.setex(cacheKey, 3600, JSON.stringify(user));
    }

    return user;
  }

  // Background worker
  async processQueue() {
    while (true) {
      try {
        // Get next item from queue
        const item = await this.redis.lpop(this.queueKey);

        if (!item) {
          // Queue empty, wait
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        const write = JSON.parse(item);

        // Write to database
        await this.db.query(
          'INSERT INTO users SET ? ON DUPLICATE KEY UPDATE ?',
          [write.data, write.data]
        );

        console.log(`✓ Flushed user ${write.userId} to database`);
      } catch (error) {
        console.error('Queue processing error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

// ============================================================================
// ADVANCED: WRITE-BEHIND WITH COALESCING
// ============================================================================

class WriteBehindWithCoalescing {
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
    this.pending = new Map();  // key -> latest value
    this.flushInterval = 5000;

    this.startFlushing();
  }

  async write(key, value) {
    // Write to cache
    await this.cache.set(key, value, 3600);

    // Coalesce writes: only keep latest value per key
    this.pending.set(key, {
      value,
      timestamp: Date.now()
    });

    console.log(`  [WRITE] ${key} cached (${this.pending.size} pending)`);
  }

  async startFlushing() {
    setInterval(async () => {
      if (this.pending.size === 0) return;

      console.log(`\n[FLUSH] Writing ${this.pending.size} coalesced items...`);

      // Get all pending writes
      const writes = Array.from(this.pending.entries());
      this.pending.clear();

      // Batch write to database
      try {
        for (const [key, item] of writes) {
          await this.database.save(key, item.value);
        }

        console.log(`[FLUSH] Success: ${writes.length} items`);
      } catch (error) {
        console.error('[FLUSH ERROR]', error);

        // Re-add failed writes
        for (const [key, item] of writes) {
          this.pending.set(key, item);
        }
      }
    }, this.flushInterval);
  }
}

// ============================================================================
// EXAMPLES
// ============================================================================

async function runExamples() {
  console.log('=== Write-Behind Pattern Examples ===\n');

  // Mock implementations
  const mockCache = {
    storage: new Map(),
    async get(key) {
      return this.storage.get(key);
    },
    async set(key, value, ttl) {
      this.storage.set(key, value);
    },
    async delete(key) {
      this.storage.delete(key);
    }
  };

  const mockDatabase = {
    storage: new Map(),
    writes: 0,
    async save(key, value) {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.storage.set(key, value);
      this.writes++;
    },
    async query(key) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.storage.get(key);
    },
    async delete(key) {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.storage.delete(key);
    }
  };

  // Example 1: Basic write-behind
  console.log('Example 1: Basic Write-Behind (Fast Writes)\n');
  const writeBehind = new WriteBehindCache(mockCache, mockDatabase);

  const start = Date.now();

  // Multiple fast writes
  await writeBehind.write('user:1', { id: 1, name: 'John' });
  await writeBehind.write('user:2', { id: 2, name: 'Jane' });
  await writeBehind.write('user:3', { id: 3, name: 'Bob' });

  const writeTime = Date.now() - start;
  console.log(`  Writes completed in ${writeTime}ms (very fast!)`);
  console.log(`  Queue size: ${writeBehind.getQueueSize()}`);
  console.log();

  // Example 2: Read from cache
  console.log('Example 2: Reads Always Hit Cache\n');

  await writeBehind.read('user:1');
  await writeBehind.read('user:2');
  await writeBehind.read('user:3');
  console.log();

  // Example 3: Wait for flush
  console.log('Example 3: Background Flush\n');
  console.log('Waiting for background flush...');

  await new Promise(resolve => setTimeout(resolve, 6000));

  console.log(`Database writes: ${mockDatabase.writes}`);
  console.log(`Queue size after flush: ${writeBehind.getQueueSize()}`);
  console.log();

  // Example 4: Write coalescing
  console.log('Example 4: Write Coalescing\n');
  const coalescingCache = new WriteBehindWithCoalescing(mockCache, mockDatabase);

  // Update same key multiple times
  await coalescingCache.write('counter', 1);
  await coalescingCache.write('counter', 2);
  await coalescingCache.write('counter', 3);
  await coalescingCache.write('counter', 4);
  await coalescingCache.write('counter', 5);

  console.log('5 writes coalesced into 1 database write');
  console.log('Pending:', coalescingCache.pending.size);

  // Clean up
  writeBehind.stopFlushing();
}

// Run examples
runExamples().catch(console.error);

// ============================================================================
// PROS AND CONS
// ============================================================================

/*
WRITE-BEHIND PROS:
✅ Extremely fast writes (only cache write)
✅ Can batch database writes for efficiency
✅ Reduces database load significantly
✅ Good for write-heavy workloads
✅ Can coalesce multiple writes to same key
✅ Better write throughput

WRITE-BEHIND CONS:
❌ Risk of data loss (if cache fails before flush)
❌ Eventual consistency (database lags)
❌ Complex implementation
❌ Need to handle queue failures
❌ Harder to debug
❌ Need crash recovery mechanism

WHEN TO USE:
✅ Write-heavy applications
✅ When write performance is critical
✅ When eventual consistency is acceptable
✅ Logging systems
✅ Analytics/metrics collection
✅ Gaming leaderboards
✅ View counters
✅ Session updates

WHEN NOT TO USE:
❌ Financial transactions
❌ When strong consistency required
❌ Critical data that cannot be lost
❌ Simple applications

RISK MITIGATION:
1. Persist queue to disk/Redis
2. Implement crash recovery
3. Monitor queue size
4. Set queue size limits
5. Implement retries
6. Use replication for queue
7. Regular health checks
8. Alerting on queue growth

PERFORMANCE COMPARISON:
Write-Through: 50-100ms (cache + DB)
Write-Behind:  1-5ms (cache only)
→ 10-50x faster writes!

REAL-WORLD USAGE:
- Facebook: Write-behind for news feed
- LinkedIn: Activity streams
- Gaming: Player stats, leaderboards
- Analytics: Event tracking
- Logging: Application logs
- Metrics: Time-series data
*/

module.exports = { WriteBehindCache, ProductionWriteBehind, WriteBehindWithCoalescing };

