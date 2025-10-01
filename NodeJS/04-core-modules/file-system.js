// File System (fs) Module in Node.js

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

console.log("=== File System Module ===\n");

// 1. Reading Files - Synchronous
console.log("--- Reading Files (Synchronous) ---");

try {
  // Synchronous read (blocks execution)
  const data = fs.readFileSync("package.json", "utf8");
  console.log("✓ Sync read successful");
  // console.log(data.substring(0, 100) + '...');
} catch (error) {
  console.error("✗ Sync read error:", error.message);
}

// 2. Reading Files - Asynchronous (Callback)
console.log("\n--- Reading Files (Async Callback) ---");

fs.readFile("package.json", "utf8", (err, data) => {
  if (err) {
    console.error("✗ Async callback read error:", err.message);
    return;
  }
  console.log("✓ Async callback read successful");
});

// 3. Reading Files - Promises
console.log("\n--- Reading Files (Promises) ---");

fsPromises
  .readFile("package.json", "utf8")
  .then((data) => {
    console.log("✓ Promise read successful");
  })
  .catch((error) => {
    console.error("✗ Promise read error:", error.message);
  });

// 4. Reading Files - Async/Await
async function readFileAsync() {
  try {
    const data = await fsPromises.readFile("package.json", "utf8");
    console.log("✓ Async/await read successful");
    return data;
  } catch (error) {
    console.error("✗ Async/await read error:", error.message);
  }
}

readFileAsync();

// 5. Writing Files
setTimeout(async () => {
  console.log("\n--- Writing Files ---");

  const content = `# Test File
Created at: ${new Date().toISOString()}
This is a test file created by Node.js`;

  // Write file (overwrites if exists)
  try {
    await fsPromises.writeFile("test-output.txt", content);
    console.log("✓ File written successfully");

    // Append to file
    await fsPromises.appendFile("test-output.txt", "\nAppended line");
    console.log("✓ Content appended successfully");

    // Read back to verify
    const readContent = await fsPromises.readFile("test-output.txt", "utf8");
    console.log("File content:\n", readContent);
  } catch (error) {
    console.error("✗ Write error:", error.message);
  }
}, 1000);

// 6. File Information
setTimeout(async () => {
  console.log("\n--- File Information (stat) ---");

  try {
    const stats = await fsPromises.stat("package.json");

    console.log("File Stats:");
    console.log("- Size:", stats.size, "bytes");
    console.log("- Created:", stats.birthtime);
    console.log("- Modified:", stats.mtime);
    console.log("- Is File:", stats.isFile());
    console.log("- Is Directory:", stats.isDirectory());
  } catch (error) {
    console.error("✗ Stat error:", error.message);
  }
}, 2000);

// 7. Directory Operations
setTimeout(async () => {
  console.log("\n--- Directory Operations ---");

  try {
    // Create directory
    await fsPromises.mkdir("test-dir", { recursive: true });
    console.log("✓ Directory created");

    // Read directory contents
    const files = await fsPromises.readdir(".");
    console.log("✓ Directory contents:", files.slice(0, 5), "...");

    // Read directory with file types
    const entries = await fsPromises.readdir(".", { withFileTypes: true });
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    console.log("✓ Directories:", directories.slice(0, 3), "...");
  } catch (error) {
    console.error("✗ Directory error:", error.message);
  }
}, 3000);

