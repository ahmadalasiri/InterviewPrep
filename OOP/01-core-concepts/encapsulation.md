# Encapsulation

## Definition

Encapsulation is the bundling of data (properties) and methods that operate on that data within a single unit (class), while hiding the internal state from outside access.

## Key Principles

1. **Data Hiding**: Internal details are hidden from the outside
2. **Controlled Access**: Access through public methods (getters/setters)
3. **Modularity**: Each class is self-contained
4. **Protection**: Prevents unauthorized access and modification

## Benefits

- **Security**: Protects sensitive data
- **Flexibility**: Can change internal implementation
- **Maintainability**: Easier to modify and debug
- **Reusability**: Well-encapsulated code is easier to reuse

## Access Modifiers

### Public

- Accessible from anywhere
- No restrictions

```typescript
class Person {
  public name: string; // Can be accessed anywhere
}
```

### Private

- Only accessible within the class
- Strongest encapsulation

```typescript
class BankAccount {
  private balance: number; // Only accessible inside this class

  getBalance(): number {
    return this.balance; // OK - inside class
  }
}
```

### Protected

- Accessible within class and subclasses
- Not accessible from outside

```typescript
class Animal {
  protected age: number; // Accessible in Animal and subclasses
}

class Dog extends Animal {
  getAge(): number {
    return this.age; // OK - subclass can access
  }
}
```

## Example Implementation

```typescript
class Employee {
  // Private properties - encapsulated
  private _name: string;
  private _salary: number;
  private _ssn: string;

  constructor(name: string, salary: number, ssn: string) {
    this._name = name;
    this._salary = salary;
    this._ssn = ssn;
  }

  // Public getter - controlled access
  get name(): string {
    return this._name;
  }

  // Public setter - with validation
  set salary(value: number) {
    if (value < 0) {
      throw new Error("Salary cannot be negative");
    }
    this._salary = value;
  }

  // Public method - safe operation
  public giveRaise(percentage: number): void {
    this._salary += this._salary * (percentage / 100);
  }

  // Partial information disclosure
  public getSSNLastFour(): string {
    return this._ssn.slice(-4);
  }

  // Complete information hiding
  private validateSSN(): boolean {
    return this._ssn.length === 9;
  }
}

const emp = new Employee("John", 50000, "123456789");
console.log(emp.name); // OK
emp.salary = 55000; // OK - using setter
// emp._salary = 100000; // Error: Property is private
console.log(emp.getSSNLastFour()); // "6789" - partial info
```

## Best Practices

1. **Make fields private by default**
2. **Provide public methods for necessary access**
3. **Validate data in setters**
4. **Keep internal logic hidden**
5. **Expose only what's necessary**

## Real-World Examples

### Banking System

```typescript
class Account {
  private balance: number = 0;
  private transactions: string[] = [];

  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      this.logTransaction(`Deposit: $${amount}`);
    }
  }

  withdraw(amount: number): boolean {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      this.logTransaction(`Withdrawal: $${amount}`);
      return true;
    }
    return false;
  }

  getBalance(): number {
    return this.balance;
  }

  private logTransaction(message: string): void {
    this.transactions.push(`${new Date().toISOString()}: ${message}`);
  }
}
```

For more examples, see [Practical TypeScript Examples](../05-practical-examples/typescript/01-classes-objects.ts)
