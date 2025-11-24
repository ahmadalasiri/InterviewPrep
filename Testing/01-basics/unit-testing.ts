/**
 * Unit Testing Examples
 * 
 * Unit tests verify individual units of code in isolation.
 * This file demonstrates basic unit testing patterns.
 */

// Example 1: Simple Calculator
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }
}

// Example 2: Email Validator
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Example 3: String Utilities
export class StringUtils {
  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  }
}

// Example 4: Array Operations
export class ArrayOperations {
  static findMax(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error('Array cannot be empty');
    }
    return Math.max(...numbers);
  }

  static findMin(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error('Array cannot be empty');
    }
    return Math.min(...numbers);
  }

  static sum(numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
  }

  static average(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error('Cannot calculate average of empty array');
    }
    return this.sum(numbers) / numbers.length;
  }
}

// Example 5: User Model
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export class UserService {
  private users: User[] = [];

  create(userData: Omit<User, 'id'>): User {
    if (!validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    if (userData.age < 0 || userData.age > 150) {
      throw new Error('Invalid age');
    }
    
    const newUser: User = {
      id: this.users.length + 1,
      ...userData,
    };
    
    this.users.push(newUser);
    return newUser;
  }

  findById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  getAll(): User[] {
    return [...this.users];
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

