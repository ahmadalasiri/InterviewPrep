# Polymorphism

## Overview

Polymorphism is a core concept in Object-Oriented Programming that allows objects of different types to be treated as objects of a common parent type. The word "polymorphism" means "many forms" - it enables a single interface to represent different underlying forms (data types).

## Key Concepts

### What is Polymorphism?

Polymorphism allows methods to do different things based on the object they are acting upon. It provides flexibility and reusability in code by allowing the same interface to be used for different data types.

### Types of Polymorphism

1. **Compile-Time Polymorphism (Static Binding)**

   - Method Overloading
   - Operator Overloading
   - Resolved at compile time

2. **Runtime Polymorphism (Dynamic Binding)**
   - Method Overriding
   - Interface Implementation
   - Resolved at runtime

### Benefits

1. **Code Reusability** - Write generic code that works with multiple types
2. **Flexibility** - Easy to extend and maintain
3. **Loose Coupling** - Reduces dependencies between components
4. **Extensibility** - Add new types without modifying existing code
5. **Maintainability** - Changes in one class don't affect others

## TypeScript Examples

### Method Overriding (Runtime Polymorphism)

```typescript
// Base class
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound(): void {
    console.log("Some generic animal sound");
  }

  move(): void {
    console.log(`${this.name} is moving`);
  }
}

// Derived classes with overridden methods
class Dog extends Animal {
  makeSound(): void {
    console.log("Woof! Woof!");
  }

  move(): void {
    console.log(`${this.name} is running on four legs`);
  }
}

class Bird extends Animal {
  makeSound(): void {
    console.log("Tweet! Tweet!");
  }

  move(): void {
    console.log(`${this.name} is flying in the sky`);
  }
}

class Fish extends Animal {
  makeSound(): void {
    console.log("Blub! Blub!");
  }

  move(): void {
    console.log(`${this.name} is swimming in water`);
  }
}

// Polymorphic behavior
function makeAnimalPerform(animal: Animal): void {
  animal.makeSound(); // Different behavior based on actual type
  animal.move();
  console.log("---");
}

// Usage
const animals: Animal[] = [
  new Dog("Buddy"),
  new Bird("Tweety"),
  new Fish("Nemo"),
];

animals.forEach((animal) => makeAnimalPerform(animal));
// Output:
// Woof! Woof!
// Buddy is running on four legs
// ---
// Tweet! Tweet!
// Tweety is flying in the sky
// ---
// Blub! Blub!
// Nemo is swimming in water
// ---
```

### Method Overloading (Compile-Time Polymorphism)

TypeScript supports method overloading through function signatures:

```typescript
class Calculator {
  // Method overloading - multiple signatures
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number[], b: number[]): number[];

  // Implementation that handles all cases
  add(a: any, b: any): any {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
      return a + b;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }
    throw new Error("Unsupported types");
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.add("Hello, ", "World!")); // Hello, World!
console.log(calc.add([1, 2], [3, 4])); // [1, 2, 3, 4]
```

### Interface-Based Polymorphism

```typescript
// Define interface
interface PaymentMethod {
  processPayment(amount: number): void;
  refund(amount: number): void;
}

// Multiple implementations
class CreditCard implements PaymentMethod {
  private cardNumber: string;

  constructor(cardNumber: string) {
    this.cardNumber = cardNumber;
  }

  processPayment(amount: number): void {
    console.log(`Processing credit card payment of $${amount}`);
    console.log(`Card: ****${this.cardNumber.slice(-4)}`);
  }

  refund(amount: number): void {
    console.log(`Refunding $${amount} to credit card`);
  }
}

class PayPal implements PaymentMethod {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  processPayment(amount: number): void {
    console.log(`Processing PayPal payment of $${amount}`);
    console.log(`Account: ${this.email}`);
  }

  refund(amount: number): void {
    console.log(`Refunding $${amount} to PayPal account`);
  }
}

class Cryptocurrency implements PaymentMethod {
  private walletAddress: string;

  constructor(walletAddress: string) {
    this.walletAddress = walletAddress;
  }

  processPayment(amount: number): void {
    console.log(`Processing crypto payment of $${amount}`);
    console.log(`Wallet: ${this.walletAddress.substring(0, 10)}...`);
  }

  refund(amount: number): void {
    console.log(`Refunding $${amount} to crypto wallet`);
  }
}

// Polymorphic function
class PaymentProcessor {
  static processTransaction(method: PaymentMethod, amount: number): void {
    console.log("\n=== Starting Transaction ===");
    method.processPayment(amount);
    console.log("=== Transaction Complete ===\n");
  }
}

// Usage - all types work with same interface
const creditCard = new CreditCard("1234567890123456");
const paypal = new PayPal("user@example.com");
const crypto = new Cryptocurrency("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");

PaymentProcessor.processTransaction(creditCard, 100);
PaymentProcessor.processTransaction(paypal, 75);
PaymentProcessor.processTransaction(crypto, 50);
```

