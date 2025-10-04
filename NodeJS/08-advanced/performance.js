// Performance Optimization in Node.js

console.log("=== Node.js Performance Optimization ===\n");

// 1. Profiling and Monitoring
console.log("--- Profiling Tools ---");

/*
Built-in profiling tools:

1. Node.js Built-in Profiler:
   node --prof app.js
   node --prof-process isolate-*.log

2. Chrome DevTools:
   node --inspect app.js
   Open chrome://inspect

3. Clinic.js Suite:
   npm install -g clinic
   clinic doctor -- node app.js
   clinic flame -- node app.js
   clinic bubbleprof -- node app.js

4. Memory profiling:
   node --inspect --expose-gc app.js

5. CPU profiling:
   const { Session } = require('inspector');
   const fs = require('fs');
   const session = new Session();
   session.connect();
   session.post('Profiler.enable');
   session.post('Profiler.start');
   // ... your code ...
   session.post('Profiler.stop', (err, { profile }) => {
     fs.writeFileSync('profile.cpuprofile', JSON.stringify(profile));
   });
*/

console.log("✓ Profiling tools explained");

// 2. Event Loop Monitoring
console.log("\n--- Event Loop ---");

// Event loop lag monitoring
let lastCheck = Date.now();

setInterval(() => {
  const now = Date.now();
  const lag = now - lastCheck - 1000; // Expected to be ~0ms
  if (lag > 100) {
    console.warn(`Event loop lag detected: ${lag}ms`);
  }
  lastCheck = now;
}, 1000);

// Blocking vs Non-blocking
function blockingExample() {
  console.log("Start");

  // BAD: Blocking the event loop
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Block for 3 seconds
  }

  console.log("End");
}

function nonBlockingExample() {
  console.log("Start");

  // GOOD: Non-blocking
  setTimeout(() => {
    console.log("End");
  }, 3000);
}

// CPU-intensive task with setImmediate
function processItems(items) {
  const batchSize = 100;
  let index = 0;

  function processBatch() {
    const endIndex = Math.min(index + batchSize, items.length);

    for (let i = index; i < endIndex; i++) {
      // Process item
      processItem(items[i]);
    }

    index = endIndex;

    if (index < items.length) {
      // Let event loop handle other tasks
      setImmediate(processBatch);
    }
  }

  processBatch();
}

function processItem(item) {
  // Simulate processing
}

console.log("✓ Event loop monitoring");

// 3. Memory Management
console.log("\n--- Memory Management ---");

// Memory usage
function checkMemory() {
  const used = process.memoryUsage();
  console.log("Memory usage:");
  console.log(`  RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  External: ${(used.external / 1024 / 1024).toFixed(2)} MB`);
}

checkMemory();

// Memory leaks - Common causes
// 1. Global variables
let globalCache = {}; // BAD: Grows forever

// 2. Closures holding references
function createLeak() {
  const largeData = new Array(1000000);

  return function () {
    // Closure keeps largeData in memory
    return largeData[0];
  };
}

// 3. Event listeners not removed
const EventEmitter = require("events");
const emitter = new EventEmitter();

function setupListener() {
  function onEvent() {
    console.log("Event fired");
  }

  emitter.on("event", onEvent);

  // GOOD: Remove listener when done
  return () => emitter.removeListener("event", onEvent);
}

// 4. Timers not cleared
function leakyTimer() {
  setInterval(() => {
    // This runs forever
    console.log("Tick");
  }, 1000);
}

// GOOD: Clear timers
function cleanTimer() {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // Clear when done
  setTimeout(() => {
    clearInterval(timer);
  }, 10000);
}

// Object pooling to reduce GC pressure
class ObjectPool {
  constructor(factory, reset, initialSize = 10) {
    this.factory = factory;
    this.reset = reset;
    this.pool = [];

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.factory();
  }

  release(obj) {
    this.reset(obj);
    this.pool.push(obj);
  }
}

// Usage
const bufferPool = new ObjectPool(
  () => Buffer.allocUnsafe(1024),
  (buf) => buf.fill(0),
  100
);

console.log("✓ Memory management");

// 4. Caching Strategies
console.log("\n--- Caching ---");

// Simple in-memory cache
class SimpleCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }
}

// LRU Cache
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    const value = this.cache.get(key);
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}

// Memoization
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveOperation = memoize((n) => {
  console.log("Computing...");
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += Math.sqrt(i);
  }
  return result;
});

console.log(expensiveOperation(1000000)); // Computes
console.log(expensiveOperation(1000000)); // Returns cached

console.log("✓ Caching strategies");

// 5. Database Optimization
console.log("\n--- Database Optimization ---");

/*
Best practices:

1. Connection pooling:
   const pool = new Pool({
     max: 20,
     min: 5,
     idleTimeoutMillis: 30000
   });

2. Query optimization:
   - Use indexes
   - Avoid SELECT *
   - Use EXPLAIN to analyze queries
   - Batch operations when possible

3. Use prepared statements:
   const query = {
     name: 'get-user',
     text: 'SELECT * FROM users WHERE id = $1',
     values: [userId]
   };

4. Cache database results:
   - Use Redis for session data
   - Cache frequently accessed data
   - Invalidate cache on updates

5. Pagination:
   - Limit result sets
   - Use cursor-based pagination for large datasets
   - Don't fetch all records at once

6. N+1 query problem:
   BAD:
   const users = await User.findAll();
   for (const user of users) {
     user.posts = await Post.findByUserId(user.id); // N queries
   }

   GOOD:
   const users = await User.findAll({
     include: [Post] // Single query with join
   });
*/

