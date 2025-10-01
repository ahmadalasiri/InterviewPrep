// Closures in JavaScript

console.log("=== Closures ===\n");

// 1. Basic Closure
console.log("--- Basic Closure ---");

function outer() {
  let count = 0; // This variable is "closed over"
  
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 2. Private Variables (Data Privacy)
console.log("\n--- Private Variables ---");

function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable
  
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
console.log("Initial balance:", account.getBalance());
console.log("After deposit 500:", account.deposit(500));
console.log("After withdraw 200:", account.withdraw(200));
// account.balance is NOT accessible (private)

// 3. Function Factory
console.log("\n--- Function Factory ---");

function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log("double(5):", double(5));
console.log("triple(5):", triple(5));
console.log("quadruple(5):", quadruple(5));

// 4. Memoization
console.log("\n--- Memoization ---");

function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log("Returning cached result for", args);
      return cache[key];
    }
    console.log("Computing result for", args);
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const expensiveOperation = memoize(function(n) {
  return n * n;
});

console.log(expensiveOperation(5)); // Computing
console.log(expensiveOperation(5)); // From cache
console.log(expensiveOperation(10)); // Computing

console.log("\n--- Summary ---");
console.log("✓ Closures remember their lexical scope");
console.log("✓ Used for data privacy and encapsulation");
console.log("✓ Enable factory patterns and memoization");
console.log("✓ Inner functions have access to outer variables");

