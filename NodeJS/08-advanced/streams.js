// Streams in Node.js

const fs = require("fs");
const { Readable, Writable, Transform, Duplex, pipeline } = require("stream");

console.log("=== Node.js Streams ===\n");

// 1. Why Streams?
console.log("--- Why Use Streams? ---");

/*
Streams allow you to process data piece by piece, without loading 
everything into memory at once.

Benefits:
- Memory efficient: Process large files without loading them entirely
- Time efficient: Start processing data before it's fully received
- Composable: Chain operations together

Types of Streams:
1. Readable - read data from (fs.createReadStream)
2. Writable - write data to (fs.createWriteStream)
3. Duplex - both readable and writable (net.Socket)
4. Transform - modify data as it's being read/written (zlib.createGzip)
*/

console.log("✓ Stream concepts explained");

// 2. Readable Streams
console.log("\n--- Readable Streams ---");

// Reading a file with streams
function readFileWithStream() {
  const readStream = fs.createReadStream("./large-file.txt", {
    encoding: "utf8",
    highWaterMark: 16 * 1024, // 16KB chunks
  });

  readStream.on("data", (chunk) => {
    console.log("Received chunk:", chunk.length, "bytes");
  });

  readStream.on("end", () => {
    console.log("✓ Finished reading file");
  });

  readStream.on("error", (error) => {
    console.error("✗ Error reading file:", error.message);
  });
}

// Custom Readable Stream
class NumberStream extends Readable {
  constructor(max, options) {
    super(options);
    this.max = max;
    this.current = 1;
  }

  _read() {
    if (this.current <= this.max) {
      // Push data to the stream
      this.push(`${this.current}\n`);
      this.current++;
    } else {
      // No more data, signal end
      this.push(null);
    }
  }
}

// Usage
const numberStream = new NumberStream(5);
numberStream.on("data", (chunk) => {
  console.log("Number:", chunk.toString().trim());
});

console.log("✓ Readable streams defined");

// 3. Writable Streams
console.log("\n--- Writable Streams ---");

// Writing to a file with streams
function writeFileWithStream() {
  const writeStream = fs.createWriteStream("./output.txt", {
    encoding: "utf8",
  });

  writeStream.write("Line 1\n");
  writeStream.write("Line 2\n");
  writeStream.write("Line 3\n");

  // Signal that we're done writing
  writeStream.end();

  writeStream.on("finish", () => {
    console.log("✓ Finished writing file");
  });

  writeStream.on("error", (error) => {
    console.error("✗ Error writing file:", error.message);
  });
}

// Custom Writable Stream
class LogStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log("[LOG]", chunk.toString().trim());
    callback(); // Signal that write is complete
  }
}

// Usage
const logStream = new LogStream();
logStream.write("Hello World\n");
logStream.write("From custom stream\n");
logStream.end();

console.log("✓ Writable streams defined");

// 4. Piping Streams
console.log("\n--- Piping Streams ---");

// Copy file using streams and pipe
function copyFile(source, destination) {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);

  // Pipe connects readable to writable
  readStream.pipe(writeStream);

  writeStream.on("finish", () => {
    console.log(`✓ File copied from ${source} to ${destination}`);
  });

  readStream.on("error", (error) => {
    console.error("✗ Read error:", error.message);
  });

  writeStream.on("error", (error) => {
    console.error("✗ Write error:", error.message);
  });
}

// Chaining pipes
function compressAndCopy(source, destination) {
  const zlib = require("zlib");

  fs.createReadStream(source)
    .pipe(zlib.createGzip()) // Compress
    .pipe(fs.createWriteStream(destination))
    .on("finish", () => {
      console.log("✓ File compressed and copied");
    });
}

console.log("✓ Piping defined");

// 5. Transform Streams
console.log("\n--- Transform Streams ---");

// Custom Transform Stream
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // Transform the data
    const upperCased = chunk.toString().toUpperCase();
    this.push(upperCased);
    callback();
  }
}

// Usage
const upperCaseStream = new UpperCaseTransform();

// Create a pipeline
process.stdin.pipe(upperCaseStream).pipe(process.stdout);

// CSV to JSON Transform
class CSVToJSONTransform extends Transform {
  constructor(options) {
    super(options);
    this.headers = null;
    this.buffer = "";
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split("\n");

    // Keep last incomplete line in buffer
    this.buffer = lines.pop();

    for (const line of lines) {
      if (!this.headers) {
        this.headers = line.split(",");
      } else {
        const values = line.split(",");
        const obj = {};
        this.headers.forEach((header, index) => {
          obj[header] = values[index];
        });
        this.push(JSON.stringify(obj) + "\n");
      }
    }

    callback();
  }

  _flush(callback) {
    // Process any remaining data
    if (this.buffer) {
      const values = this.buffer.split(",");
      const obj = {};
      this.headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      this.push(JSON.stringify(obj) + "\n");
    }
    callback();
  }
}

console.log("✓ Transform streams defined");

// 6. Duplex Streams
console.log("\n--- Duplex Streams ---");

// Duplex stream is both readable and writable
class EchoStream extends Duplex {
  _read(size) {
    // Reading implementation
  }

  _write(chunk, encoding, callback) {
    // Echo the data back
    this.push(chunk);
    callback();
  }
}

// Usage
const echoStream = new EchoStream();
echoStream.on("data", (chunk) => {
  console.log("Echo:", chunk.toString());
});

echoStream.write("Hello\n");
echoStream.write("World\n");

console.log("✓ Duplex streams defined");

// 7. Pipeline
console.log("\n--- Pipeline (Error Handling) ---");

