/**
 * Providers in NestJS
 * 
 * Providers are the fundamental concept in NestJS. They can be injected as
 * dependencies, allowing for loose coupling and better testability.
 */

import { Injectable, Scope, Inject, Optional } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

// ============================================================================
// Basic Service (Provider)
// ============================================================================

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(user: any) {
    const newUser = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userData: any) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
  }

  remove(id: number) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}

// ============================================================================
// Service with Dependencies
// ============================================================================

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }

  error(message: string, trace?: string) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }

  debug(message: string) {
    console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
  }
}

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  private posts = [
    { id: 1, title: 'First Post', userId: 1 },
    { id: 2, title: 'Second Post', userId: 2 },
  ];

  findAll() {
    this.logger.log('Finding all posts');
    return this.posts;
  }

  findByUserId(userId: number) {
    this.logger.log(`Finding posts for user ${userId}`);
    
    // Verify user exists
    this.usersService.findOne(userId);
    
    return this.posts.filter((post) => post.userId === userId);
  }

  create(post: any, userId: number) {
    // Verify user exists
    this.usersService.findOne(userId);

    const newPost = {
      id: this.posts.length + 1,
      ...post,
      userId,
    };
    this.posts.push(newPost);
    
    this.logger.log(`Created post ${newPost.id}`);
    return newPost;
  }
}

// ============================================================================
// Provider Scopes
// ============================================================================

// DEFAULT scope (Singleton) - default behavior
@Injectable()
export class SingletonService {
  private counter = 0;

  increment() {
    this.counter++;
    return this.counter;
  }

  getCount() {
    return this.counter;
  }
}

// REQUEST scope - new instance per request
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  private requestId: string;

  setRequestId(id: string) {
    this.requestId = id;
  }

  getRequestId() {
    return this.requestId;
  }
}

// TRANSIENT scope - new instance every time it's injected
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  constructor() {
    console.log('TransientService instance created');
  }

  private instanceId = Math.random();

  getInstanceId() {
    return this.instanceId;
  }
}

// ============================================================================
// Repository Pattern
// ============================================================================

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UsersRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async save(user: User): Promise<User> {
    const existing = await this.findById(user.id);
    if (existing) {
      const index = this.users.findIndex((u) => u.id === user.id);
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async delete(id: number): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}

@Injectable()
export class UsersRepositoryService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(name: string, email: string): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user: User = {
      id: Date.now(),
      name,
      email,
    };

    return this.usersRepository.save(user);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}

// ============================================================================
// Custom Providers
// ============================================================================

// Value provider
export const CONFIG_OPTIONS = {
  provide: 'CONFIG',
  useValue: {
    apiKey: 'your-api-key',
    apiUrl: 'https://api.example.com',
  },
};

// Factory provider
export const CONNECTION_PROVIDER = {
  provide: 'CONNECTION',
  useFactory: async () => {
    // Simulate async connection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      host: 'localhost',
      port: 5432,
      connected: true,
    };
  },
};

// Class provider
abstract class LoggerInterface {
  abstract log(message: string): void;
}

class ConsoleLogger implements LoggerInterface {
  log(message: string) {
    console.log(message);
  }
}

class FileLogger implements LoggerInterface {
  log(message: string) {
    // Write to file
    console.log(`[FILE] ${message}`);
  }
}

export const LOGGER_PROVIDER = {
  provide: LoggerInterface,
  useClass: process.env.NODE_ENV === 'production' ? FileLogger : ConsoleLogger,
};

// ============================================================================
// Optional Dependencies
// ============================================================================

@Injectable()
export class OptionalService {
  constructor(
    @Optional() @Inject('OPTIONAL_CONFIG') private config?: any,
  ) {
    if (this.config) {
      console.log('Optional config provided:', this.config);
    } else {
      console.log('No optional config provided');
    }
  }
}

// ============================================================================
// Service with Async Initialization
// ============================================================================

@Injectable()
export class DatabaseService {
  private connection: any;
  private isConnected = false;

  async connect() {
    if (!this.isConnected) {
      // Simulate database connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.connection = { connected: true };
      this.isConnected = true;
      console.log('Database connected');
    }
  }

  async disconnect() {
    if (this.isConnected) {
      this.connection = null;
      this.isConnected = false;
      console.log('Database disconnected');
    }
  }

  async query(sql: string): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    console.log('Executing query:', sql);
    return [];
  }
}

// ============================================================================
// Service Composition
// ============================================================================

@Injectable()
export class EmailService {
  send(to: string, subject: string, body: string) {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
  ) {}

  notifyUser(userId: number, message: string) {
    this.logger.log(`Notifying user ${userId}`);
    this.emailService.send('user@example.com', 'Notification', message);
  }

  notifyAdmin(message: string) {
    this.logger.log('Notifying admin');
    this.emailService.send('admin@example.com', 'Admin Alert', message);
  }
}

// ============================================================================
// Export all services
// ============================================================================

export {
  UsersService,
  LoggerService,
  PostsService,
  SingletonService,
  RequestScopedService,
  TransientService,
  UsersRepository,
  UsersRepositoryService,
  OptionalService,
  DatabaseService,
  EmailService,
  NotificationService,
};






