/**
 * Polymorphism - Many Forms
 * Demonstrates method overriding, interfaces, runtime polymorphism, and type substitution
 */

// ============================================
// INTERFACE-BASED POLYMORPHISM
// ============================================

interface PaymentMethod {
  processPayment(amount: number): boolean;
  getPaymentType(): string;
  refund(amount: number): boolean;
}

class CreditCardPayment implements PaymentMethod {
  constructor(private cardNumber: string) {}

  processPayment(amount: number): boolean {
    console.log(`Processing credit card payment: $${amount}`);
    console.log(`Card: ****${this.cardNumber.slice(-4)}`);
    return true;
  }

  getPaymentType(): string {
    return "Credit Card";
  }

  refund(amount: number): boolean {
    console.log(`Refunding $${amount} to credit card`);
    return true;
  }
}

class PayPalPayment implements PaymentMethod {
  constructor(private email: string) {}

  processPayment(amount: number): boolean {
    console.log(`Processing PayPal payment: $${amount}`);
    console.log(`Account: ${this.email}`);
    return true;
  }

  getPaymentType(): string {
    return "PayPal";
  }

  refund(amount: number): boolean {
    console.log(`Refunding $${amount} to PayPal account`);
    return true;
  }
}

class CryptoPayment implements PaymentMethod {
  constructor(private walletAddress: string) {}

  processPayment(amount: number): boolean {
    console.log(`Processing crypto payment: $${amount}`);
    console.log(`Wallet: ${this.walletAddress}`);
    return true;
  }

  getPaymentType(): string {
    return "Cryptocurrency";
  }

  refund(amount: number): boolean {
    console.log(`Refunding $${amount} to crypto wallet`);
    return true;
  }
}

// Polymorphic function - works with any PaymentMethod
function processOrder(paymentMethod: PaymentMethod, amount: number): void {
  console.log(`\nProcessing order with ${paymentMethod.getPaymentType()}`);
  if (paymentMethod.processPayment(amount)) {
    console.log("Payment successful!");
  } else {
    console.log("Payment failed!");
  }
}

const creditCard = new CreditCardPayment("1234567890123456");
const paypal = new PayPalPayment("user@example.com");
const crypto = new CryptoPayment("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");

processOrder(creditCard, 100);
processOrder(paypal, 200);
processOrder(crypto, 300);

// ============================================
// ABSTRACT CLASS POLYMORPHISM
// ============================================

abstract class Notification {
  constructor(protected recipient: string, protected message: string) {}

  abstract send(): boolean;
  abstract getDeliveryTime(): string;

  // Template method
  notify(): void {
    console.log(`\nSending notification to ${this.recipient}`);
    if (this.send()) {
      console.log(`Delivered via ${this.getDeliveryTime()}`);
    } else {
      console.log("Delivery failed");
    }
  }

  getMessage(): string {
    return this.message;
  }
}

class EmailNotification extends Notification {
  send(): boolean {
    console.log(`Email: ${this.message}`);
    return true;
  }

  getDeliveryTime(): string {
    return "email (instant)";
  }
}

class SMSNotification extends Notification {
  send(): boolean {
    console.log(`SMS: ${this.message}`);
    return true;
  }

  getDeliveryTime(): string {
    return "SMS (1-2 seconds)";
  }
}

class PushNotification extends Notification {
  send(): boolean {
    console.log(`Push: ${this.message}`);
    return true;
  }

  getDeliveryTime(): string {
    return "push notification (instant)";
  }
}

// Polymorphic array
const notifications: Notification[] = [
  new EmailNotification("user@example.com", "Your order has shipped"),
  new SMSNotification("+1234567890", "Your code is 123456"),
  new PushNotification("device-id", "New message received"),
];

notifications.forEach((notification) => notification.notify());

// ============================================
// METHOD OVERRIDING
// ============================================

class Animal3 {
  constructor(protected name: string) {}

  makeSound(): void {
    console.log(`${this.name} makes a sound`);
  }

