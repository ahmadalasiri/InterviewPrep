# Dependency Injection

## Overview

Dependency Injection (DI) is a design pattern that implements Inversion of Control (IoC) for resolving dependencies. Instead of a class creating its own dependencies, they are "injected" from the outside.

## Key Concepts

### What is a Dependency?

A dependency is any object that another object requires to function.

```typescript
class UserService {
  private database = new MySQL(); // ❌ UserService depends on MySQL
}
```

### What is Dependency Injection?

Instead of creating dependencies internally, they are provided (injected) from outside:

```typescript
class UserService {
  constructor(private database: Database) {} // ✅ Dependency injected
}
```

## Benefits

1. **Loose Coupling** - Classes don't depend on concrete implementations
2. **Testability** - Easy to inject mocks/stubs for testing
3. **Flexibility** - Easy to swap implementations
4. **Reusability** - Components can be reused in different contexts
5. **Maintainability** - Changes isolated to specific implementations

## Types of Dependency Injection

### 1. Constructor Injection (Recommended)

Dependencies injected through the constructor:

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[CONSOLE] ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE] Writing to file: ${message}`);
  }
}

class UserService {
  // Dependencies injected via constructor
  constructor(private database: Database, private logger: Logger) {}

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name}`);
    this.database.save("users", { name });
    this.logger.log("User created successfully");
  }
}

// Inject dependencies
const service = new UserService(new MySQLDatabase(), new ConsoleLogger());

// Easy to switch implementations
const fileService = new UserService(new MongoDatabase(), new FileLogger());
```

### 2. Property Injection

Dependencies set through public properties:

```typescript
class EmailService {
  public logger!: Logger; // Will be injected

  sendEmail(to: string, message: string): void {
    this.logger?.log(`Sending email to ${to}`);
    // Send logic...
  }
}

// Inject via property
const emailService = new EmailService();
emailService.logger = new ConsoleLogger();
```

### 3. Method Injection

Dependencies passed as method parameters:

```typescript
class ReportGenerator {
  generateReport(data: any[], formatter: Formatter): string {
    // Formatter injected as method parameter
    return formatter.format(data);
  }
}
```

## Real-World Examples

### Example 1: E-Commerce Order Processing

```typescript
// Interfaces for dependencies
interface PaymentProcessor {
  processPayment(amount: number): Promise<boolean>;
}

interface EmailNotifier {
  sendConfirmation(email: string, orderId: string): Promise<void>;
}

interface InventoryManager {
  checkStock(productId: string): Promise<boolean>;
  reduceStock(productId: string, quantity: number): Promise<void>;
}

// Concrete implementations
class StripePayment implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing $${amount} via Stripe...`);
    return true;
  }
}

class SendGridEmail implements EmailNotifier {
  async sendConfirmation(email: string, orderId: string): Promise<void> {
    console.log(`Sending confirmation email to ${email} for order ${orderId}`);
  }
}

class WarehouseInventory implements InventoryManager {
  async checkStock(productId: string): Promise<boolean> {
    console.log(`Checking stock for ${productId}`);
    return true;
  }

  async reduceStock(productId: string, quantity: number): Promise<void> {
    console.log(`Reducing stock: ${productId} x${quantity}`);
  }
}

// Service with injected dependencies
class OrderService {
  constructor(
    private paymentProcessor: PaymentProcessor,
    private emailNotifier: EmailNotifier,
    private inventoryManager: InventoryManager
  ) {}

  async placeOrder(
    productId: string,
    quantity: number,
    email: string,
    amount: number
  ): Promise<string> {
    // Check inventory
    const inStock = await this.inventoryManager.checkStock(productId);
    if (!inStock) {
      throw new Error("Product out of stock");
    }

    // Process payment
    const paymentSuccess = await this.paymentProcessor.processPayment(amount);
    if (!paymentSuccess) {
      throw new Error("Payment failed");
    }

    // Update inventory
    await this.inventoryManager.reduceStock(productId, quantity);

    // Send confirmation
    const orderId = `ORD-${Date.now()}`;
    await this.emailNotifier.sendConfirmation(email, orderId);

    return orderId;
  }
}

// Usage - inject all dependencies
const orderService = new OrderService(
  new StripePayment(),
  new SendGridEmail(),
  new WarehouseInventory()
);

// orderService.placeOrder("PROD-123", 2, "customer@example.com", 99.99);
```

