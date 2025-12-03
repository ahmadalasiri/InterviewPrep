// ES6 (ECMAScript 2015) Features

console.log("=== ES6 Features ===\n");

// 1. Let and Const
console.log("--- Let and Const ---");

// Let - block-scoped variable
if (true) {
  let blockVar = "I'm block scoped";
  console.log(blockVar);
}
// console.log(blockVar); // ReferenceError: blockVar is not defined

// Const - block-scoped constant
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

const obj = { name: "John" };
obj.name = "Jane"; // OK - can modify object properties
obj.age = 30; // OK - can add properties
// obj = {}; // Error - cannot reassign

// 2. Arrow Functions
console.log("\n--- Arrow Functions ---");

// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const addArrow = (a, b) => a + b;
const multiply = (a, b) => {
  return a * b;
};

// Single parameter
const square = x => x * x;

// No parameters
const greet = () => "Hello!";

// Arrow functions and 'this'
const person = {
  name: "Alice",
  traditional: function() {
    return this.name; // 'this' refers to person
  },
  arrow: () => {
    return this.name; // 'this' refers to global/window
  }
};

console.log("Add:", addArrow(5, 3));
console.log("Square:", square(4));
console.log("Traditional:", person.traditional());
console.log("Arrow:", person.arrow());

// 3. Template Literals
console.log("\n--- Template Literals ---");

const name = "Bob";
const age = 25;
const message = `Hello, my name is ${name} and I'm ${age} years old`;
console.log(message);

// Multi-line strings
const multiLine = `
  This is a
  multi-line
  string
`;
console.log(multiLine);

// Expressions in templates
const a = 10;
const b = 20;
console.log(`Sum: ${a + b}, Product: ${a * b}`);

// 4. Default Parameters
console.log("\n--- Default Parameters ---");

function greetUser(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greetUser());
console.log(greetUser("Alice"));
console.log(greetUser("Bob", "Hi"));

// 5. Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

console.log("Sum:", sum(1, 2, 3, 4, 5));

function logInfo(name, age, ...hobbies) {
  console.log(`Name: ${name}, Age: ${age}`);
  console.log("Hobbies:", hobbies);
}

logInfo("Charlie", 30, "reading", "coding", "gaming");

// 6. Spread Operator
console.log("\n--- Spread Operator ---");

// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log("Combined:", combined);

// Copy array
const copy = [...arr1];
console.log("Copy:", copy);

// Objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log("Merged:", merged);

// Function arguments
const numbers = [1, 2, 3, 4, 5];
console.log("Max:", Math.max(...numbers));

// 7. Destructuring (see destructuring.js for detailed examples)
console.log("\n--- Destructuring ---");

// Array destructuring
const [first, second, third] = [1, 2, 3];
console.log("First:", first, "Second:", second);

// Object destructuring
const { x, y } = { x: 10, y: 20 };
console.log("X:", x, "Y:", y);

// 8. Enhanced Object Literals
console.log("\n--- Enhanced Object Literals ---");

const propName = "age";
const value = 30;

// Shorthand property names
const person2 = {
  name: "David",
  propName, // same as propName: propName
  value,
  // Shorthand methods
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  // Computed property names
  [`${propName}InMonths`]: value * 12
};

console.log(person2);
console.log(person2.greet());

// 9. Promises
console.log("\n--- Promises ---");

const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data fetched successfully!");
    }, 1000);
  });
};

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// 10. Classes (see classes.js for detailed examples)
console.log("\n--- Classes ---");

class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }
  
  start() {
    return `${this.brand} started`;
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    super(brand);
    this.model = model;
  }
  
  drive() {
    return `Driving ${this.brand} ${this.model}`;
  }
}

const myCar = new Car("Toyota", "Camry");
console.log(myCar.start());
console.log(myCar.drive());

// 11. Modules (ES6 Modules)
console.log("\n--- Modules ---");
// Note: This requires module system (import/export)
// export const moduleVar = "I'm exported";
// import { moduleVar } from './module.js';

// 12. Symbol
console.log("\n--- Symbols ---");

const sym1 = Symbol("description");
const sym2 = Symbol("description");
console.log("Are symbols equal?", sym1 === sym2); // false

const obj3 = {
  [sym1]: "value1",
  [sym2]: "value2"
};
console.log("Symbol values:", obj3[sym1], obj3[sym2]);

// 13. Map and Set
console.log("\n--- Map and Set ---");

// Map
const map = new Map();
map.set("name", "John");
map.set("age", 30);
console.log("Map size:", map.size);
console.log("Map get:", map.get("name"));

// Set
const set = new Set([1, 2, 3, 3, 4, 4]);
console.log("Set size:", set.size);
console.log("Set values:", Array.from(set));

// 14. For...of Loop
console.log("\n--- For...of Loop ---");

const iterable = [10, 20, 30];
for (const value of iterable) {
  console.log("Value:", value);
}

// 15. Array Methods (ES6 additions)
console.log("\n--- Array Methods ---");

const numbers2 = [1, 2, 3, 4, 5];

// find
const found = numbers2.find(num => num > 3);
console.log("Find (>3):", found);

// findIndex
const index = numbers2.findIndex(num => num > 3);
console.log("FindIndex (>3):", index);

// includes
console.log("Includes 3:", numbers2.includes(3));

// 16. String Methods
console.log("\n--- String Methods ---");

const str = "Hello World";
console.log("Starts with 'Hello':", str.startsWith("Hello"));
console.log("Ends with 'World':", str.endsWith("World"));
console.log("Includes 'lo':", str.includes("lo"));
console.log("Repeat:", "ha".repeat(3));

// 17. Object.assign
console.log("\n--- Object.assign ---");

const target = { a: 1 };
const source = { b: 2, c: 3 };
const result = Object.assign(target, source);
console.log("Assigned:", result);

// 18. Number Methods
console.log("\n--- Number Methods ---");

console.log("Is Integer:", Number.isInteger(42));
console.log("Is NaN:", Number.isNaN(NaN));
console.log("Is Finite:", Number.isFinite(42));
console.log("Parse Float:", Number.parseFloat("3.14"));
console.log("Parse Int:", Number.parseInt("42"));

// 19. Array.from
console.log("\n--- Array.from ---");

const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const realArray = Array.from(arrayLike);
console.log("From array-like:", realArray);

// From string
const chars = Array.from("hello");
console.log("From string:", chars);

// With map function
const doubled = Array.from([1, 2, 3], x => x * 2);
console.log("Doubled:", doubled);

console.log("\n--- Summary ---");
console.log("✓ Let/Const for block scoping");
console.log("✓ Arrow functions for concise syntax");
console.log("✓ Template literals for string interpolation");
console.log("✓ Default and rest parameters");
console.log("✓ Spread operator for arrays/objects");
console.log("✓ Destructuring for easy extraction");
console.log("✓ Classes for OOP");
console.log("✓ Promises for async operations");
console.log("✓ New data structures: Map, Set, Symbol");
console.log("✓ Enhanced object literals");
console.log("✓ New array and string methods");

