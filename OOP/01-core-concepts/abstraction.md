# Abstraction

## Overview

Abstraction is one of the four fundamental principles of Object-Oriented Programming. It focuses on hiding complex implementation details and showing only the essential features of an object. Abstraction helps reduce programming complexity and increase efficiency.

## Key Concepts

### What is Abstraction?

Abstraction means representing essential features without including background details or explanations. It focuses on what an object does rather than how it does it.

**Key Points:**

- Hide implementation details
- Show only relevant information
- Reduce complexity
- Increase code maintainability

### Abstraction vs Encapsulation

While related, these are different concepts:

| Abstraction                                  | Encapsulation                     |
| -------------------------------------------- | --------------------------------- |
| Hides complexity                             | Hides data                        |
| Focuses on design level                      | Focuses on implementation level   |
| Achieved through abstract classes/interfaces | Achieved through access modifiers |
| What an object does                          | How it does it                    |

### Benefits

1. **Reduces Complexity** - Users don't need to understand internal workings
2. **Increases Security** - Implementation details are hidden
3. **Enhances Maintainability** - Changes in implementation don't affect users
4. **Promotes Reusability** - Abstract components can be reused
5. **Enables Flexibility** - Easy to extend and modify

## TypeScript Examples

### Abstract Classes

Abstract classes provide a base for other classes to extend but cannot be instantiated directly.

```typescript
// Abstract base class
abstract class Animal {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Abstract methods - must be implemented by subclasses
  abstract makeSound(): void;
  abstract move(): void;

  // Concrete method - shared implementation
  getInfo(): string {
    return `${this.name} is ${this.age} years old`;
  }

  // Concrete method with logic
  sleep(): void {
    console.log(`${this.name} is sleeping...`);
  }
}

// Cannot instantiate abstract class
// const animal = new Animal("Generic", 5); // ❌ Error!

// Concrete implementations
class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age);
    this.breed = breed;
  }

  // Must implement abstract methods
  makeSound(): void {
    console.log("Woof! Woof!");
  }

  move(): void {
    console.log(`${this.name} runs on four legs`);
  }
}

class Bird extends Animal {
  private wingspan: number;

  constructor(name: string, age: number, wingspan: number) {
    super(name, age);
    this.wingspan = wingspan;
  }

  makeSound(): void {
    console.log("Tweet! Tweet!");
  }

  move(): void {
    console.log(`${this.name} flies with ${this.wingspan}cm wingspan`);
  }
}

// Usage
const dog = new Dog("Buddy", 3, "Golden Retriever");
const bird = new Bird("Tweety", 1, 15);

dog.makeSound(); // Woof! Woof!
dog.move(); // Buddy runs on four legs
console.log(dog.getInfo()); // Buddy is 3 years old

bird.makeSound(); // Tweet! Tweet!
bird.move(); // Tweety flies with 15cm wingspan
```

### Interfaces for Abstraction

Interfaces define contracts that implementing classes must follow:

```typescript
// Interface defining abstract contract
interface Vehicle {
  start(): void;
  stop(): void;
  accelerate(speed: number): void;
  brake(): void;
}

// Concrete implementation 1
class Car implements Vehicle {
  private isRunning: boolean = false;
  private currentSpeed: number = 0;

  start(): void {
    this.isRunning = true;
    console.log("Car engine started");
  }

  stop(): void {
    this.isRunning = false;
    this.currentSpeed = 0;
    console.log("Car engine stopped");
  }

  accelerate(speed: number): void {
    if (this.isRunning) {
      this.currentSpeed += speed;
      console.log(`Car accelerating to ${this.currentSpeed} km/h`);
    }
  }

  brake(): void {
    this.currentSpeed = Math.max(0, this.currentSpeed - 20);
    console.log(`Car braking, speed: ${this.currentSpeed} km/h`);
  }
}

// Concrete implementation 2
class Motorcycle implements Vehicle {
  private engineOn: boolean = false;
  private velocity: number = 0;

  start(): void {
    this.engineOn = true;
    console.log("Motorcycle engine started with a roar!");
  }

  stop(): void {
    this.engineOn = false;
    this.velocity = 0;
    console.log("Motorcycle engine stopped");
  }

  accelerate(speed: number): void {
    if (this.engineOn) {
      this.velocity += speed * 1.5; // Motorcycles accelerate faster
      console.log(`Motorcycle zooming at ${this.velocity} km/h`);
    }
  }

  brake(): void {
    this.velocity = Math.max(0, this.velocity - 30);
    console.log(`Motorcycle braking, velocity: ${this.velocity} km/h`);
  }
}

// Function working with abstraction
function testVehicle(vehicle: Vehicle): void {
  vehicle.start();
  vehicle.accelerate(50);
  vehicle.accelerate(30);
  vehicle.brake();
  vehicle.stop();
  console.log("---");
}

// Same function works with different implementations
testVehicle(new Car());
testVehicle(new Motorcycle());
```

