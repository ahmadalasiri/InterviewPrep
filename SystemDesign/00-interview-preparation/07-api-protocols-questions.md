# API Protocols & Communication Technologies Interview Questions

Common interview questions about API protocols, communication technologies, and data serialization formats.

## REST API

### Q1: What is REST and what are its principles?

**Answer:**

REST (Representational State Transfer) is an architectural style for designing networked applications.

**REST Principles:**

1. **Stateless**: Each request contains all information needed to process it
2. **Client-Server**: Separation of concerns between client and server
3. **Uniform Interface**: Consistent way of interacting with resources
4. **Resource-Based**: Everything is a resource identified by URI
5. **HTTP Methods**: Use standard HTTP methods (GET, POST, PUT, DELETE)
6. **Representation**: Resources can have multiple representations (JSON, XML)

**RESTful Design:**

- Resources identified by URIs: `/users/123`
- Use HTTP methods: GET, POST, PUT, DELETE, PATCH
- Stateless communication
- JSON/XML for data exchange

**Example:**

```
GET    /api/users          # List all users
GET    /api/users/123      # Get user 123
POST   /api/users          # Create new user
PUT    /api/users/123      # Update user 123
DELETE /api/users/123      # Delete user 123
```

---

## gRPC

### Q2: What is gRPC and how does it work?

**Answer:**

gRPC (gRPC Remote Procedure Calls) is a high-performance, open-source RPC framework developed by Google.

**Key Features:**

1. **Protocol Buffers**: Uses Protocol Buffers (protobuf) for serialization
2. **HTTP/2**: Built on HTTP/2 for multiplexing and streaming
3. **Language Agnostic**: Supports multiple languages (Go, Java, Python, etc.)
4. **Type Safety**: Strong typing through .proto files
5. **Streaming**: Supports unary, server streaming, client streaming, bidirectional streaming
6. **Performance**: Faster than REST due to binary protocol

**gRPC vs REST:**

| Feature         | gRPC                          | REST                      |
| --------------- | ----------------------------- | ------------------------- |
| Protocol        | HTTP/2                        | HTTP/1.1 or HTTP/2        |
| Data Format     | Protocol Buffers (binary)     | JSON/XML (text)           |
| Performance     | Faster (binary, multiplexing) | Slower (text-based)       |
| Browser Support | Limited (needs gRPC-Web)      | Native                    |
| Streaming       | Built-in support              | Limited (SSE, WebSockets) |
| Type Safety     | Strong (proto definitions)    | Weak (JSON schema)        |

**When to use gRPC:**

- Microservices communication
- High-performance requirements
- Real-time streaming
- Strong typing needed
- Internal services (not public APIs)

**When to use REST:**

- Public APIs
- Browser-based applications
- Simple CRUD operations
- Wide compatibility needed

### Q3: Explain gRPC streaming types.

**Answer:**

gRPC supports four types of RPC methods:

**1. Unary RPC (Request-Response):**

```protobuf
rpc GetUser(GetUserRequest) returns (UserResponse);
```

- Client sends one request, server returns one response
- Similar to traditional function call

**2. Server Streaming RPC:**

```protobuf
rpc ListUsers(ListUsersRequest) returns (stream UserResponse);
```

- Client sends one request
- Server returns stream of responses
- Use case: Real-time updates, large datasets

**3. Client Streaming RPC:**

```protobuf
rpc CreateUsers(stream CreateUserRequest) returns (CreateUsersResponse);
```

- Client sends stream of requests
- Server returns one response
- Use case: Batch uploads, collecting data

**4. Bidirectional Streaming RPC:**

```protobuf
rpc Chat(stream Message) returns (stream Message);
```

- Both client and server send streams
- Use case: Chat applications, real-time collaboration

**Example Implementation:**

