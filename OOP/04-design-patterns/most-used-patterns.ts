/**
 * MOST COMMONLY USED DESIGN PATTERNS IN TYPESCRIPT
 *
 * This file contains practical implementations of the most frequently used
 * design patterns in real-world TypeScript applications.
 */

// ============================================================================
// 1. SINGLETON PATTERN
// ============================================================================
// Ensures a class has only one instance and provides global access to it
// Use Case: Database connections, configuration managers, logging services

class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
    console.log(`[${timestamp}] ${message}`);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true - same instance

// ============================================================================
// 2. FACTORY PATTERN
// ============================================================================
// Creates objects without specifying the exact class to create
// Use Case: Creating different types of objects based on conditions

interface Payment {
  processPayment(amount: number): void;
}

class CreditCardPayment implements Payment {
  processPayment(amount: number): void {
    console.log(`Processing credit card payment of $${amount}`);
  }
}

class PayPalPayment implements Payment {
  processPayment(amount: number): void {
    console.log(`Processing PayPal payment of $${amount}`);
  }
}

class CryptoPayment implements Payment {
  processPayment(amount: number): void {
    console.log(`Processing crypto payment of $${amount}`);
  }
}

class PaymentFactory {
  static createPayment(type: "credit" | "paypal" | "crypto"): Payment {
    switch (type) {
      case "credit":
        return new CreditCardPayment();
      case "paypal":
        return new PayPalPayment();
      case "crypto":
        return new CryptoPayment();
      default:
        throw new Error("Invalid payment type");
    }
  }
}

// Usage
const payment = PaymentFactory.createPayment("paypal");
payment.processPayment(100);

// ============================================================================
// 3. BUILDER PATTERN
// ============================================================================
// Constructs complex objects step by step
// Use Case: Creating objects with many optional parameters

class User {
  constructor(
    public name: string,
    public email: string,
    public age?: number,
    public phone?: string,
    public address?: string,
    public role?: string
  ) {}
}

class UserBuilder {
  private name: string = "";
  private email: string = "";
  private age?: number;
  private phone?: string;
  private address?: string;
  private role?: string;

  setName(name: string): UserBuilder {
    this.name = name;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  setAge(age: number): UserBuilder {
    this.age = age;
    return this;
  }

  setPhone(phone: string): UserBuilder {
    this.phone = phone;
    return this;
  }

  setAddress(address: string): UserBuilder {
    this.address = address;
    return this;
  }

  setRole(role: string): UserBuilder {
    this.role = role;
    return this;
  }

  build(): User {
    return new User(
      this.name,
      this.email,
      this.age,
      this.phone,
      this.address,
      this.role
    );
  }
}

// Usage
const user = new UserBuilder()
  .setName("John Doe")
  .setEmail("john@example.com")
  .setAge(30)
  .setRole("admin")
  .build();

// ============================================================================
// 4. OBSERVER PATTERN (PUB/SUB)
// ============================================================================
// Defines a one-to-many dependency between objects
// Use Case: Event handling, state management, real-time updates

interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class EmailNotification implements Observer {
  update(data: any): void {
    console.log(`Email notification sent: ${data}`);
  }
}

class SMSNotification implements Observer {
  update(data: any): void {
    console.log(`SMS notification sent: ${data}`);
  }
}

class PushNotification implements Observer {
  update(data: any): void {
    console.log(`Push notification sent: ${data}`);
  }
}

// Usage
const orderSubject = new Subject();
const emailNotif = new EmailNotification();
const smsNotif = new SMSNotification();
const pushNotif = new PushNotification();

orderSubject.subscribe(emailNotif);
orderSubject.subscribe(smsNotif);
orderSubject.subscribe(pushNotif);

orderSubject.notify("Order #1234 has been shipped!");

// ============================================================================
// 5. STRATEGY PATTERN
// ============================================================================
// Defines a family of algorithms and makes them interchangeable
// Use Case: Different sorting algorithms, validation strategies, pricing strategies

interface PricingStrategy {
  calculatePrice(basePrice: number): number;
}

class RegularPricing implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return basePrice;
  }
}