### Real-World Example: Database Connection

```typescript
// Abstract database interface
interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query(sql: string): Promise<any[]>;
  insert(table: string, data: Record<string, any>): Promise<void>;
  update(table: string, id: string, data: Record<string, any>): Promise<void>;
  delete(table: string, id: string): Promise<void>;
}

// MySQL Implementation
class MySQLDatabase implements Database {
  private connection: any = null;

  async connect(): Promise<void> {
    console.log("Connecting to MySQL database...");
    // Simulate connection
    this.connection = { type: "MySQL" };
    console.log("MySQL connected successfully");
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting from MySQL...");
    this.connection = null;
    console.log("MySQL disconnected");
  }

  async query(sql: string): Promise<any[]> {
    console.log(`MySQL Query: ${sql}`);
    return [{ id: 1, name: "Result" }];
  }

  async insert(table: string, data: Record<string, any>): Promise<void> {
    console.log(`MySQL INSERT into ${table}:`, data);
  }

  async update(
    table: string,
    id: string,
    data: Record<string, any>
  ): Promise<void> {
    console.log(`MySQL UPDATE ${table} WHERE id=${id}:`, data);
  }

  async delete(table: string, id: string): Promise<void> {
    console.log(`MySQL DELETE from ${table} WHERE id=${id}`);
  }
}

// MongoDB Implementation
class MongoDatabase implements Database {
  private client: any = null;

  async connect(): Promise<void> {
    console.log("Connecting to MongoDB...");
    this.client = { type: "MongoDB" };
    console.log("MongoDB connected successfully");
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting from MongoDB...");
    this.client = null;
    console.log("MongoDB disconnected");
  }

  async query(sql: string): Promise<any[]> {
    console.log(`MongoDB Find: ${sql}`);
    return [{ _id: "abc123", name: "Result" }];
  }

  async insert(table: string, data: Record<string, any>): Promise<void> {
    console.log(`MongoDB insertOne into ${table}:`, data);
  }

  async update(
    table: string,
    id: string,
    data: Record<string, any>
  ): Promise<void> {
    console.log(`MongoDB updateOne in ${table} WHERE _id=${id}:`, data);
  }

  async delete(table: string, id: string): Promise<void> {
    console.log(`MongoDB deleteOne from ${table} WHERE _id=${id}`);
  }
}

// Application service using abstraction
class UserService {
  constructor(private database: Database) {}

  async createUser(name: string, email: string): Promise<void> {
    await this.database.connect();
    await this.database.insert("users", { name, email });
    await this.database.disconnect();
  }

  async updateUser(id: string, name: string): Promise<void> {
    await this.database.connect();
    await this.database.update("users", id, { name });
    await this.database.disconnect();
  }

  async deleteUser(id: string): Promise<void> {
    await this.database.connect();
    await this.database.delete("users", id);
    await this.database.disconnect();
  }
}

// Usage - easily switch between databases
const mysqlService = new UserService(new MySQLDatabase());
const mongoService = new UserService(new MongoDatabase());

// Both work identically from the service perspective
// mysqlService.createUser("John", "john@example.com");
// mongoService.createUser("Jane", "jane@example.com");
```

### Abstract Classes with Partial Implementation

