// Functional Programming in JavaScript

console.log("=== Functional Programming ===\n");

// 1. Pure Functions
console.log("--- Pure Functions ---");

// Impure function (has side effects)
let count = 0;
function impureIncrement() {
  count++; // Modifies external state
  return count;
}

// Pure function (no side effects)
function pureIncrement(num) {
  return num + 1; // Returns new value without mutation
}

console.log(pureIncrement(5)); // 6
console.log(pureIncrement(5)); // 6 (same input, same output)

// 2. Immutability
console.log("\n--- Immutability ---");

// Avoid mutation
const arr = [1, 2, 3];
// BAD: arr.push(4);
// GOOD:
const newArr = [...arr, 4];
console.log(newArr); // [1, 2, 3, 4]

// Object immutability
const user = { name: 'John', age: 30 };
// BAD: user.age = 31;
// GOOD:
const updatedUser = { ...user, age: 31 };
console.log(updatedUser); // { name: 'John', age: 31 }

// 3. First-Class Functions
console.log("\n--- First-Class Functions ---");

// Functions as values
const greet = function(name) {
  return `Hello, ${name}!`;
};

// Functions as arguments
function executeFunction(fn, value) {
  return fn(value);
}

console.log(executeFunction(greet, 'Alice')); // Hello, Alice!

// Functions as return values
function createMultiplier(factor) {
  return function(num) {
    return num * factor;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10

// 4. Higher-Order Functions
console.log("\n--- Higher-Order Functions ---");

// map - transforms each element
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - selects elements
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// reduce - accumulates to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// 5. Function Composition
console.log("\n--- Function Composition ---");

const add5 = x => x + 5;
const multiply3 = x => x * 3;
const subtract2 = x => x - 2;

// Manual composition
const result1 = subtract2(multiply3(add5(10)));
console.log(result1); // 43

// Compose function (right to left)
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

const calculate = compose(subtract2, multiply3, add5);
console.log(calculate(10)); // 43

// Pipe function (left to right)
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const calculate2 = pipe(add5, multiply3, subtract2);
console.log(calculate2(10)); // 43

// 6. Currying
console.log("\n--- Currying ---");

// Regular function
function add(a, b, c) {
  return a + b + c;
}

// Curried function
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Arrow function currying
const curriedAdd2 = a => b => c => a + b + c;
console.log(curriedAdd2(1)(2)(3)); // 6

// Partial application
const add5and = curriedAdd(5);
const add5and3 = add5and(3);
console.log(add5and3(2)); // 10

// 7. Curry Helper Function
console.log("\n--- Curry Helper ---");

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

const add3 = (a, b, c) => a + b + c;
const curriedAdd3 = curry(add3);

console.log(curriedAdd3(1)(2)(3)); // 6
console.log(curriedAdd3(1, 2)(3)); // 6
console.log(curriedAdd3(1)(2, 3)); // 6

// 8. Partial Application
console.log("\n--- Partial Application ---");

function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function greetPerson(greeting, name) {
  return `${greeting}, ${name}!`;
}

const sayHello = partial(greetPerson, 'Hello');
console.log(sayHello('Alice')); // Hello, Alice!
console.log(sayHello('Bob')); // Hello, Bob!

// 9. Closures in FP
console.log("\n--- Closures ---");

function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.value()); // 2

// 10. Recursion
console.log("\n--- Recursion ---");

// Factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120

// Tail recursion (optimized)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc);
}

console.log(factorialTail(5)); // 120

// Sum array recursively
function sumArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumArray(arr.slice(1));
}

console.log(sumArray([1, 2, 3, 4, 5])); // 15

// 11. Memoization
console.log("\n--- Memoization ---");

function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log('Cache hit');
      return cache[key];
    }
    console.log('Computing...');
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const expensiveFunction = memoize((n) => {
  return n * n;
});

