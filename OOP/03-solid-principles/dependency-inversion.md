# Dependency Inversion Principle (DIP)

## Overview

**"Depend on abstractions, not on concretions."** - Robert C. Martin

High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

## Key Concepts

1. High-level modules should not import from low-level modules
2. Both should depend on abstractions (interfaces/abstract classes)
3. Abstractions should not depend on details
4. Details should depend on abstractions

## TypeScript Examples

### ❌ Bad: High-level depends on low-level

```typescript
// Low-level module
class MySQLDatabase {
  connect(): void {
    console.log("Connecting to MySQL");
  }

  query(sql: string): any[] {
    console.log(`MySQL Query: ${sql}`);
    return [];
  }
}

// High-level module depends on concrete low-level class
class UserService {
  private database = new MySQLDatabase(); // Direct dependency!

  getUser(id: string): any {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}
```

### ✅ Good: Both depend on abstraction

```typescript
// Abstraction
interface Database {
  connect(): void;
  query(sql: string): any[];
}

// Low-level implementation
class MySQLDatabase implements Database {
  connect(): void {
    console.log("Connecting to MySQL");
  }

  query(sql: string): any[] {
    console.log(`MySQL Query: ${sql}`);
    return [];
  }
}

class PostgreSQLDatabase implements Database {
  connect(): void {
    console.log("Connecting to PostgreSQL");
  }

  query(sql: string): any[] {
    console.log(`PostgreSQL Query: ${sql}`);
    return [];
  }
}

// High-level module depends on abstraction
class UserService {
  constructor(private database: Database) {} // Depend on interface!

  getUser(id: string): any {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Easy to switch implementations
const mysqlService = new UserService(new MySQLDatabase());
const postgresService = new UserService(new PostgreSQLDatabase());
```

## Real-World Example: Notification System

```typescript
// ❌ Bad: Tight coupling
class EmailSender {
  send(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

class NotificationService {
  private emailSender = new EmailSender(); // Tight coupling!

  notify(message: string): void {
    this.emailSender.send(message);
  }
}

// ✅ Good: Depend on abstraction
interface MessageSender {
  send(message: string): void;
}

class EmailSender implements MessageSender {
  send(message: string): void {
    console.log(`📧 Email: ${message}`);
  }
}

class SMSSender implements MessageSender {
  send(message: string): void {
    console.log(`📱 SMS: ${message}`);
  }
}

class PushNotificationSender implements MessageSender {
  send(message: string): void {
    console.log(`🔔 Push: ${message}`);
  }
}

class NotificationService {
  constructor(private sender: MessageSender) {} // Depend on interface!

  notify(message: string): void {
    this.sender.send(message);
  }
}

// Flexible - can use any sender
const emailNotif = new NotificationService(new EmailSender());
const smsNotif = new NotificationService(new SMSSender());
const pushNotif = new NotificationService(new PushNotificationSender());

emailNotif.notify("Hello via Email");
smsNotif.notify("Hello via SMS");
pushNotif.notify("Hello via Push");
```

## Benefits

1. **Flexibility** - Easy to swap implementations
2. **Testability** - Easy to mock dependencies
3. **Maintainability** - Changes don't ripple through system
4. **Reusability** - Components can be reused in different contexts

## With Dependency Injection

```typescript
interface Logger {
  log(message: string): void;
}

interface PaymentGateway {
  charge(amount: number): boolean;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class StripePayment implements PaymentGateway {
  charge(amount: number): boolean {
    console.log(`Charging $${amount} via Stripe`);
    return true;
  }
}

// High-level service depends on abstractions
class CheckoutService {
  constructor(private logger: Logger, private paymentGateway: PaymentGateway) {}

  processCheckout(amount: number): void {
    this.logger.log(`Processing checkout for $${amount}`);

    if (this.paymentGateway.charge(amount)) {
      this.logger.log("Payment successful");
    } else {
      this.logger.log("Payment failed");
    }
  }
}

// Dependencies injected
const checkoutService = new CheckoutService(
  new ConsoleLogger(),
  new StripePayment()
);

checkoutService.processCheckout(99.99);
```

## Summary

- Depend on abstractions (interfaces), not concrete classes
- Enables loose coupling and flexibility
- Essential for testability and maintainability
- Works hand-in-hand with Dependency Injection
- Inverts the traditional dependency flow

---

**Next Steps:**

- Study [Dependency Injection](../02-advanced-concepts/dependency-injection.md)
- Review all [SOLID Principles](README.md)
- Practice [Design Patterns](../04-design-patterns/)
