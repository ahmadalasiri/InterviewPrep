# Object-Oriented Programming (OOP) - Complete Learning Guide

This repository contains a comprehensive guide to learning Object-Oriented Programming with practical examples and explanations across multiple languages.

## Table of Contents

### 1. Core Concepts

- [Classes and Objects](01-core-concepts/classes-objects.md) - Basic building blocks of OOP
- [Encapsulation](01-core-concepts/encapsulation.md) - Data hiding and access modifiers
- [Inheritance](01-core-concepts/inheritance.md) - Code reusability and hierarchies
- [Polymorphism](01-core-concepts/polymorphism.md) - Method overriding and overloading
- [Abstraction](01-core-concepts/abstraction.md) - Abstract classes and interfaces

### 2. Advanced Concepts

- [Composition vs Inheritance](02-advanced-concepts/composition-vs-inheritance.md) - Design strategies
- [Multiple Inheritance](02-advanced-concepts/multiple-inheritance.md) - Diamond problem and solutions
- [Method Resolution Order](02-advanced-concepts/method-resolution-order.md) - MRO in different languages
- [Dependency Injection](02-advanced-concepts/dependency-injection.md) - Loose coupling patterns
- [Mixins and Traits](02-advanced-concepts/mixins-traits.md) - Code reuse techniques

### 3. SOLID Principles

- [Single Responsibility Principle](03-solid-principles/single-responsibility.md) - One class, one purpose
- [Open/Closed Principle](03-solid-principles/open-closed.md) - Open for extension, closed for modification
- [Liskov Substitution Principle](03-solid-principles/liskov-substitution.md) - Substitutability of derived classes
- [Interface Segregation Principle](03-solid-principles/interface-segregation.md) - Client-specific interfaces
- [Dependency Inversion Principle](03-solid-principles/dependency-inversion.md) - Depend on abstractions

### 4. Design Patterns

#### Creational Patterns

- [Singleton Pattern](04-design-patterns/creational/singleton.md) - Single instance creation
- [Factory Pattern](04-design-patterns/creational/factory.md) - Object creation abstraction
- [Abstract Factory Pattern](04-design-patterns/creational/abstract-factory.md) - Family of related objects
- [Builder Pattern](04-design-patterns/creational/builder.md) - Step-by-step object construction
- [Prototype Pattern](04-design-patterns/creational/prototype.md) - Cloning objects

#### Structural Patterns

- [Adapter Pattern](04-design-patterns/structural/adapter.md) - Interface compatibility
- [Decorator Pattern](04-design-patterns/structural/decorator.md) - Adding behavior dynamically
- [Facade Pattern](04-design-patterns/structural/facade.md) - Simplified interface
- [Proxy Pattern](04-design-patterns/structural/proxy.md) - Placeholder for another object
- [Composite Pattern](04-design-patterns/structural/composite.md) - Tree structure of objects

#### Behavioral Patterns

- [Observer Pattern](04-design-patterns/behavioral/observer.md) - Publish-subscribe mechanism
- [Strategy Pattern](04-design-patterns/behavioral/strategy.md) - Interchangeable algorithms
- [Command Pattern](04-design-patterns/behavioral/command.md) - Encapsulating requests
- [State Pattern](04-design-patterns/behavioral/state.md) - Object state behavior
- [Template Method Pattern](04-design-patterns/behavioral/template-method.md) - Algorithm skeleton

### 5. Practical Examples

- [Python Examples](05-practical-examples/python/) - OOP in Python
- [Java Examples](05-practical-examples/java/) - OOP in Java
- [JavaScript Examples](05-practical-examples/javascript/) - OOP in JavaScript
- [C++ Examples](05-practical-examples/cpp/) - OOP in C++
- [Go Examples](05-practical-examples/go/) - OOP patterns in Go

## Getting Started

### Prerequisites

- Basic programming knowledge in at least one language
- Understanding of functions and basic data structures
- Text editor or IDE of your choice

### Learning Path

1. **Start with Core Concepts** (Week 1-2)

   - Understand classes and objects
   - Practice encapsulation and data hiding
   - Learn inheritance hierarchies
   - Explore polymorphism

2. **Master Advanced Concepts** (Week 3-4)

   - Compare composition vs inheritance
   - Study dependency injection
   - Learn about mixins and traits
   - Practice designing class hierarchies

