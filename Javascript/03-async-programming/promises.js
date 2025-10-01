// Promises in JavaScript

console.log("=== Promises ===\n");

// 1. Creating a Promise
console.log("--- Creating Promises ---");

const simplePromise = new Promise((resolve, reject) => {
  const success = true;
  
  setTimeout(() => {
    if (success) {
      resolve({ data: 'Success!' });
    } else {
      reject(new Error('Failed!'));
    }
  }, 1000);
});

// 2. Consuming Promises
console.log("--- Consuming Promises ---");

simplePromise
  .then(result => {
    console.log("Result:", result);
    return result.data;
  })
  .then(data => {
    console.log("Data:", data);
  })
  .catch(error => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Cleanup");
  });

// 3. Promise Chaining
console.log("\n--- Promise Chaining ---");

function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id: 1, name: 'John' }), 100);
  });
}

function fetchPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' }
    ]), 100);
  });
}

fetchUser()
  .then(user => {
    console.log("User:", user.name);
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log("Posts:", posts.length);
  })
  .catch(error => console.error(error));

// 4. Promise.all
console.log("\n--- Promise.all ---");

const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log("All results:", results); // [1, 2, 3]
  });

// 5. Promise.race
console.log("\n--- Promise.race ---");

const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 500));
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100));

Promise.race([slow, fast])
  .then(result => {
    console.log("First to complete:", result); // 'fast'
  });

// 6. Promise.allSettled
console.log("\n--- Promise.allSettled ---");

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3)
])
  .then(results => {
    console.log("All settled:", results);
  });

// 7. Practical Example
console.log("\n--- Practical Example ---");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function retryOperation(operation, maxAttempts = 3) {
  return new Promise((resolve, reject) => {
    function attempt(attemptNumber) {
      operation()
        .then(resolve)
        .catch(error => {
          if (attemptNumber < maxAttempts) {
            console.log(`Attempt ${attemptNumber} failed, retrying...`);
            delay(1000).then(() => attempt(attemptNumber + 1));
          } else {
            reject(error);
          }
        });
    }
    attempt(1);
  });
}

console.log("\n--- Summary ---");
console.log("✓ Promises represent eventual completion of async operations");
console.log("✓ Three states: pending, fulfilled, rejected");
console.log("✓ Use then(), catch(), finally() for handling");
console.log("✓ Chain promises for sequential operations");
console.log("✓ Use Promise.all() for parallel operations");

