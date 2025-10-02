// ES Modules (ESM) in Node.js
// Note: Use .mjs extension or set "type": "module" in package.json

console.log("=== ES Modules (ESM) ===\n");

// 1. Named Exports
console.log("--- Named Exports ---");

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

// Export after definition
function power(base, exponent) {
  return Math.pow(base, exponent);
}

export { power };

// 2. Default Exports
console.log("\n--- Default Exports ---");

// Only one default export per module
export default class Calculator {
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

// Alternative default export syntax:
// const calculator = { ... };
// export default calculator;

// 3. Exporting Constants
console.log("\n--- Exporting Constants ---");

export const API_VERSION = "v2.0.0";
export const MAX_RETRIES = 3;
export const TIMEOUT = 5000;

export const CONFIG = {
  port: 3000,
  host: "localhost",
  environment: "development",
};

// 4. Re-exporting from other modules
console.log("\n--- Re-exports ---");

// Re-export everything from another module
// export * from './math-utils.mjs';

// Re-export specific items
// export { add, subtract } from './math-utils.mjs';

// Re-export with renaming
// export { add as sum, multiply as product } from './math-utils.mjs';

// Re-export default as named
// export { default as Calculator } from './calculator.mjs';

// 5. Combining Named and Default Exports
console.log("\n--- Mixed Exports ---");

export const VERSION = "1.0.0";

// Having both named exports and a default export
// export default Calculator;
// export { add, subtract, multiply };

// 6. Dynamic Imports
console.log("\n--- Dynamic Imports ---");

// Dynamic imports return a Promise
async function loadModule() {
  try {
    // const module = await import('./some-module.mjs');
    // module.someFunction();
    console.log("✓ Dynamic import would work here");
  } catch (error) {
    console.error("✗ Error loading module:", error.message);
  }
}

// Conditional loading
async function conditionalImport(condition) {
  if (condition) {
    const module = await import("./heavy-module.mjs");
    return module.default;
  }
}

// 7. Import Meta
console.log("\n--- import.meta ---");

// import.meta.url provides the URL of the current module
console.log("Module URL:", import.meta.url);

// Get directory name in ESM (equivalent to __dirname in CommonJS)
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Filename:", __filename);
console.log("Directory:", __dirname);

// 8. Top-level await
console.log("\n--- Top-level await ---");

// In ESM, you can use await at the top level
// const data = await fetch('https://api.example.com/data');
// const result = await someAsyncFunction();

console.log("✓ Top-level await is supported in ESM");

// 9. CommonJS Interoperability
console.log("\n--- CommonJS Interop ---");

// Importing CommonJS modules in ESM:
// import cjsModule from './commonjs-module.js';
// The default export will be the module.exports object

// For named imports from CommonJS:
// import { functionName } from './commonjs-module.js';
// This only works if the CommonJS module exports an object

// 10. ESM Best Practices
console.log("\n--- Best Practices ---");

/*
1. Use named exports for utilities and multiple exports:
   export { func1, func2, func3 };

2. Use default exports for single main export:
   export default MyClass;

3. File naming:
   - Use .mjs extension, OR
   - Set "type": "module" in package.json and use .js
   - Use .cjs for CommonJS modules when using "type": "module"

4. Always use file extensions in imports:
   import { func } from './module.mjs'; // Good
   import { func } from './module';     // May not work

5. Use destructuring for named imports:
   import { func1, func2 } from './module.mjs';

6. Rename imports if needed:
   import { func1 as myFunc } from './module.mjs';

7. Group imports logically:
   - Built-in Node.js modules
   - npm packages
   - Local modules

8. Use dynamic imports for code splitting:
   const module = await import('./heavy-module.mjs');

9. Prefer ESM over CommonJS for new projects

10. Be aware of the differences:
    - No __dirname, __filename (use import.meta.url)
    - No require, module.exports
    - Imports are hoisted and read-only
    - Strict mode is enabled by default
*/

console.log("\n✓ ES Modules concepts completed");

