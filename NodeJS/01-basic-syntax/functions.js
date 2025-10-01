// Functions in JavaScript/Node.js

console.log("=== Functions in JavaScript ===\n");

// 1. Function Declarations
console.log("--- Function Declarations ---");

function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("John"));

// Function declarations are hoisted
console.log(hoistedFunction()); // Works!

function hoistedFunction() {
  return "I am hoisted!";
}

// 2. Function Expressions
console.log("\n--- Function Expressions ---");

const greetExpression = function (name) {
  return `Hi, ${name}!`;
};

console.log(greetExpression("Jane"));

// Function expressions are NOT hoisted
// console.log(notHoisted()); // Error: notHoisted is not a function
const notHoisted = function () {
  return "Not hoisted";
};

// 3. Arrow Functions
console.log("\n--- Arrow Functions ---");

// Basic syntax
const add = (a, b) => a + b;
console.log("add(5, 3):", add(5, 3));

// Single parameter (parentheses optional)
const square = (x) => x * x;
console.log("square(5):", square(5));

// No parameters
const sayHello = () => "Hello!";
console.log("sayHello():", sayHello());

// Multiple statements (need braces and return)
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
console.log("multiply(4, 5):", multiply(4, 5));

// 4. Arrow Functions vs Regular Functions
console.log("\n--- Arrow vs Regular Functions ---");

// Regular function - 'this' depends on how it's called
const person = {
  name: "John",
  greetRegular: function () {
    console.log("Regular function this.name:", this.name);
  },
  greetArrow: () => {
    // Arrow function - 'this' is lexically bound (from outer scope)
    console.log("Arrow function this:", this); // Global object or undefined
  },
};

person.greetRegular(); // 'John'
person.greetArrow(); // undefined (this is not person)

// 5. Default Parameters
console.log("\n--- Default Parameters ---");

function greetWithDefault(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greetWithDefault()); // Hello, Guest!
console.log(greetWithDefault("Alice")); // Hello, Alice!
console.log(greetWithDefault("Bob", "Hi")); // Hi, Bob!

// 6. Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log("sum(1, 2, 3):", sum(1, 2, 3));
console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));

// Combining regular params with rest
function introduce(greeting, ...names) {
  return `${greeting}, ${names.join(" and ")}!`;
}

console.log(introduce("Hello", "John", "Jane", "Bob"));

// 7. Spread Operator
console.log("\n--- Spread Operator ---");

const nums = [1, 2, 3];
const moreNums = [4, 5, 6];

// Spreading arrays
const combined = [...nums, ...moreNums];
console.log("Combined array:", combined);

// Using with Math functions
console.log("Max of nums:", Math.max(...nums));

// Spreading in function calls
function printThree(a, b, c) {
  console.log(`a: ${a}, b: ${b}, c: ${c}`);
}
printThree(...nums);

// 8. Higher-Order Functions
console.log("\n--- Higher-Order Functions ---");

// Function that returns a function
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log("double(5):", double(5));
console.log("triple(5):", triple(5));

// Function that takes a function as argument
function operate(a, b, operation) {
  return operation(a, b);
}

console.log(
  "operate(5, 3, add):",
  operate(5, 3, (a, b) => a + b)
);
console.log(
  "operate(5, 3, multiply):",
  operate(5, 3, (a, b) => a * b)
);

// 9. Closures
console.log("\n--- Closures ---");

function createCounter() {
  let count = 0; // Private variable

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
console.log("Increment:", counter.increment());
console.log("Increment:", counter.increment());
console.log("Get count:", counter.getCount());
console.log("Decrement:", counter.decrement());

// 10. Immediately Invoked Function Expressions (IIFE)
console.log("\n--- IIFE ---");

(function () {
  const privateVar = "I am private";
  console.log("IIFE executed:", privateVar);
})();

// With parameters
const result = (function (a, b) {
  return a + b;
})(5, 3);
console.log("IIFE result:", result);

// 11. Callback Functions
console.log("\n--- Callback Functions ---");

function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: "John" };
    callback(null, data);
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Fetched data:", data);
  }
});

// 12. Method Chaining
console.log("\n--- Method Chaining ---");

class Calculator {
  constructor(value = 0) {
    this.value = value;
  }

  add(num) {
    this.value += num;
    return this; // Return this for chaining
  }

  subtract(num) {
    this.value -= num;
    return this;
  }

  multiply(num) {
    this.value *= num;
    return this;
  }

  getResult() {
    return this.value;
  }
}

const calc = new Calculator(10);
const chainResult = calc.add(5).multiply(2).subtract(3).getResult();
console.log("Chained calculation result:", chainResult);

// 13. Currying
console.log("\n--- Currying ---");

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

function sumThree(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sumThree);
console.log("curriedSum(1)(2)(3):", curriedSum(1)(2)(3));
console.log("curriedSum(1, 2)(3):", curriedSum(1, 2)(3));
console.log("curriedSum(1, 2, 3):", curriedSum(1, 2, 3));

// 14. Recursive Functions
console.log("\n--- Recursive Functions ---");

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log("factorial(5):", factorial(5));

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("fibonacci(7):", fibonacci(7));

console.log("\n--- Summary ---");
console.log("✓ Function declarations vs expressions");
console.log("✓ Arrow functions and lexical this");
console.log("✓ Default and rest parameters");
console.log("✓ Higher-order functions and closures");
console.log("✓ Callbacks and async patterns");
console.log("✓ Method chaining and currying");

