// Worker Threads in Node.js

const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
  MessageChannel,
  MessagePort,
} = require("worker_threads");
const os = require("os");

console.log("=== Node.js Worker Threads ===\n");

// 1. Introduction to Worker Threads
console.log("--- Worker Threads Overview ---");

/*
Worker Threads enable parallel JavaScript execution:

Key Concepts:
- Run JavaScript in parallel threads
- Share memory with SharedArrayBuffer
- Lighter than child processes
- Better for CPU-intensive JavaScript tasks
- Available since Node.js 10.5.0 (stable in 12+)

When to use Worker Threads:
- CPU-intensive JavaScript operations
- Parallel data processing
- Computational tasks (crypto, compression)
- Image/video processing
- Don't block the main event loop

Worker Threads vs Child Processes:
- Threads: Shared memory, lighter, same Node.js instance
- Processes: Isolated memory, heavier, separate instances
- Threads: Better for JS-intensive tasks
- Processes: Better for running external programs

Worker Threads vs Clustering:
- Threads: Share memory, same process
- Clustering: Separate processes, no shared memory
- Threads: CPU-intensive computation
- Clustering: Load balancing HTTP requests
*/

console.log("✓ Worker Threads concepts explained");

// 2. Basic Worker Thread
console.log("\n--- Basic Worker Thread ---");

/*
Creating a Worker:
- Worker constructor takes file path or code string
- Communication via message passing
- isMainThread differentiates main/worker code
- parentPort for communication in worker
*/

// Example: Basic worker setup
function basicWorkerExample() {
  if (isMainThread) {
    console.log("Main thread creating worker:");

    // This code runs in main thread
    const worker = new Worker(__filename); // Can pass file path or code

    worker.on("message", (msg) => {
      console.log("Main received:", msg);
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });

    worker.postMessage("Hello Worker!");
  } else {
    // This code runs in worker thread
    parentPort.on("message", (msg) => {
      console.log("Worker received:", msg);
      parentPort.postMessage("Hello Main Thread!");
    });
  }
}

console.log("✓ Basic worker example created");

// 3. Worker Data and Communication
console.log("\n--- Worker Data ---");

/*
Passing Data to Workers:
1. workerData - Initial data passed to worker
2. postMessage() - Send messages after creation
3. MessageChannel - Advanced communication

Data Transfer Methods:
- Structured Clone (default) - Copies data
- Transfer - Moves ArrayBuffer/MessagePort ownership
- SharedArrayBuffer - Shared memory between threads
*/

// Example: Worker with initial data
function workerDataExample() {
  if (isMainThread) {
    console.log("Creating worker with initial data:");

    const worker = new Worker(__filename, {
      workerData: {
        task: "process",
        value: 42,
        items: [1, 2, 3, 4, 5],
      },
    });

    worker.on("message", (result) => {
      console.log("Computation result:", result);
    });
  } else {
    // Access initial data via workerData
    const { task, value, items } = workerData;
    console.log("Worker processing:", { task, value, items });

    // Perform computation
    const result = items.reduce((sum, n) => sum + n, 0) * value;
    parentPort.postMessage(result);
  }
}

// Example: Transferable objects
function transferableExample() {
  if (isMainThread) {
    console.log("\nTransferable objects example:");

    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 42;

    const worker = new Worker(__filename);

    // Transfer ownership of buffer
    worker.postMessage({ buffer }, [buffer]);

    // buffer is now unusable in main thread
    console.log("Buffer transferred, length:", buffer.byteLength); // 0

    worker.on("message", (msg) => {
      console.log("Worker processed buffer:", msg);
    });
  } else {
    parentPort.on("message", ({ buffer }) => {
      const view = new Uint8Array(buffer);
      console.log("Worker received value:", view[0]);
      view[0] = 100;
      // Transfer back
      parentPort.postMessage({ buffer }, [buffer]);
    });
  }
}

console.log("✓ Worker data examples created");

// 4. Worker Pool Pattern
console.log("\n--- Worker Pool ---");

