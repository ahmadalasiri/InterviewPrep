// Buffers in Node.js

console.log("=== Node.js Buffers ===\n");

// 1. What are Buffers?
console.log("--- What are Buffers? ---");

/*
Buffers are fixed-size chunks of memory allocated outside of the V8 heap.
They store binary data and are useful for working with:
- Files
- Network streams
- Binary protocols
- Cryptography
- Image/video processing

Key Points:
- Buffers are fixed-size (can't be resized)
- Store raw binary data
- More efficient than arrays for binary data
- Automatically garbage collected
*/

console.log("✓ Buffer concepts explained");

// 2. Creating Buffers
console.log("\n--- Creating Buffers ---");

// Method 1: Buffer.alloc() - Create initialized buffer (filled with zeros)
const buf1 = Buffer.alloc(10);
console.log("Buffer.alloc(10):", buf1);

// Method 2: Buffer.allocUnsafe() - Create uninitialized buffer (faster, but may contain old data)
const buf2 = Buffer.allocUnsafe(10);
console.log("Buffer.allocUnsafe(10):", buf2);

// Method 3: Buffer.from() - Create from array
const buf3 = Buffer.from([1, 2, 3, 4, 5]);
console.log("Buffer.from([1,2,3,4,5]):", buf3);

// Method 4: Buffer.from() - Create from string
const buf4 = Buffer.from("Hello World");
console.log("Buffer.from('Hello World'):", buf4);
console.log("As string:", buf4.toString());

// Method 5: Buffer.from() - Create with encoding
const buf5 = Buffer.from("Hello", "utf8");
const buf6 = Buffer.from("48656c6c6f", "hex");
const buf7 = Buffer.from("SGVsbG8=", "base64");
console.log("UTF-8:", buf5);
console.log("Hex:", buf6);
console.log("Base64:", buf7);

console.log("✓ Buffer creation methods");

// 3. Writing to Buffers
console.log("\n--- Writing to Buffers ---");

// Write string to buffer
const buf = Buffer.alloc(20);
buf.write("Hello");
console.log("After write('Hello'):", buf);
console.log("As string:", buf.toString());

// Write at specific position
buf.write(" World", 5);
console.log("After write(' World', 5):", buf.toString());

// Write with different encoding
const hexBuf = Buffer.alloc(10);
hexBuf.write("48656c6c6f", "hex");
console.log("Hex write:", hexBuf.toString());

// Write numbers
const numBuf = Buffer.alloc(8);
numBuf.writeInt8(127, 0); // Write signed 8-bit integer
numBuf.writeUInt8(255, 1); // Write unsigned 8-bit integer
numBuf.writeInt16BE(1000, 2); // Write 16-bit big-endian
numBuf.writeInt32LE(100000, 4); // Write 32-bit little-endian
console.log("Number buffer:", numBuf);

console.log("✓ Writing to buffers");

// 4. Reading from Buffers
console.log("\n--- Reading from Buffers ---");

// Read as string
const readBuf = Buffer.from("Hello World");
console.log("toString():", readBuf.toString());
console.log("toString('utf8'):", readBuf.toString("utf8"));
console.log("toString('hex'):", readBuf.toString("hex"));
console.log("toString('base64'):", readBuf.toString("base64"));

// Read substring
console.log("Substring (0, 5):", readBuf.toString("utf8", 0, 5));

// Read numbers
const numReadBuf = Buffer.from([
  0x00, 0xff, 0x03, 0xe8, 0x00, 0x01, 0x86, 0xa0,
]);
console.log("readInt8(0):", numReadBuf.readInt8(0));
console.log("readUInt8(1):", numReadBuf.readUInt8(1));
console.log("readInt16BE(2):", numReadBuf.readInt16BE(2));
console.log("readInt32LE(4):", numReadBuf.readInt32LE(4));

// Read individual bytes
console.log("Individual bytes:");
for (let i = 0; i < readBuf.length; i++) {
  console.log(
    `  buf[${i}] = ${readBuf[i]} (${String.fromCharCode(readBuf[i])})`
  );
}

console.log("✓ Reading from buffers");

// 5. Buffer Operations
console.log("\n--- Buffer Operations ---");

// Length
const lenBuf = Buffer.from("Hello");
console.log("Length:", lenBuf.length);
console.log("byteLength:", Buffer.byteLength("Hello"));

// Copy
const source = Buffer.from("Hello");
const target = Buffer.alloc(5);
source.copy(target);
console.log("Copied:", target.toString());

