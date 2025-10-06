# Advanced NestJS Interview Questions

## Table of Contents

- [Guards](#guards)
- [Interceptors](#interceptors)
- [Pipes](#pipes)
- [Middleware](#middleware)
- [Request Lifecycle](#request-lifecycle)

---

## Guards

### Q1: What are Guards and how do they work?

**Answer:**

Guards determine whether a request should be handled by the route handler. They execute **after middleware** but **before interceptors and pipes**.

**Key Points:**

- Implement `CanActivate` interface
- Return `true` (allow) or `false` (deny)
- Have access to `ExecutionContext`
- Used for authentication and authorization

**Basic Guard:**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    // Validate token, session, etc.
    return !!request.headers.authorization;
  }
}
```

**JWT Authentication Guard:**

```typescript
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
```

**Role-Based Guard:**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Usage
@Controller('admin')
export class AdminController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminData() {
    return 'Admin data';
  }
}
```

**Global Guard:**

```typescript
// main.ts
app.useGlobalGuards(new RolesGuard());

// Or with DI
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

---

### Q2: What is the difference between Guards and Middleware?

**Answer:**

| Feature         | Middleware                          | Guards                             |
| --------------- | ----------------------------------- | ---------------------------------- |
| Execution       | Before route handler                | After middleware, before handler   |
| Context         | Limited (req, res, next)            | Full ExecutionContext              |
| Purpose         | Request processing                  | Authorization/Authentication       |
| Return          | void (calls next())                 | boolean                            |
| Access          | Only HTTP context                   | Any context (HTTP, WebSocket, RPC) |

**Middleware Example:**

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();  // Must call next()
  }
}
```

**Guard Example:**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validate(request);
  }
}
```

**When to use:**

- **Middleware**: Logging, CORS, body parsing, rate limiting
- **Guards**: Authentication, authorization, role checking

---

## Interceptors

### Q3: What are Interceptors and what are their use cases?

**Answer:**

Interceptors are powerful tools that can transform the result returned from a function, transform exceptions, extend basic function behavior, or completely override a function.

**Key Features:**

- Execute before and after route handler
- Transform response data
- Transform exceptions
- Add extra logic
- Override method execution

**Basic Interceptor:**

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Before handler
    console.log('Before...');

    // After handler
    return next.handle().pipe(
      map((data) => {
        console.log('After...');
        return { data };
      }),
    );
  }
}
```

**Logging Interceptor:**

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(`${method} ${url} - ${duration}ms`);
      }),
    );
  }
}
```

**Response Transformation:**

```typescript
export interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Success',
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

**Timeout Interceptor:**

```typescript
import { timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(timeout(5000));  // 5 second timeout
  }
}
```

**Caching Interceptor:**

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = request.url;

    // Try to get from cache
    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // If not in cache, execute handler and cache result
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(cacheKey, response, { ttl: 300 });
      }),
    );
  }
}
```

**Error Handling Interceptor:**

```typescript
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }
        return throwError(
          () => new InternalServerErrorException('Internal server error'),
        );
      }),
    );
  }
}
```

**Usage:**

```typescript
// Apply to controller
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {}

// Apply to method
@Get()
@UseInterceptors(CacheInterceptor)
findAll() {}

// Apply globally
app.useGlobalInterceptors(new LoggingInterceptor());

// With DI
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

---

## Pipes

### Q4: What are Pipes and how do you implement custom pipes?

**Answer:**

Pipes transform input data or validate it before it reaches the route handler. They execute **after guards** but **before the route handler**.

**Built-in Pipes:**

- `ValidationPipe` - Validates using class-validator
- `ParseIntPipe` - Transforms string to integer
- `ParseBoolPipe` - Transforms string to boolean
- `ParseArrayPipe` - Transforms to array
- `ParseUUIDPipe` - Validates UUID
- `DefaultValuePipe` - Sets default value

**Custom Validation Pipe:**

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed: not a number');
    }
    return val;
  }
}

// Usage
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

**Custom Validation Pipe with Schema:**

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}

// Usage
import * as Joi from 'joi';

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).required(),
});

@Post()
@UsePipes(new JoiValidationPipe(createUserSchema))
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

**Transform Pipe:**

