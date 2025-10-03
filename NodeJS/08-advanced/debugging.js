// Debugging Techniques and Tools in Node.js

console.log("=== Node.js Debugging Techniques and Tools ===\n");

// 1. Introduction to Debugging
console.log("--- Debugging Overview ---");

/*
Node.js Debugging Approaches:

1. Console-based Debugging
   - console.log, console.error, console.trace
   - Quick and simple
   - Good for basic debugging

2. Built-in Debugger
   - node inspect
   - Command-line debugger
   - Breakpoints and stepping

3. Chrome DevTools
   - node --inspect
   - GUI debugging
   - Full Chrome DevTools features

4. VS Code Debugger
   - Integrated debugging
   - Breakpoints in editor
   - Best developer experience

5. Third-party Tools
   - ndb (Chrome DevTools standalone)
   - node-inspector (deprecated)
   - Various profilers

Common Debugging Scenarios:
- Logic errors
- Memory leaks
- Performance issues
- Async flow problems
- Error handling
- Third-party module issues
*/

console.log("✓ Debugging concepts explained");

// 2. Console-based Debugging
console.log("\n--- Console Debugging ---");

// Example: Console methods
function consoleDebugging() {
  console.log("Console debugging methods:");

  // Basic logging
  console.log("Standard log message");
  console.info("Info message");
  console.warn("Warning message");
  console.error("Error message");

  // Object logging
  const user = {
    name: "John",
    age: 30,
    address: { city: "New York", zip: "10001" },
  };

  console.log("User object:", user);

  // Better object inspection
  console.dir(user, { depth: null, colors: true });

  // Table format (great for arrays of objects)
  const users = [
    { id: 1, name: "John", age: 30 },
    { id: 2, name: "Jane", age: 25 },
    { id: 3, name: "Bob", age: 35 },
  ];
  console.table(users);

  // Stack trace
  console.trace("Stack trace at this point");

  // Timing
  console.time("operation");
  // Some operation
  for (let i = 0; i < 1000000; i++) {}
  console.timeEnd("operation");

  // Assertions
  console.assert(1 === 1, "This won't show");
  console.assert(1 === 2, "This will show because assertion failed");

  // Grouping logs
  console.group("User Operations");
  console.log("Fetching user...");
  console.log("User fetched");
  console.groupEnd();

  // Clear console
  // console.clear();

  console.log("✓ Console methods demonstrated");
}

consoleDebugging();

// Example: Custom logger
class Logger {
  constructor(namespace) {
    this.namespace = namespace;
  }