// Copy with offset
const sourceBuf = Buffer.from("Hello World");
const targetBuf = Buffer.alloc(5);
sourceBuf.copy(targetBuf, 0, 6, 11); // Copy "World"
console.log("Copied with offset:", targetBuf.toString());

// Slice (creates a view, not a copy)
const sliceBuf = Buffer.from("Hello World");
const slice = sliceBuf.slice(0, 5);
console.log("Slice:", slice.toString());
// Note: Modifying slice affects original
slice[0] = 72; // Change 'H' to 'h'
console.log("Original after slice modification:", sliceBuf.toString());

// subarray (alias for slice in Node.js)
const sub = sliceBuf.subarray(6, 11);
console.log("Subarray:", sub.toString());

// Concat
const buf1Concat = Buffer.from("Hello ");
const buf2Concat = Buffer.from("World");
const combined = Buffer.concat([buf1Concat, buf2Concat]);
console.log("Concatenated:", combined.toString());

// Compare
const bufA = Buffer.from("abc");
const bufB = Buffer.from("abd");
console.log("Compare bufA vs bufB:", bufA.compare(bufB)); // -1 (bufA < bufB)
console.log("Compare bufB vs bufA:", bufB.compare(bufA)); // 1 (bufB > bufA)

// Equals
const bufX = Buffer.from("test");
const bufY = Buffer.from("test");
const bufZ = Buffer.from("TEST");
console.log("bufX equals bufY:", bufX.equals(bufY)); // true
console.log("bufX equals bufZ:", bufX.equals(bufZ)); // false

// Fill
const fillBuf = Buffer.alloc(10);
fillBuf.fill("a");
console.log("Filled with 'a':", fillBuf.toString());

// Includes
const searchBuf = Buffer.from("Hello World");
console.log("Includes 'World':", searchBuf.includes("World"));
console.log("Includes 'xyz':", searchBuf.includes("xyz"));

// indexOf
console.log("indexOf 'World':", searchBuf.indexOf("World"));
console.log("indexOf 'xyz':", searchBuf.indexOf("xyz"));

console.log("✓ Buffer operations");

// 6. Encodings
console.log("\n--- Buffer Encodings ---");

const text = "Hello 世界 🌍";

// Available encodings
const encodings = ["utf8", "utf16le", "latin1", "base64", "hex", "ascii"];

encodings.forEach((encoding) => {
  const encoded = Buffer.from(text, encoding);
  console.log(`${encoding}:`, encoded.length, "bytes");
});

// UTF-8 (default, supports all Unicode)
const utf8Buf = Buffer.from("Hello 世界", "utf8");
console.log("UTF-8:", utf8Buf.toString("utf8"));

// Base64 encoding/decoding
const base64Buf = Buffer.from("Hello World").toString("base64");
console.log("Base64 encoded:", base64Buf);
console.log("Base64 decoded:", Buffer.from(base64Buf, "base64").toString());

// Hex encoding/decoding
const hexData = Buffer.from("Hello").toString("hex");
console.log("Hex encoded:", hexData);
console.log("Hex decoded:", Buffer.from(hexData, "hex").toString());

console.log("✓ Encodings");

// 7. Binary Data Manipulation
console.log("\n--- Binary Data ---");

// Working with bits
function setBit(buffer, index, bit) {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = index % 8;

  if (bit) {
    buffer[byteIndex] |= 1 << bitIndex;
  } else {
    buffer[byteIndex] &= ~(1 << bitIndex);
  }
}

function getBit(buffer, index) {
  const byteIndex = Math.floor(index / 8);
  const bitIndex = index % 8;
  return (buffer[byteIndex] >> bitIndex) & 1;
}

const bitBuf = Buffer.alloc(1);
setBit(bitBuf, 0, 1);
setBit(bitBuf, 2, 1);
setBit(bitBuf, 5, 1);
console.log("Bit buffer:", bitBuf[0].toString(2).padStart(8, "0"));
console.log("Get bit 0:", getBit(bitBuf, 0));
console.log("Get bit 1:", getBit(bitBuf, 1));
console.log("Get bit 2:", getBit(bitBuf, 2));

// Byte swapping
function swap16(buffer) {
  const result = Buffer.allocUnsafe(buffer.length);
  for (let i = 0; i < buffer.length; i += 2) {
    result[i] = buffer[i + 1];
    result[i + 1] = buffer[i];
  }
  return result;
}

