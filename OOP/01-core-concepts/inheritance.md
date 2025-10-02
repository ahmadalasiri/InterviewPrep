# Inheritance

## Overview

Inheritance is a fundamental concept in Object-Oriented Programming that allows a class (child/derived class) to inherit properties and methods from another class (parent/base class). This promotes code reusability and establishes a natural hierarchy between classes.

## Key Concepts

### What is Inheritance?

Inheritance enables a new class to acquire the properties and behaviors of an existing class. The new class is called:

- **Child class** / **Derived class** / **Subclass**
- The existing class is called:
- **Parent class** / **Base class** / **Superclass**

### Benefits

1. **Code Reusability** - Avoid duplicating code by inheriting from existing classes
2. **Extensibility** - Easily extend functionality without modifying existing code
3. **Hierarchical Classification** - Model real-world relationships naturally
4. **Polymorphism** - Enable polymorphic behavior through inheritance
5. **Maintainability** - Changes in base class automatically reflect in derived classes

### Types of Inheritance

1. **Single Inheritance** - One child class inherits from one parent class
2. **Multilevel Inheritance** - Class inherits from a class which inherits from another class
3. **Hierarchical Inheritance** - Multiple child classes inherit from one parent class
4. **Multiple Inheritance** - One class inherits from multiple parent classes (not supported in all languages)
5. **Hybrid Inheritance** - Combination of multiple types

## TypeScript Examples

### Basic Inheritance

```typescript
// Base class
class Animal {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  makeSound(): void {
    console.log("Some generic animal sound");
  }

  getInfo(): string {
    return `${this.name} is ${this.age} years old`;
  }
}

// Derived class
class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  // Override parent method
  makeSound(): void {
    console.log("Woof! Woof!");
  }

  // Additional method
  fetch(): void {
    console.log(`${this.name} is fetching the ball!`);
  }

  // Override parent method with additional info
  getInfo(): string {
    return `${super.getInfo()} and is a ${this.breed}`;
  }
}

// Usage
const myDog = new Dog("Buddy", 3, "Golden Retriever");
console.log(myDog.getInfo()); // Buddy is 3 years old and is a Golden Retriever
myDog.makeSound(); // Woof! Woof!
myDog.fetch(); // Buddy is fetching the ball!
```

### Multilevel Inheritance

```typescript
// Level 1: Base class
class Vehicle {
  protected brand: string;
  protected year: number;

  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }

  start(): void {
    console.log(`${this.brand} vehicle is starting...`);
  }

  getDetails(): string {
    return `${this.brand} (${this.year})`;
  }
}

// Level 2: Intermediate class
class Car extends Vehicle {
  protected numberOfDoors: number;

  constructor(brand: string, year: number, doors: number) {
    super(brand, year);
    this.numberOfDoors = doors;
  }

  openTrunk(): void {
    console.log("Trunk is open");
  }

  getDetails(): string {
    return `${super.getDetails()} - ${this.numberOfDoors} doors`;
  }
}

// Level 3: Most derived class
class ElectricCar extends Car {
  private batteryCapacity: number;

  constructor(brand: string, year: number, doors: number, battery: number) {
    super(brand, year, doors);
    this.batteryCapacity = battery;
  }

  charge(): void {
    console.log(
      `Charging ${this.brand} with ${this.batteryCapacity}kWh battery`
    );
  }

  getDetails(): string {
    return `${super.getDetails()} - ${this.batteryCapacity}kWh battery`;
  }
}

// Usage
const tesla = new ElectricCar("Tesla Model 3", 2023, 4, 75);
tesla.start(); // Tesla Model 3 vehicle is starting...
tesla.openTrunk(); // Trunk is open
tesla.charge(); // Charging Tesla Model 3 with 75kWh battery
console.log(tesla.getDetails()); // Tesla Model 3 (2023) - 4 doors - 75kWh battery
```

### Hierarchical Inheritance

