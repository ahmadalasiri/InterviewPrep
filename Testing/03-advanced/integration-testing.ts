/**
 * Integration Testing Examples
 * 
 * Integration tests verify that multiple components work together correctly.
 */

// Example 1: User Registration Flow
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Database {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export interface EmailService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
}

export class UserRegistrationService {
  constructor(
    private db: Database,
    private emailService: EmailService
  ) {}

  async register(email: string, name: string): Promise<User> {
    // Check if user already exists
    const existing = await this.db.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    // Create new user
    const user: User = {
      id: Date.now(),
      email,
      name,
      createdAt: new Date(),
    };

    const savedUser = await this.db.save(user);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(email, name);

    return savedUser;
  }
}

// Example 2: Order Processing System
export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface PaymentService {
  charge(amount: number, userId: number): Promise<{ success: boolean; transactionId: string }>;
}

export interface InventoryService {
  checkStock(productId: number, quantity: number): Promise<boolean>;
  reduceStock(productId: number, quantity: number): Promise<void>;
}

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  updateStatus(id: string, status: Order['status']): Promise<void>;
}

export class OrderProcessingService {
  constructor(
    private orderRepo: OrderRepository,
    private paymentService: PaymentService,
    private inventoryService: InventoryService
  ) {}

  async processOrder(order: Order): Promise<Order> {
    // Check inventory
    for (const item of order.items) {
      const inStock = await this.inventoryService.checkStock(item.productId, item.quantity);
      if (!inStock) {
        await this.orderRepo.updateStatus(order.id, 'failed');
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    // Process payment
    const payment = await this.paymentService.charge(order.total, order.userId);
    if (!payment.success) {
      await this.orderRepo.updateStatus(order.id, 'failed');
      throw new Error('Payment failed');
    }

    // Reduce inventory
    for (const item of order.items) {
      await this.inventoryService.reduceStock(item.productId, item.quantity);
    }

    // Update order status
    await this.orderRepo.updateStatus(order.id, 'completed');

    return { ...order, status: 'completed' };
  }
}

// Example 3: API Integration
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    const data = await response.json();
    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }
}

export class UserApiService {
  constructor(private apiClient: ApiClient) {}

  async getUser(id: number): Promise<User> {
    const response = await this.apiClient.get<User>(`/users/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    return response.data;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const response = await this.apiClient.post<User>('/users', userData);
    if (response.status !== 201) {
      throw new Error(`Failed to create user: ${response.status}`);
    }
    return response.data;
  }
}