```typescript
// Abstract class with some concrete methods
abstract class PaymentProcessor {
  protected transactionId: string;

  constructor() {
    this.transactionId = this.generateTransactionId();
  }

  // Concrete helper method
  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Abstract methods - must be implemented
  abstract validatePayment(amount: number): boolean;
  abstract processTransaction(amount: number): Promise<boolean>;
  abstract refund(amount: number): Promise<boolean>;

  // Template method pattern - defines algorithm structure
  async executePayment(amount: number): Promise<void> {
    console.log(`\nTransaction ID: ${this.transactionId}`);
    console.log(`Processing payment of $${amount}...`);

    // Validate
    if (!this.validatePayment(amount)) {
      console.log("❌ Payment validation failed");
      return;
    }

    // Process
    const success = await this.processTransaction(amount);

    if (success) {
      console.log("✅ Payment successful");
      this.logTransaction(amount, "SUCCESS");
    } else {
      console.log("❌ Payment failed");
      this.logTransaction(amount, "FAILED");
    }
  }

  // Concrete method
  protected logTransaction(amount: number, status: string): void {
    console.log(
      `[LOG] Transaction ${this.transactionId}: $${amount} - ${status}`
    );
  }
}

// Concrete implementation 1
class CreditCardProcessor extends PaymentProcessor {
  validatePayment(amount: number): boolean {
    // Credit card specific validation
    if (amount <= 0) {
      console.log("Invalid amount");
      return false;
    }
    if (amount > 10000) {
      console.log("Amount exceeds credit card limit");
      return false;
    }
    console.log("✓ Credit card validation passed");
    return true;
  }

  async processTransaction(amount: number): Promise<boolean> {
    console.log("Processing via Credit Card...");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  async refund(amount: number): Promise<boolean> {
    console.log(`Refunding $${amount} to credit card`);
    return true;
  }
}

// Concrete implementation 2
class BankTransferProcessor extends PaymentProcessor {
  validatePayment(amount: number): boolean {
    if (amount <= 0) {
      console.log("Invalid amount");
      return false;
    }
    console.log("✓ Bank transfer validation passed");
    return true;
  }

  async processTransaction(amount: number): Promise<boolean> {
    console.log("Processing via Bank Transfer...");
    // Simulate bank API
    await new Promise((resolve) => setTimeout(resolve, 200));
    return true;
  }

  async refund(amount: number): Promise<boolean> {
    console.log(`Initiating bank refund of $${amount}`);
    return true;
  }
}

// Usage
const creditCard = new CreditCardProcessor();
const bankTransfer = new BankTransferProcessor();

// creditCard.executePayment(500);
// bankTransfer.executePayment(1500);
```

### Layered Abstraction

```typescript
// Low-level abstraction
interface DataStorage {
  save(key: string, value: string): void;
  load(key: string): string | null;
  delete(key: string): void;
}

// Medium-level abstraction
abstract class Repository<T> {
  constructor(protected storage: DataStorage) {}

  abstract serialize(item: T): string;
  abstract deserialize(data: string): T;

  save(id: string, item: T): void {
    const data = this.serialize(item);
    this.storage.save(id, data);
  }

  load(id: string): T | null {
    const data = this.storage.load(id);
    return data ? this.deserialize(data) : null;
  }

  delete(id: string): void {
    this.storage.delete(id);
  }
}

// Low-level implementations
class LocalStorageAdapter implements DataStorage {
  save(key: string, value: string): void {
    console.log(`LocalStorage: Saving ${key}`);
    // localStorage.setItem(key, value);
  }

  load(key: string): string | null {
    console.log(`LocalStorage: Loading ${key}`);
    // return localStorage.getItem(key);
    return '{"id":"1","name":"Test"}';
  }

  delete(key: string): void {
    console.log(`LocalStorage: Deleting ${key}`);
    // localStorage.removeItem(key);
  }
}

class FileStorageAdapter implements DataStorage {
  save(key: string, value: string): void {
    console.log(`FileStorage: Writing ${key} to file`);
  }

  load(key: string): string | null {
    console.log(`FileStorage: Reading ${key} from file`);
    return '{"id":"1","name":"Test"}';
  }

  delete(key: string): void {
    console.log(`FileStorage: Deleting ${key} file`);
  }
}

// High-level implementations
interface User {
  id: string;
  name: string;
  email: string;
}

class UserRepository extends Repository<User> {
  serialize(user: User): string {
    return JSON.stringify(user);
  }

  deserialize(data: string): User {
    return JSON.parse(data) as User;
  }
}

// Usage with different storage backends
const localUserRepo = new UserRepository(new LocalStorageAdapter());
const fileUserRepo = new UserRepository(new FileStorageAdapter());

const user: User = { id: "1", name: "Alice", email: "alice@example.com" };

localUserRepo.save("user-1", user);
fileUserRepo.save("user-1", user);
```

## Best Practices

### 1. Abstract What Varies

