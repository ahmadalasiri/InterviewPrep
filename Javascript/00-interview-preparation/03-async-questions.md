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

### Q9: What is the difference between Observable and Promise?

**Answer:**

**Observables** and **Promises** are both used for handling asynchronous operations, but they have fundamental differences.

**Key Differences:**

| Feature | Promise | Observable |
|---------|---------|------------|
| **Execution** | Eager (executes immediately) | Lazy (executes when subscribed) |
| **Values** | Single value or error | Multiple values over time |
| **Data Handling** | All data at once (bulk) | Stream of data (progressive) |
| **Cancellation** | Cannot be cancelled | Can be unsubscribed/cancelled |
| **Operators** | Limited (then, catch, finally) | Rich set of operators (map, filter, etc.) |
| **Re-execution** | Not reusable, caches result | Reusable, creates new execution |

**1. Eager vs Lazy Execution:**

```javascript
// Promise - Executes immediately
const promise = new Promise((resolve) => {
  console.log('Promise executor runs immediately');
  setTimeout(() => resolve('Done'), 1000);
});
// Logs "Promise executor runs immediately" right away

console.log('After promise creation');
// Even without calling .then(), the promise has already started

// Observable - Lazy execution
import { Observable } from 'rxjs';

const observable = new Observable((subscriber) => {
  console.log('Observable executor runs only when subscribed');
  setTimeout(() => {
    subscriber.next('Done');
    subscriber.complete();
  }, 1000);
});

console.log('After observable creation');
// Nothing logged yet

observable.subscribe(value => console.log(value));
// Now logs "Observable executor runs only when subscribed"
```

**2. Single vs Multiple Values (All Data at Once vs Stream):**

```javascript
// Promise - Returns ALL data at once (bulk)
const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve([1, 2, 3, 4, 5]); // Returns entire array at once
  }, 1000);
});

promise.then(data => {
  console.log('Received all data:', data); // [1, 2, 3, 4, 5]
  // Must wait for ALL data before processing
});

// Observable - Streams data progressively
import { Observable } from 'rxjs';

const observable = new Observable((subscriber) => {
  subscriber.next(1); // Emit first value
  setTimeout(() => subscriber.next(2), 100);
  setTimeout(() => subscriber.next(3), 200);
  setTimeout(() => subscriber.next(4), 300);
  setTimeout(() => subscriber.next(5), 400);
  setTimeout(() => subscriber.complete(), 500);
});

observable.subscribe(value => {
  console.log('Received:', value); // Processes each value as it arrives
  // Can process data progressively without waiting for all
});
// Logs: 1, 2, 3, 4, 5 (one by one)

// Promise - Single resolution only
const singlePromise = new Promise((resolve) => {
  resolve(1);
  resolve(2); // Ignored
  resolve(3); // Ignored
});

singlePromise.then(value => console.log(value)); // Only logs: 1
```

**3. Cancellation:**

```javascript
// Promise - Cannot be cancelled
const promise = fetch('/api/data');
// No way to cancel this request
promise.then(data => console.log(data));

// Observable - Can be cancelled
import { fromFetch } from 'rxjs/fetch';

const observable = fromFetch('/api/data');
const subscription = observable.subscribe(response => console.log(response));

// Cancel the request
subscription.unsubscribe();
```

**4. Operators:**

```javascript
// Promise - Basic chaining
fetch('/api/users')
  .then(response => response.json())
  .then(users => users.filter(u => u.active))
  .then(activeUsers => console.log(activeUsers))
  .catch(error => console.error(error));

// Observable - Rich operators
import { from } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';

from(fetch('/api/users'))
  .pipe(
    map(response => response.json()),
    filter(user => user.active),
    map(user => user.name),
    catchError(error => {
      console.error(error);
      return of([]);
    })
  )
  .subscribe(names => console.log(names));
```

**5. Re-execution:**

```javascript
// Promise - Caches result
const promise = fetch('/api/data');

promise.then(data => console.log('First:', data));
promise.then(data => console.log('Second:', data));
// Only makes ONE request, result is cached

// Observable - Creates new execution
import { from } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const observable = ajax('/api/data');

observable.subscribe(data => console.log('First:', data));
observable.subscribe(data => console.log('Second:', data));
// Makes TWO separate requests
```

**6. Real-world Examples (Bulk vs Stream):**

