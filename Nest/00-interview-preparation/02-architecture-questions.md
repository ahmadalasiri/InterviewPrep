# NestJS Architecture & Design Questions

## Table of Contents

- [Modules](#modules)
- [Dependency Injection](#dependency-injection)
- [Custom Decorators](#custom-decorators)
- [Exception Filters](#exception-filters)
- [Lifecycle Events](#lifecycle-events)

---

## Modules

### Q1: What are modules in NestJS and why are they important?

**Answer:**

Modules are the fundamental building blocks of NestJS architecture. They organize the application into cohesive blocks of functionality with clear boundaries.

**Module Structure:**

```typescript
@Module({
  imports: [],      // Other modules
  controllers: [],  // Controllers in this module
  providers: [],    // Providers available in this module
  exports: [],      // Providers to make available to other modules
})
export class FeatureModule {}
```

**Benefits:**

- **Encapsulation**: Keep related code together
- **Reusability**: Export and reuse functionality
- **Lazy Loading**: Load modules on demand
- **Clear Dependencies**: Explicit imports and exports
- **Scalability**: Easy to add new features

**Example:**

```typescript
// users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService], // Make service available to other modules
})
export class UsersModule {}

// app.module.ts
@Module({
  imports: [
    UsersModule,  // Import entire module
    AuthModule,
    DatabaseModule,
  ],
})
export class AppModule {}
```

---

### Q2: What is the difference between imports and providers in a module?

**Answer:**

**Imports:**

- Brings in **other modules**
- Makes exported providers from those modules available
- Module-level dependency

```typescript
@Module({
  imports: [
    UsersModule,        // Import another module
    TypeOrmModule.forFeature([User]),  // Import configured module
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
```

**Providers:**

- Defines **services/classes** within this module
- Makes them available for dependency injection
- Class-level dependency

```typescript
@Module({
  providers: [
    UsersService,       // Regular provider
    UsersRepository,
    {
      provide: 'CONFIG',  // Custom provider
      useValue: { apiKey: '123' },
    },
  ],
})
export class UsersModule {}
```

**Example showing both:**

```typescript
@Module({
  imports: [
    // Import modules
    TypeOrmModule.forFeature([User]),  // Database module
    LoggerModule,                       // Logging module
  ],
  providers: [
    // Define providers
    UsersService,        // Service in this module
    UsersRepository,     // Repository in this module
  ],
  controllers: [UsersController],
  exports: [UsersService],  // Export to other modules
})
export class UsersModule {}
```

---

### Q3: What are dynamic modules and how do you create them?

**Answer:**

Dynamic modules are modules that can be configured with different options each time they're imported. They're created using static methods that return a DynamicModule.

**Creating a Dynamic Module:**

```typescript
import { Module, DynamicModule } from '@nestjs/common';

// Options interface
export interface DatabaseModuleOptions {
  host: string;
  port: number;
  username: string;
  password: string;
}

@Module({})
export class DatabaseModule {
  // Synchronous configuration
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
      global: true,  // Make it global
    };
  }

  // Asynchronous configuration
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<DatabaseModuleOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: DatabaseModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
```

**Usage:**

```typescript
// Synchronous
@Module({
  imports: [
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
    }),
  ],
})
export class AppModule {}

// Asynchronous
@Module({
  imports: [
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

---

### Q4: What is the global module and when should you use it?

**Answer:**

Global modules make their providers available everywhere without needing to import the module in each feature module.

**Creating a Global Module:**

```typescript
import { Module, Global } from '@nestjs/common';

@Global()  // Mark as global
@Module({
  providers: [LoggerService, ConfigService],
  exports: [LoggerService, ConfigService],
})
export class CoreModule {}
```

**Usage:**

```typescript
// app.module.ts - Import once
@Module({
  imports: [CoreModule],
})
export class AppModule {}

// users.module.ts - No need to import CoreModule
@Module({
  controllers: [UsersController],
  providers: [UsersService],  // Can inject LoggerService directly
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private logger: LoggerService) {}  // Works without importing CoreModule
}
```

**When to use:**

✅ Configuration services
✅ Logging services
✅ Database connections
✅ Cache managers
✅ Common utilities

**When NOT to use:**

❌ Don't make everything global
❌ Reduces module isolation
❌ Makes dependencies less explicit

---

## Dependency Injection

### Q5: What are the different ways to configure providers?

**Answer:**

NestJS supports multiple provider configuration patterns:

**1. Class Provider (Standard):**

```typescript
@Module({
  providers: [UsersService],  // Shorthand
  // Equivalent to:
  // providers: [{ provide: UsersService, useClass: UsersService }],
})
export class UsersModule {}
```

**2. Value Provider:**

```typescript
const configValue = {
  apiKey: '12345',
  apiUrl: 'https://api.example.com',
};

@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: configValue,
    },
  ],
})
export class AppModule {}

// Usage
@Injectable()
export class ApiService {
  constructor(@Inject('CONFIG') private config: any) {
    console.log(this.config.apiKey);
  }
}
```

**3. Factory Provider:**

```typescript
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const connection = await createConnection({
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
        });
        return connection;
      },
      inject: [ConfigService],  // Dependencies
    },
  ],
})
export class DatabaseModule {}
```

**4. Class Provider with useClass:**

```typescript
// Abstract class
abstract class Logger {
  abstract log(message: string): void;
}