```typescript
// ✅ Good: Abstract the varying behavior
interface MessageFormatter {
  format(message: string): string;
}

class JSONFormatter implements MessageFormatter {
  format(message: string): string {
    return JSON.stringify({ message });
  }
}

class XMLFormatter implements MessageFormatter {
  format(message: string): string {
    return `<message>${message}</message>`;
  }
}

// ❌ Bad: Hardcoding format logic
class BadMessageSender {
  send(message: string, format: string): void {
    if (format === "json") {
      // JSON formatting logic
    } else if (format === "xml") {
      // XML formatting logic
    }
  }
}
```

### 2. Keep Abstractions Focused

```typescript
// ✅ Good: Focused, single responsibility
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

// ❌ Bad: Too many responsibilities
interface DataHandler {
  read(): string;
  write(data: string): void;
  validate(): boolean;
  transform(): void;
  encrypt(): void;
  compress(): void;
}
```

### 3. Program to Interfaces

```typescript
// ✅ Good: Depend on abstraction
class OrderService {
  constructor(private paymentProcessor: PaymentProcessor) {}

  processOrder(amount: number): void {
    this.paymentProcessor.executePayment(amount);
  }
}

// ❌ Bad: Depend on concrete implementation
class BadOrderService {
  private processor = new CreditCardProcessor(); // Tightly coupled!

  processOrder(amount: number): void {
    this.processor.executePayment(amount);
  }
}
```

### 4. Use Abstract Classes for Shared Behavior

```typescript
// ✅ Good: Abstract class with common implementation
abstract class HttpClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Shared implementation
  protected buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  // Abstract methods
  abstract get(endpoint: string): Promise<any>;
  abstract post(endpoint: string, data: any): Promise<any>;
}
```

## Common Use Cases

### 1. Plugin Architecture

```typescript
// Plugin interface
interface Plugin {
  name: string;
  version: string;
  initialize(): void;
  execute(context: any): void;
  cleanup(): void;
}

// Plugin manager
class PluginManager {
  private plugins: Plugin[] = [];

  register(plugin: Plugin): void {
    console.log(`Registering plugin: ${plugin.name} v${plugin.version}`);
    plugin.initialize();
    this.plugins.push(plugin);
  }

  executeAll(context: any): void {
    this.plugins.forEach((plugin) => plugin.execute(context));
  }
}
```

### 2. Strategy Pattern with Abstraction

```typescript
interface CompressionStrategy {
  compress(data: string): string;
  decompress(data: string): string;
}

class GzipCompression implements CompressionStrategy {
  compress(data: string): string {
    console.log("Compressing with GZIP...");
    return `GZIP(${data})`;
  }

  decompress(data: string): string {
    console.log("Decompressing GZIP...");
    return data.replace("GZIP(", "").replace(")", "");
  }
}

class BrotliCompression implements CompressionStrategy {
  compress(data: string): string {
    console.log("Compressing with Brotli...");
    return `BROTLI(${data})`;
  }

  decompress(data: string): string {
    console.log("Decompressing Brotli...");
    return data.replace("BROTLI(", "").replace(")", "");
  }
}
```

## Interview Questions

1. **What is abstraction in OOP?**
2. **What is the difference between abstraction and encapsulation?**
3. **When would you use an abstract class vs an interface?**
4. **Can abstract classes have constructors?**
5. **Can you instantiate an abstract class?**
6. **What is the purpose of abstract methods?**
7. **How does abstraction help in achieving loose coupling?**
8. **Give a real-world example of abstraction**
9. **What are the benefits of programming to interfaces?**
10. **How does abstraction relate to the Dependency Inversion Principle?**

## Summary

- Abstraction hides complex implementation details and shows only essential features
- Achieved through abstract classes and interfaces in TypeScript
- Abstract classes can have both abstract and concrete methods
- Interfaces define contracts without implementation
- Reduces complexity and improves maintainability
- Enables loose coupling and high cohesion
- Essential for plugin architectures and extensible systems
- Program to abstractions, not concrete implementations

---

**Next Steps:**

- Learn about [Composition vs Inheritance](../02-advanced-concepts/composition-vs-inheritance.md)
- Study [SOLID Principles](../03-solid-principles/) - especially Dependency Inversion
- Explore [Design Patterns](../04-design-patterns/) that use abstraction
- Practice with [TypeScript Examples](../05-practical-examples/typescript/)
