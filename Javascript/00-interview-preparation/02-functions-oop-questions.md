# Functions and OOP Interview Questions

## Table of Contents

- [Functions](#functions)
- [Closures](#closures)
- [This Keyword](#this-keyword)
- [Prototypes](#prototypes)
- [Classes and OOP](#classes-and-oop)
- [Composition vs Inheritance](#composition-vs-inheritance)

---

## Functions

### Q1: What are the different ways to create functions in JavaScript?

**Answer:**

**1. Function Declaration:**

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

- Hoisted (can be called before declaration)
- Has `this`, `arguments`, can be constructor

**2. Function Expression:**

```javascript
const greet = function(name) {
  return `Hello, ${name}!`;
};
```

- Not hoisted
- Can be anonymous or named
- Has `this`, `arguments`

**3. Arrow Function (ES6):**

```javascript
const greet = (name) => `Hello, ${name}!`;

// With block body
const greet = (name) => {
  return `Hello, ${name}!`;
};
```

- Lexical `this` binding
- No `arguments` object
- Cannot be used as constructor
- Concise syntax

**4. Constructor Function:**

```javascript
function Person(name) {
  this.name = name;
}
const john = new Person('John');
```

**5. Method Shorthand (in objects):**

```javascript
const obj = {
  greet(name) {
    return `Hello, ${name}!`;
  }
};
```

**6. Generator Function:**

```javascript
function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}
```

---

### Q2: What is the difference between arrow functions and regular functions?

**Answer:**

| Feature | Regular Function | Arrow Function |
|---------|-----------------|----------------|
| `this` binding | Dynamic (call site) | Lexical (where defined) |
| `arguments` | Yes | No (use rest parameters) |
| Constructor | Yes | No |
| Hoisting | Yes (declaration) | No |
| Method | Good | Not recommended |
| Callbacks | Good | Excellent |

**Examples:**

```javascript
// 'this' binding difference
const obj = {
  name: 'John',
  
  regularFunc: function() {
    console.log(this.name); // 'John'
  },
  
  arrowFunc: () => {
    console.log(this.name); // undefined (lexical this)
  },
  
  nestedExample: function() {
    // Regular function in callback loses context
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);
    
    // Arrow function maintains context
    setTimeout(() => {
      console.log(this.name); // 'John'
    }, 100);
  }
};

// arguments object
function regular() {
  console.log(arguments); // [1, 2, 3]
}
regular(1, 2, 3);

const arrow = (...args) => {
  console.log(args); // [1, 2, 3]
};
arrow(1, 2, 3);

// Constructor
function RegularConstructor() {
  this.value = 42;
}
new RegularConstructor(); // Works

const ArrowConstructor = () => {
  this.value = 42;
};
// new ArrowConstructor(); // TypeError
```

**When to use:**

- **Arrow functions**: Callbacks, functional programming, maintaining context
- **Regular functions**: Methods, constructors, when you need `arguments`

---

### Q3: What are higher-order functions?

**Answer:**
A higher-order function is a function that:
1. Takes one or more functions as arguments, OR
2. Returns a function as its result

**Examples:**

```javascript
// 1. Function that takes a function as argument
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// 0
// 1
// 2

// 2. Function that returns a function
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// Built-in higher-order functions
const numbers = [1, 2, 3, 4, 5];

// map
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// forEach
numbers.forEach(n => console.log(n));
```

**Practical Examples:**

```javascript
// Function composition
const compose = (...fns) => x => 
  fns.reduceRight((acc, fn) => fn(acc), x);

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const calculate = compose(square, double, addOne);
console.log(calculate(5)); // ((5 + 1) * 2)² = 144

// Partial application
function add(a, b, c) {
  return a + b + c;
}

function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const add5 = partial(add, 5);
console.log(add5(3, 2)); // 10
```

---

## Closures

### Q4: What is a closure?

**Answer:**
A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

**How it works:**

```javascript
function outer() {
  let count = 0;  // This variable is "closed over"
  
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 'count' is not accessible here, but inner function remembers it
```

**Practical Examples:**

```javascript
// 1. Data Privacy (Module Pattern)
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable
  
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
account.deposit(50);
console.log(account.getBalance()); // 150
// account.balance is not accessible (private)

// 2. Function Factory
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// 3. Event Handlers
function setupButtons() {
  for (let i = 0; i < 3; i++) {
    const btn = document.createElement('button');
    btn.textContent = `Button ${i}`;
    
    // Closure captures the current value of i
    btn.addEventListener('click', function() {
      console.log(`Button ${i} clicked`);
    });
  }
}

// 4. Memoization
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // Fast due to memoization
```

**Common Pitfall:**

```javascript
// Wrong: Using var in loop
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3 (var is function-scoped)
  }, 100);
}

// Correct: Using let
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2 (let is block-scoped)
  }, 100);
}

// Alternative: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // 0, 1, 2
    }, 100);
  })(i);
}
```

---

## This Keyword

### Q5: How does the `this` keyword work in JavaScript?

**Answer:**
The value of `this` depends on **how** the function is called, not where it's defined.

**Rules for determining `this`:**

**1. Default Binding (standalone function call):**

```javascript
function show() {
  console.log(this);
}
show(); // window (non-strict) or undefined (strict mode)
```

**2. Implicit Binding (method call):**

```javascript
const obj = {
  name: 'John',
  greet() {
    console.log(this.name);
  }
};

obj.greet(); // 'John' (this = obj)

// Pitfall: Losing context
const greet = obj.greet;
greet(); // undefined (this = window/undefined)
```

**3. Explicit Binding (call, apply, bind):**

```javascript
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const person = { name: 'John' };

greet.call(person, 'Hello');    // Hello, John
greet.apply(person, ['Hi']);    // Hi, John

const boundGreet = greet.bind(person);
boundGreet('Hey');              // Hey, John
```

**4. Constructor Binding (new keyword):**

```javascript
function Person(name) {
  this.name = name;
}

const john = new Person('John');
console.log(john.name); // 'John'
```

**5. Arrow Function (lexical this):**

```javascript
const obj = {
  name: 'John',
  
  regularFunc: function() {
    setTimeout(function() {
      console.log(this.name); // undefined (new context)
    }, 100);
  },
  
  arrowFunc: function() {
    setTimeout(() => {
      console.log(this.name); // 'John' (lexical this)
    }, 100);
  }
};
```

**Precedence (highest to lowest):**

1. `new` binding
2. Explicit binding (call, apply, bind)
3. Implicit binding (method call)
4. Default binding (standalone call)
5. Arrow functions (lexical)

**Practical Examples:**

```javascript
// Event handlers
button.addEventListener('click', function() {
  console.log(this); // button element
});

button.addEventListener('click', () => {
  console.log(this); // lexical this (not button)
});

// Class methods
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
  
  start() {
    // Need to bind this
    setInterval(this.increment.bind(this), 1000);
    
    // Or use arrow function
    setInterval(() => this.increment(), 1000);
  }
}
```

---

## Prototypes

### Q6: What is the prototype chain?

**Answer:**
Every JavaScript object has a prototype (another object) from which it inherits properties and methods. This creates a chain called the prototype chain.

**How it works:**

```javascript
const person = {
  name: 'John'
};

// person.__proto__ points to Object.prototype
console.log(person.__proto__ === Object.prototype); // true

// Prototype chain lookup
person.toString(); // Inherited from Object.prototype
// person -> Object.prototype -> null
```

**Constructor Functions and Prototypes:**

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add methods to prototype (shared across all instances)
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
  return this.age;
};

const john = new Person('John', 30);
const jane = new Person('Jane', 25);

console.log(john.greet()); // Hello, I'm John
console.log(jane.greet()); // Hello, I'm Jane

// Both instances share the same prototype methods
console.log(john.greet === jane.greet); // true
```

**Prototype Chain:**

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  return `${this.name} is eating`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} is barking`;
};

const dog = new Dog('Buddy', 'Golden Retriever');

console.log(dog.bark());  // Buddy is barking
console.log(dog.eat());   // Buddy is eating

// Prototype chain: dog -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
```

**Checking Prototypes:**

```javascript
// Own property vs inherited
dog.hasOwnProperty('name');  // true
dog.hasOwnProperty('eat');   // false (inherited)

// Prototype checking
Object.getPrototypeOf(dog) === Dog.prototype;  // true
dog instanceof Dog;                            // true
dog instanceof Animal;                         // true

// Property lookup
console.log(dog.name);     // Own property
console.log(dog.eat());    // Inherited from Animal.prototype
console.log(dog.toString()); // Inherited from Object.prototype
```

---

## Classes and OOP

### Q7: Explain ES6 classes and how they differ from constructor functions.

**Answer:**
ES6 classes are syntactic sugar over JavaScript's prototype-based inheritance.

**Class Syntax:**

```javascript
class Person {
  // Constructor
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Methods (added to prototype)
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  // Getter
  get info() {
    return `${this.name}, ${this.age} years old`;
  }
  
  // Setter
  set age(value) {
    if (value < 0) {
      throw new Error('Age cannot be negative');
    }
    this._age = value;
  }
  
  get age() {
    return this._age;
  }
  
  // Static method
  static species() {
    return 'Homo sapiens';
  }
}

const john = new Person('John', 30);
console.log(john.greet());
console.log(Person.species());
```

**Inheritance:**

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  
  // Override parent method
  speak() {
    return `${this.name} barks`;
  }
  
  // Call parent method
  makeSound() {
    return super.speak();
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.speak());      // Buddy barks
console.log(dog.makeSound());  // Buddy makes a sound
```

**Class vs Constructor Function:**

```javascript
// Constructor Function
function PersonFunc(name) {
  this.name = name;
}
PersonFunc.prototype.greet = function() {
  return `Hello, ${this.name}`;
};

// Class (equivalent)
class PersonClass {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

// Both create the same prototype chain
// But classes have important differences:

// 1. Classes are not hoisted
const p1 = new PersonFunc('John'); // Works (hoisted)
// const p2 = new PersonClass('Jane'); // ReferenceError

// 2. Classes run in strict mode
// 3. Class methods are non-enumerable
// 4. Classes must be called with 'new'
PersonFunc('John'); // Works (creates global properties)
// PersonClass('Jane'); // TypeError: Class constructor cannot be invoked without 'new'
```

**Private Fields (ES2022):**

```javascript
class BankAccount {
  #balance; // Private field
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }
  
  withdraw(amount) {
    if (amount <= this.#balance) {
      this.#balance -= amount;
      return this.#balance;
    }
    throw new Error('Insufficient funds');
  }
  
  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.balance); // 1500
// console.log(account.#balance); // SyntaxError: Private field
```

---

## Composition vs Inheritance

### Q8: When should you use composition over inheritance in JavaScript?

**Answer:**

**Composition** ("has-a") and **Inheritance** ("is-a") are two ways to build relationships between objects. The principle **"Favor composition over inheritance"** is especially relevant in JavaScript.

**Key Differences:**

| Aspect | Inheritance | Composition |
|--------|-------------|-------------|
| Relationship | "is-a" | "has-a" or "uses-a" |
| Coupling | Tight (child depends on parent) | Loose (components independent) |
| Flexibility | Fixed at definition | Can change at runtime |
| Reusability | Vertical (class hierarchy) | Horizontal (mix behaviors) |
| Testing | Harder (need parent context) | Easier (mock components) |

**When to Use Inheritance:**

✅ Clear "is-a" relationship exists
✅ Shared interface is important
✅ Polymorphism is needed
✅ Shallow hierarchy (2-3 levels max)

**When to Use Composition:**

✅ "has-a" or "uses-a" relationship
✅ Need flexibility and runtime changes
✅ Combining multiple behaviors
✅ Better testability required
✅ Avoiding deep hierarchies

---

**Example 1: The Problem with Inheritance**

```javascript
// ❌ BAD: Inheritance creates rigid hierarchies
class Bird {
  fly() {
    return "Flying in the sky";
  }
}

class Penguin extends Bird {
  // Problem: Penguins can't fly!
  fly() {
    throw new Error("Penguins can't fly!");
  }
}

class Ostrich extends Bird {
  // Problem: Ostriches can't fly either!
  fly() {
    throw new Error("Ostriches can't fly!");
  }
}

// This violates Liskov Substitution Principle
```

**Example 2: Better Solution with Composition**

```javascript
// ✅ GOOD: Composition provides flexibility
const canFly = {
  fly() {
    return `${this.name} is flying`;
  }
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  }
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  }
};

// Factory function with composition
function createBird(name, behaviors) {
  return {
    name,
    ...behaviors
  };
}

const sparrow = createBird('Sparrow', { ...canFly, ...canWalk });
const penguin = createBird('Penguin', { ...canSwim, ...canWalk });
const duck = createBird('Duck', { ...canFly, ...canSwim, ...canWalk });

console.log(sparrow.fly());   // Sparrow is flying
console.log(penguin.swim());  // Penguin is swimming
console.log(duck.fly());      // Duck is flying
console.log(duck.swim());     // Duck is swimming
```

---

**Example 3: Composition with Classes**

```javascript
// Behavior objects (strategies)
class FlyWithWings {
  fly() {
    return "Flying with wings";
  }
}

class FlyNoWay {
  fly() {
    return "Can't fly";
  }
}

class SwimWithLegs {
  swim() {
    return "Swimming with legs";
  }
}

// Using composition in classes
class Bird {
  constructor(name, flyBehavior, swimBehavior = null) {
    this.name = name;
    this.flyBehavior = flyBehavior;
    this.swimBehavior = swimBehavior;
  }

  performFly() {
    return this.flyBehavior.fly();
  }

  performSwim() {
    return this.swimBehavior ? this.swimBehavior.swim() : "Can't swim";
  }

  // Can change behavior at runtime
  setFlyBehavior(flyBehavior) {
    this.flyBehavior = flyBehavior;
  }
}

const sparrow = new Bird('Sparrow', new FlyWithWings());
const penguin = new Bird('Penguin', new FlyNoWay(), new SwimWithLegs());

console.log(sparrow.performFly());  // Flying with wings
console.log(penguin.performFly());  // Can't fly
console.log(penguin.performSwim()); // Swimming with legs

// Runtime behavior change
penguin.setFlyBehavior(new FlyWithWings());
console.log(penguin.performFly());  // Flying with wings
```

---

**Example 4: Object Composition Pattern**

```javascript
// Plugin/mixin approach
const withLogging = (obj) => ({
  ...obj,
  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
});

const withValidation = (obj) => ({
  ...obj,
  validate(data) {
    if (!data) throw new Error('Data is required');
    return true;
  }
});

const withCache = (obj) => {
  const cache = new Map();
  return {
    ...obj,
    getCache(key) {
      return cache.get(key);
    },
    setCache(key, value) {
      cache.set(key, value);
    }
  };
};

// Compose multiple behaviors
const createService = (name) => {
  let service = { name };
  service = withLogging(service);
  service = withValidation(service);
  service = withCache(service);
  return service;
};

const userService = createService('UserService');
userService.log('Service created');
userService.validate({ id: 1 });
userService.setCache('user:1', { name: 'John' });
```

---

**Example 5: Function Composition for Behavior**

```javascript
// Composable functions
const canEat = (state) => ({
  eat(food) {
    console.log(`${state.name} is eating ${food}`);
  }
});

const canSleep = (state) => ({
  sleep(hours) {
    console.log(`${state.name} is sleeping for ${hours} hours`);
  }
});

const canPlay = (state) => ({
  play(game) {
    console.log(`${state.name} is playing ${game}`);
  }
});

// Factory function combining behaviors
const createDog = (name) => {
  const state = { name };
  
  return Object.assign(
    {},
    canEat(state),
    canSleep(state),
    canPlay(state)
  );
};

const createRobot = (name) => {
  const state = { name };
  
  return Object.assign(
    {},
    canPlay(state) // Robots don't eat or sleep
  );
};

const dog = createDog('Buddy');
dog.eat('bone');     // Buddy is eating bone
dog.sleep(8);        // Buddy is sleeping for 8 hours
dog.play('fetch');   // Buddy is playing fetch

const robot = createRobot('R2D2');
robot.play('chess'); // R2D2 is playing chess
// robot.eat(); // Error: robot.eat is not a function
```

---

**Example 6: Real-World Use Case - User Roles**

```javascript
// ❌ BAD: Deep inheritance hierarchy
class User {}
class AdminUser extends User {}
class SuperAdminUser extends AdminUser {}
class GuestUser extends User {}
// Hard to add new roles or combine permissions

// ✅ GOOD: Composition with mixins
const canRead = {
  read(resource) {
    return `Reading ${resource}`;
  }
};

const canWrite = {
  write(resource, data) {
    return `Writing to ${resource}: ${data}`;
  }
};

const canDelete = {
  delete(resource) {
    return `Deleting ${resource}`;
  }
};

const canManageUsers = {
  manageUsers() {
    return 'Managing users';
  }
};

// Create users with different permission sets
function createUser(name, ...permissions) {
  return {
    name,
    ...Object.assign({}, ...permissions)
  };
}

const guest = createUser('Guest', canRead);
const editor = createUser('Editor', canRead, canWrite);
const admin = createUser('Admin', canRead, canWrite, canDelete, canManageUsers);

console.log(guest.read('article'));        // Reading article
console.log(editor.write('post', 'data')); // Writing to post: data
console.log(admin.delete('user'));         // Deleting user
console.log(admin.manageUsers());          // Managing users
```

---

**Decision Tree:**

```
Need to share functionality?
│
├─ Is there a TRUE "is-a" relationship?
│  └─ Yes → Is the hierarchy shallow (2-3 levels)?
│     ├─ Yes → Consider INHERITANCE
│     └─ No → Use COMPOSITION
│
└─ Need to combine multiple behaviors?
   └─ Use COMPOSITION
```

---

**Best Practices:**

1. **Start with Composition** - It's more flexible and easier to refactor
2. **Use Inheritance for Polymorphism** - When you need a shared interface
3. **Keep Hierarchies Shallow** - Max 2-3 levels deep
4. **Prefer Small, Focused Functions** - Easy to compose
5. **Think in Terms of Behaviors** - Not rigid class structures

**Summary:**

- **Composition** gives you flexibility, testability, and the ability to mix behaviors
- **Inheritance** is good for true "is-a" relationships with shallow hierarchies
- Modern JavaScript (and React) heavily favors composition (Hooks, HOCs, Render Props)
- When in doubt, start with composition

---

This covers functions and OOP interview questions. Practice these concepts and move on to async programming questions!