### Abstract Class Polymorphism

```typescript
abstract class Shape {
  protected color: string;

  constructor(color: string) {
    this.color = color;
  }

  // Abstract methods - must be implemented by subclasses
  abstract calculateArea(): number;
  abstract calculatePerimeter(): number;

  // Concrete method - shared by all shapes
  display(): void {
    console.log(`\nShape: ${this.constructor.name}`);
    console.log(`Color: ${this.color}`);
    console.log(`Area: ${this.calculateArea().toFixed(2)}`);
    console.log(`Perimeter: ${this.calculatePerimeter().toFixed(2)}`);
  }
}

class Circle extends Shape {
  private radius: number;

  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
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

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Triangle extends Shape {
  private side1: number;
  private side2: number;
  private side3: number;

  constructor(color: string, side1: number, side2: number, side3: number) {
    super(color);
    this.side1 = side1;
    this.side2 = side2;
    this.side3 = side3;
  }

  calculateArea(): number {
    const s = this.calculatePerimeter() / 2;
    return Math.sqrt(
      s * (s - this.side1) * (s - this.side2) * (s - this.side3)
    );
  }

  calculatePerimeter(): number {
    return this.side1 + this.side2 + this.side3;
  }
}

// Polymorphic usage
const shapes: Shape[] = [
  new Circle("Red", 5),
  new Rectangle("Blue", 4, 6),
  new Triangle("Green", 3, 4, 5),
];

// Same method call works for all shapes
shapes.forEach((shape) => shape.display());
```

### Real-World Example: Notification System

```typescript
// Common interface
interface Notification {
  send(recipient: string, message: string): void;
  schedule(recipient: string, message: string, time: Date): void;
}

class EmailNotification implements Notification {
  private senderEmail: string;

  constructor(senderEmail: string) {
    this.senderEmail = senderEmail;
  }

  send(recipient: string, message: string): void {
    console.log(`\n📧 Sending EMAIL`);
    console.log(`From: ${this.senderEmail}`);
    console.log(`To: ${recipient}`);
    console.log(`Message: ${message}`);
  }

  schedule(recipient: string, message: string, time: Date): void {
    console.log(`📅 Email scheduled for ${time.toLocaleString()}`);
  }
}

class SMSNotification implements Notification {
  private phoneNumber: string;

  constructor(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  send(recipient: string, message: string): void {
    console.log(`\n📱 Sending SMS`);
    console.log(`From: ${this.phoneNumber}`);
    console.log(`To: ${recipient}`);
    console.log(`Message: ${message}`);
  }

  schedule(recipient: string, message: string, time: Date): void {
    console.log(`📅 SMS scheduled for ${time.toLocaleString()}`);
  }
}

class PushNotification implements Notification {
  private appName: string;

  constructor(appName: string) {
    this.appName = appName;
  }

  send(recipient: string, message: string): void {
    console.log(`\n🔔 Sending PUSH NOTIFICATION`);
    console.log(`App: ${this.appName}`);
    console.log(`To: ${recipient}`);
    console.log(`Message: ${message}`);
  }

  schedule(recipient: string, message: string, time: Date): void {
    console.log(`📅 Push notification scheduled for ${time.toLocaleString()}`);
  }
}

class SlackNotification implements Notification {
  private workspace: string;

  constructor(workspace: string) {
    this.workspace = workspace;
  }

  send(recipient: string, message: string): void {
    console.log(`\n💬 Sending SLACK MESSAGE`);
    console.log(`Workspace: ${this.workspace}`);
    console.log(`Channel: ${recipient}`);
    console.log(`Message: ${message}`);
  }

  schedule(recipient: string, message: string, time: Date): void {
    console.log(`📅 Slack message scheduled for ${time.toLocaleString()}`);
  }
}

// Notification service that works with any notification type
class NotificationService {
  private notifications: Notification[] = [];

  addNotificationChannel(notification: Notification): void {
    this.notifications.push(notification);
  }

  notifyAll(recipient: string, message: string): void {
    console.log("\n=== Broadcasting Notification ===");
    this.notifications.forEach((notification) => {
      notification.send(recipient, message);
    });
    console.log("\n=== Broadcast Complete ===");
  }
}

// Usage
const notificationService = new NotificationService();

notificationService.addNotificationChannel(
  new EmailNotification("no-reply@company.com")
);
notificationService.addNotificationChannel(new SMSNotification("+1-555-0123"));
notificationService.addNotificationChannel(new PushNotification("MyApp"));
notificationService.addNotificationChannel(
  new SlackNotification("company-workspace")
);

notificationService.notifyAll(
  "#general",
  "System maintenance scheduled for tonight!"
);
```

