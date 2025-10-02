# Classes and Objects

## What are Classes and Objects?

**Class**: A blueprint or template that defines the structure and behavior of objects.

- Contains properties (data/attributes)
- Contains methods (functions/behavior)
- Acts as a template for creating objects

**Object**: An instance of a class with actual values.

- Has state (values of properties)
- Has behavior (can execute methods)
- Each object is unique

## Analogy

Think of a class as a cookie cutter and objects as the actual cookies made from that cutter.

## Basic Syntax

### TypeScript Example

```typescript
class Person {
  // Properties
  name: string;
  age: number;

  // Constructor
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Method
  introduce(): void {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old`);
  }
}

// Creating objects
const person1 = new Person("Alice", 30);
const person2 = new Person("Bob", 25);

person1.introduce(); // Hi, I'm Alice, 30 years old
person2.introduce(); // Hi, I'm Bob, 25 years old
```

### JavaScript Example

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old`);
  }
}

const person = new Person("Alice", 30);
person.introduce();
```

### Python Example

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"Hi, I'm {self.name}, {self.age} years old")

person = Person("Alice", 30)
person.introduce()
```

## Key Concepts

### 1. Properties (Attributes)

Variables that belong to a class/object

```typescript
class Car {
  brand: string;
  model: string;
  year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }
}
```

### 2. Methods

Functions that belong to a class

```typescript
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
```

### 3. Constructor

Special method called when creating a new object

```typescript
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
    console.log("Account created");
  }
}

const account = new BankAccount(1000);
```

### 4. this Keyword

Refers to the current object instance

```typescript
class Person {
  name: string;

  constructor(name: string) {
    this.name = name; // 'this' refers to the current object
  }

  greet(): void {
    console.log(`Hello from ${this.name}`);
  }
}
```

## Common Patterns

### 1. Getters and Setters

```typescript
class Employee {
  private _salary: number;

  constructor(salary: number) {
    this._salary = salary;
  }

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value >= 0) {
      this._salary = value;
    }
  }
}

const emp = new Employee(50000);
console.log(emp.salary); // Using getter
emp.salary = 55000; // Using setter
```

### 2. Static Members

Belong to the class, not instances

```typescript
class MathUtils {
  static PI = 3.14159;

  static square(x: number): number {
    return x * x;
  }
}

console.log(MathUtils.PI);
console.log(MathUtils.square(5));
```

### 3. Access Modifiers

Control visibility of members

```typescript
class BankAccount {
  public accountNumber: string; // Accessible everywhere
  private balance: number; // Only within class
  protected interestRate: number; // Class and subclasses

  constructor(accountNumber: string) {
    this.accountNumber = accountNumber;
    this.balance = 0;
    this.interestRate = 0.02;
  }

  public getBalance(): number {
    return this.balance;
  }
}
```

## Best Practices

1. **Use meaningful names**

   ```typescript
   // Good
   class UserAccount {}

   // Bad
   class UA {}
   ```

2. **Keep classes focused**

   - One class, one responsibility
   - Avoid "god objects" that do everything

3. **Initialize in constructor**

   ```typescript
   class Person {
     constructor(public name: string, public age: number) {
       // TypeScript shorthand for property initialization
     }
   }
   ```

4. **Use private fields**

   - Encapsulate data
   - Provide controlled access through methods

5. **Favor composition over inheritance**
   - Use objects as properties
   - More flexible than inheritance

## Real-World Example

```typescript
class Product {
  constructor(
    private id: string,
    private name: string,
    private price: number,
    private inStock: boolean = true
  ) {}

  getInfo(): string {
    return `${this.name} - $${this.price}`;
  }

  isAvailable(): boolean {
    return this.inStock && this.price > 0;
  }

  applyDiscount(percentage: number): void {
    this.price *= 1 - percentage / 100;
  }
}

class ShoppingCart {
  private items: Product[] = [];

  addItem(product: Product): void {
    if (product.isAvailable()) {
      this.items.push(product);
      console.log(`Added ${product.getInfo()}`);
    }
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getPrice(), 0);
  }
}

// Usage
const laptop = new Product("P001", "Laptop", 999.99);
const mouse = new Product("P002", "Mouse", 29.99);

const cart = new ShoppingCart();
cart.addItem(laptop);
cart.addItem(mouse);
console.log(`Total: $${cart.getTotal()}`);
```

## Common Mistakes to Avoid

1. **Forgetting `new` keyword**

   ```typescript
   const person = Person("Alice", 30); // Wrong!
   const person = new Person("Alice", 30); // Correct
   ```

2. **Modifying properties directly when they should be private**

   ```typescript
   // Bad
   account.balance = 10000;

   // Good
   account.deposit(10000);
   ```

3. **Too many responsibilities in one class**

   ```typescript
   // Bad - Does too much
   class UserManager {
     validateUser() {}
     saveToDatabase() {}
     sendEmail() {}
     generateReport() {}
   }

   // Good - Separate concerns
   class UserValidator {}
   class UserRepository {}
   class EmailService {}
   class ReportGenerator {}
   ```

## Interview Questions

1. **Q: What is the difference between a class and an object?**

   - Class is a template/blueprint
   - Object is an instance with actual values
   - Class defines structure, object contains data

2. **Q: What is a constructor?**

   - Special method for initializing objects
   - Called automatically when creating instance
   - Sets up initial state

3. **Q: What is the `this` keyword?**
   - Refers to current object instance
   - Used to access properties and methods
   - Context-dependent

## Practice Exercises

1. Create a `Book` class with title, author, and pages
2. Create a `Library` class that manages multiple books
3. Implement a `BankAccount` with deposit/withdraw methods
4. Create a `Student` class with grades and GPA calculation
5. Build a simple `TodoList` class

## Next Steps

- Learn about [Encapsulation](encapsulation.md)
- Explore [Inheritance](inheritance.md)
- Study [Polymorphism](polymorphism.md)
- See [Practical Examples](../05-practical-examples/typescript/)
