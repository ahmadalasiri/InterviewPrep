// Data Types in JavaScript

console.log("=== JavaScript Data Types ===\n");

// JavaScript has 8 data types:
// 7 Primitive Types + 1 Reference Type (Object)

// 1. Primitive Types
console.log("--- Primitive Types ---");

// String
const str = "Hello, World!";
const str2 = 'Single quotes';
const str3 = `Template literal with ${str}`;
console.log("String:", str, typeof str);

// Number (integers and floats)
const int = 42;
const float = 3.14;
const negative = -10;
const infinity = Infinity;
const notANumber = NaN;
console.log("Number:", int, typeof int);
console.log("NaN:", notANumber, typeof notANumber); // "number"

// BigInt (for large integers)
const bigInt = 9007199254740991n;
const anotherBigInt = BigInt("9007199254740991");
console.log("BigInt:", bigInt, typeof bigInt);

// Boolean
const isTrue = true;
const isFalse = false;
console.log("Boolean:", isTrue, typeof isTrue);

// Undefined (variable declared but not assigned)
let notAssigned;
console.log("Undefined:", notAssigned, typeof notAssigned);

// Null (intentional absence of value)
const empty = null;
console.log("Null:", empty, typeof empty); // "object" (JavaScript bug)

// Symbol (unique identifier)
const sym1 = Symbol('id');
const sym2 = Symbol('id');
console.log("Symbol:", sym1, typeof sym1);
console.log("Symbols are unique:", sym1 === sym2); // false

// 2. Reference Type (Object)
console.log("\n--- Reference Types ---");

// Object
const person = {
  name: "John",
  age: 30,
  isEmployed: true
};
console.log("Object:", person, typeof person);

// Array (special type of object)
const numbers = [1, 2, 3, 4, 5];
console.log("Array:", numbers, typeof numbers); // "object"
console.log("Is Array:", Array.isArray(numbers)); // true

// Function (special type of object)
function greet() {
  return "Hello!";
}
console.log("Function:", greet, typeof greet); // "function"

// Date
const date = new Date();
console.log("Date:", date, typeof date); // "object"

// RegExp
const regex = /ab+c/;
console.log("RegExp:", regex, typeof regex); // "object"

// 3. Type Checking
console.log("\n--- Type Checking ---");

console.log("typeof 'hello':", typeof "hello");
console.log("typeof 42:", typeof 42);
console.log("typeof true:", typeof true);
console.log("typeof undefined:", typeof undefined);
console.log("typeof null:", typeof null); // "object" (bug)
console.log("typeof Symbol():", typeof Symbol());
console.log("typeof {}:", typeof {});
console.log("typeof []:", typeof []); // "object"
console.log("typeof function(){}:", typeof function(){});

// Better null check
console.log("null === null:", empty === null);

// Better array check
console.log("Array.isArray([]):", Array.isArray([]));

// 4. Type Coercion
console.log("\n--- Type Coercion ---");

// String coercion
console.log("'5' + 3:", "5" + 3); // "53"
console.log("'5' + true:", "5" + true); // "5true"

// Number coercion
console.log("'5' - 2:", "5" - 2); // 3
console.log("'5' * 2:", "5" * 2); // 10
console.log("+'123':", +"123"); // 123

// Boolean coercion
console.log("Boolean(0):", Boolean(0)); // false
console.log("Boolean(1):", Boolean(1)); // true
console.log("Boolean(''):", Boolean("")); // false
console.log("Boolean('hello'):", Boolean("hello")); // true

// 5. Truthy and Falsy Values
console.log("\n--- Truthy and Falsy Values ---");

// Falsy values (8 total)
console.log("Falsy values:");
console.log("  false:", Boolean(false));
console.log("  0:", Boolean(0));
console.log("  -0:", Boolean(-0));
console.log("  0n:", Boolean(0n));
console.log("  '':", Boolean(""));
console.log("  null:", Boolean(null));
console.log("  undefined:", Boolean(undefined));
console.log("  NaN:", Boolean(NaN));

// Everything else is truthy
console.log("\nTruthy values:");
console.log("  'hello':", Boolean("hello"));
console.log("  1:", Boolean(1));
console.log("  []:", Boolean([])); // Empty array is truthy!
console.log("  {}:", Boolean({})); // Empty object is truthy!

// 6. Special Number Values
console.log("\n--- Special Number Values ---");

console.log("Infinity:", Infinity);
console.log("1 / 0:", 1 / 0); // Infinity
console.log("-Infinity:", -Infinity);
console.log("NaN:", NaN);
console.log("'hello' * 2:", "hello" * 2); // NaN

// NaN checking
console.log("NaN === NaN:", NaN === NaN); // false
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true
console.log("isNaN('hello'):", isNaN("hello")); // true (converts to number first)
console.log("Number.isNaN('hello'):", Number.isNaN("hello")); // false (strict check)

// 7. Number Methods
console.log("\n--- Number Methods ---");

const num = 42.567;
console.log("toFixed(2):", num.toFixed(2)); // "42.57"
console.log("toPrecision(4):", num.toPrecision(4)); // "42.57"
console.log("toString():", num.toString()); // "42.567"

console.log("Number.parseInt('42px'):", Number.parseInt("42px")); // 42
console.log("Number.parseFloat('3.14'):", Number.parseFloat("3.14")); // 3.14
console.log("Number.isInteger(42):", Number.isInteger(42)); // true
console.log("Number.isFinite(42):", Number.isFinite(42)); // true

// 8. String Methods
console.log("\n--- String Methods ---");

const text = "Hello, World!";
console.log("length:", text.length);
console.log("toUpperCase():", text.toUpperCase());
console.log("toLowerCase():", text.toLowerCase());
console.log("includes('World'):", text.includes("World"));
console.log("indexOf('World'):", text.indexOf("World"));
console.log("slice(0, 5):", text.slice(0, 5));
console.log("split(','):", text.split(","));
console.log("replace('World', 'JavaScript'):", text.replace("World", "JavaScript"));

// 9. Template Literals
console.log("\n--- Template Literals ---");

const name = "Alice";
const age = 25;
console.log(`My name is ${name} and I am ${age} years old.`);

// Multi-line strings
const multiLine = `
  Line 1
  Line 2
  Line 3
`;
console.log("Multi-line:", multiLine);

// 10. Type Conversion
console.log("\n--- Type Conversion ---");

// To String
console.log("String(123):", String(123));
console.log("(123).toString():", (123).toString());
console.log("123 + '':", 123 + "");

// To Number
console.log("Number('123'):", Number("123"));
console.log("+'123':", +"123");
console.log("parseInt('123'):", parseInt("123"));
console.log("parseFloat('3.14'):", parseFloat("3.14"));

// To Boolean
console.log("Boolean(1):", Boolean(1));
console.log("!!1:", !!1);

console.log("\n--- Summary ---");
console.log("✓ 7 Primitive types: String, Number, BigInt, Boolean, Undefined, Null, Symbol");
console.log("✓ 1 Reference type: Object (includes arrays, functions, etc.)");
console.log("✓ Use typeof for type checking (except null and arrays)");
console.log("✓ Be aware of type coercion and use === for strict equality");

