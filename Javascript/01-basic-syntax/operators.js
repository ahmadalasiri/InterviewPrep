// Operators in JavaScript

console.log("=== JavaScript Operators ===\n");

// 1. Arithmetic Operators
console.log("--- Arithmetic Operators ---");
console.log("5 + 3 =", 5 + 3);
console.log("5 - 3 =", 5 - 3);
console.log("5 * 3 =", 5 * 3);
console.log("5 / 3 =", 5 / 3);
console.log("5 % 3 =", 5 % 3); // Modulus (remainder)
console.log("5 ** 3 =", 5 ** 3); // Exponentiation

// 2. Comparison Operators
console.log("\n--- Comparison Operators ---");
console.log("5 == '5':", 5 == '5'); // true (loose equality)
console.log("5 === '5':", 5 === '5'); // false (strict equality)
console.log("5 != '5':", 5 != '5'); // false
console.log("5 !== '5':", 5 !== '5'); // true
console.log("5 > 3:", 5 > 3);
console.log("5 < 3:", 5 < 3);
console.log("5 >= 5:", 5 >= 5);
console.log("5 <= 5:", 5 <= 5);

// 3. Logical Operators
console.log("\n--- Logical Operators ---");
console.log("true && false:", true && false); // AND
console.log("true || false:", true || false); // OR
console.log("!true:", !true); // NOT

// Short-circuit evaluation
console.log("'hello' && 'world':", 'hello' && 'world'); // 'world'
console.log("'' && 'world':", '' && 'world'); // ''
console.log("'hello' || 'world':", 'hello' || 'world'); // 'hello'
console.log("'' || 'world':", '' || 'world'); // 'world'

// 4. Nullish Coalescing and Optional Chaining
console.log("\n--- Nullish Coalescing (??) ---");
console.log("null ?? 'default':", null ?? 'default');
console.log("undefined ?? 'default':", undefined ?? 'default');
console.log("0 ?? 'default':", 0 ?? 'default'); // 0 (not null/undefined)
console.log("'' ?? 'default':", '' ?? 'default'); // '' (not null/undefined)

console.log("\n--- Optional Chaining (?.) ---");
const user = { name: 'John', address: { city: 'NYC' } };
console.log("user?.address?.city:", user?.address?.city);
console.log("user?.address?.country:", user?.address?.country); // undefined
console.log("user?.phone?.number:", user?.phone?.number); // undefined

// 5. Ternary Operator
console.log("\n--- Ternary Operator ---");
const age = 20;
const canVote = age >= 18 ? 'Yes' : 'No';
console.log(`Can vote (age ${age}):`, canVote);

// 6. Spread and Rest Operators
console.log("\n--- Spread Operator (...) ---");
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log("Spread array:", arr2);

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log("Spread object:", obj2);

console.log("\n--- Rest Operator (...) ---");
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log("sum(1, 2, 3, 4):", sum(1, 2, 3, 4));

console.log("\n--- Summary ---");
console.log("✓ Use === instead of ==");
console.log("✓ Understand short-circuit evaluation");
console.log("✓ Use ?? for null/undefined defaults");
console.log("✓ Use ?. for safe property access");