### Example 2: Testing with DI

```typescript
// Mock implementations for testing
class MockPaymentProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`[MOCK] Payment of $${amount}`);
    return true; // Always succeed in tests
  }
}

class MockEmailNotifier implements EmailNotifier {
  public emailsSent: Array<{ email: string; orderId: string }> = [];

  async sendConfirmation(email: string, orderId: string): Promise<void> {
    console.log(`[MOCK] Email to ${email}`);
    this.emailsSent.push({ email, orderId });
  }
}

class MockInventoryManager implements InventoryManager {
  async checkStock(productId: string): Promise<boolean> {
    return true;
  }

  async reduceStock(productId: string, quantity: number): Promise<void> {
    console.log(`[MOCK] Reduced stock: ${productId} x${quantity}`);
  }
}

// Test with mocks
async function testOrderService() {
  const mockEmail = new MockEmailNotifier();

  const testService = new OrderService(
    new MockPaymentProcessor(),
    mockEmail,
    new MockInventoryManager()
  );

  await testService.placeOrder("TEST-PROD", 1, "test@example.com", 50);

  // Verify email was sent
  console.log("Emails sent:", mockEmail.emailsSent.length);
}

// testOrderService();
```

### Example 3: Configuration-Based Injection

```typescript
// Configuration object
interface AppConfig {
  database: {
    type: "mysql" | "postgres" | "mongo";
    host: string;
  };
  logger: {
    level: "debug" | "info" | "error";
    output: "console" | "file";
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

// Factory pattern with DI
class ServiceFactory {
  static createDatabase(config: AppConfig["database"]): Database {
    switch (config.type) {
      case "mysql":
        return new MySQLDatabase(config.host);
      case "postgres":
        return new PostgreSQLDatabase(config.host);
      case "mongo":
        return new MongoDatabase(config.host);
    }
  }

  static createLogger(config: AppConfig["logger"]): Logger {
    if (config.output === "file") {
      return new FileLogger(config.level);
    }
    return new ConsoleLogger(config.level);
  }

  static createCache(config: AppConfig["cache"]): Cache | null {
    return config.enabled ? new RedisCache(config.ttl) : null;
  }
}

// Application class with injected services
class Application {
  constructor(
    private database: Database,
    private logger: Logger,
    private cache: Cache | null
  ) {}

  start(): void {
    this.logger.log("Application starting...");
    // Use injected services
  }
}

// Bootstrap application with config
const config: AppConfig = {
  database: { type: "postgres", host: "localhost" },
  logger: { level: "info", output: "console" },
  cache: { enabled: true, ttl: 3600 },
};

const app = new Application(
  ServiceFactory.createDatabase(config.database),
  ServiceFactory.createLogger(config.logger),
  ServiceFactory.createCache(config.cache)
);
```

## DI Container (Advanced)

A DI Container automates dependency resolution:

```typescript
// Simple DI Container implementation
class Container {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  // Register a service instance
  registerInstance<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  // Register a factory function
  registerFactory<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
  }

  // Resolve a service
  resolve<T>(name: string): T {
    // Check if instance exists
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    // Check if factory exists
    if (this.factories.has(name)) {
      const factory = this.factories.get(name)!;
      const instance = factory();
      this.services.set(name, instance); // Cache as singleton
      return instance;
    }

    throw new Error(`Service '${name}' not found`);
  }
}

// Usage
const container = new Container();

// Register services
container.registerFactory("database", () => new MySQLDatabase());
container.registerFactory("logger", () => new ConsoleLogger());

container.registerFactory(
  "userService",
  () =>
    new UserService(container.resolve("database"), container.resolve("logger"))
);

// Resolve services
const userService = container.resolve<UserService>("userService");
```

