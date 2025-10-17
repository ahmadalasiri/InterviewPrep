# NestJS - Complete Learning Guide

This repository contains a comprehensive guide to learning NestJS with practical examples and explanations.

## Table of Contents

### 📚 [Interview Preparation](00-interview-preparation/)

Complete interview guide with questions organized by difficulty:

- [Basic Questions](00-interview-preparation/01-basic-questions.md) - NestJS fundamentals
- [Architecture Questions](00-interview-preparation/02-architecture-questions.md) - Modules and DI
- [Advanced Questions](00-interview-preparation/03-advanced-questions.md) - Guards, interceptors, pipes
- [Practical Questions](00-interview-preparation/04-practical-questions.md) - Real-world coding
- [System Design](00-interview-preparation/05-system-design-questions.md) - Scalable architecture

### 1. Basic Concepts

- [Controllers](01-basics/controllers.ts) - Handling HTTP requests and routing
- [Providers & Services](01-basics/providers.ts) - Business logic and dependency injection
- [Modules](01-basics/modules.ts) - Organizing application structure
- [Decorators](01-basics/decorators.ts) - NestJS decorator patterns

### 2. Request Handling

- [DTOs & Validation](02-request-handling/dtos.ts) - Data transfer objects and validation
- [Pipes](02-request-handling/pipes.ts) - Transformation and validation
- [Exception Filters](02-request-handling/exception-filters.ts) - Error handling

### 3. Advanced Features

- [Guards](03-advanced/guards.ts) - Authentication and authorization
- [Interceptors](03-advanced/interceptors.ts) - Request/response transformation
- [Middleware](03-advanced/middleware.ts) - Request preprocessing
- [Custom Decorators](03-advanced/custom-decorators.ts) - Creating custom decorators

### 4. Database Integration

- [TypeORM](04-database/typeorm.ts) - SQL databases with TypeORM
- [Mongoose](04-database/mongoose.ts) - MongoDB with Mongoose
- [Prisma](04-database/prisma.ts) - Modern database toolkit
- [Transactions](04-database/transactions.ts) - Database transactions

### 5. Authentication & Security

- [JWT Authentication](05-auth/jwt-auth.ts) - JSON Web Token authentication
- [Passport Integration](05-auth/passport.ts) - Passport strategies
- [Role-Based Access Control](05-auth/rbac.ts) - RBAC implementation
- [Security Best Practices](05-auth/security.ts) - Security patterns

### 6. Testing

- [Unit Testing](06-testing/unit-tests.ts) - Testing services and controllers
- [Integration Testing](06-testing/integration-tests.ts) - E2E testing
- [Mocking](06-testing/mocking.ts) - Mocking dependencies

### 7. Microservices

- [TCP Transport](07-microservices/tcp.ts) - TCP microservices
- [Redis Transport](07-microservices/redis.ts) - Redis message broker
- [gRPC](07-microservices/grpc.ts) - gRPC implementation
- [Message Patterns](07-microservices/patterns.ts) - Communication patterns

### 8. GraphQL

- [Schema First](08-graphql/schema-first.ts) - Schema-first approach
- [Code First](08-graphql/code-first.ts) - Code-first approach
- [Resolvers](08-graphql/resolvers.ts) - Query and mutation resolvers
- [Subscriptions](08-graphql/subscriptions.ts) - Real-time subscriptions

### 9. WebSockets

- [Gateway Setup](09-websockets/gateway.ts) - WebSocket gateway
- [Events](09-websockets/events.ts) - Event handling
- [Rooms & Namespaces](09-websockets/rooms.ts) - Socket.io features

### 10. Performance & Optimization

- [Caching](10-performance/caching.ts) - Redis caching strategies
- [Queue Management](10-performance/queues.ts) - Bull queue processing
- [Task Scheduling](10-performance/scheduling.ts) - Cron jobs
- [Compression](10-performance/compression.ts) - Response compression

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Basic TypeScript knowledge

### Installation

