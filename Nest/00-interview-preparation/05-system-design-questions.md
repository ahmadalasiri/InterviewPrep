# System Design Questions with NestJS

## Table of Contents

- [Microservices Architecture](#microservices-architecture)
- [GraphQL Implementation](#graphql-implementation)
- [WebSockets & Real-time](#websockets--real-time)
- [Caching Strategies](#caching-strategies)
- [Performance & Scalability](#performance--scalability)

---

## Microservices Architecture

### Q1: How do you design a microservices architecture with NestJS?

**Answer:**

NestJS supports multiple transport layers for microservices: TCP, Redis, NATS, MQTT, gRPC, RabbitMQ, and Kafka.

**Basic Microservice Setup:**

```typescript
// main.ts (microservice)
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    },
  );
  await app.listen();
}
bootstrap();
```

**Hybrid Application (HTTP + Microservice):**

```typescript
// main.ts (API Gateway)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
```

**Message Patterns:**

```typescript
// users.controller.ts (microservice)
import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Request-Response pattern
  @MessagePattern({ cmd: 'get_user' })
  async getUser(data: { id: string }) {
    return await this.usersService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(data: CreateUserDto) {
    return await this.usersService.create(data);
  }

  // Event-based pattern (fire and forget)
  @EventPattern('user_created')
  async handleUserCreated(data: any) {
    console.log('User created:', data);
    // Send welcome email, create profile, etc.
  }
}
```

**Client (API Gateway):**

```typescript
// users.controller.ts (API Gateway)
import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
  ) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'get_user' }, { id });
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersClient
      .send({ cmd: 'create_user' }, createUserDto)
      .toPromise();

    // Emit event
    this.usersClient.emit('user_created', user);

    return user;
  }
}
```

**Module Configuration:**

```typescript
// users.module.ts (API Gateway)
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
```

---

### Q2: Design a microservices system with Redis transport

**Answer:**

**Redis Microservice:**

```typescript
// main.ts (Auth Service)
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  );
  await app.listen();
}
bootstrap();
```

**Controller:**

```typescript
// auth.controller.ts
@Controller()
export class AuthController {
  @MessagePattern('auth.login')
  async login(@Payload() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @MessagePattern('auth.validate')
  async validateToken(@Payload() token: string) {
    return await this.authService.validateToken(token);
  }

  @EventPattern('user.registered')
  async handleUserRegistered(@Payload() data: any) {
    await this.authService.sendWelcomeEmail(data.email);
  }
}
```

**API Gateway:**

```typescript
// app.module.ts
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: 'USERS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

**Using Multiple Services:**

```typescript
// auth.controller.ts (Gateway)
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Create user
    const user = await firstValueFrom(
      this.usersClient.send('users.create', registerDto),
    );

    // Emit event for other services
    this.authClient.emit('user.registered', user);

    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return firstValueFrom(
      this.authClient.send('auth.login', loginDto),
    );
  }
}
```

---

### Q3: Implement gRPC microservices

**Answer:**

**Proto File:**

```protobuf
// users.proto
syntax = "proto3";

package users;

service UsersService {
  rpc FindOne (UserId) returns (User) {}
  rpc FindAll (Empty) returns (Users) {}
  rpc Create (CreateUserDto) returns (User) {}
}

message UserId {
  string id = 1;
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
}

message Users {
  repeated User users = 1;
}

message CreateUserDto {
  string email = 1;
  string name = 2;
  string password = 3;
}

message Empty {}
```

**Microservice:**

```typescript
// main.ts
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'users',
        protoPath: join(__dirname, '../proto/users.proto'),
        url: 'localhost:5000',
      },
    },
  );
  await app.listen();
}
bootstrap();
```

**Controller:**

```typescript
// users.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface UserId {
  id: string;
}

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @GrpcMethod('UsersService', 'FindOne')
  async findOne(data: UserId) {
    return await this.usersService.findOne(data.id);
  }

  @GrpcMethod('UsersService', 'FindAll')
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @GrpcMethod('UsersService', 'Create')
  async create(data: CreateUserDto) {
    return await this.usersService.create(data);
  }
}
```

**Client:**

```typescript
// app.module.ts
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: join(__dirname, '../proto/users.proto'),
          url: 'localhost:5000',
        },
      },
    ]),
  ],
})
export class AppModule {}

// users.controller.ts
@Controller('users')
export class UsersController {
  private usersService: any;

  constructor(@Inject('USERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService('UsersService');
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await firstValueFrom(
      this.usersService.findOne({ id }),
    );
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await firstValueFrom(
      this.usersService.create(createUserDto),
    );
  }
}
```

---

## GraphQL Implementation

### Q4: Implement a GraphQL API with NestJS

**Answer:**

**Installation:**

```bash
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

**Module Configuration:**

```typescript
// app.module.ts
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

**Entity/Model:**

```typescript
// user.model.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => [Post], { nullable: 'items' })
  posts: Post[];
}

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => User)
  author: User;
}
```

**Input Types:**

```typescript
// create-user.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  bio?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;
}
```

**Resolver:**

```typescript
// users.resolver.ts
import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { User } from './models/user.model';
import { Post } from './models/post.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => ID }) id: string) {
    await this.usersService.remove(id);
    return true;
  }

  // Field resolver
  @ResolveField(() => [Post])
  async posts(@Parent() user: User) {
    return await this.postsService.findByUserId(user.id);
  }
}
```

**GraphQL Queries:**

```graphql
# Query all users
query {
  users {
    id
    email
    name
    posts {
      id
      title
    }
  }
}

# Query single user
query {
  user(id: "123") {
    id
    name
    email
  }
}

# Create user
mutation {
  createUser(
    createUserInput: {
      email: "john@example.com"
      name: "John Doe"
      password: "password123"
    }
  ) {
    id
    email
    name
  }
}