// Example: Worker pool implementation
class WorkerPool {
  constructor(workerScript, poolSize = os.cpus().length) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.freeWorkers = [];
    this.queue = [];

    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);

      worker.on("message", (result) => {
        // Worker finished task
        if (worker.currentTask) {
          worker.currentTask.resolve(result);
          worker.currentTask = null;
        }

        // Return worker to pool
        this.freeWorkers.push(worker);
        this.processQueue();
      });

      worker.on("error", (error) => {
        if (worker.currentTask) {
          worker.currentTask.reject(error);
          worker.currentTask = null;
        }
        console.error("Worker error:", error);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
        }
        // Remove from arrays
        this.workers = this.workers.filter((w) => w !== worker);
        this.freeWorkers = this.freeWorkers.filter((w) => w !== worker);
      });

      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  execute(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  processQueue() {
    while (this.queue.length > 0 && this.freeWorkers.length > 0) {
      const task = this.queue.shift();
      const worker = this.freeWorkers.shift();

      worker.currentTask = {
        resolve: task.resolve,
        reject: task.reject,
      };

      worker.postMessage(task.data);
    }
  }

  async terminate() {
    await Promise.all(this.workers.map((worker) => worker.terminate()));
    this.workers = [];
    this.freeWorkers = [];
    this.queue = [];
  }

  get availableWorkers() {
    return this.freeWorkers.length;
  }

  get queueSize() {
    return this.queue.length;
  }
}

console.log("✓ Worker pool implementation created");

// 5. Shared Memory
console.log("\n--- Shared Memory ---");

/*
SharedArrayBuffer:
- Shared memory between threads
- Atomic operations for synchronization
- Faster than message passing
- More complex to use correctly
- Requires careful synchronization

Use Cases:
- High-performance computations
- Real-time data sharing
- Lock-free data structures
- Performance-critical code
*/

// Example: SharedArrayBuffer
function sharedMemoryExample() {
  if (isMainThread) {
    console.log("Shared memory example:");

    // Create shared memory
    const sharedBuffer = new SharedArrayBuffer(4);
    const sharedArray = new Int32Array(sharedBuffer);

    // Initialize value
    sharedArray[0] = 0;

    const worker = new Worker(__filename, {
      workerData: { sharedBuffer },
    });

    // Increment in main thread
    const incrementMain = () => {
      Atomics.add(sharedArray, 0, 1);
      console.log("Main thread incremented:", sharedArray[0]);
    };

    setInterval(incrementMain, 100);

    worker.on("message", (msg) => {
      console.log("Worker message:", msg);
    });
  } else {
    const { sharedBuffer } = workerData;
    const sharedArray = new Int32Array(sharedBuffer);

    // Increment in worker thread
    setInterval(() => {
      const oldValue = Atomics.add(sharedArray, 0, 1);
      parentPort.postMessage({
        thread: "worker",
        oldValue,
        newValue: sharedArray[0],
      });
    }, 150);
  }
}

// Example: Atomic operations
function atomicOperations() {
  console.log("\nAtomic operations:");

  const buffer = new SharedArrayBuffer(4);
  const view = new Int32Array(buffer);

  // Atomic operations
  Atomics.store(view, 0, 10); // Store value
  const loaded = Atomics.load(view, 0); // Load value
  const added = Atomics.add(view, 0, 5); // Add and return old value
  const subbed = Atomics.sub(view, 0, 3); // Subtract and return old value

  // Compare and exchange
  const exchanged = Atomics.compareExchange(view, 0, 12, 20);
  // If view[0] === 12, set to 20

  // Wait and notify (for synchronization)
  // Atomics.wait(view, index, expectedValue, timeout)
  // Atomics.notify(view, index, count)

  console.log("Atomic operations demonstrated");
}

console.log("✓ Shared memory examples created");

// 6. Advanced Communication Patterns
console.log("\n--- Advanced Communication ---");

// Example: MessageChannel for direct worker-to-worker communication
function messageChannelExample() {
  if (isMainThread) {
    console.log("MessageChannel example:");

    const worker1 = new Worker(__filename, {
      workerData: { name: "Worker1" },
    });
    const worker2 = new Worker(__filename, {
      workerData: { name: "Worker2" },
    });

    // Create channel
    const { port1, port2 } = new MessageChannel();

    // Send ports to workers
    worker1.postMessage({ port: port1 }, [port1]);
    worker2.postMessage({ port: port2 }, [port2]);

    console.log("Workers can now communicate directly");
  } else {
    const { name } = workerData;

    parentPort.on("message", ({ port }) => {
      if (port instanceof MessagePort) {
        // Worker received port
        port.on("message", (msg) => {
          console.log(`${name} received from other worker:`, msg);
        });

        // Send message to other worker
        port.postMessage(`Hello from ${name}`);
      }
    });
  }
}

