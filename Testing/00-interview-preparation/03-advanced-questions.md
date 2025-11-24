# Advanced Testing Questions

## Q1: What is Property-Based Testing?

**Answer:**

Property-based testing generates random inputs and verifies that properties hold for all inputs. Instead of testing specific examples, you test general properties.

**Example with fast-check:**

```typescript
import fc from 'fast-check';

describe('Array reverse property', () => {
  it('should have reverse of reverse equal to original', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const reversed = [...arr].reverse();
        const doubleReversed = [...reversed].reverse();
        return JSON.stringify(arr) === JSON.stringify(doubleReversed);
      })
    );
  });

  it('should have reverse length equal to original', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        return arr.length === arr.reverse().length;
      })
    );
  });
});
```

**Benefits:**
- Finds edge cases automatically
- Tests general properties, not just examples
- Can discover bugs in unexpected inputs

---

## Q2: What is Test-Driven Bug Fixing?

**Answer:**

When fixing a bug, first write a test that reproduces the bug (it will fail), then fix the code to make the test pass.

**Example:**

```typescript
// Bug report: User can't login with email containing plus sign

// Step 1: Write test that reproduces the bug
describe('User login', () => {
  it('should handle email with plus sign', () => {
    const email = 'user+tag@example.com';
    expect(() => login(email, 'password')).not.toThrow();
  });
});

// Step 2: Test fails (reproduces bug)
// Step 3: Fix the bug
function login(email: string, password: string): void {
  // Bug: email validation was too strict
  // Fix: Allow plus sign in email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email');
  }
  // ... rest of login logic
}

// Step 4: Test passes
```

---

## Q3: How do you test time-dependent code?

**Answer:**

Use time mocking to control time in tests, making them deterministic.

**Example:**

```typescript
import { vi } from 'vitest';

describe('Cache with TTL', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should expire cache after TTL', () => {
    const cache = new Cache({ ttl: 1000 });
    cache.set('key', 'value');
    
    expect(cache.get('key')).toBe('value');
    
    // Fast-forward time
    vi.advanceTimersByTime(1001);
    
    expect(cache.get('key')).toBeUndefined();
  });
});
```

---

## Q4: What is Contract Testing?

**Answer:**

Contract testing verifies that services communicate correctly by checking the contract (API) between them, not the implementation.

**Example with Pact:**

```typescript
import { Pact } from '@pact-foundation/pact';

describe('User Service Contract', () => {
  const provider = new Pact({
    consumer: 'Frontend',
    provider: 'UserService',
  });

  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  it('should return user by id', async () => {
    await provider.addInteraction({
      state: 'user exists',
      uponReceiving: 'a request for user',
      withRequest: {
        method: 'GET',
        path: '/users/1',
      },
      willRespondWith: {
        status: 200,
        body: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    });

    const response = await fetch('http://localhost:1234/users/1');
    const user = await response.json();
    
    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
  });
});
```

---

## Q5: How do you test error boundaries and exception handling?

**Answer:**

Test that errors are caught, logged, and handled appropriately.

**Example:**

```typescript
describe('Error handling', () => {
  it('should catch and handle errors gracefully', () => {
    const errorHandler = {
      handle: jest.fn(),
      log: jest.fn(),
    };

    const service = new Service(errorHandler);

    expect(() => {
      service.processData(null);
    }).not.toThrow();

    expect(errorHandler.handle).toHaveBeenCalled();
  });

  it('should propagate critical errors', () => {
    const service = new Service();
    
    expect(() => {
      service.criticalOperation();
    }).toThrow(CriticalError);
  });

  it('should retry on transient errors', async () => {
    const mockApi = {
      call: jest.fn()
        .mockRejectedValueOnce(new TransientError())
        .mockResolvedValueOnce({ data: 'success' }),
    };

    const result = await service.withRetry(() => mockApi.call());
    
    expect(mockApi.call).toHaveBeenCalledTimes(2);
    expect(result.data).toBe('success');
  });
});
```