### Duck Typing (Structural Typing)

TypeScript uses structural typing, which is a form of polymorphism:

```typescript
// No explicit interface declaration needed
class Duck {
  quack(): void {
    console.log("Quack! Quack!");
  }

  swim(): void {
    console.log("Duck is swimming");
  }
}

class Person {
  quack(): void {
    console.log("Person imitating duck: Quack!");
  }

  swim(): void {
    console.log("Person is swimming");
  }
}

class Robot {
  quack(): void {
    console.log("Robot quacking: QUACK.EXE");
  }

  swim(): void {
    console.log("Robot swimming: SWIM_MODE_ACTIVATED");
  }
}

// Function that accepts anything with quack() and swim() methods
function makeDuck(duck: { quack(): void; swim(): void }): void {
  duck.quack();
  duck.swim();
}

// All work due to structural typing
makeDuck(new Duck());
makeDuck(new Person());
makeDuck(new Robot());
```

## Advanced Polymorphism Patterns

### Generic Polymorphism

```typescript
// Generic repository pattern
interface Repository<T> {
  add(item: T): void;
  remove(id: string): void;
  findById(id: string): T | undefined;
  getAll(): T[];
}

class InMemoryRepository<T extends { id: string }> implements Repository<T> {
  private items: Map<string, T> = new Map();

  add(item: T): void {
    this.items.set(item.id, item);
    console.log(`Added item with ID: ${item.id}`);
  }

  remove(id: string): void {
    this.items.delete(id);
    console.log(`Removed item with ID: ${id}`);
  }

  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }
}

// Usage with different types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const userRepo = new InMemoryRepository<User>();
userRepo.add({ id: "1", name: "Alice", email: "alice@example.com" });

const productRepo = new InMemoryRepository<Product>();
productRepo.add({ id: "1", name: "Laptop", price: 999 });
```

### Strategy Pattern (Polymorphic Algorithms)

```typescript
// Strategy interface
interface SortStrategy {
  sort(data: number[]): number[];
}

// Different implementations
class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    console.log("Sorted using Bubble Sort");
    return arr;
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;

    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter((x) => x < pivot);
    const middle = data.filter((x) => x === pivot);
    const right = data.filter((x) => x > pivot);

    console.log("Sorted using Quick Sort");
    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

class MergeSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;

    const mid = Math.floor(data.length / 2);
    const left = this.sort(data.slice(0, mid));
    const right = this.sort(data.slice(mid));

    console.log("Sorted using Merge Sort");
    return this.merge(left, right);
  }

  private merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
  }
}

// Context that uses strategy
class DataSorter {
  private strategy: SortStrategy;

  constructor(strategy: SortStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sortData(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

// Usage
const data = [64, 34, 25, 12, 22, 11, 90];

const sorter = new DataSorter(new BubbleSort());
console.log(sorter.sortData(data));

sorter.setStrategy(new QuickSort());
console.log(sorter.sortData(data));

sorter.setStrategy(new MergeSort());
console.log(sorter.sortData(data));
```