```protobuf
syntax = "proto3";

package user;

service UserService {
  // Unary
  rpc GetUser(GetUserRequest) returns (UserResponse);

  // Server Streaming
  rpc ListUsers(ListUsersRequest) returns (stream UserResponse);

  // Client Streaming
  rpc CreateUsers(stream CreateUserRequest) returns (CreateUsersResponse);

  // Bidirectional Streaming
  rpc Chat(stream Message) returns (stream Message);
}

message GetUserRequest {
  string user_id = 1;
}

message UserResponse {
  string id = 1;
  string name = 2;
  string email = 3;
}

message ListUsersRequest {
  int32 page = 1;
  int32 page_size = 2;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message CreateUsersResponse {
  int32 created_count = 1;
}

message Message {
  string content = 1;
  string sender = 2;
  int64 timestamp = 3;
}
```

### Q4: How do you handle errors in gRPC?

**Answer:**

gRPC uses status codes and error details for error handling.

**Status Codes:**

- `OK`: Success
- `CANCELLED`: Operation cancelled
- `INVALID_ARGUMENT`: Invalid argument
- `NOT_FOUND`: Resource not found
- `ALREADY_EXISTS`: Resource already exists
- `PERMISSION_DENIED`: Permission denied
- `UNAUTHENTICATED`: Authentication required
- `RESOURCE_EXHAUSTED`: Resource exhausted
- `FAILED_PRECONDITION`: Precondition failed
- `ABORTED`: Operation aborted
- `OUT_OF_RANGE`: Out of range
- `UNIMPLEMENTED`: Not implemented
- `INTERNAL`: Internal error
- `UNAVAILABLE`: Service unavailable
- `DATA_LOSS`: Data loss
- `UNKNOWN`: Unknown error

**Error Handling Example:**

```go
// Server side
import (
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

func (s *UserService) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.UserResponse, error) {
    user, err := s.repo.FindByID(req.UserId)
    if err != nil {
        if err == ErrNotFound {
            return nil, status.Errorf(codes.NotFound, "User not found: %s", req.UserId)
        }
        return nil, status.Errorf(codes.Internal, "Internal error: %v", err)
    }
    return &pb.UserResponse{Id: user.ID, Name: user.Name}, nil
}

// Client side
user, err := client.GetUser(ctx, &pb.GetUserRequest{UserId: "123"})
if err != nil {
    st, ok := status.FromError(err)
    if ok {
        switch st.Code() {
        case codes.NotFound:
            log.Printf("User not found: %v", st.Message())
        case codes.Internal:
            log.Printf("Server error: %v", st.Message())
        default:
            log.Printf("Unknown error: %v", err)
        }
    }
}
```

---

## GraphQL

### Q5: What is GraphQL and how does it differ from REST?

**Answer:**

GraphQL is a query language and runtime for APIs developed by Facebook.

**Key Concepts:**

1. **Single Endpoint**: One endpoint for all operations
2. **Client-Defined Queries**: Client specifies exactly what data it needs
3. **Strongly Typed**: Schema defines all types and operations
4. **Introspection**: Self-documenting API
5. **Real-time**: Subscriptions for real-time updates

**GraphQL vs REST:**

| Feature        | GraphQL                 | REST                      |
| -------------- | ----------------------- | ------------------------- |
| Endpoints      | Single endpoint         | Multiple endpoints        |
| Data Fetching  | Client specifies fields | Server returns all fields |
| Over-fetching  | Avoided                 | Common problem            |
| Under-fetching | Avoided                 | Common problem            |
| Versioning     | Schema evolution        | URL versioning            |
| Caching        | More complex            | HTTP caching              |
| Learning Curve | Steeper                 | Easier                    |

**GraphQL Query Example:**

```graphql
# Query
query {
  user(id: "123") {
    id
    name
    email
    posts {
      title
      comments {
        content
        author {
          name
        }
      }
    }
  }
}

# Mutation
mutation {
  createUser(name: "John", email: "john@example.com") {
    id
    name
  }
}

# Subscription
subscription {
  userUpdated(userId: "123") {
    id
    name
    email
  }
}
```

**REST Equivalent:**

