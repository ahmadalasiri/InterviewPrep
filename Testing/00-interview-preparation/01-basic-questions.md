# Basic Testing Questions

## Q1: What is Unit Testing?

**Answer:**

Unit testing is a software testing method where individual units or components of a software application are tested in isolation. A unit is the smallest testable part of an application, typically a function, method, or class.

**Key Characteristics:**

- Tests individual units in isolation
- Fast execution
- Should be independent
- Should not depend on external resources

**Example:**

```typescript
// calculator.ts
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}

// calculator.test.ts
import { Calculator } from "./calculator";

describe("Calculator", () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  it("should add two numbers correctly", () => {
    expect(calculator.add(2, 3)).toBe(5);
  });

  it("should subtract two numbers correctly", () => {
    expect(calculator.subtract(5, 3)).toBe(2);
  });
});
```

---

## Q2: What is the difference between Unit, Integration, and E2E Testing?

**Answer:**

| Type            | Scope                 | Speed     | Cost   | Purpose                     |
| --------------- | --------------------- | --------- | ------ | --------------------------- |
| **Unit**        | Single function/class | Very Fast | Low    | Test individual components  |
| **Integration** | Multiple components   | Medium    | Medium | Test component interactions |
| **E2E**         | Entire application    | Slow      | High   | Test user workflows         |

**Example:**

```typescript
// Unit Test
describe("UserService", () => {
  it("should validate email format", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });
});

// Integration Test
describe("User API Integration", () => {
  it("should create user and save to database", async () => {
    const user = await userService.create({ email: "test@example.com" });
    const saved = await db.users.findById(user.id);
    expect(saved).toBeDefined();
  });
});

// E2E Test
describe("User Registration Flow", () => {
  it("should register new user end-to-end", async () => {
    await page.goto("/register");
    await page.fill("#email", "test@example.com");
    await page.fill("#password", "password123");
    await page.click("#submit");
    await expect(page.locator(".success-message")).toBeVisible();
  });
});
```

---

## Q3: What are Mocks, Stubs, and Spies?

**Answer:**

These are test doubles used to isolate the code under test:

- **Spy**: Wraps a real function to track calls without changing behavior
- **Stub**: Replaces a function with a fake implementation that returns predefined values
- **Mock**: A fake object that verifies interactions and can have expectations

**Example:**

```typescript
import { vi } from "vitest";

// Spy - tracks calls to real function
const spy = vi.spyOn(console, "log");
someFunction();
expect(spy).toHaveBeenCalledWith("expected message");

// Stub - replaces function with fake implementation
const stub = vi.fn().mockReturnValue(42);
const result = stub();
expect(result).toBe(42);

// Mock - fake object with expectations
const mockUserService = {
  getUser: vi.fn().mockResolvedValue({ id: 1, name: "John" }),
  createUser: vi.fn().mockResolvedValue({ id: 2, name: "Jane" }),
};

await mockUserService.getUser(1);
expect(mockUserService.getUser).toHaveBeenCalledWith(1);
```

---

## Q4: What is Test Coverage and why is it important?

**Answer:**

Test coverage measures the percentage of code that is executed by tests. It helps identify untested parts of the codebase.

**Types of Coverage:**

- **Line Coverage**: Percentage of lines executed
- **Branch Coverage**: Percentage of branches (if/else) executed
- **Function Coverage**: Percentage of functions called
- **Statement Coverage**: Percentage of statements executed

**Example:**

```typescript
// user.ts
export function getUserStatus(user: User): string {
  if (user.isActive) {
    return "Active";
  } else if (user.isSuspended) {
    return "Suspended";
  } else {
    return "Inactive";
  }
}

// user.test.ts - Good coverage
describe("getUserStatus", () => {
  it("should return Active for active users", () => {
    expect(getUserStatus({ isActive: true, isSuspended: false })).toBe(
      "Active"
    );
  });

  it("should return Suspended for suspended users", () => {
    expect(getUserStatus({ isActive: false, isSuspended: true })).toBe(
      "Suspended"
    );
  });

  it("should return Inactive for inactive users", () => {
    expect(getUserStatus({ isActive: false, isSuspended: false })).toBe(
      "Inactive"
    );
  });
});
```

