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

