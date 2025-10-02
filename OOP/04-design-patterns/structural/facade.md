# Facade Pattern

## Overview

Provides a simplified interface to a complex subsystem.

## TypeScript Implementation

```typescript
// Complex subsystems
class CPU {
  freeze(): void {
    console.log("CPU: Freezing...");
  }

  jump(position: number): void {
    console.log(`CPU: Jumping to ${position}`);
  }

  execute(): void {
    console.log("CPU: Executing...");
  }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory: Loading data at ${position}`);
  }
}

class HardDrive {
  read(sector: number, size: number): string {
    console.log(`HardDrive: Reading sector ${sector}, size ${size}`);
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
    console.log("\n=== Starting Computer ===");
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log("=== Computer Started ===\n");
  }
}

// Usage
const computer = new ComputerFacade();
computer.start(); // Simple interface to complex operation
```

## Summary

- Simplifies complex interfaces
- Reduces coupling between client and subsystem
- Provides a clear entry point

---

**Next Steps:**

- Learn [Proxy Pattern](proxy.md)
- Learn [Composite Pattern](composite.md)
