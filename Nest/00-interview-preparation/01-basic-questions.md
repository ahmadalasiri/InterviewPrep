# Basic NestJS Interview Questions

## Table of Contents

- [What is NestJS?](#what-is-nestjs)
- [Core Concepts](#core-concepts)
- [TypeScript Fundamentals](#typescript-fundamentals)
- [Project Structure](#project-structure)

---

## What is NestJS?

### Q1: What is NestJS and why would you use it?

**Answer:**
NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of OOP (Object-Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

**Key Features:**

- **TypeScript First**: Built with and fully supports TypeScript
- **Modular Architecture**: Organize code into reusable modules
- **Dependency Injection**: Built-in IoC container
- **Decorator-Based**: Uses TypeScript decorators extensively
- **Platform Agnostic**: Works with Express (default) or Fastify
- **Extensive Ecosystem**: Built-in support for GraphQL, WebSockets, microservices
- **Testing**: First-class testing support

**Why use NestJS:**

- Enterprise-ready architecture out of the box
- Follows Angular-inspired design patterns
- Strong typing with TypeScript
- Excellent for large-scale applications
- Great documentation and community
- Built-in support for common patterns (CRUD, authentication, etc.)

**Example:**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

---

### Q2: What are the main building blocks of a NestJS application?

**Answer:**

The three main building blocks are:

1. **Controllers**: Handle incoming requests and return responses
2. **Providers**: Contain business logic and can be injected
3. **Modules**: Organize application structure and dependencies

**Controllers:**

```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'This returns all users';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This returns user #${id}`;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return 'This creates a user';
  }
}
```

**Providers (Services):**

```typescript
@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }

  create(createUserDto: CreateUserDto) {
    const newUser = { id: Date.now(), ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }
}
```

**Modules:**

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export to use in other modules
})
export class UsersModule {}
```

---

### Q3: What is Dependency Injection and how does NestJS implement it?

**Answer:**

Dependency Injection (DI) is a design pattern where dependencies are provided to a class rather than created by the class itself. This promotes loose coupling and easier testing.

**Benefits:**

- Loose coupling between components
- Easier unit testing (mock dependencies)
- Better code organization
- Reusability and maintainability

**How NestJS implements DI:**

```typescript
// 1. Mark class as injectable
@Injectable()
export class UsersService {
  findAll() {
    return ['user1', 'user2'];
  }
}

// 2. Register in module
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// 3. Inject into constructor
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

**Constructor vs Property Injection:**

```typescript
// Constructor injection (preferred)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}

// Property injection (less common)
export class UsersController {
  @Inject(UsersService)
  private usersService: UsersService;
}
```

---

## Core Concepts

### Q4: What are decorators in NestJS?

**Answer:**

Decorators are special TypeScript features that add metadata to classes, methods, and properties. NestJS uses them extensively for configuration and functionality.

**Types of Decorators:**

1. **Class Decorators:**

```typescript
@Controller('cats')  // Defines a controller with route prefix
@Injectable()        // Marks class as provider
@Module({...})       // Defines a module
@Catch(HttpException) // Exception filter
```

2. **Method Decorators:**

```typescript
@Get()              // HTTP GET
@Post()             // HTTP POST
@Put()              // HTTP PUT
@Delete()           // HTTP DELETE
@Patch()            // HTTP PATCH
@UseGuards(AuthGuard) // Apply guard
@UseInterceptors(LoggingInterceptor) // Apply interceptor
```

3. **Parameter Decorators:**

```typescript
@Param()           // Route parameters
@Query()           // Query string parameters
@Body()            // Request body
@Headers()         // Request headers
@Req()             // Full request object
@Res()             // Full response object
@Session()         // Session object
```

**Example:**

```typescript
@Controller('cats')
export class CatsController {
  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createCatDto: CreateCatDto,
    @Headers('authorization') token: string,
  ) {
    return 'This creates a cat';
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('fields') fields: string) {
    return `Cat #${id} with fields: ${fields}`;
  }
}
```

---

### Q5: Explain the difference between @Injectable() and @Module()

**Answer:**

**@Injectable():**

- Marks a class as a **provider** that can be injected
- Used for services, repositories, factories, helpers
- Makes the class available for dependency injection

```typescript
@Injectable()
export class CatsService {
  private cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

**@Module():**

- Organizes the application structure
- Groups related controllers and providers
- Manages imports/exports between modules

```typescript
@Module({
  imports: [DatabaseModule],      // Other modules to import
  controllers: [CatsController],  // Controllers in this module
  providers: [CatsService],       // Providers in this module
  exports: [CatsService],         // Providers to export
})
export class CatsModule {}
```

**Key Differences:**

| Feature       | @Injectable()           | @Module()                    |
| ------------- | ----------------------- | ---------------------------- |
| Purpose       | Define injectable class | Organize app structure       |
| Applied to    | Services, providers     | Module classes               |
| Dependencies  | Can be injected         | Groups dependencies          |
| Scope         | Single class            | Collection of related items  |

---

### Q6: What is the difference between a provider and a service?

**Answer:**

**Service** is a specific type of **Provider**. All services are providers, but not all providers are services.

**Provider (broader concept):**

- Any class that can be injected as a dependency
- Can be services, repositories, factories, helpers, etc.
- Registered in module's `providers` array

**Service (specific type):**

- Provider that contains business logic
- Typically marked with `@Injectable()`
- Common naming convention: `*.service.ts`

**Examples:**

```typescript
// Service - business logic
@Injectable()
export class UsersService {
  findAll() {
    // Business logic
  }
}

// Repository - data access
@Injectable()
export class UsersRepository {
  async findById(id: string) {
    // Database operations
  }
}

// Factory - object creation
@Injectable()
export class UserFactory {
  createUser(data: any): User {
    // Object creation logic
  }
}

// Helper - utility functions
@Injectable()
export class PasswordHelper {
  hash(password: string): string {
    // Utility function
  }
}

// All are providers, but only UsersService is a service
@Module({
  providers: [
    UsersService,      // Service
    UsersRepository,   // Repository provider
    UserFactory,       // Factory provider
    PasswordHelper,    // Helper provider
  ],
})
export class UsersModule {}
```

---

### Q7: What are DTOs and why are they important?

**Answer:**

DTO (Data Transfer Object) is a design pattern used to transfer data between different layers of an application. In NestJS, DTOs define the shape of data for requests and responses.

**Why use DTOs:**

- **Type Safety**: TypeScript validation
- **Documentation**: Self-documenting code
- **Validation**: Works with `class-validator`
- **Transformation**: Works with `class-transformer`
- **Separation of Concerns**: API contract vs database models

**Example:**

```typescript
// create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

// Controller usage
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

// Service usage
@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    // createUserDto is validated and typed
    const user = {
      id: Date.now(),
      ...createUserDto,
    };
    return user;
  }
}
```

**Update DTO with Partial:**

```typescript
// update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Makes all fields optional
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

---

### Q8: How do you handle errors in NestJS?

**Answer:**

NestJS provides multiple ways to handle errors:

**1. Built-in HTTP Exceptions:**

```typescript
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      // OR use specific exception:
      // throw new NotFoundException('User not found');
    }
    
    return user;
  }
}
```

**2. Built-in Exception Classes:**

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid credentials');
throw new NotFoundException('Resource not found');
throw new ForbiddenException('Access denied');
throw new InternalServerErrorException('Something went wrong');
```

