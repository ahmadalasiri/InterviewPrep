# System Design - Complete Learning Guide

This repository contains a comprehensive guide to learning System Design with practical examples, interview questions, and implementation patterns.

## Table of Contents

### 1. Fundamentals

- [Load Balancing](01-fundamentals/load-balancer.go) - Load balancing algorithms and implementations
- [Caching Strategies](01-fundamentals/caching.ts) - Cache patterns, eviction policies, distributed caching
- [CDN Implementation](01-fundamentals/cdn.ts) - Content delivery and edge caching
- [Rate Limiting](01-fundamentals/rate-limiter.go) - Token bucket, leaky bucket, sliding window
- [API Gateway](01-fundamentals/api-gateway.ts) - Request routing, authentication, rate limiting
- [Consistent Hashing](01-fundamentals/consistent-hashing.go) - Distributed hash tables

### 2. Database Design

- [Database Sharding](02-databases/sharding.go) - Horizontal partitioning strategies
- [Database Replication](02-databases/replication.ts) - Master-slave, master-master patterns
- [CAP Theorem](02-databases/cap-theorem.md) - Consistency, Availability, Partition tolerance
- [SQL vs NoSQL](02-databases/sql-vs-nosql.md) - When to use each
- [Indexing Strategies](02-databases/indexing.md) - B-tree, hash, full-text indexes
- [Database Scaling](02-databases/scaling-patterns.md) - Vertical and horizontal scaling

### 3. Microservices Architecture

- [Service Communication](03-microservices/service-communication.go) - REST, gRPC, Message queues
- [Service Discovery](03-microservices/service-discovery.ts) - Dynamic service registration
- [Circuit Breaker](03-microservices/circuit-breaker.go) - Fault tolerance pattern
- [Saga Pattern](03-microservices/saga-pattern.ts) - Distributed transactions
- [Event Sourcing](03-microservices/event-sourcing.go) - Event-driven architecture
- [CQRS Pattern](03-microservices/cqrs.ts) - Command Query Responsibility Segregation
- [Design Microservices Architecture with Patterns & Principles](03-microservices/microservices-design.md) - Comprehensive guide to designing microservices

### 4. Distributed Systems

- [Distributed Cache](04-distributed-systems/distributed-cache.go) - Redis, Memcached patterns
- [Message Queue](04-distributed-systems/message-queue.ts) - RabbitMQ, Kafka patterns
- [Distributed Locks](04-distributed-systems/distributed-lock.go) - Coordination in distributed systems
- [Consensus Algorithms](04-distributed-systems/consensus.md) - Raft, Paxos
- [MapReduce](04-distributed-systems/mapreduce.go) - Distributed data processing
- [Gossip Protocol](04-distributed-systems/gossip-protocol.go) - Peer-to-peer communication

### 5. Real-World System Designs

- [URL Shortener](05-real-world-systems/url-shortener/) - Complete system design with implementation
- [Rate Limiter Service](05-real-world-systems/rate-limiter-service/) - Distributed rate limiting
- [Social Media Feed](05-real-world-systems/social-feed/) - News feed generation and ranking
- [Chat System](05-real-world-systems/chat-system/) - Real-time messaging system
- [Video Streaming Platform](05-real-world-systems/video-streaming/) - Netflix-like system
- [Search Engine](05-real-world-systems/search-engine/) - Distributed search and indexing
- [E-commerce System](05-real-world-systems/ecommerce/) - Online shopping platform
- [Ride-Sharing System](05-real-world-systems/ride-sharing/) - Uber-like system

## Getting Started

### Prerequisites

- Understanding of basic data structures and algorithms
- Familiarity with databases (SQL and NoSQL)
- Knowledge of networking concepts
- Experience with at least one programming language (Go or TypeScript recommended)

### Learning Path

#### Phase 1: Fundamentals (Weeks 1-2)

- Study core system design components
- Understand load balancing and caching
- Learn about CAP theorem and trade-offs
- Practice designing simple systems

