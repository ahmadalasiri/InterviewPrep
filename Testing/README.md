# Testing & TDD Interview Preparation

This directory contains comprehensive testing and Test-Driven Development (TDD) interview preparation materials using TypeScript.

## 📚 Contents

### Interview Preparation

- **[01-basic-questions.md](00-interview-preparation/01-basic-questions.md)** - Core testing concepts and fundamentals
- **[02-tdd-questions.md](00-interview-preparation/02-tdd-questions.md)** - Test-Driven Development principles and practices
- **[03-advanced-questions.md](00-interview-preparation/03-advanced-questions.md)** - Advanced testing topics and patterns

## 🎯 Key Topics Covered

1. **Testing Fundamentals**
   - Unit Testing
   - Integration Testing
   - End-to-End Testing
   - Test Coverage
   - Mocking and Stubbing

2. **Test-Driven Development (TDD)**
   - Red-Green-Refactor Cycle
   - Writing Tests First
   - TDD Best Practices
   - TDD vs BDD

3. **Testing Tools & Frameworks**
   - Jest
   - Vitest
   - Testing Library
   - Cypress
   - Playwright

4. **Advanced Testing Concepts**
   - Test Doubles (Mocks, Stubs, Spies)
   - Test Isolation
   - Test Fixtures
   - Property-Based Testing
   - Snapshot Testing

## 🚀 Quick Reference

### TDD Cycle

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Testing Pyramid

```
        /\
       /  \
      / E2E \        (Few, Slow, Expensive)
     /______\
    /        \
   /Integration\     (Some, Medium)
  /____________\
 /              \
/    Unit Tests   \  (Many, Fast, Cheap)
/__________________\
```

## 📖 Structure

```
Testing/
├── 00-interview-preparation/    # Interview Q&A
├── 01-basics/                   # Basic testing concepts
├── 02-tdd/                      # TDD examples
├── 03-advanced/                 # Advanced testing topics
├── README.md                    # This file
└── resources.md                 # Learning resources
```

## 🔗 Related Topics

- [TypeScript](../Typescript/) - TypeScript fundamentals
- [Node.js](../NodeJS/) - Node.js testing
- [React](../React/) - React component testing
- [NestJS](../Nest/) - NestJS testing

