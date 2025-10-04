/**
 * THE "this" KEYWORD IN JAVASCRIPT
 * 
 * The "this" keyword refers to the context in which a function is executed.
 * Unlike other programming languages, "this" in JavaScript is DYNAMIC - 
 * it's determined by HOW a function is called, not WHERE it's defined.
 * 
 * This is one of the most confusing concepts in JavaScript!
 */

console.log("=== UNDERSTANDING 'this' IN JAVASCRIPT ===\n");

// ============================================================================
// 1. GLOBAL CONTEXT (DEFAULT BINDING)
// ============================================================================

console.log("--- 1. Global Context ---");

function globalFunction() {
  console.log(this);
  // In browser: window object
  // In Node.js (non-strict): global object
  // In strict mode: undefined
}

globalFunction();

function strictModeFunction() {
  'use strict';
  console.log(this); // undefined in strict mode
}

strictModeFunction();

console.log("\n");

// ============================================================================
// 2. IMPLICIT BINDING (METHOD CALL)
// ============================================================================

console.log("--- 2. Implicit Binding (Object Method) ---");

const person = {
  name: 'John',
  age: 30,
  greet: function() {
    console.log(`Hello, I'm ${this.name} and I'm ${this.age} years old`);
    console.log('this:', this);
  }
};

person.greet(); // 'this' refers to 'person' object
console.log("\n");

// PITFALL: Losing context when extracting method
console.log("--- Pitfall: Losing Context ---");

const greetFunction = person.greet;
// greetFunction(); // Error or undefined! 'this' is now global/undefined

// Solution 1: Use bind
const boundGreet = person.greet.bind(person);
boundGreet(); // Works! 'this' is bound to 'person'

// Solution 2: Use arrow function
const arrowGreet = () => person.greet();
arrowGreet(); // Works! Calls method on person

console.log("\n");

// ============================================================================
// 3. EXPLICIT BINDING (call, apply, bind)
// ============================================================================

console.log("--- 3. Explicit Binding (call, apply, bind) ---");

function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

// Using call() - pass arguments individually
introduce.call(user1, 'Hello', '!');      // Hello, I'm Alice!
introduce.call(user2, 'Hi', '.');         // Hi, I'm Bob.

// Using apply() - pass arguments as array
introduce.apply(user1, ['Greetings', '!']); // Greetings, I'm Alice!
introduce.apply(user2, ['Hey', '?']);       // Hey, I'm Bob?

// Using bind() - create new function with fixed 'this'
const introduceAlice = introduce.bind(user1);
introduceAlice('Welcome', '!!!'); // Welcome, I'm Alice!!!

console.log("\n");

// ============================================================================
// 4. NEW BINDING (Constructor Function)
// ============================================================================

console.log("--- 4. New Binding (Constructor) ---");