```
GET /api/users/123
GET /api/users/123/posts
GET /api/posts/456/comments
GET /api/users/789
```

### Q6: Explain GraphQL schema, resolvers, and types.

**Answer:**

**Schema Definition:**

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
  posts: [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): Boolean!
}

type Subscription {
  userUpdated(userId: ID!): User!
}
```

**Resolvers (Implementation):**

```typescript
const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      return await context.db.users.findById(args.id);
    },
    users: async (parent, args, context) => {
      return await context.db.users.findAll();
    },
  },
  Mutation: {
    createUser: async (parent, args, context) => {
      return await context.db.users.create({
        name: args.name,
        email: args.email,
      });
    },
  },
  User: {
    posts: async (parent, args, context) => {
      return await context.db.posts.findByUserId(parent.id);
    },
  },
  Post: {
    author: async (parent, args, context) => {
      return await context.db.users.findById(parent.authorId);
    },
    comments: async (parent, args, context) => {
      return await context.db.comments.findByPostId(parent.id);
    },
  },
};
```

**Type System:**

- **Scalar Types**: `String`, `Int`, `Float`, `Boolean`, `ID`
- **Object Types**: Custom types (User, Post)
- **Lists**: `[Type]` - array of type
- **Non-nullable**: `Type!` - required field
- **Input Types**: For mutations
- **Enums**: Enumeration types
- **Unions**: Multiple possible types
- **Interfaces**: Abstract types

### Q7: What are GraphQL subscriptions and how do they work?

**Answer:**

GraphQL subscriptions enable real-time updates from the server to the client.

**How it works:**

1. Client subscribes to an event
2. Server publishes events when data changes
3. Client receives updates in real-time
4. Connection maintained via WebSocket or SSE

**Example:**

```graphql
# Schema
type Subscription {
  userUpdated(userId: ID!): User!
  postCreated: Post!
}

# Client subscription
subscription {
  userUpdated(userId: "123") {
    id
    name
    email
  }
}

# Server implementation (using PubSub)
const resolvers = {
  Subscription: {
    userUpdated: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator(`USER_UPDATED_${args.userId}`);
      },
    },
    postCreated: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('POST_CREATED');
      },
    },
  },
};

// Publishing events
async function updateUser(userId, data) {
  const user = await db.users.update(userId, data);
  pubsub.publish(`USER_UPDATED_${userId}`, { userUpdated: user });
  return user;
}
```

**Use Cases:**

- Real-time notifications
- Live chat
- Collaborative editing
- Live dashboards
- Stock prices

### Q8: How do you handle N+1 queries in GraphQL?

**Answer:**

N+1 query problem occurs when fetching related data causes multiple database queries.

**Problem Example:**

```typescript
// This causes N+1 queries
const resolvers = {
  Query: {
    users: () => db.users.findAll(), // 1 query
  },
  User: {
    posts: (user) => db.posts.findByUserId(user.id), // N queries (one per user)
  },
};
```

**Solutions:**

**1. DataLoader (Batching):**

```typescript
import DataLoader from "dataloader";

// Create a batch loader
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.posts.findByUserIds(userIds);
  // Group posts by userId
  const postsByUserId = {};
  posts.forEach((post) => {
    if (!postsByUserId[post.userId]) {
      postsByUserId[post.userId] = [];
    }
    postsByUserId[post.userId].push(post);
  });
  // Return in same order as userIds
  return userIds.map((userId) => postsByUserId[userId] || []);
});