```javascript
// Promise - Fetch ALL users at once (bulk data)
async function fetchAllUsers() {
  const response = await fetch('/api/users');
  const users = await response.json(); // Wait for ALL users
  console.log(`Received ${users.length} users at once`);
  return users; // Returns complete array
}

// Must wait for entire response before processing
fetchAllUsers().then(users => {
  users.forEach(user => displayUser(user)); // Display all at once
});

// Observable - Stream users progressively
import { Observable } from 'rxjs';

function streamUsers() {
  return new Observable((subscriber) => {
    fetch('/api/users')
      .then(response => response.json())
      .then(users => {
        // Emit users one by one (progressive)
        users.forEach((user, index) => {
          setTimeout(() => {
            subscriber.next(user); // Stream each user
          }, index * 100); // Progressive delivery
        });
        subscriber.complete();
      });
  });
}

// Process each user as it arrives (stream)
streamUsers().subscribe(user => {
  displayUser(user); // Display each user immediately
  console.log('Streamed user:', user.name);
});

// Promise - Download entire file at once
async function downloadFile(url) {
  const response = await fetch(url);
  const blob = await response.blob(); // Wait for ENTIRE file
  console.log('Complete file downloaded:', blob.size, 'bytes');
  return blob;
}

// Observable - Stream file download with progress
import { ajax } from 'rxjs/ajax';

function downloadFileWithProgress(url) {
  return new Observable((subscriber) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    
    // Progressive download updates
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        subscriber.next({ type: 'progress', value: progress });
      }
    };
    
    xhr.onload = () => {
      subscriber.next({ type: 'complete', data: xhr.response });
      subscriber.complete();
    };
    
    xhr.send();
  });
}

downloadFileWithProgress('/large-file.zip').subscribe(event => {
  if (event.type === 'progress') {
    console.log(`Downloaded: ${event.value.toFixed(2)}%`); // Stream progress
  } else {
    console.log('Download complete!');
  }
});

// Observable - Search input with debounce (stream of events)
import { fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

const searchInput = document.getElementById('search');
const search$ = fromEvent(searchInput, 'input').pipe(
  map(event => event.target.value),
  debounceTime(300),
  distinctUntilChanged()
);

// Receives search term as user types (stream)
search$.subscribe(searchTerm => {
  console.log('Search for:', searchTerm);
  // Perform search progressively
});
```

**7. Converting between Promise and Observable:**

```javascript
// Promise to Observable
import { from } from 'rxjs';

const promise = fetch('/api/data');
const observable = from(promise);

observable.subscribe(
  data => console.log(data),
  error => console.error(error)
);

// Observable to Promise
import { firstValueFrom, lastValueFrom } from 'rxjs';

const observable = from([1, 2, 3]);

// Get first value
firstValueFrom(observable).then(value => console.log(value)); // 1

// Get last value
lastValueFrom(observable).then(value => console.log(value)); // 3
```

**When to Use:**

**Use Promises when:**
- Single async operation
- Simple HTTP requests
- Working with async/await
- Browser native support needed

**Use Observables when:**
- Multiple values over time
- Cancellable operations
- Complex async workflows
- Need powerful operators
- Event streams
- WebSocket/SSE connections

**Summary:**
- **Promise**: Single value, eager, not cancellable, built-in to JavaScript
- **Observable**: Multiple values, lazy, cancellable, requires library (RxJS)

---

### Q10: How do you create an Observable from scratch?

**Answer:**

Creating an **Observable from scratch** uses the Observable constructor and implements the subscription logic.

**Basic Observable Creation:**

```javascript
import { Observable } from 'rxjs';

// Simple observable
const myObservable = new Observable((subscriber) => {
  // Emit values
  subscriber.next('First value');
  subscriber.next('Second value');
  subscriber.next('Third value');
  
  // Complete the observable
  subscriber.complete();
  
  // Optional: Return cleanup function
  return () => {
    console.log('Cleanup: Observable unsubscribed');
  };
});

// Subscribe to the observable
const subscription = myObservable.subscribe({
  next: (value) => console.log('Received:', value),
  complete: () => console.log('Observable completed'),
  error: (err) => console.error('Error:', err)
});

// Output:
// Received: First value
// Received: Second value
// Received: Third value
// Observable completed
```

**Observable with Async Operations:**

