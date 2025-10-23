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

### Q11: What is the difference between Worker Threads Module and Cluster Module?

**Answer:**

Both **Worker Threads** and **Cluster** modules enable parallel processing in Node.js, but they serve different purposes and work in fundamentally different ways.

**Key Differences:**

| Feature            | Worker Threads                   | Cluster Module               |
| ------------------ | -------------------------------- | ---------------------------- |
| **Purpose**        | CPU-intensive tasks              | Load balancing across CPUs   |
| **Memory**         | Shared memory (with limitations) | Separate memory space        |
| **Process/Thread** | Threads within same process      | Separate processes           |
| **Communication**  | Message passing (fast)           | IPC (slower)                 |
| **Port Sharing**   | No                               | Yes (all workers share port) |
| **Overhead**       | Low                              | Higher                       |
| **Use Case**       | Heavy computation                | HTTP servers, scaling apps   |
| **Isolation**      | Less isolated                    | Fully isolated               |

**Worker Threads Module:**

```javascript
// main.js
const { Worker } = require("worker_threads");

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", { workerData });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// CPU-intensive task
async function fibonacci(n) {
  const result = await runWorker(n);
  console.log(`Fibonacci(${n}) = ${result}`);
}

// Run multiple workers in parallel
Promise.all([runWorker(40), runWorker(41), runWorker(42), runWorker(43)]).then(
  (results) => {
    console.log("All results:", results);
  }
);

// worker.js
const { parentPort, workerData } = require("worker_threads");

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData);
parentPort.postMessage(result);
```

**Cluster Module:**

```javascript
// cluster-server.js
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Starting a new worker...");
    cluster.fork(); // Replace dead worker
  });

  // Listen for worker messages
  cluster.on("message", (worker, message) => {
    console.log(`Message from worker ${worker.id}:`, message);
  });
} else {
  // Workers share the same TCP connection
  const server = http.createServer((req, res) => {
    // Simulate some work
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }

    res.writeHead(200);
    res.end(`Worker ${process.pid} handled request\n`);
  });

  server.listen(8000);
  console.log(`Worker ${process.pid} started`);

  // Send message to master
  process.send({ workerId: cluster.worker.id, status: "ready" });
}
```

**Shared Memory with Worker Threads:**

```javascript
const { Worker } = require("worker_threads");
const { SharedArrayBuffer } = require("worker_threads");

// Main thread
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

const worker = new Worker(
  `
  const { parentPort, workerData } = require('worker_threads');
  const sharedArray = new Int32Array(workerData.sharedBuffer);
  
  // Modify shared memory
  sharedArray[0] = 42;
  
  parentPort.postMessage('done');
`,
  {
    eval: true,
    workerData: { sharedBuffer },
  }
);

worker.on("message", () => {
  console.log("Shared value:", sharedArray[0]); // 42
});
```

**When to Use Worker Threads:**

**Use Worker Threads for:**

1. **CPU-Intensive Computations:**

```javascript
const { Worker } = require("worker_threads");

// Image processing
async function processImage(imageData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./image-processor.js", {
      workerData: imageData,
    });

    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

// Data encryption/decryption
async function encryptData(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./crypto-worker.js", {
      workerData: { action: "encrypt", data },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

// Video encoding
async function encodeVideo(videoPath) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./video-encoder.js", {
      workerData: videoPath,
    });

    worker.on("message", resolve);
    worker.on("error", reject);
  });
}
```

2. **Heavy Calculations:**

```javascript
// worker-pool.js
const { Worker } = require("worker_threads");

class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];

    for (let i = 0; i < poolSize; i++) {
      this.addWorker();
    }
  }

  addWorker() {
    const worker = new Worker(this.workerScript);

    worker.on("message", (result) => {
      // Worker finished task
      if (this.queue.length > 0) {
        const { data, resolve, reject } = this.queue.shift();
        this.runTask(worker, data, resolve, reject);
      } else {
        worker.available = true;
      }
    });

    worker.available = true;
    this.workers.push(worker);
  }

  async execute(data) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find((w) => w.available);

      if (availableWorker) {
        this.runTask(availableWorker, data, resolve, reject);
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  runTask(worker, data, resolve, reject) {
    worker.available = false;

    worker.once("message", resolve);
    worker.once("error", reject);
    worker.postMessage(data);
  }

  destroy() {
    this.workers.forEach((worker) => worker.terminate());
  }
}

// Usage
const pool = new WorkerPool("./calculation-worker.js", 4);

async function processLargeDataset(items) {
  const results = await Promise.all(items.map((item) => pool.execute(item)));
  return results;
}
```

**When to Use Cluster:**

**Use Cluster for:**

1. **HTTP Server Scaling:**