const original = Buffer.from([0x01, 0x02, 0x03, 0x04]);
console.log("Original:", original);
console.log("Swapped:", swap16(original));

console.log("✓ Binary data manipulation");

// 8. Performance Considerations
console.log("\n--- Performance ---");

// allocUnsafe is faster but may contain old data
console.time("alloc");
for (let i = 0; i < 10000; i++) {
  Buffer.alloc(1024);
}
console.timeEnd("alloc");

console.time("allocUnsafe");
for (let i = 0; i < 10000; i++) {
  Buffer.allocUnsafe(1024);
}
console.timeEnd("allocUnsafe");

// Buffer pooling
const pooledBuf1 = Buffer.allocUnsafe(100); // From pool
const pooledBuf2 = Buffer.allocUnsafe(100); // From pool
const largeBuf = Buffer.allocUnsafe(10000); // Not from pool (> 4KB)

console.log("✓ Performance considerations");

// 9. Practical Examples
console.log("\n--- Practical Examples ---");

// Example 1: Reading binary file
const fs = require("fs");

function readBinaryFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  console.log(`File size: ${buffer.length} bytes`);

  // Read first 4 bytes as signature
  const signature = buffer.slice(0, 4);
  console.log("Signature:", signature.toString("hex"));

  return buffer;
}

// Example 2: Creating a protocol message
function createMessage(type, data) {
  const dataBuffer = Buffer.from(data, "utf8");
  const message = Buffer.allocUnsafe(1 + 4 + dataBuffer.length);

  message.writeUInt8(type, 0); // Message type (1 byte)
  message.writeUInt32BE(dataBuffer.length, 1); // Data length (4 bytes)
  dataBuffer.copy(message, 5); // Data

  return message;
}

function parseMessage(buffer) {
  const type = buffer.readUInt8(0);
  const length = buffer.readUInt32BE(1);
  const data = buffer.slice(5, 5 + length).toString("utf8");

  return { type, length, data };
}

const msg = createMessage(1, "Hello World");
console.log("Message:", msg);
console.log("Parsed:", parseMessage(msg));

// Example 3: Image data manipulation (simplified)
function invertColors(imageBuffer) {
  // Assuming RGB data
  for (let i = 0; i < imageBuffer.length; i++) {
    imageBuffer[i] = 255 - imageBuffer[i];
  }
  return imageBuffer;
}

// Example 4: Base64 file encoding
function encodeFileToBase64(filePath) {
  const file = fs.readFileSync(filePath);
  return file.toString("base64");
}

function decodeBase64ToFile(base64String, outputPath) {
  const buffer = Buffer.from(base64String, "base64");
  fs.writeFileSync(outputPath, buffer);
}

console.log("✓ Practical examples");

// 10. Best Practices
console.log("\n--- Best Practices ---");

/*
1. Use Buffer.alloc() for security:
   - Initializes memory with zeros
   - Prevents data leaks
   - Use allocUnsafe() only when performance critical and you'll fill the buffer

2. Choose appropriate size:
   - Allocate correct size from the start
   - Buffers can't be resized
   - Use Buffer.allocUnsafe() for large buffers you'll immediately fill

3. Handle encodings properly:
   - Default is UTF-8
   - Be explicit about encoding
   - Use Buffer.byteLength() for multi-byte characters

4. Use streams for large data:
   - Don't load entire files into buffers
   - Use streams for better memory management
   - Process data in chunks

5. Memory management:
   - Buffers are garbage collected
   - Large buffers use more memory
   - Consider pooling for many small buffers

6. Binary protocols:
   - Document byte order (endianness)
   - Use explicit read/write methods
   - Validate data lengths

7. Security:
   - Sanitize buffer contents
   - Don't expose raw buffer data
   - Use Buffer.alloc() over allocUnsafe()

8. Performance:
   - Reuse buffers when possible
   - Use appropriate buffer size
   - Profile before optimizing

9. Type safety:
   - Use TypeScript for buffer operations
   - Validate buffer operations
   - Check bounds before access

10. Testing:
    - Test with edge cases
    - Test different encodings
    - Test buffer boundaries
*/

console.log("\n✓ Buffer concepts completed");
console.log("\nKey Takeaways:");
console.log("  - Use Buffer.alloc() for safety");
console.log("  - Buffers are fixed-size");
console.log("  - Great for binary data");
console.log("  - Choose correct encoding");





