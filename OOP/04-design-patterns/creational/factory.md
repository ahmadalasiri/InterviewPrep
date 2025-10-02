# Factory Pattern

## Overview

The Factory pattern defines an interface for creating objects but lets subclasses decide which class to instantiate.

## When to Use

- Object creation logic is complex
- Don't know exact types beforehand
- Want to centralize object creation
- Need to decouple creation from usage

## TypeScript Implementation

### Simple Factory

```typescript
interface Animal {
  speak(): void;
}

class Dog implements Animal {
  speak(): void {
    console.log("Woof!");
  }
}

class Cat implements Animal {
  speak(): void {
    console.log("Meow!");
  }
}

class Bird implements Animal {
  speak(): void {
    console.log("Tweet!");
  }
}

// Factory
class AnimalFactory {
  static createAnimal(type: string): Animal {
    switch (type.toLowerCase()) {
      case "dog":
        return new Dog();
      case "cat":
        return new Cat();
      case "bird":
        return new Bird();
      default:
        throw new Error(`Unknown animal type: ${type}`);
    }
  }
}

// Usage
const dog = AnimalFactory.createAnimal("dog");
const cat = AnimalFactory.createAnimal("cat");

dog.speak(); // Woof!
cat.speak(); // Meow!
```

### Factory Method Pattern

```typescript
// Product interface
interface Button {
  render(): void;
  onClick(handler: () => void): void;
}

// Concrete products
class WindowsButton implements Button {
  render(): void {
    console.log("Rendering Windows button");
  }

  onClick(handler: () => void): void {
    console.log("Windows button clicked");
    handler();
  }
}

class MacButton implements Button {
  render(): void {
    console.log("Rendering Mac button");
  }

  onClick(handler: () => void): void {
    console.log("Mac button clicked");
    handler();
  }
}

// Creator
abstract class Dialog {
  abstract createButton(): Button;

  render(): void {
    const button = this.createButton();
    button.render();
    button.onClick(() => console.log("Button handler executed"));
  }
}

// Concrete creators
class WindowsDialog extends Dialog {
  createButton(): Button {
    return new WindowsButton();
  }
}

class MacDialog extends Dialog {
  createButton(): Button {
    return new MacButton();
  }
}

// Usage
function initializeUI(os: string): void {
  let dialog: Dialog;

  if (os === "windows") {
    dialog = new WindowsDialog();
  } else {
    dialog = new MacDialog();
  }

  dialog.render();
}

initializeUI("windows");
initializeUI("mac");
```

### Real-World Example: Payment Processing

```typescript
interface PaymentProcessor {
  processPayment(amount: number): boolean;
}

class CreditCardProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via Credit Card`);
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via PayPal`);
    return true;
  }
}

class CryptoProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via Cryptocurrency`);
    return true;
  }
}

// Payment factory
class PaymentFactory {
  static createProcessor(method: string): PaymentProcessor {
    const processors: { [key: string]: () => PaymentProcessor } = {
      credit: () => new CreditCardProcessor(),
      paypal: () => new PayPalProcessor(),
      crypto: () => new CryptoProcessor(),
    };

    const creator = processors[method.toLowerCase()];
    if (!creator) {
      throw new Error(`Unknown payment method: ${method}`);
    }

    return creator();
  }
}

// Usage
const processor = PaymentFactory.createProcessor("paypal");
processor.processPayment(99.99);
```

## Pros & Cons

### Pros

- Loose coupling between creator and products
- Single Responsibility - creation logic in one place
- Open/Closed - easy to add new types
- Flexibility in object creation

### Cons

- Can become complex with many product types
- May need many subclasses

## Summary

- Encapsulates object creation
- Promotes loose coupling
- Makes code more maintainable
- Essential for extensible systems

---

**Next Steps:**

- Learn [Abstract Factory](abstract-factory.md)
- Learn [Builder Pattern](builder.md)
