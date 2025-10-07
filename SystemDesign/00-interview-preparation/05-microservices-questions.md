# Microservices Questions

## Microservices Architecture

### 1. What are microservices and when should you use them?

**Answer:**

**Microservices** is an architectural style where an application is composed of small, independent services that communicate over networks.

**Characteristics:**

- **Single Responsibility**: Each service does one thing well
- **Independent Deployment**: Deploy services separately
- **Decentralized Data**: Each service owns its data
- **Technology Diversity**: Different tech stacks per service
- **Resilience**: Failure in one doesn't crash all
- **Organized around Business Capabilities**

**Monolith vs Microservices:**

**Monolith:**

```
┌────────────────────────────┐
│   Single Application       │
│  ┌──────────────────────┐  │
│  │  User Module         │  │
│  │  Product Module      │  │
│  │  Order Module        │  │
│  │  Payment Module      │  │
│  └──────────────────────┘  │
│   Single Database          │
└────────────────────────────┘
```

**Microservices:**

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ User Service│  │Product Svc  │  │Order Service│
│    + DB     │  │    + DB     │  │    + DB     │
└─────────────┘  └─────────────┘  └─────────────┘
       │                │                │
       └────────────────┴────────────────┘
              API Gateway / Service Mesh
```

**When to Use Microservices:**

**✅ Good Fit:**

- Large, complex applications
- Multiple teams working on same product
- Different parts need different scaling
- Need for frequent deployments
- Different parts have different technology needs
- Long-term, evolving product

**❌ Not a Good Fit:**

- Small applications (< 100K LOC)
- Small team (< 5 developers)
- Early-stage startups (requirements changing fast)
- Simple CRUD applications
- Limited DevOps capabilities

**Example: E-commerce Microservices**

```typescript
// Service breakdown
const services = {
  userService: {
    responsibilities: ["authentication", "user profiles", "preferences"],
    database: "PostgreSQL",
    technology: "Node.js",
  },
  productService: {
    responsibilities: ["product catalog", "inventory", "search"],
    database: "Elasticsearch + PostgreSQL",
    technology: "Java/Spring",
  },
  orderService: {
    responsibilities: ["order processing", "order history"],
    database: "PostgreSQL",
    technology: "Node.js",
  },
  paymentService: {
    responsibilities: ["payment processing", "refunds"],
    database: "PostgreSQL",
    technology: "Go",
  },
  notificationService: {
    responsibilities: ["email", "SMS", "push notifications"],
    database: "MongoDB",
    technology: "Python",
  },
};
```

**Challenges:**

1. **Complexity**: More services to manage
2. **Data Consistency**: Distributed transactions are hard
3. **Network Latency**: Inter-service communication
4. **Testing**: End-to-end testing is complex
5. **Monitoring**: Need comprehensive monitoring
6. **Deployment**: More complex deployment pipelines
7. **Debugging**: Harder to trace issues across services

### 2. How do microservices communicate with each other?

**Answer:**

**Communication Patterns:**

**1. Synchronous Communication**

**REST APIs:**

```typescript
// Order Service calls Product Service
class OrderService {
  async createOrder(orderData: OrderData) {
    // Call Product Service to check inventory
    const response = await fetch(
      "http://product-service/api/products/check-inventory",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: orderData.productIds }),
      }
    );

    const inventory = await response.json();

    if (!inventory.available) {
      throw new Error("Products out of stock");
    }

    // Create order
    return this.createOrderRecord(orderData);
  }
}
```

**Pros:**

- Simple to implement
- Easy to debug
- Immediate response

**Cons:**

- Tight coupling
- Service must be available
- Cascading failures
- Higher latency

**gRPC (Better for Microservices):**

```protobuf
// product.proto
service ProductService {
    rpc CheckInventory(InventoryRequest) returns (InventoryResponse);
    rpc GetProduct(ProductRequest) returns (Product);
}

message InventoryRequest {
    repeated string product_ids = 1;
}

message InventoryResponse {
    bool available = 1;
    map<string, int32> quantities = 2;
}
```

```go
// Client code
conn, _ := grpc.Dial("product-service:50051")
client := pb.NewProductServiceClient(conn)

response, _ := client.CheckInventory(context.Background(), &pb.InventoryRequest{
    ProductIds: []string{"prod1", "prod2"},
})
```

**Pros:**

- Faster than REST (binary protocol)
- Type-safe (protobuf definitions)
- Built-in streaming
- Better performance

**Cons:**

- More complex setup
- Less human-readable
- Browser support limited

**2. Asynchronous Communication**

**Message Queue (Point-to-Point):**

```typescript
// Producer: Order Service
class OrderService {
  async createOrder(orderData: OrderData) {
    const order = await this.saveOrder(orderData);

    // Send message to queue
    await messageQueue.send("order-created", {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
    });

    return order;
  }
}

