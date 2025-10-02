// Clustering and Worker Threads in Node.js

const cluster = require("cluster");
const http = require("http");
const os = require("os");

console.log("=== Node.js Clustering ===\n");

// 1. Why Clustering?
console.log("--- Why Use Clustering? ---");

/*
Node.js runs in a single thread by default. To utilize multi-core systems:

Benefits of Clustering:
- Use all CPU cores
- Better performance for CPU-intensive tasks
- Automatic load balancing
- Increased application resilience
- Higher throughput

When to Use:
- Production environments
- Multi-core servers
- High traffic applications
- CPU-intensive operations

Master-Worker Architecture:
- Master process manages worker processes
- Workers handle actual requests
- Workers are independent processes
- Can restart failed workers
*/

console.log("✓ Clustering concepts explained");

// 2. Basic Cluster Setup
console.log("\n--- Basic Cluster ---");

// Example cluster setup
function basicCluster() {
  const numCPUs = os.cpus().length;

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Handle worker exit
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      console.log("Starting a new worker...");
      cluster.fork();
    });
  } else {
    // Workers can share any TCP connection
    // In this case, it's an HTTP server
    http
      .createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from worker ${process.pid}\n`);
      })
      .listen(8000);

    console.log(`Worker ${process.pid} started`);
  }
}

// Run: node clustering.js
// basicCluster();

console.log("✓ Basic cluster setup");

// 3. Master Process Management
console.log("\n--- Master Process ---");

function masterProcess() {
  if (!cluster.isMaster) return;

  const numWorkers = os.cpus().length;
  console.log(`Master process ${process.pid}`);

  // Track workers
  const workers = new Map();

  // Fork workers
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork({ WORKER_ID: i });
    workers.set(worker.id, worker);

    // Listen to worker messages
    worker.on("message", (msg) => {
      console.log(`Message from worker ${worker.id}:`, msg);
    });
  }

  // Worker online event
  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  // Worker listening event
  cluster.on("listening", (worker, address) => {
    console.log(
      `Worker ${worker.process.pid} listening on ${address.address}:${address.port}`
    );
  });

  // Worker disconnect event
  cluster.on("disconnect", (worker) => {
    console.log(`Worker ${worker.process.pid} disconnected`);
  });

  // Worker exit event
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code})`);
    workers.delete(worker.id);

    // Restart worker
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log("Starting a new worker...");
      const newWorker = cluster.fork();
      workers.set(newWorker.id, newWorker);
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");

    for (const [id, worker] of workers) {
      worker.disconnect();
    }

    setTimeout(() => {
      console.log("Forcing shutdown");
      process.exit(0);
    }, 10000);
  });
}

console.log("✓ Master process management");

// 4. Worker Process
console.log("\n--- Worker Process ---");

function workerProcess() {
  if (cluster.isMaster) return;

  const workerId = process.env.WORKER_ID;

  console.log(`Worker ${process.pid} (ID: ${workerId}) starting...`);

  // Create HTTP server
  const server = http.createServer((req, res) => {
    // Simulate some work
    const start = Date.now();

    // Simulate CPU-intensive task
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }

    const duration = Date.now() - start;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        worker: process.pid,
        workerId,
        duration,
        result,
      })
    );
  });

  server.listen(8000);

  // Send message to master
  process.send({ type: "ready", pid: process.pid });

  // Listen for messages from master
  process.on("message", (msg) => {
    console.log(`Worker ${process.pid} received:`, msg);

    if (msg.type === "shutdown") {
      server.close(() => {
        process.exit(0);
      });
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log(`Worker ${process.pid} shutting down...`);
    server.close(() => {
      process.exit(0);
    });
  });
}

console.log("✓ Worker process setup");

// 5. Inter-Process Communication
console.log("\n--- IPC (Inter-Process Communication) ---");

function ipcExample() {
  if (cluster.isMaster) {
    const worker = cluster.fork();

    // Send message to worker
    worker.send({ type: "config", data: { maxRequests: 1000 } });

    // Receive message from worker
    worker.on("message", (msg) => {
      console.log("Master received:", msg);

      if (msg.type === "stats") {
        console.log("Worker stats:", msg.data);
      }
    });
  } else {
    let requestCount = 0;

    // Receive message from master
    process.on("message", (msg) => {
      console.log("Worker received:", msg);
    });

    // Send stats periodically
    setInterval(() => {
      process.send({
        type: "stats",
        data: {
          pid: process.pid,
          requests: requestCount,
          memory: process.memoryUsage(),
        },
      });
    }, 5000);

    // HTTP server
    http
      .createServer((req, res) => {
        requestCount++;
        res.end("OK");
      })
      .listen(8000);
  }
}

console.log("✓ IPC defined");

// 6. Load Balancing Strategies
console.log("\n--- Load Balancing ---");

/*
Node.js cluster module provides built-in load balancing:

1. Round-robin (default on most platforms):
   - Master distributes connections to workers in rotation
   - Fair distribution
   - Good for most use cases

2. Operating system scheduling:
   - OS handles load balancing
   - Default on Windows
   - May be less predictable

Configure scheduling policy:
*/

function loadBalancing() {
  if (cluster.isMaster) {
    // Set scheduling policy
    cluster.schedulingPolicy = cluster.SCHED_RR; // Round-robin
    // cluster.schedulingPolicy = cluster.SCHED_NONE; // OS scheduling

    const numWorkers = 4;
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }

    console.log(`Load balancing with ${numWorkers} workers`);
  }
}

console.log("✓ Load balancing strategies");

// 7. Worker Threads (Alternative to Clustering)
console.log("\n--- Worker Threads ---");

