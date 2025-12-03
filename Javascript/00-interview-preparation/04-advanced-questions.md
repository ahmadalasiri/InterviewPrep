# Advanced JavaScript Interview Questions

## ES6+ Features | Design Patterns | Performance | Security

---

## ES6+ Modern Features

### Q1: Explain destructuring assignment

**Answer:**

```javascript
// Array destructuring
const [a, b, c] = [1, 2, 3];
const [first, , third] = [1, 2, 3];
const [x, ...rest] = [1, 2, 3, 4];

// Object destructuring
const { name, age } = { name: 'John', age: 30 };
const { name: userName } = { name: 'John' }; // Rename
const { city = 'NYC' } = {}; // Default value

// Nested destructuring
const { address: { city } } = { address: { city: 'NYC' } };

// Function parameters
function greet({ name, age = 18 }) {
  console.log(`${name}, ${age}`);
}
```

### Q2: What are Symbols and when to use them?

**Answer:**
Symbols are unique, immutable primitive values used as object property keys.

```javascript
// Create unique symbols
const id = Symbol('id');
const id2 = Symbol('id');
console.log(id === id2); // false (always unique)

// Use as object keys
const user = {
  name: 'John',
  [id]: 123 // Symbol as key
};

// Symbols are not enumerable
for (let key in user) {
  console.log(key); // Only 'name', not symbol
}

// Well-known symbols
const obj = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({ value: i++, done: i > 5 })
    };
  }
};
```

### Q3: What are ES6 modules? Explain the difference between named exports and default exports

**Answer:**

ES6 modules provide a standardized way to organize and share code between files.

**Named Exports:**

```javascript
// math.js
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export function multiply(a, b) {
  return a * b;
}

// Or export at the end
const PI = 3.14159;
function add(a, b) { return a + b; }
export { PI, add, multiply };

// Import named exports
import { PI, add, multiply } from './math.js';
import { add as sum } from './math.js'; // Rename
import * as math from './math.js'; // Namespace import
```

**Default Exports:**

```javascript
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// Or
class User { /* ... */ }
export default User;

// Import default export
import User from './user.js';
import User, { PI } from './user.js'; // Default + named
```

**Key Differences:**
- Named exports: Multiple per module, must use exact name or rename
- Default export: One per module, can be imported with any name
- Named exports are statically analyzable (tree-shaking friendly)
- Default exports are more flexible for the main export of a module

### Q4: What is the difference between CommonJS (require/module.exports) and ES6 modules (import/export)?

**Answer:**

**CommonJS (Node.js):**

```javascript
// Export
module.exports = { name: 'John' };
module.exports.name = 'John';
exports.age = 30;

// Import
const user = require('./user.js');
const { name, age } = require('./user.js');
```

**ES6 Modules:**

```javascript
// Export
export const name = 'John';
export default { name: 'John' };

// Import
import user from './user.js';
import { name } from './user.js';
```

**Key Differences:**

| Feature | CommonJS | ES6 Modules |
|---------|----------|-------------|
| **Loading** | Synchronous, runtime | Asynchronous, compile-time |
| **Hoisting** | No hoisting | Hoisted to top |
| **Tree-shaking** | Not supported | Supported |
| **Circular deps** | Handled dynamically | Static analysis |
| **Browser support** | Requires bundler | Native (modern browsers) |
| **Strict mode** | Optional | Always enabled |
| **Top-level await** | No | Yes (ES2022) |

### Q5: How do you handle circular dependencies in JavaScript modules?

**Answer:**

**Problem:**

```javascript
// a.js
import { b } from './b.js';
export const a = 'a';
export function getB() { return b; }

// b.js
import { a } from './a.js';
export const b = 'b';
export function getA() { return a; }
```

**Solutions:**

**1. Restructure to avoid circular dependencies:**

```javascript
// common.js - shared code
export const shared = { /* ... */ };

// a.js
import { shared } from './common.js';
export const a = 'a';

// b.js
import { shared } from './common.js';
export const b = 'b';
```

**2. Use function exports (lazy evaluation):**

```javascript
// a.js
export function getB() {
  const { b } = require('./b.js'); // Dynamic import
  return b;
}

// b.js
export function getA() {
  const { a } = require('./a.js');
  return a;
}
```

**3. Use dynamic imports:**

```javascript
// a.js
export const a = 'a';
export async function getB() {
  const { b } = await import('./b.js');
  return b;
}
```

**4. Move imports inside functions:**

```javascript
// a.js
export const a = 'a';
export function useB() {
  const { b } = require('./b.js');
  return b;
}
```

### Q6: Explain tree-shaking and how it relates to ES6 modules

**Answer:**

Tree-shaking is a dead code elimination technique that removes unused exports from the final bundle.

**Why ES6 modules enable tree-shaking:**

