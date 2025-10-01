// Destructuring in JavaScript

console.log("=== Destructuring Assignment ===\n");

// 1. Array Destructuring
console.log("--- Array Destructuring ---");

const colors = ['red', 'green', 'blue'];

// Basic
const [first, second, third] = colors;
console.log("First:", first);
console.log("Second:", second);
console.log("Third:", third);

// Skip elements
const [primary, , tertiary] = colors;
console.log("Primary:", primary, "Tertiary:", tertiary);

// Rest operator
const numbers = [1, 2, 3, 4, 5];
const [one, two, ...rest] = numbers;
console.log("One:", one, "Two:", two, "Rest:", rest);

// Default values
const [a, b, c = 3] = [1, 2];
console.log("a:", a, "b:", b, "c:", c);

// Swapping variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log("After swap - x:", x, "y:", y);

// 2. Object Destructuring
console.log("\n--- Object Destructuring ---");

const person = {
  name: 'John',
  age: 30,
  city: 'NYC',
  country: 'USA'
};

// Basic
const { name, age } = person;
console.log("Name:", name, "Age:", age);

// Rename variables
const { name: personName, age: personAge } = person;
console.log("Person Name:", personName);

// Default values
const { city, country, zip = '00000' } = person;
console.log("ZIP:", zip);

// Rest in objects
const { name: userName, ...address } = person;
console.log("User:", userName);
console.log("Address:", address);

// 3. Nested Destructuring
console.log("\n--- Nested Destructuring ---");

const user = {
  id: 1,
  info: {
    name: 'Alice',
    contact: {
      email: 'alice@example.com',
      phone: '123-456-7890'
    }
  }
};

const { info: { name: fullName, contact: { email } } } = user;
console.log("Full Name:", fullName);
console.log("Email:", email);

// 4. Function Parameter Destructuring
console.log("\n--- Function Parameter Destructuring ---");

function greet({ name, age = 18 }) {
  console.log(`Hello ${name}, you are ${age} years old`);
}

greet({ name: 'Bob', age: 25 });
greet({ name: 'Charlie' });

// Array parameters
function sum([a, b]) {
  return a + b;
}
console.log("Sum [3, 4]:", sum([3, 4]));

console.log("\n--- Summary ---");
console.log("✓ Extract values from arrays and objects");
console.log("✓ Use default values for missing properties");
console.log("✓ Rename variables during destructuring");
console.log("✓ Use rest operator to collect remaining values");