console.log("✓ Database optimization guidelines");

// 6. Async/Await Optimization
console.log("\n--- Async/Await Optimization ---");

// Sequential vs Parallel
async function sequentialExample() {
  console.time("sequential");

  // BAD: Sequential (slow)
  const result1 = await fetchData1(); // Wait 1s
  const result2 = await fetchData2(); // Wait 1s
  const result3 = await fetchData3(); // Wait 1s
  // Total: 3s

  console.timeEnd("sequential");
}

async function parallelExample() {
  console.time("parallel");

  // GOOD: Parallel (fast)
  const [result1, result2, result3] = await Promise.all([
    fetchData1(), // All run concurrently
    fetchData2(),
    fetchData3(),
  ]);
  // Total: 1s (longest)

  console.timeEnd("parallel");
}

async function fetchData1() {
  return new Promise((resolve) => setTimeout(() => resolve("data1"), 1000));
}
async function fetchData2() {
  return new Promise((resolve) => setTimeout(() => resolve("data2"), 1000));
}
async function fetchData3() {
  return new Promise((resolve) => setTimeout(() => resolve("data3"), 1000));
}

// Limit concurrent operations
async function limitedParallel(items, limit, asyncFn) {
  const results = [];

  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(asyncFn));
    results.push(...batchResults);
  }

  return results;
}

console.log("✓ Async/await optimization");

// 7. Compression
console.log("\n--- Compression ---");

/*
Use compression for HTTP responses:

const compression = require('compression');
app.use(compression());

Or use specific compression:

const zlib = require('zlib');
const { pipeline } = require('stream');

// Gzip
pipeline(
  fs.createReadStream('file.txt'),
  zlib.createGzip(),
  fs.createWriteStream('file.txt.gz'),
  (err) => {
    if (err) console.error(err);
  }
);

// Brotli (better compression)
pipeline(
  fs.createReadStream('file.txt'),
  zlib.createBrotliCompress(),
  fs.createWriteStream('file.txt.br'),
  (err) => {
    if (err) console.error(err);
  }
);
*/

console.log("✓ Compression");

// 8. HTTP/2 and Keep-Alive
console.log("\n--- HTTP Optimization ---");

/*
1. Enable HTTP/2:
   const http2 = require('http2');
   const server = http2.createSecureServer(options);

2. Keep-Alive:
   const http = require('http');
   const agent = new http.Agent({ keepAlive: true });

3. Connection pooling for external APIs:
   const axios = require('axios');
   const instance = axios.create({
     httpAgent: new http.Agent({ keepAlive: true }),
     httpsAgent: new https.Agent({ keepAlive: true })
   });

4. Set appropriate timeouts:
   server.timeout = 30000;
   server.keepAliveTimeout = 65000;
*/

console.log("✓ HTTP optimization");

// 9. Code Optimization
console.log("\n--- Code Optimization ---");

// Use === instead of ==
const a = "1";
const b = 1;
console.log(a === b); // false (recommended)
console.log(a == b); // true (avoid)

// Avoid try-catch in hot paths
function withTryCatch() {
  try {
    return JSON.parse('{"key": "value"}');
  } catch (e) {
    return null;
  }
}

function withoutTryCatch() {
  // Pre-validate instead
  return JSON.parse('{"key": "value"}');
}

// Use const and let (not var)
// const and let are block-scoped and optimized better

// Avoid delete operator
const obj = { a: 1, b: 2 };
delete obj.a; // BAD: Deoptimizes object

// Better: set to undefined or use Map
obj.a = undefined; // GOOD
const map = new Map(); // GOOD for dynamic keys

// Pre-allocate arrays when size is known
const items = new Array(1000); // GOOD
// vs
const items2 = []; // OK, but less optimal for large arrays

console.log("✓ Code optimization");

// 10. Best Practices Summary
console.log("\n--- Best Practices ---");

/*
1. Profile First:
   - Measure before optimizing
   - Use appropriate tools
   - Focus on bottlenecks

2. Event Loop:
   - Keep event loop responsive
   - Use setImmediate for CPU tasks
   - Avoid blocking operations

3. Memory:
   - Monitor memory usage
   - Fix memory leaks
   - Use object pooling
   - Implement proper caching

4. Database:
   - Use connection pooling
   - Optimize queries
   - Cache results
   - Use pagination

5. Async Operations:
   - Run independent tasks in parallel
   - Use Promise.all
   - Limit concurrent operations
   - Handle errors properly

6. Caching:
   - Cache expensive operations
   - Use appropriate TTL
   - Implement cache invalidation
   - Consider distributed cache (Redis)

7. Compression:
   - Compress HTTP responses
   - Use gzip or brotli
   - Compress static assets

8. Monitoring:
   - Log performance metrics
   - Track error rates
   - Monitor memory usage
   - Set up alerts

9. Testing:
   - Load test your application
   - Profile under load
   - Test memory leaks
   - Benchmark critical paths

10. Scaling:
    - Use clustering
    - Implement load balancing
    - Consider horizontal scaling
    - Use CDN for static assets
*/

console.log("\n✓ Performance optimization concepts completed");
console.log("\nKey Takeaways:");
console.log("  - Profile before optimizing");
console.log("  - Keep event loop responsive");
console.log("  - Implement proper caching");
console.log("  - Monitor memory usage");
console.log("  - Run async operations in parallel");




