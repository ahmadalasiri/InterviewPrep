// Promises in Node.js

console.log("=== Promises in Node.js ===\n");

// 1. Creating a Promise
console.log("--- Creating Promises ---");

const simplePromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Promise resolved successfully!");
  } else {
    reject(new Error("Promise rejected!"));
  }
});

simplePromise
  .then((result) => console.log("Result:", result))
  .catch((error) => console.error("Error:", error));

// 2. Promise with Async Operation
console.log("\n--- Promise with Async Operation ---");

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "John Doe", email: "john@example.com" });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 1000);
  });
}

fetchUser(1)
  .then((user) => {
    console.log("Fetched user:", user);
    return user;
  })
  .catch((error) => {
    console.error("Error fetching user:", error.message);
  });

// 3. Promise Chaining
console.log("\n--- Promise Chaining ---");

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1", userId },
        { id: 2, title: "Post 2", userId },
      ]);
    }, 500);
  });
}

function fetchPostComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Great post!", postId },
        { id: 2, text: "Thanks for sharing", postId },
      ]);
    }, 500);
  });
}

// Chaining promises
fetchUser(1)
  .then((user) => {
    console.log("\nStep 1 - User:", user.name);
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    console.log("Step 2 - Posts:", posts.length, "posts");
    return fetchPostComments(posts[0].id);
  })
  .then((comments) => {
    console.log("Step 3 - Comments:", comments.length, "comments");
  })
  .catch((error) => {
    console.error("Chain error:", error);
  })
  .finally(() => {
    console.log("Promise chain completed");
  });

// 4. Promise.all - Wait for all promises
console.log("\n--- Promise.all ---");

const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve("foo"), 1000)
);
const promise3 = new Promise((resolve) =>
  setTimeout(() => resolve("bar"), 500)
);

Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log("Promise.all results:", values);
  })
  .catch((error) => {
    console.error("Promise.all error:", error);
  });

// Real-world example: Parallel API calls
setTimeout(() => {
  console.log("\n--- Parallel API Calls Example ---");

  Promise.all([fetchUser(1), fetchUser(2), fetchUser(3)])
    .then((users) => {
      console.log(
        "Fetched users:",
        users.map((u) => u.name)
      );
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}, 2500);

// 5. Promise.race - First to complete wins
setTimeout(() => {
  console.log("\n--- Promise.race ---");

  const slow = new Promise((resolve) =>
    setTimeout(() => resolve("slow"), 2000)
  );
  const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 500));

  Promise.race([slow, fast]).then((result) => {
    console.log("Promise.race winner:", result);
  });
}, 3500);

// 6. Promise.allSettled - Wait for all, regardless of outcome
setTimeout(() => {
  console.log("\n--- Promise.allSettled ---");

  const promises = [
    Promise.resolve("Success 1"),
    Promise.reject(new Error("Failure")),
    Promise.resolve("Success 2"),
  ];

  Promise.allSettled(promises).then((results) => {
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`Promise ${index + 1} fulfilled:`, result.value);
      } else {
        console.log(`Promise ${index + 1} rejected:`, result.reason.message);
      }
    });
  });
}, 4500);

// 7. Promise.any - First fulfilled promise wins
setTimeout(() => {
  console.log("\n--- Promise.any ---");

  const promises = [
    Promise.reject(new Error("Error 1")),
    new Promise((resolve) => setTimeout(() => resolve("Success 1"), 500)),
    new Promise((resolve) => setTimeout(() => resolve("Success 2"), 1000)),
  ];

  Promise.any(promises)
    .then((result) => {
      console.log("Promise.any result:", result);
    })
    .catch((error) => {
      console.error("All promises rejected:", error);
    });
}, 5500);

// 8. Error Handling in Promises
setTimeout(() => {
  console.log("\n--- Error Handling ---");

  function riskyOperation(shouldFail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Operation failed!"));
        } else {
          resolve("Operation successful!");
        }
      }, 100);
    });
  }

  // Catching errors
  riskyOperation(true)
    .then((result) => console.log(result))
    .catch((error) => console.error("Caught error:", error.message))
    .finally(() => console.log("Cleanup completed"));

  // Error in promise chain
  Promise.resolve(5)
    .then((value) => {
      console.log("Value:", value);
      throw new Error("Something went wrong!");
    })
    .then((value) => {
      console.log("This will not execute:", value);
    })
    .catch((error) => {
      console.error("Caught in chain:", error.message);
    });
}, 6500);

// 9. Converting Callbacks to Promises
setTimeout(() => {
  console.log("\n--- Converting Callbacks to Promises ---");

  const fs = require("fs");
  const util = require("util");

  // Old callback style
  fs.readFile("package.json", "utf8", (err, data) => {
    if (err) {
      // console.error('Callback error:', err);
      return;
    }
    // console.log('Callback read file');
  });

  // Promisified version
  const readFilePromise = util.promisify(fs.readFile);

  readFilePromise("package.json", "utf8")
    .then((data) => {
      console.log("Promise read file successfully");
    })
    .catch((error) => {
      console.error("Promise error:", error.message);
    });

  // Manual promisification
  function readFileManual(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  readFileManual("package.json")
    .then(() => console.log("Manual promisification worked"))
    .catch((error) => console.error("Manual error:", error.message));
}, 7500);

// 10. Promise Best Practices
setTimeout(() => {
  console.log("\n--- Promise Best Practices ---");

  // Always return promises in chains
  function goodChaining() {
    return fetchUser(1)
      .then((user) => {
        return fetchUserPosts(user.id); // Return the promise
      })
      .then((posts) => {
        console.log("Good chaining - posts:", posts.length);
      });
  }

  // Avoid creating unnecessary promises
  function unnecessaryPromise() {
    return new Promise((resolve) => {
      resolve("value"); // Just use Promise.resolve('value')
    });
  }

  // Better:
  function betterPromise() {
    return Promise.resolve("value");
  }

  // Handle all errors
  fetchUser(1)
    .then((user) => fetchUserPosts(user.id))
    .then((posts) => console.log("Posts fetched"))
    .catch((error) => console.error("Error:", error.message))
    .finally(() => console.log("Always executed"));

  console.log("✓ Always return in promise chains");
  console.log("✓ Use Promise.resolve/reject for immediate values");
  console.log("✓ Always handle errors with .catch()");
  console.log("✓ Use .finally() for cleanup");
}, 8500);

// Keep the script running to see all async operations
setTimeout(() => {
  console.log("\n=== All Promise Examples Completed ===");
}, 10000);

