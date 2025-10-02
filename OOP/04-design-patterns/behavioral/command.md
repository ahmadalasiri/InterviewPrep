# Command Pattern

## Overview

Encapsulates a request as an object, allowing parameterization of clients with different requests, queuing, and logging of requests.

## TypeScript Implementation

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  on(): void {
    console.log("💡 Light is ON");
  }

  off(): void {
    console.log("💡 Light is OFF");
  }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.on();
  }

  undo(): void {
    this.light.off();
  }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.off();
  }

  undo(): void {
    this.light.on();
  }
}

class RemoteControl {
  private history: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    } else {
      console.log("Nothing to undo");
    }
  }
}

// Usage
const light = new Light();
const remote = new RemoteControl();

const lightOn = new LightOnCommand(light);
const lightOff = new LightOffCommand(light);

remote.executeCommand(lightOn);
remote.executeCommand(lightOff);
remote.undo(); // Turn back on
remote.undo(); // Turn back off
```

## Summary

- Encapsulates requests as objects
- Supports undoable operations
- Supports queuing and logging
- Decouples sender and receiver

---

**Next Steps:**

- Learn [State Pattern](state.md)
- Learn [Template Method Pattern](template-method.md)
