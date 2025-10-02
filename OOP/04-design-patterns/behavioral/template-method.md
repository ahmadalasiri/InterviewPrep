# Template Method Pattern

## Overview

Defines the skeleton of an algorithm in a method, deferring some steps to subclasses. Lets subclasses redefine certain steps without changing the algorithm's structure.

## TypeScript Implementation

```typescript
abstract class DataProcessor {
  // Template method
  public process(): void {
    this.readData();
    this.processData();
    this.saveData();
    this.closeConnection();
  }

  protected abstract readData(): void;
  protected abstract processData(): void;
  protected abstract saveData(): void;

  // Common implementation
  protected closeConnection(): void {
    console.log("✓ Connection closed\n");
  }
}

class CSVProcessor extends DataProcessor {
  protected readData(): void {
    console.log("\n=== CSV Processor ===");
    console.log("Reading CSV file...");
  }

  protected processData(): void {
    console.log("Processing CSV data...");
  }

  protected saveData(): void {
    console.log("Saving to database...");
  }
}

class JSONProcessor extends DataProcessor {
  protected readData(): void {
    console.log("\n=== JSON Processor ===");
    console.log("Reading JSON file...");
  }

  protected processData(): void {
    console.log("Parsing JSON data...");
  }

  protected saveData(): void {
    console.log("Saving to cloud storage...");
  }
}

class XMLProcessor extends DataProcessor {
  protected readData(): void {
    console.log("\n=== XML Processor ===");
    console.log("Reading XML file...");
  }

  protected processData(): void {
    console.log("Parsing XML data...");
  }

  protected saveData(): void {
    console.log("Saving to file system...");
  }
}

// Usage
const processors: DataProcessor[] = [
  new CSVProcessor(),
  new JSONProcessor(),
  new XMLProcessor(),
];

processors.forEach((processor) => processor.process());
```

## Real-World Example: Game Level Loading

```typescript
abstract class GameLevel {
  // Template method
  public loadLevel(): void {
    console.log(`\n=== Loading ${this.getLevelName()} ===`);
    this.initialize();
    this.loadAssets();
    this.loadEnemies();
    this.loadPlayer();
    this.startMusic();
    console.log("✓ Level ready!");
  }

  protected abstract getLevelName(): string;
  protected abstract loadEnemies(): void;

  protected initialize(): void {
    console.log("Initializing game engine...");
  }

  protected loadAssets(): void {
    console.log("Loading textures and models...");
  }

  protected loadPlayer(): void {
    console.log("Loading player character...");
  }

  protected startMusic(): void {
    console.log("Starting background music...");
  }
}

class ForestLevel extends GameLevel {
  protected getLevelName(): string {
    return "Forest Level";
  }

  protected loadEnemies(): void {
    console.log("Loading wolves and bears...");
  }
}

class DesertLevel extends GameLevel {
  protected getLevelName(): string {
    return "Desert Level";
  }

  protected loadEnemies(): void {
    console.log("Loading scorpions and snakes...");
  }

  protected startMusic(): void {
    console.log("Starting desert ambience music...");
  }
}

// Usage
const levels = [new ForestLevel(), new DesertLevel()];
levels.forEach((level) => level.loadLevel());
```

## Summary

- Defines algorithm skeleton in base class
- Subclasses override specific steps
- Promotes code reuse
- Follows Hollywood Principle ("Don't call us, we'll call you")
- Inverts control flow

---

**Next Steps:**

- Review all [Behavioral Patterns](../README.md)
- Review all [Design Patterns](../)
- Practice implementing patterns in real projects
