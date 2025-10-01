// Async/Await in Node.js

console.log("=== Async/Await in Node.js ===\n");

// Helper functions that return promises
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 500);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1", userId },
        { id: 2, title: "Post 2", userId },
      ]);
    }, 500);
  });
}

// 1. Basic Async/Await
console.log("--- Basic Async/Await ---");

async function basicExample() {
  console.log("Before await");
  const user = await fetchUser(1);
  console.log("User fetched:", user.name);
  console.log("After await");
}

basicExample();

// 2. Error Handling with try/catch
setTimeout(async () => {
  console.log("\n--- Error Handling ---");

  async function fetchWithErrorHandling() {
    try {
      const user = await fetchUser(-1); // Will fail
      console.log("User:", user);
    } catch (error) {
      console.error("Caught error:", error.message);
    } finally {
      console.log("Cleanup completed");
    }
  }

  await fetchWithErrorHandling();
}, 1000);

// 3. Sequential vs Parallel Execution
setTimeout(async () => {
  console.log("\n--- Sequential vs Parallel ---");

  // Sequential (slower)
  async function sequential() {
    console.time("Sequential");
    const user1 = await fetchUser(1); // Wait 500ms
    const user2 = await fetchUser(2); // Wait another 500ms
    const user3 = await fetchUser(3); // Wait another 500ms
    console.timeEnd("Sequential"); // ~1500ms
    return [user1, user2, user3];
  }

  // Parallel (faster)
  async function parallel() {
    console.time("Parallel");
    const [user1, user2, user3] = await Promise.all([
      fetchUser(1),
      fetchUser(2),
      fetchUser(3),
    ]); // All execute simultaneously
    console.timeEnd("Parallel"); // ~500ms
    return [user1, user2, user3];
  }

  await sequential();
  await parallel();
}, 2000);

// 4. Chaining Async Operations
setTimeout(async () => {
  console.log("\n--- Chaining Async Operations ---");

  async function fetchUserData(userId) {
    try {
      // Step 1: Fetch user
      const user = await fetchUser(userId);
      console.log("Fetched user:", user.name);

      // Step 2: Fetch user's posts
      const posts = await fetchPosts(user.id);
      console.log("Fetched posts:", posts.length, "posts");

      // Step 3: Return combined data
      return {
        user,
        posts,
      };
    } catch (error) {
      console.error("Error in chain:", error.message);
      throw error;
    }
  }

  const userData = await fetchUserData(1);
  console.log("Complete user data:", userData);
}, 4000);

// 5. Async/Await with Promise.all
setTimeout(async () => {
  console.log("\n--- Parallel Promises with Async/Await ---");

  async function fetchMultipleUsers() {
    try {
      const users = await Promise.all([
        fetchUser(1),
        fetchUser(2),
        fetchUser(3),
      ]);
      console.log(
        "Fetched users:",
        users.map((u) => u.name)
      );
      return users;
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  }

  await fetchMultipleUsers();
}, 5500);

// 6. Async/Await with Promise.allSettled
setTimeout(async () => {
  console.log("\n--- Promise.allSettled with Async/Await ---");

  async function fetchWithPartialFailure() {
    const results = await Promise.allSettled([
      fetchUser(1),
      fetchUser(-1), // This will fail
      fetchUser(2),
    ]);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`User ${index + 1}:`, result.value.name);
      } else {
        console.log(`User ${index + 1}: Failed -`, result.reason.message);
      }
    });
  }

  await fetchWithPartialFailure();
}, 6500);

// 7. Async Iteration
setTimeout(async () => {
  console.log("\n--- Async Iteration ---");

  async function processSequentially(ids) {
    for (const id of ids) {
      const user = await fetchUser(id);
      console.log("Processed user:", user.name);
    }
  }

  await processSequentially([1, 2, 3]);
}, 8000);

// 8. Async Map
setTimeout(async () => {
  console.log("\n--- Async Map ---");

  async function fetchAllUsers(ids) {
    // Map returns array of promises
    const promises = ids.map((id) => fetchUser(id));

    // Wait for all promises
    const users = await Promise.all(promises);
    return users;
  }

  const users = await fetchAllUsers([1, 2, 3]);
  console.log(
    "All users:",
    users.map((u) => u.name)
  );
}, 10500);

// 9. Error Handling Patterns
setTimeout(async () => {
  console.log("\n--- Error Handling Patterns ---");

  // Pattern 1: Try/Catch
  async function pattern1() {
    try {
      const user = await fetchUser(1);
      return user;
    } catch (error) {
      console.error("Pattern 1 error:", error.message);
      return null;
    }
  }

  // Pattern 2: .catch() on await
  async function pattern2() {
    const user = await fetchUser(-1).catch((error) => {
      console.error("Pattern 2 error:", error.message);
      return null;
    });
    return user;
  }

  // Pattern 3: Wrapper function
  async function asyncHandler(fn) {
    try {
      return await fn();
    } catch (error) {
      console.error("Handler caught:", error.message);
      throw error;
    }
  }

  await pattern1();
  await pattern2();
  await asyncHandler(() => fetchUser(1));
}, 11500);

// 10. Async Function Return Values
setTimeout(async () => {
  console.log("\n--- Async Function Return Values ---");

  // Async function always returns a Promise
  async function returnValue() {
    return "Hello"; // Wrapped in Promise.resolve
  }

  async function returnPromise() {
    return Promise.resolve("World");
  }

  // Both return promises
  returnValue().then((val) => console.log("Return value:", val));
  returnPromise().then((val) => console.log("Return promise:", val));

  // Equivalent to:
  function regularFunction() {
    return Promise.resolve("Regular");
  }

  regularFunction().then((val) => console.log("Regular function:", val));
}, 12500);

// 11. Async IIFE (Immediately Invoked Function Expression)
(async () => {
  console.log("\n--- Async IIFE ---");

  const user = await fetchUser(1);
  console.log("IIFE fetched user:", user.name);
})();

// 12. Top-Level Await (Node.js 14.8+)
// Note: Only works in ES modules or with --experimental-top-level-await
// const user = await fetchUser(1);
// console.log('Top-level await:', user);

// 13. Real-World Example: API Endpoint
setTimeout(async () => {
  console.log("\n--- Real-World Example: API Endpoint ---");

  async function getUserDashboard(userId) {
    try {
      // Fetch user and posts in parallel
      const [user, posts] = await Promise.all([
        fetchUser(userId),
        fetchPosts(userId),
      ]);

      // Return dashboard data
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        stats: {
          totalPosts: posts.length,
        },
        recentPosts: posts.slice(0, 5),
      };
    } catch (error) {
      console.error("Dashboard error:", error.message);
      throw new Error("Failed to load user dashboard");
    }
  }

  const dashboard = await getUserDashboard(1);
  console.log("User dashboard:", dashboard);
}, 13500);

// 14. Best Practices
setTimeout(() => {
  console.log("\n--- Async/Await Best Practices ---");
  console.log("✓ Always use try/catch for error handling");
  console.log("✓ Use Promise.all for parallel operations");
  console.log("✓ Avoid mixing async/await with .then()");
  console.log("✓ Return promises explicitly when needed");
  console.log("✓ Use async/await for cleaner, more readable code");
  console.log("✓ Remember: async functions always return promises");
  console.log("✓ Handle all promise rejections");
  console.log("✓ Use Promise.allSettled for partial failures");
}, 14500);

// Keep script running
setTimeout(() => {
  console.log("\n=== All Async/Await Examples Completed ===");
  process.exit(0);
}, 15500);

