/**
 * Unit Testing Examples - Test File
 * 
 * Run with: npm test or vitest
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  Calculator,
  validateEmail,
  StringUtils,
  ArrayOperations,
  UserService,
} from './unit-testing';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    it('should add zero', () => {
      expect(calculator.add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(calculator.subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
    });

    it('should multiply by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero is not allowed');
    });
  });
});

describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('should return false for email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  it('should return false for email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(validateEmail(null as any)).toBe(false);
    expect(validateEmail(undefined as any)).toBe(false);
  });
});

describe('StringUtils', () => {
  describe('reverse', () => {
    it('should reverse a string', () => {
      expect(StringUtils.reverse('hello')).toBe('olleh');
    });

    it('should handle empty string', () => {
      expect(StringUtils.reverse('')).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(StringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should handle already capitalized', () => {
      expect(StringUtils.capitalize('Hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(StringUtils.capitalize('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(StringUtils.truncate('This is a long string', 10)).toBe('This is a ...');
    });

    it('should not truncate short strings', () => {
      expect(StringUtils.truncate('Short', 10)).toBe('Short');
    });
  });
});

describe('ArrayOperations', () => {
  describe('findMax', () => {
    it('should find maximum number', () => {
      expect(ArrayOperations.findMax([1, 5, 3, 9, 2])).toBe(9);
    });

    it('should throw error for empty array', () => {
      expect(() => ArrayOperations.findMax([])).toThrow('Array cannot be empty');
    });
  });

  describe('findMin', () => {
    it('should find minimum number', () => {
      expect(ArrayOperations.findMin([1, 5, 3, 9, 2])).toBe(1);
    });
  });

  describe('sum', () => {
    it('should sum all numbers', () => {
      expect(ArrayOperations.sum([1, 2, 3, 4])).toBe(10);
    });

    it('should return 0 for empty array', () => {
      expect(ArrayOperations.sum([])).toBe(0);
    });
  });

  describe('average', () => {
    it('should calculate average', () => {
      expect(ArrayOperations.average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should throw error for empty array', () => {
      expect(() => ArrayOperations.average([])).toThrow('Cannot calculate average of empty array');
    });
  });
});

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('create', () => {
    it('should create a new user', () => {
      const user = userService.create({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      expect(user.id).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        userService.create({
          name: 'John',
          email: 'invalid-email',
          age: 30,
        });
      }).toThrow('Invalid email format');
    });

    it('should throw error for invalid age', () => {
      expect(() => {
        userService.create({
          name: 'John',
          email: 'john@example.com',
          age: -5,
        });
      }).toThrow('Invalid age');
    });
  });

  describe('findById', () => {
    it('should find user by id', () => {
      const user = userService.create({
        name: 'John',
        email: 'john@example.com',
        age: 30,
      });

      const found = userService.findById(user.id);
      expect(found).toEqual(user);
    });

    it('should return undefined for non-existent id', () => {
      expect(userService.findById(999)).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', () => {
      userService.create({
        name: 'John',
        email: 'john@example.com',
        age: 30,
      });

      const found = userService.findByEmail('john@example.com');
      expect(found?.email).toBe('john@example.com');
    });
  });

  describe('delete', () => {
    it('should delete user by id', () => {
      const user = userService.create({
        name: 'John',
        email: 'john@example.com',
        age: 30,
      });

      const deleted = userService.delete(user.id);
      expect(deleted).toBe(true);
      expect(userService.findById(user.id)).toBeUndefined();
    });

    it('should return false for non-existent id', () => {
      expect(userService.delete(999)).toBe(false);
    });
  });
});