3. **Apply SOLID Principles** (Week 5-6)

   - Study each SOLID principle
   - Refactor code to follow SOLID
   - Identify violations in existing code
   - Practice writing SOLID code

4. **Learn Design Patterns** (Week 7-10)

   - Start with creational patterns
   - Move to structural patterns
   - Master behavioral patterns
   - Implement patterns in projects

5. **Build Real Projects** (Week 11+)
   - Apply learned concepts
   - Use appropriate design patterns
   - Follow SOLID principles
   - Write clean, maintainable code

## Key OOP Concepts

### The Four Pillars of OOP

#### 1. Encapsulation

- **Definition**: Bundling data and methods that operate on that data within a single unit (class)
- **Benefits**: Data hiding, modularity, flexibility, maintainability
- **Implementation**: Private/protected fields, public methods (getters/setters)

#### 2. Inheritance

- **Definition**: Mechanism where a new class derives properties and behavior from existing class
- **Benefits**: Code reusability, hierarchical classification, polymorphism
- **Types**: Single, multilevel, hierarchical, multiple

#### 3. Polymorphism

- **Definition**: Ability of objects to take multiple forms
- **Types**:
  - Compile-time (Method Overloading)
  - Runtime (Method Overriding)
- **Benefits**: Flexibility, code reusability, loose coupling

#### 4. Abstraction

- **Definition**: Hiding complex implementation details and showing only essential features
- **Implementation**: Abstract classes, interfaces
- **Benefits**: Reduces complexity, increases security, facilitates code maintenance

### Class vs Object

**Class**: Blueprint or template for creating objects

- Defines properties (attributes)
- Defines behaviors (methods)
- Does not occupy memory until instantiated

**Object**: Instance of a class

- Has state (attribute values)
- Has behavior (can call methods)
- Occupies memory

### Access Modifiers

- **Public**: Accessible from anywhere
- **Private**: Accessible only within the class
- **Protected**: Accessible within the class and its subclasses
- **Package/Internal**: Accessible within the same package/module

## Design Principles

### DRY (Don't Repeat Yourself)

- Avoid code duplication
- Use inheritance or composition
- Extract common functionality

### KISS (Keep It Simple, Stupid)

- Prefer simple solutions
- Avoid over-engineering
- Write readable code

### YAGNI (You Aren't Gonna Need It)

- Don't add functionality until necessary
- Avoid premature optimization
- Focus on current requirements

### Composition Over Inheritance

- Prefer object composition to class inheritance
- More flexible and maintainable
- Avoids inheritance hierarchies becoming too complex

## Best Practices

### 1. Design

- **Single Responsibility**: Each class should have one reason to change
- **High Cohesion**: Keep related functionality together
- **Low Coupling**: Minimize dependencies between classes
- **Program to Interfaces**: Depend on abstractions, not concrete implementations

### 2. Naming Conventions

- **Classes**: Use nouns (e.g., `Customer`, `Invoice`, `OrderProcessor`)
- **Interfaces**: Use adjectives or nouns (e.g., `Readable`, `Comparable`, `Repository`)
- **Methods**: Use verbs (e.g., `calculate()`, `process()`, `validate()`)
- **Properties**: Use nouns (e.g., `name`, `price`, `quantity`)

### 3. Class Design

- Keep classes small and focused
- Favor immutability when possible
- Use meaningful names
- Write self-documenting code
- Add comments for complex logic

### 4. Inheritance

- Use inheritance for "is-a" relationships
- Use composition for "has-a" relationships
- Don't use inheritance just for code reuse
- Keep inheritance hierarchies shallow (3-4 levels max)
- Make base classes abstract when appropriate

### 5. Polymorphism

- Use interfaces for contracts
- Prefer composition with interfaces over inheritance
- Use dependency injection for flexibility
- Apply strategy pattern for interchangeable algorithms

## Common Anti-Patterns

### 1. God Object

- **Problem**: One class that does too much
- **Solution**: Break into smaller, focused classes

### 2. Yo-Yo Problem

- **Problem**: Complex inheritance hierarchy requiring frequent navigation
- **Solution**: Prefer composition, flatten hierarchies

### 3. Circle-Ellipse Problem

- **Problem**: Violating Liskov Substitution Principle
- **Solution**: Rethink inheritance relationships

### 4. Diamond Problem

- **Problem**: Ambiguity in multiple inheritance
- **Solution**: Use interfaces, composition, or mixins

### 5. Anemic Domain Model