#### Phase 2: Scalability (Weeks 3-4)

- Database scaling strategies
- Horizontal vs vertical scaling
- Caching strategies
- CDN and edge computing

#### Phase 3: Distributed Systems (Weeks 5-6)

- Distributed databases
- Message queues and event-driven architecture
- Consensus algorithms
- Distributed transactions

#### Phase 4: Microservices (Weeks 7-8)

- Service-oriented architecture
- API design and versioning
- Service communication patterns
- Fault tolerance and resilience

#### Phase 5: Real-World Systems (Weeks 9-12)

- Design popular systems (Twitter, Netflix, etc.)
- Practice system design interviews
- Build complete implementations
- Review and optimize designs

## Key Concepts

### Scalability

**Vertical Scaling (Scale Up)**

- Add more resources (CPU, RAM) to existing servers
- Simpler to implement
- Limited by hardware constraints
- Single point of failure

**Horizontal Scaling (Scale Out)**

- Add more servers to distribute load
- Better fault tolerance
- More complex to implement
- Virtually unlimited scaling

### Performance Metrics

- **Throughput**: Requests per second (RPS)
- **Latency**: Response time (p50, p95, p99)
- **Availability**: Uptime percentage (99.9%, 99.99%)
- **Consistency**: Data consistency guarantees
- **Durability**: Data persistence guarantees

### Design Principles

#### 1. Separation of Concerns

- Keep different functionalities independent
- Makes system easier to understand and maintain

#### 2. Single Responsibility

- Each component should have one clear purpose
- Easier to scale and debug

#### 3. Fail Fast

- Detect and handle errors early
- Use timeouts and circuit breakers

#### 4. Eventual Consistency

- Accept temporary inconsistencies for better availability
- Use when strong consistency is not required

#### 5. Idempotency

- Operations can be repeated safely
- Critical for distributed systems

### CAP Theorem

You can only guarantee 2 of 3:

- **Consistency**: All nodes see same data at same time
- **Availability**: Every request receives a response
- **Partition Tolerance**: System continues despite network failures

**Common Choices:**

- **CP Systems**: MongoDB, HBase, Redis (prioritize consistency)
- **AP Systems**: Cassandra, DynamoDB, CouchDB (prioritize availability)
- **CA Systems**: Traditional RDBMS (not truly distributed)

### Load Balancing Algorithms

1. **Round Robin**: Distribute requests sequentially
2. **Least Connections**: Send to server with fewest active connections
3. **Least Response Time**: Send to fastest server
4. **IP Hash**: Route based on client IP address
5. **Weighted Round Robin**: Distribute based on server capacity
6. **Geographic**: Route based on client location

### Caching Strategies

1. **Cache-Aside**: Application manages cache manually
2. **Write-Through**: Write to cache and database simultaneously
3. **Write-Behind**: Write to cache first, sync to database later
4. **Read-Through**: Cache loads data from database automatically
5. **Refresh-Ahead**: Proactively refresh cache before expiration

### Cache Eviction Policies

- **LRU** (Least Recently Used): Evict oldest unused item
- **LFU** (Least Frequently Used): Evict least accessed item
- **FIFO** (First In First Out): Evict oldest item
- **TTL** (Time To Live): Evict based on expiration time

### Database Patterns

#### Sharding Strategies

1. **Range-Based**: Shard by value ranges
2. **Hash-Based**: Shard by hash of key
3. **Geographic**: Shard by location
4. **Entity-Based**: Shard by entity type

#### Replication Patterns

1. **Master-Slave**: One write node, multiple read nodes
2. **Master-Master**: Multiple write nodes
3. **Multi-Master**: Distributed writes with conflict resolution

## System Design Process

### 1. Requirements Clarification (5 minutes)

- **Functional Requirements**: What should the system do?
- **Non-Functional Requirements**: Scale, performance, reliability
- **Constraints**: Time, budget, technology
- **Assumptions**: User behavior, data volume, growth rate

