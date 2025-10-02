# Single Responsibility Principle (SRP)

## Overview

**"A class should have one, and only one, reason to change."** - Robert C. Martin

The Single Responsibility Principle states that a class should have only one job or responsibility. If a class has more than one responsibility, those responsibilities become coupled, and changes to one responsibility may affect the class's ability to fulfill its other responsibilities.

## Key Concepts

### What is a "Responsibility"?

A responsibility is a reason to change. If you can think of more than one reason to change a class, then that class has more than one responsibility.

### Benefits

1. **Easier to understand** - Each class does one thing well
2. **Easier to test** - Fewer dependencies and mock requirements
3. **Lower coupling** - Changes don't ripple through the system
4. **Better organization** - Clear structure and purpose
5. **Easier maintenance** - Changes are localized

## Examples

### ❌ Bad: Multiple Responsibilities

```typescript
// BAD: This class has too many responsibilities
class User {
  constructor(
    public name: string,
    public email: string,
    private password: string
  ) {}

  // Responsibility 1: User data management
  updateProfile(name: string, email: string): void {
    this.name = name;
    this.email = email;
  }

  // Responsibility 2: Authentication
  login(password: string): boolean {
    return this.password === password;
  }

  // Responsibility 3: Database operations
  save(): void {
    console.log(`Saving user ${this.name} to database...`);
    // database logic
  }

  // Responsibility 4: Email sending
  sendWelcomeEmail(): void {
    console.log(`Sending welcome email to ${this.email}`);
    // email sending logic
  }

  // Responsibility 5: Validation
  validate(): boolean {
    return this.email.includes("@") && this.password.length >= 8;
  }

  // Responsibility 6: Formatting/Presentation
  toHTML(): string {
    return `<div><h1>${this.name}</h1><p>${this.email}</p></div>`;
  }
}
```

### ✅ Good: Separated Responsibilities

```typescript
// GOOD: Each class has a single responsibility

// 1. User entity - only user data
class User {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  updateProfile(name: string, email: string): void {
    this.name = name;
    this.email = email;
  }
}

// 2. Authentication service
class AuthenticationService {
  login(user: User, password: string): boolean {
    return user.password === password;
  }

  logout(user: User): void {
    console.log(`${user.name} logged out`);
  }
}

// 3. User repository - database operations
class UserRepository {
  save(user: User): void {
    console.log(`Saving user ${user.name} to database...`);
  }

  findByEmail(email: string): User | null {
    console.log(`Finding user by email: ${email}`);
    return null; // database query
  }

  delete(user: User): void {
    console.log(`Deleting user ${user.name}`);
  }
}

// 4. Email service
class EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`Sending welcome email to ${user.email}`);
  }

  sendPasswordReset(user: User): void {
    console.log(`Sending password reset to ${user.email}`);
  }
}

// 5. User validator
class UserValidator {
  validate(user: User): boolean {
    return this.isValidEmail(user.email) && this.isValidPassword(user.password);
  }

  private isValidEmail(email: string): boolean {
    return email.includes("@");
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8;
  }
}

// 6. User formatter/presenter
class UserFormatter {
  toHTML(user: User): string {
    return `<div><h1>${user.name}</h1><p>${user.email}</p></div>`;
  }

  toJSON(user: User): string {
    return JSON.stringify({
      name: user.name,
      email: user.email,
    });
  }
}

// Usage
const user = new User("Alice", "alice@example.com", "password123");
const authService = new AuthenticationService();
const userRepo = new UserRepository();
const emailService = new EmailService();
const validator = new UserValidator();
const formatter = new UserFormatter();

if (validator.validate(user)) {
  userRepo.save(user);
  emailService.sendWelcomeEmail(user);
  console.log(formatter.toHTML(user));
}
```

## Real-World Examples

### Example 1: E-Commerce Order Processing

```typescript
// ❌ BAD: God class with multiple responsibilities
class BadOrder {
  calculateTotal(): number {
    // calculation logic
    return 0;
  }

  saveToDatabase(): void {
    // database logic
  }

  sendConfirmationEmail(): void {
    // email logic
  }

  generateInvoice(): string {
    // invoice generation
    return "";
  }

  processPayment(): void {
    // payment logic
  }

  updateInventory(): void {
    // inventory logic
  }
}

// ✅ GOOD: Separated responsibilities
class Order {
  constructor(
    public id: string,
    public items: OrderItem[],
    public customerId: string
  ) {}
}

class OrderCalculator {
  calculateTotal(order: Order): number {
    return order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  calculateTax(order: Order): number {
    return this.calculateTotal(order) * 0.1;
  }
}

class OrderRepository {
  save(order: Order): void {
    console.log(`Saving order ${order.id}`);
  }

  findById(id: string): Order | null {
    return null;
  }
}

class OrderNotificationService {
  sendConfirmation(order: Order): void {
    console.log(`Sending confirmation for order ${order.id}`);
  }

  sendShippingUpdate(order: Order): void {
    console.log(`Sending shipping update for order ${order.id}`);
  }
}

class InvoiceGenerator {
  generate(order: Order): string {
    return `Invoice for order ${order.id}`;
  }
}

class PaymentProcessor {
  process(order: Order, amount: number): boolean {
    console.log(`Processing payment of $${amount} for order ${order.id}`);
    return true;
  }
}

class InventoryManager {
  updateStock(order: Order): void {
    order.items.forEach((item) => {
      console.log(`Reducing stock for ${item.productId} by ${item.quantity}`);
    });
  }
}

// Order processing service coordinates everything
class OrderService {
  constructor(
    private calculator: OrderCalculator,
    private repository: OrderRepository,
    private notificationService: OrderNotificationService,
    private invoiceGenerator: InvoiceGenerator,
    private paymentProcessor: PaymentProcessor,
    private inventoryManager: InventoryManager
  ) {}

  placeOrder(order: Order): void {
    const total = this.calculator.calculateTotal(order);

    if (this.paymentProcessor.process(order, total)) {
      this.repository.save(order);
      this.inventoryManager.updateStock(order);
      this.notificationService.sendConfirmation(order);

      const invoice = this.invoiceGenerator.generate(order);
      console.log(invoice);
    }
  }
}
```

