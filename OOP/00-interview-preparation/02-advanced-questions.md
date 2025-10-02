# OOP Advanced Questions

## Table of Contents

- [Composition vs Inheritance](#composition-vs-inheritance)
- [Dependency Injection](#dependency-injection)
- [Design Principles](#design-principles)
- [Advanced Polymorphism](#advanced-polymorphism)
- [Object Relationships](#object-relationships)
- [Best Practices](#best-practices)

---

## Composition vs Inheritance

### Q1: When should you prefer composition over inheritance?

**Answer:**

**Prefer Composition when:**

- You need flexibility to change behavior at runtime
- The relationship is "has-a" rather than "is-a"
- You want to avoid deep inheritance hierarchies
- You need to combine multiple behaviors
- You want loose coupling

**Prefer Inheritance when:**

- There's a clear "is-a" relationship
- You're modeling a natural hierarchy
- You need polymorphic behavior
- Shared interface and behavior are needed

**Example (TypeScript):**

```typescript
// INHERITANCE - Can become rigid
class Bird {
  fly(): void {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  // Problem: Penguins can't fly!
  fly(): void {
    throw new Error("Penguins can't fly");
  }
}

// COMPOSITION - More flexible
interface FlyBehavior {
  fly(): void;
}

interface SwimBehavior {
  swim(): void;
}

class CanFly implements FlyBehavior {
  fly(): void {
    console.log("Flying in the sky");
  }
}

class CannotFly implements FlyBehavior {
  fly(): void {
    console.log("Cannot fly");
  }
}

class CanSwim implements SwimBehavior {
  swim(): void {
    console.log("Swimming in water");
  }
}

class BetterBird {
  constructor(
    private flyBehavior: FlyBehavior,
    private swimBehavior?: SwimBehavior
  ) {}

  performFly(): void {
    this.flyBehavior.fly();
  }

  performSwim(): void {
    if (this.swimBehavior) {
      this.swimBehavior.swim();
    } else {
      console.log("Cannot swim");
    }
  }

  // Can change behavior at runtime
  setFlyBehavior(fb: FlyBehavior): void {
    this.flyBehavior = fb;
  }
}

const eagle = new BetterBird(new CanFly());
const penguin = new BetterBird(new CannotFly(), new CanSwim());

eagle.performFly(); // Flying in the sky
penguin.performFly(); // Cannot fly
penguin.performSwim(); // Swimming in water
```

---

### Q2: What is the Diamond Problem? How do you solve it?

**Answer:**
The Diamond Problem occurs in multiple inheritance when a class inherits from two classes that both inherit from a common base class, creating ambiguity about which parent's method to use.

**Solutions:**

1. Use interfaces instead of multiple inheritance
2. Use composition
3. Explicit method resolution (language-specific)

**Example (TypeScript):**

```typescript
// Diamond Problem Scenario (if TypeScript had multiple inheritance)
// Class A
//   ↙  ↘
// B      C
//   ↘  ↙
//    D

// Solution 1: Using Interfaces
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Duck implements Flyable, Swimmable {
  fly(): void {
    console.log("Duck flying");
  }

  swim(): void {
    console.log("Duck swimming");
  }
}

// Solution 2: Using Composition
class FlyAbility {
  fly(): void {
    console.log("Flying");
  }
}

class SwimAbility {
  swim(): void {
    console.log("Swimming");
  }
}

class BetterDuck {
  private flyAbility = new FlyAbility();
  private swimAbility = new SwimAbility();

  fly(): void {
    this.flyAbility.fly();
  }

  swim(): void {
    this.swimAbility.swim();
  }
}
```

---

## Dependency Injection

### Q3: What is Dependency Injection? Why is it important?

**Answer:**
Dependency Injection (DI) is a design pattern where dependencies are provided to a class rather than the class creating them itself.

**Types of DI:**

1. **Constructor Injection**: Dependencies passed through constructor
2. **Setter Injection**: Dependencies set through setter methods
3. **Interface Injection**: Dependencies provided through interface

**Benefits:**

- Loose coupling
- Easier testing (can inject mocks)
- Better maintainability
- Follows Dependency Inversion Principle

**Example (TypeScript):**

```typescript
// Without DI - Tight Coupling
class EmailService {
  sendEmail(to: string, message: string): void {
    console.log(`Sending email to ${to}: ${message}`);
  }
}

class BadUserService {
  private emailService = new EmailService(); // Tight coupling

  registerUser(email: string): void {
    // Registration logic
    this.emailService.sendEmail(email, "Welcome!");
  }
}

// With DI - Loose Coupling
interface INotificationService {
  send(to: string, message: string): void;
}

class EmailNotification implements INotificationService {
  send(to: string, message: string): void {
    console.log(`Email to ${to}: ${message}`);
  }
}

class SMSNotification implements INotificationService {
  send(to: string, message: string): void {
    console.log(`SMS to ${to}: ${message}`);
  }
}

class GoodUserService {
  // Constructor Injection
  constructor(private notificationService: INotificationService) {}

  registerUser(contact: string): void {
    // Registration logic
    this.notificationService.send(contact, "Welcome!");
  }
}

// Easy to switch implementations
const userService1 = new GoodUserService(new EmailNotification());
const userService2 = new GoodUserService(new SMSNotification());

userService1.registerUser("user@example.com");
userService2.registerUser("+1234567890");

// Easy to test with mocks
class MockNotification implements INotificationService {
  public sentMessages: string[] = [];

  send(to: string, message: string): void {
    this.sentMessages.push(`${to}: ${message}`);
  }
}

const mockService = new MockNotification();
const testUserService = new GoodUserService(mockService);
testUserService.registerUser("test@example.com");
console.log("Sent messages:", mockService.sentMessages);
```

---

### Q4: What is an IoC (Inversion of Control) container?

**Answer:**
An IoC container is a framework that manages object creation and dependency injection automatically. It inverts the control of object creation from the application to the framework.

**Example (TypeScript):**

```typescript
// Simple IoC Container Implementation
type Constructor<T> = new (...args: any[]) => T;

class Container {
  private services = new Map<string, Constructor<any>>();
  private singletons = new Map<string, any>();

  register<T>(
    name: string,
    constructor: Constructor<T>,
    singleton: boolean = false
  ): void {
    this.services.set(name, constructor);
    if (singleton) {
      this.singletons.set(name, null);
    }
  }

  resolve<T>(name: string): T {
    const constructor = this.services.get(name);
    if (!constructor) {
      throw new Error(`Service ${name} not found`);
    }

    if (this.singletons.has(name)) {
      let instance = this.singletons.get(name);
      if (!instance) {
        instance = new constructor();
        this.singletons.set(name, instance);
      }
      return instance;
    }

    return new constructor();
  }
}

// Usage
interface ILogger {
  log(message: string): void;
}

class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

class UserRepository {
  constructor(private logger: ILogger) {}

  saveUser(name: string): void {
    this.logger.log(`Saving user: ${name}`);
  }
}

const container = new Container();
container.register("logger", ConsoleLogger, true); // Singleton

const logger = container.resolve<ILogger>("logger");
const userRepo = new UserRepository(logger);
userRepo.saveUser("Alice");
```

---

## Design Principles

### Q5: Explain the Law of Demeter (Principle of Least Knowledge).

**Answer:**
The Law of Demeter states that an object should only talk to its immediate friends and not to strangers. In other words, don't chain method calls through multiple objects.

**Rule:** A method of an object should only call methods of:

- The object itself
- Objects passed as arguments
- Objects it creates
- Its direct component objects

**Example (TypeScript):**

```typescript
// Violation of Law of Demeter
class Address {
  constructor(public city: string, public zipCode: string) {}
}

class Person {
  constructor(public name: string, public address: Address) {}
}

class Order {
  constructor(public customer: Person) {}

  // BAD: Chaining through multiple objects
  getCustomerCity(): string {
    return this.customer.address.city; // Violates LoD
  }
}

// Following Law of Demeter
class BetterAddress {
  constructor(private city: string, private zipCode: string) {}

  getCity(): string {
    return this.city;
  }
}

class BetterPerson {
  constructor(private name: string, private address: BetterAddress) {}

  // Person knows about its address
  getCity(): string {
    return this.address.getCity();
  }
}

class BetterOrder {
  constructor(private customer: BetterPerson) {}

  // GOOD: Only one level of method calls
  getCustomerCity(): string {
    return this.customer.getCity();
  }
}

const address = new BetterAddress("New York", "10001");
const person = new BetterPerson("Alice", address);
const order = new BetterOrder(person);

console.log(order.getCustomerCity()); // Clean interaction
```

---

### Q6: What is the Tell, Don't Ask principle?

**Answer:**
Tell, Don't Ask principle states that you should tell objects what to do rather than asking them for data and making decisions based on that data.

**Example (TypeScript):**

```typescript
// Ask - BAD
class BadAccount {
  constructor(public balance: number) {}
}

class BadAccountManager {
  withdraw(account: BadAccount, amount: number): void {
    // Asking for data and making decisions
    if (account.balance >= amount) {
      account.balance -= amount;
      console.log("Withdrawal successful");
    } else {
      console.log("Insufficient funds");
    }
  }
}

// Tell - GOOD
class GoodAccount {
  constructor(private balance: number) {}

  // Tell the account what to do
  withdraw(amount: number): boolean {
    if (this.balance >= amount) {
      this.balance -= amount;
      return true;
    }
    return false;
  }

  getBalance(): number {
    return this.balance;
  }
}

class GoodAccountManager {
  processWithdrawal(account: GoodAccount, amount: number): void {
    // Tell the account to withdraw
    if (account.withdraw(amount)) {
      console.log("Withdrawal successful");
    } else {
      console.log("Insufficient funds");
    }
  }
}

const account = new GoodAccount(1000);
const manager = new GoodAccountManager();
manager.processWithdrawal(account, 500);
```

---

## Advanced Polymorphism

### Q7: What is covariance and contravariance in OOP?

**Answer:**

**Covariance**: Return type can be more specific (derived type) in override
**Contravariance**: Parameter type can be more general (base type) in override

**Example (TypeScript):**

```typescript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
}

class Cat extends Animal {
  indoor: boolean;
  constructor(name: string, indoor: boolean) {
    super(name);
    this.indoor = indoor;
  }
}

// Covariance - Return type becomes more specific
class AnimalShelter {
  getAnimal(): Animal {
    return new Animal("Generic");
  }
}

class DogShelter extends AnimalShelter {
  // Covariant return type
  getAnimal(): Dog {
    return new Dog("Buddy", "Golden Retriever");
  }
}

// Usage
const shelter: AnimalShelter = new DogShelter();
const animal = shelter.getAnimal(); // Returns Dog, but typed as Animal

// Function parameter covariance/contravariance
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

const handleAnimal: AnimalHandler = (animal: Animal) => {
  console.log(`Handling ${animal.name}`);
};

const handleDog: DogHandler = (dog: Dog) => {
  console.log(`Handling ${dog.name}, breed: ${dog.breed}`);
};

// Contravariance: can assign more general handler to specific type
const dogHandler: DogHandler = handleAnimal; // OK in TypeScript
```

---

### Q8: Explain double dispatch and its use cases.

**Answer:**
Double dispatch is a technique to achieve polymorphism based on the runtime types of two objects. It's commonly used in the Visitor pattern.

**Example (TypeScript):**

```typescript
// Double Dispatch Example
interface ShapeVisitor {
  visitCircle(circle: Circle): void;
  visitRectangle(rectangle: Rectangle): void;
  visitTriangle(triangle: Triangle): void;
}

abstract class Shape {
  abstract accept(visitor: ShapeVisitor): void;
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  accept(visitor: ShapeVisitor): void {
    visitor.visitCircle(this); // First dispatch
  }
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) {
    super();
  }

  accept(visitor: ShapeVisitor): void {
    visitor.visitRectangle(this); // First dispatch
  }
}

class Triangle extends Shape {
  constructor(public base: number, public height: number) {
    super();
  }

  accept(visitor: ShapeVisitor): void {
    visitor.visitTriangle(this); // First dispatch
  }
}

// Area Calculator Visitor
class AreaCalculator implements ShapeVisitor {
  private totalArea = 0;

  visitCircle(circle: Circle): void {
    // Second dispatch - method chosen based on Circle type
    const area = Math.PI * circle.radius ** 2;
    this.totalArea += area;
    console.log(`Circle area: ${area.toFixed(2)}`);
  }

  visitRectangle(rectangle: Rectangle): void {
    const area = rectangle.width * rectangle.height;
    this.totalArea += area;
    console.log(`Rectangle area: ${area}`);
  }

  visitTriangle(triangle: Triangle): void {
    const area = (triangle.base * triangle.height) / 2;
    this.totalArea += area;
    console.log(`Triangle area: ${area}`);
  }

  getTotalArea(): number {
    return this.totalArea;
  }
}

// Perimeter Calculator Visitor
class PerimeterCalculator implements ShapeVisitor {
  visitCircle(circle: Circle): void {
    const perimeter = 2 * Math.PI * circle.radius;
    console.log(`Circle perimeter: ${perimeter.toFixed(2)}`);
  }

  visitRectangle(rectangle: Rectangle): void {
    const perimeter = 2 * (rectangle.width + rectangle.height);
    console.log(`Rectangle perimeter: ${perimeter}`);
  }

  visitTriangle(triangle: Triangle): void {
    console.log(`Triangle perimeter: (not implemented)`);
  }
}

// Usage
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4),
];

const areaCalc = new AreaCalculator();
const perimCalc = new PerimeterCalculator();

console.log("Calculating Areas:");
shapes.forEach((shape) => shape.accept(areaCalc));
console.log(`Total Area: ${areaCalc.getTotalArea().toFixed(2)}`);

console.log("\nCalculating Perimeters:");
shapes.forEach((shape) => shape.accept(perimCalc));
```

---

## Object Relationships

### Q9: Explain the different types of object relationships.

**Answer:**

**1. Association**: "uses-a" relationship

- Objects are independent
- Can exist without each other
- Example: Teacher and Student

**2. Aggregation**: "has-a" relationship (weak)

- Container and contained objects can exist independently
- Contained object can belong to multiple containers
- Example: Department has Employees

**3. Composition**: "has-a" relationship (strong)

- Container owns contained objects
- Contained objects cannot exist without container
- Example: House has Rooms

**4. Dependency**: "depends-on" relationship

- One class uses another temporarily
- Weakest relationship
- Example: Method parameter

**Example (TypeScript):**

```typescript
// 1. Association
class Student {
  constructor(public name: string) {}
}

class Teacher {
  private students: Student[] = [];

  addStudent(student: Student): void {
    this.students.push(student);
  }
}

// Students and Teachers can exist independently
const student1 = new Student("Alice");
const teacher = new Teacher();
teacher.addStudent(student1);

// 2. Aggregation
class Employee {
  constructor(public name: string) {}
}

class Department {
  private employees: Employee[] = [];

  addEmployee(employee: Employee): void {
    this.employees.push(employee);
  }

  removeEmployee(employee: Employee): void {
    const index = this.employees.indexOf(employee);
    if (index > -1) {
      this.employees.splice(index, 1);
    }
  }
}

// Employee can exist without Department
const emp1 = new Employee("Bob");
const dept = new Department();
dept.addEmployee(emp1);
// If dept is destroyed, emp1 still exists

// 3. Composition
class Room {
  constructor(public name: string, public size: number) {}
}

class House {
  private rooms: Room[];

  constructor() {
    // Rooms are created with House
    this.rooms = [
      new Room("Living Room", 300),
      new Room("Bedroom", 200),
      new Room("Kitchen", 150),
    ];
  }

  getRooms(): Room[] {
    return [...this.rooms];
  }
}

// If House is destroyed, Rooms are also destroyed
const house = new House();
// house = null; // Rooms would be garbage collected

// 4. Dependency
class EmailSender {
  send(to: string, message: string): void {
    console.log(`Sending to ${to}: ${message}`);
  }
}

class OrderProcessor {
  processOrder(orderId: string, emailSender: EmailSender): void {
    // Temporary dependency through parameter
    console.log(`Processing order ${orderId}`);
    emailSender.send("customer@example.com", "Order confirmed");
  }
}

const processor = new OrderProcessor();
const sender = new EmailSender();
processor.processOrder("ORD-123", sender);
```

---

### Q10: What is the difference between tight coupling and loose coupling?

**Answer:**

**Tight Coupling:**

- Classes are highly dependent on each other
- Changes in one class affect other classes
- Difficult to test and maintain
- Reduces reusability

**Loose Coupling:**

- Classes are independent
- Changes in one class minimally affect others
- Easier to test (can use mocks)
- Better maintainability and reusability

**Example (TypeScript):**

```typescript
// Tight Coupling - BAD
class MySQLDatabase {
  connect(): void {
    console.log("Connecting to MySQL");
  }

  query(sql: string): any[] {
    console.log(`Executing: ${sql}`);
    return [];
  }
}

class TightlyyCoupledUserService {
  private db = new MySQLDatabase(); // Hard dependency

  getUsers(): any[] {
    this.db.connect();
    return this.db.query("SELECT * FROM users");
  }
}

// Problem: Can't easily switch databases or test

// Loose Coupling - GOOD
interface Database {
  connect(): void;
  query(sql: string): any[];
}

class MySQL implements Database {
  connect(): void {
    console.log("Connecting to MySQL");
  }

  query(sql: string): any[] {
    console.log(`MySQL: ${sql}`);
    return [];
  }
}

class PostgreSQL implements Database {
  connect(): void {
    console.log("Connecting to PostgreSQL");
  }

  query(sql: string): any[] {
    console.log(`PostgreSQL: ${sql}`);
    return [];
  }
}

class LooselyCoupledUserService {
  constructor(private db: Database) {} // Dependency injection

  getUsers(): any[] {
    this.db.connect();
    return this.db.query("SELECT * FROM users");
  }
}

// Easy to switch implementations
const mysqlService = new LooselyCoupledUserService(new MySQL());
const postgresService = new LooselyCoupledUserService(new PostgreSQL());

// Easy to test with mock
class MockDatabase implements Database {
  connect(): void {}
  query(sql: string): any[] {
    return [{ id: 1, name: "Test User" }];
  }
}

const testService = new LooselyCoupledUserService(new MockDatabase());
```

---

## Best Practices

### Q11: What are some OOP anti-patterns to avoid?

**Answer:**

**1. God Object**: Class that does too much
**2. Anemic Domain Model**: Classes with only getters/setters
**3. Feature Envy**: Method more interested in other class than its own
**4. Primitive Obsession**: Using primitives instead of small objects
**5. Shotgun Surgery**: Single change requires changes in many classes

**Example (TypeScript):**

```typescript
// Anti-pattern: God Object
class GodOrder {
  // Does everything: validation, calculation, persistence, notification
  validateOrder() {}
  calculateTotal() {}
  applyDiscount() {}
  saveToDatabase() {}
  sendEmail() {}
  generateInvoice() {}
  processPayment() {}
}

// Better: Separated Concerns
class Order {
  constructor(private items: OrderItem[], private customer: Customer) {}

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getPrice(), 0);
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }
}

class OrderValidator {
  validate(order: Order): boolean {
    return order.getItems().length > 0;
  }
}

class OrderRepository {
  save(order: Order): void {
    console.log("Saving order to database");
  }
}

class OrderNotifier {
  sendConfirmation(order: Order): void {
    console.log("Sending order confirmation");
  }
}

// Anti-pattern: Anemic Domain Model
class AnemicProduct {
  name: string;
  price: number;
  quantity: number;

  // Only getters/setters, no behavior
}

// Better: Rich Domain Model
class RichProduct {
  constructor(
    private name: string,
    private price: number,
    private quantity: number
  ) {}

  // Business logic in the domain class
  isAvailable(): boolean {
    return this.quantity > 0;
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  reduceStock(amount: number): void {
    if (amount > this.quantity) {
      throw new Error("Insufficient stock");
    }
    this.quantity -= amount;
  }

  getTotal(quantity: number): number {
    if (!this.isAvailable()) {
      throw new Error("Product not available");
    }
    return this.price * quantity;
  }
}
```

---

### Q12: How do you design for extensibility?

**Answer:**

**Principles for Extensibility:**

1. Program to interfaces, not implementations
2. Follow Open/Closed Principle
3. Use dependency injection
4. Favor composition over inheritance
5. Keep classes focused and small

**Example (TypeScript):**

```typescript
// Extensible Payment System
interface PaymentMethod {
  processPayment(amount: number): Promise<boolean>;
  getPaymentType(): string;
}

// Easy to add new payment methods
class CreditCardPayment implements PaymentMethod {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing credit card payment: $${amount}`);
    return true;
  }

  getPaymentType(): string {
    return "Credit Card";
  }
}

class PayPalPayment implements PaymentMethod {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing PayPal payment: $${amount}`);
    return true;
  }

  getPaymentType(): string {
    return "PayPal";
  }
}

// New payment method - no existing code changes needed
class CryptoPayment implements PaymentMethod {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing crypto payment: $${amount}`);
    return true;
  }

  getPaymentType(): string {
    return "Cryptocurrency";
  }
}

// Payment processor works with any payment method
class PaymentProcessor {
  async process(paymentMethod: PaymentMethod, amount: number): Promise<void> {
    console.log(`Processing payment via ${paymentMethod.getPaymentType()}`);
    const success = await paymentMethod.processPayment(amount);
    if (success) {
      console.log("Payment successful");
    } else {
      console.log("Payment failed");
    }
  }
}

// Usage
const processor = new PaymentProcessor();
processor.process(new CreditCardPayment(), 100);
processor.process(new PayPalPayment(), 200);
processor.process(new CryptoPayment(), 300); // New method, no changes needed
```

---

This covers advanced OOP concepts frequently asked in senior-level interviews!