// Implementations
class ConsoleLogger extends Logger {
  log(message: string) {
    console.log(message);
  }
}

class FileLogger extends Logger {
  log(message: string) {
    // Write to file
  }
}

@Module({
  providers: [
    {
      provide: Logger,
      useClass: process.env.NODE_ENV === 'production' 
        ? FileLogger 
        : ConsoleLogger,
    },
  ],
})
export class AppModule {}
```

**5. Existing Provider (Alias):**

```typescript
@Module({
  providers: [
    LoggerService,
    {
      provide: 'AliasedLogger',
      useExisting: LoggerService,  // Use existing provider
    },
  ],
})
export class AppModule {}
```

---

### Q6: What are provider scopes and when should you use each?

**Answer:**

NestJS supports three provider scopes:

**1. DEFAULT (Singleton):**

- Single instance shared across entire application
- Created on application startup
- Most efficient

```typescript
@Injectable()
export class UsersService {
  // Default scope - singleton
}
```

**2. REQUEST:**

- New instance for each incoming request
- Destroyed when request completes
- Useful for request-specific data

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestLogger {
  private logs: string[] = [];
  
  log(message: string) {
    this.logs.push(message);
  }
  
  getLogs() {
    return this.logs;
  }
}

// Can inject REQUEST object
@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

**3. TRANSIENT:**

- New instance every time it's injected
- Not shared between consumers
- Each consumer gets its own instance

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  constructor() {
    console.log('New instance created');
  }
}
```

**Comparison:**

```typescript
// DEFAULT scope
@Injectable()
export class SingletonService {}

// REQUEST scope
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}

// TRANSIENT scope
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}
```

**When to use:**

| Scope     | Use Case                                      | Performance |
| --------- | --------------------------------------------- | ----------- |
| DEFAULT   | Stateless services, utilities                 | Best        |
| REQUEST   | Request-specific data, user context           | Moderate    |
| TRANSIENT | Need isolated instances per injection         | Lower       |

**Important Notes:**

- REQUEST-scoped providers affect performance
- REQUEST scope bubbles up the injection chain
- Can't inject REQUEST-scoped provider into DEFAULT-scoped provider

---

### Q7: How do you handle circular dependencies?

**Answer:**

Circular dependencies occur when two classes depend on each other. NestJS provides solutions:

**Problem:**

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private postsService: PostsService) {}
}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(private usersService: UsersService) {}
}
// ERROR: Circular dependency!
```

**Solution 1: forwardRef()**

```typescript
// users.service.ts
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {}
}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}
}

// Module
@Module({
  providers: [UsersService, PostsService],
  exports: [UsersService, PostsService],
})
export class UsersModule {}
```

**Solution 2: Module forwardRef()**

```typescript
// users.module.ts
@Module({
  imports: [forwardRef(() => PostsModule)],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// posts.module.ts
@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
```

**Solution 3: Refactor (Best Practice)**

```typescript
// Extract common logic to separate service
@Injectable()
export class CommonService {
  // Shared logic between users and posts
}

@Injectable()
export class UsersService {
  constructor(private commonService: CommonService) {}
}

@Injectable()
export class PostsService {
  constructor(private commonService: CommonService) {}
}
```

**Best Practices:**

1. **Avoid circular dependencies** - Usually indicates design problem
2. **Refactor code** - Extract shared logic to separate service
3. **Use events** - Decouple services using EventEmitter
4. **forwardRef as last resort** - Only when refactoring isn't possible

---

## Custom Decorators

### Q8: How do you create custom decorators in NestJS?

**Answer:**

Custom decorators enhance code reusability and readability.

**1. Parameter Decorator:**

```typescript
// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// Usage
@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard)
  getProfile(@User() user: UserEntity) {
    return user;
  }

  @Get('email')
  getEmail(@User('email') email: string) {
    return { email };
  }
}
```

**2. Combining Decorators:**

```typescript
// auth.decorator.ts
import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}