```javascript
const cluster = require("cluster");
const express = require("express");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} starting...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Track worker restarts
  let restarts = {};

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);

    // Limit restarts to prevent crash loops
    const now = Date.now();
    if (!restarts[worker.id]) {
      restarts[worker.id] = [];
    }

    restarts[worker.id].push(now);
    restarts[worker.id] = restarts[worker.id].filter(
      (time) => now - time < 60000 // Last minute
    );

    if (restarts[worker.id].length < 5) {
      console.log("Starting new worker...");
      cluster.fork();
    } else {
      console.error("Worker crashing too frequently, not restarting");
    }
  });
} else {
  const app = express();

  app.get("/", (req, res) => {
    res.send(`Worker ${process.pid} handled request`);
  });

  app.get("/heavy", (req, res) => {
    // Simulate CPU work
    const start = Date.now();
    while (Date.now() - start < 5000) {
      // Block for 5 seconds
    }
    res.send("Done");
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });
}
```

2. **Load Balancing:**

```javascript
const cluster = require("cluster");
const http = require("http");

if (cluster.isMaster) {
  const workers = [];

  // Create workers
  for (let i = 0; i < 4; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  // Monitor worker health
  setInterval(() => {
    workers.forEach((worker) => {
      worker.send({ cmd: "ping" });
    });
  }, 5000);

  // Handle worker messages
  cluster.on("message", (worker, message) => {
    if (message.cmd === "pong") {
      console.log(`Worker ${worker.id} is healthy`);
    }
    if (message.cmd === "stats") {
      console.log(`Worker ${worker.id} stats:`, message.data);
    }
  });
} else {
  let requestCount = 0;

  const server = http.createServer((req, res) => {
    requestCount++;
    res.end(`Worker ${cluster.worker.id} - Request ${requestCount}`);
  });

  server.listen(3000);

  // Respond to health checks
  process.on("message", (message) => {
    if (message.cmd === "ping") {
      process.send({ cmd: "pong" });
    }
  });

  // Send stats periodically
  setInterval(() => {
    process.send({
      cmd: "stats",
      data: {
        requests: requestCount,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      },
    });
  }, 10000);
}
```

**Combining Both:**

```javascript
const cluster = require("cluster");
const express = require("express");
const { Worker } = require("worker_threads");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork cluster workers (for handling HTTP)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  // Handle regular requests with cluster
  app.get("/", (req, res) => {
    res.send(`Cluster worker ${process.pid}`);
  });

  // Handle CPU-intensive tasks with Worker Threads
  app.post("/process", (req, res) => {
    const worker = new Worker(
      `
      const { parentPort, workerData } = require('worker_threads');
      
      // Simulate heavy computation
      function heavyTask(data) {
        let result = 0;
        for (let i = 0; i < 1000000000; i++) {
          result += Math.sqrt(i);
        }
        return result;
      }
      
      const result = heavyTask(workerData);
      parentPort.postMessage(result);
    `,
      {
        eval: true,
        workerData: req.body,
      }
    );

    worker.on("message", (result) => {
      res.json({
        clusterId: cluster.worker.id,
        clusterPid: process.pid,
        result,
      });
    });

    worker.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
  });

  app.listen(3000, () => {
    console.log(`Cluster worker ${process.pid} started`);
  });
}
```

**Performance Comparison:**

```javascript
// Test: Worker Threads vs Cluster for CPU tasks
const { Worker } = require("worker_threads");

// Worker Threads - Fast for CPU tasks
console.time("Worker Threads");
const workers = [];
for (let i = 0; i < 4; i++) {
  workers.push(
    new Promise((resolve) => {
      const worker = new Worker(
        `
      const { parentPort } = require('worker_threads');
      let sum = 0;
      for (let i = 0; i < 1e9; i++) sum += i;
      parentPort.postMessage(sum);
    `,
        { eval: true }
      );
      worker.on("message", resolve);
    })
  );
}
await Promise.all(workers);
console.timeEnd("Worker Threads"); // ~2-3 seconds

// Cluster - Not ideal for pure CPU tasks
// (Creates full processes, higher overhead)
// Better for I/O-bound web servers
```

**Best Practices:**

**Worker Threads:**

- ✅ Use for CPU-intensive tasks
- ✅ Implement worker pools for reusability
- ✅ Limit number of workers to CPU count
- ✅ Use SharedArrayBuffer for large data sharing
- ✅ Handle worker errors and exits

**Cluster:**

- ✅ Use for HTTP servers
- ✅ One worker per CPU core
- ✅ Implement graceful restart
- ✅ Use PM2 or similar in production
- ✅ Monitor worker health
- ✅ Implement proper IPC communication

**Summary:**

- **Worker Threads**: Lightweight threads within same process, shared memory, fast communication, ideal for CPU-intensive computations
- **Cluster**: Separate processes, isolated memory, share ports, ideal for scaling HTTP servers and load balancing
- **Choose Worker Threads** for: Image processing, video encoding, data encryption, heavy calculations
- **Choose Cluster** for: Web servers, APIs, load balancing, utilizing multiple CPUs for I/O
- **Use Both** for: High-performance applications that need both scalability (Cluster) and CPU-intensive processing (Worker Threads)

---

These advanced concepts are crucial for senior Node.js positions. Practice implementing them!