```typescript
// Base class
class Employee {
  protected name: string;
  protected id: string;
  protected baseSalary: number;

  constructor(name: string, id: string, baseSalary: number) {
    this.name = name;
    this.id = id;
    this.baseSalary = baseSalary;
  }

  getInfo(): string {
    return `${this.name} (ID: ${this.id})`;
  }

  calculateSalary(): number {
    return this.baseSalary;
  }
}

// Child class 1
class Manager extends Employee {
  private teamSize: number;
  private bonus: number;

  constructor(name: string, id: string, baseSalary: number, teamSize: number) {
    super(name, id, baseSalary);
    this.teamSize = teamSize;
    this.bonus = teamSize * 1000;
  }

  calculateSalary(): number {
    return this.baseSalary + this.bonus;
  }

  managTeam(): void {
    console.log(`${this.name} manages a team of ${this.teamSize}`);
  }
}

// Child class 2
class Developer extends Employee {
  private programmingLanguages: string[];
  private projectBonus: number;

  constructor(
    name: string,
    id: string,
    baseSalary: number,
    languages: string[]
  ) {
    super(name, id, baseSalary);
    this.programmingLanguages = languages;
    this.projectBonus = languages.length * 500;
  }

  calculateSalary(): number {
    return this.baseSalary + this.projectBonus;
  }

  code(): void {
    console.log(
      `${this.name} codes in: ${this.programmingLanguages.join(", ")}`
    );
  }
}

// Child class 3
class Designer extends Employee {
  private tools: string[];

  constructor(name: string, id: string, baseSalary: number, tools: string[]) {
    super(name, id, baseSalary);
    this.tools = tools;
  }

  design(): void {
    console.log(`${this.name} designs using: ${this.tools.join(", ")}`);
  }
}

// Usage
const manager = new Manager("Alice", "M001", 80000, 5);
const developer = new Developer("Bob", "D001", 70000, [
  "TypeScript",
  "Python",
  "Go",
]);
const designer = new Designer("Charlie", "DS001", 65000, [
  "Figma",
  "Photoshop",
]);

console.log(manager.calculateSalary()); // 85000
console.log(developer.calculateSalary()); // 71500
console.log(designer.calculateSalary()); // 65000

manager.managTeam(); // Alice manages a team of 5
developer.code(); // Bob codes in: TypeScript, Python, Go
designer.design(); // Charlie designs using: Figma, Photoshop
```

### Protected Members and Inheritance

```typescript
class BankAccount {
  protected balance: number;
  private accountNumber: string;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }

  protected getAccountNumber(): string {
    return this.accountNumber;
  }

  public getBalance(): number {
    return this.balance;
  }

  public deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited: $${amount}`);
  }
}

class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(
    accountNumber: string,
    initialBalance: number,
    interestRate: number
  ) {
    super(accountNumber, initialBalance);
    this.interestRate = interestRate;
  }

  // Can access protected members
  applyInterest(): void {
    const interest = this.balance * this.interestRate;
    this.balance += interest;
    console.log(`Interest applied: $${interest.toFixed(2)}`);
  }

  getAccountInfo(): string {
    // Can access protected method
    return `Account: ${this.getAccountNumber()}, Balance: $${this.balance}`;
  }
}

// Usage
const savings = new SavingsAccount("SAV123", 1000, 0.05);
savings.deposit(500); // Deposited: $500
savings.applyInterest(); // Interest applied: $75.00
console.log(savings.getAccountInfo()); // Account: SAV123, Balance: $1575
```

### Method Overriding

```typescript
class Shape {
  protected color: string;

  constructor(color: string) {
    this.color = color;
  }

  // Method to be overridden
  calculateArea(): number {
    return 0;
  }

  // Method to be overridden
  draw(): void {
    console.log(`Drawing a ${this.color} shape`);
  }

  // Common method
  getColor(): string {
    return this.color;
  }
}

class Circle extends Shape {
  private radius: number;

  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }

  // Override calculateArea
  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  // Override draw
  draw(): void {
    console.log(`Drawing a ${this.color} circle with radius ${this.radius}`);
  }
}

class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(color: string, width: number, height: number) {
    super(color);
    this.width = width;
    this.height = height;
  }

  // Override calculateArea
  calculateArea(): number {
    return this.width * this.height;
  }

  // Override draw
  draw(): void {
    console.log(
      `Drawing a ${this.color} rectangle (${this.width}x${this.height})`
    );
  }
}

// Usage
const shapes: Shape[] = [new Circle("red", 5), new Rectangle("blue", 4, 6)];

shapes.forEach((shape) => {
  shape.draw();
  console.log(`Area: ${shape.calculateArea().toFixed(2)}`);
});
```

## Best Practices

### 1. Use "Is-A" Relationship

Only use inheritance when there's a clear "is-a" relationship:

```typescript
// ✅ Good: Dog IS-A Animal
class Animal {}
class Dog extends Animal {}

// ❌ Bad: Car HAS-A Engine (not IS-A)
class Engine {}
class Car extends Engine {} // Wrong! Use composition instead
```

### 2. Don't Inherit for Code Reuse Alone

```typescript
// ❌ Bad: Inheriting just to reuse utility methods
class Utils {
  formatDate(date: Date): string {
    return date.toISOString();
  }
}

class User extends Utils {
  // Wrong!
  name: string;
}

// ✅ Good: Use composition
class DateUtils {
  static formatDate(date: Date): string {
    return date.toISOString();
  }
}

