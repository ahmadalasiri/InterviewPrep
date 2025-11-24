/**
 * Mocking Examples
 * 
 * Demonstrates different types of test doubles: mocks, stubs, and spies.
 */

// Example 1: Service with dependencies
export interface Database {
  save(data: any): Promise<void>;
  findById(id: number): Promise<any>;
  delete(id: number): Promise<boolean>;
}

export interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

export class UserRepository {
  constructor(private db: Database) {}

  async createUser(userData: { name: string; email: string }): Promise<{ id: number; name: string; email: string }> {
    const user = { id: Date.now(), ...userData };
    await this.db.save(user);
    return user;
  }

  async getUserById(id: number): Promise<any> {
    return await this.db.findById(id);
  }
}

export class NotificationService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    await this.emailService.send(
      userEmail,
      'Welcome!',
      `Hello ${userName}, welcome to our platform!`
    );
  }
}

// Example 2: API Client
export interface HttpClient {
  get(url: string): Promise<any>;
  post(url: string, data: any): Promise<any>;
}

export class ApiClient {
  constructor(private httpClient: HttpClient) {}

  async fetchUser(id: number): Promise<any> {
    return await this.httpClient.get(`/users/${id}`);
  }

  async createUser(userData: any): Promise<any> {
    return await this.httpClient.post('/users', userData);
  }
}

// Example 3: Logger
export interface Logger {
  log(message: string): void;
  error(message: string, error?: Error): void;
  warn(message: string): void;
}

export class PaymentProcessor {
  constructor(private logger: Logger) {}

  processPayment(amount: number, userId: number): boolean {
    try {
      this.logger.log(`Processing payment of $${amount} for user ${userId}`);
      // Payment processing logic
      if (amount <= 0) {
        this.logger.warn(`Invalid payment amount: ${amount}`);
        return false;
      }
      this.logger.log(`Payment processed successfully`);
      return true;
    } catch (error) {
      this.logger.error('Payment processing failed', error as Error);
      return false;
    }
  }
}

// Example 4: Time-dependent code
export class Cache {
  private data: Map<string, { value: any; expiry: number }> = new Map();

  set(key: string, value: any, ttl: number = 1000): void {
    const expiry = Date.now() + ttl;
    this.data.set(key, { value, expiry });
  }

  get(key: string): any | undefined {
    const item = this.data.get(key);
    if (!item) return undefined;
    
    if (Date.now() > item.expiry) {
      this.data.delete(key);
      return undefined;
    }
    
    return item.value;
  }
}