## Best Practices

### 1. Depend on Abstractions

```typescript
// ✅ Good: Depend on interface
class OrderProcessor {
  constructor(private notifier: Notifier) {}
}

// ❌ Bad: Depend on concrete class
class OrderProcessor {
  constructor(private emailService: EmailService) {}
}
```

### 2. Use Constructor Injection

```typescript
// ✅ Good: Dependencies clear and required
class Service {
  constructor(private dep1: Dep1, private dep2: Dep2) {}
}

// ❌ Bad: Hidden dependencies
class Service {
  private dep1 = new Dep1();
  private dep2 = new Dep2();
}
```

### 3. Avoid Service Locator Anti-Pattern

```typescript
// ❌ Bad: Service Locator (anti-pattern)
class UserService {
  private logger = ServiceLocator.get("logger");
  private db = ServiceLocator.get("database");
}

// ✅ Good: Explicit DI
class UserService {
  constructor(private logger: Logger, private db: Database) {}
}
```

### 4. Keep Dependencies Minimal

```typescript
// ❌ Bad: Too many dependencies
class Service {
  constructor(
    private dep1: Dep1,
    private dep2: Dep2,
    private dep3: Dep3,
    private dep4: Dep4,
    private dep5: Dep5,
    private dep6: Dep6
  ) {} // Too many!
}

// ✅ Good: Refactor or use facade
class ServiceDependencies {
  constructor(public dep1: Dep1, public dep2: Dep2, public dep3: Dep3) {}
}

class Service {
  constructor(private deps: ServiceDependencies) {}
}
```

## Common Patterns

### 1. Factory Pattern with DI

```typescript
interface Product {
  use(): void;
}

class ProductA implements Product {
  use(): void {
    console.log("Using Product A");
  }
}

class ProductB implements Product {
  use(): void {
    console.log("Using Product B");
  }
}

// Factory injected as dependency
interface ProductFactory {
  create(type: string): Product;
}

class ConcreteProductFactory implements ProductFactory {
  create(type: string): Product {
    return type === "A" ? new ProductA() : new ProductB();
  }
}

class ProductService {
  constructor(private factory: ProductFactory) {}

  processProduct(type: string): void {
    const product = this.factory.create(type);
    product.use();
  }
}
```

### 2. Optional Dependencies

```typescript
class AnalyticsService {
  constructor(
    private logger: Logger,
    private crashReporter?: CrashReporter // Optional
  ) {}

  track(event: string): void {
    this.logger.log(`Event: ${event}`);
    this.crashReporter?.report(`Analytics: ${event}`);
  }
}

// Can work with or without crash reporter
const analytics1 = new AnalyticsService(new Logger());
const analytics2 = new AnalyticsService(new Logger(), new Sentry());
```

## Interview Questions

1. **What is Dependency Injection?**
2. **What are the benefits of DI?**
3. **What are the types of DI?**
4. **What is the difference between DI and Service Locator?**
5. **How does DI improve testability?**
6. **What is a DI Container?**
7. **When should you NOT use DI?**
8. **How does DI relate to SOLID principles?**

## Summary

- DI is providing dependencies from outside rather than creating them internally
- Improves testability, flexibility, and maintainability
- Constructor injection is the preferred method
- Depend on abstractions, not concrete implementations
- Makes code more modular and easier to test
- Essential for writing loosely coupled, testable code

---

**Next Steps:**

- Study [Dependency Inversion Principle](../03-solid-principles/dependency-inversion.md)
- Learn [SOLID Principles](../03-solid-principles/)
- Explore [Design Patterns](../04-design-patterns/)
