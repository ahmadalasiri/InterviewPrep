# OOP in TypeScript - Practical Examples

This folder contains comprehensive TypeScript examples demonstrating Object-Oriented Programming concepts.

## Files

1. **01-classes-objects.ts** - Classes, objects, constructors, access modifiers, getters/setters, static members
2. **02-inheritance.ts** - Inheritance, abstract classes, method overriding, super keyword, multilevel inheritance
3. **03-polymorphism.ts** - Interfaces, method overriding, runtime polymorphism, strategy pattern
4. **04-design-patterns.ts** - Common design patterns (Singleton, Factory, Observer, Strategy, Decorator, Builder, Facade, Command)

## Running the Examples

### Prerequisites

```bash
# Install TypeScript globally
npm install -g typescript

# Or install in project
npm install --save-dev typescript
```

### Run Individual Files

```bash
# Compile and run
tsc 01-classes-objects.ts && node 01-classes-objects.js

# Or use ts-node for direct execution
npx ts-node 01-classes-objects.ts
```

### Run All Files

```bash
# Compile all
tsc *.ts

# Run all
node 01-classes-objects.js
node 02-inheritance.js
node 03-polymorphism.js
node 04-design-patterns.js
```

## Topics Covered

### Classes and Objects

- Basic class syntax
- Constructors and initialization
- Access modifiers (public, private, protected)
- Getters and setters
- Static members and methods
- Readonly properties
- Optional properties
- Method overloading
- Object composition

### Inheritance

- Basic inheritance with extends
- Abstract classes
- Method overriding
- Super keyword
- Protected members
- Multilevel inheritance
- Constructor chaining
- instanceof checks

### Polymorphism

- Interface-based polymorphism
- Method overriding
- Runtime polymorphism
- Type substitution
- Multiple interfaces
- Polymorphic collections
- Type guards

### Design Patterns

- **Creational**: Singleton, Factory, Builder
- **Structural**: Adapter, Decorator, Facade
- **Behavioral**: Observer, Strategy, Command

## Best Practices Demonstrated

1. **Encapsulation**: Private fields with public methods
2. **Single Responsibility**: Each class has one clear purpose
3. **Type Safety**: Leveraging TypeScript's type system
4. **Interface Segregation**: Small, focused interfaces
5. **Dependency Injection**: Constructor injection for flexibility
6. **Composition Over Inheritance**: Using composition where appropriate
7. **Open/Closed Principle**: Extensible without modification

## Learning Path

1. Start with `01-classes-objects.ts` to understand basics
2. Move to `02-inheritance.ts` for code reuse
3. Study `03-polymorphism.ts` for flexibility
4. Explore `04-design-patterns.ts` for real-world solutions

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Design Patterns](https://refactoring.guru/design-patterns/typescript)

Happy learning! 🚀