function Person(name, age) {
  // When called with 'new', 'this' refers to the new object
  this.name = name;
  this.age = age;
  this.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
const jane = new Person('Jane', 25);

john.greet(); // Hi, I'm John
jane.greet(); // Hi, I'm Jane

console.log('john:', john);
console.log("\n");

// ============================================================================
// 5. ARROW FUNCTIONS (LEXICAL 'this')
// ============================================================================

console.log("--- 5. Arrow Functions (Lexical 'this') ---");

// Arrow functions DON'T have their own 'this'
// They inherit 'this' from the enclosing scope

const team = {
  name: 'Development Team',
  members: ['Alice', 'Bob', 'Charlie'],
  
  // Regular function
  showMembersRegular: function() {
    console.log(`Team: ${this.name}`);
    
    // Problem: 'this' in callback loses context
    this.members.forEach(function(member) {
      // 'this' here is undefined (strict mode) or global
      // console.log(`${this.name} - ${member}`); // Error!
      console.log(`Regular function - ${member}`);
    });
  },
  
  // Arrow function solution
  showMembersArrow: function() {
    console.log(`Team: ${this.name}`);
    
    // Arrow function inherits 'this' from showMembersArrow
    this.members.forEach((member) => {
      console.log(`${this.name} - ${member}`); // Works!
    });
  }
};

team.showMembersRegular();
console.log();
team.showMembersArrow();

console.log("\n");

// ============================================================================
// 6. CLASS CONTEXT
// ============================================================================

console.log("--- 6. Classes and 'this' ---");

class Counter {
  constructor() {
    this.count = 0;
  }
  
  // Regular method
  increment() {
    this.count++;
    console.log(`Count: ${this.count}`);
  }
  
  // Arrow function as class field (maintains context)
  incrementArrow = () => {
    this.count++;
    console.log(`Count (arrow): ${this.count}`);
  }
  
  start() {
    // Problem: 'this' lost in setTimeout with regular function
    setTimeout(function() {
      // this.increment(); // Error! 'this' is undefined
      console.log("Regular function in setTimeout - 'this' lost");
    }, 100);
    
    // Solution 1: Arrow function
    setTimeout(() => {
      this.increment(); // Works! Arrow function inherits 'this'
    }, 200);
    
    // Solution 2: Bind
    setTimeout(this.increment.bind(this), 300);
    
    // Solution 3: Use arrow function method
    setTimeout(this.incrementArrow, 400);
  }
}

const counter = new Counter();
counter.increment(); // Works
counter.start(); // Demonstrates different solutions

console.log("\n");

// ============================================================================
// 7. EVENT HANDLERS
// ============================================================================

console.log("--- 7. Event Handlers (Browser Context) ---");

// In browser:
// button.addEventListener('click', function() {
//   console.log(this); // 'this' refers to the button element
// });

// With arrow function:
// button.addEventListener('click', () => {
//   console.log(this); // 'this' refers to enclosing scope, not button
// });

// Simulated example
const button = {
  label: 'Click Me',
  
  handleClick: function() {
    console.log(`Button "${this.label}" clicked`);
  },
  
  handleClickArrow: () => {
    // Arrow function - 'this' is from outer scope, not button
    // console.log(`Button "${this.label}" clicked`); // Won't work as expected
    console.log("Arrow function - 'this' doesn't refer to button");
  }
};

button.handleClick(); // Works
button.handleClickArrow(); // Demonstrates limitation

console.log("\n");

// ============================================================================
// 8. COMMON PATTERNS AND SOLUTIONS
// ============================================================================

console.log("--- 8. Common Patterns ---");

// Pattern 1: Storing 'this' reference
const widget = {
  name: 'Widget',
  init: function() {
    const self = this; // Store reference to 'this'
    
    setTimeout(function() {
      console.log(`Initialized ${self.name}`); // Works!
    }, 100);
  }
};

widget.init();

// Pattern 2: Using bind in constructor
class Timer {
  constructor(name) {
    this.name = name;
    this.tick = this.tick.bind(this); // Bind in constructor
  }
  
  tick() {
    console.log(`${this.name} ticked`);
  }
  
  start() {
    setTimeout(this.tick, 200); // 'this' is bound
  }
}

const timer = new Timer('MyTimer');
timer.start();

console.log("\n");

// ============================================================================
// 9. PRECEDENCE RULES
// ============================================================================

console.log("--- 9. Precedence Rules (Highest to Lowest) ---");

console.log(`
1. Arrow Functions - Lexical 'this' (inherits from enclosing scope)
2. new binding - When called with 'new' keyword
3. Explicit binding - call(), apply(), bind()
4. Implicit binding - Object method call
5. Default binding - Global object or undefined (strict mode)
`);

// Example showing precedence
function showThis() {
  console.log(this.value);
}

const obj1 = { value: 'obj1' };
const obj2 = { value: 'obj2' };

// Default binding
// showThis(); // undefined (strict) or global

// Implicit binding
obj1.showThis = showThis;
obj1.showThis(); // 'obj1'

// Explicit binding (higher precedence than implicit)
obj1.showThis.call(obj2); // 'obj2'

// New binding (highest precedence)
function Value(val) {
  this.value = val;
}

const boundValue = Value.bind(obj1);
const instance = new boundValue('new instance');
console.log(instance.value); // 'new instance' (not 'obj1')

console.log("\n");

// ============================================================================
// 10. PRACTICAL EXAMPLES
// ============================================================================

console.log("--- 10. Practical Examples ---");

// Example 1: API Client
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  // Using arrow function to preserve 'this'
  fetchData = async (endpoint) => {
    console.log(`Fetching from ${this.baseURL}${endpoint}`);
    // In real code: return fetch(this.baseURL + endpoint)
  }
  
  // Regular method
  setBaseURL(url) {
    this.baseURL = url;
  }
}

