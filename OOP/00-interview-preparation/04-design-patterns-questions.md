# Design Patterns Interview Questions

## Table of Contents

- [Creational Patterns](#creational-patterns)
- [Structural Patterns](#structural-patterns)
- [Behavioral Patterns](#behavioral-patterns)

---

## Creational Patterns

### Q1: Explain the Singleton Pattern and implement it in TypeScript.

**Answer:**
Singleton ensures a class has only one instance and provides a global access point to it.

**Example:**

```typescript
class Singleton {
  private static instance: Singleton;
  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

### Q2: What is the Factory Pattern?

**Answer:**
Factory Pattern provides an interface for creating objects without specifying their exact classes.

**Example:**

```typescript
interface Product {
  operation(): string;
}

class ConcreteProductA implements Product {
  operation(): string {
    return "Product A";
  }
}

class ConcreteProductB implements Product {
  operation(): string {
    return "Product B";
  }
}

class Factory {
  createProduct(type: string): Product {
    if (type === "A") return new ConcreteProductA();
    if (type === "B") return new ConcreteProductB();
    throw new Error("Unknown type");
  }
}
```

---

## Structural Patterns

### Q3: Explain the Adapter Pattern.

**Answer:**
Adapter allows incompatible interfaces to work together by converting one interface into another.

**Example:**

```typescript
interface NewSystem {
  request(): string;
}

class LegacySystem {
  specificRequest(): string {
    return "Legacy data";
  }
}

class Adapter implements NewSystem {
  constructor(private legacy: LegacySystem) {}

  request(): string {
    return this.legacy.specificRequest();
  }
}
```

---

## Behavioral Patterns

### Q4: Explain the Observer Pattern.

**Answer:**
Observer defines a subscription mechanism to notify multiple objects about events.

**Example:**

```typescript
interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  notify(data: any): void {
    this.observers.forEach((obs) => obs.update(data));
  }
}
```

---

For detailed implementations, see the practical examples folder.
