# Prototype Pattern

## Overview

Creates new objects by cloning existing objects (prototypes) instead of instantiating from scratch.

## TypeScript Implementation

```typescript
interface Cloneable {
  clone(): this;
}

class Document implements Cloneable {
  constructor(
    public title: string,
    public content: string,
    public author: string,
    public metadata: { created: Date; tags: string[] }
  ) {}

  clone(): this {
    // Deep clone
    return new Document(this.title, this.content, this.author, {
      created: new Date(this.metadata.created),
      tags: [...this.metadata.tags],
    }) as this;
  }

  display(): void {
    console.log(`\nTitle: ${this.title}`);
    console.log(`Author: ${this.author}`);
    console.log(`Content: ${this.content}`);
    console.log(`Tags: ${this.metadata.tags.join(", ")}`);
  }
}

// Usage
const originalDoc = new Document(
  "Design Patterns",
  "A guide to software design patterns...",
  "John Doe",
  {
    created: new Date(),
    tags: ["programming", "software", "design"],
  }
);

// Clone and modify
const clonedDoc = originalDoc.clone();
clonedDoc.title = "Advanced Design Patterns";
clonedDoc.content = "An advanced guide...";
clonedDoc.metadata.tags.push("advanced");

originalDoc.display();
clonedDoc.display();
```

## Real-World Example: Game Characters

```typescript
class Character implements Cloneable {
  constructor(
    public name: string,
    public level: number,
    public health: number,
    public skills: string[]
  ) {}

  clone(): this {
    return new Character(this.name, this.level, this.health, [
      ...this.skills,
    ]) as this;
  }

  levelUp(): void {
    this.level++;
    this.health += 10;
  }
}

// Prototype registry
class CharacterRegistry {
  private prototypes = new Map<string, Character>();

  register(key: string, prototype: Character): void {
    this.prototypes.set(key, prototype);
  }

  create(key: string): Character | undefined {
    const prototype = this.prototypes.get(key);
    return prototype?.clone();
  }
}

// Usage
const registry = new CharacterRegistry();

// Register prototypes
registry.register(
  "warrior",
  new Character("Warrior", 1, 100, ["Sword Attack", "Shield Block"])
);
registry.register(
  "mage",
  new Character("Mage", 1, 80, ["Fireball", "Ice Blast"])
);

// Create characters from prototypes
const warrior1 = registry.create("warrior");
const warrior2 = registry.create("warrior");

warrior1!.name = "Conan";
warrior2!.name = "Aragorn";
warrior2!.levelUp();

console.log(warrior1);
console.log(warrior2);
```

## Summary

- Creates objects by cloning prototypes
- Avoids expensive initialization
- Reduces subclasses
- Dynamic object configuration at runtime

---

**Next Steps:**

- Review all [Creational Patterns](../README.md)
- Learn [Structural Patterns](../structural/)