console.log(expensiveFunction(5)); // Computing... 25
console.log(expensiveFunction(5)); // Cache hit 25

// 12. Functors and Map
console.log("\n--- Functors ---");

class Box {
  constructor(value) {
    this.value = value;
  }
  
  map(fn) {
    return new Box(fn(this.value));
  }
  
  fold(fn) {
    return fn(this.value);
  }
}

const box = new Box(2)
  .map(x => x + 1)
  .map(x => x * 2);

console.log(box.fold(x => x)); // 6

// 13. Maybe Monad (Handle null/undefined)
console.log("\n--- Maybe Monad ---");

class Maybe {
  constructor(value) {
    this.value = value;
  }
  
  static of(value) {
    return new Maybe(value);
  }
  
  isNothing() {
    return this.value === null || this.value === undefined;
  }
  
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }
  
  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }
}

const maybeValue = Maybe.of(5)
  .map(x => x * 2)
  .map(x => x + 3);

console.log(maybeValue.getOrElse(0)); // 13

const maybeNull = Maybe.of(null)
  .map(x => x * 2)
  .map(x => x + 3);

console.log(maybeNull.getOrElse(0)); // 0

// 14. Function Combinators
console.log("\n--- Combinators ---");

// Identity
const identity = x => x;

// Constant
const constant = x => () => x;
const alwaysFive = constant(5);
console.log(alwaysFive()); // 5

// Flip (reverse arguments)
const flip = fn => (a, b) => fn(b, a);
const divide = (a, b) => a / b;
const flippedDivide = flip(divide);
console.log(divide(10, 2)); // 5
console.log(flippedDivide(10, 2)); // 0.2

// 15. Transducers
console.log("\n--- Transducers (Simplified) ---");

const mapTransducer = fn => reducer => (acc, val) => reducer(acc, fn(val));
const filterTransducer = predicate => reducer => (acc, val) =>
  predicate(val) ? reducer(acc, val) : acc;

const xform = compose(
  mapTransducer(x => x * 2),
  filterTransducer(x => x > 5)
);

const transduce = (xform, reducer, initial, arr) => {
  const transformedReducer = xform(reducer);
  return arr.reduce(transformedReducer, initial);
};

const result = transduce(
  xform,
  (acc, val) => [...acc, val],
  [],
  [1, 2, 3, 4, 5]
);
console.log(result); // [6, 8, 10]

// 16. Practical FP Examples
console.log("\n--- Practical Examples ---");

// Data transformation pipeline
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

const getActiveUserNames = pipe(
  arr => arr.filter(user => user.active),
  arr => arr.map(user => user.name),
  arr => arr.join(', ')
);

console.log(getActiveUserNames(users)); // Alice, Charlie

// Point-free style
const getName = user => user.name;
const isActive = user => user.active;

const activeUserNames = users
  .filter(isActive)
  .map(getName);

console.log(activeUserNames); // ['Alice', 'Charlie']

// 17. Lazy Evaluation
console.log("\n--- Lazy Evaluation ---");

function* lazyMap(fn, iterable) {
  for (const item of iterable) {
    yield fn(item);
  }
}

function* lazyFilter(predicate, iterable) {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

const lazyNumbers = [1, 2, 3, 4, 5];
const lazyResult = lazyFilter(
  x => x > 2,
  lazyMap(x => x * 2, lazyNumbers)
);

console.log([...lazyResult]); // [6, 8, 10]

console.log("\n--- Summary ---");
console.log("✓ Pure functions: no side effects, same input = same output");
console.log("✓ Immutability: avoid mutation, create new values");
console.log("✓ Higher-order functions: map, filter, reduce");
console.log("✓ Function composition: combine small functions");
console.log("✓ Currying: transform f(a,b,c) to f(a)(b)(c)");
console.log("✓ Partial application: preset some arguments");
console.log("✓ Recursion: functions calling themselves");
console.log("✓ Functors & Monads: containers with map operations");
