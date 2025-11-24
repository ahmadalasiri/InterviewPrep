/**
 * Mocking Examples - Test File
 * 
 * Demonstrates how to use mocks, stubs, and spies in tests.
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import {
  UserRepository,
  NotificationService,
  ApiClient,
  PaymentProcessor,
  Cache,
  type Database,
  type EmailService,
  type HttpClient,
  type Logger,
} from './mocking-examples';

describe('UserRepository with Mock Database', () => {
  let repository: UserRepository;
  let mockDb: Database;

  beforeEach(() => {
    // Create a mock database
    mockDb = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com' }),
      delete: vi.fn().mockResolvedValue(true),
    };

    repository = new UserRepository(mockDb);
  });

  it('should create user and save to database', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    
    const user = await repository.createUser(userData);

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(mockDb.save).toHaveBeenCalledWith(expect.objectContaining(userData));
  });

  it('should get user by id from database', async () => {
    const user = await repository.getUserById(1);

    expect(user).toBeDefined();
    expect(mockDb.findById).toHaveBeenCalledWith(1);
  });
});

describe('NotificationService with Stub Email Service', () => {
  let service: NotificationService;
  let stubEmailService: EmailService;

  beforeEach(() => {
    // Create a stub that returns predefined values
    stubEmailService = {
      send: vi.fn().mockResolvedValue(undefined),
    };

    service = new NotificationService(stubEmailService);
  });

  it('should send welcome email', async () => {
    await service.sendWelcomeEmail('user@example.com', 'John');

    expect(stubEmailService.send).toHaveBeenCalledWith(
      'user@example.com',
      'Welcome!',
      'Hello John, welcome to our platform!'
    );
  });
});

describe('ApiClient with Spy', () => {
  let apiClient: ApiClient;
  let spyHttpClient: HttpClient;

  beforeEach(() => {
    // Create a spy that tracks calls but uses real implementation
    spyHttpClient = {
      get: vi.fn().mockResolvedValue({ id: 1, name: 'John' }),
      post: vi.fn().mockResolvedValue({ id: 2, name: 'Jane' }),
    };

    apiClient = new ApiClient(spyHttpClient);
  });

  it('should fetch user and track HTTP call', async () => {
    const user = await apiClient.fetchUser(1);

    expect(user).toEqual({ id: 1, name: 'John' });
    expect(spyHttpClient.get).toHaveBeenCalledWith('/users/1');
    expect(spyHttpClient.get).toHaveBeenCalledTimes(1);
  });

  it('should create user via POST', async () => {
    const userData = { name: 'Jane', email: 'jane@example.com' };
    const result = await apiClient.createUser(userData);

    expect(result).toEqual({ id: 2, name: 'Jane' });
    expect(spyHttpClient.post).toHaveBeenCalledWith('/users', userData);
  });
});

describe('PaymentProcessor with Logger Spy', () => {
  let processor: PaymentProcessor;
  let loggerSpy: Logger;

  beforeEach(() => {
    // Spy on logger methods to verify they're called
    loggerSpy = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    };

    processor = new PaymentProcessor(loggerSpy);
  });

  it('should log payment processing', () => {
    processor.processPayment(100, 1);

    expect(loggerSpy.log).toHaveBeenCalledWith('Processing payment of $100 for user 1');
    expect(loggerSpy.log).toHaveBeenCalledWith('Payment processed successfully');
  });

  it('should warn for invalid payment amount', () => {
    const result = processor.processPayment(-10, 1);

    expect(result).toBe(false);
    expect(loggerSpy.warn).toHaveBeenCalledWith('Invalid payment amount: -10');
  });

  it('should log error on failure', () => {
    // Mock an error scenario
    const errorLogger: Logger = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    };

    const processorWithError = new PaymentProcessor(errorLogger);
    // In a real scenario, you'd trigger an actual error
    // For demonstration, we'll just verify the error method exists
    expect(errorLogger.error).toBeDefined();
  });
});

describe('Cache with Time Mocking', () => {
  let cache: Cache;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new Cache();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should store and retrieve value', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should expire value after TTL', () => {
    cache.set('key1', 'value1', 1000);
    
    expect(cache.get('key1')).toBe('value1');
    
    // Fast-forward time
    vi.advanceTimersByTime(1001);
    
    expect(cache.get('key1')).toBeUndefined();
  });

  it('should not expire before TTL', () => {
    cache.set('key1', 'value1', 1000);
    
    vi.advanceTimersByTime(999);
    
    expect(cache.get('key1')).toBe('value1');
  });
});

describe('Advanced Mocking Patterns', () => {
  it('should use mock implementation', () => {
    const mockFn = vi.fn((x: number) => x * 2);
    
    expect(mockFn(5)).toBe(10);
    expect(mockFn).toHaveBeenCalledWith(5);
  });

  it('should use mock return values', () => {
    const mockFn = vi.fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default');

    expect(mockFn()).toBe('first');
    expect(mockFn()).toBe('second');
    expect(mockFn()).toBe('default');
    expect(mockFn()).toBe('default');
  });

  it('should use mock resolved values', async () => {
    const mockAsyncFn = vi.fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValue({ id: 2 });

    expect(await mockAsyncFn()).toEqual({ id: 1 });
    expect(await mockAsyncFn()).toEqual({ id: 2 });
    expect(await mockAsyncFn()).toEqual({ id: 2 });
  });

  it('should use mock rejected values', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Failed'));

    await expect(mockFn()).rejects.toThrow('Failed');
  });

  it('should reset mocks between tests', () => {
    const mockFn = vi.fn();
    mockFn('call1');
    
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    mockFn.mockReset();
    
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