class SeasonalDiscount implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return basePrice * 0.9; // 10% off
  }
}

class BlackFridayDiscount implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return basePrice * 0.5; // 50% off
  }
}

class PriceCalculator {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }

  calculate(basePrice: number): number {
    return this.strategy.calculatePrice(basePrice);
  }
}

// Usage
const calculator = new PriceCalculator(new RegularPricing());
console.log(calculator.calculate(100)); // 100

calculator.setStrategy(new BlackFridayDiscount());
console.log(calculator.calculate(100)); // 50

// ============================================================================
// 6. DECORATOR PATTERN
// ============================================================================
// Adds new functionality to objects without altering their structure
// Use Case: Adding features to objects dynamically, middleware

interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number {
    return 5;
  }

  description(): string {
    return "Simple coffee";
  }
}

class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost();
  }

  description(): string {
    return this.coffee.description();
  }
}

class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return this.coffee.description() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 1;
  }

  description(): string {
    return this.coffee.description() + ", sugar";
  }
}

class WhipCreamDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 3;
  }

  description(): string {
    return this.coffee.description() + ", whip cream";
  }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhipCreamDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);

// ============================================================================
// 7. ADAPTER PATTERN
// ============================================================================
// Allows incompatible interfaces to work together
// Use Case: Integrating third-party libraries, legacy code integration

interface ModernPaymentProcessor {
  processPayment(amount: number, currency: string): boolean;
}

class LegacyPaymentSystem {
  makePayment(dollars: number): string {
    console.log(`Processing $${dollars} through legacy system`);
    return "SUCCESS";
  }
}

class PaymentAdapter implements ModernPaymentProcessor {
  constructor(private legacySystem: LegacyPaymentSystem) {}

  processPayment(amount: number, currency: string): boolean {
    // Convert currency if needed (simplified)
    const dollars = currency === "USD" ? amount : amount * 1.2;
    const result = this.legacySystem.makePayment(dollars);
    return result === "SUCCESS";
  }
}

// Usage
const legacySystem = new LegacyPaymentSystem();
const modernAdapter = new PaymentAdapter(legacySystem);
modernAdapter.processPayment(100, "USD");

// ============================================================================
// 8. FACADE PATTERN
// ============================================================================
// Provides a simplified interface to a complex subsystem
// Use Case: Simplifying complex APIs, hiding implementation details

