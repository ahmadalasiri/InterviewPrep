# Asynchronous Programming Interview Questions

## Table of Contents

- [Event Loop](#event-loop)
- [Callbacks](#callbacks)
- [Promises](#promises)
- [Async/Await](#asyncawait)
- [Error Handling](#error-handling)

---

## Event Loop

### Q1: Explain the JavaScript Event Loop

**Answer:**
The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.

**Components:**

1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Handle async operations (setTimeout, fetch, etc.)
3. **Callback Queue** (Macrotask Queue): Holds callbacks from async operations
4. **Microtask Queue**: Holds promise callbacks, higher priority
5. **Event Loop**: Moves tasks from queues to call stack

**Execution Order:**

```javascript
console.log('1'); // Call stack

setTimeout(() => {
  console.log('2'); // Macrotask queue
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask queue
});

console.log('4'); // Call stack

// Output: 1, 4, 3, 2
// Synchronous first, then microtasks, then macrotasks
```

**Detailed Example:**

```javascript
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve().then(() => {
  console.log('Promise 3');
  setTimeout(() => console.log('Timeout 3'), 0);
});

console.log('End');

/* Output:
Start
End
Promise 1
Promise 3
Promise 2
Timeout 1
Timeout 2
Timeout 3
*/
```

---

## Callbacks

### Q2: What is callback hell and how can it be avoided?

**Answer:**
Callback hell (pyramid of doom) occurs when callbacks are nested within callbacks, making code hard to read and maintain.

**Example of Callback Hell:**

```javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        getMoreData(d, function(e) {
          console.log(e);
        });
      });
    });
  });
});
```

**Solutions:**

**1. Use Promises:**

```javascript
getData()
  .then(a => getMoreData(a))
  .then(b => getMoreData(b))
  .then(c => getMoreData(c))
  .then(d => getMoreData(d))
  .then(e => console.log(e))
  .catch(err => console.error(err));
```

**2. Use Async/Await:**

```javascript
async function processData() {
  try {
    const a = await getData();
    const b = await getMoreData(a);
    const c = await getMoreData(b);
    const d = await getMoreData(c);
    const e = await getMoreData(d);
    console.log(e);
  } catch (err) {
    console.error(err);
  }
}
```

**3. Modularize Code:**

```javascript
function step1(data) {
  return getMoreData(data);
}

function step2(data) {
  return getMoreData(data);
}

getData()
  .then(step1)
  .then(step2)
  .catch(handleError);
```

---

## Promises

### Q3: Explain Promises and their states

**Answer:**
A Promise is an object representing the eventual completion or failure of an asynchronous operation.

**States:**

1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

Once settled (fulfilled or rejected), a promise cannot change state.

**Creating Promises:**

```javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  
  setTimeout(() => {
    if (success) {
      resolve({ data: 'Success!' });
    } else {
      reject(new Error('Failed!'));
    }
  }, 1000);
});

// Using the promise
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Cleanup'));
```

**Promise Chaining:**

```javascript
fetchUser()
  .then(user => {
    console.log('User:', user);
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log('Posts:', posts);
    return fetchComments(posts[0].id);
  })
  .then(comments => {
    console.log('Comments:', comments);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

---

### Q4: What are Promise.all, Promise.race, Promise.allSettled, and Promise.any?

**Answer:**

**Promise.all:**
- Waits for all promises to fulfill
- Rejects if any promise rejects
- Returns array of results

```javascript
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => console.log(results)) // [1, 2, 3]
  .catch(error => console.error(error));

// If any rejects
Promise.all([
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3)
])
  .catch(error => console.error(error)); // 'Error'
```

**Promise.race:**
- Returns first promise to settle (fulfill or reject)

```javascript
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('fast'), 100)),
  new Promise(resolve => setTimeout(() => resolve('slow'), 500))
])
  .then(result => console.log(result)); // 'fast'
```

**Promise.allSettled:**
- Waits for all promises to settle
- Never rejects
- Returns array of results with status

```javascript
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3)
])
  .then(results => console.log(results));
