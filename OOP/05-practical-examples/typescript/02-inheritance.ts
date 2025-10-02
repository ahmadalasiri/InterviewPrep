/**
 * Inheritance - Code Reusability and Hierarchies
 * This file demonstrates inheritance, method overriding, super keyword, and inheritance hierarchies
 */

// ============================================
// BASIC INHERITANCE
// ============================================

class Animal {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  makeSound(): void {
    console.log("Some generic animal sound");
  }

  eat(): void {
    console.log(`${this.name} is eating`);
  }

  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }

  getInfo(): string {
    return `${this.name}, ${this.age} years old`;
  }
}

class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  // Override parent method
  makeSound(): void {
    console.log(`${this.name} says: Woof! Woof!`);
  }

  // New method specific to Dog
  fetch(): void {
    console.log(`${this.name} is fetching the ball`);
  }

  // Override with extended functionality
  getInfo(): string {
    return `${super.getInfo()}, Breed: ${this.breed}`;
  }
}

class Cat extends Animal {
  private indoor: boolean;

  constructor(name: string, age: number, indoor: boolean) {
    super(name, age);
    this.indoor = indoor;
  }

  makeSound(): void {
    console.log(`${this.name} says: Meow!`);
  }

  scratch(): void {
    console.log(`${this.name} is scratching`);
  }

  getInfo(): string {
    const location = this.indoor ? "indoor" : "outdoor";
    return `${super.getInfo()}, ${location} cat`;
  }
}

// Usage
const dog = new Dog("Buddy", 3, "Golden Retriever");
dog.makeSound();
dog.eat();
dog.fetch();
console.log(dog.getInfo());

const cat = new Cat("Whiskers", 2, true);
cat.makeSound();
cat.scratch();
console.log(cat.getInfo());

// ============================================
// MULTILEVEL INHERITANCE
// ============================================

class Vehicle {
  protected brand: string;
  protected year: number;

  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }

  start(): void {
    console.log(`${this.brand} vehicle started`);
  }

  stop(): void {
    console.log(`${this.brand} vehicle stopped`);
  }

  getAge(): number {
    return new Date().getFullYear() - this.year;
  }
}

class Car2 extends Vehicle {
  protected doors: number;
  protected fuelType: string;

  constructor(brand: string, year: number, doors: number, fuelType: string) {
    super(brand, year);
    this.doors = doors;
    this.fuelType = fuelType;
  }

  drive(): void {
    console.log(`Driving ${this.brand} car`);
  }

  refuel(): void {
    console.log(`Refueling with ${this.fuelType}`);
  }
}

class ElectricCar extends Car2 {
  private batteryCapacity: number;

  constructor(
    brand: string,
    year: number,
    doors: number,
    batteryCapacity: number
  ) {
    super(brand, year, doors, "Electric");
    this.batteryCapacity = batteryCapacity;
  }

  // Override refuel for electric cars
  refuel(): void {
    console.log(`Charging battery (${this.batteryCapacity} kWh)`);
  }

  checkBattery(): void {
    console.log(`Battery capacity: ${this.batteryCapacity} kWh`);
  }

  // Using methods from all levels
  displayFullInfo(): void {
    console.log(`${this.brand} Electric Car`);
    console.log(`Year: ${this.year} (${this.getAge()} years old)`);
    console.log(`Doors: ${this.doors}`);
    console.log(`Battery: ${this.batteryCapacity} kWh`);
  }
}

const tesla = new ElectricCar("Tesla", 2022, 4, 75);
tesla.start(); // From Vehicle
tesla.drive(); // From Car
tesla.refuel(); // Overridden in ElectricCar
tesla.checkBattery(); // From ElectricCar
tesla.displayFullInfo();

// ============================================
// ABSTRACT CLASSES
// ============================================

abstract class Shape {
  protected color: string;

  constructor(color: string) {
    this.color = color;
  }

  // Abstract methods - must be implemented by subclasses
  abstract calculateArea(): number;
  abstract calculatePerimeter(): number;