### Example 2: Report Generation

```typescript
// ❌ BAD: Report class doing too much
class BadReport {
  private data: any[];

  fetchData(): void {
    // fetch from database
  }

  processData(): void {
    // process data
  }

  formatAsHTML(): string {
    // HTML formatting
    return "";
  }

  formatAsPDF(): string {
    // PDF formatting
    return "";
  }

  sendViaEmail(): void {
    // email sending
  }

  saveToFile(): void {
    // file operations
  }
}

// ✅ GOOD: Separated concerns
interface Report {
  title: string;
  data: any[];
  generatedAt: Date;
}

class ReportDataFetcher {
  fetch(query: string): any[] {
    console.log(`Fetching data with query: ${query}`);
    return [];
  }
}

class ReportDataProcessor {
  process(data: any[]): any[] {
    console.log("Processing report data...");
    return data.map((item) => ({ ...item, processed: true }));
  }
}

interface ReportFormatter {
  format(report: Report): string;
}

class HTMLReportFormatter implements ReportFormatter {
  format(report: Report): string {
    return `<h1>${report.title}</h1><div>${JSON.stringify(report.data)}</div>`;
  }
}

class PDFReportFormatter implements ReportFormatter {
  format(report: Report): string {
    return `PDF: ${report.title} - ${report.data.length} records`;
  }
}

class CSVReportFormatter implements ReportFormatter {
  format(report: Report): string {
    return report.data.map((row) => Object.values(row).join(",")).join("\n");
  }
}

class ReportDeliveryService {
  sendViaEmail(report: Report, recipient: string): void {
    console.log(`Emailing report "${report.title}" to ${recipient}`);
  }

  saveToFile(report: Report, filename: string): void {
    console.log(`Saving report "${report.title}" to ${filename}`);
  }
}

// Usage
class ReportGenerator {
  constructor(
    private dataFetcher: ReportDataFetcher,
    private dataProcessor: ReportDataProcessor,
    private formatter: ReportFormatter,
    private deliveryService: ReportDeliveryService
  ) {}

  generate(title: string, query: string): Report {
    const rawData = this.dataFetcher.fetch(query);
    const processedData = this.dataProcessor.process(rawData);

    return {
      title,
      data: processedData,
      generatedAt: new Date(),
    };
  }

  generateAndDeliver(title: string, query: string, recipient: string): void {
    const report = this.generate(title, query);
    const formatted = this.formatter.format(report);
    this.deliveryService.sendViaEmail(report, recipient);
  }
}
```

## How to Identify SRP Violations

### Red Flags

1. **Class name contains "And", "Or", "Manager"**

   - `UserAndOrderManager` - probably doing too much

2. **Many public methods with different purposes**

   - Mix of business logic, persistence, presentation

3. **Many imports/dependencies**

   - Needs many different types of objects

4. **Hard to name the class**

   - If you can't describe it in one sentence

5. **Frequent changes for different reasons**
   - UI changes require modifying database code

## Best Practices

### 1. One Reason to Change

```typescript
// ✅ Changes to logging don't affect user logic
class Logger {
  log(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string): void {
    // user creation logic
    this.logger.log(`User ${name} created`);
  }
}
```

### 2. Small, Focused Classes

```typescript
// Each class does one thing well
class EmailValidator {
  isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

class PasswordHasher {
  hash(password: string): string {
    // hashing logic
    return `hashed_${password}`;
  }

  verify(password: string, hash: string): boolean {
    return this.hash(password) === hash;
  }
}
```

### 3. Clear Class Purpose

```typescript
// Purpose is clear from the name and methods
class ProductPriceCalculator {
  calculateBasePrice(product: Product): number {
    return product.basePrice;
  }

  calculateDiscountedPrice(product: Product, discountPercent: number): number {
    return product.basePrice * (1 - discountPercent / 100);
  }

  calculateTax(price: number, taxRate: number): number {
    return price * taxRate;
  }
}
```

## Summary

- One class = one responsibility = one reason to change
- Makes code easier to understand, test, and maintain
- Leads to better organization and modularity
- Reduces coupling between different concerns
- Foundation for other SOLID principles

---

**Next Steps:**

- Learn [Open/Closed Principle](open-closed.md)
- Study [Dependency Injection](../02-advanced-concepts/dependency-injection.md)
- Practice identifying responsibilities in your code