## Best Practices

### 1. Program to Interfaces, Not Implementations

```typescript
// ✅ Good: Depend on abstraction
interface Logger {
  log(message: string): void;
}

class Service {
  constructor(private logger: Logger) {}

  doSomething(): void {
    this.logger.log("Doing something");
  }
}

// ❌ Bad: Depend on concrete class
class ConsoleLogger {
  log(message: string): void {
    console.log(message);
  }
}

class BadService {
  private logger = new ConsoleLogger(); // Tightly coupled!
}
```

### 2. Favor Composition with Polymorphism

```typescript
interface Drawable {
  draw(): void;
}

interface Movable {
  move(x: number, y: number): void;
}

// Compose behaviors
class GameObject implements Drawable, Movable {
  draw(): void {
    console.log("Drawing object");
  }

  move(x: number, y: number): void {
    console.log(`Moving to (${x}, ${y})`);
  }
}
```

### 3. Use Polymorphism for Extensibility

```typescript
// Easy to add new types without modifying existing code
interface Validator {
  validate(value: any): boolean;
}

class EmailValidator implements Validator {
  validate(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}

class PhoneValidator implements Validator {
  validate(value: string): boolean {
    return /^\+?[\d\s-()]+$/.test(value);
  }
}

// Can add more validators without changing this code
class Form {
  private validators: Validator[] = [];

  addValidator(validator: Validator): void {
    this.validators.push(validator);
  }

  validate(value: any): boolean {
    return this.validators.every((v) => v.validate(value));
  }
}
```

## Common Pitfalls

### 1. Breaking Polymorphism with Type Checks

```typescript
// ❌ Bad: Defeats the purpose of polymorphism
function processShape(shape: Shape): void {
  if (shape instanceof Circle) {
    // Special handling for Circle
  } else if (shape instanceof Rectangle) {
    // Special handling for Rectangle
  }
}

// ✅ Good: Use polymorphic behavior
function processShape(shape: Shape): void {
  shape.draw(); // Let each shape handle its own drawing
}
```

### 2. Overusing Inheritance

```typescript
// ❌ Bad: Deep inheritance hierarchy
class A {}
class B extends A {}
class C extends B {}
class D extends C {}

// ✅ Good: Use interfaces and composition
interface FeatureA {}
interface FeatureB {}
class Implementation implements FeatureA, FeatureB {}
```

## Interview Questions

1. **What is polymorphism? Explain with an example.**
2. **What is the difference between compile-time and runtime polymorphism?**
3. **How does TypeScript support method overloading?**
4. **What is the difference between overloading and overriding?**
5. **Explain duck typing in TypeScript**
6. **How does polymorphism relate to the Open/Closed Principle?**
7. **What are the benefits of polymorphism?**
8. **Can you achieve polymorphism without inheritance?**
9. **What is the difference between abstract classes and interfaces for polymorphism?**
10. **How does generic programming relate to polymorphism?**

## Summary

- Polymorphism allows objects of different types to be treated uniformly
- Two main types: compile-time (overloading) and runtime (overriding)
- Enables flexible, extensible, and maintainable code
- Use interfaces and abstract classes to define contracts
- Program to interfaces, not implementations
- Essential for design patterns like Strategy, Observer, Factory
- TypeScript's structural typing provides powerful polymorphic capabilities
- Avoid type checking; let polymorphism handle different behaviors

---

**Next Steps:**

- Study [Abstraction](abstraction.md) to understand how it enables polymorphism
- Learn about [SOLID Principles](../03-solid-principles/) for better OOP design
- Explore [Design Patterns](../04-design-patterns/) that leverage polymorphism
- Practice with [TypeScript Examples](../05-practical-examples/typescript/)