  move(): void {
    console.log(`${this.name} moves`);
  }

  describe(): void {
    console.log(`This is ${this.name}`);
    this.makeSound();
    this.move();
  }
}

class Dog3 extends Animal3 {
  makeSound(): void {
    console.log(`${this.name} barks: Woof!`);
  }

  move(): void {
    console.log(`${this.name} runs on four legs`);
  }
}

class Bird extends Animal3 {
  makeSound(): void {
    console.log(`${this.name} chirps: Tweet!`);
  }

  move(): void {
    console.log(`${this.name} flies in the sky`);
  }
}

class Fish extends Animal3 {
  makeSound(): void {
    console.log(`${this.name} doesn't make sound`);
  }

  move(): void {
    console.log(`${this.name} swims in water`);
  }
}

// Runtime polymorphism
const animals: Animal3[] = [
  new Dog3("Buddy"),
  new Bird("Tweety"),
  new Fish("Nemo"),
];

console.log("\n=== Animal behaviors ===");
animals.forEach((animal) => {
  animal.describe();
  console.log("---");
});

// ============================================
// STRATEGY PATTERN (POLYMORPHISM)
// ============================================

interface SortStrategy {
  sort(data: number[]): number[];
  getName(): string;
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }

  getName(): string {
    return "Bubble Sort";
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;

    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter((x) => x < pivot);
    const middle = data.filter((x) => x === pivot);
    const right = data.filter((x) => x > pivot);

    return [...this.sort(left), ...middle, ...this.sort(right)];
  }

  getName(): string {
    return "Quick Sort";
  }
}

class MergeSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;

    const mid = Math.floor(data.length / 2);
    const left = this.sort(data.slice(0, mid));
    const right = this.sort(data.slice(mid));

    return this.merge(left, right);
  }

  private merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  getName(): string {
    return "Merge Sort";
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    console.log(`Sorting using ${this.strategy.getName()}`);
    return this.strategy.sort(data);
  }
}

const data = [64, 34, 25, 12, 22, 11, 90];
const sorter = new Sorter(new BubbleSort());

console.log("\nOriginal:", data);
console.log("Sorted:", sorter.sort(data));

sorter.setStrategy(new QuickSort());
console.log("Sorted:", sorter.sort(data));

sorter.setStrategy(new MergeSort());
console.log("Sorted:", sorter.sort(data));

// ============================================
// MULTIPLE INTERFACES
// ============================================

interface Drivable {
  drive(): void;
  park(): void;
}

interface Flyable {
  fly(): void;
  land(): void;
}

interface Swimmable {
  swim(): void;
}

class AmphibiousVehicle implements Drivable, Swimmable {
  drive(): void {
    console.log("Driving on land");
  }

  park(): void {
    console.log("Parking on land");
  }

  swim(): void {
    console.log("Swimming in water");
  }
}

class FlyingCar implements Drivable, Flyable {
  drive(): void {
    console.log("Driving on road");
  }

  park(): void {
    console.log("Parking in garage");
  }

  fly(): void {
    console.log("Flying in air");
  }

  land(): void {
    console.log("Landing on ground");
  }
}

function testVehicle(vehicle: Drivable): void {
  vehicle.drive();
  vehicle.park();
}

const amphibious = new AmphibiousVehicle();
const flyingCar = new FlyingCar();

testVehicle(amphibious);
testVehicle(flyingCar);

amphibious.swim();
flyingCar.fly();
flyingCar.land();

// ============================================
// TYPE GUARDS WITH POLYMORPHISM
// ============================================

interface Employee3 {
  name: string;
  calculateSalary(): number;
  getRole(): string;
}

class FullTimeEmployee implements Employee3 {
  constructor(public name: string, private monthlySalary: number) {}

  calculateSalary(): number {
    return this.monthlySalary * 12;
  }

  getRole(): string {
    return "Full-Time Employee";
  }

