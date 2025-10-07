# Basic System Design Questions

## Fundamental Concepts

### 1. What is system design and why is it important?

**Answer:**
System design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. It's important because:

- **Scalability**: Ensures systems can handle growth
- **Reliability**: Builds fault-tolerant systems
- **Performance**: Optimizes for speed and efficiency
- **Maintainability**: Creates systems that are easy to update
- **Cost-effectiveness**: Optimizes resource usage

**Key Aspects:**

- Defining system architecture
- Choosing appropriate technologies
- Planning for scale and growth
- Ensuring reliability and availability
- Optimizing performance

### 2. What is the difference between horizontal and vertical scaling?

**Answer:**

**Vertical Scaling (Scale Up)**

- Adding more resources (CPU, RAM, Disk) to a single server
- **Pros:**
  - Simpler implementation
  - No application changes needed
  - Easier data consistency
  - Lower software costs initially
- **Cons:**
  - Hardware limits (ceiling)
  - Single point of failure
  - Downtime during upgrades
  - More expensive at scale

**Horizontal Scaling (Scale Out)**

- Adding more servers to distribute the load
- **Pros:**
  - Nearly unlimited scaling potential
  - Better fault tolerance
  - More cost-effective at scale
  - No downtime for upgrades
- **Cons:**
  - More complex architecture
  - Data consistency challenges
  - Higher software licensing costs
  - Network overhead

**When to use:**

- **Vertical**: Small to medium apps, simpler requirements, quick solution
- **Horizontal**: Large-scale apps, high availability needs, cloud-native applications

### 3. What is a load balancer and how does it work?

**Answer:**
A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much load.

**Types:**

1. **L4 (Transport Layer)**: Routes based on IP and port
   - Faster, less overhead
   - No content awareness
2. **L7 (Application Layer)**: Routes based on content
   - URL-based routing
   - Cookie-based session persistence
   - More intelligent routing

**Common Algorithms:**

1. **Round Robin**: Distributes requests sequentially

   ```
   Request 1 → Server A
   Request 2 → Server B
   Request 3 → Server C
   Request 4 → Server A (repeat)
   ```

2. **Least Connections**: Routes to server with fewest active connections

   - Good for long-lived connections
   - Prevents overloading busy servers

3. **IP Hash**: Routes based on client IP

   - Ensures same client goes to same server
   - Good for session persistence

4. **Weighted Round Robin**: Distributes based on server capacity
   - Server A (weight 3), Server B (weight 1)
   - 3 requests to A for every 1 to B

**Health Checks:**

- Regularly checks server health
- Removes unhealthy servers from pool
- Adds them back when healthy

### 4. What is caching and what are common caching strategies?

**Answer:**
Caching stores frequently accessed data in fast storage to reduce latency and database load.

**Benefits:**

- Reduced latency (faster response times)
- Reduced database load
- Lower costs (fewer database queries)
- Better user experience

**Caching Strategies:**

1. **Cache-Aside (Lazy Loading)**

   ```
   1. Application checks cache first
   2. If cache miss, fetch from database
   3. Store in cache for next time
   ```

   - Pros: Only cache what's needed
   - Cons: Cache misses add latency

2. **Write-Through**

   ```
   1. Write to cache and database simultaneously
   2. Cache always has latest data
   ```

   - Pros: Data always consistent
   - Cons: Higher write latency

3. **Write-Behind (Write-Back)**

   ```
   1. Write to cache immediately
   2. Async write to database later
   ```

   - Pros: Fast writes
   - Cons: Risk of data loss

4. **Read-Through**
   ```
   Cache automatically loads data from database on miss
   ```
   - Pros: Transparent to application
   - Cons: Cache miss adds latency

**Cache Eviction Policies:**

- **LRU** (Least Recently Used): Removes least recently accessed items
- **LFU** (Least Frequently Used): Removes least frequently accessed items
- **FIFO** (First In First Out): Removes oldest items first
- **TTL** (Time To Live): Removes items after expiration time

### 5. What is CAP theorem?

**Answer:**
CAP theorem states that a distributed system can only guarantee 2 of 3 properties:

**C - Consistency**

- All nodes see the same data at the same time
- Every read receives the most recent write
- Example: All replicas show count=100

**A - Availability**

- Every request receives a response (success or failure)
- System continues to operate despite failures
- Example: Always get a response, even if not latest

**P - Partition Tolerance**

