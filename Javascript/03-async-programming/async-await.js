// Async/Await in JavaScript

console.log("=== Async/Await ===\n");

// 1. Basic Async Function
console.log("--- Basic Async Function ---");

async function fetchData() {
  return 'Data received'; // Automatically wrapped in Promise.resolve()
}

fetchData().then(data => console.log(data));

// 2. Using await
console.log("\n--- Using await ---");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
  console.log("Start");
  await delay(1000);
  console.log("After 1 second");
  await delay(1000);
  console.log("After 2 seconds");
}

example();

// 3. Error Handling
console.log("\n--- Error Handling ---");

async function fetchWithError() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 4. Sequential vs Parallel
console.log("\n--- Sequential vs Parallel ---");

async function sequential() {
  console.log("Sequential start");
  const a = await delay(500).then(() => 'A');
  const b = await delay(500).then(() => 'B');
  const c = await delay(500).then(() => 'C');
  console.log("Sequential done:", a, b, c);
}

async function parallel() {
  console.log("Parallel start");
  const [a, b, c] = await Promise.all([
    delay(500).then(() => 'A'),
    delay(500).then(() => 'B'),
    delay(500).then(() => 'C')
  ]);
  console.log("Parallel done:", a, b, c);
}

// sequential(); // Takes ~1.5s
// parallel();   // Takes ~0.5s

// 5. Async/Await Best Practices
console.log("\n--- Best Practices ---");

// Always handle errors
async function goodExample() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Don't forget await
async function badExample() {
  const data = fetchData(); // Returns Promise, not data!
  console.log(data); // Promise { <pending> }
}

async function correctExample() {
  const data = await fetchData();
  console.log(data); // Actual data
}

console.log("\n--- Summary ---");
console.log("✓ async functions always return promises");
console.log("✓ await pauses execution until promise settles");
console.log("✓ Always use try/catch for error handling");
console.log("✓ Use Promise.all() for parallel operations");
console.log("✓ Don't forget to use await keyword!");

