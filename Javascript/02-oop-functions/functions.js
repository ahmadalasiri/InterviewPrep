// Functions in JavaScript

console.log("=== Functions in JavaScript ===\n");

// 1. Function Declaration
console.log("--- Function Declaration ---");

function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('John'));
console.log("Hoisted:", typeof hoistedFunc); // "function"

function hoistedFunc() {
  return "I am hoisted";
}

// 2. Function Expression
console.log("\n--- Function Expression ---");

const greetExpr = function(name) {
  return `Hi, ${name}!`;
};

console.log(greetExpr('Jane'));

// Named function expression
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
};

console.log("Factorial(5):", factorial(5));

// 3. Arrow Functions
console.log("\n--- Arrow Functions ---");

// Concise syntax
const add = (a, b) => a + b;
console.log("add(3, 4):", add(3, 4));

// Single parameter (parentheses optional)
const square = x => x * x;
console.log("square(5):", square(5));

// No parameters
const getRandom = () => Math.random();
console.log("getRandom():", getRandom());

// Block body
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
console.log("multiply(3, 4):", multiply(3, 4));

// 4. Default Parameters
console.log("\n--- Default Parameters ---");

function greetWithDefault(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

console.log(greetWithDefault());
console.log(greetWithDefault('Alice'));
console.log(greetWithDefault('Bob', 'Hi'));

// 5. Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));

function multiply(multiplier, ...numbers) {
  return numbers.map(n => n * multiplier);
}

console.log("multiply(2, 1, 2, 3):", multiply(2, 1, 2, 3));

// 6. Higher-Order Functions
console.log("\n--- Higher-Order Functions ---");

// Function as argument
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, i => console.log(`Iteration ${i}`));

// Function returning function
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log("double(5):", double(5));
console.log("triple(5):", triple(5));

// 7. Immediately Invoked Function Expression (IIFE)
console.log("\n--- IIFE ---");

(function() {
  const private = "I'm private";
  console.log("IIFE executed:", private);
})();

// Arrow IIFE
(() => {
  console.log("Arrow IIFE executed");
})();

// 8. Callback Functions
console.log("\n--- Callback Functions ---");

function fetchData(callback) {
  setTimeout(() => {
    callback({ data: 'Sample data' });
  }, 100);
}

fetchData(result => {
  console.log("Received:", result.data);
});

// 9. Pure Functions
console.log("\n--- Pure Functions ---");

// Pure function (no side effects, same input = same output)
function addPure(a, b) {
  return a + b;
}

console.log("addPure(2, 3):", addPure(2, 3));

// Impure function (has side effects)
let total = 0;
function addImpure(n) {
  total += n; // Modifies external state
  return total;
}

console.log("addImpure(5):", addImpure(5));

// 10. Recursion
console.log("\n--- Recursion ---");

function factorialRec(n) {
  if (n <= 1) return 1;
  return n * factorialRec(n - 1);
}

console.log("factorialRec(5):", factorialRec(5));

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("fibonacci(7):", fibonacci(7));

console.log("\n--- Summary ---");
console.log("✓ Multiple ways to create functions");
console.log("✓ Arrow functions have lexical this");
console.log("✓ Use default and rest parameters");
console.log("✓ Higher-order functions enable functional programming");
console.log("✓ Pure functions are predictable and testable");