  _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.namespace}] ${message}`;
  }

  log(message, ...args) {
    console.log(this._formatMessage("LOG", message), ...args);
  }

  info(message, ...args) {
    console.info(this._formatMessage("INFO", message), ...args);
  }

  warn(message, ...args) {
    console.warn(this._formatMessage("WARN", message), ...args);
  }

  error(message, ...args) {
    console.error(this._formatMessage("ERROR", message), ...args);
  }

  debug(message, ...args) {
    if (process.env.DEBUG) {
      console.debug(this._formatMessage("DEBUG", message), ...args);
    }
  }
}

const logger = new Logger("MyApp");
logger.info("Application started");

console.log("✓ Custom logger created");

// 3. Built-in Node.js Debugger
console.log("\n--- Built-in Debugger ---");

/*
Command-line Debugger:

1. Start debugger:
   node inspect app.js
   node inspect --port=9229 app.js

2. Debugger Commands:
   cont, c      - Continue execution
   next, n      - Step to next line
   step, s      - Step into function
   out, o       - Step out of function
   pause        - Pause running code
   setBreakpoint('script.js', 10) - Set breakpoint
   clearBreakpoint('script.js', 10) - Clear breakpoint
   breakpoints  - List all breakpoints
   repl         - Enter REPL mode
   restart      - Restart the program
   kill         - Kill the program
   list(5)      - List 5 lines of source code
   watch(expr)  - Add expression to watch list
   unwatch(expr) - Remove expression from watch list
   watchers     - List all watchers

3. Programmatic Breakpoints:
   Add 'debugger;' statement in code
   
   function myFunction() {
     debugger; // Execution will pause here
     // ... rest of code
   }

4. Remote Debugging:
   node --inspect app.js
   node --inspect-brk app.js  // Break on start
*/

function builtInDebuggerExample() {
  console.log("Built-in debugger usage:");

  function calculateSum(arr) {
    // Add 'debugger;' to pause execution here
    // debugger;

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
      // debugger; // Can add multiple breakpoints
    }
    return sum;
  }

  const result = calculateSum([1, 2, 3, 4, 5]);
  console.log("Sum:", result);
}

console.log("✓ Built-in debugger documented");

// 4. Chrome DevTools Debugging
console.log("\n--- Chrome DevTools ---");

/*
Chrome DevTools Debugging:

1. Start with inspect flag:
   node --inspect app.js
   node --inspect-brk app.js  // Break on first line
   node --inspect=9229 app.js  // Custom port

2. Connect to DevTools:
   - Open Chrome
   - Navigate to chrome://inspect
   - Click "inspect" under your Node.js target
   - Or click "Open dedicated DevTools for Node"

3. Features Available:
   - Source tab: Set breakpoints, step through code
   - Console tab: Execute commands, inspect variables
   - Memory tab: Heap snapshots, allocation tracking
   - Profiler tab: CPU profiling
   - Network tab: HTTP requests (with interceptors)

4. Breakpoints:
   - Line breakpoints: Click line number
   - Conditional breakpoints: Right-click line number
   - Logpoints: Log without stopping execution
   - DOM breakpoints (if applicable)
   - XHR/fetch breakpoints
   - Event listener breakpoints

5. Debugging Features:
   - Step over (F10)
   - Step into (F11)
   - Step out (Shift+F11)
   - Continue (F8)
   - Watch expressions
   - Call stack inspection
   - Scope variables
   - Console evaluation

6. Memory Profiling:
   - Take heap snapshots
   - Compare snapshots
   - Allocation timeline
   - Find memory leaks

7. CPU Profiling:
   - Record CPU profile
   - Analyze flame graph
   - Find hot paths
   - Optimize performance
*/

console.log("✓ Chrome DevTools usage documented");

// 5. VS Code Debugging
console.log("\n--- VS Code Debugging ---");

/*
VS Code Debugging Configuration:

1. Create .vscode/launch.json:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch with Environment",
      "program": "${workspaceFolder}/app.js",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "*"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
      "args": ["--timeout", "999999", "--colors", "${workspaceFolder}/test"],
      "internalConsoleOptions": "openOnSessionStart"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}

2. Debugging Features:
   - Set breakpoints by clicking line numbers
   - F5 to start debugging
   - F9 to toggle breakpoint
   - F10 to step over
   - F11 to step into
   - Shift+F11 to step out
   - Variables panel shows local/global scope
   - Watch panel for expressions
   - Call stack visualization
   - Debug console for REPL

3. Conditional Breakpoints:
   - Right-click on breakpoint
   - Add condition (e.g., i === 5)
   - Hit count condition
   - Log message (logpoint)

4. Launch Configurations:
   launch: Start new Node.js process
   attach: Attach to running process

5. Advanced Features:
   - Auto attach (automatically debug npm scripts)
   - Compound configurations (debug multiple processes)
   - Server/client debugging
   - Remote debugging
*/

console.log("✓ VS Code debugging documented");

// 6. Debugging Async Code
console.log("\n--- Debugging Async Code ---");

// Example: Async debugging challenges
async function asyncDebuggingExample() {
  console.log("Async debugging techniques:");

  // Problem: Lost context in async operations
  async function fetchUserData(userId) {
    console.log("Fetching user:", userId);

    try {
      // Simulate API call
      const user = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: userId, name: "John" });
        }, 100);
      });

      console.log("User fetched:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  // Using async/await makes debugging easier
  try {
    const user = await fetchUserData(1);
    console.log("Process user:", user);
  } catch (error) {
    console.error("Failed:", error);
  }

  console.log("✓ Async debugging demonstrated");
}

// Example: Promise debugging
function promiseDebugging() {
  console.log("\nPromise debugging:");

  // Add .catch() to see unhandled rejections
  Promise.resolve()
    .then(() => {
      console.log("Step 1");
      return "data1";
    })
    .then((data) => {
      console.log("Step 2:", data);
      return "data2";
    })
    .then((data) => {
      console.log("Step 3:", data);
    })
    .catch((error) => {
      console.error("Promise chain error:", error);
    });

  // Better: Use async/await for easier debugging
  async function betterApproach() {
    try {
      console.log("Step 1");
      const data1 = "data1";

      console.log("Step 2:", data1);
      const data2 = "data2";

      console.log("Step 3:", data2);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  console.log("✓ Promise debugging patterns shown");
}

asyncDebuggingExample();
promiseDebugging();

// 7. Memory Leak Detection
console.log("\n--- Memory Leak Detection ---");

/*
Memory Leak Detection Tools:

1. Built-in tools:
   node --inspect app.js
   - Use Chrome DevTools Memory tab
   - Take heap snapshots
   - Compare snapshots over time

2. Process memory monitoring:
   const used = process.memoryUsage();
   console.log({
     rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
     heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
     heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
     external: `${Math.round(used.external / 1024 / 1024)} MB`
   });

3. Clinic.js Doctor:
   npm install -g clinic
   clinic doctor -- node app.js
   - Analyzes performance issues
   - Detects event loop problems
   - Memory leak indicators

4. Heap Dump:
   const heapdump = require('heapdump');
   heapdump.writeSnapshot('/tmp/dump-' + Date.now() + '.heapsnapshot');

5. Common Memory Leak Causes:
   - Global variables
   - Event listeners not removed
   - Closures holding references
   - Timers not cleared
   - Caching without limits
   - Forgotten callbacks
*/

// Example: Memory monitoring
class MemoryMonitor {
  constructor(interval = 5000) {
    this.interval = interval;
    this.timer = null;
    this.measurements = [];
  }

  start() {
    this.timer = setInterval(() => {
      const usage = process.memoryUsage();
      const measurement = {
        timestamp: Date.now(),
        rss: usage.rss,
        heapTotal: usage.heapTotal,
        heapUsed: usage.heapUsed,
        external: usage.external,
      };

      this.measurements.push(measurement);
      this.checkForLeaks();
    }, this.interval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  checkForLeaks() {
    if (this.measurements.length < 10) return;

    const recent = this.measurements.slice(-10);
    const trend = this.calculateTrend(recent.map((m) => m.heapUsed));

    if (trend > 0.1) {
      // Growing more than 10% per measurement
      console.warn("Possible memory leak detected!");
      console.warn("Heap usage trend:", trend);
    }
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;

    const first = values[0];
    const last = values[values.length - 1];

    return (last - first) / first;
  }

  getStats() {
    if (this.measurements.length === 0) return null;

    const latest = this.measurements[this.measurements.length - 1];
    return {
      rss: `${Math.round(latest.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(latest.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(latest.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(latest.external / 1024 / 1024)} MB`,
    };
  }
}

// Example: Common memory leak patterns
function memoryLeakExamples() {
  console.log("\nCommon memory leak patterns:");

  // BAD: Global variables
  // global.cache = {}; // Grows indefinitely

  // GOOD: Limited cache
  class LRUCache {
    constructor(maxSize) {
      this.maxSize = maxSize;
      this.cache = new Map();
    }

    set(key, value) {
      if (this.cache.size >= this.maxSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(key, value);
    }

    get(key) {
      return this.cache.get(key);
    }
  }

  // BAD: Event listeners not removed
  /*
  const emitter = new EventEmitter();
  function handler() { console.log('event'); }
  emitter.on('event', handler);
  // Listener never removed
  */

  // GOOD: Remove when done
  /*
  emitter.on('event', handler);
  // Later...
  emitter.removeListener('event', handler);
  */

  // BAD: Timers not cleared
  /*
  const timer = setInterval(() => {
    // Some work
  }, 1000);
  // Timer never cleared
  */

  // GOOD: Clear timers
  /*
  const timer = setInterval(() => {
    // Some work
  }, 1000);
  
  // Later or in cleanup
  clearInterval(timer);
  */

  console.log("✓ Memory leak patterns documented");
}

console.log("✓ Memory leak detection documented");

// 8. Error Debugging
console.log("\n--- Error Debugging ---");

// Example: Error handling and debugging
function errorDebugging() {
  console.log("Error debugging techniques:");

  // Custom error class
  class ApplicationError extends Error {
    constructor(message, code, statusCode = 500) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Detailed error logging
  function logError(error) {
    console.error("Error occurred:", {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }

  // Try-catch with context
  async function operationWithContext() {
    const context = {
      userId: 123,
      operation: "fetchData",
      timestamp: Date.now(),
    };

    try {
      // Some operation
      throw new ApplicationError("Operation failed", "OP_FAILED", 400);
    } catch (error) {
      console.error("Error context:", context);
      logError(error);
      throw error; // Re-throw if needed
    }
  }

  // Unhandled rejection tracking
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise);
    console.error("Reason:", reason);
  });

  // Uncaught exception tracking
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    // Log error, cleanup, then exit
    process.exit(1);
  });

  console.log("✓ Error debugging techniques shown");
}

errorDebugging();

// 9. Performance Debugging
console.log("\n--- Performance Debugging ---");

/*
Performance Debugging Tools:

1. Node.js Built-in Profiler:
   node --prof app.js
   node --prof-process isolate-*.log

2. Chrome DevTools Profiler:
   node --inspect app.js
   - Use Profiler tab
   - Record CPU profile
   - Analyze flame graph

3. Clinic.js Suite:
   npm install -g clinic
   
   clinic doctor -- node app.js     # Overall health
   clinic flame -- node app.js      # CPU profiling (flame graph)
   clinic bubbleprof -- node app.js # Async operations
   clinic heap -- node app.js       # Memory analysis

4. 0x (Flamegraph):
   npm install -g 0x
   0x app.js

5. Autocannon (Load testing):
   npm install -g autocannon
   autocannon http://localhost:3000

6. Event Loop Monitoring:
   const { performance } = require('perf_hooks');
*/

// Example: Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.measurements = new Map();
  }

  start(label) {
    this.measurements.set(label, {
      start: Date.now(),
      startCPU: process.cpuUsage(),
    });
  }

  end(label) {
    const measurement = this.measurements.get(label);
    if (!measurement) {
      console.warn(`No measurement found for: ${label}`);
      return null;
    }

    const duration = Date.now() - measurement.start;
    const cpuUsage = process.cpuUsage(measurement.startCPU);

    this.measurements.delete(label);

    return {
      label,
      duration: `${duration}ms`,
      cpuUser: `${Math.round(cpuUsage.user / 1000)}ms`,
      cpuSystem: `${Math.round(cpuUsage.system / 1000)}ms`,
    };
  }

  async measure(label, fn) {
    this.start(label);
    try {
      const result = await fn();
      const stats = this.end(label);
      console.log("Performance:", stats);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }
}

const perfMonitor = new PerformanceMonitor();

// Example usage
async function examplePerformanceTest() {
  await perfMonitor.measure("heavy-operation", async () => {
    // Simulate heavy operation
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    return sum;
  });
}

console.log("✓ Performance monitoring created");

// 10. Third-party Debugging Tools
console.log("\n--- Third-party Tools ---");

/*
Popular Debugging Tools:

1. Debug Module:
   npm install debug
   
   const debug = require('debug')('app:database');
   debug('Connected to database');
   
   Run with: DEBUG=app:* node app.js

2. Winston (Logging):
   npm install winston
   
   const winston = require('winston');
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });

3. Morgan (HTTP logging):
   npm install morgan
   
   const morgan = require('morgan');
   app.use(morgan('combined'));

4. Sentry (Error tracking):
   npm install @sentry/node
   
   const Sentry = require("@sentry/node");
   Sentry.init({ dsn: "your-dsn" });

5. New Relic (APM):
   npm install newrelic
   - Application performance monitoring
   - Transaction tracing
   - Error tracking

6. Datadog (Monitoring):
   npm install dd-trace
   - Full observability platform
   - Metrics, traces, logs

7. ndb (Improved DevTools):
   npm install -g ndb
   ndb app.js
   - Better than node --inspect
   - Child process debugging
   - Worker thread debugging
*/

console.log("✓ Third-party tools documented");

// 11. Debugging Best Practices
console.log("\n--- Debugging Best Practices ---");

const debuggingBestPractices = {
  general: [
    "Reproduce the issue consistently",
    "Isolate the problem area",
    "Use version control to bisect issues",
    "Read error messages carefully",
    "Check stack traces",
    "Understand the context",
  ],
  logging: [
    "Use appropriate log levels",
    "Include context in logs",
    "Don't log sensitive data",
    "Use structured logging",
    "Implement log aggregation",
    "Add timestamps and request IDs",
  ],
  tools: [
    "Master your IDE debugger",
    "Learn Chrome DevTools",
    "Use profiling tools regularly",
    "Automate debugging where possible",
    "Use linters and type checkers",
  ],
  testing: [
    "Write unit tests for debugging",
    "Use test-driven debugging",
    "Create minimal reproductions",
    "Test edge cases",
    "Use debugging assertions",
  ],
  performance: [
    "Profile before optimizing",
    "Monitor in production",
    "Track key metrics",
    "Use APM tools",
    "Regular performance audits",
  ],
  collaboration: [
    "Document debugging sessions",
    "Share knowledge with team",
    "Create debugging runbooks",
    "Use error tracking services",
    "Implement observability",
  ],
};

console.log("\nDebugging Best Practices:");
console.log(JSON.stringify(debuggingBestPractices, null, 2));

// 12. Debugging Checklist
console.log("\n--- Debugging Checklist ---");

const debuggingChecklist = [
  "Can you reproduce the issue?",
  "What's the error message?",
  "What's the stack trace?",
  "When did it start happening?",
  "What changed recently?",
  "Does it happen in all environments?",
  "Can you isolate the problem?",
  "Have you checked the logs?",
  "Have you added debugging output?",
  "Have you tried the debugger?",
  "Have you checked memory usage?",
  "Have you profiled the code?",
  "Have you checked for async issues?",
  "Have you reviewed recent commits?",
  "Have you tested with different data?",
  "Have you consulted documentation?",
  "Have you searched for similar issues?",
  "Have you asked for help?",
];

console.log("\nDebugging Checklist:");
debuggingChecklist.forEach((item, index) => {
  console.log(`${index + 1}. ${item}`);
});

console.log("\n✓ Debugging module completed");

/*
Additional Resources:
- Node.js Debugging Guide: https://nodejs.org/en/docs/guides/debugging-getting-started/
- Chrome DevTools: https://developer.chrome.com/docs/devtools/
- VS Code Debugging: https://code.visualstudio.com/docs/nodejs/nodejs-debugging
- Clinic.js: https://clinicjs.org/
- Debug Module: https://www.npmjs.com/package/debug
- Winston: https://github.com/winstonjs/winston
- Sentry: https://docs.sentry.io/platforms/node/
*/