const resolvers = {
  User: {
    posts: (user) => postLoader.load(user.id), // Batched automatically
  },
};
```

**2. Eager Loading:**

```typescript
const resolvers = {
  Query: {
    users: () =>
      db.users.findAll({
        include: [{ model: Post }], // Eager load posts
      }),
  },
};
```

**3. Custom Field Resolvers with Context:**

```typescript
const resolvers = {
  Query: {
    users: async () => {
      const users = await db.users.findAll();
      const userIds = users.map((u) => u.id);
      const posts = await db.posts.findByUserIds(userIds);
      // Attach posts to users
      users.forEach((user) => {
        user.posts = posts.filter((p) => p.userId === user.id);
      });
      return users;
    },
  },
};
```

---

## Protocol Buffers

### Q9: What are Protocol Buffers and why use them?

**Answer:**

Protocol Buffers (protobuf) is a language-neutral, platform-neutral serialization format developed by Google.

**Key Features:**

1. **Binary Format**: More compact than JSON/XML
2. **Language Agnostic**: Works with many languages
3. **Schema Evolution**: Backward/forward compatible
4. **Type Safety**: Strong typing
5. **Performance**: Faster serialization/deserialization
6. **Code Generation**: Generates code from .proto files

**Protocol Buffers vs JSON:**

| Feature         | Protocol Buffers | JSON   |
| --------------- | ---------------- | ------ |
| Format          | Binary           | Text   |
| Size            | Smaller          | Larger |
| Speed           | Faster           | Slower |
| Human Readable  | No               | Yes    |
| Schema Required | Yes              | No     |
| Type Safety     | Strong           | Weak   |

**Example .proto file:**

```protobuf
syntax = "proto3";

package user;

// User message definition
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  repeated string tags = 4;
  map<string, string> metadata = 5;
  UserType type = 6;
  Address address = 7;
}

enum UserType {
  UNKNOWN = 0;
  ADMIN = 1;
  USER = 2;
  GUEST = 3;
}

message Address {
  string street = 1;
  string city = 2;
  string country = 3;
  int32 zip_code = 4;
}

// Service definition
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc CreateUser(CreateUserRequest) returns (User);
}

message GetUserRequest {
  int32 user_id = 1;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}
```

**Field Numbers:**

- Each field has a unique number (1, 2, 3, etc.)
- Used for binary encoding
- Once used, cannot be changed
- Reserved numbers cannot be reused

**Data Types:**

- Scalar: `int32`, `int64`, `uint32`, `uint64`, `sint32`, `sint64`
- Floating point: `float`, `double`
- Boolean: `bool`
- String: `string` (UTF-8)
- Bytes: `bytes` (arbitrary byte sequence)

**Repeated Fields:**

```protobuf
repeated string tags = 4; // Array of strings
```

**Maps:**

```protobuf
map<string, string> metadata = 5; // Key-value pairs
```

**Nested Messages:**

```protobuf
message User {
  Address address = 7; // Nested message
}
```

### Q10: How does Protocol Buffer schema evolution work?

**Answer:**

Protocol Buffers support backward and forward compatibility through careful design.

**Rules for Compatibility:**

**1. Don't Change Field Numbers:**

```protobuf
// ❌ BAD - Changing field number breaks compatibility
message User {
  string email = 3; // Was field 2
}

// ✅ GOOD - Keep same field number
message User {
  string email = 2; // Same field number
}
```

**2. Don't Reuse Reserved Field Numbers:**

```protobuf
message User {
  reserved 2, 15 to 20; // Reserve deleted fields
  string name = 1;
  string email = 3; // Skip 2
}
```

**3. Optional vs Required:**

```protobuf
// proto2
message User {
  required string name = 1; // Cannot be removed
  optional string email = 2; // Can be removed
}

// proto3 - All fields are optional by default
message User {
  string name = 1; // Optional by default
  string email = 2; // Optional by default
}
```

**4. Adding New Fields:**

```protobuf
// Old version
message User {
  string name = 1;
  string email = 2;
}

// New version - Adding fields is safe
message User {
  string name = 1;
  string email = 2;
  string phone = 3; // ✅ Safe to add
  int32 age = 4;   // ✅ Safe to add
}
```

**5. Removing Fields:**

```protobuf
// Old version
message User {
  string name = 1;
  string email = 2;
  string phone = 3;
}

// New version - Mark as reserved
message User {
  string name = 1;
  string email = 2;
  reserved 3; // ✅ Safe - old clients ignore, new clients can't use
}
```

**6. Changing Field Types:**

```protobuf
// ❌ BAD - Changing types breaks compatibility
message User {
  int32 id = 1; // Was string
}

