# Composition vs Inheritance

## Overview

Two of the most important relationships in OOP are **composition** ("has-a") and **inheritance** ("is-a"). Understanding when to use each is crucial for creating flexible, maintainable software.

## Core Principle

**"Favor composition over inheritance"** - Gang of Four (Design Patterns)

This doesn't mean never use inheritance, but rather consider composition first.

## Key Differences

| Aspect       | Inheritance                           | Composition                           |
| ------------ | ------------------------------------- | ------------------------------------- |
| Relationship | "is-a"                                | "has-a"                               |
| Coupling     | Tight (child depends on parent)       | Loose (components are independent)    |
| Flexibility  | Less flexible (fixed at compile time) | More flexible (can change at runtime) |
| Reusability  | Vertical (through hierarchy)          | Horizontal (through objects)          |
| Code Changes | Affects all subclasses                | Isolated to component                 |
| Testing      | Harder (need parent setup)            | Easier (mock components)              |

## Inheritance ("is-a")

### When to Use Inheritance

✅ **Use when:**

- Clear "is-a" relationship exists
- Subclass is a specialized version of the parent
- Need to leverage polymorphism
- Shared behavior unlikely to change
- Shallow hierarchy (2-3 levels)

❌ **Don't use when:**

- Only need code reuse
- "has-a" relationship
- Need to combine multiple behaviors
- Hierarchy becomes deep or complex

### TypeScript Inheritance Example

```typescript
// Good use of inheritance - clear "is-a" relationship
abstract class Employee {
  constructor(protected name: string, protected id: string) {}

  abstract calculateSalary(): number;
  abstract getRole(): string;

  getInfo(): string {
    return `${this.name} (${this.id}) - ${this.getRole()}`;
  }
}

class FullTimeEmployee extends Employee {
  constructor(name: string, id: string, private monthlySalary: number) {
    super(name, id);
  }

  calculateSalary(): number {
    return this.monthlySalary * 12;
  }

  getRole(): string {
    return "Full-Time";
  }
}

class Contractor extends Employee {
  constructor(
    name: string,
    id: string,
    private hourlyRate: number,
    private hoursWorked: number
  ) {
    super(name, id);
  }

  calculateSalary(): number {
    return this.hourlyRate * this.hoursWorked;
  }

  getRole(): string {
    return "Contractor";
  }
}

// Polymorphic usage
const employees: Employee[] = [
  new FullTimeEmployee("Alice", "FT001", 5000),
  new Contractor("Bob", "CT001", 50, 1000),
];

employees.forEach((emp) => {
  console.log(`${emp.getInfo()}: $${emp.calculateSalary()}`);
});
```

## Composition ("has-a")

### When to Use Composition

✅ **Use when:**

- "has-a" or "uses-a" relationship
- Need to combine multiple behaviors
- Want runtime flexibility
- Building complex objects from simpler ones
- Need better testability

### TypeScript Composition Example

```typescript
// Components
class Engine {
  constructor(private horsepower: number, private type: string) {}

  start(): void {
    console.log(`${this.type} engine (${this.horsepower}hp) starting...`);
  }

  getSpecs(): string {
    return `${this.horsepower}hp ${this.type}`;
  }
}

class Transmission {
  constructor(private type: "manual" | "automatic", private gears: number) {}

  shift(gear: number): void {
    console.log(`Shifting to gear ${gear} (${this.type})`);
  }

  getType(): string {
    return `${this.gears}-speed ${this.type}`;
  }
}

class GPS {
  navigate(destination: string): void {
    console.log(`Navigating to: ${destination}`);
  }
}

// Composing a car from components
class Car {
  private gps?: GPS;

  constructor(
    private model: string,
    private engine: Engine,
    private transmission: Transmission
  ) {}

  // Optional feature - can add at runtime
  addGPS(gps: GPS): void {
    this.gps = gps;
  }

  start(): void {
    console.log(`\nStarting ${this.model}`);
    this.engine.start();
  }

  drive(destination?: string): void {
    if (destination && this.gps) {
      this.gps.navigate(destination);
    }
    console.log(`Driving with ${this.transmission.getType()} transmission`);
  }

  getSpecs(): string {
    return `${
      this.model
    }: ${this.engine.getSpecs()}, ${this.transmission.getType()}`;
  }
}

// Usage - flexible composition
const sportsCar = new Car(
  "Ferrari",
  new Engine(700, "V12"),
  new Transmission("manual", 7)
);

const familyCar = new Car(
  "Toyota",
  new Engine(150, "I4"),
  new Transmission("automatic", 6)
);

familyCar.addGPS(new GPS()); // Add feature at runtime

sportsCar.start();
sportsCar.drive();

familyCar.start();
familyCar.drive("Shopping Mall");
```

## Problem: Inheritance Gone Wrong

```typescript
// ❌ BAD: Using inheritance for code reuse
class Utils {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  formatDate(date: Date): string {
    return date.toISOString();
  }
}

// Wrong! User is not a Utils
class User extends Utils {
  constructor(public name: string, public email: string) {
    super();
  }

  register(): void {
    this.log(`Registering user: ${this.name}`); // Inheriting just for log()
  }
}

// ✅ GOOD: Using composition
class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class DateFormatter {
  format(date: Date): string {
    return date.toISOString();
  }
}

class User {
  constructor(
    public name: string,
    public email: string,
    private logger: Logger
  ) {}

  register(): void {
    this.logger.log(`Registering user: ${this.name}`);
  }
}

// Can inject different logger implementations
const user = new User("Alice", "alice@example.com", new Logger());
```

