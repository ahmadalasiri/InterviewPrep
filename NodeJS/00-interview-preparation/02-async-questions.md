# Asynchronous Programming Interview Questions

## Table of Contents

- [Event Loop](#event-loop)
- [Promises](#promises)
- [Async/Await](#asyncawait)
- [Error Handling](#error-handling)
- [Performance](#performance)

---

## Event Loop

### Q1: Explain the Node.js Event Loop in detail

**Answer:**
The Event Loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

**Event Loop Phases:**

1. **Timers** - Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending Callbacks** - Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare** - Used internally
4. **Poll** - Retrieve new I/O events; execute I/O related callbacks
5. **Check** - `setImmediate()` callbacks are invoked here
6. **Close Callbacks** - e.g., `socket.on('close', ...)`

**Example:**

```javascript
console.log("1 - Start");

setTimeout(() => console.log("2 - setTimeout"), 0);

setImmediate(() => console.log("3 - setImmediate"));

process.nextTick(() => console.log("4 - nextTick"));

Promise.resolve().then(() => console.log("5 - Promise"));

console.log("6 - End");

// Output:
// 1 - Start
// 6 - End
// 4 - nextTick
// 5 - Promise
// 2 - setTimeout
// 3 - setImmediate
```

**Explanation:**

- Synchronous code runs first (1, 6)
- `process.nextTick()` has highest priority (4)
- Microtasks (Promises) run next (5)
- Timer callbacks run (2)
- Check phase runs `setImmediate()` (3)

---

### Q2: What is the difference between `setImmediate()` and `process.nextTick()`?

**Answer:**

**process.nextTick():**

- Executes before the Event Loop continues
- Runs immediately after current operation completes
- Not technically part of the Event Loop
- Can starve the Event Loop if used recursively

```javascript
process.nextTick(() => {
  console.log("nextTick callback");
});

console.log("Synchronous code");

// Output:
// Synchronous code
// nextTick callback
```

**setImmediate():**

- Executes in the Check phase of Event Loop
- Designed to execute after the current poll phase completes
- More predictable for I/O operations

```javascript
setImmediate(() => {
  console.log("setImmediate callback");
});

console.log("Synchronous code");

// Output:
// Synchronous code
// setImmediate callback
```

**Comparison:**

```javascript
const fs = require("fs");

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log("setTimeout");
  }, 0);

  setImmediate(() => {
    console.log("setImmediate");
  });
});

// Output:
// setImmediate
// setTimeout
```

**When inside I/O cycle, `setImmediate()` always executes first!**

---

### Q3: What are microtasks and macrotasks?

**Answer:**

**Microtasks:**

- Process all microtasks before moving to next macrotask
- Examples: Promises, `process.nextTick()`
- Have higher priority

**Macrotasks:**

- One macrotask per Event Loop iteration
- Examples: `setTimeout()`, `setInterval()`, `setImmediate()`, I/O

**Example:**

```javascript
console.log("Script start");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("Promise in setTimeout");
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
  })
  .then(() => {
    console.log("Promise 2");
  });

setTimeout(() => {
  console.log("setTimeout 2");
}, 0);

console.log("Script end");

// Output:
// Script start
// Script end
// Promise 1
// Promise 2
// setTimeout 1
// Promise in setTimeout
// setTimeout 2
```

**Queue Priority:**

1. Synchronous code
2. Microtask queue (Promises, process.nextTick)
3. Macrotask queue (setTimeout, setImmediate, I/O)

---

## Promises

### Q4: How do you create and chain Promises?

**Answer:**

**Creating a Promise:**

```javascript
const myPromise = new Promise((resolve, reject) => {
  // Async operation
  const success = true;

  setTimeout(() => {
    if (success) {
      resolve({ data: "Success!" });
    } else {
      reject(new Error("Failed!"));
    }
  }, 1000);
});
```

**Consuming a Promise:**

```javascript
myPromise
  .then((result) => {
    console.log(result);
    return "Next value";
  })
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Cleanup");
  });
```

**Chaining Promises:**

```javascript
function fetchUser(id) {
  return fetch(`/api/users/${id}`).then((response) => response.json());
}

function fetchPosts(userId) {
  return fetch(`/api/users/${userId}/posts`).then((response) =>
    response.json()
  );
}

function fetchComments(postId) {
  return fetch(`/api/posts/${postId}/comments`).then((response) =>
    response.json()
  );
}

// Chaining
fetchUser(1)
  .then((user) => {
    console.log("User:", user);
    return fetchPosts(user.id);
  })
  .then((posts) => {
    console.log("Posts:", posts);
    return fetchComments(posts[0].id);
  })
  .then((comments) => {
    console.log("Comments:", comments);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

---

### Q5: What is Promise.all() and when would you use it?

**Answer:**
`Promise.all()` takes an array of promises and returns a single promise that resolves when all promises resolve, or rejects if any promise rejects.

**Example:**

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve("foo"), 100)
);
const promise3 = fetch("/api/data").then((res) => res.json());

Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log(values); // [3, 'foo', {data}]
  })
  .catch((error) => {
    console.error("One of the promises failed:", error);
  });
```

**Use Cases:**

- Parallel API calls
- Loading multiple resources
- Batch processing

**Real-world Example:**

```javascript
async function loadUserDashboard(userId) {
  try {
    const [user, posts, notifications, settings] = await Promise.all([
      fetchUser(userId),
      fetchPosts(userId),
      fetchNotifications(userId),
      fetchSettings(userId),
    ]);

    return {
      user,
      posts,
      notifications,
      settings,
    };
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    throw error;
  }
}
```

**Important:** If any promise rejects, `Promise.all()` immediately rejects!

---

### Q6: What are the differences between Promise.all(), Promise.race(), Promise.allSettled(), and Promise.any()?

**Answer:**

**Promise.all()** - Waits for all promises to resolve

```javascript
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results)); // [result1, result2, result3]
  .catch(error => console.error(error));   // Rejects if ANY fails
```

**Promise.race()** - Returns first settled promise (resolved or rejected)

```javascript
Promise.race([promise1, promise2, promise3])
  .then(result => console.log(result));    // First to finish
  .catch(error => console.error(error));   // If first to finish rejects
```

**Promise.allSettled()** - Waits for all, returns all results (fulfilled or rejected)

```javascript
Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log("Success:", result.value);
    } else {
      console.log("Failed:", result.reason);
    }
  });
});
// Never rejects!
```

**Promise.any()** - Returns first fulfilled promise, rejects if all fail

```javascript
Promise.any([promise1, promise2, promise3])
  .then(result => console.log(result));     // First to fulfill
  .catch(error => console.error(error));    // All rejected (AggregateError)
```

**Comparison Table:**

| Method         | Resolves When  | Rejects When                 |
| -------------- | -------------- | ---------------------------- |
| `all()`        | All fulfill    | Any rejects                  |
| `race()`       | First settles  | First settles with rejection |
| `allSettled()` | All settle     | Never                        |
| `any()`        | First fulfills | All reject                   |

**Use Cases:**

```javascript
// Promise.all - Load all required data
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);

// Promise.race - Timeout implementation
const result = await Promise.race([
  fetchData(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 5000)
  ),
]);

// Promise.allSettled - Partial success handling
const results = await Promise.allSettled([
  fetchFromAPI1(),
  fetchFromAPI2(),
  fetchFromAPI3(),
]);
const successful = results.filter((r) => r.status === "fulfilled");

// Promise.any - Fallback to multiple sources
const data = await Promise.any([
  fetchFromPrimaryDB(),
  fetchFromBackupDB(),
  fetchFromCache(),
]);
```

---

## Async/Await

### Q7: How does async/await work under the hood?

**Answer:**
Async/await is syntactic sugar over Promises. An `async` function always returns a Promise.

**How it works:**

```javascript
// This async function...
async function fetchData() {
  const response = await fetch("/api/data");
  const data = await response.json();
  return data;
}

// ...is equivalent to this:
function fetchData() {
  return fetch("/api/data")
    .then((response) => response.json())
    .then((data) => data);
}
```

**Key Points:**

1. `async` function always returns a Promise
2. `await` pauses execution until Promise settles
3. `await` can only be used inside `async` functions
4. Errors can be caught with try/catch

**Example:**

```javascript
async function example() {
  return "Hello"; // Implicitly wrapped in Promise.resolve()
}

example().then(console.log); // 'Hello'

// Equivalent to:
function example() {
  return Promise.resolve("Hello");
}
```

---

### Q8: How do you handle errors in async/await?

**Answer:**

**Using try/catch:**

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error; // Re-throw or handle
  }
}
```

**Multiple try/catch blocks:**

```javascript
async function complexOperation() {
  let user, posts;

  try {
    user = await fetchUser();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    user = getDefaultUser();
  }

  try {
    posts = await fetchPosts(user.id);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    posts = [];
  }

  return { user, posts };
}
```

**Using .catch() on await:**

```javascript
async function fetchData() {
  const data = await fetch("/api/data").catch((error) => {
    console.error("Fetch failed:", error);
    return null;
  });

  if (!data) {
    // Handle null case
  }
}
```

**Wrapper function for error handling:**

```javascript
function asyncHandler(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// Usage in Express
app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
  })
);
```

---

### Q9: How do you handle parallel async operations with async/await?

**Answer:**

**Sequential (slow):**

```javascript
async function sequential() {
  const user = await fetchUser(); // Wait 1 second
  const posts = await fetchPosts(); // Wait 1 second
  const comments = await fetchComments(); // Wait 1 second
  // Total: 3 seconds
  return { user, posts, comments };
}
```

**Parallel (fast):**

```javascript
async function parallel() {
  // Start all requests simultaneously
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  const commentsPromise = fetchComments();

  // Wait for all to complete
  const user = await userPromise;
  const posts = await postsPromise;
  const comments = await commentsPromise;
  // Total: 1 second (all parallel)

  return { user, posts, comments };
}

// Or using Promise.all
async function parallelWithPromiseAll() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  // Total: 1 second
  return { user, posts, comments };
}
```

**Conditional parallel:**

```javascript
async function conditionalParallel(userId) {
  // First fetch user
  const user = await fetchUser(userId);

  // Then fetch posts and comments in parallel
  const [posts, comments] = await Promise.all([
    fetchPosts(user.id),
    fetchComments(user.id),
  ]);

  return { user, posts, comments };
}
```

**Parallel with error handling:**

```javascript
async function parallelWithErrorHandling() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);

  const [userResult, postsResult, commentsResult] = results;

  return {
    user: userResult.status === "fulfilled" ? userResult.value : null,
    posts: postsResult.status === "fulfilled" ? postsResult.value : [],
    comments: commentsResult.status === "fulfilled" ? commentsResult.value : [],
  };
}
```

---

## Error Handling

### Q10: What happens to unhandled promise rejections?

**Answer:**

**Unhandled Promise Rejections:**

```javascript
// BAD: Unhandled rejection
const promise = Promise.reject(new Error("Oops!"));
// This will cause an unhandled rejection warning