- System continues despite network partitions
- Communication between nodes can fail
- Example: System works even if network splits

**Trade-offs:**

**CP Systems** (Consistency + Partition Tolerance)

- Sacrifice availability during partition
- Examples: MongoDB, HBase, Redis (cluster mode)
- Use case: Banking, financial systems

**AP Systems** (Availability + Partition Tolerance)

- Sacrifice consistency during partition
- Eventually consistent
- Examples: Cassandra, DynamoDB, Riak
- Use case: Social media feeds, shopping carts

**CA Systems** (Consistency + Availability)

- Cannot tolerate partitions
- Not truly distributed
- Examples: Traditional RDBMS (single node)
- Use case: Local applications

### 6. What are microservices and what are their advantages?

**Answer:**
Microservices is an architectural style where an application is composed of small, independent services that communicate over networks.

**Characteristics:**

- **Single Responsibility**: Each service does one thing well
- **Independent Deployment**: Deploy services separately
- **Decentralized Data**: Each service owns its data
- **Resilience**: Failure in one doesn't crash all
- **Technology Diversity**: Different tech stacks per service

**Advantages:**

1. **Scalability**: Scale services independently
2. **Flexibility**: Use different technologies
3. **Faster Development**: Teams work independently
4. **Easier Maintenance**: Smaller, focused codebases
5. **Fault Isolation**: Failures don't cascade
6. **Continuous Deployment**: Deploy frequently with less risk

**Disadvantages:**

1. **Complexity**: More services to manage
2. **Network Latency**: Inter-service communication
3. **Data Consistency**: Distributed transactions are hard
4. **Testing**: End-to-end testing is complex
5. **Deployment**: More complex deployment pipelines
6. **Monitoring**: Need comprehensive monitoring

**When to Use:**

- Large, complex applications
- Need for independent scaling
- Multiple teams working on same product
- Different parts have different requirements

**When Not to Use:**

- Small applications
- Limited team size
- Tight coupling between features
- Simple, straightforward requirements

### 7. What is database sharding?

**Answer:**
Sharding is a database partitioning technique where data is split across multiple databases (shards) horizontally.

**Why Shard?**

- Single database can't handle load
- Storage limitations
- Improve query performance
- Geographic distribution

**Sharding Strategies:**

1. **Range-Based Sharding**

   ```
   Shard 1: Users A-H
   Shard 2: Users I-P
   Shard 3: Users Q-Z
   ```

   - Pros: Simple, easy to add ranges
   - Cons: Uneven distribution, hotspots

2. **Hash-Based Sharding**

   ```
   Shard = hash(userId) % number_of_shards
   ```

   - Pros: Even distribution
   - Cons: Hard to add shards (reshard needed)

3. **Geographic Sharding**

   ```
   Shard 1: US users
   Shard 2: EU users
   Shard 3: Asia users
   ```

   - Pros: Low latency for users
   - Cons: Uneven load, cross-region queries

4. **Entity-Based Sharding**
   ```
   Shard 1: Customers
   Shard 2: Orders
   Shard 3: Products
   ```
   - Pros: Natural boundaries
   - Cons: Cross-entity queries expensive

**Challenges:**

- **Cross-shard queries**: Joining data across shards
- **Rebalancing**: Adding/removing shards
- **Hotspots**: Some shards get more traffic
- **Complexity**: Application must be shard-aware

### 8. What is database replication?

**Answer:**
Database replication is copying data from one database to one or more databases to improve availability and reliability.

**Types:**

**1. Master-Slave (Primary-Replica)**

```
Master (Writes) ──┬──► Slave 1 (Reads)
                  ├──► Slave 2 (Reads)
                  └──► Slave 3 (Reads)
```

- **Pros:**
  - Scale read operations
  - Simple implementation
  - Clear write path
- **Cons:**
  - Single point of failure (master)
  - Write bottleneck
  - Replication lag

**2. Master-Master (Multi-Master)**

```
Master 1 ◄──► Master 2
   ▲              ▲
   │              │
Clients      Clients
```

- **Pros:**
  - No single point of failure
  - Can write to any master
  - Geographic distribution
- **Cons:**
  - Write conflicts possible
  - Complex conflict resolution
  - More complex setup

**Replication Methods:**

**Synchronous Replication**

- Master waits for slave acknowledgment
- **Pros**: Data consistency guaranteed
- **Cons**: Higher latency

**Asynchronous Replication**