## Solution: Composition Pattern

### Strategy Pattern (Behavior Composition)

```typescript
// Define behavior interface
interface PaymentStrategy {
  pay(amount: number): void;
}

// Different payment behaviors
class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paying $${amount} with Credit Card`);
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paying $${amount} with PayPal`);
  }
}

class CryptoPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paying $${amount} with Cryptocurrency`);
  }
}

// Compose behavior
class ShoppingCart {
  private items: Array<{ name: string; price: number }> = [];
  private paymentStrategy?: PaymentStrategy;

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  setPaymentMethod(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`Total: $${total}`);

    if (this.paymentStrategy) {
      this.paymentStrategy.pay(total);
    } else {
      console.log("Please select a payment method");
    }
  }
}

// Usage - can change strategy at runtime
const cart = new ShoppingCart();
cart.addItem("Laptop", 1000);
cart.addItem("Mouse", 50);

cart.setPaymentMethod(new CreditCardPayment());
cart.checkout();

// Change payment method
cart.setPaymentMethod(new CryptoPayment());
cart.checkout();
```

### Decorator Pattern (Feature Composition)

```typescript
// Base component
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number {
    return 5;
  }

  description(): string {
    return "Simple Coffee";
  }
}

// Decorators add features through composition
class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return `${this.coffee.description()}, Milk`;
  }
}

class SugarDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return `${this.coffee.description()}, Sugar`;
  }
}

class WhippedCreamDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 3;
  }

  description(): string {
    return `${this.coffee.description()}, Whipped Cream`;
  }
}

// Compose features dynamically
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
```

## Mixing Inheritance and Composition

Sometimes the best solution uses both:

```typescript
// Base class for shared behavior
abstract class Vehicle {
  constructor(protected brand: string) {}

  abstract getType(): string;

  getBrand(): string {
    return this.brand;
  }
}

// Components for composition
interface Engine {
  start(): void;
  stop(): void;
}

class ElectricEngine implements Engine {
  start(): void {
    console.log("⚡ Electric motor starting silently...");
  }

  stop(): void {
    console.log("⚡ Electric motor stopped");
  }
}

class GasEngine implements Engine {
  start(): void {
    console.log("🔥 Gas engine roaring to life!");
  }

  stop(): void {
    console.log("🔥 Gas engine shut down");
  }
}

// Inherit from Vehicle, compose with Engine
class Car extends Vehicle {
  constructor(brand: string, private engine: Engine) {
    super(brand);
  }

  getType(): string {
    return "Car";
  }

  start(): void {
    console.log(`Starting ${this.brand} ${this.getType()}`);
    this.engine.start();
  }

  stop(): void {
    this.engine.stop();
  }
}

// Usage
const tesla = new Car("Tesla", new ElectricEngine());
const ford = new Car("Ford", new GasEngine());

tesla.start();
ford.start();
```

## Real-World Example: Game Characters

```typescript
// Using composition for flexible character abilities
interface Ability {
  use(): void;
}

class Fireball implements Ability {
  use(): void {
    console.log("🔥 Cast Fireball!");
  }
}

class Heal implements Ability {
  use(): void {
    console.log("💚 Cast Heal!");
  }
}

class SwordAttack implements Ability {
  use(): void {
    console.log("⚔️ Sword Attack!");
  }
}

class Shield implements Ability {
  use(): void {
    console.log("🛡️ Raise Shield!");
  }
}

// Character composed of abilities
class Character {
  private abilities: Ability[] = [];

  constructor(private name: string) {}

  addAbility(ability: Ability): void {
    this.abilities.push(ability);
  }

  useAllAbilities(): void {
    console.log(`\n${this.name}'s abilities:`);
    this.abilities.forEach((ability) => ability.use());
  }
}

// Create flexible characters
const warrior = new Character("Warrior");
warrior.addAbility(new SwordAttack());
warrior.addAbility(new Shield());

const mage = new Character("Mage");
mage.addAbility(new Fireball());
mage.addAbility(new Heal());

const paladin = new Character("Paladin");
paladin.addAbility(new SwordAttack());
paladin.addAbility(new Shield());
paladin.addAbility(new Heal());

warrior.useAllAbilities();
mage.useAllAbilities();
paladin.useAllAbilities();
```

## Decision Tree

```
Need to share code between classes?
│
├─ Is there a clear "is-a" relationship?
│  ├─ Yes → Consider INHERITANCE
│  │  └─ Is the hierarchy shallow (2-3 levels)?
│  │     ├─ Yes → Use inheritance
│  │     └─ No → Reconsider, maybe composition
│  │
│  └─ No → Is it a "has-a" or "uses-a" relationship?
│     └─ Yes → Use COMPOSITION
│
└─ Need to combine multiple behaviors?
   └─ Use COMPOSITION
```

## Summary

**Use Inheritance when:**

- True "is-a" relationship
- Leveraging polymorphism
- Stable, well-defined hierarchy
- Shared interface is important

**Use Composition when:**

- "has-a" relationship
- Need flexibility
- Combining multiple behaviors
- Runtime configuration needed
- Better testability required

**Best Practice:** Start with composition. Only use inheritance when there's a clear benefit and proper "is-a" relationship.

---

**Next Steps:**

- Study [Dependency Injection](dependency-injection.md)
- Learn [SOLID Principles](../03-solid-principles/) - especially Open/Closed
- Explore [Design Patterns](../04-design-patterns/) using composition