// GOOD: Handled rejection
const promise = Promise.reject(new Error("Oops!")).catch((error) =>
  console.error(error)
);
```

**In Node.js:**

- Unhandled rejections emit a warning
- In future versions, will terminate the process
- Use `process.on('unhandledRejection')` to catch

```javascript
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

// Example that triggers handler
Promise.reject(new Error("This will be caught by the handler"));
```

**Best Practices:**

```javascript
// Always handle promise rejections
async function safeOperation() {
  try {
    await riskyOperation();
  } catch (error) {
    // Handle error
  }
}

// Or use .catch()
riskyOperation().catch((error) => {
  // Handle error
});

// For Express routes
app.get("/api/data", async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

---

### Q11: How do you implement retry logic with async/await?

**Answer:**

**Basic Retry:**

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Usage
const data = await retry(() => fetchData(), 3, 2000);
```

**Exponential Backoff:**

```javascript
async function retryWithBackoff(fn, maxAttempts = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, waiting ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Retry with specific error types
async function retryOnSpecificError(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const shouldRetry =
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNRESET" ||
        error.status === 503;

      if (!shouldRetry || attempt === maxAttempts) {
        throw error;
      }

      console.log(`Retriable error, attempt ${attempt}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

---

## Performance

### Q12: How do you avoid blocking the event loop?

**Answer:**

**Problem: Blocking code**

```javascript
// BAD: Blocks event loop
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/fib/:n", (req, res) => {
  const result = fibonacci(req.params.n); // Blocks!
  res.json({ result });
});
```

**Solution 1: Break up work with setImmediate**

```javascript
function fibonacci(n, callback) {
  if (n <= 1) {
    return setImmediate(() => callback(null, n));
  }

  fibonacci(n - 1, (err, val1) => {
    if (err) return callback(err);
    fibonacci(n - 2, (err, val2) => {
      if (err) return callback(err);
      callback(null, val1 + val2);
    });
  });
}
```

**Solution 2: Use Worker Threads**

```javascript
const { Worker } = require("worker_threads");

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./fibonacci-worker.js", { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

app.get("/fib/:n", async (req, res) => {
  const result = await runWorker(req.params.n);
  res.json({ result });
});
```

**Solution 3: Use async/await with batching**

```javascript
async function processLargeArray(array) {
  const batchSize = 100;
  const results = [];

  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item) => processItem(item))
    );
    results.push(...batchResults);

    // Give event loop a chance to process other events
    await new Promise((resolve) => setImmediate(resolve));
  }

  return results;
}
```

**Best Practices:**

- Use async I/O operations
- Offload CPU-intensive tasks to worker threads
- Break up large operations
- Use streams for large data
- Profile and monitor event loop lag

---

This covers asynchronous programming in Node.js. Master these concepts for your interview!