// Consumer: Notification Service
class NotificationService {
  async start() {
    messageQueue.subscribe("order-created", async (message) => {
      await this.sendOrderConfirmation(message);
    });
  }
}
```

**Event Bus (Publish-Subscribe):**

```typescript
// Publisher: Order Service
eventBus.publish('OrderCreated', {
    orderId: '123',
    userId: '456',
    items: [...]
});

// Subscribers
class InventoryService {
    init() {
        eventBus.subscribe('OrderCreated', this.reserveInventory);
    }
}

class NotificationService {
    init() {
        eventBus.subscribe('OrderCreated', this.sendEmail);
    }
}

class AnalyticsService {
    init() {
        eventBus.subscribe('OrderCreated', this.trackOrder);
    }
}
```

**Pros:**

- Loose coupling
- Services don't need to be online
- Better scalability
- Natural retry mechanism

**Cons:**

- Eventual consistency
- More complex debugging
- Message ordering challenges
- Duplicate message handling

**3. Service Mesh**

```
Service A ──► Sidecar Proxy ──► Sidecar Proxy ──► Service B
           (Envoy)              (Envoy)

Service Mesh (Istio/Linkerd) handles:
- Service discovery
- Load balancing
- Encryption (mTLS)
- Observability
- Circuit breaking
```

**Best Practices:**

1. **Use Async for Non-Critical Flows**

   - Notifications
   - Analytics
   - Logging

2. **Use Sync for Critical Flows**

   - Payment processing
   - Inventory checks
   - User authentication

3. **Implement Timeouts**

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

response, err := client.GetProduct(ctx, request)
```

4. **Idempotency**

```typescript
async function processPayment(paymentId: string, amount: number) {
  // Check if already processed
  if (await db.paymentExists(paymentId)) {
    return { status: "already_processed" };
  }

  // Process payment
  const result = await paymentGateway.charge(amount);
  await db.savePayment(paymentId, result);

  return result;
}
```

### 3. How do you handle distributed transactions in microservices?

**Answer:**

Traditional ACID transactions don't work well in microservices. Use these patterns:

**1. Saga Pattern**

**Choreography-Based Saga:**

```typescript
// Order Service
class OrderService {
  async createOrder(orderData: OrderData) {
    const order = await db.createOrder(orderData);

    // Publish event
    eventBus.publish("OrderCreated", {
      orderId: order.id,
      items: order.items,
      userId: order.userId,
      total: order.total,
    });

    return order;
  }
}

// Inventory Service
class InventoryService {
  async onOrderCreated(event: OrderCreatedEvent) {
    try {
      await this.reserveInventory(event.items);

      eventBus.publish("InventoryReserved", {
        orderId: event.orderId,
      });
    } catch (error) {
      eventBus.publish("InventoryReservationFailed", {
        orderId: event.orderId,
        reason: error.message,
      });
    }
  }
}

// Payment Service
class PaymentService {
  async onInventoryReserved(event: InventoryReservedEvent) {
    try {
      await this.chargePayment(event.orderId);

      eventBus.publish("PaymentCompleted", {
        orderId: event.orderId,
      });
    } catch (error) {
      // Compensate: Release inventory
      eventBus.publish("PaymentFailed", {
        orderId: event.orderId,
      });
    }
  }
}

// Inventory Service (Compensation)
class InventoryService {
  async onPaymentFailed(event: PaymentFailedEvent) {
    await this.releaseInventory(event.orderId);
  }
}
```

**Orchestration-Based Saga:**

```typescript
class OrderSagaOrchestrator {
  async executeOrderSaga(orderData: OrderData) {
    const saga = {
      steps: [
        {
          name: "createOrder",
          action: () => this.orderService.createOrder(orderData),
          compensate: (order) => this.orderService.cancelOrder(order.id),
        },
        {
          name: "reserveInventory",
          action: (order) => this.inventoryService.reserve(order.items),
          compensate: (order) => this.inventoryService.release(order.items),
        },
        {
          name: "chargePayment",
          action: (order) => this.paymentService.charge(order.total),
          compensate: (order) => this.paymentService.refund(order.total),
        },
        {
          name: "createShipment",
          action: (order) => this.shippingService.createShipment(order),
          compensate: (order) => this.shippingService.cancelShipment(order.id),
        },
      ],
    };

    const completedSteps = [];
    let order = null;

    try {
      for (const step of saga.steps) {
        console.log(`Executing: ${step.name}`);
        order = await step.action(order);
        completedSteps.push({ step, result: order });
      }

      return { success: true, order };
    } catch (error) {
      console.log("Saga failed, compensating...");

      // Execute compensation in reverse order
      for (const { step, result } of completedSteps.reverse()) {
        try {
          await step.compensate(result);
        } catch (compensateError) {
          console.error(`Compensation failed for ${step.name}`);
          // Log to dead letter queue for manual intervention
        }
      }

      return { success: false, error };
    }
  }
}
```

