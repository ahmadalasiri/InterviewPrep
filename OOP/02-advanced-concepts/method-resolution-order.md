# Method Resolution Order (MRO)

## Overview

Method Resolution Order (MRO) defines the order in which base classes are searched when executing a method. In languages with multiple inheritance, MRO determines which method gets called when multiple parent classes define the same method.

## TypeScript and MRO

TypeScript uses single inheritance, so MRO is straightforward:

```typescript
class A {
  method(): string {
    return "A";
  }
}

class B extends A {
  method(): string {
    return "B";
  }
}

class C extends B {
  method(): string {
    return "C";
  }
}

const c = new C();
console.log(c.method()); // "C" - checks C first, then B, then A
```

## Method Lookup Order

### Single Inheritance Chain

```typescript
class Animal {
  makeSound(): void {
    console.log("Some sound");
  }

  move(): void {
    console.log("Moving");
  }
}

class Mammal extends Animal {
  makeSound(): void {
    console.log("Mammal sound");
  }

  // move() inherited from Animal
}

class Dog extends Mammal {
  // makeSound() inherited from Mammal
  // move() inherited from Animal (through Mammal)
}

const dog = new Dog();
dog.makeSound(); // "Mammal sound" - found in Mammal
dog.move(); // "Moving" - found in Animal
```

### Method Resolution with `super`

```typescript
class Level1 {
  greet(): void {
    console.log("Level 1");
  }
}

class Level2 extends Level1 {
  greet(): void {
    console.log("Level 2");
    super.greet(); // Calls Level1.greet()
  }
}

class Level3 extends Level2 {
  greet(): void {
    console.log("Level 3");
    super.greet(); // Calls Level2.greet()
  }
}

const obj = new Level3();
obj.greet();
// Output:
// Level 3
// Level 2
// Level 1
```

## Interface Resolution

When a class implements multiple interfaces:

```typescript
interface A {
  method(): string;
}

interface B {
  method(): string;
}

// Must provide single implementation for both interfaces
class C implements A, B {
  method(): string {
    return "C's implementation";
  }
}
```

## Mixins and Resolution Order

```typescript
type Constructor = new (...args: any[]) => {};

function Mixin1<T extends Constructor>(Base: T) {
  return class extends Base {
    mixin1Method(): void {
      console.log("Mixin1");
    }

    sharedMethod(): void {
      console.log("Mixin1 shared");
    }
  };
}

function Mixin2<T extends Constructor>(Base: T) {
  return class extends Base {
    mixin2Method(): void {
      console.log("Mixin2");
    }

    sharedMethod(): void {
      console.log("Mixin2 shared");
    }
  };
}

class Base {
  baseMethod(): void {
    console.log("Base");
  }
}

// Order matters: Mixin2 is applied last, so its methods take precedence
const Mixed = Mixin2(Mixin1(Base));

const instance = new Mixed();
instance.baseMethod(); // "Base"
instance.sharedMethod(); // "Mixin2 shared" - Mixin2 applied last
```

## Best Practices

1. **Keep hierarchies shallow** - Deep hierarchies make MRO complex
2. **Use composition** - When multiple inheritance is needed
3. **Document method overrides** - Make MRO clear
4. **Be explicit with super** - Show intent clearly

## Summary

- TypeScript uses simple C3 linearization for single inheritance
- Method lookup: Current class → Parent → Grandparent → ...
- Mixins applied last override earlier ones
- Use `super` to explicitly call parent methods

---

**Next Steps:**

- Study [Inheritance](../01-core-concepts/inheritance.md)
- Learn [Mixins and Traits](mixins-traits.md)