  getBenefits(): string[] {
    return ["Health Insurance", "401k", "Paid Leave"];
  }
}

class Contractor implements Employee3 {
  constructor(
    public name: string,
    private hourlyRate: number,
    private hoursWorked: number
  ) {}

  calculateSalary(): number {
    return this.hourlyRate * this.hoursWorked;
  }

  getRole(): string {
    return "Contractor";
  }

  getContracts(): string[] {
    return ["Project A", "Project B"];
  }
}

class Intern implements Employee3 {
  constructor(public name: string, private stipend: number) {}

  calculateSalary(): number {
    return this.stipend;
  }

  getRole(): string {
    return "Intern";
  }

  getMentor(): string {
    return "Senior Developer";
  }
}

function processEmployee(employee: Employee3): void {
  console.log(`\n${employee.name} - ${employee.getRole()}`);
  console.log(`Compensation: $${employee.calculateSalary()}`);

  // Type guard
  if (employee instanceof FullTimeEmployee) {
    console.log("Benefits:", employee.getBenefits().join(", "));
  } else if (employee instanceof Contractor) {
    console.log("Contracts:", employee.getContracts().join(", "));
  } else if (employee instanceof Intern) {
    console.log("Mentor:", employee.getMentor());
  }
}

const employees: Employee3[] = [
  new FullTimeEmployee("Alice", 5000),
  new Contractor("Bob", 50, 1000),
  new Intern("Charlie", 2000),
];

employees.forEach(processEmployee);

// ============================================
// POLYMORPHIC COLLECTIONS
// ============================================

interface Shape2 {
  draw(): void;
  getArea(): number;
  getType(): string;
}

class Circle2 implements Shape2 {
  constructor(private radius: number) {}

  draw(): void {
    console.log(`Drawing a circle with radius ${this.radius}`);
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getType(): string {
    return "Circle";
  }
}

class Square implements Shape2 {
  constructor(private side: number) {}

  draw(): void {
    console.log(`Drawing a square with side ${this.side}`);
  }

  getArea(): number {
    return this.side ** 2;
  }

  getType(): string {
    return "Square";
  }
}

class Triangle2 implements Shape2 {
  constructor(private base: number, private height: number) {}

  draw(): void {
    console.log(
      `Drawing a triangle with base ${this.base} and height ${this.height}`
    );
  }

  getArea(): number {
    return (this.base * this.height) / 2;
  }

  getType(): string {
    return "Triangle";
  }
}

class Canvas {
  private shapes: Shape2[] = [];

  addShape(shape: Shape2): void {
    this.shapes.push(shape);
  }

  drawAll(): void {
    console.log("\n=== Drawing all shapes ===");
    this.shapes.forEach((shape) => shape.draw());
  }

  getTotalArea(): number {
    return this.shapes.reduce((total, shape) => total + shape.getArea(), 0);
  }

  getShapesSummary(): void {
    console.log("\n=== Shapes Summary ===");
    this.shapes.forEach((shape) => {
      console.log(`${shape.getType()}: Area = ${shape.getArea().toFixed(2)}`);
    });
    console.log(`Total Area: ${this.getTotalArea().toFixed(2)}`);
  }
}

const canvas = new Canvas();
canvas.addShape(new Circle2(5));
canvas.addShape(new Square(4));
canvas.addShape(new Triangle2(6, 8));

canvas.drawAll();
canvas.getShapesSummary();

// ============================================
// EXPORT FOR MODULE USAGE
// ============================================

export {
  PaymentMethod,
  CreditCardPayment,
  PayPalPayment,
  CryptoPayment,
  Notification,
  EmailNotification,
  SMSNotification,
  PushNotification,
  SortStrategy,
  BubbleSort,
  QuickSort,
  MergeSort,
  Sorter,
  Employee3,
  FullTimeEmployee,
  Contractor,
  Intern,
  Shape2,
  Circle2,
  Square,
  Triangle2,
  Canvas,
};

console.log("\n✅ All polymorphism examples completed!");