- **Problem**: Classes with only getters/setters, no behavior
- **Solution**: Add business logic to domain classes

## Interview Tips

### Common Interview Questions

1. Explain the four pillars of OOP
2. What is the difference between abstraction and encapsulation?
3. When would you use composition over inheritance?
4. Explain SOLID principles with examples
5. What design patterns have you used?
6. How do you ensure low coupling and high cohesion?

### Preparation Strategy

- ✅ Understand core concepts deeply
- ✅ Practice implementing design patterns
- ✅ Review SOLID principles with examples
- ✅ Prepare real-world examples from your experience
- ✅ Practice whiteboard coding
- ✅ Study language-specific OOP features

### Code Review Checklist

- [ ] Are classes following Single Responsibility Principle?
- [ ] Is there proper encapsulation?
- [ ] Are inheritance relationships appropriate?
- [ ] Is polymorphism used effectively?
- [ ] Are design patterns applied correctly?
- [ ] Is code maintainable and extensible?

## Resources

### Books

- **Design Patterns: Elements of Reusable Object-Oriented Software** (Gang of Four)
- **Head First Design Patterns** by Eric Freeman
- **Clean Code** by Robert C. Martin
- **Refactoring** by Martin Fowler
- **Object-Oriented Analysis and Design** by Grady Booch

### Online Resources

- [Refactoring Guru](https://refactoring.guru/) - Design patterns and refactoring
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Source Making](https://sourcemaking.com/) - Design patterns and anti-patterns
- [Design Patterns in Different Languages](https://github.com/DovAmir/awesome-design-patterns)

### Video Courses

- Object-Oriented Programming courses on Coursera
- Design Patterns on Pluralsight
- SOLID Principles on YouTube
- Udemy courses on OOP and Design Patterns

## Project Ideas

### Beginner Level

- **Library Management System**: Books, members, borrowing
- **Bank Account System**: Accounts, transactions, customers
- **Shape Calculator**: Different shapes with area/perimeter calculations
- **Vehicle Hierarchy**: Cars, bikes, trucks with common behaviors
- **Employee Management**: Different employee types with salary calculations

### Intermediate Level

- **E-commerce Platform**: Products, cart, orders, payment strategies
- **Hotel Reservation System**: Rooms, bookings, pricing strategies
- **Game Character System**: Different character types with abilities
- **Document Management**: Different document types with rendering
- **Social Media System**: Users, posts, comments, notifications

### Advanced Level

- **Design Pattern Showcase**: Implement multiple patterns in a cohesive system
- **Framework Development**: Build a small framework using OOP principles
- **Plugin Architecture**: Extensible system with plugin support
- **Workflow Engine**: Configurable workflow system with state management
- **Custom ORM**: Object-relational mapping framework

## Interview Preparation

Check out the [Interview Preparation](00-interview-preparation/) folder for:

- Comprehensive question bank
- Practical coding challenges
- Design pattern scenarios
- SOLID principle examples
- System design using OOP
- Code review exercises

---

## Quick Reference

### When to Use Each Principle

| Scenario                                             | Principle/Pattern     |
| ---------------------------------------------------- | --------------------- |
| One class doing too much                             | Single Responsibility |
| Need to add features without modifying existing code | Open/Closed, Strategy |
| Substituting derived classes breaks behavior         | Liskov Substitution   |
| Clients forced to depend on unused methods           | Interface Segregation |
| High-level modules depend on low-level modules       | Dependency Inversion  |
| Need single instance                                 | Singleton             |
| Complex object creation                              | Builder, Factory      |
| Need to change behavior at runtime                   | Strategy, State       |
| Need to notify multiple objects of changes           | Observer              |

### Language-Specific Features

| Language       | Key OOP Features                                                         |
| -------------- | ------------------------------------------------------------------------ |
| **Java**       | Interfaces, abstract classes, strong typing, single inheritance          |
| **Python**     | Multiple inheritance, duck typing, properties, metaclasses               |
| **C++**        | Multiple inheritance, operator overloading, templates, virtual functions |
| **JavaScript** | Prototypal inheritance, dynamic typing, first-class functions            |
| **C#**         | Properties, events, delegates, LINQ, strong typing                       |
| **Go**         | Interfaces (implicit), composition, embedded types, no inheritance       |

---

Happy coding with OOP! 🚀

Master these concepts, practice design patterns, and build maintainable software!