// Example: Broadcast channel pattern
class BroadcastToWorkers {
  constructor(workers) {
    this.workers = workers;
  }

  broadcast(message) {
    this.workers.forEach((worker) => {
      worker.postMessage(message);
    });
  }

  postToOne(workerId, message) {
    if (this.workers[workerId]) {
      this.workers[workerId].postMessage(message);
    }
  }
}

console.log("✓ Advanced communication patterns created");

// 7. Performance Optimization
console.log("\n--- Performance Optimization ---");

/*
Best Practices:

1. Pool Size:
   - Match CPU cores (os.cpus().length)
   - Consider task duration
   - Monitor resource usage
   - Adjust based on workload

2. Task Granularity:
   - Tasks should be substantial (>10ms)
   - Worker overhead: ~10-20ms
   - Batch small tasks together
   - Profile to find sweet spot

3. Data Transfer:
   - Use transferables for large buffers
   - SharedArrayBuffer for frequent access
   - Minimize data copying
   - Consider serialization cost

4. Memory Management:
   - Workers have separate heaps
   - Monitor memory per worker
   - Terminate idle workers
   - Reuse workers in pool

5. Error Handling:
   - Always handle worker errors
   - Implement retry logic
   - Graceful degradation
   - Proper cleanup on errors

6. Monitoring:
   - Track worker utilization
   - Monitor queue depth
   - Measure task duration
   - Profile hot paths
*/

// Example: Performance monitoring
class MonitoredWorkerPool extends WorkerPool {
  constructor(workerScript, poolSize) {
    super(workerScript, poolSize);
    this.stats = {
      tasksCompleted: 0,
      tasksQueued: 0,
      totalTime: 0,
      errors: 0,
    };
  }

  async execute(data) {
    this.stats.tasksQueued++;
    const startTime = Date.now();

    try {
      const result = await super.execute(data);
      this.stats.tasksCompleted++;
      this.stats.totalTime += Date.now() - startTime;
      return result;
    } catch (error) {
      this.stats.errors++;
      throw error;
    }
  }

  getStats() {
    const avgTime =
      this.stats.tasksCompleted > 0
        ? this.stats.totalTime / this.stats.tasksCompleted
        : 0;

    return {
      ...this.stats,
      avgTaskTime: avgTime,
      utilization: (this.poolSize - this.freeWorkers.length) / this.poolSize,
      queueDepth: this.queue.length,
    };
  }

  resetStats() {
    this.stats = {
      tasksCompleted: 0,
      tasksQueued: 0,
      totalTime: 0,
      errors: 0,
    };
  }
}

console.log("✓ Performance optimization patterns created");

// 8. Practical Examples
console.log("\n--- Practical Examples ---");

// Example: CPU-intensive computation
function fibonacciWorker() {
  if (isMainThread) {
    console.log("Fibonacci calculation with workers:");

    async function calculateFibonacci(n) {
      const worker = new Worker(__filename, {
        workerData: { operation: "fibonacci", n },
      });

      return new Promise((resolve, reject) => {
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0) reject(new Error(`Worker stopped: ${code}`));
        });
      });
    }

    // Calculate multiple Fibonacci numbers in parallel
    async function parallelFibonacci() {
      const numbers = [35, 36, 37, 38, 39];
      const results = await Promise.all(
        numbers.map((n) => calculateFibonacci(n))
      );
      console.log("Results:", results);
    }

    // parallelFibonacci();
  } else {
    if (workerData && workerData.operation === "fibonacci") {
      function fib(n) {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
      }

      const result = fib(workerData.n);
      parentPort.postMessage({
        n: workerData.n,
        result,
      });
    }
  }
}

// Example: Image processing
function imageProcessingExample() {
  console.log("\nImage processing with worker pool:");

  /*
  // worker.js
  const { parentPort, workerData } = require('worker_threads');
  const sharp = require('sharp');
  
  parentPort.on('message', async (data) => {
    const { operation, image, options } = data;
    
    try {
      let result;
      const processor = sharp(image);
      
      switch (operation) {
        case 'resize':
          result = await processor
            .resize(options.width, options.height)
            .toBuffer();
          break;
        case 'blur':
          result = await processor
            .blur(options.sigma)
            .toBuffer();
          break;
        case 'rotate':
          result = await processor
            .rotate(options.angle)
            .toBuffer();
          break;
      }
      
      parentPort.postMessage({ success: true, result });
    } catch (error) {
      parentPort.postMessage({ success: false, error: error.message });
    }
  });
  
  // main.js
  const pool = new WorkerPool('./imageWorker.js', 4);
  
  async function processImages(images) {
    const tasks = images.map(img => ({
      operation: 'resize',
      image: img.buffer,
      options: { width: 800, height: 600 }
    }));
    
    const results = await Promise.all(
      tasks.map(task => pool.execute(task))
    );
    
    return results;
  }
  */

  console.log("Image processing pattern demonstrated");
}