// ✅ GOOD - Compatible type changes
// int32 <-> int64 (if value fits)
// string <-> bytes (UTF-8)
```

**7. Renaming Fields:**

- Field names don't affect binary format
- Safe to rename, but update code
- Use `json_name` for JSON representation

```protobuf
message User {
  string name = 1 [json_name = "full_name"]; // JSON uses "full_name"
}
```

---

## RPC (Remote Procedure Call)

### Q11: What is RPC and how does it work?

**Answer:**

RPC (Remote Procedure Call) is a protocol that allows a program to execute code on a remote server as if it were a local function call.

**How RPC Works:**

1. **Client Stub**: Client calls local stub function
2. **Marshalling**: Stub serializes parameters
3. **Network Call**: Stub sends request to server
4. **Server Stub**: Server receives and deserializes
5. **Execution**: Server executes actual function
6. **Response**: Server serializes result and sends back
7. **Unmarshalling**: Client stub deserializes response
8. **Return**: Client receives result as if local call

**RPC Types:**

**1. Synchronous RPC:**

- Client waits for response
- Blocking call
- Simple but can timeout

**2. Asynchronous RPC:**

- Client doesn't wait
- Callback or promise-based
- Better for long operations

**3. One-way RPC:**

- Fire and forget
- No response expected
- Used for notifications

**RPC vs REST:**

| Feature   | RPC                 | REST                |
| --------- | ------------------- | ------------------- |
| Paradigm  | Function calls      | Resource operations |
| Endpoints | Function names      | Resource URIs       |
| Methods   | Function parameters | HTTP methods        |
| State     | Can be stateful     | Stateless           |
| Caching   | Limited             | HTTP caching        |
| Use Case  | Internal services   | Public APIs         |

**RPC Examples:**

**JSON-RPC:**

```json
// Request
{
  "jsonrpc": "2.0",
  "method": "getUser",
  "params": {"id": 123},
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": {"id": 123, "name": "John"},
  "id": 1
}
```

**XML-RPC:**

```xml
<methodCall>
  <methodName>getUser</methodName>
  <params>
    <param><value><i4>123</i4></value></param>
  </params>
</methodCall>
```

**gRPC (Modern RPC):**

```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}
```

### Q12: What are the advantages and disadvantages of RPC?

**Answer:**

**Advantages:**

1. **Abstraction**: Hides network complexity
2. **Type Safety**: Strong typing (in typed RPC like gRPC)
3. **Performance**: Can be faster than REST (binary protocols)
4. **Simplicity**: Natural function call interface
5. **Language Support**: Works across languages
6. **Streaming**: Some RPC frameworks support streaming

**Disadvantages:**

1. **Tight Coupling**: Client and server must agree on interface
2. **Versioning**: Harder to version than REST
3. **Debugging**: Harder to debug (binary protocols)
4. **Caching**: Limited caching support
5. **Firewall**: May have firewall issues
6. **Browser Support**: Limited browser support (need gRPC-Web)

**When to Use RPC:**

- Internal microservices communication
- High-performance requirements
- Strong typing needed
- Real-time streaming needed
- Service-to-service communication

**When to Use REST:**

- Public APIs
- Browser-based applications
- Simple CRUD operations
- Wide compatibility needed
- Caching is important

---

## WebSocket

### Q13: What is WebSocket and how does it differ from HTTP?

**Answer:**

WebSocket is a communication protocol that provides full-duplex communication over a single TCP connection.

**WebSocket vs HTTP:**

| Feature    | WebSocket             | HTTP                           |
| ---------- | --------------------- | ------------------------------ |
| Connection | Persistent            | Request-Response               |
| Direction  | Bidirectional         | Unidirectional (client→server) |
| Overhead   | Low (after handshake) | High (headers each request)    |
| Real-time  | Yes                   | Limited (polling)              |
| State      | Stateful              | Stateless                      |
| Use Case   | Real-time apps        | Traditional web                |

**WebSocket Handshake:**

```
Client Request:
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

