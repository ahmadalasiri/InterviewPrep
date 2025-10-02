# Abstract Factory Pattern

## Overview

Provides an interface for creating families of related or dependent objects without specifying their concrete classes.

## TypeScript Implementation

```typescript
// Abstract products
interface Button {
  render(): void;
}

interface Checkbox {
  render(): void;
}

// Windows products
class WindowsButton implements Button {
  render(): void {
    console.log("Rendering Windows button");
  }
}

class WindowsCheckbox implements Checkbox {
  render(): void {
    console.log("Rendering Windows checkbox");
  }
}

// Mac products
class MacButton implements Button {
  render(): void {
    console.log("Rendering Mac button");
  }
}

class MacCheckbox implements Checkbox {
  render(): void {
    console.log("Rendering Mac checkbox");
  }
}

// Abstract Factory
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Concrete Factories
class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }

  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

class MacFactory implements GUIFactory {
  createButton(): Button {
    return new MacButton();
  }

  createCheckbox(): Checkbox {
    return new MacCheckbox();
  }
}

// Client code
class Application {
  private button: Button;
  private checkbox: Checkbox;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }

  render(): void {
    this.button.render();
    this.checkbox.render();
  }
}

// Usage
const windowsApp = new Application(new WindowsFactory());
windowsApp.render();

const macApp = new Application(new MacFactory());
macApp.render();
```

## Summary

- Creates families of related objects
- Ensures compatibility between products
- Isolates concrete classes from client

---

**Next Steps:**

- Learn [Builder Pattern](builder.md)
- Learn [Factory Pattern](factory.md)
