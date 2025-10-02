# Interface Segregation Principle (ISP)

## Overview

**"Clients should not be forced to depend on interfaces they do not use."** - Robert C. Martin

No client should be forced to depend on methods it doesn't use. Instead of one fat interface, many small, specific interfaces are preferred.

## Key Concepts

- Split large interfaces into smaller, more specific ones
- Clients only depend on methods they actually use
- Prevents "interface pollution"

## TypeScript Examples

### ❌ Bad: Fat Interface

```typescript
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
  writeCode(): void;
  designUI(): void;
}

// Robot forced to implement methods it doesn't need
class Robot implements Worker {
  work(): void {
    console.log("Robot working");
  }

  eat(): void {
    throw new Error("Robots don't eat!"); // Forced to implement
  }

  sleep(): void {
    throw new Error("Robots don't sleep!"); // Forced to implement
  }

  attendMeeting(): void {
    throw new Error("Robots don't attend meetings!");
  }

  writeCode(): void {
    console.log("Robot coding");
  }

  designUI(): void {
    throw new Error("Robot can't design!");
  }
}
```

### ✅ Good: Segregated Interfaces

```typescript
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Codeable {
  writeCode(): void;
}

interface Designer {
  designUI(): void;
}

// Robot only implements what it can do
class Robot implements Workable, Codeable {
  work(): void {
    console.log("Robot working");
  }

  writeCode(): void {
    console.log("Robot coding");
  }
}

// Human implements what humans do
class Human implements Workable, Eatable, Sleepable, Codeable {
  work(): void {
    console.log("Human working");
  }

  eat(): void {
    console.log("Human eating");
  }

  sleep(): void {
    console.log("Human sleeping");
  }

  writeCode(): void {
    console.log("Human coding");
  }
}

// Designer only needs design capability
class UIDesigner implements Workable, Designer {
  work(): void {
    console.log("Designer working");
  }

  designUI(): void {
    console.log("Designing UI");
  }
}
```

## Real-World Example: Printer Interface

```typescript
// ❌ Bad: Monolithic interface
interface AllInOnePrinter {
  print(): void;
  scan(): void;
  fax(): void;
  email(): void;
}

class SimplePrinter implements AllInOnePrinter {
  print(): void {
    console.log("Printing");
  }

  scan(): void {
    throw new Error("Can't scan");
  }

  fax(): void {
    throw new Error("Can't fax");
  }

  email(): void {
    throw new Error("Can't email");
  }
}

// ✅ Good: Segregated interfaces
interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

interface FaxMachine {
  fax(): void;
}

class BasicPrinter implements Printer {
  print(): void {
    console.log("Printing document");
  }
}

class MultiFunctionDevice implements Printer, Scanner, FaxMachine {
  print(): void {
    console.log("Printing");
  }

  scan(): void {
    console.log("Scanning");
  }

  fax(): void {
    console.log("Faxing");
  }
}
```

## Summary

- Many small, specific interfaces better than one large interface
- Clients only depend on methods they use
- Prevents forced implementation of unused methods
- Increases flexibility and maintainability

---

**Next Steps:**

- Learn [Dependency Inversion Principle](dependency-inversion.md)
- Study [Composition vs Inheritance](../02-advanced-concepts/composition-vs-inheritance.md)