// Example: Data processing pipeline
function dataPipelineExample() {
  console.log("\nData processing pipeline:");

  /*
  // Pipeline stages with workers
  class DataPipeline {
    constructor() {
      this.parsePool = new WorkerPool('./parse-worker.js', 2);
      this.transformPool = new WorkerPool('./transform-worker.js', 4);
      this.aggregatePool = new WorkerPool('./aggregate-worker.js', 2);
    }
    
    async process(data) {
      // Stage 1: Parse
      const parsed = await this.parsePool.execute({ 
        operation: 'parse', 
        data 
      });
      
      // Stage 2: Transform (parallel)
      const chunks = this.chunkArray(parsed, 1000);
      const transformed = await Promise.all(
        chunks.map(chunk => 
          this.transformPool.execute({ 
            operation: 'transform', 
            data: chunk 
          })
        )
      );
      
      // Stage 3: Aggregate
      const result = await this.aggregatePool.execute({ 
        operation: 'aggregate', 
        data: transformed.flat() 
      });
      
      return result;
    }
    
    chunkArray(array, size) {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }
    
    async cleanup() {
      await Promise.all([
        this.parsePool.terminate(),
        this.transformPool.terminate(),
        this.aggregatePool.terminate()
      ]);
    }
  }
  */

  console.log("Data pipeline pattern demonstrated");
}

console.log("✓ Practical examples created");

// 9. Error Handling and Debugging
console.log("\n--- Error Handling ---");

// Example: Comprehensive error handling
function robustWorkerPattern() {
  if (isMainThread) {
    console.log("Robust worker pattern:");

    function createRobustWorker(script, options = {}) {
      const { maxRetries = 3, timeout = 30000, onError = () => {} } = options;

      let retries = 0;

      return new Promise((resolve, reject) => {
        const worker = new Worker(script);

        // Timeout handling
        const timer = setTimeout(() => {
          worker.terminate();
          reject(new Error("Worker timeout"));
        }, timeout);

        // Message handling
        worker.on("message", (result) => {
          clearTimeout(timer);
          resolve(result);
        });

        // Error handling
        worker.on("error", (error) => {
          clearTimeout(timer);
          onError(error);

          if (retries < maxRetries) {
            retries++;
            console.log(`Retrying... (${retries}/${maxRetries})`);
            // Could recreate worker here
          } else {
            reject(error);
          }
        });

        // Exit handling
        worker.on("exit", (code) => {
          clearTimeout(timer);
          if (code !== 0) {
            reject(new Error(`Worker exited with code ${code}`));
          }
        });
      });
    }

    console.log("Robust worker pattern demonstrated");
  }
}

console.log("✓ Error handling patterns created");

// 10. Summary
console.log("\n--- Summary ---");

const summary = {
  advantages: [
    "True parallelism for CPU-intensive tasks",
    "Lighter than child processes",
    "Shared memory with SharedArrayBuffer",
    "Built-in message passing",
    "Better for JavaScript computations",
  ],
  disadvantages: [
    "Not suitable for I/O operations",
    "Overhead for small tasks",
    "More complex than async/await",
    "Memory overhead per worker",
    "SharedArrayBuffer security concerns",
  ],
  useCases: [
    "CPU-intensive calculations",
    "Image/video processing",
    "Data compression/encryption",
    "Complex algorithms",
    "Parallel data processing",
  ],
  bestPractices: [
    "Use worker pools for efficiency",
    "Match pool size to CPU cores",
    "Monitor performance metrics",
    "Handle errors gracefully",
    "Use transferables for large data",
    "Proper cleanup and termination",
  ],
};

console.log("\nWorker Threads Summary:");
console.log(JSON.stringify(summary, null, 2));

console.log("\n✓ Worker Threads module completed");

/*
Additional Resources:
- Node.js Worker Threads Docs: https://nodejs.org/api/worker_threads.html
- SharedArrayBuffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
- Atomics: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics
- Performance Best Practices: https://nodejs.org/en/docs/guides/simple-profiling/
*/
