# Builder Pattern

## Overview

Separates construction of a complex object from its representation, allowing step-by-step creation.

## TypeScript Implementation

```typescript
class Computer {
  constructor(
    public cpu: string = "",
    public ram: string = "",
    public storage: string = "",
    public gpu: string = "",
    public os: string = ""
  ) {}

  displaySpecs(): void {
    console.log("\n=== Computer Specs ===");
    console.log(`CPU: ${this.cpu}`);
    console.log(`RAM: ${this.ram}`);
    console.log(`Storage: ${this.storage}`);
    console.log(`GPU: ${this.gpu}`);
    console.log(`OS: ${this.os}`);
  }
}

// Builder
class ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  setCPU(cpu: string): this {
    this.computer.cpu = cpu;
    return this;
  }

  setRAM(ram: string): this {
    this.computer.ram = ram;
    return this;
  }

  setStorage(storage: string): this {
    this.computer.storage = storage;
    return this;
  }

  setGPU(gpu: string): this {
    this.computer.gpu = gpu;
    return this;
  }

  setOS(os: string): this {
    this.computer.os = os;
    return this;
  }

  build(): Computer {
    return this.computer;
  }
}

// Usage
const gamingPC = new ComputerBuilder()
  .setCPU("Intel i9")
  .setRAM("32GB DDR5")
  .setStorage("2TB NVMe SSD")
  .setGPU("RTX 4090")
  .setOS("Windows 11")
  .build();

gamingPC.displaySpecs();

const officePC = new ComputerBuilder()
  .setCPU("Intel i5")
  .setRAM("16GB DDR4")
  .setStorage("512GB SSD")
  .setOS("Windows 11")
  .build();

officePC.displaySpecs();
```

## Summary

- Constructs complex objects step-by-step
- Same construction process creates different representations
- Provides fine control over construction process
- Fluent interface for better readability

---

**Next Steps:**

- Learn [Prototype Pattern](prototype.md)
- Review [Creational Patterns](../README.md)