// pipeline handles errors and cleanup automatically
const { promisify } = require("util");
const pipelinePromise = promisify(pipeline);

async function processFileWithPipeline(source, destination) {
  const zlib = require("zlib");

  try {
    await pipelinePromise(
      fs.createReadStream(source),
      zlib.createGzip(),
      fs.createWriteStream(destination)
    );
    console.log("✓ Pipeline succeeded");
  } catch (error) {
    console.error("✗ Pipeline failed:", error.message);
  }
}

// Using pipeline with multiple transforms
async function complexPipeline() {
  await pipelinePromise(
    fs.createReadStream("input.csv"),
    new CSVToJSONTransform(),
    fs.createWriteStream("output.json")
  );
}

console.log("✓ Pipeline defined");

// 8. Backpressure Handling
console.log("\n--- Backpressure ---");

/*
Backpressure occurs when the writable stream can't keep up
with the readable stream.
*/

function handleBackpressure() {
  const readStream = fs.createReadStream("large-file.txt");
  const writeStream = fs.createWriteStream("output.txt");

  readStream.on("data", (chunk) => {
    // write returns false if the internal buffer is full
    const canContinue = writeStream.write(chunk);

    if (!canContinue) {
      console.log("Backpressure detected, pausing read stream");
      readStream.pause();
    }
  });

  // Resume reading when the write buffer is drained
  writeStream.on("drain", () => {
    console.log("Buffer drained, resuming read stream");
    readStream.resume();
  });

  readStream.on("end", () => {
    writeStream.end();
  });
}

// Note: Using pipe() handles backpressure automatically
function autoBackpressure() {
  fs.createReadStream("large-file.txt").pipe(
    fs.createWriteStream("output.txt")
  );
}

console.log("✓ Backpressure handling defined");

// 9. Stream Events
console.log("\n--- Stream Events ---");

function streamEvents() {
  const stream = fs.createReadStream("file.txt");

  // Readable Stream Events
  stream.on("open", (fd) => {
    console.log("File opened:", fd);
  });

  stream.on("ready", () => {
    console.log("Stream ready to read");
  });

  stream.on("data", (chunk) => {
    console.log("Received data chunk");
  });

  stream.on("end", () => {
    console.log("No more data to read");
  });

  stream.on("close", () => {
    console.log("Stream closed");
  });

  stream.on("error", (error) => {
    console.error("Stream error:", error);
  });
}

console.log("✓ Stream events defined");

// 10. Practical Examples
console.log("\n--- Practical Examples ---");

// Example 1: Reading large files efficiently
async function readLargeFile(filePath) {
  const readStream = fs.createReadStream(filePath, { encoding: "utf8" });

  let lineCount = 0;
  let buffer = "";

  for await (const chunk of readStream) {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep incomplete line

    lineCount += lines.length;
  }

  // Process last line
  if (buffer) lineCount++;

  console.log(`Total lines: ${lineCount}`);
}

// Example 2: HTTP Response as Stream
function streamHTTPResponse() {
  const http = require("http");

  http
    .createServer((req, res) => {
      if (req.url === "/file") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        fs.createReadStream("large-file.txt").pipe(res);
      }
    })
    .listen(3000);

  console.log("Server listening on port 3000");
}

// Example 3: Processing CSV in chunks
async function processCSVStream(filePath) {
  const readStream = fs.createReadStream(filePath);
  const transformStream = new CSVToJSONTransform();

  let recordCount = 0;

  transformStream.on("data", (json) => {
    recordCount++;
    // Process each record
    const record = JSON.parse(json);
    console.log("Record:", record);
  });

  await pipelinePromise(readStream, transformStream);

  console.log(`Processed ${recordCount} records`);
}

// Example 4: Streaming compression
function compressFile(input, output) {
  const zlib = require("zlib");

  pipeline(
    fs.createReadStream(input),
    zlib.createGzip(),
    fs.createWriteStream(output),
    (err) => {
      if (err) {
        console.error("Compression failed:", err);
      } else {
        console.log("✓ File compressed successfully");
      }
    }
  );
}

console.log("✓ Practical examples defined");

// 11. Best Practices
console.log("\n--- Best Practices ---");

/*
1. Always Handle Errors:
   - Listen to 'error' events
   - Use pipeline() for automatic error handling
   - Clean up resources on error

2. Use Pipeline:
   - Handles backpressure automatically
   - Better error handling
   - Automatic cleanup

3. Choose Appropriate Buffer Size:
   - Default is 16KB (highWaterMark)
   - Adjust based on your use case
   - Larger for throughput, smaller for memory

4. Handle Backpressure:
   - Use pipe() or pipeline()
   - Or manually pause/resume streams
   - Monitor 'drain' events

5. Close Streams Properly:
   - Call end() on writable streams
   - Listen to 'close' events
   - Clean up resources

6. Memory Management:
   - Use streams for large files
   - Don't buffer everything in memory
   - Process data in chunks

7. Error Propagation:
   - Errors don't automatically propagate through pipes
   - Use pipeline() for proper error handling
   - Handle errors at each stage

8. Testing:
   - Test with large files
   - Test error conditions
   - Test backpressure scenarios

9. Async Iteration:
   - Use for await...of for cleaner code
   - Works with readable streams
   - Better error handling

10. Performance:
    - Use streams for I/O operations
    - Chain operations efficiently
    - Avoid unnecessary transformations
*/

console.log("\n✓ Streams concepts completed");
console.log("\nKey Takeaways:");
console.log("  - Use streams for large data processing");
console.log("  - Pipeline handles errors and backpressure");
console.log("  - Transform streams for data manipulation");
console.log("  - Always handle errors properly");