### 2. Back-of-the-Envelope Estimation (5 minutes)

- Daily Active Users (DAU)
- Requests per second (RPS)
- Storage requirements
- Bandwidth requirements
- Memory requirements

### 3. System Interface Definition (5 minutes)

- Define API endpoints
- Input/output formats
- Authentication/authorization

### 4. High-Level Design (10 minutes)

- Draw block diagram
- Identify major components
- Show data flow
- Discuss trade-offs

### 5. Detailed Design (15 minutes)

- Deep dive into components
- Database schema
- Algorithms and data structures
- Handle bottlenecks

### 6. Identifying Bottlenecks (5 minutes)

- Single points of failure
- Performance bottlenecks
- Scalability issues
- Trade-offs and solutions

### 7. Scaling the Design (5 minutes)

- Caching strategy
- Load balancing
- Database scaling
- Microservices

## Best Practices

### 1. Design Principles

- **KISS** (Keep It Simple, Stupid): Start simple, add complexity only when needed
- **YAGNI** (You Aren't Gonna Need It): Don't over-engineer
- **DRY** (Don't Repeat Yourself): Avoid duplication
- **Loose Coupling**: Minimize dependencies between components
- **High Cohesion**: Keep related functionality together

### 2. Reliability

- **Redundancy**: Eliminate single points of failure
- **Monitoring**: Track metrics and logs
- **Alerting**: Detect and respond to issues quickly
- **Graceful Degradation**: Maintain partial functionality during failures
- **Disaster Recovery**: Have backup and restore procedures

### 3. Security

- **Authentication**: Verify user identity (OAuth, JWT)
- **Authorization**: Control access to resources (RBAC, ABAC)
- **Encryption**: Protect data in transit (TLS) and at rest
- **Input Validation**: Prevent injection attacks
- **Rate Limiting**: Prevent abuse and DDoS

### 4. Performance

- **Caching**: Reduce database load
- **CDN**: Serve static content from edge locations
- **Database Indexing**: Speed up queries
- **Asynchronous Processing**: Use queues for long-running tasks
- **Compression**: Reduce bandwidth usage

### 5. Maintainability

- **Documentation**: Keep design docs updated
- **Code Reviews**: Ensure quality and knowledge sharing
- **Testing**: Unit, integration, and load testing
- **Monitoring**: Track system health and performance
- **Versioning**: Manage API versions carefully

## Common System Design Patterns

### 1. Database Patterns

- **CQRS**: Separate read and write operations
- **Event Sourcing**: Store state changes as events
- **Database per Service**: Each microservice has its own database
- **Saga Pattern**: Manage distributed transactions

### 2. Communication Patterns

- **Request-Response**: Synchronous communication (HTTP, gRPC)
- **Publish-Subscribe**: Asynchronous event-driven (Kafka, RabbitMQ)
- **Remote Procedure Call**: Call remote functions (gRPC)
- **Webhooks**: HTTP callbacks for events

### 3. Resilience Patterns

- **Circuit Breaker**: Prevent cascading failures
- **Retry Pattern**: Retry failed operations
- **Timeout Pattern**: Fail fast on slow operations
- **Bulkhead**: Isolate resources to prevent total failure
- **Rate Limiting**: Control request rate

### 4. Observability Patterns

- **Health Check**: Monitor service health
- **Log Aggregation**: Centralize logs (ELK stack)
- **Distributed Tracing**: Track requests across services (Jaeger)
- **Metrics**: Collect and visualize metrics (Prometheus, Grafana)

## Technologies & Tools

### Databases

**SQL Databases**

- PostgreSQL - Advanced relational database
- MySQL - Popular open-source database
- SQL Server - Microsoft's database

**NoSQL Databases**

- MongoDB - Document database
- Cassandra - Wide-column store
- Redis - In-memory key-value store
- DynamoDB - AWS managed NoSQL
- Elasticsearch - Search and analytics

### Message Queues

- **RabbitMQ**: Traditional message broker
- **Apache Kafka**: Distributed event streaming
- **AWS SQS**: Managed queue service
- **Redis Pub/Sub**: Simple pub/sub messaging
- **NATS**: Cloud-native messaging

### Caching

- **Redis**: In-memory data structure store
- **Memcached**: Distributed memory caching
- **Varnish**: HTTP accelerator
- **CDN**: CloudFlare, CloudFront, Akamai

### Load Balancers

- **NGINX**: Web server and reverse proxy
- **HAProxy**: High-availability load balancer
- **AWS ELB**: Managed load balancing
- **Google Cloud Load Balancing**
- **Traefik**: Cloud-native load balancer

### Monitoring & Observability

- **Prometheus**: Metrics collection and alerting
- **Grafana**: Metrics visualization
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Jaeger**: Distributed tracing
- **New Relic**: Application performance monitoring
- **Datadog**: Cloud monitoring

### Container Orchestration

- **Kubernetes**: Container orchestration platform
- **Docker Swarm**: Docker's native clustering
- **AWS ECS**: Managed container service
- **Nomad**: Workload orchestrator

## Interview Preparation

### Common System Design Questions

1. **Social Networks**

   - Design Twitter
   - Design Instagram
   - Design Facebook News Feed
   - Design LinkedIn

2. **E-Commerce**

   - Design Amazon
   - Design a shopping cart
   - Design an inventory system
   - Design a payment system

3. **Media & Content**

   - Design YouTube
   - Design Netflix
   - Design Spotify
   - Design a CDN

4. **Messaging**

   - Design WhatsApp
   - Design Slack
   - Design a notification system
   - Design an email service

5. **Infrastructure**

   - Design a URL shortener
   - Design a rate limiter
   - Design a web crawler
   - Design a search engine

6. **Transportation**

   - Design Uber
   - Design a parking lot system
   - Design a flight booking system

7. **Collaboration**
   - Design Google Docs
   - Design Dropbox
   - Design a file sharing system

### Interview Tips

#### Preparation Strategy

1. **Study Fundamentals** (Week 1-2)

   - Understand core concepts
   - Learn common patterns
   - Review technologies

2. **Practice Designs** (Week 3-4)

   - Design 2-3 systems per day
   - Draw diagrams
   - Calculate capacity

3. **Mock Interviews** (Week 5-6)
   - Practice with peers
   - Get feedback
   - Time yourself

#### During the Interview

1. **Listen Carefully**: Understand requirements fully
2. **Ask Questions**: Clarify ambiguities
3. **Think Out Loud**: Explain your reasoning
4. **Start High-Level**: Draw big picture first
5. **Be Specific**: Provide concrete numbers and technologies
6. **Consider Trade-offs**: Discuss pros and cons
7. **Scale Gradually**: Start simple, then scale
8. **Handle Feedback**: Be open to suggestions

#### Common Mistakes to Avoid

- ❌ Jumping into details too quickly
- ❌ Not clarifying requirements
- ❌ Ignoring non-functional requirements
- ❌ Over-engineering the solution
- ❌ Not considering trade-offs
- ❌ Forgetting about monitoring and logging
- ❌ Ignoring security considerations
- ❌ Not doing capacity estimation

#### What Interviewers Look For

- ✅ **Problem-solving**: Approach and methodology
- ✅ **Communication**: Clear explanations
- ✅ **Trade-offs**: Understanding pros and cons
- ✅ **Scale**: Handling growth
- ✅ **Reliability**: Building robust systems
- ✅ **Practical Knowledge**: Real-world experience
- ✅ **Adaptability**: Handling feedback

## Capacity Estimation Examples

### Example 1: Twitter-like System

**Assumptions:**

- 200 million daily active users (DAU)
- Each user posts 2 tweets per day on average
- Each user reads 20 tweets per day
- Average tweet size: 140 bytes + metadata = 200 bytes

**Calculations:**

- **Tweets per day**: 200M × 2 = 400M tweets/day
- **Tweets per second**: 400M / 86400 = ~4,600 tweets/second
- **Read requests per second**: 200M × 20 / 86400 = ~46,000 reads/second
- **Storage per day**: 400M × 200 bytes = 80 GB/day
- **Storage per year**: 80 GB × 365 = ~29 TB/year

### Example 2: URL Shortener

**Assumptions:**

- 100 million shortened URLs created per month
- 10:1 read to write ratio
- URLs stored for 10 years
- Average URL size: 100 bytes

**Calculations:**

- **Write requests per second**: 100M / (30 × 86400) = ~38 writes/second
- **Read requests per second**: 38 × 10 = 380 reads/second
- **Storage needed**: 100M × 12 months × 10 years × 100 bytes = ~1.2 TB
- **Cache size** (20% of reads): 100M × 10:1 × 0.2 = 200M URLs = 20 GB

## Quick Reference

### Numbers Every Engineer Should Know

```
L1 cache reference                      0.5 ns
Branch mispredict                       5   ns
L2 cache reference                      7   ns
Mutex lock/unlock                      100  ns
Main memory reference                  100  ns
Compress 1K bytes with Zippy         10,000 ns =  10 µs
Send 2K bytes over 1 Gbps network    20,000 ns =  20 µs
Read 1 MB sequentially from memory  250,000 ns = 250 µs
Round trip within same datacenter   500,000 ns = 500 µs
Disk seek                        10,000,000 ns =  10 ms
Read 1 MB sequentially from disk 30,000,000 ns =  30 ms
Send packet CA->Netherlands->CA 150,000,000 ns = 150 ms
```

### Availability Numbers

| Availability | Downtime per Year | Downtime per Month | Downtime per Week |
| ------------ | ----------------- | ------------------ | ----------------- |
| 99%          | 3.65 days         | 7.2 hours          | 1.68 hours        |
| 99.9%        | 8.76 hours        | 43.8 minutes       | 10.1 minutes      |
| 99.99%       | 52.56 minutes     | 4.38 minutes       | 1.01 minutes      |
| 99.999%      | 5.26 minutes      | 26.3 seconds       | 6.05 seconds      |

### HTTP Status Codes

- **2xx Success**: 200 OK, 201 Created, 204 No Content
- **3xx Redirection**: 301 Moved Permanently, 302 Found, 304 Not Modified
- **4xx Client Error**: 400 Bad Request, 401 Unauthorized, 404 Not Found, 429 Too Many Requests
- **5xx Server Error**: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable

## Resources

Check out the [resources.md](resources.md) file for a comprehensive list of:

- Books
- Courses
- Blogs
- YouTube channels
- Practice platforms
- System design tools

## Interview Preparation Resources

Visit the [Interview Preparation](00-interview-preparation/) folder for:

- Fundamental system design questions
- Scalability and performance questions
- Database design questions
- Distributed systems questions
- Microservices questions
- Real-world system design scenarios

---

## Quick Start Guide

### For Beginners

1. Start with [Fundamentals](01-fundamentals/)
2. Read [Interview Questions](00-interview-preparation/01-basic-questions.md)
3. Practice simple systems (URL shortener, rate limiter)
4. Study [Database Design](02-databases/)

### For Intermediate

1. Study [Distributed Systems](04-distributed-systems/)
2. Learn [Microservices Patterns](03-microservices/)
3. Design medium complexity systems (Twitter, Instagram)
4. Practice with peers

### For Advanced

1. Design complex systems (Netflix, Uber)
2. Study advanced patterns (CQRS, Event Sourcing)
3. Contribute to open-source distributed systems
4. Mentor others

---

**Happy System Designing! 🚀**

Master these concepts, practice regularly, and you'll be well-prepared for any system design interview or real-world architecture challenge!
