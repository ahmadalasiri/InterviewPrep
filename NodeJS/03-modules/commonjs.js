// CommonJS Modules in Node.js

console.log("=== CommonJS Modules ===\n");

// 1. Exporting in CommonJS
console.log("--- Module Exports ---");

// Single export
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

// Method 1: module.exports (overwrites the entire exports object)
module.exports = {
  add,
  subtract,
  multiply,
};

// Method 2: exports shorthand (adds properties to exports object)
// exports.add = add;
// exports.subtract = subtract;
// exports.multiply = multiply;

// Method 3: Exporting single function/class
// module.exports = add;

// 2. Understanding module.exports vs exports
console.log("\n--- module.exports vs exports ---");

// exports is a reference to module.exports
// module.exports is the actual object that gets returned when require() is called

// This works:
// exports.myFunction = () => console.log('Hello');

// This DOESN'T work (breaks the reference):
// exports = { myFunction: () => console.log('Hello') };

// This DOES work:
// module.exports = { myFunction: () => console.log('Hello') };

// 3. Exporting a Class
console.log("\n--- Exporting Classes ---");

class Calculator {
  constructor() {
    this.result = 0;
  }

  add(num) {
    this.result += num;
    return this;
  }

  subtract(num) {
    this.result -= num;
    return this;
  }

  multiply(num) {
    this.result *= num;
    return this;
  }

  divide(num) {
    if (num === 0) throw new Error("Cannot divide by zero");
    this.result /= num;
    return this;
  }

  getResult() {
    return this.result;
  }

  reset() {
    this.result = 0;
    return this;
  }
}

// Export the class
// module.exports = Calculator;

// Or export as part of an object
// module.exports = { Calculator };

// 4. Exporting Constants and Variables
console.log("\n--- Exporting Constants ---");

const API_VERSION = "v1.0.0";
const MAX_RETRIES = 3;
const TIMEOUT = 5000;

const CONFIG = {
  port: 3000,
  host: "localhost",
  environment: "development",
};

// module.exports = { API_VERSION, MAX_RETRIES, TIMEOUT, CONFIG };

// 5. Module Caching
console.log("\n--- Module Caching ---");

// Modules are cached after the first time they are loaded
// require() will return the same object on subsequent calls

let callCount = 0;

function incrementCallCount() {
  callCount++;
  return callCount;
}

console.log("Module loaded. Call count:", callCount);

// module.exports = { incrementCallCount, getCallCount: () => callCount };

// 6. Module Wrapper Function
console.log("\n--- Module Wrapper ---");

// Node.js wraps all modules in a function before executing them:
// (function(exports, require, module, __filename, __dirname) {
//   // Your module code here
// });

console.log("__filename:", __filename); // Full path to current file
console.log("__dirname:", __dirname); // Directory path of current file
console.log("module.id:", module.id); // Module identifier
console.log("module.loaded:", module.loaded); // Whether module is loaded

// 7. Circular Dependencies
console.log("\n--- Circular Dependencies ---");

// CommonJS handles circular dependencies by returning
// a partially completed module.exports object

// Example: a.js requires b.js, and b.js requires a.js
// Node.js will provide an incomplete version to break the cycle

// 8. Best Practices
console.log("\n--- Best Practices ---");

/*
1. Use module.exports for single exports:
   module.exports = MyClass;

2. Use module.exports = {} for multiple exports:
   module.exports = { func1, func2, CLASS };

3. Be consistent with naming:
   - File name: user-service.js
   - Export: UserService or userService

4. Avoid circular dependencies when possible

5. Keep modules focused and single-responsibility

6. Use descriptive names for exports

7. Document your exports with JSDoc comments
*/

// 9. Importing Built-in Modules
console.log("\n--- Built-in Modules ---");

const fs = require("fs");
const path = require("path");
const http = require("http");
const os = require("os");

console.log("Node.js platform:", os.platform());

// 10. Importing npm Packages
console.log("\n--- npm Packages ---");

// const express = require('express');
// const lodash = require('lodash');
// const axios = require('axios');

// For scoped packages:
// const somePackage = require('@scope/package-name');

console.log("\n✓ CommonJS module concepts completed");

