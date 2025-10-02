# Multiple Inheritance

## Overview

Multiple inheritance is when a class can inherit from more than one parent class. While powerful, it can lead to complexity and ambiguity. TypeScript doesn't support multiple class inheritance but offers alternatives through interfaces and mixins.

## The Diamond Problem

The classic issue with multiple inheritance:

```
     Animal
    /      \
  Dog      Cat
    \      /
    DogCat  <- Which Animal constructor? Which methods?
```

## TypeScript Approaches

### 1. Multiple Interface Implementation

```typescript
interface Flyable {
  fly(): void;
  altitude: number;
}

interface Swimmable {
  swim(): void;
  depth: number;
}

// Implement multiple interfaces
class Duck implements Flyable, Swimmable {
  altitude: number = 0;
  depth: number = 0;

  fly(): void {
    this.altitude = 100;
    console.log(`Duck flying at ${this.altitude}m`);
  }

  swim(): void {
    this.depth = 2;
    console.log(`Duck swimming at ${this.depth}m depth`);
  }
}

const duck = new Duck();
duck.fly();
duck.swim();
```

### 2. Mixins (TypeScript Pattern)

```typescript
// Mixin type
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin functions
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();

    getTimestamp(): string {
      return this.timestamp.toISOString();
    }
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;

    activate(): void {
      this.isActive = true;
      console.log("Activated!");
    }

    deactivate(): void {
      this.isActive = false;
      console.log("Deactivated");
    }
  };
}

// Base class
class User {
  constructor(public name: string) {}
}

// Apply mixins
const TimestampedUser = Timestamped(User);
const ActivatableUser = Activatable(TimestampedUser);

// Use combined class
const user = new ActivatableUser("Alice");
console.log(user.name);
console.log(user.getTimestamp());
user.activate();
```

### 3. Composition Over Multiple Inheritance

```typescript
// Behavior components
class FlightCapability {
  fly(): void {
    console.log("Flying!");
  }
}

class SwimCapability {
  swim(): void {
    console.log("Swimming!");
  }
}

class RunCapability {
  run(): void {
    console.log("Running!");
  }
}

// Compose behaviors
class SuperHero {
  private flightCap = new FlightCapability();
  private swimCap = new SwimCapability();
  private runCap = new RunCapability();

  constructor(public name: string) {}

  // Delegate to components
  fly(): void {
    this.flightCap.fly();
  }

  swim(): void {
    this.swimCap.swim();
  }

  run(): void {
    this.runCap.run();
  }
}

const superman = new SuperHero("Superman");
superman.fly();
superman.swim();
superman.run();
```

## Real-World Example: GUI Component

```typescript
// Interfaces for different aspects
interface Clickable {
  onClick(handler: () => void): void;
  click(): void;
}

interface Draggable {
  onDrag(handler: (x: number, y: number) => void): void;
  startDrag(): void;
}

interface Resizable {
  resize(width: number, height: number): void;
  getSize(): { width: number; height: number };
}

// Component implementing multiple behaviors
class Window implements Clickable, Draggable, Resizable {
  private clickHandler?: () => void;
  private dragHandler?: (x: number, y: number) => void;
  private width = 800;
  private height = 600;

  // Clickable implementation
  onClick(handler: () => void): void {
    this.clickHandler = handler;
  }

  click(): void {
    console.log("Window clicked");
    this.clickHandler?.();
  }

  // Draggable implementation
  onDrag(handler: (x: number, y: number) => void): void {
    this.dragHandler = handler;
  }

  startDrag(): void {
    console.log("Started dragging window");
    this.dragHandler?.(100, 200);
  }

  // Resizable implementation
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    console.log(`Window resized to ${width}x${height}`);
  }

  getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}

const window = new Window();
window.onClick(() => console.log("Click handled!"));
window.click();
window.resize(1024, 768);
window.startDrag();
```

## Summary

- TypeScript doesn't support multiple class inheritance
- Use multiple interface implementation
- Use mixins for reusable behavior
- Prefer composition over complex inheritance
- Avoid the diamond problem

---

**Next Steps:**

- Study [Mixins and Traits](mixins-traits.md)
- Learn [Composition vs Inheritance](composition-vs-inheritance.md)