const client = new APIClient('https://api.example.com');
client.fetchData('/users');

// Can pass method reference safely because it's an arrow function
const fetch = client.fetchData;
fetch('/posts'); // Still works!

console.log();

// Example 2: Event Manager
class EventManager {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this; // Method chaining
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback.call(this, data); // Call with manager as context
      });
    }
    return this;
  }
}

const manager = new EventManager();
manager
  .on('message', function(data) {
    console.log(`Event manager received: ${data}`);
  })
  .emit('message', 'Hello World');

console.log("\n");

// ============================================================================
// 11. QUIZ: TEST YOUR UNDERSTANDING
// ============================================================================

console.log("--- 11. Quiz ---\n");

console.log("What will each of these log?");

// Question 1
const quiz1 = {
  value: 1,
  getValue: function() {
    return this.value;
  }
};
const getValue = quiz1.getValue;
console.log("Q1:", quiz1.getValue()); // 1
// console.log("Q2:", getValue());     // undefined or error

// Question 2
const quiz2 = {
  value: 2,
  getValue: () => {
    return this.value;
  }
};
console.log("Q3:", quiz2.getValue()); // undefined (arrow function)

// Question 3
function Quiz3() {
  this.value = 3;
  return {
    value: 4
  };
}
const q3 = new Quiz3();
console.log("Q4:", q3.value); // 4 (returned object overrides)

// Question 4
const quiz4 = {
  value: 5,
  nested: {
    value: 6,
    getValue: function() {
      return this.value;
    }
  }
};
console.log("Q5:", quiz4.nested.getValue()); // 6 ('this' is nested object)

console.log("\n");

// ============================================================================
// 12. BEST PRACTICES
// ============================================================================

console.log("--- 12. Best Practices ---\n");

console.log(`
✅ DO:
- Use arrow functions for callbacks and preserving context
- Use bind() when passing methods as callbacks
- Use regular functions for object methods
- Use arrow functions as class fields when needed
- Be consistent in your approach

❌ DON'T:
- Use arrow functions as object methods
- Use arrow functions as constructors
- Rely on 'this' in arrow functions at global scope
- Mix patterns unnecessarily

📌 TIPS:
- When in doubt, console.log(this) to debug
- Remember: arrow functions don't have their own 'this'
- Use 'use strict' to catch 'this' errors early
- In React/Vue, bind handlers in constructor or use arrow functions
`);

// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== SUMMARY ===\n");

console.log(`
The 'this' keyword refers to the execution context:

1. Global Context: global object or undefined (strict)
2. Object Method: the object before the dot
3. call/apply/bind: explicitly set context
4. Constructor (new): newly created object
5. Arrow Function: lexical scope (inherited)

Key Points:
• 'this' is determined by HOW a function is called
• Arrow functions inherit 'this' from parent scope
• Use bind() to permanently set 'this'
• Common gotcha: callbacks lose context
• Solutions: arrow functions, bind(), or store reference

Remember: Understanding 'this' is crucial for mastering JavaScript!
`);