/*
Worker Threads are different from cluster:
- Share memory (SharedArrayBuffer)
- Lighter weight than processes
- Better for CPU-intensive tasks in same process
- Don't share same TCP connection

Install: Built-in module
*/

const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

function workerThreadExample() {
  if (isMainThread) {
    // Main thread
    console.log("Main thread");

    const worker = new Worker(__filename, {
      workerData: { num: 5 },
    });

    worker.on("message", (msg) => {
      console.log("Received from worker:", msg);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
    });

    worker.on("exit", (code) => {
      console.log(`Worker exited with code ${code}`);
    });
  } else {
    // Worker thread
    console.log("Worker thread, data:", workerData);

    // Simulate CPU-intensive task
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }

    const result = fibonacci(workerData.num);

    // Send result back to main thread
    parentPort.postMessage({ result });
  }
}

console.log("✓ Worker threads");

// 8. Health Monitoring
console.log("\n--- Health Monitoring ---");

function healthMonitoring() {
  if (!cluster.isMaster) return;

  const workers = new Map();

  // Fork workers with health checks
  for (let i = 0; i < os.cpus().length; i++) {
    const worker = cluster.fork();
    workers.set(worker.id, {
      worker,
      lastHeartbeat: Date.now(),
      requestCount: 0,
    });
  }

  // Request heartbeat from workers
  setInterval(() => {
    for (const [id, workerInfo] of workers) {
      workerInfo.worker.send({ type: "heartbeat" });
    }
  }, 5000);

  // Check for unresponsive workers
  setInterval(() => {
    const now = Date.now();
    for (const [id, workerInfo] of workers) {
      const timeSinceHeartbeat = now - workerInfo.lastHeartbeat;

      if (timeSinceHeartbeat > 10000) {
        console.log(`Worker ${id} unresponsive, restarting...`);
        workerInfo.worker.kill();
        workers.delete(id);
      }
    }
  }, 10000);

  // Listen for worker messages
  cluster.on("message", (worker, msg) => {
    const workerInfo = workers.get(worker.id);
    if (!workerInfo) return;

    if (msg.type === "heartbeat-ack") {
      workerInfo.lastHeartbeat = Date.now();
    } else if (msg.type === "request-complete") {
      workerInfo.requestCount++;
    }
  });
}

console.log("✓ Health monitoring");

// 9. Production-Ready Cluster
console.log("\n--- Production Cluster ---");

function productionCluster() {
  if (cluster.isMaster) {
    const numWorkers = parseInt(process.env.WORKERS) || os.cpus().length;

    console.log(`Starting ${numWorkers} workers...`);

    // Fork workers
    for (let i = 0; i < numWorkers; i++) {
      createWorker();
    }

    // Graceful restart
    process.on("SIGUSR2", () => {
      console.log("Graceful restart initiated...");

      const workers = Object.values(cluster.workers);
      workers.forEach((worker) => {
        worker.send({ type: "shutdown" });

        setTimeout(() => {
          worker.kill();
        }, 10000);
      });
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("Graceful shutdown initiated...");

      Object.values(cluster.workers).forEach((worker) => {
        worker.disconnect();
      });

      setTimeout(() => {
        process.exit(0);
      }, 30000);
    });
  } else {
    // Worker
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      res.end("OK");
    });

    server.listen(process.env.PORT || 3000);

    // Graceful shutdown
    let isShuttingDown = false;

    process.on("message", (msg) => {
      if (msg.type === "shutdown" && !isShuttingDown) {
        isShuttingDown = true;

        server.close(() => {
          process.exit(0);
        });

        // Force exit after timeout
        setTimeout(() => {
          process.exit(1);
        }, 10000);
      }
    });
  }
}

function createWorker() {
  const worker = cluster.fork();

  worker.on("exit", (code, signal) => {
    if (!worker.exitedAfterDisconnect) {
      console.log("Worker crashed, starting new worker...");
      createWorker();
    }
  });

  return worker;
}

console.log("✓ Production cluster setup");

// 10. Best Practices
console.log("\n--- Best Practices ---");

/*
1. Worker Count:
   - Use os.cpus().length as default
   - Consider leaving 1 CPU for system
   - Monitor and adjust based on load
   - Don't create more workers than CPUs

2. Graceful Shutdown:
   - Close server first
   - Finish pending requests
   - Clean up resources
   - Exit cleanly

3. Error Handling:
   - Restart crashed workers
   - Log errors properly
   - Implement health checks
   - Monitor worker status

4. Load Balancing:
   - Use round-robin for most cases
   - Monitor distribution
   - Consider sticky sessions if needed

5. Communication:
   - Keep IPC messages small
   - Use appropriate message types
   - Implement timeouts
   - Handle message errors

6. Monitoring:
   - Track worker health
   - Monitor memory usage
   - Log request metrics
   - Implement alerting

7. Zero-Downtime Deployment:
   - Restart workers one at a time
   - Wait for worker to be ready
   - Use SIGUSR2 for restarts
   - Implement health checks

8. Resource Limits:
   - Set memory limits
   - Limit connections per worker
   - Implement request timeouts
   - Monitor resource usage

9. Security:
   - Run with least privileges
   - Isolate workers
   - Validate IPC messages
   - Implement rate limiting

10. Testing:
    - Test worker crashes
    - Test graceful shutdown
    - Load test cluster
    - Test failover scenarios
*/

console.log("\n✓ Clustering concepts completed");
console.log("\nKey Takeaways:");
console.log("  - Use clustering in production");
console.log("  - One worker per CPU core");
console.log("  - Implement graceful shutdown");
console.log("  - Monitor worker health");
console.log("  - Use Worker Threads for CPU-intensive tasks");

