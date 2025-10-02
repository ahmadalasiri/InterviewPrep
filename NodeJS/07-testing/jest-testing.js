// Testing with Jest
// Install: npm install --save-dev jest @types/jest

console.log("=== Jest Testing Framework ===\n");

// 1. Basic Test Structure
console.log("--- Basic Test Structure ---");

/*
// Example function to test
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// Basic tests
describe('Math operations', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('subtracts 5 - 3 to equal 2', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  test('multiplies 2 * 3 to equal 6', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  test('divides 6 / 2 to equal 3', () => {
    expect(divide(6, 2)).toBe(3);
  });

  test('throws error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
*/

console.log("✓ Basic test structure defined");

// 2. Matchers
console.log("\n--- Jest Matchers ---");

/*
describe('Jest Matchers', () => {
  // Equality
  test('toBe vs toEqual', () => {
    expect(2 + 2).toBe(4); // Strict equality (===)
    expect({ name: 'John' }).toEqual({ name: 'John' }); // Deep equality
  });

  // Truthiness
  test('truthiness', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect('text').toBeDefined();
  });

  // Numbers
  test('numbers', () => {
    expect(4).toBeGreaterThan(3);
    expect(2).toBeLessThan(5);
    expect(4).toBeGreaterThanOrEqual(4);
    expect(2).toBeLessThanOrEqual(2);
    expect(0.1 + 0.2).toBeCloseTo(0.3); // Floating point
  });

  // Strings
  test('strings', () => {
    expect('team').not.toMatch(/I/);
    expect('Christoph').toMatch(/stop/);
    expect('Hello World').toContain('World');
  });

  // Arrays
  test('arrays', () => {
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toContain('banana');
    expect(fruits).toHaveLength(3);
    expect(fruits).toEqual(expect.arrayContaining(['apple', 'banana']));
  });

  // Objects
  test('objects', () => {
    const user = { name: 'John', age: 30 };
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('age', 30);
    expect(user).toMatchObject({ name: 'John' });
  });

  // Exceptions
  test('exceptions', () => {
    function throwError() {
      throw new Error('Error occurred');
    }
    expect(throwError).toThrow();
    expect(throwError).toThrow(Error);
    expect(throwError).toThrow('Error occurred');
  });
});
*/

console.log("✓ Matchers defined");

// 3. Async Testing
console.log("\n--- Async Testing ---");

/*
// Function that returns a promise
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John Doe' });
    }, 100);
  });
}

// Method 1: Using async/await
test('fetches user with async/await', async () => {
  const user = await fetchUser(1);
  expect(user).toEqual({ id: 1, name: 'John Doe' });
});

// Method 2: Using promises
test('fetches user with promises', () => {
  return fetchUser(1).then(user => {
    expect(user).toEqual({ id: 1, name: 'John Doe' });
  });
});

// Method 3: Using resolves/rejects
test('fetches user with resolves', () => {
  return expect(fetchUser(1)).resolves.toEqual({ id: 1, name: 'John Doe' });
});

// Testing rejections
function fetchUserError() {
  return Promise.reject(new Error('User not found'));
}

test('handles errors', async () => {
  await expect(fetchUserError()).rejects.toThrow('User not found');
});
*/

console.log("✓ Async testing defined");

// 4. Setup and Teardown
console.log("\n--- Setup and Teardown ---");

/*
describe('Database tests', () => {
  let db;

  // Runs once before all tests
  beforeAll(async () => {
    console.log('Connecting to database...');
    db = await connectToDatabase();
  });

  // Runs once after all tests
  afterAll(async () => {
    console.log('Closing database connection...');
    await db.close();
  });

  // Runs before each test
  beforeEach(async () => {
    console.log('Clearing database...');
    await db.clear();
  });

  // Runs after each test
  afterEach(async () => {
    console.log('Test completed');
  });

  test('creates user', async () => {
    const user = await db.createUser({ name: 'John' });
    expect(user).toHaveProperty('id');
  });

  test('fetches user', async () => {
    const user = await db.createUser({ name: 'Jane' });
    const fetched = await db.getUser(user.id);
    expect(fetched).toEqual(user);
  });
});
*/

console.log("✓ Setup and teardown defined");

// 5. Mocking
console.log("\n--- Mocking ---");

