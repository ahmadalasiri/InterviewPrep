# Basic JavaScript Interview Questions

## Table of Contents

- [What is JavaScript?](#what-is-javascript)
- [Variables and Data Types](#variables-and-data-types)
- [Operators](#operators)
- [Type Coercion](#type-coercion)
- [Control Flow](#control-flow)

---

## What is JavaScript?

### Q1: What is JavaScript and where can it be used?

**Answer:**
JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It's a dynamic, weakly-typed language.

**Where it can be used:**

- **Web Browsers**: Client-side scripting for interactive web pages
- **Servers**: Node.js for backend development
- **Mobile Apps**: React Native, Ionic, NativeScript
- **Desktop Apps**: Electron (VS Code, Slack, Discord)
- **IoT**: Johnny-Five, Tessel
- **Game Development**: Phaser, Three.js
- **Machine Learning**: TensorFlow.js

**Key Characteristics:**

- **Interpreted**: Executed line by line
- **Dynamically Typed**: Types are determined at runtime
- **Multi-paradigm**: Supports OOP, functional, and imperative programming
- **Event-driven**: Asynchronous and non-blocking

---

### Q2: What are the different data types in JavaScript?

**Answer:**
JavaScript has **8 data types** divided into two categories:

**Primitive Types (7):**

1. **String**: Textual data
2. **Number**: Numeric values (integers and floats)
3. **BigInt**: Large integers beyond Number limit
4. **Boolean**: true or false
5. **Undefined**: Variable declared but not assigned
6. **Null**: Intentional absence of value
7. **Symbol**: Unique identifier (ES6)

**Reference Type (1):**

8. **Object**: Collections of properties (arrays, functions, objects)

**Examples:**

```javascript
// Primitive types
let str = "Hello";                // String
let num = 42;                     // Number
let bigNum = 9007199254740991n;   // BigInt
let bool = true;                  // Boolean
let undef;                        // Undefined
let nothing = null;               // Null
let sym = Symbol('id');           // Symbol

// Reference types
let obj = { name: "John" };       // Object
let arr = [1, 2, 3];              // Array (type: object)
let func = function() {};         // Function (type: function/object)
let date = new Date();            // Date object
let regex = /ab+c/;               // RegExp object
```

**Type Checking:**

```javascript
typeof "hello"        // "string"
typeof 42             // "number"
typeof true           // "boolean"
typeof undefined      // "undefined"
typeof null           // "object" (this is a bug in JavaScript)
typeof Symbol('id')   // "symbol"
typeof {}             // "object"
typeof []             // "object"
typeof function(){}   // "function"

// Better way to check for null
value === null        // true for null

// Better way to check for array
Array.isArray([])     // true
```

---

## Variables and Data Types

### Q3: What is the difference between `var`, `let`, and `const`?

**Answer:**

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function | Block | Block |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassignment | Yes | Yes | No |
| Redeclaration | Yes | No | No |
| Initialization | Optional | Optional | Required |

**Examples:**

```javascript
// var - function scoped
function varExample() {
  console.log(x); // undefined (hoisted)
  var x = 5;
  
  if (true) {
    var x = 10; // Same variable
  }
  console.log(x); // 10
}

// let - block scoped
function letExample() {
  // console.log(y); // ReferenceError (TDZ)
  let y = 5;
  
  if (true) {
    let y = 10; // Different variable
    console.log(y); // 10
  }
  console.log(y); // 5
}

// const - block scoped, cannot reassign
const PI = 3.14159;
// PI = 3.14; // TypeError

// But can mutate objects
const person = { name: "John" };
person.name = "Jane"; // OK
person.age = 30;      // OK
// person = {};       // TypeError

const arr = [1, 2, 3];
arr.push(4);          // OK
// arr = [];          // TypeError
```

**Best Practice:**

- Use `const` by default
- Use `let` when reassignment is needed
- Avoid `var` in modern code

---

### Q4: What is hoisting in JavaScript?

**Answer:**
Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation.

**Function Hoisting:**

```javascript
// Function declarations are hoisted
sayHello(); // Works!

function sayHello() {
  console.log("Hello!");
}

// Function expressions are NOT hoisted
// sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
  console.log("Hi!");
};
```

**Variable Hoisting:**

```javascript
// var is hoisted with undefined
console.log(x); // undefined
var x = 5;
console.log(x); // 5

// Equivalent to:
var x;
console.log(x); // undefined
x = 5;
console.log(x); // 5

// let and const are hoisted but in Temporal Dead Zone
console.log(y); // ReferenceError
let y = 5;
```

**Temporal Dead Zone (TDZ):**

```javascript
{
  // TDZ starts
  console.log(x); // ReferenceError
  // TDZ continues
  let x = 5; // TDZ ends
  console.log(x); // 5
}
```

---

### Q5: What is the difference between `null` and `undefined`?

**Answer:**

**Undefined:**
- Variable declared but not assigned a value
- Function with no return statement returns undefined
- Missing function parameters are undefined
- Accessing non-existent object properties returns undefined

**Null:**
- Intentional absence of any value
- Must be explicitly assigned
- Represents "no value" or "empty"

**Examples:**

```javascript
// Undefined
let x;
console.log(x); // undefined

function noReturn() {}
console.log(noReturn()); // undefined

const obj = {};
console.log(obj.prop); // undefined

function test(a) {
  console.log(a); // undefined if not passed
}
test();

// Null
let empty = null;
console.log(empty); // null

// Type checking
typeof undefined  // "undefined"
typeof null       // "object" (JavaScript bug)

undefined == null   // true (loose equality)
undefined === null  // false (strict equality)

// Checking for null or undefined
if (value == null) {
  // true for both null and undefined
}

if (value === null) {
  // only true for null
}

if (value === undefined) {
  // only true for undefined
}

// Modern way
value ?? 'default'  // Nullish coalescing (null or undefined)
```

---

## Operators

### Q6: What is the difference between `==` and `===`?

**Answer:**

**`==` (Loose Equality):**
- Compares values after type coercion
- Converts operands to the same type before comparison

**`===` (Strict Equality):**
- Compares values without type coercion
- Both value and type must be the same

**Examples:**

```javascript
// Loose equality (==)
5 == '5'           // true (string '5' converted to number)
0 == false         // true (false converted to 0)
null == undefined  // true (special case)
'' == false        // true (both converted to 0)
[] == false        // true (array converted to empty string, then to 0)

// Strict equality (===)
5 === '5'          // false (different types)
0 === false        // false (different types)
null === undefined // false (different types)
'' === false       // false (different types)

// Special cases
NaN == NaN         // false
NaN === NaN        // false
Number.isNaN(NaN)  // true (correct way to check for NaN)

// Object comparison (both == and ===)
{} == {}           // false (different references)
{} === {}          // false (different references)

const obj1 = { a: 1 };
const obj2 = obj1;
obj1 === obj2      // true (same reference)
```

**Best Practice:** Always use `===` unless you specifically need type coercion.

---

### Q7: What are truthy and falsy values?

**Answer:**

**Falsy Values (8 total):**
Values that evaluate to `false` in a boolean context

1. `false`
2. `0`
3. `-0`
4. `0n` (BigInt zero)
5. `""` (empty string)
6. `null`
7. `undefined`
8. `NaN`

**Truthy Values:**
Everything else is truthy!

**Examples:**

```javascript
// Falsy values
if (false) {}         // ❌
if (0) {}             // ❌
if (-0) {}            // ❌
if (0n) {}            // ❌
if ("") {}            // ❌
if (null) {}          // ❌
if (undefined) {}     // ❌
if (NaN) {}           // ❌

// Truthy values
if (true) {}          // ✅
if (1) {}             // ✅
if (-1) {}            // ✅
if ("0") {}           // ✅ (string with content)
if ("false") {}       // ✅ (string with content)
if ([]) {}            // ✅ (empty array is truthy!)
if ({}) {}            // ✅ (empty object is truthy!)
if (function(){}) {}  // ✅

// Practical use
function greet(name) {
  // If name is falsy, use 'Guest'
  name = name || 'Guest';
  console.log(`Hello, ${name}`);
}

greet('John');  // Hello, John
greet('');      // Hello, Guest
greet();        // Hello, Guest

// Modern alternative (nullish coalescing)
function greet(name) {
  // Only replaces null or undefined
  name = name ?? 'Guest';
  console.log(`Hello, ${name}`);
}

greet('');      // Hello, 
greet(0);       // Hello, 0
greet(null);    // Hello, Guest
```

---

## Type Coercion

### Q8: What is type coercion in JavaScript?

**Answer:**
Type coercion is the automatic or implicit conversion of values from one data type to another.

**String Coercion:**

```javascript
// Using + with string converts to string
"5" + 3          // "53"
"Hello" + true   // "Hellotrue"
"5" + null       // "5null"
"5" + undefined  // "5undefined"

// Using String() or toString()
String(123)      // "123"
(123).toString() // "123"
```

**Number Coercion:**

```javascript
// Using arithmetic operators (except +)
"5" - 2          // 3
"5" * 2          // 10
"10" / 2         // 5
"5" % 2          // 1

// Using Number() or +
Number("123")    // 123
+"123"           // 123
+"abc"           // NaN

// Special cases
Number("")       // 0
Number(" ")      // 0
Number(null)     // 0
Number(undefined)// NaN
Number(true)     // 1
Number(false)    // 0
```

**Boolean Coercion:**

```javascript
// Using Boolean() or !!
Boolean(0)       // false
Boolean(1)       // true
Boolean("")      // false
Boolean("hi")    // true

!!"hello"        // true
!!0              // false

// In conditions
if ("hello") {}  // Automatic boolean coercion
```

**Comparison Coercion:**

```javascript
// == performs type coercion
1 == "1"         // true
0 == false       // true
null == undefined// true

// Common gotchas
[] == ![]        // true (both convert to 0)
[] + []          // "" (empty string)
[] + {}          // "[object Object]"
{} + []          // 0 (or "[object Object]" depending on context)
```

---

### Q9: Explain the difference between `Object.is()` and `===`?

**Answer:**

`Object.is()` is similar to `===` but handles special cases differently:

```javascript
// Same as ===
Object.is(1, 1)          // true
Object.is('a', 'a')      // true
Object.is({}, {})        // false (different references)

// Differences from ===

// NaN
NaN === NaN              // false
Object.is(NaN, NaN)      // true ✅

// +0 and -0
+0 === -0                // true
Object.is(+0, -0)        // false ✅

// Other cases remain same
null === null            // true
Object.is(null, null)    // true

undefined === undefined  // true
Object.is(undefined, undefined) // true
```

**Use Cases:**

```javascript
// Checking for NaN
const isNaN = value => Object.is(value, NaN);
// or use Number.isNaN()

// Distinguishing +0 from -0
function checkZero(value) {
  if (Object.is(value, 0)) return "positive zero";
  if (Object.is(value, -0)) return "negative zero";
  return "not zero";
}
```

---

## Quick Practice Questions

### Q10: What will be the output?

```javascript
console.log(typeof typeof 1);
```

**Answer:** `"string"`

**Explanation:**
- `typeof 1` → `"number"` (string)
- `typeof "number"` → `"string"`

---

### Q11: What will be the output?

```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

**Answer:**
```javascript
[] + []   // "" (empty string)
[] + {}   // "[object Object]"
{} + []   // 0 (or "[object Object]" in some contexts)
```

**Explanation:**
- Arrays convert to empty string when coerced
- Objects convert to "[object Object]"
- `{}` at the beginning might be interpreted as a block, not an object

---

### Q12: What will be the output?

```javascript
let a = 10;
{
  let a = 20;
  console.log(a);
}
console.log(a);
```

**Answer:**
```
20
10
```

**Explanation:**
- `let` is block-scoped
- Inner `a` is different from outer `a`
- Each scope has its own variable

---

### Q13: What will be the output?

```javascript
console.log(0.1 + 0.2 === 0.3);
```

**Answer:** `false`

**Explanation:**
- Floating-point arithmetic precision issue
- `0.1 + 0.2` → `0.30000000000000004`
- Use `Math.abs(a - b) < Number.EPSILON` for float comparison

```javascript
const isEqual = Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON;
console.log(isEqual); // true
```

---

This covers the basic JavaScript interview questions. Master these concepts and move on to functions and OOP questions!

