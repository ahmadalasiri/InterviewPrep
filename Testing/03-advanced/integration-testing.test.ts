/**
 * Integration Testing Examples - Test File
 * 
 * Integration tests verify multiple components working together.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  UserRegistrationService,
  OrderProcessingService,
  UserApiService,
  ApiClient,
  type User,
  type Database,
  type EmailService,
  type PaymentService,
  type InventoryService,
  type OrderRepository,
  type Order,
} from './integration-testing';

describe('UserRegistrationService Integration', () => {
  let service: UserRegistrationService;
  let mockDb: Database;
  let mockEmailService: EmailService;

  beforeEach(() => {
    const users: User[] = [];
    
    mockDb = {
      save: async (user: User) => {
        users.push(user);
        return user;
      },
      findByEmail: async (email: string) => {
        return users.find(u => u.email === email) || null;
      },
    };

    mockEmailService = {
      sendWelcomeEmail: async (email: string, name: string) => {
        // Simulate email sending
      },
    };

    service = new UserRegistrationService(mockDb, mockEmailService);
  });

  it('should register new user and send welcome email', async () => {
    const user = await service.register('test@example.com', 'Test User');

    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.id).toBeDefined();

    // Verify user was saved
    const saved = await mockDb.findByEmail('test@example.com');
    expect(saved).not.toBeNull();
  });

  it('should throw error if user already exists', async () => {
    await service.register('test@example.com', 'Test User');

    await expect(
      service.register('test@example.com', 'Another User')
    ).rejects.toThrow('User already exists');
  });
});

describe('OrderProcessingService Integration', () => {
  let service: OrderProcessingService;
  let mockOrderRepo: OrderRepository;
  let mockPaymentService: PaymentService;
  let mockInventoryService: InventoryService;
  let orders: Order[];
  let inventory: Map<number, number>;

  beforeEach(() => {
    orders = [];
    inventory = new Map([
      [1, 10], // productId: stock
      [2, 5],
    ]);

    mockOrderRepo = {
      save: async (order: Order) => {
        orders.push(order);
        return order;
      },
      findById: async (id: string) => {
        return orders.find(o => o.id === id) || null;
      },
      updateStatus: async (id: string, status: Order['status']) => {
        const order = orders.find(o => o.id === id);
        if (order) {
          order.status = status;
        }
      },
    };

    mockPaymentService = {
      charge: async (amount: number, userId: number) => {
        return { success: true, transactionId: `txn-${Date.now()}` };
      },
    };

    mockInventoryService = {
      checkStock: async (productId: number, quantity: number) => {
        const stock = inventory.get(productId) || 0;
        return stock >= quantity;
      },
      reduceStock: async (productId: number, quantity: number) => {
        const current = inventory.get(productId) || 0;
        inventory.set(productId, current - quantity);
      },
    };

    service = new OrderProcessingService(
      mockOrderRepo,
      mockPaymentService,
      mockInventoryService
    );
  });

  it('should process order successfully', async () => {
    const order: Order = {
      id: 'order-1',
      userId: 1,
      items: [
        { productId: 1, quantity: 2, price: 10 },
        { productId: 2, quantity: 1, price: 5 },
      ],
      total: 25,
      status: 'pending',
    };

    await mockOrderRepo.save(order);
    const result = await service.processOrder(order);

    expect(result.status).toBe('completed');
    expect(inventory.get(1)).toBe(8); // 10 - 2
    expect(inventory.get(2)).toBe(4); // 5 - 1
  });

  it('should fail when inventory is insufficient', async () => {
    const order: Order = {
      id: 'order-2',
      userId: 1,
      items: [
        { productId: 1, quantity: 100, price: 10 }, // More than available
      ],
      total: 1000,
      status: 'pending',
    };

    await mockOrderRepo.save(order);

    await expect(service.processOrder(order)).rejects.toThrow('Insufficient stock');
    
    const updatedOrder = await mockOrderRepo.findById('order-2');
    expect(updatedOrder?.status).toBe('failed');
  });

  it('should fail when payment fails', async () => {
    mockPaymentService.charge = async () => {
      return { success: false, transactionId: '' };
    };

    const order: Order = {
      id: 'order-3',
      userId: 1,
      items: [{ productId: 1, quantity: 1, price: 10 }],
      total: 10,
      status: 'pending',
    };

    await mockOrderRepo.save(order);

    await expect(service.processOrder(order)).rejects.toThrow('Payment failed');
    
    const updatedOrder = await mockOrderRepo.findById('order-3');
    expect(updatedOrder?.status).toBe('failed');
  });
});

describe('UserApiService Integration', () => {
  it('should fetch user from API', async () => {
    // In a real integration test, you might use a test server
    // For this example, we'll mock the fetch
    const mockFetch = async (url: string) => {
      if (url.includes('/users/1')) {
        return {
          json: async () => ({ id: 1, email: 'test@example.com', name: 'Test' }),
          status: 200,
          headers: new Headers(),
        } as Response;
      }
      throw new Error('Not found');
    };

    global.fetch = mockFetch as any;

    const apiClient = new ApiClient('http://api.example.com');
    const userService = new UserApiService(apiClient);

    const user = await userService.getUser(1);

    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
  });
});

