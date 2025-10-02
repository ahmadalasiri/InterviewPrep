# Singleton Pattern

## Overview

The Singleton pattern ensures a class has only one instance and provides a global point of access to it.

## When to Use

- Need exactly one instance (Database connection, Configuration, Logger)
- Global access point required
- Lazy initialization desired

## TypeScript Implementation

### Basic Singleton

```typescript
class Singleton {
  private static instance: Singleton;

  private constructor() {
    // Private constructor prevents instantiation
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public someMethod(): void {
    console.log("Singleton method called");
  }
}

// Usage
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true - same instance
```

### Real-World Example: Database Connection

```typescript
class Database {
  private static instance: Database;
  private connection: any;

  private constructor() {
    // Private constructor
    console.log("Initializing database connection...");
    this.connection = { connected: true };
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(sql: string): any[] {
    console.log(`Executing: ${sql}`);
    return [];
  }

  public getConnection(): any {
    return this.connection;
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true
db1.query("SELECT * FROM users");
```

### Configuration Manager

```typescript
class ConfigManager {
  private static instance: ConfigManager;
  private config: Map<string, any>;

  private constructor() {
    this.config = new Map();
    this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    // Load configuration from file/environment
    this.config.set("API_URL", "https://api.example.com");
    this.config.set("MAX_RETRIES", 3);
    this.config.set("TIMEOUT", 5000);
  }

  public get(key: string): any {
    return this.config.get(key);
  }

  public set(key: string, value: any): void {
    this.config.set(key, value);
  }
}

// Usage across application
const config = ConfigManager.getInstance();
console.log(config.get("API_URL"));
```

## Pros & Cons

### Pros

- Controlled access to single instance
- Reduced memory footprint
- Global access point
- Lazy initialization

### Cons

- Violates Single Responsibility Principle
- Difficult to unit test
- Can hide dependencies
- Problematic in multi-threaded environments

## Summary

- Ensures only one instance exists
- Provides global access
- Use sparingly - can be anti-pattern
- Consider Dependency Injection as alternative

---

**Next Steps:**

- Learn [Factory Pattern](factory.md)
- Study [Dependency Injection](../../02-advanced-concepts/dependency-injection.md)
