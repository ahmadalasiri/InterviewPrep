# TDD Interview Questions

## Q1: What is Test-Driven Development (TDD)?

**Answer:**

Test-Driven Development is a software development approach where you write tests before writing the implementation code. It follows the Red-Green-Refactor cycle.

**The TDD Cycle:**

1. **Red**: Write a failing test
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

**Benefits:**
- Better design and code quality
- Comprehensive test coverage
- Confidence in refactoring
- Clear requirements
- Fewer bugs

**Example:**

```typescript
// Step 1: Red - Write failing test
describe('Calculator', () => {
  it('should multiply two numbers', () => {
    const calc = new Calculator();
    expect(calc.multiply(3, 4)).toBe(12);
  });
});

// Step 2: Green - Write minimal implementation
class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// Step 3: Refactor - Improve if needed
// (In this case, implementation is already simple)
```

---

## Q2: What is the Red-Green-Refactor cycle?

**Answer:**

The Red-Green-Refactor cycle is the core process of TDD:

1. **Red Phase**: Write a test that fails (because code doesn't exist yet)
2. **Green Phase**: Write the minimum code needed to pass the test
3. **Refactor Phase**: Improve code quality while keeping tests green

**Example:**

```typescript
// RED: Write failing test
describe('StringCalculator', () => {
  it('should return 0 for empty string', () => {
    expect(add('')).toBe(0);
  });
});

// GREEN: Minimal implementation
function add(numbers: string): number {
  if (numbers === '') return 0;
  return 0; // Temporary to make test pass
}

// RED: Add another test
it('should return number for single number', () => {
  expect(add('5')).toBe(5);
});

// GREEN: Update implementation
function add(numbers: string): number {
  if (numbers === '') return 0;
  return parseInt(numbers);
}

// RED: Add test for two numbers
it('should add two numbers', () => {
  expect(add('1,2')).toBe(3);
});

// GREEN: Update implementation
function add(numbers: string): number {
  if (numbers === '') return 0;
  return numbers.split(',').reduce((sum, n) => sum + parseInt(n), 0);
}

// REFACTOR: Improve code quality
function add(numbers: string): number {
  if (numbers === '') return 0;
  return numbers
    .split(',')
    .map(n => parseInt(n.trim()))
    .reduce((sum, n) => sum + n, 0);
}
```

---

## Q3: What are the benefits of TDD?

**Answer:**

1. **Better Design**: Forces you to think about API design before implementation
2. **Test Coverage**: Ensures comprehensive test coverage
3. **Confidence**: Safe refactoring with test safety net
4. **Documentation**: Tests serve as executable documentation
5. **Fewer Bugs**: Catches issues early in development
6. **Faster Debugging**: Tests pinpoint where problems occur
7. **Requirements Clarity**: Tests clarify expected behavior

**Example:**

```typescript
// TDD forces you to think about the API first
// Test defines the expected behavior
describe('UserService', () => {
  it('should create user with email and password', async () => {
    const user = await userService.create({
      email: 'test@example.com',
      password: 'secure123'
    });
    
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
    expect(user).not.toHaveProperty('password'); // Security consideration
  });
});

// Implementation follows the test's requirements
class UserService {
  async create(data: { email: string; password: string }): Promise<User> {
    // Implementation guided by test
  }
}
```

---

## Q4: What is the difference between TDD and BDD?

**Answer:**

| Aspect | TDD | BDD |
|--------|-----|-----|
| **Focus** | Tests | Behavior/Specifications |
| **Language** | Technical | Natural language (Given-When-Then) |
| **Audience** | Developers | Developers, QA, Business |
| **Scope** | Unit level | Feature/Scenario level |

**TDD Example:**

```typescript
// TDD - Technical, developer-focused
describe('ShoppingCart', () => {
  it('should calculate total', () => {
    const cart = new ShoppingCart();
    cart.addItem({ price: 10, quantity: 2 });
    expect(cart.getTotal()).toBe(20);
  });
});
```

**BDD Example:**

```typescript
// BDD - Behavior-focused, readable by non-developers
describe('Shopping Cart', () => {
  it('should calculate total price when items are added', () => {
    // Given: I have an empty shopping cart
    const cart = new ShoppingCart();
    
    // When: I add 2 items costing $10 each
    cart.addItem({ price: 10, quantity: 2 });
    
    // Then: The total should be $20
    expect(cart.getTotal()).toBe(20);
  });
});
```

---

## Q5: How do you handle dependencies in TDD?

**Answer:**

Use test doubles (mocks, stubs, spies) to isolate the code under test from its dependencies.

**Example:**

```typescript
// Without TDD - hard to test due to dependencies
class OrderService {
  constructor(
    private paymentService: PaymentService,
    private emailService: EmailService,
    private inventoryService: InventoryService
  ) {}

  async processOrder(order: Order): Promise<void> {
    // Complex logic with multiple dependencies
  }
}

// With TDD - use mocks for dependencies
describe('OrderService', () => {
  let orderService: OrderService;
  let mockPaymentService: jest.Mocked<PaymentService>;
  let mockEmailService: jest.Mocked<EmailService>;
  let mockInventoryService: jest.Mocked<InventoryService>;

  beforeEach(() => {
    mockPaymentService = {
      charge: jest.fn().mockResolvedValue({ success: true })
    } as any;
    
    mockEmailService = {
      send: jest.fn().mockResolvedValue(undefined)
    } as any;
    
    mockInventoryService = {
      checkStock: jest.fn().mockResolvedValue(true),
      reduceStock: jest.fn().mockResolvedValue(undefined)
    } as any;

    orderService = new OrderService(
      mockPaymentService,
      mockEmailService,
      mockInventoryService
    );
  });

  it('should process order successfully', async () => {
    const order = { id: 1, items: [{ id: 1, quantity: 2 }] };
    
    await orderService.processOrder(order);
    
    expect(mockPaymentService.charge).toHaveBeenCalled();
    expect(mockEmailService.send).toHaveBeenCalled();
    expect(mockInventoryService.reduceStock).toHaveBeenCalled();
  });
});
```

---

## Q6: What is the "Fake It Till You Make It" approach in TDD?

**Answer:**

"Fake It Till You Make It" means writing the simplest possible implementation to make a test pass, even if it's not the final solution. This helps maintain the TDD rhythm.

**Example:**

```typescript
// Test
it('should return sum of numbers', () => {
  expect(sum([1, 2, 3])).toBe(6);
});

// Fake it - hardcoded return
function sum(numbers: number[]): number {
  return 6; // Simplest thing that works
}

// Add another test
it('should return sum of different numbers', () => {
  expect(sum([2, 3, 4])).toBe(9);
});

// Now implement properly
function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

**Benefits:**
- Maintains TDD rhythm
- Forces you to write more tests
- Prevents over-engineering
- Builds confidence incrementally

---

## Q7: How do you test edge cases in TDD?

**Answer:**

Write tests for edge cases as you discover them. TDD naturally encourages thinking about edge cases.

**Example:**

```typescript
describe('StringCalculator', () => {
  // Happy path
  it('should add two numbers', () => {
    expect(add('1,2')).toBe(3);
  });

  // Edge case: empty string
  it('should return 0 for empty string', () => {
    expect(add('')).toBe(0);
  });

  // Edge case: single number
  it('should return number for single number', () => {
    expect(add('5')).toBe(5);
  });

  // Edge case: negative numbers
  it('should throw error for negative numbers', () => {
    expect(() => add('1,-2')).toThrow('Negatives not allowed: -2');
  });

  // Edge case: large numbers
  it('should ignore numbers greater than 1000', () => {
    expect(add('2,1001')).toBe(2);
  });

  // Edge case: newlines as delimiters
  it('should handle newlines as delimiters', () => {
    expect(add('1\n2,3')).toBe(6);
  });
});
```

---

## Q8: What is the difference between TDD and writing tests after code?

**Answer:**

| Aspect | TDD | Tests After Code |
|--------|-----|------------------|
| **Timing** | Tests before code | Tests after code |
| **Design Impact** | Influences design | Tests adapt to design |
| **Coverage** | Natural coverage | May miss edge cases |
| **Refactoring** | Safe refactoring | Risky refactoring |
| **Mindset** | Design-first | Implementation-first |

**TDD Approach:**

```typescript
// 1. Write test first (defines requirements)
it('should validate email format', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
});

