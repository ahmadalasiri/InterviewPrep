/**
 * TDD Examples
 * 
 * These examples demonstrate Test-Driven Development.
 * Tests should be written BEFORE the implementation.
 */

// Example 1: String Calculator (Classic TDD Kata)
// Tests: See tdd-examples.test.ts
export class StringCalculator {
  add(numbers: string): number {
    if (numbers === '') return 0;

    // Handle custom delimiters
    let delimiter = /[,\n]/;
    let numberString = numbers;

    if (numbers.startsWith('//')) {
      const delimiterMatch = numbers.match(/^\/\/(.+)\n/);
      if (delimiterMatch) {
        delimiter = new RegExp(delimiterMatch[1]);
        numberString = numbers.substring(delimiterMatch[0].length);
      }
    }

    const numberArray = numberString
      .split(delimiter)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));

    // Check for negatives
    const negatives = numberArray.filter(n => n < 0);
    if (negatives.length > 0) {
      throw new Error(`Negatives not allowed: ${negatives.join(', ')}`);
    }

    // Ignore numbers greater than 1000
    const filteredNumbers = numberArray.filter(n => n <= 1000);

    return filteredNumbers.reduce((sum, n) => sum + n, 0);
  }
}

// Example 2: FizzBuzz (TDD Classic)
// Tests: See tdd-examples.test.ts
export function fizzBuzz(n: number): string {
  if (n <= 0) {
    throw new Error('Number must be positive');
  }

  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  
  return n.toString();
}

// Example 3: Password Validator
// Tests: See tdd-examples.test.ts
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PasswordValidator {
  validate(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Example 4: Shopping Cart (TDD Example)
// Tests: See tdd-examples.test.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class ShoppingCart {
  private items: CartItem[] = [];

  addItem(item: Omit<CartItem, 'id'>): void {
    if (item.price < 0) {
      throw new Error('Item price cannot be negative');
    }
    if (item.quantity <= 0) {
      throw new Error('Item quantity must be positive');
    }

    const existingItem = this.items.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push({
        id: Date.now().toString(),
        ...item,
      });
    }
  }

  removeItem(itemId: string): boolean {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear(): void {
    this.items = [];
  }

  getItems(): CartItem[] {
    return [...this.items];
  }
}

// Example 5: Stack Data Structure (TDD)
// Tests: See tdd-examples.test.ts
export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

