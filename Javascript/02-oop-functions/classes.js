// Classes in JavaScript

console.log("=== ES6 Classes ===\n");

// 1. Basic Class
console.log("--- Basic Class ---");

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
  }
  
  // Getter
  get info() {
    return `${this.name}, ${this.age}`;
  }
  
  // Setter
  set age(value) {
    if (value < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = value;
  }
  
  get age() {
    return this._age;
  }
  
  // Static method
  static species() {
    return "Homo sapiens";
  }
}

const john = new Person("John", 30);
console.log(john.greet());
console.log("Info:", john.info);
console.log("Species:", Person.species());

// 2. Inheritance
console.log("\n--- Inheritance ---");

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
  
  // New method
  fetch() {
    return `${this.name} fetches the ball`;
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.speak());
console.log(dog.fetch());

// 3. Private Fields (ES2022)
console.log("\n--- Private Fields ---");

class BankAccount {
  #balance; // Private field
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }
  
  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount(1000);
console.log("Balance:", account.balance);
account.deposit(500);
console.log("After deposit:", account.balance);
// console.log(account.#balance); // SyntaxError: Private field

console.log("\n--- Summary ---");
console.log("✓ Classes are syntactic sugar over prototypes");
console.log("✓ Use constructor for initialization");
console.log("✓ Extends for inheritance, super() for parent");
console.log("✓ Private fields with # prefix");

