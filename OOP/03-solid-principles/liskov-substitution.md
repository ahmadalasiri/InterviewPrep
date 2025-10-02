# Liskov Substitution Principle (LSP)

## Overview

**"Objects of a superclass should be replaceable with objects of a subclass without breaking the application."** - Barbara Liskov

Subtypes must be substitutable for their base types without altering the correctness of the program.

## Key Concepts

If class B is a subtype of class A, we should be able to replace A with B without disrupting the behavior of the program.

## TypeScript Examples

### ❌ Bad: Violates LSP

```typescript
class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

// Square violates LSP
class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }

  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Breaks expectation!
  }

  setHeight(height: number): void {
    this.width = height;
    this.height = height; // Breaks expectation!
  }
}

function testRectangle(rect: Rectangle): void {
  rect.setWidth(5);
  rect.setHeight(4);
  console.log(`Expected 20, got ${rect.getArea()}`); // Square gives 16!
}

const rect = new Rectangle(2, 3);
const square = new Square(2);

testRectangle(rect); // Works: 20
testRectangle(square); // Broken: 16 (expected 20)
```

### ✅ Good: Follows LSP

```typescript
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private size: number) {}

  setSize(size: number): void {
    this.size = size;
  }

  getArea(): number {
    return this.size * this.size;
  }
}

function calculateArea(shape: Shape): number {
  return shape.getArea();
}

// Both work correctly
console.log(calculateArea(new Rectangle(5, 4))); // 20
console.log(calculateArea(new Square(5))); // 25
```

## Real-World Example: Birds

```typescript
// ❌ Bad: Not all birds can fly
class Bird {
  fly(): void {
    console.log("Flying!");
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error("Penguins can't fly!"); // Violates LSP
  }
}

// ✅ Good: Separate flying and non-flying birds
interface Bird {
  eat(): void;
  move(): void;
}

interface FlyingBird extends Bird {
  fly(): void;
}

class Sparrow implements FlyingBird {
  eat(): void {
    console.log("Eating seeds");
  }

  move(): void {
    console.log("Hopping");
  }

  fly(): void {
    console.log("Flying high!");
  }
}

class Penguin implements Bird {
  eat(): void {
    console.log("Eating fish");
  }

  move(): void {
    console.log("Swimming or waddling");
  }
}
```

## Summary

- Subtypes must be substitutable for their base types
- Don't strengthen preconditions or weaken postconditions
- Maintain behavioral compatibility
- Avoid throwing unexpected exceptions in overridden methods

---

**Next Steps:**

- Learn [Interface Segregation Principle](interface-segregation.md)
- Study [Polymorphism](../01-core-concepts/polymorphism.md)