// Usage
@Controller('admin')
export class AdminController {
  @Get()
  @Auth('admin')  // Combines multiple decorators
  getAdminData() {
    return 'Admin data';
  }
}
```

**3. Custom Property Decorator:**

```typescript
// transform.decorator.ts
export function Uppercase() {
  return function (target: any, propertyKey: string) {
    let value: string;

    const getter = () => value;
    const setter = (newVal: string) => {
      value = newVal?.toUpperCase();
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

// Usage
export class User {
  @Uppercase()
  name: string;
}
```

**4. Method Decorator with Metadata:**

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Usage
@Controller('users')
export class UsersController {
  @Get()
  @Roles('admin', 'moderator')
  findAll() {
    return 'All users';
  }
}

// Accessing metadata in guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return roles.some((role) => user.roles?.includes(role));
  }
}
```

**5. Custom API Documentation Decorator:**

```typescript
// api-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

export const ApiStandardResponse = <TModel extends Type<any>>(
  model: TModel,
  isArray = false,
) => {
  return applyDecorators(
    ApiOkResponse({
      type: model,
      isArray,
      description: 'Successful response',
    }),
  );
};

// Usage
@Controller('users')
export class UsersController {
  @Get()
  @ApiStandardResponse(User, true)
  findAll() {
    return this.usersService.findAll();
  }
}
```

---

## Exception Filters

### Q9: How do you create and use exception filters?

**Answer:**

Exception filters handle exceptions thrown by your application and transform them into proper responses.

**1. Basic Exception Filter:**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Internal server error',
    };

    response.status(status).json(errorResponse);
  }
}
```

**2. Catch All Exceptions:**

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
```

**3. Specific Exception Filter:**

```typescript
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    response.status(401).json({
      statusCode: 401,
      message: 'Unauthorized access',
      timestamp: new Date().toISOString(),
    });
  }
}
```

**4. Usage:**

```typescript
// Apply to specific controller
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {}

// Apply to specific method
@Get()
@UseFilters(HttpExceptionFilter)
findAll() {}

// Apply globally
const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AllExceptionsFilter());

// Apply globally with DI
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
```

**5. With Logging:**

```typescript
@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log error
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof Error ? exception.message : 'Error',
    });
  }
}
```

---

## Lifecycle Events

### Q10: What are lifecycle hooks in NestJS and how do you use them?

**Answer:**

Lifecycle hooks allow you to tap into key moments in the lifecycle of a module, provider, or controller.

**Available Lifecycle Hooks:**

```typescript
import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  BeforeApplicationShutdown,
  OnApplicationShutdown,
} from '@nestjs/common';

@Injectable()
export class UsersService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown {
  
  // Called once module dependencies are resolved
  onModuleInit() {
    console.log('Module initialized');
  }

  // Called after all modules initialized
  onApplicationBootstrap() {
    console.log('Application bootstrapped');
  }

  // Called when module is being destroyed
  onModuleDestroy() {
    console.log('Module being destroyed');
  }

  // Called before application shutdown
  beforeApplicationShutdown(signal?: string) {
    console.log('Before shutdown:', signal);
  }

  // Called after application shutdown
  onApplicationShutdown(signal?: string) {
    console.log('Application shutdown:', signal);
  }
}
```

**Order of Execution:**

```
1. onModuleInit()
2. onApplicationBootstrap()
3. [Application running]
4. beforeApplicationShutdown()
5. onModuleDestroy()
6. onApplicationShutdown()
```

**Common Use Cases:**

**1. Database Connection:**

```typescript
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private connection: any;

  async onModuleInit() {
    this.connection = await createConnection({
      host: 'localhost',
      port: 5432,
    });
    console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.connection.close();
    console.log('Database disconnected');
  }
}
```

**2. Cache Warming:**

```typescript
@Injectable()
export class CacheService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    // Warm up cache on startup
    await this.loadCriticalData();
    console.log('Cache warmed up');
  }

  private async loadCriticalData() {
    // Load frequently accessed data
  }
}
```

**3. Graceful Shutdown:**

```typescript
@Injectable()
export class QueueService
  implements OnModuleDestroy, BeforeApplicationShutdown {
  
  beforeApplicationShutdown(signal?: string) {
    console.log(`Received signal: ${signal}`);
    // Stop accepting new jobs
    this.queue.pause();
  }

  async onModuleDestroy() {
    // Wait for current jobs to complete
    await this.queue.drain();
    await this.queue.close();
    console.log('Queue closed gracefully');
  }
}
```

**4. Module-level Lifecycle:**

```typescript
@Module({
  providers: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  onModuleInit() {
    console.log('UsersModule initialized');
    // Module-level initialization logic
  }
}
```

**Enabling Shutdown Hooks:**

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable shutdown hooks
  app.enableShutdownHooks();
  
  await app.listen(3000);
}
bootstrap();
```

---

This covers architecture and design patterns in NestJS. Practice these concepts and move on to advanced questions!