**3. Custom Exceptions:**

```typescript
// custom-exception.ts
export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.CONFLICT);
  }
}

// Usage
throw new UserAlreadyExistsException();
```

**4. Exception Filters:**

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
    });
  }
}

// Apply globally
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## TypeScript Fundamentals

### Q9: What TypeScript features are heavily used in NestJS?

**Answer:**

**1. Decorators:**

```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `User #${id}`;
  }
}
```

**2. Interfaces:**

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  findOne(id: number): User {
    return { id, name: 'John', email: 'john@example.com' };
  }
}
```

**3. Generics:**

```typescript
@Injectable()
export class GenericService<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findAll(): T[] {
    return this.items;
  }
}
```

**4. Type Guards:**

```typescript
function isUser(obj: any): obj is User {
  return 'email' in obj && 'name' in obj;
}

if (isUser(data)) {
  // TypeScript knows data is User
  console.log(data.email);
}
```

**5. Access Modifiers:**

```typescript
@Injectable()
export class UsersService {
  private users: User[] = [];           // Only accessible within class
  protected config: any;                // Accessible in subclasses
  public findAll(): User[] {            // Accessible everywhere
    return this.users;
  }
  
  // Shorthand in constructor
  constructor(
    private readonly configService: ConfigService,
    private usersRepository: UsersRepository,
  ) {}
}
```

**6. Async/Await and Promises:**

```typescript
@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save(createUserDto);
    return user;
  }
}
```

---

### Q10: What is the difference between interface and class in NestJS context?

**Answer:**

**Interface:**

- Compile-time only (disappears after compilation)
- Cannot be instantiated
- No runtime checking
- Used for type checking
- Cannot have decorators

```typescript
// Interface
export interface IUser {
  id: number;
  name: string;
  email: string;
}

// Cannot be instantiated
// const user = new IUser(); // ERROR

// Used for typing
function getUser(): IUser {
  return { id: 1, name: 'John', email: 'john@example.com' };
}
```

**Class:**

- Exists at runtime
- Can be instantiated
- Runtime type checking possible
- Can have decorators (needed for validation)
- Used for DTOs with validation

```typescript
// Class
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

// Can be instantiated
const dto = new CreateUserDto();

// Used with validation
@Post()
@UsePipes(ValidationPipe)
create(@Body() createUserDto: CreateUserDto) {
  // Validation decorators work at runtime
}
```

**When to use:**