```typescript
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (typeof value === 'object') {
      Object.keys(value).forEach((key) => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    return value;
  }
}
```

**Global ValidationPipe Configuration:**

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Strip properties not in DTO
    forbidNonWhitelisted: true,   // Throw error for unknown properties
    transform: true,               // Auto-transform to DTO type
    transformOptions: {
      enableImplicitConversion: true,  // Auto-convert types
    },
    disableErrorMessages: false,  // Show validation errors
  }),
);
```

**Async Validation Pipe:**

```typescript
@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private usersService: UsersService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOne(value);
    if (!user) {
      throw new NotFoundException(`User with ID ${value} not found`);
    }
    return user;
  }
}

// Usage
@Get(':id')
async findOne(@Param('id', UserExistsPipe) user: User) {
  return user;  // Already fetched by pipe
}
```

---

### Q5: What is the difference between Pipes and Interceptors?

**Answer:**

| Feature          | Pipes                          | Interceptors                    |
| ---------------- | ------------------------------ | ------------------------------- |
| Primary Purpose  | Validation & Transformation    | AOP (Aspect-Oriented)           |
| Execution        | Before handler                 | Before AND after handler        |
| Scope            | Single parameter or body       | Entire request/response         |
| Return           | Transformed value              | Observable                      |
| Use Cases        | Validation, type conversion    | Logging, caching, transformation|

**Example showing both:**

```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  @UseInterceptors(LoggingInterceptor)  // Logs request/response
  findOne(
    @Param('id', ParseIntPipe) id: number  // Validates and transforms param
  ) {
    return this.usersService.findOne(id);
  }
}
```

---

## Middleware

### Q6: How do you implement and configure middleware in NestJS?

**Answer:**

Middleware functions execute **before** route handlers. They have access to request and response objects.

**Functional Middleware:**

```typescript
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
}
```

**Class Middleware:**

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
```

**Applying Middleware:**

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply to specific routes
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');

    // Apply to specific HTTP methods
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });

    // Apply to multiple routes
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users', 'posts', 'comments');

    // Exclude routes
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'users', method: RequestMethod.POST },
        'users/(.*)',
      )
      .forRoutes(UsersController);

    // Apply multiple middleware
    consumer
      .apply(LoggerMiddleware, AuthMiddleware)
      .forRoutes(UsersController);
  }
}
```

**Authentication Middleware:**

```typescript
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      req['user'] = payload;
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

**CORS Middleware:**

```typescript
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  }
}
```

**Rate Limiting Middleware:**

```typescript
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests = new Map<string, number[]>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;

    if (!this.requests.has(ip)) {
      this.requests.set(ip, []);
    }

    const timestamps = this.requests.get(ip)!;
    const recentRequests = timestamps.filter((time) => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    recentRequests.push(now);
    this.requests.set(ip, recentRequests);
    next();
  }
}
```

**Global Middleware:**

```typescript
// main.ts
const app = await NestFactory.create(AppModule);
app.use(logger);  // Apply to all routes
```

---

## Request Lifecycle

### Q7: Explain the complete request lifecycle in NestJS

**Answer:**

**Request Lifecycle Order:**

```
1. Incoming Request
   ↓
2. Middleware
   ↓
3. Guards
   ↓
4. Pre-Interceptors
   ↓
5. Pipes
   ↓
6. Controller Handler
   ↓
7. Service (Business Logic)
   ↓
8. Post-Interceptors
   ↓
9. Exception Filters (if error)
   ↓
10. Response
```

**Detailed Example:**

```typescript
// 1. Middleware
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('1. Middleware: Request received');
    next();
  }
}

// 2. Guard
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('2. Guard: Checking authentication');
    return true;
  }
}

// 3. Interceptor (Before)
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('3. Interceptor: Before handler');
    
    return next.handle().pipe(
      tap(() => console.log('7. Interceptor: After handler')),
    );
  }
}

// 4. Pipe
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('4. Pipe: Validating input');
    return value;
  }
}

// 5. Controller
@Controller('users')
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    console.log('5. Controller: Handler executed');
    return this.usersService.create(createUserDto);
  }
}

// 6. Service
@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    console.log('6. Service: Business logic executed');
    return { id: 1, ...createUserDto };
  }
}

// Exception Filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('8. Exception Filter: Error caught');
  }
}
```

