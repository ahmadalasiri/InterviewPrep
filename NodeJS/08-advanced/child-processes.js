// Child Processes in Node.js

const { spawn, exec, execFile, fork } = require("child_process");
const path = require("path");

console.log("=== Node.js Child Processes ===\n");

// 1. Introduction to Child Processes
console.log("--- Child Processes Overview ---");

/*
Child Processes allow Node.js to execute external commands and run separate processes:

Four ways to create child processes:
1. spawn() - Launches a command, streams data
2. exec() - Runs a command in a shell, buffers output
3. execFile() - Like exec but without shell (more efficient)
4. fork() - Spawns a new Node.js process, enables IPC

When to use Child Processes:
- Execute system commands
- Run CPU-intensive tasks separately
- Interface with other languages/scripts
- Parallel processing
- Isolate risky operations

Differences from Worker Threads:
- Child processes are separate OS processes (more overhead)
- Worker threads share memory (lighter weight)
- Child processes provide better isolation
- Worker threads better for JS-only tasks
*/

console.log("✓ Child Processes concepts explained");

// 2. spawn() - Streaming Data
console.log("\n--- spawn() Method ---");

/*
spawn() is best for:
- Long-running processes
- Large output data (uses streams)
- Real-time data processing
- When you need to pipe data

Syntax: spawn(command, [args], [options])
*/

// Example: List directory contents
function spawnExample() {
  console.log("Spawning 'ls' process:");

  const ls = spawn("ls", ["-lh", "/usr"]);

  // Listen to stdout
  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  // Listen to stderr
  ls.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // Listen to close event
  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  // Listen to error event
  ls.on("error", (error) => {
    console.error(`spawn error: ${error.message}`);
  });
}

// Example: Spawn with options
function spawnWithOptions() {
  console.log("\nSpawning with environment variables:");

  const child = spawn("node", ["--version"], {
    cwd: process.cwd(),
    env: { ...process.env, CUSTOM_VAR: "value" },
    shell: false,
  });

  child.stdout.on("data", (data) => {
    console.log(`Node version: ${data}`);
  });
}

// Example: Pipe streams
function spawnPiping() {
  console.log("\nPiping child process to parent stdout:");

  const grep = spawn("grep", ["ssh"]);
  const ps = spawn("ps", ["ax"]);

  // Pipe ps output to grep input
  ps.stdout.pipe(grep.stdin);

  // Pipe grep output to process stdout
  grep.stdout.pipe(process.stdout);

  ps.stderr.on("data", (data) => {
    console.error(`ps stderr: ${data}`);
  });

  grep.stderr.on("data", (data) => {
    console.error(`grep stderr: ${data}`);
  });
}

console.log("✓ spawn() examples created");

// 3. exec() - Execute Shell Commands
console.log("\n--- exec() Method ---");

/*
exec() is best for:
- Short commands with small output
- When you need a shell
- Simple one-off commands
- When callback style is preferred

Limitations:
- Output is buffered (maxBuffer default: 1MB)
- Can cause memory issues with large output
- Slower due to shell overhead

Syntax: exec(command, [options], callback)
*/

// Example: Basic exec
function execExample() {
  console.log("Executing shell command:");

  exec("ls -lh", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });
}

// Example: exec with options
function execWithOptions() {
  console.log("\nexec with timeout and maxBuffer:");

  const options = {
    timeout: 5000, // Kill after 5 seconds
    maxBuffer: 1024 * 1024, // 1MB
    killSignal: "SIGTERM",
  };

  exec("find / -name node", options, (error, stdout, stderr) => {
    if (error) {
      if (error.killed) {
        console.error("Process was killed due to timeout");
      }
      console.error(`exec error: ${error.message}`);
      return;
    }
    console.log(`Found: ${stdout}`);
  });
}

