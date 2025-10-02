# Decorator Pattern

## Overview

Adds new functionality to objects dynamically without altering their structure.

## TypeScript Implementation

```typescript
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

// Decorators
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

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()} = $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);

console.log(`${coffee.description()} = $${coffee.cost()}`);
```

## Summary

- Adds responsibilities dynamically
- More flexible than subclassing
- Follows Open/Closed Principle

---

**Next Steps:**

- Learn [Facade Pattern](facade.md)
- Learn [Proxy Pattern](proxy.md)
