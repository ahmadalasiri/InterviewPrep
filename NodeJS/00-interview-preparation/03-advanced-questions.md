# Advanced Node.js Interview Questions

## Streams, Performance, and Architecture

### Q1: What are Streams in Node.js and when should you use them?

**Answer:**
Streams are objects that let you read or write data continuously. Instead of loading entire files into memory, streams process data in chunks.

**Types of Streams:**

1. **Readable** - Read data (e.g., `fs.createReadStream`)
2. **Writable** - Write data (e.g., `fs.createWriteStream`)
3. **Duplex** - Both read and write (e.g., TCP sockets)
4. **Transform** - Modify data while reading/writing (e.g., compression)

**Example:**

```javascript
const fs = require("fs");

// Reading large file with streams (memory efficient)
const readStream = fs.createReadStream("large-file.txt", "utf8");

readStream.on("data", (chunk) => {
  console.log("Received chunk:", chunk.length);
});

readStream.on("end", () => {
  console.log("Finished reading");
});

// Piping streams
const writeStream = fs.createWriteStream("output.txt");
readStream.pipe(writeStream);
```

**When to use:**

- Large file processing
- HTTP request/response handling
- Real-time data processing
- Memory-efficient operations

---

### Q2: Explain the difference between process.nextTick() and setImmediate()

**Answer:**

**process.nextTick():**

- Executes callback immediately after current operation
- Before Event Loop continues
- Can starve I/O if used recursively

**setImmediate():**

- Executes in next iteration of Event Loop
- In "check" phase
- Better for I/O operations

**Example:**

```javascript
setImmediate(() => console.log("setImmediate"));
process.nextTick(() => console.log("nextTick"));
console.log("Synchronous");

// Output:
// Synchronous
// nextTick
// setImmediate
```

**Best Practice:** Use `setImmediate()` for I/O operations, `process.nextTick()` for emitting events.

---

### Q3: How do you handle memory leaks in Node.js?

**Answer:**

**Common causes:**

1. Global variables
2. Event listeners not removed
3. Closures holding references
4. Caching without limits
5. Timers not cleared

**Detection:**

```javascript
// Use --inspect flag
node --inspect app.js

// Memory profiling
const used = process.memoryUsage();
console.log({
  rss: Math.round(used.rss / 1024 / 1024) + 'MB',
  heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
  heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB'
});
```

**Prevention:**

```javascript
// Remove event listeners
const listener = () => console.log("event");
emitter.on("event", listener);
emitter.removeListener("event", listener);

// Clear timers
const timeout = setTimeout(() => {}, 1000);
clearTimeout(timeout);

// Limit cache size
const cache = new Map();
if (cache.size > 1000) {
  const firstKey = cache.keys().next().value;
  cache.delete(firstKey);
}

// Use WeakMap for object keys
const weakMap = new WeakMap();
weakMap.set(obj, data); // Auto garbage collected when obj is deleted
```

---

### Q4: What is clustering in Node.js?

**Answer:**
Clustering allows you to create multiple processes (workers) that share the same port, utilizing multiple CPU cores.

**Example:**

```javascript
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace dead worker
  });
} else {
  // Workers share TCP connection
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`Worker ${process.pid}`);
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

**Benefits:**

- Utilize all CPU cores
- Better performance
- Fault tolerance (restart failed workers)

---

### Q5: Explain Worker Threads vs Child Processes

**Answer:**

**Worker Threads:**

- Share memory (SharedArrayBuffer)
- Lightweight
- Same process
- Better for CPU-intensive tasks

```javascript
const { Worker } = require("worker_threads");

const worker = new Worker("./worker.js", {
  workerData: { num: 5 },
});

worker.on("message", (result) => {
  console.log("Result:", result);
});
```

**Child Processes:**

- Separate memory
- Heavyweight
- Different processes
- Better for running external programs

```javascript
const { spawn } = require("child_process");

const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});
```

**Comparison:**

| Feature       | Worker Threads | Child Processes   |
| ------------- | -------------- | ----------------- |
| Memory        | Shared         | Isolated          |
| Communication | Fast           | Slower (IPC)      |
| Use Case      | CPU tasks      | External programs |
| Overhead      | Low            | High              |

---

### Q6: How do you implement graceful shutdown?

**Answer:**
Properly close connections and finish ongoing requests before shutting down.

```javascript
const express = require("express");
const app = express();

const server = app.listen(3000);

// Track connections
const connections = new Set();

