/**
 * TDD Examples - Test File
 * 
 * These tests were written BEFORE the implementation (TDD approach).
 * Follow the Red-Green-Refactor cycle.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  StringCalculator,
  fizzBuzz,
  PasswordValidator,
  ShoppingCart,
  Stack,
} from './tdd-examples';

describe('StringCalculator (TDD Kata)', () => {
  let calculator: StringCalculator;

  beforeEach(() => {
    calculator = new StringCalculator();
  });

  // Step 1: Empty string returns 0
  it('should return 0 for empty string', () => {
    expect(calculator.add('')).toBe(0);
  });

  // Step 2: Single number returns that number
  it('should return number for single number', () => {
    expect(calculator.add('5')).toBe(5);
  });

  // Step 3: Two numbers separated by comma
  it('should add two numbers separated by comma', () => {
    expect(calculator.add('1,2')).toBe(3);
  });

  // Step 4: Multiple numbers
  it('should add multiple numbers', () => {
    expect(calculator.add('1,2,3,4')).toBe(10);
  });

  // Step 5: Handle newlines as delimiters
  it('should handle newlines as delimiters', () => {
    expect(calculator.add('1\n2,3')).toBe(6);
  });

  // Step 6: Custom delimiters
  it('should support custom delimiters', () => {
    expect(calculator.add('//;\n1;2')).toBe(3);
  });

  // Step 7: Negative numbers throw error
  it('should throw error for negative numbers', () => {
    expect(() => calculator.add('1,-2,3')).toThrow('Negatives not allowed: -2');
  });

  it('should list all negative numbers in error', () => {
    expect(() => calculator.add('1,-2,-3')).toThrow('Negatives not allowed: -2, -3');
  });

  // Step 8: Numbers greater than 1000 are ignored
  it('should ignore numbers greater than 1000', () => {
    expect(calculator.add('2,1001')).toBe(2);
  });
});

describe('FizzBuzz (TDD Classic)', () => {
  it('should return number as string for non-multiples', () => {
    expect(fizzBuzz(1)).toBe('1');
    expect(fizzBuzz(2)).toBe('2');
  });

  it('should return Fizz for multiples of 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
    expect(fizzBuzz(6)).toBe('Fizz');
  });

  it('should return Buzz for multiples of 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
    expect(fizzBuzz(10)).toBe('Buzz');
  });

  it('should return FizzBuzz for multiples of 15', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
    expect(fizzBuzz(30)).toBe('FizzBuzz');
  });

  it('should throw error for non-positive numbers', () => {
    expect(() => fizzBuzz(0)).toThrow('Number must be positive');
    expect(() => fizzBuzz(-5)).toThrow('Number must be positive');
  });
});

describe('PasswordValidator (TDD)', () => {
  let validator: PasswordValidator;

  beforeEach(() => {
    validator = new PasswordValidator();
  });

  it('should return valid for strong password', () => {
    const result = validator.validate('StrongP@ss1');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should require minimum 8 characters', () => {
    const result = validator.validate('Short1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  it('should require uppercase letter', () => {
    const result = validator.validate('lowercase1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should require lowercase letter', () => {
    const result = validator.validate('UPPERCASE1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should require number', () => {
    const result = validator.validate('NoNumber!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('should require special character', () => {
    const result = validator.validate('NoSpecial1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('should return all errors for invalid password', () => {
    const result = validator.validate('weak');
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('ShoppingCart (TDD)', () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  it('should start empty', () => {
    expect(cart.getItemCount()).toBe(0);
    expect(cart.getTotal()).toBe(0);
  });

  it('should add item to cart', () => {
    cart.addItem({ name: 'Apple', price: 1.50, quantity: 2 });
    expect(cart.getItemCount()).toBe(2);
  });

  it('should calculate total correctly', () => {
    cart.addItem({ name: 'Apple', price: 1.50, quantity: 2 });
    cart.addItem({ name: 'Banana', price: 0.75, quantity: 3 });
    expect(cart.getTotal()).toBe(5.25); // (1.50 * 2) + (0.75 * 3)
  });

  it('should update quantity for duplicate items', () => {
    cart.addItem({ name: 'Apple', price: 1.50, quantity: 2 });
    cart.addItem({ name: 'Apple', price: 1.50, quantity: 3 });
    expect(cart.getItemCount()).toBe(5);
  });

  it('should remove item from cart', () => {
    cart.addItem({ name: 'Apple', price: 1.50, quantity: 2 });
    const items = cart.getItems();
    const removed = cart.removeItem(items[0].id);
    expect(removed).toBe(true);
    expect(cart.getItemCount()).toBe(0);
  });

  it('should return false when removing non-existent item', () => {
    expect(cart.removeItem('non-existent')).toBe(false);
  });

  it('should clear all items', () => {
    cart.addItem({ name: 'Apple', price: 1.50, quantity: 2 });
    cart.clear();
    expect(cart.getItemCount()).toBe(0);
    expect(cart.getTotal()).toBe(0);
  });

  it('should throw error for negative price', () => {
    expect(() => {
      cart.addItem({ name: 'Apple', price: -1.50, quantity: 2 });
    }).toThrow('Item price cannot be negative');
  });

  it('should throw error for zero or negative quantity', () => {
    expect(() => {
      cart.addItem({ name: 'Apple', price: 1.50, quantity: 0 });
    }).toThrow('Item quantity must be positive');
  });
});

describe('Stack (TDD)', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  it('should start empty', () => {
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
  });

  it('should push item onto stack', () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
    expect(stack.size()).toBe(1);
  });

  it('should pop item from stack', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it('should return undefined when popping empty stack', () => {
    expect(stack.pop()).toBeUndefined();
  });

  it('should peek at top item without removing', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it('should return undefined when peeking empty stack', () => {
    expect(stack.peek()).toBeUndefined();
  });

  it('should clear all items', () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
  });

  it('should maintain LIFO order', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.isEmpty()).toBe(true);
  });
});