Server Response:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

**WebSocket Example:**

```javascript
// Client
const ws = new WebSocket("ws://example.com/chat");

ws.onopen = () => {
  console.log("Connected");
  ws.send("Hello Server");
};

ws.onmessage = (event) => {
  console.log("Received:", event.data);
};

ws.onerror = (error) => {
  console.error("Error:", error);
};

ws.onclose = () => {
  console.log("Disconnected");
};

// Server (Node.js)
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send("Echo: " + message);
  });

  ws.send("Welcome!");
});
```

**Use Cases:**

- Real-time chat
- Live notifications
- Collaborative editing
- Live dashboards
- Gaming
- Trading platforms

---

## Message Queue Protocols

### Q14: What are message queue protocols and when to use them?

**Answer:**

Message queue protocols enable asynchronous communication between services.

**Common Protocols:**

**1. AMQP (Advanced Message Queuing Protocol):**

- Standard protocol
- Supports routing, queuing, reliability
- Examples: RabbitMQ

**2. MQTT (Message Queuing Telemetry Transport):**

- Lightweight
- Designed for IoT
- Publish-subscribe model
- Examples: Mosquitto, AWS IoT

**3. Kafka Protocol:**

- High throughput
- Distributed streaming
- Event sourcing
- Examples: Apache Kafka

**4. Redis Pub/Sub:**

- Simple
- Fast
- In-memory
- Examples: Redis

**When to Use Message Queues:**

- **Decoupling**: Services don't need to know about each other
- **Reliability**: Messages persisted until processed
- **Scalability**: Handle traffic spikes
- **Asynchronous Processing**: Don't block on long operations
- **Event-Driven Architecture**: React to events

**Example (RabbitMQ):**

```javascript
// Producer
const amqp = require("amqplib");
const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();

await channel.assertQueue("tasks", { durable: true });
channel.sendToQueue("tasks", Buffer.from("Task data"), {
  persistent: true,
});

// Consumer
const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();

await channel.assertQueue("tasks", { durable: true });
channel.consume(
  "tasks",
  (msg) => {
    console.log("Received:", msg.content.toString());
    channel.ack(msg);
  },
  { noAck: false }
);
```

---

## Comparison Table

### Q15: Compare REST, gRPC, GraphQL, and WebSocket.

**Answer:**

| Feature             | REST               | gRPC               | GraphQL            | WebSocket              |
| ------------------- | ------------------ | ------------------ | ------------------ | ---------------------- |
| **Protocol**        | HTTP/1.1 or HTTP/2 | HTTP/2             | HTTP/1.1 or HTTP/2 | WebSocket              |
| **Data Format**     | JSON/XML           | Protocol Buffers   | JSON               | Text/Binary            |
| **Performance**     | Medium             | High               | Medium             | High (after handshake) |
| **Type Safety**     | Weak               | Strong             | Strong             | Weak                   |
| **Browser Support** | Excellent          | Limited (gRPC-Web) | Excellent          | Excellent              |
| **Caching**         | HTTP caching       | Limited            | Custom             | None                   |
| **Streaming**       | Limited            | Built-in           | Subscriptions      | Built-in               |
| **Learning Curve**  | Easy               | Medium             | Medium             | Easy                   |
| **Use Case**        | Public APIs        | Microservices      | Flexible queries   | Real-time              |
| **State**           | Stateless          | Stateless          | Stateless          | Stateful               |
| **Versioning**      | URL versioning     | Schema evolution   | Schema evolution   | Protocol version       |

**When to Use Each:**

- **REST**: Public APIs, simple CRUD, wide compatibility
- **gRPC**: Internal microservices, high performance, streaming
- **GraphQL**: Complex data relationships, mobile apps, flexible queries
- **WebSocket**: Real-time applications, chat, live updates

---

_Add more questions as you encounter them in interviews or study materials._