  // Concrete method - shared by all shapes
  describe(): void {
    console.log(`This is a ${this.color} shape`);
    console.log(`Area: ${this.calculateArea().toFixed(2)}`);
    console.log(`Perimeter: ${this.calculatePerimeter().toFixed(2)}`);
  }

  getColor(): string {
    return this.color;
  }

  setColor(color: string): void {
    this.color = color;
  }
}

class Circle extends Shape {
  private radius: number;

  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  getRadius(): number {
    return this.radius;
  }
}

class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(color: string, width: number, height: number) {
    super(color);
    this.width = width;
    this.height = height;
  }

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }

  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}

class Triangle extends Shape {
  private a: number;
  private b: number;
  private c: number;

  constructor(color: string, a: number, b: number, c: number) {
    super(color);
    this.a = a;
    this.b = b;
    this.c = c;
  }

  calculateArea(): number {
    const s = (this.a + this.b + this.c) / 2;
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }

  calculatePerimeter(): number {
    return this.a + this.b + this.c;
  }
}

// Polymorphism with abstract class
const shapes: Shape[] = [
  new Circle("red", 5),
  new Rectangle("blue", 4, 6),
  new Triangle("green", 3, 4, 5),
];

shapes.forEach((shape) => {
  shape.describe();
  console.log("---");
});

// ============================================
// PROTECTED MEMBERS
// ============================================

class BankAccount2 {
  protected accountNumber: string;
  protected balance: number;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }

  protected logTransaction(type: string, amount: number): void {
    console.log(`[${type}] Account ${this.accountNumber}: $${amount}`);
  }

  public getBalance(): number {
    return this.balance;
  }

  public deposit(amount: number): void {
    this.balance += amount;
    this.logTransaction("DEPOSIT", amount);
  }
}

class SavingsAccount extends BankAccount2 {
  private interestRate: number;

  constructor(
    accountNumber: string,
    initialBalance: number,
    interestRate: number
  ) {
    super(accountNumber, initialBalance);
    this.interestRate = interestRate;
  }

  // Can access protected members from parent
  public addInterest(): void {
    const interest = this.balance * this.interestRate;
    this.balance += interest;
    this.logTransaction("INTEREST", interest);
  }

  public getAccountDetails(): string {
    return `Account: ${this.accountNumber}, Balance: $${this.balance}, Rate: ${
      this.interestRate * 100
    }%`;
  }
}

const savings = new SavingsAccount("SA001", 1000, 0.05);
savings.deposit(500);
savings.addInterest();
console.log(savings.getAccountDetails());

// ============================================
// SUPER KEYWORD
// ============================================

class Employee2 {
  protected name: string;
  protected salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  work(): void {
    console.log(`${this.name} is working`);
  }

  getSalary(): number {
    return this.salary;
  }

  getDetails(): string {
    return `Employee: ${this.name}, Salary: $${this.salary}`;
  }
}

class Manager extends Employee2 {
  private teamSize: number;
  private bonus: number;

  constructor(name: string, salary: number, teamSize: number, bonus: number) {
    super(name, salary);
    this.teamSize = teamSize;
    this.bonus = bonus;
  }

  // Override with super
  work(): void {
    super.work(); // Call parent method
    console.log(`${this.name} is managing ${this.teamSize} team members`);
  }

  // Override with additional logic
  getSalary(): number {
    return super.getSalary() + this.bonus;
  }

  // Extend parent method
  getDetails(): string {
    return `${super.getDetails()}, Team Size: ${
      this.teamSize
    }, Total Comp: $${this.getSalary()}`;
  }

  conductMeeting(): void {
    console.log(`${this.name} is conducting a team meeting`);
  }
}

const manager = new Manager("Alice", 80000, 5, 20000);
manager.work();
console.log(manager.getDetails());
console.log(`Total compensation: $${manager.getSalary()}`);
manager.conductMeeting();

// ============================================
// CONSTRUCTOR CHAINING
// ============================================

