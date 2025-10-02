/**
 * Classes and Objects - Fundamental OOP Concepts
 * This file demonstrates basic class creation, objects, constructors, and methods
 */

// ============================================
// BASIC CLASS AND OBJECT
// ============================================

class Person {
  // Properties
  name: string;
  age: number;
  email: string;

  // Constructor
  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  // Method
  introduce(): void {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old.`);
  }

  // Method with return value
  getContactInfo(): string {
    return `${this.name} - ${this.email}`;
  }

  // Method that modifies state
  celebrateBirthday(): void {
    this.age++;
    console.log(`Happy birthday! Now ${this.age} years old.`);
  }
}

// Creating objects
const person1 = new Person("Alice", 30, "alice@example.com");
const person2 = new Person("Bob", 25, "bob@example.com");

person1.introduce();
person2.introduce();

console.log(person1.getContactInfo());
person1.celebrateBirthday();

// ============================================
// ACCESS MODIFIERS
// ============================================

class BankAccount {
  public accountNumber: string; // Accessible everywhere
  private balance: number; // Only within this class
  protected interestRate: number; // Within class and subclasses

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.interestRate = 0.02;
  }

  // Public method to access private property
  public getBalance(): number {
    return this.balance;
  }

  // Public method to modify private property
  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited $${amount}. New balance: $${this.balance}`);
    }
  }

  public withdraw(amount: number): boolean {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrew $${amount}. New balance: $${this.balance}`);
      return true;
    }
    console.log("Insufficient funds or invalid amount");
    return false;
  }

  // Protected method
  protected calculateInterest(): number {
    return this.balance * this.interestRate;
  }

  public applyInterest(): void {
    const interest = this.calculateInterest();
    this.balance += interest;
    console.log(`Interest applied: $${interest.toFixed(2)}`);
  }
}

const account = new BankAccount("ACC001", 1000);
console.log(`Account: ${account.accountNumber}`);
console.log(`Balance: $${account.getBalance()}`);
account.deposit(500);
account.withdraw(200);
account.applyInterest();
// account.balance = 10000; // Error: Property 'balance' is private

// ============================================
// CONSTRUCTOR PARAMETER PROPERTIES
// ============================================

// TypeScript shorthand for declaring and initializing properties
class Product {
  constructor(
    public id: string,
    public name: string,
    private price: number,
    public inStock: boolean = true
  ) {}

  public getPrice(): number {
    return this.price;
  }

  public setPrice(newPrice: number): void {
    if (newPrice > 0) {
      this.price = newPrice;
    }
  }

  public getPriceWithTax(taxRate: number = 0.1): number {
    return this.price * (1 + taxRate);
  }

  public displayInfo(): void {
    const status = this.inStock ? "In Stock" : "Out of Stock";
    console.log(`${this.name} (ID: ${this.id}) - $${this.price} - ${status}`);
  }
}

const laptop = new Product("P001", "Laptop", 999.99);
laptop.displayInfo();
console.log(`Price with tax: $${laptop.getPriceWithTax().toFixed(2)}`);

// ============================================
// GETTERS AND SETTERS
// ============================================

class Employee {
  private _salary: number;
  private _name: string;

  constructor(name: string, salary: number) {
    this._name = name;
    this._salary = salary;
  }

  // Getter
  get name(): string {
    return this._name;
  }

  // Setter with validation
  set name(value: string) {
    if (value.length >= 2) {
      this._name = value;
    } else {
      throw new Error("Name must be at least 2 characters");
    }
  }

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value >= 0) {
      this._salary = value;
    } else {
      throw new Error("Salary cannot be negative");
    }
  }

  // Computed property using getter
  get annualSalary(): number {
    return this._salary * 12;
  }

  get formattedSalary(): string {
    return `$${this._salary.toLocaleString()}`;
  }
}

const employee = new Employee("John Doe", 5000);
console.log(employee.name); // Using getter
console.log(employee.salary); // Using getter
console.log(employee.annualSalary); // Computed property

employee.salary = 5500; // Using setter
console.log(employee.formattedSalary);

// ============================================
// STATIC MEMBERS
// ============================================

class MathUtils {
  // Static property
  static readonly PI = 3.14159265359;
  static readonly E = 2.71828182846;

  // Instance counter
  private static instanceCount = 0;

  constructor() {
    MathUtils.instanceCount++;
  }

  // Static method
  static square(x: number): number {
    return x * x;
  }

  static cube(x: number): number {
    return x * x * x;
  }

  static max(a: number, b: number): number {
    return a > b ? a : b;
  }

  static min(a: number, b: number): number {
    return a < b ? a : b;
  }

  static getInstanceCount(): number {
    return MathUtils.instanceCount;
  }

  // Instance method can access static members
  getPi(): number {
    return MathUtils.PI;
  }
}

// Using static members without creating instance
console.log(`PI: ${MathUtils.PI}`);
console.log(`Square of 5: ${MathUtils.square(5)}`);
console.log(`Cube of 3: ${MathUtils.cube(3)}`);
console.log(`Max(10, 20): ${MathUtils.max(10, 20)}`);

const math1 = new MathUtils();
const math2 = new MathUtils();
console.log(`Instances created: ${MathUtils.getInstanceCount()}`);

// ============================================
// READONLY PROPERTIES
// ============================================

class Car {
  readonly vin: string; // Vehicle Identification Number
  readonly manufacturer: string;
  private _mileage: number;

  constructor(vin: string, manufacturer: string, mileage: number = 0) {
    this.vin = vin;
    this.manufacturer = manufacturer;
    this._mileage = mileage;
  }

  get mileage(): number {
    return this._mileage;
  }

  drive(miles: number): void {
    this._mileage += miles;
    console.log(`Drove ${miles} miles. Total mileage: ${this._mileage}`);
  }

  displayInfo(): void {
    console.log(
      `${this.manufacturer} - VIN: ${this.vin}, Mileage: ${this._mileage}`
    );
  }
}

const car = new Car("1HGBH41JXMN109186", "Honda", 50000);
car.displayInfo();
car.drive(100);
// car.vin = "different"; // Error: Cannot assign to 'vin' because it is a read-only property

// ============================================
// OPTIONAL PROPERTIES AND PARAMETERS
// ============================================

class User {
  name: string;
  email: string;
  age?: number; // Optional property
  address?: string;

  constructor(name: string, email: string, age?: number, address?: string) {
    this.name = name;
    this.email = email;
    this.age = age;
    this.address = address;
  }

  getProfile(): string {
    let profile = `Name: ${this.name}, Email: ${this.email}`;
    if (this.age !== undefined) {
      profile += `, Age: ${this.age}`;
    }
    if (this.address) {
      profile += `, Address: ${this.address}`;
    }
    return profile;
  }
}

const user1 = new User("Alice", "alice@example.com");
const user2 = new User("Bob", "bob@example.com", 30);
const user3 = new User("Charlie", "charlie@example.com", 25, "123 Main St");

console.log(user1.getProfile());
console.log(user2.getProfile());
console.log(user3.getProfile());

// ============================================
// METHOD OVERLOADING (TypeScript style)
// ============================================

class Calculator {
  // Overload signatures
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number[], b: number[]): number[];

  // Implementation
  add(a: any, b: any): any {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
      return a + b;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }
  }

  // Another overloaded method
  multiply(a: number, b: number): number;
  multiply(a: number, b: number, c: number): number;
  multiply(a: number, b: number, c?: number): number {
    if (c !== undefined) {
      return a * b * c;
    }
    return a * b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.add("Hello", " World")); // "Hello World"
console.log(calc.add([1, 2], [3, 4])); // [1, 2, 3, 4]
console.log(calc.multiply(2, 3)); // 6
console.log(calc.multiply(2, 3, 4)); // 24

// ============================================
// THIS KEYWORD
// ============================================

class Counter {
  private count = 0;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    this.count--;
  }

  getCount(): number {
    return this.count;
  }

  // Arrow function preserves 'this' context
  incrementAsync = (): void => {
    setTimeout(() => {
      this.count++;
      console.log(`Async count: ${this.count}`);
    }, 1000);
  };

  // Regular function loses 'this' context in callbacks
  incrementAsyncBad(): void {
    setTimeout(function (this: Counter) {
      // 'this' would be undefined without binding
      // this.count++; // Would cause error
    }, 1000);
  }
}

const counter = new Counter();
counter.increment();
counter.increment();
console.log(`Count: ${counter.getCount()}`);

// Arrow function preserves context
counter.incrementAsync();

// ============================================
// OBJECT COMPOSITION
// ============================================

class Address2 {
  constructor(
    public street: string,
    public city: string,
    public zipCode: string
  ) {}

  getFullAddress(): string {
    return `${this.street}, ${this.city} ${this.zipCode}`;
  }
}

class ContactInfo {
  constructor(public email: string, public phone: string) {}

  getContactString(): string {
    return `Email: ${this.email}, Phone: ${this.phone}`;
  }
}

class Customer {
  constructor(
    public name: string,
    public address: Address2,
    public contact: ContactInfo
  ) {}

  getFullInfo(): string {
    return `
      Name: ${this.name}
      Address: ${this.address.getFullAddress()}
      Contact: ${this.contact.getContactString()}
    `.trim();
  }
}

const customerAddress = new Address2("123 Main St", "New York", "10001");
const customerContact = new ContactInfo("customer@example.com", "555-1234");
const customer = new Customer("Jane Doe", customerAddress, customerContact);

console.log(customer.getFullInfo());

// ============================================
// EXPORT FOR MODULE USAGE
// ============================================

export {
  Person,
  BankAccount,
  Product,
  Employee,
  MathUtils,
  Car,
  User,
  Calculator,
  Counter,
  Customer,
  Address2,
  ContactInfo,
};

console.log("\n✅ All classes and objects examples completed!");
