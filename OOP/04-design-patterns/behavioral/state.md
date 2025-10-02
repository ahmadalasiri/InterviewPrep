# State Pattern

## Overview

Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.

## TypeScript Implementation

```typescript
interface State {
  insertCoin(): void;
  pressButton(): void;
  dispense(): void;
}

class VendingMachine {
  private state: State;

  constructor() {
    this.state = new NoCoinState(this);
  }

  setState(state: State): void {
    this.state = state;
  }

  insertCoin(): void {
    this.state.insertCoin();
  }

  pressButton(): void {
    this.state.pressButton();
  }

  dispense(): void {
    this.state.dispense();
  }
}

class NoCoinState implements State {
  constructor(private machine: VendingMachine) {}

  insertCoin(): void {
    console.log("Coin inserted");
    this.machine.setState(new HasCoinState(this.machine));
  }

  pressButton(): void {
    console.log("Insert coin first!");
  }

  dispense(): void {
    console.log("Insert coin first!");
  }
}

class HasCoinState implements State {
  constructor(private machine: VendingMachine) {}

  insertCoin(): void {
    console.log("Coin already inserted");
  }

  pressButton(): void {
    console.log("Button pressed");
    this.machine.setState(new DispensingState(this.machine));
  }

  dispense(): void {
    console.log("Press button first!");
  }
}

class DispensingState implements State {
  constructor(private machine: VendingMachine) {}

  insertCoin(): void {
    console.log("Please wait...");
  }

  pressButton(): void {
    console.log("Already processing...");
  }

  dispense(): void {
    console.log("🥤 Dispensing product!");
    this.machine.setState(new NoCoinState(this.machine));
  }
}

// Usage
const machine = new VendingMachine();
machine.insertCoin();
machine.pressButton();
machine.dispense();
```

## Summary

- Encapsulates state-specific behavior
- Eliminates complex conditionals
- Makes state transitions explicit
- Easy to add new states

---

**Next Steps:**

- Learn [Template Method Pattern](template-method.md)
- Review [Behavioral Patterns](../README.md)