# Update user
mutation {
  updateUser(id: "123", updateUserInput: { name: "Jane Doe" }) {
    id
    name
  }
}
```

---

### Q5: Implement GraphQL subscriptions

**Answer:**

**Setup:**

```typescript
// app.module.ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  subscriptions: {
    'graphql-ws': true,
  },
  playground: true,
}),
```

**Subscription Resolver:**

```typescript
// notifications.resolver.ts
import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

const pubSub = new PubSub();

@Resolver()
export class NotificationsResolver {
  @Subscription(() => Notification, {
    filter: (payload, variables) => {
      // Filter subscriptions
      return payload.notificationCreated.userId === variables.userId;
    },
  })
  notificationCreated(@Args('userId') userId: string) {
    return pubSub.asyncIterator('notificationCreated');
  }

  @Mutation(() => Notification)
  async createNotification(@Args('createNotificationInput') input: CreateNotificationInput) {
    const notification = await this.notificationsService.create(input);
    
    // Publish to subscribers
    pubSub.publish('notificationCreated', { notificationCreated: notification });
    
    return notification;
  }
}
```

**Client Subscription:**

```graphql
subscription {
  notificationCreated(userId: "123") {
    id
    message
    createdAt
  }
}
```

---

## WebSockets & Real-time

### Q6: Implement WebSocket chat application

**Answer:**

**Gateway:**

```typescript
// chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map();

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id);
    this.users.delete(client.id);
    
    this.server.emit('userLeft', { username });
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.users.set(client.id, data.username);
    
    this.server.to(data.room).emit('userJoined', {
      username: data.username,
      room: data.room,
    });

    return { success: true };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    const username = this.users.get(client.id);
    
    this.server.to(data.room).emit('userLeft', { username });

    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.users.get(client.id);
    
    this.server.to(data.room).emit('newMessage', {
      username,
      message: data.message,
      timestamp: new Date(),
    });

    return { success: true };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { room: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.users.get(client.id);
    
    client.to(data.room).emit('userTyping', {
      username,
      isTyping: data.isTyping,
    });
  }
}
```

**With Authentication:**

```typescript
@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(token);
      
      client.data.user = payload;
      console.log(`User ${payload.username} connected`);
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    
    this.server.to(data.room).emit('newMessage', {
      userId: user.id,
      username: user.username,
      message: data.message,
      timestamp: new Date(),
    });
  }
}
```

---

## Caching Strategies

### Q7: Implement caching with Redis

**Answer:**

**Installation:**

```bash
npm install cache-manager cache-manager-redis-store
```

**Configuration:**

```typescript
// app.module.ts
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 300, // seconds
      max: 100, // maximum number of items in cache
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
```

**Using Cache Interceptor:**

```typescript
// users.controller.ts
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  @Get()
  @CacheTTL(300) // Override default TTL
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CacheKey('custom_key') // Custom cache key
  @CacheTTL(600)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

**Manual Cache Management:**

```typescript
// users.service.ts
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const cacheKey = `user_${id}`;
    
    // Try to get from cache
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    // If not in cache, get from database
    const user = await this.usersRepository.findOne({ where: { id } });
    
    // Store in cache
    await this.cacheManager.set(cacheKey, user, 300);
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.save({ id, ...updateUserDto });
    
    // Invalidate cache
    await this.cacheManager.del(`user_${id}`);
    
    return user;
  }

  async clearCache() {
    await this.cacheManager.reset();
  }
}
```

---

## Performance & Scalability

### Q8: Design a scalable NestJS application

**Answer:**

**1. Horizontal Scaling with Clustering:**

```typescript
// main.ts
import * as cluster from 'cluster';
import * as os from 'os';

async function bootstrap() {
  if (cluster.isPrimary) {
    const cpuCount = os.cpus().length;
    
    console.log(`Master process started. Forking ${cpuCount} workers...`);
    
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log(`Worker ${process.pid} started`);
  }
}
bootstrap();
```

**2. Database Connection Pooling:**

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'mydb',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  extra: {
    max: 20, // Maximum connections
    min: 5,  // Minimum connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
}),
```

**3. Queue Processing:**

```bash
npm install @nestjs/bull bull
```

```typescript
// app.module.ts
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
})
export class AppModule {}

// email.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  @Process('sendWelcome')
  async sendWelcomeEmail(job: Job) {
    const { email, name } = job.data;
    // Send email
    console.log(`Sending welcome email to ${email}`);
  }

  @Process('sendPasswordReset')
  async sendPasswordResetEmail(job: Job) {
    const { email, token } = job.data;
    // Send email
    console.log(`Sending password reset to ${email}`);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.save(createUserDto);
    
    // Add job to queue
    await this.emailQueue.add('sendWelcome', {
      email: user.email,
      name: user.name,
    });

    return user;
  }
}
```

**4. Load Balancing Architecture:**

```
             ┌─────────────┐
             │ Load Balancer│
             │   (Nginx)   │
             └──────┬──────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼───┐  ┌───▼────┐  ┌───▼────┐
   │NestJS  │  │NestJS  │  │NestJS  │
   │Instance│  │Instance│  │Instance│
   └────┬───┘  └───┬────┘  └───┬────┘
        │          │           │
        └──────────┼───────────┘
                   │
          ┌────────▼─────────┐
          │    Redis Cache   │
          │   (Shared State) │
          └──────────────────┘
                   │
          ┌────────▼─────────┐
          │    PostgreSQL    │
          │   (Primary DB)   │
          └──────────────────┘
```

**5. Health Checks:**

```typescript
// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }
}
```

---

This covers system design patterns in NestJS. Master these concepts to design scalable, production-ready applications!