class Person2 {
  constructor(public name: string, public age: number) {
    console.log("Person constructor called");
  }
}

class Student extends Person2 {
  constructor(name: string, age: number, public studentId: string) {
    super(name, age);
    console.log("Student constructor called");
  }
}

class GraduateStudent extends Student {
  constructor(
    name: string,
    age: number,
    studentId: string,
    public thesis: string
  ) {
    super(name, age, studentId);
    console.log("GraduateStudent constructor called");
  }
}

console.log("\nConstructor chaining:");
const gradStudent = new GraduateStudent("Bob", 25, "S12345", "AI Research");

// ============================================
// INSTANCEOF AND TYPE CHECKING
// ============================================

function processAnimal(animal: Animal): void {
  console.log(`\nProcessing: ${animal.getInfo()}`);
  animal.makeSound();

  if (animal instanceof Dog) {
    console.log("This is a dog!");
    animal.fetch();
  } else if (animal instanceof Cat) {
    console.log("This is a cat!");
    animal.scratch();
  }
}

const dog2 = new Dog("Max", 4, "Labrador");
const cat2 = new Cat("Luna", 3, false);

processAnimal(dog2);
processAnimal(cat2);

// ============================================
// HIERARCHICAL INHERITANCE
// ============================================

class Device {
  constructor(
    public brand: string,
    public model: string,
    protected powerOn: boolean = false
  ) {}

  turnOn(): void {
    this.powerOn = true;
    console.log(`${this.brand} ${this.model} is now ON`);
  }

  turnOff(): void {
    this.powerOn = false;
    console.log(`${this.brand} ${this.model} is now OFF`);
  }

  getStatus(): string {
    return this.powerOn ? "ON" : "OFF";
  }
}

class Smartphone extends Device {
  constructor(brand: string, model: string, private os: string) {
    super(brand, model);
  }

  makeCall(number: string): void {
    if (this.powerOn) {
      console.log(`Calling ${number}...`);
    } else {
      console.log("Phone is off");
    }
  }

  getInfo(): string {
    return `${this.brand} ${this.model} (${this.os}) - ${this.getStatus()}`;
  }
}

class Laptop extends Device {
  constructor(brand: string, model: string, private ram: number) {
    super(brand, model);
  }

  code(): void {
    if (this.powerOn) {
      console.log(`Coding on ${this.brand} with ${this.ram}GB RAM`);
    } else {
      console.log("Laptop is off");
    }
  }

  getInfo(): string {
    return `${this.brand} ${this.model} (${
      this.ram
    }GB RAM) - ${this.getStatus()}`;
  }
}

class Tablet extends Device {
  constructor(brand: string, model: string, private screenSize: number) {
    super(brand, model);
  }

  draw(): void {
    if (this.powerOn) {
      console.log(`Drawing on ${this.screenSize}" screen`);
    } else {
      console.log("Tablet is off");
    }
  }

  getInfo(): string {
    return `${this.brand} ${this.model} (${
      this.screenSize
    }") - ${this.getStatus()}`;
  }
}

const phone = new Smartphone("Apple", "iPhone 14", "iOS");
const laptop = new Laptop("Dell", "XPS 15", 16);
const tablet = new Tablet("Samsung", "Galaxy Tab", 10.5);

phone.turnOn();
phone.makeCall("555-1234");
console.log(phone.getInfo());

laptop.turnOn();
laptop.code();
console.log(laptop.getInfo());

tablet.turnOn();
tablet.draw();
console.log(tablet.getInfo());

// ============================================
// EXPORT FOR MODULE USAGE
// ============================================

export {
  Animal,
  Dog,
  Cat,
  Vehicle,
  Car2,
  ElectricCar,
  Shape,
  Circle,
  Rectangle,
  Triangle,
  BankAccount2,
  SavingsAccount,
  Employee2,
  Manager,
  Person2,
  Student,
  GraduateStudent,
  Device,
  Smartphone,
  Laptop,
  Tablet,
};

console.log("\n✅ All inheritance examples completed!");