```javascript
// Simulating async data fetching
const asyncObservable = new Observable((subscriber) => {
  console.log('Observable started');
  
  // Simulate async operation
  setTimeout(() => {
    subscriber.next('Data after 1 second');
  }, 1000);
  
  setTimeout(() => {
    subscriber.next('Data after 2 seconds');
  }, 2000);
  
  setTimeout(() => {
    subscriber.next('Data after 3 seconds');
    subscriber.complete();
  }, 3000);
  
  // Cleanup function
  return () => {
    console.log('Cleanup: Timers cleared');
  };
});

// Subscribe
const subscription = asyncObservable.subscribe({
  next: (data) => console.log(data),
  complete: () => console.log('Done!')
});

// Unsubscribe before completion
setTimeout(() => {
  subscription.unsubscribe(); // Triggers cleanup
}, 2500);
```

**Error Handling in Observables:**

```javascript
const observableWithError = new Observable((subscriber) => {
  subscriber.next('Value 1');
  subscriber.next('Value 2');
  
  // Emit an error
  subscriber.error(new Error('Something went wrong!'));
  
  // This won't be emitted after error
  subscriber.next('Value 3');
  subscriber.complete();
});

observableWithError.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error('Error caught:', err.message),
  complete: () => console.log('Completed')
});

// Output:
// Value 1
// Value 2
// Error caught: Something went wrong!
```

**Real-world Examples:**

**1. DOM Event Observable:**

```javascript
// Convert DOM events to Observable
function fromEvent(element, eventName) {
  return new Observable((subscriber) => {
    const handler = (event) => {
      subscriber.next(event);
    };
    
    element.addEventListener(eventName, handler);
    
    // Cleanup: Remove event listener
    return () => {
      element.removeEventListener(eventName, handler);
    };
  });
}

// Usage
const button = document.getElementById('myButton');
const clicks$ = fromEvent(button, 'click');

const subscription = clicks$.subscribe({
  next: (event) => console.log('Button clicked!', event)
});

// Unsubscribe to stop listening
// subscription.unsubscribe();
```

**2. Interval Observable:**

```javascript
function interval(period) {
  return new Observable((subscriber) => {
    let count = 0;
    
    const intervalId = setInterval(() => {
      subscriber.next(count++);
    }, period);
    
    // Cleanup: Clear interval
    return () => {
      clearInterval(intervalId);
      console.log('Interval cleared');
    };
  });
}

// Usage
const numbers$ = interval(1000);

const subscription = numbers$.subscribe({
  next: (num) => console.log('Count:', num)
});

// Stop after 5 seconds
setTimeout(() => {
  subscription.unsubscribe();
}, 5000);

// Output:
// Count: 0
// Count: 1
// Count: 2
// Count: 3
// Count: 4
// Interval cleared
```

**3. AJAX Observable:**

```javascript
function ajax(url) {
  return new Observable((subscriber) => {
    const xhr = new XMLHttpRequest();
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        subscriber.next(JSON.parse(xhr.responseText));
        subscriber.complete();
      } else {
        subscriber.error(new Error(`HTTP Error: ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => {
      subscriber.error(new Error('Network error'));
    };
    
    xhr.open('GET', url);
    xhr.send();
    
    // Cleanup: Abort request if unsubscribed
    return () => {
      xhr.abort();
      console.log('Request aborted');
    };
  });
}

// Usage
const data$ = ajax('https://api.example.com/data');

const subscription = data$.subscribe({
  next: (data) => console.log('Data received:', data),
  error: (err) => console.error('Error:', err.message),
  complete: () => console.log('Request completed')
});

// Cancel request if needed
// subscription.unsubscribe();
```

**4. WebSocket Observable:**

```javascript
function websocket(url) {
  return new Observable((subscriber) => {
    const socket = new WebSocket(url);
    
    socket.onopen = () => {
      subscriber.next({ type: 'open' });
    };
    
    socket.onmessage = (event) => {
      subscriber.next({ type: 'message', data: event.data });
    };
    
    socket.onerror = (error) => {
      subscriber.error(error);
    };
    
    socket.onclose = () => {
      subscriber.complete();
    };
    
    // Cleanup: Close socket
    return () => {
      socket.close();
      console.log('WebSocket closed');
    };
  });
}

// Usage
const messages$ = websocket('ws://localhost:8080');

messages$.subscribe({
  next: (event) => {
    if (event.type === 'message') {
      console.log('Received:', event.data);
    }
  },
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Connection closed')
});
```

**5. Custom Timer Observable:**

```javascript
function timer(delay) {
  return new Observable((subscriber) => {
    const timeoutId = setTimeout(() => {
      subscriber.next(0);
      subscriber.complete();
    }, delay);
    
    // Cleanup: Clear timeout
    return () => {
      clearTimeout(timeoutId);
      console.log('Timer cancelled');
    };
  });
}

