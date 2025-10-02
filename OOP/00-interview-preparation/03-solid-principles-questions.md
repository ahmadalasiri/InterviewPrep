# SOLID Principles Questions

## Table of Contents

- [Single Responsibility Principle](#single-responsibility-principle)
- [Open/Closed Principle](#openclosed-principle)
- [Liskov Substitution Principle](#liskov-substitution-principle)
- [Interface Segregation Principle](#interface-segregation-principle)
- [Dependency Inversion Principle](#dependency-inversion-principle)

---

## Single Responsibility Principle

### Q1: Explain the Single Responsibility Principle (SRP).

**Answer:**
A class should have only one reason to change. Each class should have a single, well-defined responsibility.

**Benefits:**

- Easier to understand and maintain
- Reduces code complexity
- Improves testability
- Better organization

**Example (TypeScript):**

```typescript
// Violates SRP - Multiple responsibilities
class BadUser {
  constructor(public name: string, public email: string) {}

  // Responsibility 1: User data management
  updateEmail(newEmail: string): void {
    this.email = newEmail;
  }

  // Responsibility 2: Data persistence
  saveTo;

  Database(): void {
    console.log("Saving to database...");
    // Database logic
  }

  // Responsibility 3: Email notifications
  sendWelcomeEmail(): void {
    console.log(`Sending welcome email to ${this.email}`);
    // Email sending logic
  }

  // Responsibility 4: Validation
  validateEmail(): boolean {
    return this.email.includes("@");
  }
}

// Follows SRP - Single responsibility per class
class User {
  constructor(private name: string, private email: string) {}

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
  }
}

class UserRepository {
  save(user: User): void {
    console.log(`Saving user ${user.getName()} to database`);
    // Database logic only
  }

  findById(id: string): User | null {
    console.log(`Finding user ${id}`);
    return null;
  }
}

class EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`Sending welcome email to ${user.getEmail()}`);
    // Email logic only
  }

  sendPasswordReset(user: User): void {
    console.log(`Sending password reset to ${user.getEmail()}`);
  }
}

class EmailValidator {
  validate(email: string): boolean {
    return email.includes("@") && email.includes(".");
  }
}

// Usage
const user = new User("Alice", "alice@example.com");
const repository = new UserRepository();
const emailService = new EmailService();
const validator = new EmailValidator();

if (validator.validate(user.getEmail())) {
  repository.save(user);
  emailService.sendWelcomeEmail(user);
}
```

---

## Open/Closed Principle

### Q2: Explain the Open/Closed Principle (OCP).

**Answer:**
Software entities should be open for extension but closed for modification. You should be able to add new functionality without changing existing code.

**Benefits:**

- Reduces risk of breaking existing functionality
- Makes code more maintainable
- Encourages modular design

**Example (TypeScript):**

```typescript
// Violates OCP - Must modify class to add new shapes
class BadAreaCalculator {
  calculateArea(shape: any): number {
    if (shape.type === "circle") {
      return Math.PI * shape.radius ** 2;
    } else if (shape.type === "rectangle") {
      return shape.width * shape.height;
    }
    // To add triangle, must modify this class
    return 0;
  }
}

// Follows OCP - Can extend without modification
interface Shape {
  calculateArea(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }
}

// New shape - no modification to existing code
class Triangle implements Shape {
  constructor(private base: number, private height: number) {}

  calculateArea(): number {
    return (this.base * this.height) / 2;
  }
}

class AreaCalculator {
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }
}

// Another example: Discount system
interface DiscountStrategy {
  applyDiscount(price: number): number;
}

class NoDiscount implements DiscountStrategy {
  applyDiscount(price: number): number {
    return price;
  }
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  applyDiscount(price: number): number {
    return price * (1 - this.percentage / 100);
  }
}

class FixedAmountDiscount implements DiscountStrategy {
  constructor(private amount: number) {}

  applyDiscount(price: number): number {
    return Math.max(0, price - this.amount);
  }
}

// Easy to add new discount types without modifying existing code
class SeasonalDiscount implements DiscountStrategy {
  constructor(private season: string) {}

  applyDiscount(price: number): number {
    const seasonalRates: { [key: string]: number } = {
      summer: 0.15,
      winter: 0.2,
      spring: 0.1,
      fall: 0.1,
    };
    const discount = seasonalRates[this.season] || 0;
    return price * (1 - discount);
  }
}

class ShoppingCart {
  constructor(private discountStrategy: DiscountStrategy) {}

  checkout(price: number): number {
    return this.discountStrategy.applyDiscount(price);
  }

  setDiscountStrategy(strategy: DiscountStrategy): void {
    this.discountStrategy = strategy;
  }
}

// Usage
const cart = new ShoppingCart(new NoDiscount());
console.log(cart.checkout(100)); // 100

cart.setDiscountStrategy(new PercentageDiscount(20));
console.log(cart.checkout(100)); // 80

cart.setDiscountStrategy(new SeasonalDiscount("winter"));
console.log(cart.checkout(100)); // 80
```

---

## Liskov Substitution Principle

### Q3: Explain the Liskov Substitution Principle (LSP).

**Answer:**
Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program. Subtypes must be substitutable for their base types.

**Rules:**

- Preconditions cannot be strengthened
- Postconditions cannot be weakened
- Invariants must be preserved
- No new exceptions should be thrown

**Example (TypeScript):**

```typescript
// Violates LSP
class Bird {
  fly(): void {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error("Penguins can't fly!"); // Breaks LSP
  }
}

function makeBirdFly(bird: Bird): void {
  bird.fly(); // This will throw error for Penguin
}

// const penguin = new Penguin();
// makeBirdFly(penguin); // Runtime error!

// Follows LSP - Proper abstraction
abstract class Animal {
  abstract move(): void;
}

class FlyingBird extends Animal {
  move(): void {
    console.log("Flying");
  }

  fly(): void {
    console.log("Flying high");
  }
}

class WalkingBird extends Animal {
  move(): void {
    console.log("Walking");
  }
}

class Sparrow extends FlyingBird {}
class BetterPenguin extends WalkingBird {}

function makeAnimalMove(animal: Animal): void {
  animal.move(); // Works for all animals
}

makeAnimalMove(new Sparrow()); // Flying
makeAnimalMove(new BetterPenguin()); // Walking

// Another example: Rectangle and Square
class Rectangle2 {
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

// Violates LSP
class Square extends Rectangle2 {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Changes height too
  }

  setHeight(height: number): void {
    this.width = height; // Changes width too
    this.height = height;
  }
}

function testRectangle(rect: Rectangle2): void {
  rect.setWidth(5);
  rect.setHeight(4);
  console.log(`Expected area: 20, Actual: ${rect.getArea()}`);
  // For Square, area would be 16, not 20!
}

// Better approach - No inheritance
interface Shape2 {
  getArea(): number;
}

class GoodRectangle implements Shape2 {
  constructor(private width: number, private height: number) {}

  getArea(): number {
    return this.width * this.height;
  }
}

class GoodSquare implements Shape2 {
  constructor(private side: number) {}

  getArea(): number {
    return this.side * this.side;
  }
}
```

---

## Interface Segregation Principle

### Q4: Explain the Interface Segregation Principle (ISP).

**Answer:**
No client should be forced to depend on methods it doesn't use. Split large interfaces into smaller, more specific ones.

**Benefits:**

- More flexible design
- Easier to implement
- Reduces coupling
- Better code organization

**Example (TypeScript):**

```typescript
// Violates ISP - Fat interface
interface BadWorker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
}

class HumanWorker implements BadWorker {
  work(): void {
    console.log("Working");
  }

  eat(): void {
    console.log("Eating lunch");
  }

  sleep(): void {
    console.log("Sleeping");
  }

  attendMeeting(): void {
    console.log("Attending meeting");
  }
}

class RobotWorker implements BadWorker {
  work(): void {
    console.log("Robot working");
  }

  // Robots don't eat or sleep!
  eat(): void {
    throw new Error("Robots don't eat");
  }

  sleep(): void {
    throw new Error("Robots don't sleep");
  }

  attendMeeting(): void {
    console.log("Robot attending meeting");
  }
}

// Follows ISP - Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Attendable {
  attendMeeting(): void;
}

class GoodHumanWorker implements Workable, Eatable, Sleepable, Attendable {
  work(): void {
    console.log("Human working");
  }

  eat(): void {
    console.log("Eating lunch");
  }

  sleep(): void {
    console.log("Sleeping");
  }

  attendMeeting(): void {
    console.log("Attending meeting");
  }
}

class GoodRobotWorker implements Workable, Attendable {
  work(): void {
    console.log("Robot working");
  }

  attendMeeting(): void {
    console.log("Robot attending meeting");
  }
  // No need to implement eat() or sleep()
}

// Another example: Document interfaces
interface Readable {
  read(): string;
}

interface Writable {
  write(content: string): void;
}

interface Closeable {
  close(): void;
}

// Read-only document
class PDFDocument implements Readable, Closeable {
  read(): string {
    return "PDF content";
  }

  close(): void {
    console.log("Closing PDF");
  }
  // Doesn't implement Writable
}

// Editable document
class WordDocument implements Readable, Writable, Closeable {
  private content: string = "";

  read(): string {
    return this.content;
  }

  write(content: string): void {
    this.content = content;
  }

  close(): void {
    console.log("Closing Word document");
  }
}

function readDocument(doc: Readable): void {
  console.log(doc.read());
}

function editDocument(doc: Writable, content: string): void {
  doc.write(content);
}

const pdf = new PDFDocument();
const word = new WordDocument();

readDocument(pdf);
readDocument(word);

// editDocument(pdf, "new content"); // Compile error - PDF is not Writable
editDocument(word, "new content"); // OK
```

---

## Dependency Inversion Principle

### Q5: Explain the Dependency Inversion Principle (DIP).

**Answer:**
High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.

**Benefits:**

- Reduces coupling
- Makes code more flexible
- Easier to test
- Easier to change implementations

**Example (TypeScript):**

```typescript
// Violates DIP - High-level module depends on low-level module
class MySQLDatabase2 {
  save(data: string): void {
    console.log(`Saving to MySQL: ${data}`);
  }
}

class BadUserService {
  private database = new MySQLDatabase2(); // Direct dependency on concrete class

  saveUser(user: string): void {
    this.database.save(user);
  }
}

// Problem: Can't easily switch to PostgreSQL or test with mock

// Follows DIP - Depend on abstraction
interface IDatabase {
  save(data: string): void;
  find(id: string): any;
}

// Low-level modules implement abstraction
class MySQL2 implements IDatabase {
  save(data: string): void {
    console.log(`Saving to MySQL: ${data}`);
  }

  find(id: string): any {
    console.log(`Finding in MySQL: ${id}`);
    return {};
  }
}

class PostgreSQL2 implements IDatabase {
  save(data: string): void {
    console.log(`Saving to PostgreSQL: ${data}`);
  }

  find(id: string): any {
    console.log(`Finding in PostgreSQL: ${id}`);
    return {};
  }
}

class MongoDB implements IDatabase {
  save(data: string): void {
    console.log(`Saving to MongoDB: ${data}`);
  }

  find(id: string): any {
    console.log(`Finding in MongoDB: ${id}`);
    return {};
  }
}

// High-level module depends on abstraction
class GoodUserService {
  constructor(private database: IDatabase) {} // Dependency injection

  saveUser(user: string): void {
    this.database.save(user);
  }

  findUser(id: string): any {
    return this.database.find(id);
  }
}

// Easy to switch implementations
const userService1 = new GoodUserService(new MySQL2());
const userService2 = new GoodUserService(new PostgreSQL2());
const userService3 = new GoodUserService(new MongoDB());

userService1.saveUser("Alice");
userService2.saveUser("Bob");
userService3.saveUser("Charlie");

// Easy to test with mock
class MockDatabase implements IDatabase {
  public savedData: string[] = [];

  save(data: string): void {
    this.savedData.push(data);
  }

  find(id: string): any {
    return { id, name: "Mock User" };
  }
}

const mockDb = new MockDatabase();
const testService = new GoodUserService(mockDb);
testService.saveUser("Test User");
console.log("Saved data:", mockDb.savedData);

// Another example: Notification system
interface INotificationService2 {
  send(recipient: string, message: string): void;
}

class EmailNotificationService implements INotificationService2 {
  send(recipient: string, message: string): void {
    console.log(`Email to ${recipient}: ${message}`);
  }
}

class SMSNotificationService implements INotificationService2 {
  send(recipient: string, message: string): void {
    console.log(`SMS to ${recipient}: ${message}`);
  }
}

class PushNotificationService implements INotificationService2 {
  send(recipient: string, message: string): void {
    console.log(`Push notification to ${recipient}: ${message}`);
  }
}

// High-level module
class OrderService {
  constructor(private notificationService: INotificationService2) {}

  placeOrder(orderId: string, customer: string): void {
    console.log(`Processing order ${orderId}`);
    this.notificationService.send(customer, `Order ${orderId} confirmed`);
  }
}

// Flexible - can use any notification service
const orderService1 = new OrderService(new EmailNotificationService());
const orderService2 = new OrderService(new SMSNotificationService());
const orderService3 = new OrderService(new PushNotificationService());

orderService1.placeOrder("ORD-001", "alice@example.com");
orderService2.placeOrder("ORD-002", "+1234567890");
orderService3.placeOrder("ORD-003", "user-device-id");
```

---

### Q6: How do SOLID principles work together?

**Answer:**
SOLID principles complement each other to create maintainable, flexible software:

1. **SRP** ensures classes have focused responsibilities
2. **OCP** enables extension through abstractions
3. **LSP** ensures substitutability of implementations
4. **ISP** keeps interfaces focused and minimal
5. **DIP** inverts dependencies to depend on abstractions

**Comprehensive Example:**

```typescript
// Real-world e-commerce example using all SOLID principles

// ISP - Small, focused interfaces
interface ProductRepository {
  save(product: Product2): void;
  findById(id: string): Product2 | null;
}

interface PriceCalculator {
  calculatePrice(product: Product2, quantity: number): number;
}

interface OrderNotifier {
  notifyOrderPlaced(order: Order2): void;
}

// SRP - Each class has single responsibility
class Product2 {
  constructor(
    private id: string,
    private name: string,
    private basePrice: number
  ) {}

  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getBasePrice(): number {
    return this.basePrice;
  }
}

// OCP - Open for extension (new discount strategies)
interface DiscountStrategy2 {
  calculate(basePrice: number, quantity: number): number;
}

class NoDiscountStrategy implements DiscountStrategy2 {
  calculate(basePrice: number, quantity: number): number {
    return basePrice * quantity;
  }
}

class BulkDiscountStrategy implements DiscountStrategy2 {
  calculate(basePrice: number, quantity: number): number {
    if (quantity >= 10) {
      return basePrice * quantity * 0.9; // 10% off
    }
    return basePrice * quantity;
  }
}

// LSP - All strategies are substitutable
class SeasonalDiscountStrategy implements DiscountStrategy2 {
  calculate(basePrice: number, quantity: number): number {
    return basePrice * quantity * 0.85; // 15% off
  }
}

class PriceCalculatorService implements PriceCalculator {
  constructor(private discountStrategy: DiscountStrategy2) {}

  calculatePrice(product: Product2, quantity: number): number {
    return this.discountStrategy.calculate(product.getBasePrice(), quantity);
  }

  setDiscountStrategy(strategy: DiscountStrategy2): void {
    this.discountStrategy = strategy;
  }
}

// DIP - Depends on abstractions
class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product2>();

  save(product: Product2): void {
    this.products.set(product.getId(), product);
  }

  findById(id: string): Product2 | null {
    return this.products.get(id) || null;
  }
}

class Order2 {
  constructor(
    private id: string,
    private product: Product2,
    private quantity: number,
    private totalPrice: number
  ) {}

  getId(): string {
    return this.id;
  }
  getProduct(): Product2 {
    return this.product;
  }
  getQuantity(): number {
    return this.quantity;
  }
  getTotalPrice(): number {
    return this.totalPrice;
  }
}

class EmailOrderNotifier implements OrderNotifier {
  notifyOrderPlaced(order: Order2): void {
    console.log(
      `Email: Order ${order.getId()} placed for ${order.getProduct().getName()}`
    );
  }
}

// SRP + DIP - OrderService has single responsibility and depends on abstractions
class OrderService2 {
  constructor(
    private productRepo: ProductRepository,
    private priceCalculator: PriceCalculator,
    private notifier: OrderNotifier
  ) {}

  placeOrder(productId: string, quantity: number): Order2 | null {
    const product = this.productRepo.findById(productId);
    if (!product) {
      console.log("Product not found");
      return null;
    }

    const totalPrice = this.priceCalculator.calculatePrice(product, quantity);
    const order = new Order2(
      `ORD-${Date.now()}`,
      product,
      quantity,
      totalPrice
    );

    this.notifier.notifyOrderPlaced(order);
    return order;
  }
}

// Usage - All SOLID principles in action
const productRepo = new InMemoryProductRepository();
const product = new Product2("P001", "Laptop", 1000);
productRepo.save(product);

const regularPricing = new PriceCalculatorService(new NoDiscountStrategy());
const bulkPricing = new PriceCalculatorService(new BulkDiscountStrategy());
const seasonalPricing = new PriceCalculatorService(
  new SeasonalDiscountStrategy()
);

const emailNotifier = new EmailOrderNotifier();

const regularOrderService = new OrderService2(
  productRepo,
  regularPricing,
  emailNotifier
);
const bulkOrderService = new OrderService2(
  productRepo,
  bulkPricing,
  emailNotifier
);

regularOrderService.placeOrder("P001", 5); // Regular pricing
bulkOrderService.placeOrder("P001", 15); // Bulk discount
```

---

This comprehensive guide covers all SOLID principles with practical examples!