// 8. File/Directory Existence
setTimeout(async () => {
  console.log("\n--- Checking Existence ---");

  // Modern way (fs.access)
  async function fileExists(filePath) {
    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  const exists1 = await fileExists("package.json");
  const exists2 = await fileExists("nonexistent.txt");

  console.log("package.json exists:", exists1);
  console.log("nonexistent.txt exists:", exists2);
}, 4000);

// 9. Copying Files
setTimeout(async () => {
  console.log("\n--- Copying Files ---");

  try {
    await fsPromises.copyFile("package.json", "test-dir/package-copy.json");
    console.log("✓ File copied successfully");
  } catch (error) {
    console.error("✗ Copy error:", error.message);
  }
}, 5000);

// 10. Renaming/Moving Files
setTimeout(async () => {
  console.log("\n--- Renaming/Moving Files ---");

  try {
    await fsPromises.rename("test-output.txt", "test-dir/renamed-output.txt");
    console.log("✓ File moved and renamed");
  } catch (error) {
    console.error("✗ Rename error:", error.message);
  }
}, 6000);

// 11. Deleting Files
setTimeout(async () => {
  console.log("\n--- Deleting Files ---");

  try {
    await fsPromises.unlink("test-dir/package-copy.json");
    console.log("✓ File deleted");
  } catch (error) {
    console.error("✗ Delete error:", error.message);
  }
}, 7000);

// 12. Deleting Directories
setTimeout(async () => {
  console.log("\n--- Deleting Directories ---");

  try {
    // Remove directory (must be empty or use recursive)
    await fsPromises.rm("test-dir", { recursive: true, force: true });
    console.log("✓ Directory deleted");
  } catch (error) {
    console.error("✗ Delete directory error:", error.message);
  }
}, 8000);

// 13. Streams for Large Files
setTimeout(() => {
  console.log("\n--- Streams for Large Files ---");

  // Read stream
  const readStream = fs.createReadStream("package.json", "utf8");
  const writeStream = fs.createWriteStream("package-copy.txt");

  readStream.on("data", (chunk) => {
    console.log("✓ Received chunk of", chunk.length, "characters");
  });

  readStream.on("end", () => {
    console.log("✓ Read stream finished");
  });

  readStream.on("error", (error) => {
    console.error("✗ Read stream error:", error.message);
  });

  // Pipe read stream to write stream
  readStream.pipe(writeStream);

  writeStream.on("finish", () => {
    console.log("✓ Write stream finished");
  });
}, 9000);

// 14. Watch for File Changes
setTimeout(() => {
  console.log("\n--- Watching Files ---");

  // Create a file to watch
  fs.writeFileSync("watch-test.txt", "Initial content");

  const watcher = fs.watch("watch-test.txt", (eventType, filename) => {
    console.log(`✓ File ${filename} - event: ${eventType}`);
  });

  // Modify the file
  setTimeout(() => {
    fs.appendFileSync("watch-test.txt", "\nModified content");
  }, 1000);

  // Stop watching and cleanup
  setTimeout(() => {
    watcher.close();
    fs.unlinkSync("watch-test.txt");
    fs.unlinkSync("package-copy.txt");
    console.log("✓ Watcher closed and cleanup done");
  }, 2000);
}, 10000);

// 15. Working with Paths
setTimeout(() => {
  console.log("\n--- Working with Paths ---");

  const filePath = path.join(__dirname, "test", "file.txt");
  console.log("Joined path:", filePath);

  const parsed = path.parse(filePath);
  console.log("Parsed path:", parsed);

  const absolute = path.resolve("test", "file.txt");
  console.log("Absolute path:", absolute);

  const relative = path.relative(__dirname, filePath);
  console.log("Relative path:", relative);

  const extension = path.extname("file.txt");
  console.log("Extension:", extension);
}, 12000);

// 16. Real-World Example: File Operations Utility
setTimeout(async () => {
  console.log("\n--- Real-World Example ---");

  class FileManager {
    static async readJSON(filePath) {
      const data = await fsPromises.readFile(filePath, "utf8");
      return JSON.parse(data);
    }

    static async writeJSON(filePath, data) {
      const jsonString = JSON.stringify(data, null, 2);
      await fsPromises.writeFile(filePath, jsonString);
    }

    static async ensureDir(dirPath) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }

    static async copyDir(src, dest) {
      await this.ensureDir(dest);
      const entries = await fsPromises.readdir(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          await this.copyDir(srcPath, destPath);
        } else {
          await fsPromises.copyFile(srcPath, destPath);
        }
      }
    }
  }

  // Example usage
  try {
    const packageData = await FileManager.readJSON("package.json");
    console.log("✓ Package name:", packageData.name || "N/A");
  } catch (error) {
    console.log("Note: package.json may not exist yet");
  }
}, 13000);

setTimeout(() => {
  console.log("\n--- Summary ---");
  console.log("✓ fs.readFile/writeFile for simple operations");
  console.log("✓ Use promises (fsPromises) or async/await");
  console.log("✓ Use streams for large files");
  console.log("✓ Always handle errors");
  console.log("✓ Use path module for cross-platform compatibility");
  console.log("\n=== File System Examples Completed ===");
}, 15000);

