// Importing Modules in Node.js (CommonJS)

console.log("=== Importing Modules (CommonJS) ===\n");

// 1. Importing Built-in Modules
console.log("--- Built-in Modules ---");

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const os = require("os");
const util = require("util");
const events = require("events");

console.log("✓ Built-in modules imported");
console.log("Platform:", os.platform());
console.log("Node version:", process.version);

// 2. Importing Local Modules
console.log("\n--- Local Modules ---");

// Import with relative path
// const myModule = require('./my-module');
// const utils = require('./utils/helpers');
// const config = require('../config/database');

// File extensions are optional for .js files
// const module1 = require('./module');     // Will look for module.js
// const module2 = require('./module.js');  // Explicit extension

console.log("✓ Local modules can be imported with relative paths");

// 3. Importing npm Packages
console.log("\n--- npm Packages ---");

// After running: npm install package-name
// const express = require('express');
// const lodash = require('lodash');
// const axios = require('axios');
// const mongoose = require('mongoose');

// Scoped packages
// const somePackage = require('@organization/package-name');

console.log("✓ npm packages imported from node_modules");

// 4. Destructuring Imports
console.log("\n--- Destructuring ---");

// Import specific functions/properties
const { readFile, writeFile } = require("fs");
const { join, resolve, basename } = require("path");

console.log("Current file:", basename(__filename));

// With renaming
const { readFile: read, writeFile: write } = require("fs");

console.log("✓ Destructuring allows importing specific items");

// 5. Importing JSON Files
console.log("\n--- JSON Files ---");

try {
  const packageJson = require("./package.json");
  console.log("Package name:", packageJson.name);
  console.log("✓ JSON files are automatically parsed");
} catch (error) {
  console.log("Package.json not found in this directory");
}

// 6. Module Resolution
console.log("\n--- Module Resolution ---");

// Node.js looks for modules in this order:
// 1. Core modules (fs, path, http, etc.)
// 2. Exact file path (./module.js)
// 3. Directory with index.js (./myFolder -> ./myFolder/index.js)
// 4. node_modules folder (walking up directory tree)

// Example resolution:
// require('express') -> Looks in node_modules/express
// require('./utils') -> Looks for ./utils.js or ./utils/index.js
// require('fs') -> Returns built-in fs module

console.log("Module paths:", require.resolve.paths("express"));

// 7. require.resolve()
console.log("\n--- require.resolve() ---");

// Get the absolute path of a module without loading it
try {
  const modulePath = require.resolve("path");
  console.log("Path module location:", modulePath);
} catch (error) {
  console.log("Module not found");
}

// 8. require.cache
console.log("\n--- Module Cache ---");

// All loaded modules are cached in require.cache
console.log("Cached modules:", Object.keys(require.cache).length);

// You can delete from cache to force reload
// delete require.cache[require.resolve('./my-module')];
// const freshModule = require('./my-module'); // Will reload

// 9. Different Import Patterns
console.log("\n--- Import Patterns ---");

// Pattern 1: Import entire module
// const lodash = require('lodash');
// lodash.map([1, 2, 3], x => x * 2);

// Pattern 2: Import and destructure
// const { map, filter } = require('lodash');
// map([1, 2, 3], x => x * 2);

// Pattern 3: Import single function from submodule
// const map = require('lodash/map');
// map([1, 2, 3], x => x * 2);

// Pattern 4: Import and execute
// require('./config/database-init')(); // If module exports a function

console.log("✓ Multiple import patterns available");

// 10. Importing Directories
console.log("\n--- Importing Directories ---");

// When you require a directory, Node.js looks for:
// 1. package.json with "main" field
// 2. index.js
// 3. index.node

// Example structure:
// ./myModule/
//   ├── package.json (with "main": "lib/main.js")
//   ├── lib/
//   │   └── main.js
//   └── index.js

// const myModule = require('./myModule'); // Will load according to above rules

console.log("✓ Directories can be imported");

// 11. Conditional Imports
console.log("\n--- Conditional Imports ---");

const isDevelopment = process.env.NODE_ENV === "development";

// Load different modules based on conditions
const logger = isDevelopment
  ? require("./dev-logger")
  : require("./prod-logger");

console.log("✓ Conditional imports based on environment");

// 12. Importing TypeScript (if using ts-node)
console.log("\n--- TypeScript ---");

// With ts-node or similar:
// const myTsModule = require('./my-module.ts');
// require('ts-node/register');
// const typedModule = require('./typed-module');

console.log("✓ TypeScript files can be imported with proper setup");

// 13. Best Practices
console.log("\n--- Best Practices ---");

/*
1. Group imports logically:
   - Built-in modules first
   - npm packages second
   - Local modules last

2. Use const for requires:
   const fs = require('fs'); ✓
   let fs = require('fs');   ✗

3. Destructure when importing specific items:
   const { Router } = require('express');

4. Use meaningful variable names:
   const db = require('./database'); ✓
   const x = require('./database');  ✗

5. Avoid circular dependencies

6. Cache expensive requires:
   const heavyModule = require('./heavy-module');
   // Use heavyModule multiple times

7. Use require.resolve() to check if a module exists:
   try {
     require.resolve('optional-module');
   } catch {
     console.log('Module not available');
   }

8. Don't use require() inside loops or frequently called functions

9. Keep module imports at the top of the file

10. Use path.join() for building file paths:
    require(path.join(__dirname, 'config', 'database'));
*/

// 14. Checking if Module Exists
console.log("\n--- Module Existence Check ---");

function moduleExists(moduleName) {
  try {
    require.resolve(moduleName);
    return true;
  } catch (error) {
    return false;
  }
}

console.log("fs module exists:", moduleExists("fs"));
console.log("fake-module exists:", moduleExists("fake-module"));

// 15. Loading All Files from a Directory
console.log("\n--- Loading Multiple Files ---");

// Example: Load all route files
/*
const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes');
const routeFiles = fs.readdirSync(routesPath)
  .filter(file => file.endsWith('.js'));

routeFiles.forEach(file => {
  const route = require(path.join(routesPath, file));
  // Use the route
});
*/

console.log("✓ Multiple files can be loaded dynamically");

console.log("\n✓ Importing modules concepts completed");