**2. Event Sourcing + CQRS**

```typescript
// Event Store
interface Event {
  aggregateId: string;
  type: string;
  data: any;
  timestamp: Date;
  version: number;
}

class OrderEventStore {
  private events: Event[] = [];

  async appendEvent(event: Event) {
    // Store event
    this.events.push(event);

    // Publish to event bus
    await eventBus.publish(event.type, event);
  }

  async getEvents(aggregateId: string): Promise<Event[]> {
    return this.events.filter((e) => e.aggregateId === aggregateId);
  }

  async replayEvents(aggregateId: string): Promise<Order> {
    const events = await this.getEvents(aggregateId);

    // Rebuild state from events
    return events.reduce((order, event) => {
      switch (event.type) {
        case "OrderCreated":
          return new Order(event.data);
        case "ItemAdded":
          order.addItem(event.data.item);
          return order;
        case "PaymentCompleted":
          order.status = "PAID";
          return order;
        default:
          return order;
      }
    }, null);
  }
}

// Command handler
class OrderCommandHandler {
  async createOrder(command: CreateOrderCommand) {
    const event = {
      aggregateId: command.orderId,
      type: "OrderCreated",
      data: command,
      timestamp: new Date(),
      version: 1,
    };

    await eventStore.appendEvent(event);
  }
}

// Query handler (separate read model)
class OrderQueryHandler {
  async getOrder(orderId: string) {
    // Read from optimized read model
    return readDatabase.findOne({ orderId });
  }
}

// Event listener (updates read model)
class OrderProjection {
  async onOrderCreated(event: OrderCreatedEvent) {
    await readDatabase.insert({
      orderId: event.aggregateId,
      ...event.data,
      status: "CREATED",
    });
  }

  async onPaymentCompleted(event: PaymentCompletedEvent) {
    await readDatabase.update(
      { orderId: event.aggregateId },
      { status: "PAID" }
    );
  }
}
```

**3. Two-Phase Commit (Avoid if Possible)**

Only use for critical transactions that absolutely need ACID:

```go
type TransactionCoordinator struct {
    participants []Participant
}

func (tc *TransactionCoordinator) Execute(txn Transaction) error {
    // Phase 1: Prepare
    for _, p := range tc.participants {
        if err := p.Prepare(txn); err != nil {
            tc.Abort(txn)
            return err
        }
    }

    // Phase 2: Commit
    for _, p := range tc.participants {
        if err := p.Commit(txn); err != nil {
            // Problem: Can't rollback after some committed
            log.Fatal("Inconsistent state!")
        }
    }

    return nil
}
```

**Problems with 2PC:**

- Blocking (coordinator failure = stuck)
- Slow (multiple round trips)
- Not partition tolerant

### 4. How do you implement service discovery?

**Answer:**

Service discovery allows services to find and communicate with each other dynamically.

**Patterns:**

**1. Client-Side Discovery**

```go
// Service Registry (e.g., Consul, etcd)
type ServiceRegistry interface {
    Register(service ServiceInfo) error
    Deregister(serviceId string) error
    Discover(serviceName string) ([]ServiceInfo, error)
}

// Service registers itself
func (s *ProductService) Start() {
    registry.Register(ServiceInfo{
        ID:      "product-service-1",
        Name:    "product-service",
        Address: "192.168.1.10",
        Port:    8080,
        Health:  "/health"
    })

    // Send heartbeats
    go s.sendHeartbeats()
}

// Client discovers and calls service
func (c *OrderService) GetProduct(productId string) (*Product, error) {
    // Discover product service instances
    instances, _ := registry.Discover("product-service")

    // Load balance (pick one)
    instance := loadBalancer.PickOne(instances)

    // Call service
    url := fmt.Sprintf("http://%s:%d/products/%s",
        instance.Address, instance.Port, productId)
    response, _ := http.Get(url)

    // Parse response
    var product Product
    json.NewDecoder(response.Body).Decode(&product)

    return &product, nil
}
```

**2. Server-Side Discovery (Load Balancer)**

```
Client ──► Load Balancer ──► Service Registry
                 │
                 ├──► Service Instance 1
                 ├──► Service Instance 2
                 └──► Service Instance 3
```