/*
// Mock functions
test('mock function', () => {
  const mockFn = jest.fn(x => x * 2);
  
  mockFn(2);
  mockFn(4);
  
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith(2);
  expect(mockFn).toHaveBeenCalledWith(4);
  expect(mockFn.mock.results[0].value).toBe(4);
});

// Mock return values
test('mock return values', () => {
  const mockFn = jest.fn();
  
  mockFn.mockReturnValueOnce(10)
        .mockReturnValueOnce(20)
        .mockReturnValue(30);
  
  expect(mockFn()).toBe(10);
  expect(mockFn()).toBe(20);
  expect(mockFn()).toBe(30);
  expect(mockFn()).toBe(30);
});

// Mock promises
test('mock async functions', async () => {
  const mockFn = jest.fn();
  
  mockFn.mockResolvedValue('Success');
  
  const result = await mockFn();
  expect(result).toBe('Success');
});

// Mock modules
jest.mock('./userService');
const userService = require('./userService');

test('mocks module', async () => {
  userService.getUser.mockResolvedValue({ id: 1, name: 'John' });
  
  const user = await userService.getUser(1);
  expect(user.name).toBe('John');
});

// Spy on methods
test('spies on methods', () => {
  const calculator = {
    add: (a, b) => a + b
  };
  
  const spy = jest.spyOn(calculator, 'add');
  
  calculator.add(1, 2);
  
  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(1, 2);
  
  spy.mockRestore(); // Restore original implementation
});
*/

console.log("✓ Mocking defined");

// 6. Testing Express APIs
console.log("\n--- Testing Express APIs ---");

/*
// Install: npm install --save-dev supertest

const request = require('supertest');
const express = require('express');

// Example Express app
const app = express();
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]);
});

app.get('/api/users/:id', (req, res) => {
  const user = { id: parseInt(req.params.id), name: 'John' };
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const user = { id: 1, ...req.body };
  res.status(201).json(user);
});

// Tests
describe('GET /api/users', () => {
  test('returns list of users', async () => {
    const response = await request(app).get('/api/users');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('name');
  });
});

describe('GET /api/users/:id', () => {
  test('returns user by id', async () => {
    const response = await request(app).get('/api/users/1');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'John' });
  });
});

describe('POST /api/users', () => {
  test('creates new user', async () => {
    const newUser = { name: 'Alice', email: 'alice@example.com' };
    
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
  });
});
*/

console.log("✓ Express API testing defined");

// 7. Snapshot Testing
console.log("\n--- Snapshot Testing ---");

/*
// Useful for testing UI components or complex objects
test('snapshot test', () => {
  const data = {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01')
    }
  };
  
  expect(data).toMatchSnapshot();
});

// Inline snapshots
test('inline snapshot', () => {
  expect({ name: 'John' }).toMatchInlineSnapshot(`
    {
      "name": "John",
    }
  `);
});
*/

console.log("✓ Snapshot testing defined");

// 8. Code Coverage
console.log("\n--- Code Coverage ---");

/*
// Run with: jest --coverage

// Coverage configuration in package.json:
{
  "jest": {
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html"],
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js",
      "!src/index.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
*/

console.log("✓ Code coverage configuration defined");

// 9. Jest Configuration
console.log("\n--- Jest Configuration ---");

/*
// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'node', // or 'jsdom' for browser-like environment
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  
  // Mocks
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Transform
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  }
};
*/

console.log("✓ Jest configuration defined");

// 10. Best Practices
console.log("\n--- Testing Best Practices ---");

/*
1. Test Organization:
   - Use describe blocks to group related tests
   - Use clear, descriptive test names
   - Follow AAA pattern: Arrange, Act, Assert

2. Test Independence:
   - Each test should be independent
   - Don't rely on test execution order
   - Clean up after each test

3. Mocking:
   - Mock external dependencies
   - Mock database calls
   - Mock HTTP requests
   - Don't mock the code you're testing

4. Coverage:
   - Aim for high coverage (80%+)
   - Cover edge cases and error paths
   - Don't just test happy paths

5. Async Testing:
   - Always return promises or use async/await
   - Test both success and failure cases
   - Use proper timeout settings

6. Performance:
   - Keep tests fast
   - Use beforeAll/afterAll for expensive setup
   - Run tests in parallel when possible

7. Naming:
   - Use descriptive test names
   - Test file: filename.test.js or filename.spec.js
   - Describe what the test does, not how

8. Assertions:
   - Use specific matchers
   - One logical assertion per test
   - Test behavior, not implementation

9. Error Testing:
   - Test error cases
   - Test validation
   - Test edge cases

10. Maintenance:
    - Keep tests updated
    - Refactor tests with production code
    - Remove obsolete tests
*/

console.log("\n✓ Jest testing concepts completed");
console.log("\nNote: Install required packages:");
console.log("  npm install --save-dev jest");
console.log("  npm install --save-dev supertest (for API testing)");
console.log("\nRun tests:");
console.log("  npm test");
console.log("  npm test -- --coverage");
console.log("  npm test -- --watch");