// Usage
const delayed$ = timer(3000);

delayed$.subscribe({
  next: (value) => console.log('Timer fired!', value),
  complete: () => console.log('Timer complete')
});

// Output after 3 seconds:
// Timer fired! 0
// Timer complete
```

**Important Points:**

1. **Always handle cleanup** - Return a function that cleans up resources
2. **Don't emit after complete/error** - Once completed or errored, no more emissions
3. **Handle unsubscription** - Make observables cancellable
4. **Error handling** - Use `subscriber.error()` for errors
5. **Complete when done** - Call `subscriber.complete()` to signal completion

**Comparison with Creating Promises:**

```javascript
// Promise - Eager, executes immediately
const promise = new Promise((resolve, reject) => {
  console.log('Promise executor runs immediately');
  setTimeout(() => resolve('Done'), 1000);
});

// Observable - Lazy, executes on subscription
const observable = new Observable((subscriber) => {
  console.log('Observable executor runs on subscription');
  setTimeout(() => {
    subscriber.next('Done');
    subscriber.complete();
  }, 1000);
});

// Promise starts immediately (before then())
promise.then(value => console.log(value));

// Observable doesn't start until subscribed
observable.subscribe(value => console.log(value));
```

---

### Q11: What is the difference between eager and lazy loading?

**Answer:**

**Eager Loading** and **Lazy Loading** are strategies that determine when resources or code are loaded and executed.

**Key Differences:**

| Feature | Eager Loading | Lazy Loading |
|---------|---------------|--------------|
| **When Loaded** | Immediately at startup | When needed/requested |
| **Initial Load Time** | Slower | Faster |
| **Memory Usage** | Higher (everything loaded) | Lower (only what's needed) |
| **Complexity** | Simpler | More complex |
| **Performance** | Better for frequently used code | Better for rarely used code |
| **Use Case** | Core functionality | Optional features |

**JavaScript Module Loading:**

**Eager Loading (Static Imports):**

```javascript
// Loaded immediately when script runs
import React from 'react';
import lodash from 'lodash';
import moment from 'moment';
import charts from 'chart.js';

// All modules loaded even if never used
console.log('All modules loaded');

function Component() {
  // lodash available immediately
  const result = lodash.uniq([1, 2, 2, 3]);
  return <div>{result}</div>;
}
```

**Lazy Loading (Dynamic Imports):**

```javascript
// Nothing loaded initially
console.log('Only core modules loaded');

async function Component() {
  // Load lodash only when this function is called
  const lodash = await import('lodash');
  const result = lodash.default.uniq([1, 2, 2, 3]);
  return result;
}

// Or with then()
function loadCharts() {
  import('chart.js').then(charts => {
    // Use charts only when needed
    const chart = new charts.Chart(/* ... */);
  });
}
```

**React Component Lazy Loading:**

```javascript
// EAGER LOADING
import Home from './components/Home';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
// All components loaded immediately, even if user never visits those routes

// LAZY LOADING
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Profile = lazy(() => import('./components/Profile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
// Each component loaded only when its route is visited
```

**Image Lazy Loading:**

```javascript
// EAGER LOADING - All images load immediately
function Gallery() {
  return (
    <div>
      <img src="image1.jpg" alt="Image 1" />
      <img src="image2.jpg" alt="Image 2" />
      <img src="image3.jpg" alt="Image 3" />
      <img src="image4.jpg" alt="Image 4" />
      {/* All images loaded even if below the fold */}
    </div>
  );
}

// LAZY LOADING - Images load when visible
function Gallery() {
  return (
    <div>
      <img src="image1.jpg" alt="Image 1" loading="lazy" />
      <img src="image2.jpg" alt="Image 2" loading="lazy" />
      <img src="image3.jpg" alt="Image 3" loading="lazy" />
      <img src="image4.jpg" alt="Image 4" loading="lazy" />
      {/* Images loaded only when scrolled into view */}
    </div>
  );
}

// Or with Intersection Observer
function LazyImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setImageSrc(src); // Load image when visible
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(imgRef.current);
    
    return () => observer.disconnect();
  }, [src]);
  
  return <img ref={imgRef} src={imageSrc} alt={alt} />;
}
```

**Data Fetching:**

```javascript
// EAGER LOADING - Fetch all data immediately
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [photos, setPhotos] = useState([]);
  
  useEffect(() => {
    // Fetch everything immediately
    Promise.all([
      fetch(`/api/users/${userId}`).then(r => r.json()),
      fetch(`/api/users/${userId}/posts`).then(r => r.json()),
      fetch(`/api/users/${userId}/friends`).then(r => r.json()),
      fetch(`/api/users/${userId}/photos`).then(r => r.json())
    ]).then(([userData, postsData, friendsData, photosData]) => {
      setUser(userData);
      setPosts(postsData);
      setFriends(friendsData);
      setPhotos(photosData);
    });
  }, [userId]);
  
  return (
    <div>
      <UserInfo user={user} />
      <PostsList posts={posts} />
      <FriendsList friends={friends} />
      <PhotoGallery photos={photos} />
    </div>
  );
}