**Implementation with Kubernetes:**

```yaml
# Service definition
apiVersion: v1
kind: Service
metadata:
  name: product-service
spec:
  selector:
    app: product
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP

# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product
  template:
    metadata:
      labels:
        app: product
    spec:
      containers:
      - name: product
        image: product-service:v1
        ports:
        - containerPort: 8080
```

**Client code:**

```go
// Kubernetes handles service discovery via DNS
url := "http://product-service/products/" + productId
response, _ := http.Get(url)
```

**3. Service Mesh (Istio/Linkerd)**

```yaml
# Istio Virtual Service
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: product-service
spec:
  hosts:
    - product-service
  http:
    - route:
        - destination:
            host: product-service
            subset: v1
          weight: 90
        - destination:
            host: product-service
            subset: v2
          weight: 10 # Canary deployment
```

Service mesh handles:

- Service discovery
- Load balancing
- Circuit breaking
- Retries
- Timeouts
- Observability

### 5. How do you ensure data consistency across microservices?

**Answer:**

**Strategies:**

**1. Database per Service (Recommended)**

Each service owns its data:

```
User Service ──► User DB
Product Service ──► Product DB
Order Service ──► Order DB
```

**Pros:**

- Loose coupling
- Independent scaling
- Technology diversity

**Cons:**

- No foreign keys across services
- Distributed transactions needed

**2. Shared Database (Anti-Pattern)**

All services share one database:

```
User Service ──┐
Product Service├──► Shared DB
Order Service ──┘
```

**Pros:**

- Easy to query across services
- ACID transactions

**Cons:**

- Tight coupling
- Can't scale independently
- Schema changes affect all services

**3. API Composition**

Fetch data from multiple services:

```typescript
async function getOrderDetails(orderId: string) {
  const order = await orderService.getOrder(orderId);
  const user = await userService.getUser(order.userId);
  const products = await Promise.all(
    order.items.map((item) => productService.getProduct(item.productId))
  );

  return {
    order,
    user,
    products,
  };
}
```

**4. CQRS (Command Query Responsibility Segregation)**

Separate read and write models:

```typescript
// Write side: Order Service
class OrderCommandService {
  async createOrder(command: CreateOrderCommand) {
    const order = new Order(command);
    await orderWriteDb.save(order);

    // Publish event
    await eventBus.publish("OrderCreated", order);
  }
}

// Read side: Order Query Service
class OrderQueryService {
  private readModel: OrderReadModel;

  async onOrderCreated(event: OrderCreatedEvent) {
    // Fetch related data and create denormalized view
    const user = await userService.getUser(event.userId);
    const products = await productService.getProducts(event.items);

    await this.readModel.save({
      orderId: event.orderId,
      userName: user.name,
      userEmail: user.email,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
      })),
      total: event.total,
      status: event.status,
    });
  }

  async getOrderDetails(orderId: string) {
    // Single query, all data denormalized
    return this.readModel.findOne({ orderId });
  }
}
```

**5. Event-Driven Architecture**

Services communicate via events to maintain consistency:

```typescript
// Order Service publishes event
eventBus.publish("OrderCreated", {
  orderId: "123",
  userId: "456",
  items: [{ productId: "789", quantity: 2 }],
});

// Inventory Service listens and updates
class InventoryService {
  async onOrderCreated(event: OrderCreatedEvent) {
    for (const item of event.items) {
      await this.reduceStock(item.productId, item.quantity);
    }
  }
}

// Analytics Service listens and tracks
class AnalyticsService {
  async onOrderCreated(event: OrderCreatedEvent) {
    await this.trackSale(event.orderId, event.total);
  }
}
```

---

## Microservices Patterns Quick Reference

### Communication Patterns

- **Synchronous**: REST, gRPC (tight coupling, immediate response)
- **Asynchronous**: Message queues, event bus (loose coupling, eventual consistency)
- **Hybrid**: Sync for critical, async for non-critical

### Data Management

- **Database per Service**: Each service owns its data
- **Saga**: Distributed transactions via local transactions + compensation
- **Event Sourcing**: Store all state changes as events
- **CQRS**: Separate read/write models

### Resilience Patterns

- **Circuit Breaker**: Prevent cascade failures
- **Bulkhead**: Isolate resources
- **Retry**: Retry with exponential backoff
- **Timeout**: Fail fast on slow operations
- **Fallback**: Graceful degradation

### Deployment Patterns

- **Blue-Green**: Two identical environments
- **Canary**: Gradual rollout to subset of users
- **Rolling Update**: Update instances one by one

---

**Master microservices patterns to build scalable, resilient distributed systems!**