server.on("connection", (conn) => {
  connections.add(conn);
  conn.on("close", () => connections.delete(conn));
});

// Graceful shutdown
function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully`);

  server.close(() => {
    console.log("HTTP server closed");

    // Close database connections
    // mongoose.connection.close();

    process.exit(0);
  });

  // Force close after timeout
  setTimeout(() => {
    console.error("Forcing shutdown");
    process.exit(1);
  }, 10000);

  // Close existing connections
  connections.forEach((conn) => conn.end());
  setTimeout(() => {
    connections.forEach((conn) => conn.destroy());
  }, 5000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
```

---

### Q7: What is the N-API and why is it important?

**Answer:**
N-API (Node-API) is a stable API for building native addons that's independent of the underlying JavaScript engine.

**Benefits:**

- ABI stability across Node.js versions
- No need to recompile for each Node version
- Better performance for CPU-intensive tasks
- Access to native libraries

**Example:**

```c
// hello.c
#include <node_api.h>

napi_value Method(napi_env env, napi_callback_info info) {
  napi_value greeting;
  napi_create_string_utf8(env, "Hello from C!", NAPI_AUTO_LENGTH, &greeting);
  return greeting;
}
```

---

### Q8: How do you implement caching strategies?

**Answer:**

**In-Memory Cache:**

```javascript
class Cache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expires: Date.now() + this.ttl,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }
}

const cache = new Cache(60000);
```

**Redis Cache:**

```javascript
const redis = require("redis");
const client = redis.createClient();

async function getCachedData(key) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchDataFromDB();
  await client.setEx(key, 3600, JSON.stringify(data));
  return data;
}
```

**Caching Strategies:**

1. **Cache-Aside** - Application manages cache
2. **Write-Through** - Write to cache and DB simultaneously
3. **Write-Behind** - Write to cache, async to DB
4. **Refresh-Ahead** - Proactively refresh before expiry

---

### Q9: Explain event-driven architecture in Node.js

**Answer:**
Node.js uses an event-driven, non-blocking I/O model where operations emit events that are handled by listeners.

**EventEmitter:**

```javascript
const EventEmitter = require("events");

class UserService extends EventEmitter {
  createUser(userData) {
    // Create user
    const user = { id: 1, ...userData };

    // Emit events
    this.emit("userCreated", user);
    this.emit("email:send", user.email);

    return user;
  }
}

const userService = new UserService();

userService.on("userCreated", (user) => {
  console.log("User created:", user.id);
});

userService.on("email:send", (email) => {
  console.log("Sending email to:", email);
});

userService.createUser({ name: "John", email: "john@example.com" });
```

**Custom Events:**

```javascript
const emitter = new EventEmitter();

// One-time listener
emitter.once("event", () => {
  console.log("Fired once");
});

// Remove listener
const listener = () => console.log("Event");
emitter.on("event", listener);
emitter.removeListener("event", listener);

// Error handling
emitter.on("error", (err) => {
  console.error("Error:", err);
});
```

---

### Q10: How do you handle concurrency in Node.js?

**Answer:**

**Concurrency Patterns:**

1. **Promise.all for parallel operations:**

```javascript
async function fetchAll() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  return { users, posts, comments };
}
```

2. **Queue with concurrency limit:**

```javascript
async function processWithLimit(items, limit, processor) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const promise = processor(item).then((result) => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// Process 100 items, max 5 concurrent
await processWithLimit(items, 5, processItem);
```

3. **Worker pool:**

```javascript
const { Worker } = require("worker_threads");

class WorkerPool {
  constructor(workerPath, poolSize) {
    this.workers = [];
    this.queue = [];

    for (let i = 0; i < poolSize; i++) {
      this.workers.push({
        worker: new Worker(workerPath),
        busy: false,
      });
    }
  }

  async execute(data) {
    const available = this.workers.find((w) => !w.busy);

    if (available) {
      return this.runTask(available, data);
    }

    return new Promise((resolve) => {
      this.queue.push({ data, resolve });
    });
  }

  async runTask(workerObj, data) {
    workerObj.busy = true;

    return new Promise((resolve) => {
      workerObj.worker.once("message", (result) => {
        workerObj.busy = false;
        resolve(result);

        // Process queue
        if (this.queue.length > 0) {
          const { data, resolve } = this.queue.shift();
          this.runTask(workerObj, data).then(resolve);
        }
      });

      workerObj.worker.postMessage(data);
    });
  }
}
```

---

These advanced concepts are crucial for senior Node.js positions. Practice implementing them!