class User {
  name: string;

  getFormattedCreatedDate(): string {
    return DateUtils.formatDate(new Date());
  }
}
```

### 3. Keep Inheritance Hierarchies Shallow

```typescript
// ❌ Bad: Too deep
class A {}
class B extends A {}
class C extends B {}
class D extends C {}
class E extends D {}
class F extends E {} // Too deep!

// ✅ Good: Shallow hierarchy (3-4 levels max)
class Entity {}
class User extends Entity {}
class PremiumUser extends User {}
```

### 4. Make Base Classes Abstract When Appropriate

```typescript
// ✅ Good: Abstract base class
abstract class Payment {
  protected amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  // Abstract method - must be implemented by subclasses
  abstract processPayment(): void;

  // Concrete method - shared by all subclasses
  getAmount(): number {
    return this.amount;
  }
}

class CreditCardPayment extends Payment {
  private cardNumber: string;

  constructor(amount: number, cardNumber: string) {
    super(amount);
    this.cardNumber = cardNumber;
  }

  processPayment(): void {
    console.log(`Processing credit card payment of $${this.amount}`);
  }
}

class PayPalPayment extends Payment {
  private email: string;

  constructor(amount: number, email: string) {
    super(amount);
    this.email = email;
  }

  processPayment(): void {
    console.log(`Processing PayPal payment of $${this.amount}`);
  }
}
```

### 5. Use `super` Appropriately

```typescript
class Parent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet(): void {
    console.log(`Hello from ${this.name}`);
  }
}

class Child extends Parent {
  private age: number;

  constructor(name: string, age: number) {
    super(name); // ✅ Always call super() first in constructor
    this.age = age;
  }

  greet(): void {
    super.greet(); // ✅ Call parent method when extending behavior
    console.log(`I am ${this.age} years old`);
  }
}
```

## Common Pitfalls

### 1. Fragile Base Class Problem

Changes in the base class can break derived classes:

```typescript
// Base class
class Counter {
  private count = 0;

  increment(): void {
    this.count++;
  }

  getCount(): number {
    return this.count;
  }
}

// Derived class depends on base implementation
class DoubleCounter extends Counter {
  increment(): void {
    super.increment();
    super.increment(); // Calls parent twice
  }
}

// If base class changes to use increment() in other methods,
// DoubleCounter might break
```

### 2. Violating Liskov Substitution Principle

```typescript
// ❌ Bad: Square breaks Rectangle's behavior
class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }

  // Breaking LSP: changing width also changes height
  setWidth(width: number): void {
    this.width = width;
    this.height = width;
  }

  setHeight(height: number): void {
    this.width = height;
    this.height = height;
  }
}
```

## When to Use Inheritance vs Composition

### Use Inheritance When:

- There's a clear "is-a" relationship
- You want to leverage polymorphism
- Subclass is a specialized version of the parent
- You need to override behavior

### Use Composition When:

- There's a "has-a" relationship
- You want more flexibility
- You need to compose behavior from multiple sources
- Inheritance hierarchy would be complex

```typescript
// Inheritance: "is-a"
class Vehicle {}
class Car extends Vehicle {} // Car IS-A Vehicle

// Composition: "has-a"
class Engine {}
class Car {
  private engine: Engine; // Car HAS-AN Engine

  constructor() {
    this.engine = new Engine();
  }
}
```

## Interview Questions

1. **What is inheritance and why is it important?**
2. **Explain the difference between `extends` and `implements` in TypeScript**
3. **What is the purpose of the `super` keyword?**
4. **Can you override private methods in derived classes?**
5. **What is the difference between method overriding and method overloading?**
6. **When would you use abstract classes?**
7. **Explain the Liskov Substitution Principle**
8. **What are the disadvantages of inheritance?**
9. **How do you prevent a class from being inherited?**
10. **What is the difference between protected and private access modifiers?**

## Summary

- Inheritance allows classes to inherit properties and methods from parent classes
- Use inheritance for "is-a" relationships
- TypeScript supports single inheritance (one parent class)
- Use `extends` keyword for inheritance
- Use `super` to call parent constructor and methods
- Override methods to provide specific implementations
- Keep inheritance hierarchies shallow (3-4 levels max)
- Consider composition over inheritance for flexibility
- Use abstract classes to define contracts for derived classes

---

**Next Steps:**

- Study [Polymorphism](polymorphism.md) to see how inheritance enables polymorphic behavior
- Learn about [Composition vs Inheritance](../02-advanced-concepts/composition-vs-inheritance.md)
- Practice with [TypeScript Examples](../05-practical-examples/typescript/)