---

## Q6: What is Mutation Testing?

**Answer:**

Mutation testing evaluates test quality by introducing small changes (mutations) to code and checking if tests catch them. If tests don't fail, the mutation survived, indicating weak tests.

**Example:**

```typescript
// Original code
function add(a: number, b: number): number {
  return a + b;
}

// Test
it('should add two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// Mutation 1: Change + to -
function add(a: number, b: number): number {
  return a - b; // Mutation
}
// Test fails ✅ - Good test caught the mutation

// Mutation 2: Change return value
function add(a: number, b: number): number {
  return 5; // Always return 5
}
// Test passes ❌ - Weak test, mutation survived
```

**Tools:** Stryker, mutmut

---

## Q7: How do you test concurrent/parallel code?

**Answer:**

Test race conditions, deadlocks, and thread safety.

**Example:**

```typescript
describe('Thread-safe counter', () => {
  it('should handle concurrent increments', async () => {
    const counter = new ThreadSafeCounter();
    const promises: Promise<void>[] = [];

    // Simulate 100 concurrent increments
    for (let i = 0; i < 100; i++) {
      promises.push(
        Promise.resolve().then(() => counter.increment())
      );
    }

    await Promise.all(promises);

    expect(counter.getValue()).toBe(100);
  });

  it('should prevent race conditions', async () => {
    const counter = new ThreadSafeCounter();
    
    // Multiple threads trying to increment
    const results = await Promise.all([
      counter.increment(),
      counter.increment(),
      counter.increment(),
    ]);

    // All should succeed without losing increments
    expect(counter.getValue()).toBe(3);
  });
});
```

---

## Q8: What is Visual Regression Testing?

**Answer:**

Visual regression testing compares screenshots of UI components to detect visual changes.

**Example with Percy/Chromatic:**

```typescript
import { render } from '@testing-library/react';
import { percySnapshot } from '@percy/react';

describe('Button Component', () => {
  it('should match visual snapshot', () => {
    const { container } = render(<Button>Click me</Button>);
    percySnapshot(container, 'Button component');
  });

  it('should show loading state', () => {
    const { container } = render(<Button loading>Loading...</Button>);
    percySnapshot(container, 'Button loading state');
  });
});
```

---

## Q9: How do you test performance and load?

**Answer:**

Write performance tests to ensure code meets performance requirements.

**Example:**

```typescript
describe('Performance tests', () => {
  it('should process 1000 items in under 1 second', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
    
    const start = performance.now();
    processItems(items);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(1000);
  });

  it('should handle load without memory leaks', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Simulate load
    for (let i = 0; i < 1000; i++) {
      await processRequest();
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory should not increase significantly
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
  });
});
```

---

## Q10: What is Test-Driven Refactoring?

**Answer:**

Refactoring with a comprehensive test suite ensures behavior doesn't change while improving code structure.

**Example:**

```typescript
// Before refactoring - complex, hard to read
function calculateTotal(items: any[]): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].price && items[i].quantity) {
      total += items[i].price * items[i].quantity;
      if (items[i].discount) {
        total -= items[i].discount;
      }
    }
  }
  return total;
}

// Comprehensive tests ensure behavior doesn't change
describe('calculateTotal', () => {
  it('should calculate total for items with price and quantity', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];
    expect(calculateTotal(items)).toBe(35);
  });

  it('should apply discounts', () => {
    const items = [
      { price: 10, quantity: 2, discount: 5 },
    ];
    expect(calculateTotal(items)).toBe(15);
  });

  // ... more tests
});

// After refactoring - cleaner, but same behavior
function calculateTotal(items: Item[]): number {
  return items
    .filter(item => item.price && item.quantity)
    .reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const discount = item.discount || 0;
      return total + itemTotal - discount;
    }, 0);
}

// All tests still pass ✅
```

