// Variables and Scoping in JavaScript

console.log("=== Variables and Scoping ===\n");

// 1. Variable Declarations: var, let, const
console.log("--- Variable Declarations ---");

// var - function scoped, can be redeclared
var name = "John";
var name = "Jane"; // OK with var
console.log("var name:", name);

// let - block scoped, cannot be redeclared
let age = 25;
// let age = 30; // Error: Cannot redeclare
age = 30; // OK: Can reassign
console.log("let age:", age);

// const - block scoped, cannot be reassigned
const PI = 3.14159;
// PI = 3.14; // Error: Assignment to constant variable
console.log("const PI:", PI);

// 2. Scoping Rules
console.log("\n--- Scoping Rules ---");

// Function scope (var)
function functionScope() {
  if (true) {
    var x = 10;
  }
  console.log("var x accessible outside if block:", x); // Works!
}
functionScope();

// Block scope (let, const)
function blockScope() {
  if (true) {
    let y = 20;
    const z = 30;
    console.log("Inside block - y:", y, "z:", z);
  }
  // console.log(y); // Error: y is not defined
  // console.log(z); // Error: z is not defined
}
blockScope();

// 3. Hoisting
console.log("\n--- Hoisting ---");

// var is hoisted with undefined
console.log("Hoisted var:", hoistedVar); // undefined
var hoistedVar = "I am hoisted";
console.log("After assignment:", hoistedVar);

// let and const are hoisted but in "temporal dead zone"
try {
  console.log(hoistedLet); // ReferenceError
  let hoistedLet = "TDZ";
} catch (error) {
  console.log("let error:", error.message);
}

// 4. Global vs Local Scope
console.log("\n--- Global vs Local Scope ---");

let globalVar = "I am global";

function scopeDemo() {
  let localVar = "I am local";
  console.log("Inside function - globalVar:", globalVar); // Accessible
  console.log("Inside function - localVar:", localVar);
}

scopeDemo();
console.log("Outside function - globalVar:", globalVar); // Accessible
// console.log('Outside function - localVar:', localVar); // Error

// 5. Const with Objects and Arrays
console.log("\n--- Const with Objects and Arrays ---");

// const prevents reassignment, not mutation
const person = {
  name: "John",
  age: 30,
};

person.age = 31; // OK: Mutating object
person.city = "New York"; // OK: Adding property
console.log("Mutated const object:", person);

// person = {}; // Error: Assignment to constant

const numbers = [1, 2, 3];
numbers.push(4); // OK: Mutating array
console.log("Mutated const array:", numbers);

// numbers = []; // Error: Assignment to constant

// 6. Variable Shadowing
console.log("\n--- Variable Shadowing ---");

let message = "Outer message";

function shadowExample() {
  let message = "Inner message"; // Shadows outer variable
  console.log("Inside function:", message);

  if (true) {
    let message = "Block message"; // Shadows function variable
    console.log("Inside block:", message);
  }

  console.log("After block:", message);
}

shadowExample();
console.log("Outside function:", message);

// 7. Best Practices
console.log("\n--- Best Practices ---");

// Use const by default
const CONFIG = {
  API_URL: "https://api.example.com",
  TIMEOUT: 5000,
};

// Use let when reassignment is needed
let counter = 0;
for (let i = 0; i < 5; i++) {
  counter++;
}
console.log("Counter:", counter);

// Avoid var (legacy code only)
// var oldStyle = 'Avoid this';

// Use descriptive names
const userFirstName = "John";
const userLastName = "Doe";
const userAge = 30;

console.log("\n--- Summary ---");
console.log("✓ Use const by default");
console.log("✓ Use let when reassignment needed");
console.log("✓ Avoid var in modern code");
console.log("✓ Understand block vs function scope");
console.log("✓ Be aware of hoisting");