/* [
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'Error' },
  { status: 'fulfilled', value: 3 }
] */
```

**Promise.any:**
- Returns first promise to fulfill
- Rejects only if all promises reject

```javascript
Promise.any([
  Promise.reject('Error 1'),
  Promise.resolve('Success'),
  Promise.reject('Error 2')
])
  .then(result => console.log(result)); // 'Success'
```

---

## Async/Await

### Q5: How does async/await work?

**Answer:**
Async/await is syntactic sugar built on promises, making asynchronous code look synchronous.

**Basic Usage:**

```javascript
// async function always returns a promise
async function fetchData() {
  return 'data'; // Automatically wrapped in Promise.resolve()
}

fetchData().then(data => console.log(data)); // 'data'

// await pauses execution until promise settles
async function getData() {
  const data = await fetchData(); // Waits for promise
  console.log(data);
  return data;
}
```

**Error Handling:**

```javascript
async function fetchUser() {
  try {
    const response = await fetch('/api/user');
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw or handle
  }
}
```

**Parallel vs Sequential:**

```javascript
// Sequential (slow - 3 seconds total)
async function sequential() {
  const user = await fetchUser();      // 1 second
  const posts = await fetchPosts();    // 1 second
  const comments = await fetchComments(); // 1 second
  return { user, posts, comments };
}

// Parallel (fast - 1 second total)
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}

// Parallel with error handling
async function parallelSafe() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(result.reason);
      return null;
    }
  });
}
```

---

### Q6: What are common async/await pitfalls?

**Answer:**

**1. Forgetting await:**

```javascript
// Wrong
async function wrong() {
  const data = fetchData(); // Returns promise, not data
  console.log(data); // Promise { <pending> }
}

// Correct
async function correct() {
  const data = await fetchData();
  console.log(data); // Actual data
}
```

**2. Sequential when parallel is possible:**

```javascript
// Slow (2 seconds)
async function slow() {
  const a = await fetchA(); // 1 second
  const b = await fetchB(); // 1 second
  return [a, b];
}

// Fast (1 second)
async function fast() {
  const [a, b] = await Promise.all([
    fetchA(),
    fetchB()
  ]);
  return [a, b];
}
```

**3. Not handling errors:**

```javascript
// Unhandled rejection
async function bad() {
  await mightFail(); // If this throws, unhandled rejection
}

// Proper error handling
async function good() {
  try {
    await mightFail();
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**4. Using await in loops incorrectly:**

```javascript
// Sequential (slow)
async function processItemsSlow(items) {
  const results = [];
  for (const item of items) {
    results.push(await processItem(item)); // One at a time
  }
  return results;
}

// Parallel (fast)
async function processItemsFast(items) {
  return Promise.all(items.map(item => processItem(item)));
}
```

---

## Error Handling

### Q7: How to handle errors in async code?

**Answer:**

**Promises:**

```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
  .finally(() => console.log('Cleanup'));
```

**Async/Await:**

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw or return default
  } finally {
    console.log('Cleanup');
  }
}
```

**Multiple Error Handlers:**

```javascript
async function robustFetch() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Network error');
    } else if (error.message.includes('HTTP error')) {
      console.error('Server error');
    } else {
      console.error('Unknown error');
    }
    throw error;
  }
}
```

**Global Error Handlers:**

```javascript
// Unhandled Promise Rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled rejection:', event.reason);
  event.preventDefault();
});

// Uncaught Errors
window.addEventListener('error', event => {
  console.error('Uncaught error:', event.error);
});
```

---

## Practice Questions

### Q8: What will be the output?

```javascript
async function test() {
  console.log('1');
  
  await new Promise(resolve => {
    console.log('2');
    resolve();
  });
  
  console.log('3');
}

console.log('4');
test();
console.log('5');
```

**Answer:**
```
4
1
2
5
3
```

**Explanation:**
- `4` - Synchronous
- `1` - Function starts (synchronous part)
- `2` - Promise executor (synchronous)
- `5` - Continues synchronous execution
- `3` - Microtask (after synchronous code)

---

This covers async programming interview questions. Practice these concepts thoroughly!