**Note:** High coverage doesn't guarantee quality tests, but low coverage indicates gaps.

---

## Q5: What is the AAA Pattern in Testing?

**Answer:**

AAA stands for Arrange, Act, Assert - a common pattern for structuring tests:

1. **Arrange**: Set up test data and conditions
2. **Act**: Execute the code under test
3. **Assert**: Verify the results

**Example:**

```typescript
describe("ShoppingCart", () => {
  it("should calculate total price correctly", () => {
    // Arrange
    const cart = new ShoppingCart();
    cart.addItem({ name: "Apple", price: 1.5, quantity: 2 });
    cart.addItem({ name: "Banana", price: 0.75, quantity: 3 });

    // Act
    const total = cart.calculateTotal();

    // Assert
    expect(total).toBe(5.25); // (1.50 * 2) + (0.75 * 3)
  });
});
```

---

## Q6: How do you test asynchronous code?

**Answer:**

Use async/await or return promises in tests. Most testing frameworks support both.

**Example:**

```typescript
// Using async/await
describe("UserService", () => {
  it("should fetch user by id", async () => {
    const user = await userService.getUserById(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });

  it("should handle errors", async () => {
    await expect(userService.getUserById(999)).rejects.toThrow(
      "User not found"
    );
  });
});

// Using promises
it("should fetch user by id", () => {
  return userService.getUserById(1).then((user) => {
    expect(user).toBeDefined();
  });
});
```

---

## Q7: What is the difference between Jest and Vitest?

**Answer:**

| Feature        | Jest            | Vitest              |
| -------------- | --------------- | ------------------- |
| **Runtime**    | Node.js         | Vite (faster)       |
| **Config**     | Separate config | Uses Vite config    |
| **TypeScript** | Requires setup  | Native support      |
| **Speed**      | Slower          | Faster (ESM native) |
| **Ecosystem**  | Mature          | Growing             |

**Example Vitest Setup:**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
});
```

---

## Q8: How do you test error handling?

**Answer:**

Test that errors are thrown correctly and error messages are appropriate.

**Example:**

```typescript
describe("EmailValidator", () => {
  it("should throw error for invalid email", () => {
    expect(() => validateEmail("invalid-email")).toThrow(
      "Invalid email format"
    );
  });

  it("should throw specific error type", () => {
    expect(() => processPayment(-100)).toThrow(ValidationError);
  });

  it("should handle async errors", async () => {
    await expect(fetchUser(999)).rejects.toThrow("User not found");
  });
});
```

---

## Q9: What is Test Isolation and why is it important?

**Answer:**

Test isolation means each test should be independent and not affect other tests. Tests should be able to run in any order.

**Best Practices:**

- Use `beforeEach`/`afterEach` for setup/cleanup
- Don't share mutable state between tests
- Reset mocks between tests
- Use unique test data

**Example:**

```typescript
describe("UserRepository", () => {
  let repository: UserRepository;
  let db: Database;

  beforeEach(() => {
    db = new InMemoryDatabase(); // Fresh database for each test
    repository = new UserRepository(db);
  });

  afterEach(() => {
    db.clear(); // Clean up after each test
  });

  it("should create user", () => {
    const user = repository.create({ name: "John" });
    expect(user.id).toBeDefined();
  });

  it("should not affect other tests", () => {
    // This test runs independently
    const users = repository.findAll();
    expect(users).toHaveLength(0);
  });
});
```

---

## Q10: What is Snapshot Testing?

**Answer:**

Snapshot testing captures the output of a component or function and compares it to a stored snapshot. Useful for UI components and serializable data.

**Example:**

```typescript
// Component snapshot
import { render } from "@testing-library/react";
import { UserCard } from "./UserCard";

it("should match snapshot", () => {
  const { container } = render(<UserCard user={{ name: "John", age: 30 }} />);
  expect(container).toMatchSnapshot();
});

// Data snapshot
it("should generate correct config", () => {
  const config = generateConfig({ env: "production" });
  expect(config).toMatchSnapshot();
});
```

**Note:** Snapshots should be reviewed and updated when intentional changes are made.