// LAZY LOADING - Fetch data only when components are viewed
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  
  useEffect(() => {
    // Only fetch user info initially
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);
  
  return (
    <div>
      <UserInfo user={user} />
      <Tabs onChange={setActiveTab}>
        <Tab name="info">User Info</Tab>
        <Tab name="posts">
          {activeTab === 'posts' && <PostsList userId={userId} />}
        </Tab>
        <Tab name="friends">
          {activeTab === 'friends' && <FriendsList userId={userId} />}
        </Tab>
        <Tab name="photos">
          {activeTab === 'photos' && <PhotoGallery userId={userId} />}
        </Tab>
      </Tabs>
    </div>
  );
}

// Each component fetches its own data when rendered
function PostsList({ userId }) {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch(`/api/users/${userId}/posts`)
      .then(r => r.json())
      .then(setPosts);
  }, [userId]);
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}
```

**Script Loading:**

```javascript
// EAGER LOADING - Load all scripts upfront
<!DOCTYPE html>
<html>
<head>
  <script src="jquery.js"></script>
  <script src="bootstrap.js"></script>
  <script src="charts.js"></script>
  <script src="analytics.js"></script>
  <script src="editor.js"></script>
  <!-- All scripts loaded even if never used -->
</head>
<body>
  <!-- Content -->
</body>
</html>

// LAZY LOADING - Load scripts when needed
<!DOCTYPE html>
<html>
<head>
  <script src="main.js"></script>
</head>
<body>
  <button id="openEditor">Open Editor</button>
  
  <script>
    document.getElementById('openEditor').addEventListener('click', () => {
      // Load editor script only when button is clicked
      const script = document.createElement('script');
      script.src = 'editor.js';
      script.onload = () => {
        initializeEditor();
      };
      document.head.appendChild(script);
    });
  </script>
</body>
</html>
```

**Webpack Code Splitting:**

```javascript
// EAGER LOADING - Bundle everything together
import { heavyLibrary } from './heavy-library';
import { charts } from './charts';
import { analytics } from './analytics';

// All code in one bundle

// LAZY LOADING - Split into chunks
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};

// Dynamic import creates separate chunks
button.addEventListener('click', async () => {
  const { heavyLibrary } = await import(/* webpackChunkName: "heavy" */ './heavy-library');
  heavyLibrary.doSomething();
});
```

**When to Use:**

**Use Eager Loading when:**
- ✅ Resources are small
- ✅ Resources are critical
- ✅ Resources are always needed
- ✅ User experience benefits from immediate availability
- ✅ Simpler code is preferred

**Use Lazy Loading when:**
- ✅ Resources are large
- ✅ Resources are optional
- ✅ Resources are rarely used
- ✅ Initial load time is critical
- ✅ Resources are route-specific
- ✅ Mobile performance is important

**Performance Impact:**

```javascript
// Eager Loading
// Initial bundle: 500KB
// Time to interactive: 3 seconds
// Memory usage: High
// User experience: Slow initial load, fast subsequent interactions

// Lazy Loading
// Initial bundle: 100KB
// Time to interactive: 0.8 seconds
// Memory usage: Low initially, grows as needed
// User experience: Fast initial load, slight delay on feature access
```

**Summary:**
- **Eager Loading**: Load everything upfront - simpler but slower initial load
- **Lazy Loading**: Load on demand - faster initial load but more complex implementation
- Choose based on resource size, usage frequency, and performance requirements

---

This covers async programming interview questions. Practice these concepts thoroughly!