- Master doesn't wait for slaves
- **Pros**: Better performance
- **Cons**: Potential data loss, eventual consistency

### 9. What is a CDN (Content Delivery Network)?

**Answer:**
A CDN is a geographically distributed network of servers that deliver content to users from the nearest location.

**How it Works:**

```
User (US) ──► CDN Edge (US) ──► Origin Server (Europe)
                   │ (cache hit)
                   └──► Serve from cache
```

**Benefits:**

1. **Reduced Latency**: Serve from nearby servers
2. **Lower Bandwidth**: Reduce origin server load
3. **Better Availability**: Multiple copies of content
4. **DDoS Protection**: Distribute attack traffic
5. **Better Performance**: Faster page loads

**What to Cache:**

- Static assets (images, CSS, JavaScript)
- Video content
- HTML pages (with appropriate cache headers)
- API responses (if applicable)

**Cache Strategies:**

1. **Pull CDN**: Fetch content from origin on first request
2. **Push CDN**: Manually push content to CDN

**Cache Invalidation:**

- **TTL**: Set expiration time
- **Purge**: Manually clear cache
- **Versioning**: Use versioned URLs (style.v2.css)

### 10. What is an API Gateway?

**Answer:**
An API Gateway is a server that acts as an entry point for clients to access backend microservices.

**Functions:**

1. **Routing**: Direct requests to appropriate services
2. **Authentication/Authorization**: Verify user identity and permissions
3. **Rate Limiting**: Prevent abuse
4. **Request/Response Transformation**: Modify requests/responses
5. **Load Balancing**: Distribute load across services
6. **Caching**: Cache responses
7. **Monitoring**: Log and track requests
8. **Circuit Breaking**: Handle service failures

**Benefits:**

- **Single Entry Point**: Simplified client access
- **Centralized Logic**: Cross-cutting concerns in one place
- **Protocol Translation**: REST to gRPC, etc.
- **Service Composition**: Combine multiple service calls
- **Version Management**: Handle API versions

**Example Flow:**

```
Client ──► API Gateway ──┬──► Auth Service
                         ├──► User Service
                         ├──► Order Service
                         └──► Payment Service
```

## Design Pattern Questions

### 11. Explain the difference between REST and GraphQL

**Answer:**

**REST (Representational State Transfer)**

```
GET /users/123
GET /users/123/posts
GET /posts/456/comments
```

**Characteristics:**

- Multiple endpoints
- Fixed data structure per endpoint
- Over-fetching or under-fetching common
- HTTP methods (GET, POST, PUT, DELETE)
- Stateless

**Pros:**

- Simple and well-understood
- Good caching support
- Clear endpoint structure
- Wide tooling support

**Cons:**

- Multiple round trips for related data
- Over-fetching (getting unused data)
- Under-fetching (need additional requests)

**GraphQL**

```graphql
query {
  user(id: 123) {
    name
    posts {
      title
      comments {
        text
      }
    }
  }
}
```

**Characteristics:**

- Single endpoint
- Client specifies exact data needed
- Strongly typed schema
- Real-time updates (subscriptions)

**Pros:**

- No over/under-fetching
- Single request for nested data
- Flexible queries
- Self-documenting

**Cons:**

- More complex to implement
- Caching is harder
- Query complexity issues
- Learning curve

**When to Use:**

- **REST**: Simple CRUD, caching important, public APIs
- **GraphQL**: Complex data relationships, mobile apps, flexible queries needed

### 12. What is eventual consistency?

**Answer:**
Eventual consistency is a consistency model where, given no new updates, all replicas will eventually return the same value.

**Characteristics:**

- Updates may not be immediately visible
- Different replicas may return different values temporarily
- Given enough time, all replicas converge to same state

**Example:**

```
Time T0: User updates profile in US server
Time T1: US server updated, EU server still old
Time T2: Replication in progress
Time T3: EU server updated, both consistent
```

**Pros:**

- Higher availability
- Better performance
- Can handle network partitions
- Lower latency

**Cons:**

- Temporary inconsistency
- More complex application logic
- Potential user confusion
- Conflict resolution needed

**Use Cases:**

- Social media feeds (ok if post appears slightly delayed)
- Shopping cart (ok if count is eventually correct)
- DNS (ok if changes take time to propagate)
- Analytics dashboards

**Not Suitable For:**

- Banking transactions (need strong consistency)
- Inventory systems (avoid overselling)
- Authentication (security critical)

### 13. What is the purpose of message queues?

