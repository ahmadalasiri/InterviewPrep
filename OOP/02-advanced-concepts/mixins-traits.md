# Mixins and Traits

## Overview

Mixins and Traits are patterns for composing reusable behavior across classes without traditional inheritance. They allow horizontal code reuse and help avoid deep inheritance hierarchies.

## Mixins in TypeScript

### Basic Mixin Pattern

```typescript
// Mixin type
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin function
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class Timestamped extends Base {
    timestamp = new Date();

    getAge(): number {
      return Date.now() - this.timestamp.getTime();
    }
  };
}

// Usage
class User {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User);
const user = new TimestampedUser("Alice");

console.log(user.name);
console.log(user.getAge());
```

### Multiple Mixins

```typescript
// Logging mixin
function Loggable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(message: string): void {
      console.log(`[${this.constructor.name}] ${message}`);
    }
  };
}

// Serialization mixin
function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }

    static deserialize<T>(this: Constructor<T>, json: string): T {
      const obj = JSON.parse(json);
      return Object.assign(new this(), obj);
    }
  };
}

// Validation mixin
function Validatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    errors: string[] = [];

    validate(): boolean {
      this.errors = [];
      // Validation logic
      return this.errors.length === 0;
    }
  };
}

// Base class
class Product {
  constructor(public name: string, public price: number) {}
}

// Compose mixins
const EnhancedProduct = Validatable(Serializable(Loggable(Product)));

// Usage
const product = new EnhancedProduct("Laptop", 999);
product.log("Product created");
const json = product.serialize();
console.log(json);
product.validate();
```

### Real-World Example: Feature Flags

```typescript
// Feature toggle mixin
function FeatureToggleable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private features = new Map<string, boolean>();

    enableFeature(feature: string): void {
      this.features.set(feature, true);
      console.log(`✓ Feature enabled: ${feature}`);
    }

    disableFeature(feature: string): void {
      this.features.set(feature, false);
      console.log(`✗ Feature disabled: ${feature}`);
    }

    isFeatureEnabled(feature: string): boolean {
      return this.features.get(feature) ?? false;
    }
  };
}

// Analytics mixin
function Trackable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private events: Array<{ event: string; timestamp: Date }> = [];

    track(event: string): void {
      this.events.push({ event, timestamp: new Date() });
      console.log(`📊 Event tracked: ${event}`);
    }

    getEvents(): Array<{ event: string; timestamp: Date }> {
      return [...this.events];
    }
  };
}

// Cache mixin
function Cacheable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private cache = new Map<string, any>();

    setCache(key: string, value: any, ttl?: number): void {
      this.cache.set(key, value);
      if (ttl) {
        setTimeout(() => this.cache.delete(key), ttl);
      }
    }

    getCache<T>(key: string): T | undefined {
      return this.cache.get(key);
    }

    clearCache(): void {
      this.cache.clear();
    }
  };
}

// Base application class
class Application {
  constructor(public name: string) {}

  start(): void {
    console.log(`Starting ${this.name}...`);
  }
}

// Compose all features
const FeatureRichApp = Cacheable(Trackable(FeatureToggleable(Application)));

// Usage
const app = new FeatureRichApp("My App");

app.start();
app.enableFeature("dark-mode");
app.track("app-started");
app.setCache("user-session", { id: 123 }, 3600000);

if (app.isFeatureEnabled("dark-mode")) {
  console.log("Dark mode is ON");
}

console.log("Events:", app.getEvents());
```

### Practical Mixin: Observable Pattern

```typescript
type Observer<T> = (data: T) => void;

function Observable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private observers = new Map<string, Observer<any>[]>();

    on<T>(event: string, observer: Observer<T>): void {
      if (!this.observers.has(event)) {
        this.observers.set(event, []);
      }
      this.observers.get(event)!.push(observer);
    }

    off(event: string, observer: Observer<any>): void {
      const observers = this.observers.get(event);
      if (observers) {
        const index = observers.indexOf(observer);
        if (index > -1) {
          observers.splice(index, 1);
        }
      }
    }

    emit<T>(event: string, data: T): void {
      const observers = this.observers.get(event);
      if (observers) {
        observers.forEach((observer) => observer(data));
      }
    }
  };
}

// Usage
class DataStore {
  private data: any = {};

  set(key: string, value: any): void {
    this.data[key] = value;
  }

  get(key: string): any {
    return this.data[key];
  }
}

const ObservableStore = Observable(DataStore);
const store = new ObservableStore();

// Subscribe to changes
store.on("dataChanged", (data) => {
  console.log("Data changed:", data);
});

store.set("user", "Alice");
store.emit("dataChanged", { key: "user", value: "Alice" });
```

## Trait-like Pattern

```typescript
// Define traits as objects
const Flyable = {
  fly(): void {
    console.log(`${this.name} is flying`);
  },
  land(): void {
    console.log(`${this.name} is landing`);
  },
};

const Swimmable = {
  swim(): void {
    console.log(`${this.name} is swimming`);
  },
  dive(): void {
    console.log(`${this.name} is diving`);
  },
};

// Apply traits to class
class Duck {
  constructor(public name: string) {}
}

// Mix in traits
Object.assign(Duck.prototype, Flyable, Swimmable);

// TypeScript needs interface merging for types
interface Duck
  extends ReturnType<typeof Flyable>,
    ReturnType<typeof Swimmable> {}

const duck = new Duck("Donald");
duck.fly();
duck.swim();
```

## Mixin Constraints

```typescript
// Mixin that requires specific base class methods
interface Named {
  name: string;
}

function Greeter<TBase extends Constructor<Named>>(Base: TBase) {
  return class extends Base {
    greet(): string {
      return `Hello, ${this.name}!`;
    }
  };
}

class Person {
  constructor(public name: string) {}
}

const GreetablePerson = Greeter(Person);
const person = new GreetablePerson("Alice");
console.log(person.greet()); // Hello, Alice!
```

## Best Practices

1. **Keep mixins focused** - Single responsibility
2. **Avoid state conflicts** - Be careful with property names
3. **Document dependencies** - What base class features are required
4. **Use TypeScript interfaces** - For type safety
5. **Consider composition** - For complex behavior

## Mixins vs Inheritance

| Mixins                 | Inheritance         |
| ---------------------- | ------------------- |
| Horizontal reuse       | Vertical hierarchy  |
| Multiple behaviors     | Single parent       |
| Flexible composition   | Fixed relationship  |
| No "is-a" relationship | "is-a" relationship |

## Summary

- Mixins add reusable behavior to classes
- TypeScript uses function-based mixins
- Compose multiple mixins for complex behavior
- More flexible than traditional inheritance
- Useful for cross-cutting concerns

---

**Next Steps:**

- Study [Composition vs Inheritance](composition-vs-inheritance.md)
- Learn [Design Patterns](../04-design-patterns/)
- Practice with [TypeScript Examples](../05-practical-examples/typescript/)