- **Interface**: Type definitions, service contracts, database models
- **Class**: DTOs, entities with validation, injectable services

---

## Project Structure

### Q11: What is the recommended project structure in NestJS?

**Answer:**

**Basic Structure:**

```
src/
├── app.module.ts          # Root module
├── main.ts                # Entry point
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── users.controller.spec.ts
├── auth/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── interfaces/
└── config/
    └── configuration.ts
```

**Feature-Based Structure:**

```
src/
├── main.ts
├── app.module.ts
├── modules/
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── interfaces/
│   │   └── users.module.ts
│   ├── products/
│   └── orders/
├── shared/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── config/
```

---

### Q12: How do you configure and bootstrap a NestJS application?

**Answer:**

**main.ts (Bootstrap):**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create application
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Strip unknown properties
      forbidNonWhitelisted: true,   // Throw error for unknown properties
      transform: true,               // Transform to DTO instances
    }),
  );

  // Listen on port
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

**app.module.ts (Root Module):**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    
    // Feature modules
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

---

### Q13: What is the difference between @Param(), @Query(), and @Body()?

**Answer:**

**@Param() - Route Parameters:**

```typescript
// URL: /users/123
@Get(':id')
findOne(@Param('id') id: string) {
  return `User #${id}`;
}

// Multiple params
// URL: /users/123/posts/456
@Get(':userId/posts/:postId')
findUserPost(
  @Param('userId') userId: string,
  @Param('postId') postId: string,
) {
  return `User ${userId}, Post ${postId}`;
}

// All params as object
@Get(':id')
findOne(@Param() params: any) {
  return `User #${params.id}`;
}
```

**@Query() - Query String Parameters:**

```typescript
// URL: /users?role=admin&active=true
@Get()
findAll(
  @Query('role') role: string,
  @Query('active') active: boolean,
) {
  return `Role: ${role}, Active: ${active}`;
}

// All query params as object
@Get()
findAll(@Query() query: any) {
  return `Role: ${query.role}, Active: ${query.active}`;
}
```

**@Body() - Request Body:**

```typescript
// POST request body
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}

// Specific field from body
@Post()
create(
  @Body('name') name: string,
  @Body('email') email: string,
) {
  return { name, email };
}
```

**Combined Example:**

```typescript
// URL: /users/123/posts?status=published
// Body: { "title": "New Post", "content": "..." }
@Put(':userId/posts')
updatePost(
  @Param('userId') userId: string,
  @Query('status') status: string,
  @Body() updatePostDto: UpdatePostDto,
) {
  return this.postsService.update(userId, status, updatePostDto);
}
```

---

### Q14: How do you implement validation in NestJS?

**Answer:**

NestJS uses `class-validator` and `class-transformer` for validation.

**Setup:**

```bash
npm install class-validator class-transformer
```

**Enable ValidationPipe:**

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe());
```

**DTO with Validation:**

```typescript
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsInt()
  @Min(18)
  @Max(100)
  @IsOptional()
  age?: number;

  @IsEnum(['admin', 'user', 'guest'])
  role: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

// Nested validation
export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;
}

export class CreateProfileDto {
  @IsString()
  bio: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
```

**Controller:**

```typescript
@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Data is automatically validated
    return this.usersService.create(createUserDto);
  }
}
```

**Custom Validation:**

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomTextValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text.length > 5 && text.length < 20;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Text must be between 5 and 20 characters';
  }
}

// Usage
export class CreateUserDto {
  @Validate(CustomTextValidator)
  username: string;
}
```

---

### Q15: What is the difference between @Res() and return value?

**Answer:**

**Return Value (Recommended):**

```typescript
@Get()
findAll(): User[] {
  return this.usersService.findAll();
  // NestJS handles the response automatically
  // - Sets status code (200)
  // - Serializes to JSON
  // - Sets content-type header
}

@Get(':id')
async findOne(@Param('id') id: string): Promise<User> {
  return await this.usersService.findOne(id);
  // Also works with async/await
}
```

**@Res() - Manual Response Handling:**

```typescript
import { Response } from 'express';

@Get()
findAll(@Res() res: Response) {
  const users = this.usersService.findAll();
  res.status(200).json(users);
  // Must handle response manually
}

@Get('download')
downloadFile(@Res() res: Response) {
  res.download('/path/to/file.pdf');
}

@Get('redirect')
redirect(@Res() res: Response) {
  res.redirect('https://nestjs.com');
}
```

**When to use each:**

| Scenario                 | Use                  |
| ------------------------ | -------------------- |
| Standard REST API        | Return value         |
| File downloads           | @Res()               |
| Redirects                | @Res()               |
| Custom headers/cookies   | @Res()               |
| Streaming                | @Res()               |
| Need full control        | @Res()               |

**Hybrid Approach:**

```typescript
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.header('X-Custom-Header', 'value');
  return this.usersService.findAll();
  // Set headers but still return value
}
```

---

This covers the basic NestJS interview questions. Practice these concepts and move on to architecture questions!