**Output:**

```
1. Middleware: Request received
2. Guard: Checking authentication
3. Interceptor: Before handler
4. Pipe: Validating input
5. Controller: Handler executed
6. Service: Business logic executed
7. Interceptor: After handler
[Response sent]

// If error occurs:
8. Exception Filter: Error caught
```

---

### Q8: How do you handle async operations in Guards, Interceptors, and Pipes?

**Answer:**

All guards, interceptors, and pipes support async operations.

**Async Guard:**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    try {
      const user = await this.authService.validateToken(token);
      request.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
```

**Async Interceptor:**

```typescript
@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    // Async operation before handler
    const user = await this.usersService.findOne(request.user.id);
    request.user = user;

    return next.handle().pipe(
      // Async operation after handler
      mergeMap(async (data) => {
        const enrichedData = await this.enrichData(data);
        return enrichedData;
      }),
    );
  }

  private async enrichData(data: any) {
    // Async enrichment
    return data;
  }
}
```

**Async Pipe:**

```typescript
@Injectable()
export class DatabaseEntityPipe implements PipeTransform {
  constructor(private repository: Repository<User>) {}

  async transform(id: string, metadata: ArgumentMetadata): Promise<User> {
    const entity = await this.repository.findOne({ where: { id } });
    
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    
    return entity;
  }
}

// Usage
@Get(':id')
async findOne(@Param('id', DatabaseEntityPipe) user: User) {
  return user;  // Already loaded from database
}
```

**Combining Async Components:**

```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  @UseGuards(AsyncAuthGuard)        // 1. Async guard
  @UseInterceptors(AsyncInterceptor) // 2. Async interceptor
  async findOne(
    @Param('id', AsyncPipe) user: User  // 3. Async pipe
  ) {
    return user;
  }
}
```

---

### Q9: How do you implement request-scoped providers and what are the implications?

**Answer:**

Request-scoped providers create a new instance for each incoming request.

**Implementation:**

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor() {
    console.log('New instance created for this request');
  }

  private data: any[] = [];

  addData(item: any) {
    this.data.push(item);
  }

  getData() {
    return this.data;
  }
}
```

**Injecting REQUEST Object:**

```typescript
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private request: Request) {}

  getUserId(): string {
    return this.request['user']?.id;
  }

  getRequestId(): string {
    return this.request.headers['x-request-id'] as string;
  }
}
```

**Scope Bubbling:**

```typescript
// If controller uses request-scoped service,
// controller becomes request-scoped too

@Injectable({ scope: Scope.REQUEST })
export class UsersService {}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // Controller is now REQUEST-scoped
}
```

**Performance Implications:**

```typescript
// DEFAULT scope (Singleton) - Best performance
@Injectable()
export class FastService {}

// REQUEST scope - Moderate performance impact
@Injectable({ scope: Scope.REQUEST })
export class RequestService {}

// TRANSIENT scope - Highest performance impact
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}
```

**When to use REQUEST scope:**

✅ User-specific request context
✅ Request tracing and logging
✅ Multi-tenancy applications
✅ Per-request caching

❌ Don't use for stateless services
❌ Avoid for high-traffic applications (unless necessary)

**Best Practice Example:**

```typescript
// Global request context
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private _userId: string;
  private _tenantId: string;
  private _requestId: string;

  setUserId(id: string) {
    this._userId = id;
  }

  getUserId(): string {
    return this._userId;
  }

  setTenantId(id: string) {
    this._tenantId = id;
  }

  getTenantId(): string {
    return this._tenantId;
  }
}

// Guard sets context
@Injectable()
export class ContextGuard implements CanActivate {
  constructor(private contextService: RequestContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    this.contextService.setUserId(request.user.id);
    this.contextService.setTenantId(request.user.tenantId);
    return true;
  }
}

// Service uses context
@Injectable()
export class UsersService {
  constructor(private contextService: RequestContextService) {}

  async getCurrentUser() {
    const userId = this.contextService.getUserId();
    return this.findOne(userId);
  }
}
```

---

This covers advanced NestJS concepts. Practice these patterns and move on to practical coding questions!