```javascript
// utils.js
export function used() {
  return 'used';
}

export function unused() {
  return 'unused';
}

// main.js
import { used } from './utils.js';
console.log(used());

// After tree-shaking, unused() is removed from bundle
```

**CommonJS doesn't support tree-shaking:**

```javascript
// utils.js
module.exports = {
  used: () => 'used',
  unused: () => 'unused'
};

// main.js
const { used } = require('./utils.js');
// Both used and unused are bundled (can't analyze statically)
```

**Best practices for tree-shaking:**

```javascript
// ✅ Good - Named exports
export function func1() {}
export function func2() {}

// ❌ Bad - Default export object
export default {
  func1: () => {},
  func2: () => {}
};

// ✅ Good - Side-effect free
export const PI = 3.14;

// ❌ Bad - Side effects prevent tree-shaking
export const config = window.config; // Side effect
```

**Bundler configuration:**

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // Enables tree-shaking
  optimization: {
    usedExports: true,
    sideEffects: false // Mark package as side-effect free
  }
};
```

### Q7: How do you organize and structure modules in a large codebase?

**Answer:**

**1. Feature-based organization:**

```
src/
  features/
    auth/
      index.js
      authService.js
      authUtils.js
    user/
      index.js
      userService.js
      userModel.js
  shared/
    utils/
      helpers.js
      constants.js
    components/
      Button.js
      Input.js
```

**2. Barrel exports (index.js):**

```javascript
// features/auth/index.js
export { default as AuthService } from './authService.js';
export { login, logout } from './authService.js';
export * from './authUtils.js';

// Usage
import { AuthService, login } from './features/auth';
```

**3. Module types:**

```javascript
// services/ - Business logic
export class UserService { /* ... */ }

// models/ - Data structures
export class User { /* ... */ }

// utils/ - Pure functions
export function formatDate(date) { /* ... */ }

// constants/ - Configuration
export const API_URL = 'https://api.example.com';
```

**4. Dependency management:**

```javascript
// ✅ Good - Clear dependencies
import { UserService } from '../services/userService.js';
import { formatDate } from '../utils/dateUtils.js';

// ❌ Bad - Deep nesting
import { UserService } from '../../../services/userService.js';
```

**5. Module boundaries:**

```javascript
// Public API (what others can import)
export { UserService, UserModel };

// Private (internal to module)
function internalHelper() { /* ... */ }
```

---

## Design Patterns

### Q3: Explain common JavaScript design patterns

**Module Pattern:**

```javascript
const Module = (function() {
  let private = 0;
  
  return {
    increment() { private++; },
    get() { return private; }
  };
})();
```

**Observer Pattern:**

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }
  
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn(...args));
    }
  }
}
```

**Singleton Pattern:**

```javascript
class Singleton {
  static instance;
  
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
  }
}
```

---

## Performance

### Q4: How to optimize JavaScript performance?

**Answer:**

**1. Debouncing and Throttling:**

```javascript
// Debounce - wait for pause in events
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle - limit execution rate
function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

**2. Memoization:**

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

**3. Lazy Loading:**

```javascript
// Dynamic imports
async function loadModule() {
  const module = await import('./heavy-module.js');
  module.doSomething();
}
```

---

## Memory & Garbage Collection

### Q5: Explain memory leaks and how to prevent them

**Answer:**

**Common Causes:**

```javascript
// 1. Global variables
function leak() {
  globalVar = 'leaks'; // No var/let/const
}

// 2. Forgotten timers
const interval = setInterval(() => {}, 1000);
// clearInterval(interval); // Don't forget!

// 3. Closures
function outer() {
  const bigData = new Array(1000000);
  return function inner() {
    console.log(bigData[0]); // Keeps reference
  };
}

// 4. Detached DOM references
let element = document.getElementById('button');
document.body.removeChild(element);
// element still in memory

// 5. Event listeners
element.addEventListener('click', handler);
// element.removeEventListener('click', handler); // Clean up!
```

---

## Modern JavaScript

### Q6: Explain Optional Chaining and Nullish Coalescing

**Answer:**

**Optional Chaining (`?.`):**

```javascript
// Without optional chaining
const city = user && user.address && user.address.city;

// With optional chaining
const city = user?.address?.city;

// Optional method call
obj.method?.();

// Optional array access
arr?.[0];
```

**Nullish Coalescing (`??`):**

```javascript
// Old way (problem with falsy values)
const value = input || 'default'; // 0, '', false → 'default'

// Nullish coalescing (only null/undefined)
const value = input ?? 'default'; // 0, '' → 0, ''

// Examples
0 ?? 'default'        // 0
'' ?? 'default'       // ''
false ?? 'default'    // false
null ?? 'default'     // 'default'
undefined ?? 'default' // 'default'
```

---

This covers advanced JavaScript concepts!

