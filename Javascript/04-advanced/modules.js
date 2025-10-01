// ES6 Modules in JavaScript

console.log("=== ES6 Modules ===\n");

// Note: This file demonstrates module syntax
// In actual use, you would have separate files

// 1. Named Exports
console.log("--- Named Exports ---");

// Export declaration
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}

// Export list
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
export { subtract, multiply };

// Rename exports
const divide = (a, b) => a / b;
export { divide as div };

// 2. Default Export
console.log("\n--- Default Export ---");

export default class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
}

// 3. Import Examples (in another file)
/*
// Named imports
import { PI, add, subtract } from './math.js';

// Import all
import * as math from './math.js';
console.log(math.PI);
console.log(math.add(2, 3));

// Default import
import Calculator from './calculator.js';
const calc = new Calculator();

// Mixed imports
import Calculator, { PI, add } from './math.js';

// Rename imports
import { add as addition } from './math.js';

// Dynamic imports
async function loadModule() {
  const module = await import('./math.js');
  console.log(module.add(2, 3));
}
*/

// 4. Module Pattern (Pre-ES6)
console.log("\n--- Module Pattern ---");

const Module = (function() {
  // Private
  let privateVar = 0;
  
  function privateMethod() {
    return privateVar;
  }
  
  // Public API
  return {
    publicMethod() {
      return privateMethod();
    },
    increment() {
      privateVar++;
    }
  };
})();

Module.increment();
console.log(Module.publicMethod());

console.log("\n--- Summary ---");
console.log("✓ Named exports: export { name }");
console.log("✓ Default export: export default");
console.log("✓ Import: import { name } from './module.js'");
console.log("✓ Dynamic imports with import()");

