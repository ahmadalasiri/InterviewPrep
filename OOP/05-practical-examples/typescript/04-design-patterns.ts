/**
 * Design Patterns - Common Solutions to Recurring Problems
 * Demonstrates popular design patterns in TypeScript
 */

// ============================================
// SINGLETON PATTERN
// ============================================

class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {
    console.log("Database instance created");
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  connect(): void {
    if (!this.isConnected) {
      this.isConnected = true;
      console.log("Connected to database");
    }
  }

  query(sql: string): void {
    if (this.isConnected) {
      console.log(`Executing query: ${sql}`);
    } else {
      console.log("Not connected to database");
    }
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log("Same instance?", db1 === db2); // true
db1.connect();
db1.query("SELECT * FROM users");

// ============================================
// FACTORY PATTERN
// ============================================

interface Vehicle2 {
  drive(): void;
  getType(): string;
}

class Car3 implements Vehicle2 {
  drive(): void {
    console.log("Driving a car");
  }

  getType(): string {
    return "Car";
  }
}

class Motorcycle implements Vehicle2 {
  drive(): void {
    console.log("Riding a motorcycle");
  }

  getType(): string {
    return "Motorcycle";
  }
}

class Truck implements Vehicle2 {
  drive(): void {
    console.log("Driving a truck");
  }

  getType(): string {
    return "Truck";
  }
}

class VehicleFactory {
  static createVehicle(type: string): Vehicle2 {
    switch (type.toLowerCase()) {
      case "car":
        return new Car3();
      case "motorcycle":
        return new Motorcycle();
      case "truck":
        return new Truck();
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}

// Usage
const car = VehicleFactory.createVehicle("car");
const motorcycle = VehicleFactory.createVehicle("motorcycle");
const truck = VehicleFactory.createVehicle("truck");

car.drive();
motorcycle.drive();
truck.drive();

// ============================================
// OBSERVER PATTERN
// ============================================

interface Observer2 {
  update(data: any): void;
  getName(): string;
}

interface Subject {
  attach(observer: Observer2): void;
  detach(observer: Observer2): void;
  notify(data: any): void;
}

class NewsAgency implements Subject {
  private observers: Observer2[] = [];
  private latestNews: string = "";

  attach(observer: Observer2): void {
    this.observers.push(observer);
    console.log(`${observer.getName()} subscribed to news`);
  }

  detach(observer: Observer2): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`${observer.getName()} unsubscribed from news`);
    }
  }

  notify(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }

  publishNews(news: string): void {
    this.latestNews = news;
    console.log(`\nPublishing: ${news}`);
    this.notify(this.latestNews);
  }
}

class NewsChannel implements Observer2 {
  constructor(private name: string) {}

  update(data: any): void {
    console.log(`${this.name} received news: ${data}`);
  }

  getName(): string {
    return this.name;
  }
}

// Usage
const agency = new NewsAgency();
const channel1 = new NewsChannel("CNN");
const channel2 = new NewsChannel("BBC");
const channel3 = new NewsChannel("FOX");

agency.attach(channel1);
agency.attach(channel2);
agency.attach(channel3);

agency.publishNews("Breaking: New technology released");
agency.detach(channel2);
agency.publishNews("Update: Market reaches new highs");

// ============================================
// STRATEGY PATTERN
// ============================================

interface CompressionStrategy {
  compress(file: string): void;
  getType(): string;
}

class ZipCompression implements CompressionStrategy {
  compress(file: string): void {
    console.log(`Compressing ${file} using ZIP`);
  }

  getType(): string {
    return "ZIP";
  }
}

class RarCompression implements CompressionStrategy {
  compress(file: string): void {
    console.log(`Compressing ${file} using RAR`);
  }

  getType(): string {
    return "RAR";
  }
}

class GzipCompression implements CompressionStrategy {
  compress(file: string): void {
    console.log(`Compressing ${file} using GZIP`);
  }

  getType(): string {
    return "GZIP";
  }
}

class FileCompressor {
  constructor(private strategy: CompressionStrategy) {}

  setStrategy(strategy: CompressionStrategy): void {
    this.strategy = strategy;
  }

  compressFile(file: string): void {
    console.log(`\nUsing ${this.strategy.getType()} compression`);
    this.strategy.compress(file);
  }
}

// Usage
const compressor = new FileCompressor(new ZipCompression());
compressor.compressFile("document.txt");

compressor.setStrategy(new RarCompression());
compressor.compressFile("image.jpg");

compressor.setStrategy(new GzipCompression());
compressor.compressFile("archive.tar");

// ============================================
// DECORATOR PATTERN
// ============================================

interface Coffee {
  getCost(): number;
  getDescription(): string;
}

class SimpleCoffee implements Coffee {
  getCost(): number {
    return 5;
  }

  getDescription(): string {
    return "Simple coffee";
  }
}

abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract getCost(): number;
  abstract getDescription(): string;
}

class MilkDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 1;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.5;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", sugar";
  }
}

class WhipDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 1.5;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", whipped cream";
  }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.getDescription()} = $${coffee.getCost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.getDescription()} = $${coffee.getCost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.getDescription()} = $${coffee.getCost()}`);

coffee = new WhipDecorator(coffee);
console.log(`${coffee.getDescription()} = $${coffee.getCost()}`);

// ============================================
// ADAPTER PATTERN
// ============================================

// Old interface
class LegacyPrinter {
  printOldFormat(text: string): void {
    console.log(`[OLD FORMAT] ${text}`);
  }
}

// New interface
interface ModernPrinter {
  print(text: string): void;
  printColor(text: string, color: string): void;
}

// Adapter
class PrinterAdapter implements ModernPrinter {
  constructor(private legacyPrinter: LegacyPrinter) {}

  print(text: string): void {
    this.legacyPrinter.printOldFormat(text);
  }

  printColor(text: string, color: string): void {
    this.legacyPrinter.printOldFormat(`${color.toUpperCase()}: ${text}`);
  }
}

// Usage
const oldPrinter = new LegacyPrinter();
const adapter = new PrinterAdapter(oldPrinter);

adapter.print("Hello, World!");
adapter.printColor("Hello, Colors!", "red");

// ============================================
// BUILDER PATTERN
// ============================================

class Computer {
  constructor(
    public cpu: string,
    public ram: string,
    public storage: string,
    public gpu?: string,
    public wifi?: boolean,
    public bluetooth?: boolean
  ) {}

  display(): void {
    console.log("\nComputer Specifications:");
    console.log(`CPU: ${this.cpu}`);
    console.log(`RAM: ${this.ram}`);
    console.log(`Storage: ${this.storage}`);
    if (this.gpu) console.log(`GPU: ${this.gpu}`);
    if (this.wifi) console.log(`WiFi: Yes`);
    if (this.bluetooth) console.log(`Bluetooth: Yes`);
  }
}

class ComputerBuilder {
  private cpu: string = "";
  private ram: string = "";
  private storage: string = "";
  private gpu?: string;
  private wifi?: boolean;
  private bluetooth?: boolean;

  setCPU(cpu: string): this {
    this.cpu = cpu;
    return this;
  }

  setRAM(ram: string): this {
    this.ram = ram;
    return this;
  }

  setStorage(storage: string): this {
    this.storage = storage;
    return this;
  }

  setGPU(gpu: string): this {
    this.gpu = gpu;
    return this;
  }

  addWiFi(): this {
    this.wifi = true;
    return this;
  }

  addBluetooth(): this {
    this.bluetooth = true;
    return this;
  }

  build(): Computer {
    return new Computer(
      this.cpu,
      this.ram,
      this.storage,
      this.gpu,
      this.wifi,
      this.bluetooth
    );
  }
}

// Usage
const gamingPC = new ComputerBuilder()
  .setCPU("Intel i9")
  .setRAM("32GB")
  .setStorage("1TB SSD")
  .setGPU("NVIDIA RTX 4090")
  .addWiFi()
  .addBluetooth()
  .build();

gamingPC.display();

const officePC = new ComputerBuilder()
  .setCPU("Intel i5")
  .setRAM("16GB")
  .setStorage("512GB SSD")
  .addWiFi()
  .build();

officePC.display();

// ============================================
// FACADE PATTERN
// ============================================

class CPU {
  freeze(): void {
    console.log("CPU: Freezing");
  }

  jump(position: number): void {
    console.log(`CPU: Jumping to ${position}`);
  }

  execute(): void {
    console.log("CPU: Executing");
  }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory: Loading ${data} at ${position}`);
  }
}

class HardDrive {
  read(sector: number, size: number): string {
    console.log(`HardDrive: Reading ${size} bytes from sector ${sector}`);
    return "boot data";
  }
}

// Facade
class ComputerFacade {
  private cpu: CPU;
  private memory: Memory;
  private hardDrive: HardDrive;

  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start(): void {
    console.log("\nStarting computer...");
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log("Computer started!");
  }
}

// Usage
const computer = new ComputerFacade();
computer.start();

// ============================================
// COMMAND PATTERN
// ============================================

interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  turnOn(): void {
    console.log("Light is ON");
  }

  turnOff(): void {
    console.log("Light is OFF");
  }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOff();
  }

  undo(): void {
    this.light.turnOn();
  }
}

class RemoteControl {
  private history: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undoLastCommand(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    } else {
      console.log("No commands to undo");
    }
  }
}

// Usage
const light = new Light();
const lightOn = new LightOnCommand(light);
const lightOff = new LightOffCommand(light);
const remote = new RemoteControl();

console.log("\n=== Remote Control ===");
remote.executeCommand(lightOn);
remote.executeCommand(lightOff);
remote.executeCommand(lightOn);
console.log("\nUndo:");
remote.undoLastCommand();

// ============================================
// EXPORT FOR MODULE USAGE
// ============================================

export {
  Database,
  VehicleFactory,
  NewsAgency,
  NewsChannel,
  FileCompressor,
  ZipCompression,
  RarCompression,
  GzipCompression,
  Coffee,
  SimpleCoffee,
  MilkDecorator,
  SugarDecorator,
  WhipDecorator,
  PrinterAdapter,
  ComputerBuilder,
  ComputerFacade,
  RemoteControl,
  LightOnCommand,
  LightOffCommand,
};

console.log("\n✅ All design patterns examples completed!");
