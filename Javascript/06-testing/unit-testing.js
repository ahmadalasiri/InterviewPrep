// Unit Testing Examples (Jest)

// Functions to test
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function isEven(n) {
  return n % 2 === 0;
}

function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John Doe' });
    }, 100);
  });
}

// Jest Tests
describe('Math Operations', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  
  test('subtracts 5 - 2 to equal 3', () => {
    expect(subtract(5, 2)).toBe(3);
  });
  
  test('checks if number is even', () => {
    expect(isEven(4)).toBe(true);
    expect(isEven(5)).toBe(false);
  });
});

describe('Async Operations', () => {
  test('fetches user data', async () => {
    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'John Doe' });
  });
});

// To run tests:
// npm test

/* Example Test Output:
 PASS  ./unit-testing.test.js
  Math Operations
    ✓ adds 1 + 2 to equal 3 (2ms)
    ✓ subtracts 5 - 2 to equal 3
    ✓ checks if number is even (1ms)
  Async Operations
    ✓ fetches user data (103ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
*/

module.exports = { add, subtract, isEven, fetchUser };