// Example: Promisified exec
function execPromise() {
  const util = require("util");
  const execPromise = util.promisify(exec);

  console.log("\nPromisified exec:");

  execPromise('echo "Hello from exec"')
    .then(({ stdout, stderr }) => {
      console.log(`stdout: ${stdout}`);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
}

console.log("✓ exec() examples created");

// 4. execFile() - Execute Files Without Shell
console.log("\n--- execFile() Method ---");

/*
execFile() is best for:
- Executing specific files/programs
- Better security (no shell injection)
- Better performance (no shell overhead)
- When you don't need shell features

Syntax: execFile(file, [args], [options], callback)
*/

// Example: Basic execFile
function execFileExample() {
  console.log("Executing file without shell:");

  execFile("node", ["--version"], (error, stdout, stderr) => {
    if (error) {
      console.error(`execFile error: ${error}`);
      return;
    }
    console.log(`Node version: ${stdout}`);
  });
}

// Example: Execute Python script
function execPythonScript() {
  console.log("\nExecuting Python script:");

  execFile(
    "python3",
    ["-c", 'print("Hello from Python")'],
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Python exec error: ${error.message}`);
        return;
      }
      console.log(`Python output: ${stdout}`);
    }
  );
}

console.log("✓ execFile() examples created");

// 5. fork() - Spawn Node.js Processes with IPC
console.log("\n--- fork() Method ---");

/*
fork() is best for:
- Running Node.js scripts in separate processes
- CPU-intensive JavaScript operations
- Inter-process communication (IPC)
- Creating worker pools

Features:
- Built-in IPC channel (send/message events)
- Spawns Node.js process automatically
- Better for Node.js scripts than spawn

Syntax: fork(modulePath, [args], [options])
*/

// Example: Basic fork
function forkExample() {
  console.log("Forking a child process:");

  // This would fork a separate file
  // const child = fork('./worker.js');

  // For demo purposes, we'll show the pattern
  const childCode = `
    process.on('message', (msg) => {
      console.log('Child received:', msg);
      process.send({ result: msg.value * 2 });
    });
  `;

  // In practice, you'd have this in a separate file
  console.log("Child process pattern demonstrated");
}

// Example: Communication between parent and child
function forkCommunication() {
  console.log("\nFork with IPC:");

  // Parent sends message to child
  const parentCode = `
    const child = fork('./worker.js');
    
    child.on('message', (msg) => {
      console.log('Parent received:', msg);
    });
    
    child.send({ value: 42 });
    
    child.on('exit', (code) => {
      console.log(\`Child exited with code \${code}\`);
    });
  `;

  // Child receives and responds
  const childCode = `
    process.on('message', (msg) => {
      console.log('Processing:', msg.value);
      const result = heavyComputation(msg.value);
      process.send({ result });
    });
    
    function heavyComputation(n) {
      // CPU-intensive task
      let sum = 0;
      for (let i = 0; i < n * 1000000; i++) {
        sum += i;
      }
      return sum;
    }
  `;

  console.log("IPC pattern demonstrated");
}

console.log("✓ fork() examples created");

// 6. Process Communication Patterns
console.log("\n--- Process Communication ---");

// Example: Worker pool pattern
class WorkerPool {
  constructor(workerScript, poolSize) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    this.activeWorkers = new Set();

    this.initializePool();
  }

  initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = fork(this.workerScript);
      this.workers.push(worker);

      worker.on("message", (result) => {
        this.activeWorkers.delete(worker);
        this.processQueue();
      });

      worker.on("error", (error) => {
        console.error(`Worker error: ${error}`);
      });

      worker.on("exit", (code) => {
        console.log(`Worker exited with code ${code}`);
        // Restart worker
        const newWorker = fork(this.workerScript);
        const index = this.workers.indexOf(worker);
        this.workers[index] = newWorker;
      });
    }
  }

  execute(data, callback) {
    this.queue.push({ data, callback });
    this.processQueue();
  }

  processQueue() {
    if (this.queue.length === 0) return;

    const availableWorker = this.workers.find(
      (w) => !this.activeWorkers.has(w)
    );
    if (!availableWorker) return;

    const { data, callback } = this.queue.shift();
    this.activeWorkers.add(availableWorker);

    availableWorker.once("message", (result) => {
      callback(null, result);
    });

    availableWorker.send(data);
  }

  terminate() {
    this.workers.forEach((worker) => worker.kill());
  }
}

console.log("✓ Worker pool pattern created");

// 7. Advanced Patterns
console.log("\n--- Advanced Patterns ---");

// Example: Process timeout
function processTimeout() {
  console.log("Process with timeout:");

  const child = spawn("sleep", ["10"]);
  const timeout = setTimeout(() => {
    child.kill("SIGTERM");
    console.log("Process timed out and killed");
  }, 3000);

  child.on("exit", (code, signal) => {
    clearTimeout(timeout);
    if (signal) {
      console.log(`Process killed by signal: ${signal}`);
    } else {
      console.log(`Process exited with code: ${code}`);
    }
  });
}

// Example: Graceful shutdown
function gracefulShutdown() {
  console.log("\nGraceful shutdown pattern:");

  const child = fork("./worker.js");

  function shutdown() {
    console.log("Initiating graceful shutdown...");

    // Send shutdown signal
    child.send({ command: "shutdown" });

    // Force kill after timeout
    const forceTimeout = setTimeout(() => {
      console.log("Forcing shutdown...");
      child.kill("SIGKILL");
    }, 5000);

    child.on("exit", () => {
      clearTimeout(forceTimeout);
      console.log("Child process terminated");
    });
  }

  // Handle parent termination
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

// Example: Error handling
function errorHandling() {
  console.log("\nComprehensive error handling:");

  const child = spawn("node", ["script.js"]);

  // Handle spawn errors
  child.on("error", (error) => {
    console.error(`Failed to start child process: ${error.message}`);
  });

  // Handle runtime errors
  child.stderr.on("data", (data) => {
    console.error(`Child stderr: ${data}`);
  });

  // Handle exit codes
  child.on("exit", (code, signal) => {
    if (code !== 0) {
      console.error(`Child process failed with code: ${code}`);
    }
    if (signal) {
      console.error(`Child process killed by signal: ${signal}`);
    }
  });

  // Handle disconnection (fork only)
  child.on("disconnect", () => {
    console.log("Child process disconnected");
  });
}

console.log("✓ Advanced patterns demonstrated");

// 8. Performance Considerations
console.log("\n--- Performance Tips ---");

/*
Best Practices:

1. Choose the right method:
   - spawn: Large data, streaming
   - exec: Simple commands, small output
   - execFile: Security, performance
   - fork: Node.js scripts, IPC

2. Resource management:
   - Limit concurrent processes
   - Monitor memory usage
   - Clean up properly
   - Use process pools for frequent tasks

3. Security:
   - Validate input before spawning
   - Avoid shell when possible
   - Use execFile instead of exec
   - Sanitize command arguments

4. Error handling:
   - Always handle 'error' event
   - Check exit codes
   - Handle signals properly
   - Implement timeouts

5. Communication:
   - Use streams for large data
   - Batch messages when possible
   - Implement backpressure
   - Handle disconnections

6. Monitoring:
   - Track process count
   - Monitor resource usage
   - Log process lifecycle
   - Implement health checks
*/

console.log("✓ Performance tips documented");

// 9. Practical Examples
console.log("\n--- Practical Examples ---");

// Example: Image processing worker
function imageProcessingWorker() {
  console.log("Image processing with child process:");

  /*
  // worker.js
  const sharp = require('sharp');
  
  process.on('message', async (msg) => {
    try {
      await sharp(msg.inputPath)
        .resize(msg.width, msg.height)
        .toFile(msg.outputPath);
      
      process.send({ success: true, outputPath: msg.outputPath });
    } catch (error) {
      process.send({ success: false, error: error.message });
    }
  });
  
  // parent.js
  const worker = fork('./worker.js');
  
  worker.send({
    inputPath: './input.jpg',
    outputPath: './output.jpg',
    width: 800,
    height: 600
  });
  
  worker.on('message', (result) => {
    if (result.success) {
      console.log('Image processed:', result.outputPath);
    } else {
      console.error('Processing failed:', result.error);
    }
  });
  */

  console.log("Image processing pattern demonstrated");
}

// Example: Data processing pipeline
function dataPipeline() {
  console.log("\nData processing pipeline:");

  const csv = spawn("cat", ["data.csv"]);
  const process1 = spawn("grep", ["pattern"]);
  const process2 = spawn("sort");
  const process3 = spawn("uniq", ["-c"]);

  csv.stdout.pipe(process1.stdin);
  process1.stdout.pipe(process2.stdin);
  process2.stdout.pipe(process3.stdin);
  process3.stdout.pipe(process.stdout);

  console.log("Pipeline created: cat -> grep -> sort -> uniq");
}

console.log("✓ Practical examples created");

// 10. Summary
console.log("\n--- Summary ---");

const summary = {
  spawn: {
    use: "Long-running processes, streaming data",
    pros: "Efficient, handles large data, real-time",
    cons: "More complex API",
  },
  exec: {
    use: "Simple commands, small output",
    pros: "Simple API, shell features",
    cons: "Buffered output, shell overhead, security risks",
  },
  execFile: {
    use: "Execute specific programs",
    pros: "Secure, efficient, no shell overhead",
    cons: "No shell features",
  },
  fork: {
    use: "Node.js scripts, CPU-intensive tasks",
    pros: "Built-in IPC, easy communication",
    cons: "Node.js only, more overhead than threads",
  },
};

console.log("\nChild Process Methods Comparison:");
console.log(JSON.stringify(summary, null, 2));

console.log("\n✓ Child Processes module completed");

/*
Additional Resources:
- Node.js Child Process Docs: https://nodejs.org/api/child_process.html
- Process Communication: https://nodejs.org/api/process.html#process_process_send_message_sendhandle_options_callback
- Worker Threads vs Child Processes: https://nodejs.org/api/worker_threads.html#worker_threads_worker_threads
*/