class CPU {
  freeze(): void {
    console.log("CPU frozen");
  }
  jump(position: number): void {
    console.log(`CPU jumped to position ${position}`);
  }
  execute(): void {
    console.log("CPU executing");
  }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory loaded ${data} at position ${position}`);
  }
}

class HardDrive {
  read(sector: number, size: number): string {
    console.log(`HardDrive reading ${size} bytes from sector ${sector}`);
    return "data";
  }
}

class ComputerFacade {
  constructor(
    private cpu: CPU,
    private memory: Memory,
    private hardDrive: HardDrive
  ) {}

  start(): void {
    console.log("Starting computer...");
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log("Computer started!");
  }
}

// Usage
const computer = new ComputerFacade(new CPU(), new Memory(), new HardDrive());
computer.start();

// ============================================================================
// 9. REPOSITORY PATTERN
// ============================================================================
// Mediates between domain and data mapping layers
// Use Case: Database abstraction, data access layer

interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

class UserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async create(user: User): Promise<User> {
    const id = Math.random().toString(36).substr(2, 9);
    this.users.set(id, user);
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

// Usage
const userRepo = new UserRepository();
// userRepo.create(new User('Alice', 'alice@example.com'));

// ============================================================================
// 10. DEPENDENCY INJECTION PATTERN
// ============================================================================
// Provides objects with their dependencies instead of creating them
// Use Case: Loose coupling, testability, maintainability

interface IEmailService {
  sendEmail(to: string, subject: string, body: string): void;
}

class EmailService implements IEmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

class MockEmailService implements IEmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`[MOCK] Email to ${to}: ${subject}`);
  }
}

class UserService {
  constructor(private emailService: IEmailService) {}

  registerUser(email: string, name: string): void {
    // Registration logic...
    console.log(`Registering user: ${name}`);

    // Send welcome email
    this.emailService.sendEmail(
      email,
      "Welcome!",
      `Hello ${name}, welcome to our platform!`
    );
  }
}

// Usage
const emailService = new EmailService();
const userService = new UserService(emailService);
userService.registerUser("john@example.com", "John");

// For testing, inject mock service
const mockEmailService = new MockEmailService();
const testUserService = new UserService(mockEmailService);
testUserService.registerUser("test@example.com", "Test User");

// ============================================================================
// BONUS: MODULE PATTERN (TypeScript/JavaScript specific)
// ============================================================================
// Encapsulates private data and exposes public API
// Use Case: Creating private state, organizing code

const CounterModule = (() => {
  let count = 0; // Private variable

  return {
    increment(): number {
      return ++count;
    },
    decrement(): number {
      return --count;
    },
    getCount(): number {
      return count;
    },
    reset(): void {
      count = 0;
    },
  };
})();

// Usage
console.log(CounterModule.increment()); // 1
console.log(CounterModule.increment()); // 2
console.log(CounterModule.getCount()); // 2
CounterModule.reset();
console.log(CounterModule.getCount()); // 0

// ============================================================================
// PRACTICAL EXAMPLE: Combining Multiple Patterns
// ============================================================================

// Real-world example combining Factory, Strategy, and Observer patterns

interface NotificationStrategy {
  send(message: string): void;
}

class EmailStrategy implements NotificationStrategy {
  send(message: string): void {
    console.log(`📧 Email: ${message}`);
  }
}

class SMSStrategy implements NotificationStrategy {
  send(message: string): void {
    console.log(`📱 SMS: ${message}`);
  }
}

class PushStrategy implements NotificationStrategy {
  send(message: string): void {
    console.log(`🔔 Push: ${message}`);
  }
}

class NotificationFactory {
  static create(type: "email" | "sms" | "push"): NotificationStrategy {
    switch (type) {
      case "email":
        return new EmailStrategy();
      case "sms":
        return new SMSStrategy();
      case "push":
        return new PushStrategy();
    }
  }
}

class NotificationService {
  private observers: Array<{ strategy: NotificationStrategy }> = [];

  addChannel(type: "email" | "sms" | "push"): void {
    const strategy = NotificationFactory.create(type);
    this.observers.push({ strategy });
  }

  sendNotification(message: string): void {
    this.observers.forEach(({ strategy }) => {
      strategy.send(message);
    });
  }
}

// Usage
const notificationService = new NotificationService();
notificationService.addChannel("email");
notificationService.addChannel("sms");
notificationService.addChannel("push");
notificationService.sendNotification("Your order has been shipped!");

/**
 * SUMMARY OF MOST USED PATTERNS:
 *
 * 1. Singleton - Single instance (Config, Logger, Database)
 * 2. Factory - Object creation without specifying exact class
 * 3. Builder - Complex object construction with many parameters
 * 4. Observer - Event handling and notifications
 * 5. Strategy - Interchangeable algorithms
 * 6. Decorator - Adding functionality dynamically
 * 7. Adapter - Making incompatible interfaces work together
 * 8. Facade - Simplifying complex subsystems
 * 9. Repository - Data access abstraction
 * 10. Dependency Injection - Loose coupling and testability
 *
 * WHEN TO USE EACH:
 * - Singleton: Global state management, single resource access
 * - Factory: Dynamic object creation based on conditions
 * - Builder: Objects with many optional parameters
 * - Observer: Event-driven systems, real-time updates
 * - Strategy: Multiple ways to perform same operation
 * - Decorator: Add features without modifying existing code
 * - Adapter: Integrate third-party or legacy code
 * - Facade: Simplify complex API usage
 * - Repository: Abstract database operations
 * - Dependency Injection: Improve testability and flexibility
 */

export {
  Logger,
  PaymentFactory,
  UserBuilder,
  Subject,
  PriceCalculator,
  ComputerFacade,
  UserRepository,
  NotificationService,
};