// 2. Write implementation
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Tests After Code:**

```typescript
// 1. Write implementation first
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 2. Write tests (may miss edge cases)
it('should validate email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});
```

---

## Q9: How do you apply TDD to legacy code?

**Answer:**

Use the "Strangler Fig Pattern" - gradually add tests to legacy code before refactoring.

**Approach:**

1. **Characterization Tests**: Write tests that document current behavior
2. **Refactor Safely**: Refactor with test safety net
3. **Add New Features with TDD**: Use TDD for new code

**Example:**

```typescript
// Legacy code (no tests)
function calculatePrice(items: any[]): number {
  // Complex, untested legacy code
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
    if (item.discount) {
      total -= item.discount;
    }
  }
  return total;
}

// Step 1: Write characterization test
describe('calculatePrice (legacy)', () => {
  it('should calculate price as it currently does', () => {
    const items = [
      { price: 10, quantity: 2, discount: 5 },
      { price: 20, quantity: 1 }
    ];
    const result = calculatePrice(items);
    // Document current behavior
    expect(result).toBe(35); // (10*2-5) + (20*1) = 35
  });
});

// Step 2: Refactor safely with tests
function calculatePrice(items: Item[]): number {
  return items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const discount = item.discount || 0;
    return total + itemTotal - discount;
  }, 0);
}
```

---

## Q10: What are common TDD mistakes to avoid?

**Answer:**

1. **Writing too many tests at once**: Write one test, make it pass, refactor, repeat
2. **Skipping the refactor step**: Always refactor after green
3. **Testing implementation details**: Test behavior, not implementation
4. **Over-mocking**: Don't mock everything; use real objects when possible
5. **Not running tests frequently**: Run tests after each small change
6. **Writing complex tests**: Keep tests simple and focused
7. **Ignoring failing tests**: Never commit with failing tests

**Example - What NOT to do:**

```typescript
// ❌ BAD: Testing implementation details
it('should call internal method', () => {
  const spy = jest.spyOn(service, 'internalMethod');
  service.doSomething();
  expect(spy).toHaveBeenCalled(); // Testing how, not what
});

// ✅ GOOD: Testing behavior
it('should process order', () => {
  const result = service.processOrder(order);
  expect(result.status).toBe('processed'); // Testing what, not how
});
```

