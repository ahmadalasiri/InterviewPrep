# OOP Basic Questions

## Table of Contents

- [Fundamental Concepts](#fundamental-concepts)
- [Classes and Objects](#classes-and-objects)
- [Encapsulation](#encapsulation)
- [Inheritance](#inheritance)
- [Polymorphism](#polymorphism)
- [Abstraction](#abstraction)
- [Practical Examples](#practical-examples)

---

## Fundamental Concepts

### Q1: What is Object-Oriented Programming?

**Answer:**
Object-Oriented Programming (OOP) is a programming paradigm that organizes code around objects rather than functions and logic. It's based on the concept of "objects" which contain data (attributes) and code (methods).

**Key Characteristics:**

- Encapsulation: Bundling data and methods
- Inheritance: Reusing code through parent-child relationships
- Polymorphism: Same interface, different implementations
- Abstraction: Hiding complex implementation details

**Example (TypeScript):**

```typescript
class Car {
  private brand: string;
  private model: string;

  constructor(brand: string, model: string) {
    this.brand = brand;
    this.model = model;
  }

  public drive(): void {
    console.log(`${this.brand} ${this.model} is driving`);
  }
}

const myCar = new Car("Toyota", "Camry");
myCar.drive(); // Output: Toyota Camry is driving
```

---

### Q2: What are the four pillars of OOP?

**Answer:**

The four fundamental pillars (principles) of Object-Oriented Programming are:

---

## 1. **Encapsulation**

**Definition:** Encapsulation is the bundling of data (attributes) and methods (functions) that operate on that data into a single unit (class), while restricting direct access to some of the object's components.

**Key Concepts:**

- **Data Hiding**: Internal state is hidden from outside access
- **Access Modifiers**: Use private, protected, and public to control access
- **Getters/Setters**: Controlled access to private data
- **Information Hiding**: Implementation details are hidden from users

**Benefits:**

- ✅ Protects data integrity
- ✅ Prevents unauthorized access
- ✅ Reduces system complexity
- ✅ Increases code maintainability
- ✅ Allows changing implementation without affecting other code

**Example:**

```typescript
class BankAccount {
  // Private properties (encapsulated data)
  private balance: number;
  private accountNumber: string;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }

  // Public method to access private data (getter)
  public getBalance(): number {
    return this.balance;
  }

  // Public method to modify private data with validation
  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount;
  }

  public withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
  }

  // Private helper method (hidden from outside)
  private logTransaction(type: string, amount: number): void {
    console.log(`${type}: $${amount} on ${this.accountNumber}`);
  }
}

// Usage
const account = new BankAccount("123456", 1000);
// account.balance = 5000; // ❌ Error: Cannot access private property
account.deposit(500); // ✅ Correct way to modify balance
console.log(account.getBalance()); // 1500
```

**Real-World Analogy:** Like a car - you can use the steering wheel, pedals, and gear shift (public interface) without knowing the complex engine mechanics (hidden implementation).

---

## 2. **Inheritance**

**Definition:** Inheritance is a mechanism where a new class (derived/child class) inherits properties and behaviors from an existing class (base/parent class), allowing code reuse and establishing hierarchical relationships.

**Key Concepts:**

- **Base/Parent/Super Class**: The class being inherited from
- **Derived/Child/Sub Class**: The class that inherits
- **"IS-A" Relationship**: Child class IS-A type of parent class
- **Method Overriding**: Child can provide specific implementation
- **Super Keyword**: Access parent class members

**Types:**

- **Single Inheritance**: One parent class
- **Multiple Inheritance**: Multiple parent classes (not in all languages)
- **Multilevel Inheritance**: Child inherits from parent, which inherits from grandparent
- **Hierarchical Inheritance**: Multiple children inherit from one parent

**Benefits:**

- ✅ Promotes code reusability
- ✅ Establishes relationships between classes
- ✅ Supports hierarchical classification
- ✅ Enables method overriding
- ✅ Reduces code duplication

**Example:**

```typescript
// Base class (Parent)
class Animal {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public eat(): void {
    console.log(`${this.name} is eating`);
  }

  public sleep(): void {
    console.log(`${this.name} is sleeping`);
  }

  public makeSound(): void {
    console.log("Some generic animal sound");
  }
}

// Derived class (Child)
class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  // Method overriding - specific implementation
  public makeSound(): void {
    console.log(`${this.name} barks: Woof! Woof!`);
  }

  // Additional method specific to Dog
  public fetch(): void {
    console.log(`${this.name} is fetching the ball`);
  }
}

class Cat extends Animal {
  private indoor: boolean;

  constructor(name: string, age: number, indoor: boolean) {
    super(name, age);
    this.indoor = indoor;
  }

  // Method overriding
  public makeSound(): void {
    console.log(`${this.name} meows: Meow!`);
  }

  public scratch(): void {
    console.log(`${this.name} is scratching`);
  }
}

// Usage
const dog = new Dog("Buddy", 3, "Golden Retriever");
dog.eat(); // Inherited from Animal
dog.sleep(); // Inherited from Animal
dog.makeSound(); // Overridden in Dog: "Buddy barks: Woof! Woof!"
dog.fetch(); // Specific to Dog

const cat = new Cat("Whiskers", 2, true);
cat.eat(); // Inherited from Animal
cat.makeSound(); // Overridden in Cat: "Whiskers meows: Meow!"
cat.scratch(); // Specific to Cat
```

**Real-World Analogy:** Like biological classification - a Dog IS-A Animal, inheriting general animal characteristics but having specific dog behaviors.

---

## 3. **Polymorphism**

**Definition:** Polymorphism (Greek: "many forms") is the ability of objects of different classes to be treated as objects of a common parent class, and the ability to call the same method on different objects and have each respond in their own way.

**Key Concepts:**

- **Method Overriding** (Runtime Polymorphism): Same method signature, different implementation in subclasses
- **Method Overloading** (Compile-time Polymorphism): Same method name, different parameters
- **Interface Implementation**: Different classes implementing the same interface
- **"One Interface, Multiple Implementations"**

**Types:**

1. **Compile-Time (Static) Polymorphism**: Method overloading
2. **Runtime (Dynamic) Polymorphism**: Method overriding

**Benefits:**

- ✅ Increases code flexibility and extensibility
- ✅ Allows writing more generic and reusable code
- ✅ Enables adding new classes without modifying existing code
- ✅ Supports loose coupling
- ✅ Makes code more maintainable

**Example:**

```typescript
// Interface defining common behavior
interface Shape {
  calculateArea(): number;
  calculatePerimeter(): number;
  draw(): void;
}

// Different implementations of the same interface
class Circle implements Shape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  draw(): void {
    console.log(`Drawing a circle with radius ${this.radius}`);
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }

  draw(): void {
    console.log(`Drawing a rectangle ${this.width}x${this.height}`);
  }
}

class Triangle implements Shape {
  constructor(
    private side1: number,
    private side2: number,
    private side3: number
  ) {}

  calculateArea(): number {
    // Using Heron's formula
    const s = (this.side1 + this.side2 + this.side3) / 2;
    return Math.sqrt(
      s * (s - this.side1) * (s - this.side2) * (s - this.side3)
    );
  }

  calculatePerimeter(): number {
    return this.side1 + this.side2 + this.side3;
  }

  draw(): void {
    console.log(`Drawing a triangle`);
  }
}

// Polymorphism in action - treating different shapes uniformly
function processShape(shape: Shape): void {
  shape.draw();
  console.log(`Area: ${shape.calculateArea()}`);
  console.log(`Perimeter: ${shape.calculatePerimeter()}`);
}

// Same function works with different shape types
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4, 5),
];

shapes.forEach((shape) => {
  processShape(shape);
  // Each shape responds differently to the same method calls
  console.log("---");
});

// Method Overloading Example (Compile-time Polymorphism)
class Calculator {
  // Same method name, different parameters
  add(a: number, b: number): number;
  add(a: number, b: number, c: number): number;
  add(a: string, b: string): string;

  add(a: any, b: any, c?: any): any {
    if (typeof a === "string" && typeof b === "string") {
      return a + b; // String concatenation
    }
    if (c !== undefined) {
      return a + b + c; // Three numbers
    }
    return a + b; // Two numbers
  }
}

const calc = new Calculator();
console.log(calc.add(5, 10)); // 15
console.log(calc.add(5, 10, 15)); // 30
console.log(calc.add("Hello", "World")); // HelloWorld
```

**Real-World Analogy:** Like a universal remote control - the same "power" button works on TV, DVD player, and sound system, but each device responds in its own specific way.

---

## 4. **Abstraction**

**Definition:** Abstraction is the process of hiding complex implementation details and showing only the essential features and functionality to the user. It focuses on WHAT an object does rather than HOW it does it.

**Key Concepts:**

- **Abstract Classes**: Cannot be instantiated, serve as templates
- **Abstract Methods**: Declared but not implemented in abstract class
- **Interfaces**: Pure abstraction, only method signatures
- **Concrete Classes**: Provide actual implementation
- **Separation of Interface and Implementation**

**Levels:**

- **Low-Level Abstraction**: Close to hardware/implementation
- **High-Level Abstraction**: Close to user/problem domain

**Benefits:**

- ✅ Reduces complexity by hiding unnecessary details
- ✅ Focuses on relevant aspects of objects
- ✅ Improves code organization
- ✅ Enhances code modularity
- ✅ Allows changing implementation without affecting users
- ✅ Supports loose coupling

**Example:**

```typescript
// Abstract class - cannot be instantiated
abstract class PaymentProcessor {
  protected amount: number;
  protected currency: string;

  constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }

  // Abstract methods - must be implemented by subclasses
  abstract validatePayment(): boolean;
  abstract processPayment(): Promise<boolean>;
  abstract refund(): Promise<boolean>;

  // Concrete method - shared by all payment processors
  public displayReceipt(): void {
    console.log(`Payment Receipt`);
    console.log(`Amount: ${this.currency} ${this.amount}`);
    console.log(`Status: Processed`);
  }

  // Template method - defines the algorithm structure
  public async executePayment(): Promise<boolean> {
    console.log("Starting payment process...");

    if (!this.validatePayment()) {
      console.log("Payment validation failed");
      return false;
    }

    const success = await this.processPayment();

    if (success) {
      this.displayReceipt();
    }

    return success;
  }
}

// Concrete implementation - Credit Card
class CreditCardPayment extends PaymentProcessor {
  private cardNumber: string;
  private cvv: string;

  constructor(
    amount: number,
    currency: string,
    cardNumber: string,
    cvv: string
  ) {
    super(amount, currency);
    this.cardNumber = cardNumber;
    this.cvv = cvv;
  }

  validatePayment(): boolean {
    // Specific validation logic for credit cards
    console.log("Validating credit card...");
    return this.cardNumber.length === 16 && this.cvv.length === 3;
  }

  async processPayment(): Promise<boolean> {
    // Specific processing logic for credit cards
    console.log("Processing credit card payment...");
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }

  async refund(): Promise<boolean> {
    console.log("Processing credit card refund...");
    return true;
  }
}

// Concrete implementation - PayPal
class PayPalPayment extends PaymentProcessor {
  private email: string;

  constructor(amount: number, currency: string, email: string) {
    super(amount, currency);
    this.email = email;
  }

  validatePayment(): boolean {
    // Specific validation logic for PayPal
    console.log("Validating PayPal account...");
    return this.email.includes("@");
  }

  async processPayment(): Promise<boolean> {
    // Specific processing logic for PayPal
    console.log("Processing PayPal payment...");
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }

  async refund(): Promise<boolean> {
    console.log("Processing PayPal refund...");
    return true;
  }
}

// Concrete implementation - Bitcoin
class BitcoinPayment extends PaymentProcessor {
  private walletAddress: string;

  constructor(amount: number, walletAddress: string) {
    super(amount, "BTC");
    this.walletAddress = walletAddress;
  }

  validatePayment(): boolean {
    console.log("Validating Bitcoin wallet...");
    return this.walletAddress.length > 26;
  }

  async processPayment(): Promise<boolean> {
    console.log("Processing Bitcoin payment...");
    return new Promise((resolve) => setTimeout(() => resolve(true), 2000));
  }

  async refund(): Promise<boolean> {
    console.log("Bitcoin refunds require manual processing");
    return false;
  }
}

// Usage - User doesn't need to know implementation details
async function processCustomerPayment(processor: PaymentProcessor) {
  // High-level abstraction - user only sees this
  const success = await processor.executePayment();

  if (success) {
    console.log("Payment completed successfully!");
  } else {
    console.log("Payment failed!");
  }
}

// Different payment methods, same interface
const creditCard = new CreditCardPayment(100, "USD", "1234567890123456", "123");
const paypal = new PayPalPayment(50, "USD", "user@example.com");
const bitcoin = new BitcoinPayment(0.005, "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");

await processCustomerPayment(creditCard);
await processCustomerPayment(paypal);
await processCustomerPayment(bitcoin);
```

**Real-World Analogy:** Like driving a car - you interact with the steering wheel, pedals, and gear shift (abstraction layer) without needing to understand the engine, transmission, and fuel injection system (implementation details).

---

## **Summary Comparison:**

| Pillar            | Focus                              | Question Answered                        | Example                                                 |
| ----------------- | ---------------------------------- | ---------------------------------------- | ------------------------------------------------------- |
| **Encapsulation** | Data protection & hiding           | How to protect data?                     | Private variables with public methods                   |
| **Inheritance**   | Code reuse & relationships         | How to reuse code?                       | Dog extends Animal                                      |
| **Polymorphism**  | Flexibility & multiple forms       | How to handle different types uniformly? | Different shapes with same interface                    |
| **Abstraction**   | Simplification & hiding complexity | What is essential?                       | Abstract PaymentProcessor with concrete implementations |

**How They Work Together:**

```typescript
// Abstraction - defines what payment should do
abstract class Payment {
  abstract process(): void;
}

// Inheritance - reuses payment functionality
class OnlinePayment extends Payment {
  // Encapsulation - hides card details
  private cardNumber: string;

  constructor(cardNumber: string) {
    super();
    this.cardNumber = cardNumber;
  }

  // Polymorphism - specific implementation
  process(): void {
    console.log("Processing online payment");
  }
}

class CashPayment extends Payment {
  // Polymorphism - different implementation
  process(): void {
    console.log("Processing cash payment");
  }
}

// Using all pillars together
function checkout(payment: Payment) {
  payment.process(); // Works with any payment type
}
```

**Example (TypeScript):**

```typescript
// Encapsulation
class BankAccount {
  private balance: number = 0;

  public deposit(amount: number): void {
    this.balance += amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

// Inheritance
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  public makeSound(): void {
    console.log("Some sound");
  }
}

class Dog extends Animal {
  public makeSound(): void {
    console.log(`${this.name} says: Woof!`);
  }
}

// Polymorphism
class Cat extends Animal {
  public makeSound(): void {
    console.log(`${this.name} says: Meow!`);
  }
}

const animals: Animal[] = [new Dog("Buddy"), new Cat("Whiskers")];
animals.forEach((animal) => animal.makeSound());
// Output:
// Buddy says: Woof!
// Whiskers says: Meow!

// Abstraction
abstract class Shape {
  abstract calculateArea(): number;

  public describe(): void {
    console.log(`Area: ${this.calculateArea()}`);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

---

## Classes and Objects

### Q3: What is the difference between a class and an object?

**Answer:**

**Class:**

- Blueprint or template for creating objects
- Defines properties and methods
- Doesn't occupy memory until instantiated
- Abstract concept

**Object:**

- Instance of a class
- Has actual values for properties
- Occupies memory
- Concrete entity

**Analogy:** Class is like an architectural blueprint, Object is like an actual house built from that blueprint.

**Example (TypeScript):**

```typescript
// Class - Blueprint
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): void {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old`);
  }
}

// Objects - Instances
const person1 = new Person("Alice", 30);
const person2 = new Person("Bob", 25);

person1.introduce(); // Hi, I'm Alice, 30 years old
person2.introduce(); // Hi, I'm Bob, 25 years old
```

---

### Q4: What is a constructor?

**Answer:**
A constructor is a special method that is automatically called when an object is created. It initializes the object's properties and sets up the initial state.

**Key Points:**

- Same name as the class (in most languages)
- No return type
- Can be overloaded (multiple constructors with different parameters)
- Called automatically during object creation

**Example (TypeScript):**

```typescript
class Rectangle {
  private width: number;
  private height: number;

  // Constructor
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    console.log("Rectangle created");
  }

  // Overloaded constructor pattern using optional parameters
  static create(size: number): Rectangle;
  static create(width: number, height: number): Rectangle;
  static create(widthOrSize: number, height?: number): Rectangle {
    if (height === undefined) {
      return new Rectangle(widthOrSize, widthOrSize); // Square
    }
    return new Rectangle(widthOrSize, height);
  }

  getArea(): number {
    return this.width * this.height;
  }
}

const rect1 = new Rectangle(5, 10);
const square = Rectangle.create(5); // 5x5 square
const rect2 = Rectangle.create(4, 6);
```

---

## Encapsulation

### Q5: What is encapsulation? Why is it important?

**Answer:**
Encapsulation is the bundling of data (attributes) and methods that operate on that data within a single unit (class), while hiding the internal state from outside access.

**Benefits:**

1. **Data Protection**: Prevents unauthorized access
2. **Modularity**: Changes to internal implementation don't affect external code
3. **Maintainability**: Easier to modify and debug
4. **Flexibility**: Can change internal implementation without breaking client code
5. **Reusability**: Well-encapsulated classes are easier to reuse

**Example (TypeScript):**

```typescript
class Employee {
  private _salary: number;
  private _name: string;

  constructor(name: string, salary: number) {
    this._name = name;
    this._salary = salary;
  }

  // Getter - controlled access
  get salary(): number {
    return this._salary;
  }

  // Setter - with validation
  set salary(value: number) {
    if (value < 0) {
      throw new Error("Salary cannot be negative");
    }
    this._salary = value;
  }

  // Method using private data
  public giveRaise(percentage: number): void {
    this._salary += this._salary * (percentage / 100);
  }

  public getDetails(): string {
    return `${this._name} earns $${this._salary}`;
  }
}

const emp = new Employee("John", 50000);
console.log(emp.salary); // 50000
emp.salary = 55000; // Controlled modification
emp.giveRaise(10); // Using public method
// emp._salary = -1000; // Error: Property '_salary' is private
```

---

### Q6: What are access modifiers? Explain each type.

**Answer:**
Access modifiers control the visibility and accessibility of class members (properties and methods).

**Types:**

1. **Public**

   - Accessible from anywhere
   - No restrictions
   - Default in many languages

2. **Private**

   - Accessible only within the class
   - Not inherited
   - Strongest encapsulation

3. **Protected**

   - Accessible within the class and its subclasses
   - Not accessible from outside
   - Balance between private and public

4. **Package/Internal** (language-specific)
   - Accessible within the same package/module
   - Used for internal implementation

**Example (TypeScript):**

```typescript
class Vehicle {
  public brand: string; // Accessible everywhere
  protected year: number; // Accessible in class and subclasses
  private mileage: number; // Accessible only in this class

  constructor(brand: string, year: number, mileage: number) {
    this.brand = brand;
    this.year = year;
    this.mileage = mileage;
  }

  public getInfo(): string {
    return `${this.brand} (${this.year}) - ${this.mileage} miles`;
  }

  private updateMileage(miles: number): void {
    this.mileage += miles;
  }

  public drive(miles: number): void {
    this.updateMileage(miles); // Private method called internally
  }
}

class Car extends Vehicle {
  private doors: number;

  constructor(brand: string, year: number, mileage: number, doors: number) {
    super(brand, year, mileage);
    this.doors = doors;
  }

  public getCarInfo(): string {
    // Can access public and protected
    return `${this.brand} (${this.year}) with ${this.doors} doors`;
    // Cannot access private: this.mileage would cause error
  }
}

const car = new Car("Honda", 2020, 15000, 4);
console.log(car.brand); // OK - public
// console.log(car.year);    // Error - protected
// console.log(car.mileage); // Error - private
```

---

## Inheritance

### Q7: What is inheritance? What are its benefits?

**Answer:**
Inheritance is a mechanism where a new class (child/derived/subclass) derives properties and methods from an existing class (parent/base/superclass).

**Benefits:**

1. **Code Reusability**: Avoid duplicating code
2. **Extensibility**: Easily extend existing functionality
3. **Hierarchical Classification**: Natural way to model relationships
4. **Polymorphism**: Enables method overriding
5. **Maintainability**: Changes in base class automatically propagate

**Types of Inheritance:**

- Single: One child, one parent
- Multilevel: Chain of inheritance (A → B → C)
- Hierarchical: Multiple children from one parent
- Multiple: One child, multiple parents (not supported in all languages)

**Example (TypeScript):**

```typescript
// Base class
class Animal {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public eat(): void {
    console.log(`${this.name} is eating`);
  }

  public sleep(): void {
    console.log(`${this.name} is sleeping`);
  }

  public getInfo(): string {
    return `${this.name}, ${this.age} years old`;
  }
}

// Derived class
class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  // New method specific to Dog
  public bark(): void {
    console.log(`${this.name} says: Woof! Woof!`);
  }

  // Override parent method
  public getInfo(): string {
    return `${super.getInfo()}, Breed: ${this.breed}`;
  }
}

// Another derived class
class Cat extends Animal {
  private indoor: boolean;

  constructor(name: string, age: number, indoor: boolean) {
    super(name, age);
    this.indoor = indoor;
  }

  public meow(): void {
    console.log(`${this.name} says: Meow!`);
  }

  public getInfo(): string {
    const location = this.indoor ? "indoor" : "outdoor";
    return `${super.getInfo()}, ${location} cat`;
  }
}

const dog = new Dog("Buddy", 3, "Golden Retriever");
dog.eat(); // Inherited method
dog.bark(); // Dog-specific method
console.log(dog.getInfo()); // Overridden method

const cat = new Cat("Whiskers", 2, true);
cat.sleep(); // Inherited method
cat.meow(); // Cat-specific method
console.log(cat.getInfo());
```

---

### Q8: What is the difference between inheritance and composition?

**Answer:**

**Inheritance ("is-a" relationship):**

- Subclass inherits from superclass
- Tight coupling
- Compile-time relationship
- Example: Dog is an Animal

**Composition ("has-a" relationship):**

- Object contains other objects
- Loose coupling
- Runtime flexibility
- Example: Car has an Engine

**When to use:**

- Use inheritance for true "is-a" relationships
- Prefer composition for flexibility and reusability
- Composition over inheritance is a common principle

**Example (TypeScript):**

```typescript
// INHERITANCE APPROACH
class Vehicle {
  protected speed: number = 0;

  public accelerate(): void {
    this.speed += 10;
  }
}

class Car extends Vehicle {
  private brand: string;

  constructor(brand: string) {
    super();
    this.brand = brand;
  }
}

// COMPOSITION APPROACH
class Engine {
  private horsepower: number;

  constructor(horsepower: number) {
    this.horsepower = horsepower;
  }

  public start(): void {
    console.log(`Engine started with ${this.horsepower} HP`);
  }
}

class Transmission {
  private type: string;

  constructor(type: string) {
    this.type = type;
  }

  public shift(gear: number): void {
    console.log(`Shifted to gear ${gear} (${this.type})`);
  }
}

class ModernCar {
  private brand: string;
  private engine: Engine; // HAS-A relationship
  private transmission: Transmission; // HAS-A relationship

  constructor(brand: string, engine: Engine, transmission: Transmission) {
    this.brand = brand;
    this.engine = engine;
    this.transmission = transmission;
  }

  public start(): void {
    this.engine.start();
  }

  public drive(): void {
    this.start();
    this.transmission.shift(1);
    console.log(`${this.brand} is driving`);
  }

  // Can easily replace engine or transmission
  public replaceEngine(newEngine: Engine): void {
    this.engine = newEngine;
  }
}

const engine = new Engine(300);
const transmission = new Transmission("Automatic");
const car = new ModernCar("Tesla", engine, transmission);
car.drive();

// Easy to change behavior by replacing components
const sportEngine = new Engine(500);
car.replaceEngine(sportEngine);
```

---

## Polymorphism

### Q9: What is polymorphism? Explain its types.

**Answer:**
Polymorphism means "many forms." It allows objects of different classes to be treated as objects of a common parent class while maintaining their own specific behavior.

**Types:**

1. **Compile-time Polymorphism (Static/Early Binding)**

   - Method Overloading: Same name, different parameters
   - Operator Overloading: Redefining operator behavior
   - Resolved at compile time

2. **Runtime Polymorphism (Dynamic/Late Binding)**
   - Method Overriding: Subclass provides specific implementation
   - Resolved at runtime based on object type

**Benefits:**

- Code flexibility and reusability
- Easier maintenance
- Extensibility without modifying existing code

**Example (TypeScript):**

```typescript
// Runtime Polymorphism - Method Overriding
abstract class Shape {
  abstract calculateArea(): number;
  abstract calculatePerimeter(): number;

  public describe(): void {
    console.log(
      `Area: ${this.calculateArea()}, Perimeter: ${this.calculatePerimeter()}`
    );
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Triangle extends Shape {
  constructor(private a: number, private b: number, private c: number) {
    super();
  }

  calculateArea(): number {
    const s = (this.a + this.b + this.c) / 2;
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }

  calculatePerimeter(): number {
    return this.a + this.b + this.c;
  }
}

// Polymorphic behavior
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4, 5),
];

shapes.forEach((shape) => {
  shape.describe(); // Same method, different behavior
});

// Compile-time Polymorphism - Method Overloading (simulated in TypeScript)
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number[], b: number[]): number[];
  add(a: any, b: any): any {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
      return a + b;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.add("Hello", " World")); // "Hello World"
console.log(calc.add([1, 2], [3, 4])); // [1, 2, 3, 4]
```

---

### Q10: What is method overriding vs method overloading?

**Answer:**

**Method Overriding:**

- Same method name and parameters in parent and child class
- Child class provides specific implementation
- Runtime polymorphism
- Must have inheritance relationship

**Method Overloading:**

- Same method name, different parameters
- Within the same class or across inheritance
- Compile-time polymorphism
- No inheritance required

**Example (TypeScript):**

```typescript
// Method Overriding
class Payment {
  public processPayment(amount: number): void {
    console.log(`Processing payment of $${amount}`);
  }
}

class CreditCardPayment extends Payment {
  // Override parent method
  public processPayment(amount: number): void {
    console.log(`Processing credit card payment of $${amount}`);
    console.log("Verifying card...");
    console.log("Payment successful");
  }
}

class PayPalPayment extends Payment {
  // Override parent method
  public processPayment(amount: number): void {
    console.log(`Processing PayPal payment of $${amount}`);
    console.log("Redirecting to PayPal...");
    console.log("Payment successful");
  }
}

const payments: Payment[] = [new CreditCardPayment(), new PayPalPayment()];

payments.forEach((payment) => payment.processPayment(100));

// Method Overloading (TypeScript style)
class Printer {
  print(value: string): void;
  print(value: number): void;
  print(value: boolean): void;
  print(values: string[]): void;
  print(value: any): void {
    if (typeof value === "string") {
      console.log(`Printing string: ${value}`);
    } else if (typeof value === "number") {
      console.log(`Printing number: ${value}`);
    } else if (typeof value === "boolean") {
      console.log(`Printing boolean: ${value}`);
    } else if (Array.isArray(value)) {
      console.log(`Printing array: ${value.join(", ")}`);
    }
  }
}

const printer = new Printer();
printer.print("Hello"); // String
printer.print(42); // Number
printer.print(true); // Boolean
printer.print(["A", "B", "C"]); // Array
```

---

## Abstraction

### Q11: What is abstraction? How is it achieved?

**Answer:**
Abstraction is the process of hiding complex implementation details and showing only the essential features of an object. It focuses on what an object does rather than how it does it.

**Ways to Achieve Abstraction:**

1. **Abstract Classes**: Cannot be instantiated, may have abstract and concrete methods
2. **Interfaces**: Contract that defines method signatures without implementation

**Benefits:**

- Reduces complexity
- Increases security
- Enhances maintainability
- Focuses on essential qualities

**Example (TypeScript):**

```typescript
// Using Abstract Class
abstract class Database {
  // Abstract methods - must be implemented by subclasses
  abstract connect(): void;
  abstract disconnect(): void;
  abstract query(sql: string): any;

  // Concrete method - shared implementation
  public executeQuery(sql: string): void {
    this.connect();
    const result = this.query(sql);
    this.disconnect();
    console.log("Query executed");
  }
}

class MySQLDatabase extends Database {
  connect(): void {
    console.log("Connecting to MySQL...");
  }

  disconnect(): void {
    console.log("Disconnecting from MySQL");
  }

  query(sql: string): any {
    console.log(`Executing MySQL query: ${sql}`);
    return { rows: [] };
  }
}

class PostgreSQLDatabase extends Database {
  connect(): void {
    console.log("Connecting to PostgreSQL...");
  }

  disconnect(): void {
    console.log("Disconnecting from PostgreSQL");
  }

  query(sql: string): any {
    console.log(`Executing PostgreSQL query: ${sql}`);
    return { rows: [] };
  }
}

// Using Interface
interface PaymentProcessor {
  validatePayment(): boolean;
  processTransaction(amount: number): boolean;
  sendConfirmation(): void;
}

class StripePayment implements PaymentProcessor {
  validatePayment(): boolean {
    console.log("Validating with Stripe");
    return true;
  }

  processTransaction(amount: number): boolean {
    console.log(`Processing $${amount} via Stripe`);
    return true;
  }

  sendConfirmation(): void {
    console.log("Sending Stripe confirmation email");
  }
}

class SquarePayment implements PaymentProcessor {
  validatePayment(): boolean {
    console.log("Validating with Square");
    return true;
  }

  processTransaction(amount: number): boolean {
    console.log(`Processing $${amount} via Square`);
    return true;
  }

  sendConfirmation(): void {
    console.log("Sending Square confirmation SMS");
  }
}

// Client code works with abstractions
function processPayment(processor: PaymentProcessor, amount: number): void {
  if (processor.validatePayment()) {
    if (processor.processTransaction(amount)) {
      processor.sendConfirmation();
    }
  }
}

const stripeProcessor = new StripePayment();
const squareProcessor = new SquarePayment();

processPayment(stripeProcessor, 100);
processPayment(squareProcessor, 200);
```

---

### Q12: What is the difference between abstract class and interface?

**Answer:**

| Aspect                   | Abstract Class                         | Interface                                                 |
| ------------------------ | -------------------------------------- | --------------------------------------------------------- |
| **Instantiation**        | Cannot be instantiated                 | Cannot be instantiated                                    |
| **Methods**              | Can have abstract and concrete methods | Only method signatures (TypeScript allows implementation) |
| **Fields**               | Can have fields                        | No fields (TypeScript allows properties)                  |
| **Constructor**          | Can have constructor                   | No constructor                                            |
| **Access Modifiers**     | Can use all modifiers                  | All members are public                                    |
| **Multiple Inheritance** | Single inheritance                     | Can implement multiple interfaces                         |
| **Purpose**              | Partial implementation                 | Pure contract                                             |
| **When to Use**          | Common base class with shared code     | Define capabilities/contracts                             |

**Example (TypeScript):**

```typescript
// Abstract Class
abstract class Employee {
  protected name: string;
  protected id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  // Concrete method
  public getDetails(): string {
    return `${this.name} (ID: ${this.id})`;
  }

  // Abstract method - must be implemented
  abstract calculateSalary(): number;
  abstract getRole(): string;
}

// Interface
interface Workable {
  work(): void;
  takeBreak(): void;
}

interface Trainable {
  attendTraining(course: string): void;
}

// Class implementing interface and extending abstract class
class FullTimeEmployee extends Employee implements Workable, Trainable {
  private monthlySalary: number;

  constructor(name: string, id: number, monthlySalary: number) {
    super(name, id);
    this.monthlySalary = monthlySalary;
  }

  calculateSalary(): number {
    return this.monthlySalary;
  }

  getRole(): string {
    return "Full-Time Employee";
  }

  work(): void {
    console.log(`${this.name} is working full-time`);
  }

  takeBreak(): void {
    console.log(`${this.name} is taking a break`);
  }

  attendTraining(course: string): void {
    console.log(`${this.name} is attending ${course} training`);
  }
}

class Contractor extends Employee implements Workable {
  private hourlyRate: number;
  private hoursWorked: number;

  constructor(
    name: string,
    id: number,
    hourlyRate: number,
    hoursWorked: number
  ) {
    super(name, id);
    this.hourlyRate = hourlyRate;
    this.hoursWorked = hoursWorked;
  }

  calculateSalary(): number {
    return this.hourlyRate * this.hoursWorked;
  }

  getRole(): string {
    return "Contractor";
  }

  work(): void {
    console.log(`${this.name} is working as contractor`);
  }

  takeBreak(): void {
    console.log(`${this.name} is taking a short break`);
  }
}

const emp1 = new FullTimeEmployee("Alice", 1, 5000);
const emp2 = new Contractor("Bob", 2, 50, 160);

console.log(emp1.getDetails());
console.log(`Salary: $${emp1.calculateSalary()}`);
emp1.work();
emp1.attendTraining("TypeScript");

console.log(emp2.getDetails());
console.log(`Salary: $${emp2.calculateSalary()}`);
emp2.work();
```

---

## Practical Examples

### Q13: Design a class hierarchy for a library management system.

**Answer:**

```typescript
// Base class
abstract class LibraryItem {
  protected id: string;
  protected title: string;
  protected available: boolean;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
    this.available = true;
  }

  public borrow(): boolean {
    if (this.available) {
      this.available = false;
      console.log(`${this.title} has been borrowed`);
      return true;
    }
    console.log(`${this.title} is not available`);
    return false;
  }

  public returnItem(): void {
    this.available = true;
    console.log(`${this.title} has been returned`);
  }

  public isAvailable(): boolean {
    return this.available;
  }

  abstract getDetails(): string;
  abstract getDueDate(): number; // days until due
}

class Book extends LibraryItem {
  private author: string;
  private isbn: string;
  private pages: number;

  constructor(
    id: string,
    title: string,
    author: string,
    isbn: string,
    pages: number
  ) {
    super(id, title);
    this.author = author;
    this.isbn = isbn;
    this.pages = pages;
  }

  getDetails(): string {
    return `Book: ${this.title} by ${this.author} (ISBN: ${this.isbn}, ${this.pages} pages)`;
  }

  getDueDate(): number {
    return 14; // 2 weeks
  }
}

class Magazine extends LibraryItem {
  private issue: string;
  private publisher: string;

  constructor(id: string, title: string, issue: string, publisher: string) {
    super(id, title);
    this.issue = issue;
    this.publisher = publisher;
  }

  getDetails(): string {
    return `Magazine: ${this.title} ${this.issue} by ${this.publisher}`;
  }

  getDueDate(): number {
    return 7; // 1 week
  }
}

class DVD extends LibraryItem {
  private director: string;
  private duration: number; // in minutes

  constructor(id: string, title: string, director: string, duration: number) {
    super(id, title);
    this.director = director;
    this.duration = duration;
  }

  getDetails(): string {
    return `DVD: ${this.title} directed by ${this.director} (${this.duration} min)`;
  }

  getDueDate(): number {
    return 3; // 3 days
  }
}

class Member {
  private id: string;
  private name: string;
  private borrowedItems: LibraryItem[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.borrowedItems = [];
  }

  public borrowItem(item: LibraryItem): void {
    if (item.borrow()) {
      this.borrowedItems.push(item);
      console.log(`${this.name} borrowed: ${item.getDetails()}`);
      console.log(`Due in ${item.getDueDate()} days`);
    }
  }

  public returnItem(item: LibraryItem): void {
    const index = this.borrowedItems.indexOf(item);
    if (index > -1) {
      this.borrowedItems.splice(index, 1);
      item.returnItem();
      console.log(`${this.name} returned: ${item.getDetails()}`);
    }
  }

  public getBorrowedItems(): string[] {
    return this.borrowedItems.map((item) => item.getDetails());
  }
}

class Library {
  private items: LibraryItem[];
  private members: Member[];

  constructor() {
    this.items = [];
    this.members = [];
  }

  public addItem(item: LibraryItem): void {
    this.items.push(item);
  }

  public registerMember(member: Member): void {
    this.members.push(member);
  }

  public searchAvailableItems(): LibraryItem[] {
    return this.items.filter((item) => item.isAvailable());
  }
}

// Usage
const library = new Library();

const book1 = new Book(
  "B001",
  "Clean Code",
  "Robert Martin",
  "978-0132350884",
  464
);
const magazine1 = new Magazine(
  "M001",
  "National Geographic",
  "January 2024",
  "National Geographic Society"
);
const dvd1 = new DVD("D001", "The Matrix", "Wachowskis", 136);

library.addItem(book1);
library.addItem(magazine1);
library.addItem(dvd1);

const member1 = new Member("MEM001", "John Doe");
library.registerMember(member1);

member1.borrowItem(book1);
member1.borrowItem(magazine1);
console.log("Borrowed items:", member1.getBorrowedItems());

member1.returnItem(book1);
```

---

### Q14: Implement a banking system with different account types.

**Answer:**

```typescript
interface Transaction {
  date: Date;
  type: string;
  amount: number;
  balance: number;
}

abstract class Account {
  protected accountNumber: string;
  protected balance: number;
  protected transactions: Transaction[];

  constructor(accountNumber: string, initialDeposit: number = 0) {
    this.accountNumber = accountNumber;
    this.balance = initialDeposit;
    this.transactions = [];

    if (initialDeposit > 0) {
      this.addTransaction("Initial Deposit", initialDeposit);
    }
  }

  protected addTransaction(type: string, amount: number): void {
    this.transactions.push({
      date: new Date(),
      type,
      amount,
      balance: this.balance,
    });
  }

  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount;
    this.addTransaction("Deposit", amount);
    console.log(`Deposited $${amount}. New balance: $${this.balance}`);
  }

  public getBalance(): number {
    return this.balance;
  }

  public getTransactionHistory(): Transaction[] {
    return [...this.transactions];
  }

  abstract withdraw(amount: number): void;
  abstract getAccountType(): string;
}

class SavingsAccount extends Account {
  private interestRate: number;
  private withdrawalLimit: number;
  private withdrawalCount: number;

  constructor(
    accountNumber: string,
    initialDeposit: number,
    interestRate: number = 0.02
  ) {
    super(accountNumber, initialDeposit);
    this.interestRate = interestRate;
    this.withdrawalLimit = 6; // Federal regulation
    this.withdrawalCount = 0;
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    if (this.withdrawalCount >= this.withdrawalLimit) {
      throw new Error("Monthly withdrawal limit exceeded");
    }

    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }

    this.balance -= amount;
    this.withdrawalCount++;
    this.addTransaction("Withdrawal", -amount);
    console.log(`Withdrew $${amount}. New balance: $${this.balance}`);
  }

  public addInterest(): void {
    const interest = this.balance * this.interestRate;
    this.balance += interest;
    this.addTransaction("Interest", interest);
    console.log(`Interest added: $${interest.toFixed(2)}`);
  }

  public resetMonthlyLimit(): void {
    this.withdrawalCount = 0;
  }

  getAccountType(): string {
    return "Savings Account";
  }
}

class CheckingAccount extends Account {
  private overdraftLimit: number;

  constructor(
    accountNumber: string,
    initialDeposit: number,
    overdraftLimit: number = 500
  ) {
    super(accountNumber, initialDeposit);
    this.overdraftLimit = overdraftLimit;
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    const availableBalance = this.balance + this.overdraftLimit;

    if (amount > availableBalance) {
      throw new Error(`Insufficient funds. Available: $${availableBalance}`);
    }

    this.balance -= amount;
    this.addTransaction("Withdrawal", -amount);

    if (this.balance < 0) {
      console.log(
        `Withdrew $${amount}. WARNING: Overdraft balance: $${this.balance}`
      );
    } else {
      console.log(`Withdrew $${amount}. New balance: $${this.balance}`);
    }
  }

  public getAvailableBalance(): number {
    return this.balance + this.overdraftLimit;
  }

  getAccountType(): string {
    return "Checking Account";
  }
}

class Customer {
  private name: string;
  private customerId: string;
  private accounts: Account[];

  constructor(name: string, customerId: string) {
    this.name = name;
    this.customerId = customerId;
    this.accounts = [];
  }

  public addAccount(account: Account): void {
    this.accounts.push(account);
  }

  public getTotalBalance(): number {
    return this.accounts.reduce(
      (total, account) => total + account.getBalance(),
      0
    );
  }

  public getAccountSummary(): void {
    console.log(`\nCustomer: ${this.name} (ID: ${this.customerId})`);
    console.log("Accounts:");
    this.accounts.forEach((account, index) => {
      console.log(
        `  ${index + 1}. ${account.getAccountType()}: $${account.getBalance()}`
      );
    });
    console.log(`Total Balance: $${this.getTotalBalance()}\n`);
  }
}

// Usage
const customer = new Customer("Alice Johnson", "C001");

const savings = new SavingsAccount("SA001", 1000, 0.03);
const checking = new CheckingAccount("CA001", 500, 300);

customer.addAccount(savings);
customer.addAccount(checking);

customer.getAccountSummary();

savings.deposit(500);
savings.addInterest();

checking.withdraw(700); // Goes into overdraft
checking.deposit(1000);

customer.getAccountSummary();

console.log("\nSavings Transaction History:");
savings.getTransactionHistory().forEach((t) => {
  console.log(
    `${t.date.toISOString()} - ${t.type}: $${t.amount.toFixed(
      2
    )} (Balance: $${t.balance.toFixed(2)})`
  );
});
```

---

## Additional Questions

### Q15: What is a static member? When would you use it?

**Answer:**
Static members belong to the class itself rather than to instances. They are shared across all instances.

**Use Cases:**

- Utility functions
- Constants
- Factory methods
- Counters/shared state

**Example:**

```typescript
class MathUtils {
  static readonly PI = 3.14159;
  private static instanceCount = 0;

  constructor() {
    MathUtils.instanceCount++;
  }

  static square(x: number): number {
    return x * x;
  }

  static getInstanceCount(): number {
    return MathUtils.instanceCount;
  }
}

console.log(MathUtils.PI);
console.log(MathUtils.square(5)); // 25

const m1 = new MathUtils();
const m2 = new MathUtils();
console.log(MathUtils.getInstanceCount()); // 2
```

### Q16: Explain the concept of "this" keyword.

**Answer:**
The `this` keyword refers to the current object instance. Its value depends on how a method is called.

**Example:**

```typescript
class Person {
  constructor(private name: string) {}

  public greet(): void {
    console.log(`Hello, I'm ${this.name}`);
  }

  public delayedGreet(): void {
    // Arrow function preserves 'this' context
    setTimeout(() => {
      console.log(`Hello, I'm ${this.name}`);
    }, 1000);
  }
}

const person = new Person("Alice");
person.greet(); // Works correctly

const greet = person.greet;
// greet(); // Would fail - 'this' context lost

const boundGreet = person.greet.bind(person);
boundGreet(); // Works - 'this' is bound
```

---

This covers the fundamental OOP concepts commonly asked in interviews. Practice implementing these concepts and be prepared to explain them clearly with examples!