```bash
# Install NestJS CLI
npm install -g @nestjs/cli

# Create new project
nest new project-name

# Navigate to project
cd project-name

# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## Key NestJS Concepts

### Why NestJS?

- **TypeScript First**: Built with TypeScript for type safety
- **Modular Architecture**: Organize code into reusable modules
- **Dependency Injection**: Built-in IoC container
- **Platform Agnostic**: Works with Express or Fastify
- **Extensive Ecosystem**: GraphQL, WebSockets, Microservices
- **Enterprise Ready**: Scalable and maintainable architecture
- **Great Documentation**: Comprehensive and well-organized

### NestJS Philosophy

- **Opinionated**: Provides structure and best practices
- **Modular**: Clear separation of concerns
- **Testable**: Easy to write unit and integration tests
- **Scalable**: Built for enterprise applications
- **Extensible**: Easy to add custom functionality

## Best Practices

### 1. Project Structure

```
src/
├── modules/
│   ├── users/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── users.controller.spec.ts
│   └── auth/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── main.ts
└── app.module.ts
```

### 2. Coding Standards

```typescript
// Use dependency injection
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private mailService: MailService,
  ) {}
}

// Use DTOs for validation
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}

// Use proper error handling
async findOne(id: string): Promise<User> {
  const user = await this.usersRepository.findOne(id);
  if (!user) {
    throw new NotFoundException(`User #${id} not found`);
  }
  return user;
}
```

### 3. Testing

```typescript
// Unit test example
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### 4. Configuration

```typescript
// Use ConfigModule for environment variables
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}

// Access configuration
constructor(private configService: ConfigService) {
  const dbHost = this.configService.get('DB_HOST');
}
```

## Common Patterns

### Controller Pattern

```typescript
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
```

### Service Pattern

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
```

### Repository Pattern

```typescript
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
```

## Essential npm Packages

### Core

- `@nestjs/core` - NestJS core functionality
- `@nestjs/common` - Common decorators and utilities
- `@nestjs/platform-express` - Express platform adapter

### Database

- `@nestjs/typeorm` `typeorm` - TypeORM integration
- `@nestjs/mongoose` `mongoose` - MongoDB integration
- `@prisma/client` - Prisma ORM

### Authentication

- `@nestjs/passport` `passport` - Authentication
- `@nestjs/jwt` - JWT support
- `bcrypt` - Password hashing

### Validation

- `class-validator` - Validation decorators
- `class-transformer` - Transform plain objects to classes

### Testing

- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `supertest` - HTTP testing

### GraphQL

- `@nestjs/graphql` `@nestjs/apollo` - GraphQL support
- `graphql` `apollo-server-express` - GraphQL server

### Microservices

- `@nestjs/microservices` - Microservices support
- `redis` - Redis transport
- `@grpc/grpc-js` - gRPC support

### Performance

- `@nestjs/cache-manager` `cache-manager` - Caching
- `@nestjs/bull` `bull` - Queue management
- `@nestjs/schedule` - Task scheduling
- `compression` - Response compression

## CLI Commands

```bash
# Generate resources
nest generate controller users
nest generate service users
nest generate module users
nest generate resource users  # Creates complete CRUD

# Generate components
nest generate guard auth
nest generate interceptor logging
nest generate pipe validation
nest generate filter http-exception
nest generate decorator current-user

# Build and run
npm run build
npm run start
npm run start:dev
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Linting
npm run lint
npm run format
```

## Project Examples

### Simple REST API

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

### Microservices Application

```typescript
// main.ts
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
});
await app.listen();
```

### GraphQL API

```typescript
// app.module.ts
@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule {}
```

## Resources

- [Official Documentation](https://docs.nestjs.com/)
- [GitHub Repository](https://github.com/nestjs/nest)
- [Discord Community](https://discord.gg/nestjs)
- [Awesome NestJS](https://github.com/juliandavidmr/awesome-nestjs)
- [NestJS Courses](https://courses.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Contributing

Contributions are welcome! Feel free to:

- Add new examples
- Improve documentation
- Fix bugs or typos
- Suggest new topics

## License

This project is open source and available under the MIT License.

---

**Happy coding with NestJS! 🚀**

Built with ❤️ for the NestJS community.






