# Basic Node.js Interview Questions

## Table of Contents

- [What is Node.js?](#what-is-nodejs)
- [Core Concepts](#core-concepts)
- [JavaScript Fundamentals](#javascript-fundamentals)
- [Modules and Packages](#modules-and-packages)

---

## What is Node.js?

### Q1: What is Node.js and why is it popular?

**Answer:**
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side.

**Key features:**

- **Asynchronous and Event-Driven**: Non-blocking I/O operations
- **Single-Threaded**: Uses event loop for concurrency
- **Fast**: Built on V8 engine (compiles JavaScript to machine code)
- **NPM Ecosystem**: Largest package ecosystem
- **Cross-Platform**: Runs on Windows, Linux, macOS

**Popular because:**

- Same language (JavaScript) for frontend and backend
- Highly scalable for I/O-intensive applications
- Real-time applications (chat, gaming, collaboration tools)
- Microservices architecture
- Large community and ecosystem

---

### Q2: Is Node.js single-threaded or multi-threaded?

**Answer:**
Node.js is **single-threaded** for JavaScript execution, but it uses **multi-threading** behind the scenes.

**Details:**

- **Main Thread**: Single thread runs JavaScript code
- **Worker Pool**: libuv manages thread pool for async operations
- **Event Loop**: Manages async callbacks on the main thread
- **Worker Threads**: Can create additional threads for CPU-intensive tasks

```javascript
// Main thread handles JavaScript
console.log("This runs on main thread");

// File operations use worker pool
fs.readFile("file.txt", (err, data) => {
  console.log("This callback runs on main thread");
});
```

---

### Q3: What is the Event Loop in Node.js?

**Answer:**
The Event Loop is the mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

**How it works:**

1. **Call Stack**: Executes synchronous code
2. **Event Queue**: Holds callbacks ready to execute
3. **Event Loop**: Checks if call stack is empty, then executes queued callbacks

**Event Loop Phases:**

```
   ┌───────────────────────────┐
┌─>│           timers          │ <- setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ <- I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ <- internal use
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │ <- retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │ <- setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks      │ <- socket.on('close', ...)
│  └─────────────┬─────────────┘
└──────────────────────────────┘
```

**Example:**

```javascript
console.log("1 - Synchronous");

setTimeout(() => {
  console.log("2 - setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - Promise");
});

console.log("4 - Synchronous");

// Output:
// 1 - Synchronous
// 4 - Synchronous
// 3 - Promise
// 2 - setTimeout
```

---

## Core Concepts

### Q4: What are callbacks in Node.js?

**Answer:**
A callback is a function passed as an argument to another function, which is executed after an asynchronous operation completes.

**Example:**

```javascript
// Callback pattern
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { name: "John", age: 30 });
  }, 1000);
}

// Usage
fetchData((error, data) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data:", data);
  }
});
```

**Callback Convention (Error-First):**

```javascript
function readFile(path, callback) {
  // First parameter is always error (null if no error)
  // Second parameter is the result
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}
```

**Problems:**

- Callback hell (nested callbacks)
- Error handling complexity
- Difficult to read and maintain

---

### Q5: What is callback hell and how do you avoid it?

**Answer:**
Callback hell occurs when you have multiple nested callbacks, making code difficult to read and maintain.

**Example of Callback Hell:**

```javascript
getData(function (a) {
  getMoreData(a, function (b) {
    getMoreData(b, function (c) {
      getMoreData(c, function (d) {
        getMoreData(d, function (e) {
          // Do something with 'e'
        });
      });
    });
  });
});
```

**Solutions:**

1. **Use Promises:**

```javascript
getData()
  .then((a) => getMoreData(a))
  .then((b) => getMoreData(b))
  .then((c) => getMoreData(c))
  .then((d) => getMoreData(d))
  .then((e) => {
    // Do something with 'e'
  })
  .catch((err) => console.error(err));
```

2. **Use Async/Await:**

```javascript
async function processData() {
  try {
    const a = await getData();
    const b = await getMoreData(a);
    const c = await getMoreData(b);
    const d = await getMoreData(c);
    const e = await getMoreData(d);
    // Do something with 'e'
  } catch (err) {
    console.error(err);
  }
}
```

3. **Modularize Code:**

```javascript
function step1(data) {
  return getMoreData(data);
}

function step2(data) {
  return getMoreData(data);
}

// Chain named functions
getData().then(step1).then(step2).catch(handleError);
```

---

### Q6: What are Promises?

**Answer:**
A Promise is an object representing the eventual completion or failure of an asynchronous operation.

**States:**

- **Pending**: Initial state
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

**Example:**

```javascript
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve({ data: "Success!" });
    } else {
      reject(new Error("Something went wrong"));
    }
  }, 1000);
});

// Using a Promise
myPromise
  .then((result) => {
    console.log(result); // { data: 'Success!' }
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Operation complete");
  });
```

**Promise Chaining:**

```javascript
fetchUser()
  .then((user) => fetchPosts(user.id))
  .then((posts) => fetchComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((err) => console.error("Error:", err));
```

**Promise Methods:**

```javascript
// Promise.all - Wait for all promises
Promise.all([promise1, promise2, promise3]).then((results) =>
  console.log(results)
);

// Promise.race - First to complete
Promise.race([promise1, promise2]).then((result) => console.log(result));

// Promise.allSettled - Wait for all, get all results
Promise.allSettled([promise1, promise2]).then((results) =>
  console.log(results)
);

// Promise.any - First to fulfill
Promise.any([promise1, promise2]).then((result) => console.log(result));
```

---

### Q7: What is async/await?

**Answer:**
Async/await is syntactic sugar built on top of Promises, making asynchronous code look and behave more like synchronous code.

**Example:**

```javascript
// Promise version
function getUser() {
  return fetch("/api/user")
    .then((response) => response.json())
    .then((user) => {
      return fetch(`/api/posts/${user.id}`);
    })
    .then((response) => response.json());
}

// Async/await version
async function getUser() {
  const response = await fetch("/api/user");
  const user = await response.json();
  const postsResponse = await fetch(`/api/posts/${user.id}`);
  const posts = await postsResponse.json();
  return posts;
}
```

**Error Handling:**

```javascript
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
```

**Parallel Execution:**

```javascript
// Sequential (slower)
async function sequential() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  return { user, posts };
}

// Parallel (faster)
async function parallel() {
  const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
  return { user, posts };
}
```

---

## JavaScript Fundamentals

### Q8: Difference between `var`, `let`, and `const`?

**Answer:**

| Feature       | var             | let          | const        |
| ------------- | --------------- | ------------ | ------------ |
| Scope         | Function-scoped | Block-scoped | Block-scoped |
| Hoisting      | Yes (undefined) | Yes (TDZ)    | Yes (TDZ)    |
| Reassignment  | Yes             | Yes          | No           |
| Redeclaration | Yes             | No           | No           |

**Examples:**

```javascript
// var - function scoped
function varExample() {
  var x = 1;
  if (true) {
    var x = 2; // Same variable
    console.log(x); // 2
  }
  console.log(x); // 2
}

// let - block scoped
function letExample() {
  let x = 1;
  if (true) {
    let x = 2; // Different variable
    console.log(x); // 2
  }
  console.log(x); // 1
}

// const - block scoped, cannot reassign
const PI = 3.14159;
// PI = 3.14; // Error: Assignment to constant variable

// But can mutate objects/arrays
const user = { name: "John" };
user.name = "Jane"; // OK
user.age = 30; // OK
// user = {}; // Error
```

**Temporal Dead Zone (TDZ):**

```javascript
console.log(a); // undefined (var is hoisted)
console.log(b); // ReferenceError (TDZ)
var a = 1;
let b = 2;
```

---

### Q9: What are arrow functions and how are they different?

**Answer:**
Arrow functions are a concise syntax for writing function expressions.

**Differences:**

1. **Syntax:**

```javascript
// Regular function
const add = function (a, b) {
  return a + b;
};

// Arrow function
const add = (a, b) => a + b;

// With single parameter
const square = (x) => x * x;

// With no parameters
const greet = () => console.log("Hello");

// With block body
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

2. **`this` Binding:**

```javascript
// Regular function - 'this' depends on how it's called
const obj = {
  name: "John",
  regularFunc: function () {
    console.log(this.name);
  },
  arrowFunc: () => {
    console.log(this.name); // 'this' is lexically bound
  },
};

obj.regularFunc(); // 'John'
obj.arrowFunc(); // undefined (this refers to outer scope)
```

3. **No `arguments` object:**

```javascript
// Regular function
function regular() {
  console.log(arguments);
}
regular(1, 2, 3); // [1, 2, 3]

// Arrow function
const arrow = () => {
  console.log(arguments); // ReferenceError
};

// Use rest parameters instead
const arrow = (...args) => {
  console.log(args); // [1, 2, 3]
};
```

4. **Cannot be used as constructors:**

```javascript
function Person(name) {
  this.name = name;
}
const john = new Person("John"); // OK

const PersonArrow = (name) => {
  this.name = name;
};
const jane = new PersonArrow("Jane"); // TypeError
```

---

### Q10: What is the spread operator and rest parameter?

**Answer:**

**Spread Operator (`...`)** - Expands an iterable into individual elements

```javascript
// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Function arguments
const numbers = [1, 2, 3];
Math.max(...numbers); // 3

// Copying arrays/objects
const original = [1, 2, 3];
const copy = [...original];

// Merging arrays
const merged = [...arr1, ...arr2];
```

**Rest Parameter (`...`)** - Collects multiple elements into an array

```javascript
// Function parameters
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
sum(1, 2, 3, 4); // 10

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Object destructuring
const { name, age, ...otherProps } = {
  name: "John",
  age: 30,
  city: "NYC",
  country: "USA",
};
console.log(otherProps); // { city: 'NYC', country: 'USA' }
```

---

## Modules and Packages

### Q11: What is the difference between CommonJS and ES6 modules?

**Answer:**

**CommonJS (Node.js default):**

```javascript
// Exporting
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

// Or
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// Importing
const math = require("./math");
const { add, subtract } = require("./math");
```

**ES6 Modules:**

```javascript
// Exporting
// math.mjs or math.js (with "type": "module" in package.json)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// Or default export
export default class Calculator {
  add(a, b) {
    return a + b;
  }
}

// Importing
import { add, subtract } from "./math.mjs";
import Calculator from "./math.mjs";
import * as math from "./math.mjs";
```

**Key Differences:**

| Feature         | CommonJS           | ES6 Modules           |
| --------------- | ------------------ | --------------------- |
| Syntax          | `require()`        | `import/export`       |
| Loading         | Synchronous        | Asynchronous          |
| Usage           | Node.js default    | Modern JavaScript     |
| Dynamic imports | Yes                | Yes (import())        |
| Tree shaking    | No                 | Yes                   |
| Browser support | No (needs bundler) | Yes (modern browsers) |

---

### Q12: What is `package.json` and what does it contain?

**Answer:**
`package.json` is a manifest file for Node.js projects that contains metadata and configuration.

**Key Fields:**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "jest": "^27.0.0"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "keywords": ["api", "backend"],
  "author": "Your Name",
  "license": "MIT"
}
```

**Important Fields:**

- `name`: Package name
- `version`: Semantic versioning (major.minor.patch)
- `main`: Entry point file
- `scripts`: Custom commands
- `dependencies`: Production dependencies
- `devDependencies`: Development-only dependencies
- `engines`: Node.js version requirement

---

### Q13: What is the difference between `dependencies` and `devDependencies`?

**Answer:**

**dependencies:**

- Required for application to run in production
- Installed with `npm install --production`
- Examples: express, mongoose, axios

```bash
npm install express --save
# or simply
npm install express
```

**devDependencies:**

- Only needed during development
- Not installed in production
- Examples: testing frameworks, build tools, linters

```bash
npm install jest --save-dev
# or
npm install jest -D
```

**Example:**

```json
{
  "dependencies": {
    "express": "^4.18.0", // Web framework
    "mongoose": "^6.0.0", // Database ODM
    "dotenv": "^16.0.0" // Environment variables
  },
  "devDependencies": {
    "nodemon": "^2.0.0", // Auto-restart
    "jest": "^27.0.0", // Testing
    "eslint": "^8.0.0", // Linting
    "prettier": "^2.5.0" // Code formatting
  }
}
```

---

### Q14: What is NPM and what are its alternatives?

**Answer:**

**NPM (Node Package Manager):**

- Default package manager for Node.js
- Largest software registry in the world
- Manages project dependencies
- Runs scripts defined in package.json

**Basic NPM Commands:**

```bash
npm init                    # Initialize new project
npm install                 # Install all dependencies
npm install <package>       # Install specific package
npm install -g <package>    # Install globally
npm update                  # Update packages
npm uninstall <package>     # Remove package
npm run <script>            # Run custom script
npm audit                   # Check for vulnerabilities
npm publish                 # Publish package
```

**Alternatives:**

1. **Yarn:**

```bash
yarn                      # Install dependencies
yarn add <package>        # Add package
yarn remove <package>     # Remove package
yarn upgrade              # Update packages
```

- Faster than NPM (parallel downloads)
- Deterministic (yarn.lock)
- Workspaces support

2. **pnpm:**

```bash
pnpm install
pnpm add <package>
```

- Efficient disk space usage (shared dependencies)
- Faster than NPM and Yarn
- Strict dependency resolution

---

This covers the basic Node.js interview questions. Practice these concepts and move on to async programming questions!