**Answer:**
Message queues enable asynchronous communication between services by storing messages until they're processed.

**Benefits:**

1. **Decoupling**: Services don't need to know about each other
2. **Reliability**: Messages stored until processed
3. **Scalability**: Process messages at own pace
4. **Peak Handling**: Buffer during traffic spikes
5. **Async Processing**: Non-blocking operations

**Common Use Cases:**

- Email sending
- Image processing
- Order processing
- Notifications
- Log aggregation

**Popular Message Queues:**

- **RabbitMQ**: Traditional message broker
- **Apache Kafka**: Distributed event streaming
- **AWS SQS**: Managed queue service
- **Redis**: Simple pub/sub

**Example Flow:**

```
Web Server ──► Queue ──► Worker 1
                    ├──► Worker 2
                    └──► Worker 3
```

**Patterns:**

1. **Work Queue**: Multiple workers process tasks
2. **Pub/Sub**: Multiple subscribers for each message
3. **Request-Reply**: RPC over queues
4. **Priority Queue**: Process high-priority first

### 14. How do you ensure data consistency in distributed systems?

**Answer:**
Ensuring data consistency in distributed systems requires various strategies:

**1. Strong Consistency (ACID)**

- Two-Phase Commit (2PC)
- Distributed transactions
- Consensus algorithms (Raft, Paxos)
- **Downside**: Lower availability, higher latency

**2. Eventual Consistency**

- Accept temporary inconsistencies
- Systems converge over time
- **Downside**: Complex conflict resolution

**3. Saga Pattern**

- Break transaction into local transactions
- Compensating transactions for rollback
- **Example**: Order → Payment → Inventory → Shipping

**4. Event Sourcing**

- Store all state changes as events
- Rebuild state from events
- **Benefit**: Complete audit trail

**5. CQRS (Command Query Responsibility Segregation)**

- Separate read and write models
- Write to master, read from replicas
- **Benefit**: Optimize each path separately

**6. Conflict Resolution Strategies**

- Last Write Wins (LWW)
- Version vectors
- CRDTs (Conflict-free Replicated Data Types)
- Application-level resolution

### 15. What is rate limiting and why is it important?

**Answer:**
Rate limiting controls the rate at which users can access an API or service.

**Why It's Important:**

1. **Prevent Abuse**: Stop malicious attacks
2. **Cost Control**: Limit resource usage
3. **Fair Usage**: Ensure all users get service
4. **Service Stability**: Prevent overload
5. **Revenue**: Encourage paid tiers

**Algorithms:**

**1. Token Bucket**

```
- Bucket holds tokens
- Request consumes token
- Tokens refilled at fixed rate
- Can handle bursts
```

**2. Leaky Bucket**

```
- Requests enter bucket
- Process at fixed rate
- Excess requests overflow
- Smooths out bursts
```

**3. Fixed Window**

```
- Count requests in time window (1 minute)
- Reset counter at window boundary
- Simple but has edge case issues
```

**4. Sliding Window Log**

```
- Track timestamp of each request
- Count requests in last N seconds
- More accurate but memory intensive
```

**5. Sliding Window Counter**

```
- Hybrid of fixed window and sliding window
- More accurate than fixed window
- Less memory than sliding log
```

**Implementation Levels:**

- **User-level**: Per user limits
- **IP-level**: Per IP address
- **Global**: Overall system limits
- **Endpoint-level**: Per API endpoint

**Response:**

- Return `429 Too Many Requests`
- Include `Retry-After` header
- Provide clear error message

---

## Quick Reference

### When to Use What?

| Need                           | Solution                      |
| ------------------------------ | ----------------------------- |
| Store frequently accessed data | Caching (Redis, Memcached)    |
| Distribute traffic             | Load Balancer                 |
| Handle write-heavy workload    | Database sharding             |
| Improve read performance       | Database replication, caching |
| Async processing               | Message Queue                 |
| Store files                    | Object Storage (S3)           |
| Real-time search               | Elasticsearch                 |
| Serve static content globally  | CDN                           |
| API management                 | API Gateway                   |
| Session storage                | Redis, Memcached              |

### Common Architecture Patterns

1. **Monolith**: Single deployable unit
2. **Microservices**: Independent services
3. **Event-Driven**: Services communicate via events
4. **Serverless**: Functions as a service
5. **Service-Oriented**: Reusable business services

---

**These fundamental concepts form the building blocks of system design. Master them before moving to more complex topics!**
