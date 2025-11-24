# System Design Interview Preparation Guide

This folder contains comprehensive system design interview questions organized by topic and difficulty. Use this resource to prepare for system design interviews at all levels (Junior, Mid, Senior, Staff, Principal).

## 📋 Table of Contents

### 1. [Basic System Design Questions](01-basic-questions.md)

- Fundamental concepts
- Core components
- Basic scalability patterns
- Common architectures

### 2. [Scaling & Performance Questions](02-scaling-questions.md)

- Horizontal and vertical scaling
- Load balancing strategies
- Caching patterns
- Performance optimization

### 3. [Database Design Questions](03-database-questions.md)

- SQL vs NoSQL trade-offs
- Sharding and partitioning
- Replication strategies
- Consistency models

### 4. [Distributed Systems Questions](04-distributed-systems-questions.md)

- CAP theorem
- Consensus algorithms
- Distributed transactions
- Event-driven architectures

### 5. [Microservices Questions](05-microservices-questions.md)

- Service decomposition
- Inter-service communication
- Fault tolerance
- Service discovery

### 6. [Real-World System Design Questions](06-practical-questions.md)

- Social media platforms
- E-commerce systems
- Messaging systems
- Video streaming platforms
- Search engines

### 7. [API Protocols & Communication Questions](07-api-protocols-questions.md)

- REST API principles
- gRPC and Protocol Buffers
- GraphQL queries, mutations, subscriptions
- RPC (Remote Procedure Call)
- WebSocket communication
- Message queue protocols

### 8. [API Gateway Questions](08-api-gateway-questions.md)

- API Gateway fundamentals
- Tyk API Gateway
- Kong API Gateway
- AWS API Gateway
- Security and authentication
- Performance optimization
- Monitoring and observability

### 9. [Service Mesh Questions](09-service-mesh-questions.md)

- Service Mesh fundamentals
- Istio implementation
- Linkerd implementation
- Traffic management
- Security (mTLS, authorization)
- Observability (metrics, tracing, logging)
- Common patterns (canary, blue-green, A/B testing)

## 🎯 Interview Preparation Strategy

### Phase 1: Foundation (Week 1-2)

**Study Topics:**

- Core system design components
- Load balancing and caching
- Database fundamentals
- API design

**Practice:**

- Design simple systems (URL shortener, pastebin)
- Draw architecture diagrams
- Calculate capacity requirements

### Phase 2: Intermediate (Week 3-4)

**Study Topics:**

- Database scaling (sharding, replication)
- Caching strategies
- Message queues
- Microservices basics

**Practice:**

- Design medium complexity systems (Twitter feed, Instagram)
- Practice back-of-the-envelope calculations
- Discuss trade-offs

### Phase 3: Advanced (Week 5-6)

**Study Topics:**

- Distributed systems concepts
- Consensus algorithms
- Event sourcing and CQRS
- Advanced caching patterns

**Practice:**

- Design complex systems (Netflix, Uber)
- Practice with time constraints (45-60 min)
- Mock interviews with peers

### Phase 4: Mastery (Week 7-8)

**Study Topics:**

- System optimization
- Advanced distributed patterns
- Multi-region deployments
- Disaster recovery

**Practice:**

- Design systems end-to-end
- Handle follow-up questions
- Discuss trade-offs deeply
- Real interview practice

## 🔧 Interview Process

### Typical 45-Minute Interview Breakdown

**1. Requirements Clarification (5 min)**

- Functional requirements
- Non-functional requirements (scale, performance)
- Constraints and assumptions

**2. Capacity Estimation (5 min)**

- Traffic estimates (DAU, QPS)
- Storage requirements
- Bandwidth needs
- Memory requirements

**3. High-Level Design (10 min)**

- Draw major components
- Show data flow
- Identify APIs
- Discuss trade-offs

**4. Deep Dive (15 min)**

- Database schema
- Key algorithms
- Bottleneck identification
- Scaling strategies

**5. Discussion & Questions (10 min)**

- Trade-offs discussion
- Alternative approaches
- Failure scenarios
- Monitoring and operations

## 📚 Core Topics to Master

### Essential Components

- [ ] Load Balancers (L4 vs L7)
- [ ] CDN and Edge Computing
- [ ] Caching (Redis, Memcached)
- [ ] Message Queues (Kafka, RabbitMQ)
- [ ] Databases (SQL, NoSQL)
- [ ] Object Storage (S3)
- [ ] Search Engines (Elasticsearch)
- [ ] API Gateways

### Scalability Patterns

- [ ] Horizontal scaling
- [ ] Vertical scaling
- [ ] Database sharding
- [ ] Database replication
- [ ] Caching strategies
- [ ] Load balancing algorithms
- [ ] Rate limiting
- [ ] Circuit breakers

### Database Concepts

- [ ] SQL vs NoSQL trade-offs
- [ ] ACID properties
- [ ] CAP theorem
- [ ] Database indexes
- [ ] Normalization vs denormalization
- [ ] Partitioning strategies
- [ ] Replication patterns
- [ ] Consistency models

### Distributed Systems

- [ ] Distributed transactions
- [ ] Eventual consistency
- [ ] Consensus algorithms (Raft, Paxos)
- [ ] Distributed locks
- [ ] Clock synchronization
- [ ] Leader election
- [ ] Gossip protocol
- [ ] Vector clocks

### Microservices

- [ ] Service decomposition
- [ ] API design and versioning
- [ ] Service discovery
- [ ] Circuit breaker pattern
- [ ] Saga pattern
- [ ] Event sourcing
- [ ] CQRS pattern
- [ ] Service mesh

## 🚀 Quick Reference

### Common System Design Patterns

**1. Load Balancing**

- Round Robin
- Least Connections
- IP Hash
- Weighted Round Robin
- Geographic routing

**2. Caching Strategies**

- Cache-Aside
- Write-Through
- Write-Behind
- Read-Through
- Refresh-Ahead

**3. Cache Eviction Policies**

- LRU (Least Recently Used)
- LFU (Least Frequently Used)
- FIFO (First In First Out)
- TTL (Time To Live)

**4. Database Patterns**

- Master-Slave replication
- Master-Master replication
- Sharding (range, hash, geographic)
- Federation
- Denormalization

**5. Communication Patterns**

- Request-Response (REST, gRPC)
- Publish-Subscribe (Kafka, RabbitMQ)
- Event Streaming
- Webhooks

**6. Resilience Patterns**

- Circuit Breaker
- Retry with Backoff
- Timeout
- Bulkhead
- Rate Limiting

### Numbers Every Engineer Should Know

```
Operation                               Time
─────────────────────────────────────────────
L1 cache reference                      0.5 ns
L2 cache reference                      7 ns
Main memory reference                   100 ns
Read 1 MB sequentially from memory      250 µs
Disk seek                               10 ms
Read 1 MB sequentially from disk        30 ms
Round trip within datacenter            500 µs
Round trip CA to Netherlands            150 ms
```

### Capacity Estimation Tips

**1. Round Numbers**

- Use powers of 2 and 10
- 1 million ≈ 10^6
- 1 billion ≈ 10^9
- 1 day ≈ 100,000 seconds

**2. Common Metrics**

- QPS = Queries Per Second
- DAU = Daily Active Users
- MAU = Monthly Active Users
- RPS = Requests Per Second

**3. Storage Estimates**

- 1 character = 1 byte
- 1 KB = 1,000 bytes
- 1 MB = 1,000 KB
- 1 GB = 1,000 MB
- 1 TB = 1,000 GB

**4. Bandwidth**

- 1 Gbps = ~125 MB/s
- 1 MB/s = ~8 Mbps

## 💡 Interview Tips

### Do's ✅

1. **Ask Clarifying Questions**

   - Understand requirements thoroughly
   - Clarify ambiguities
   - Ask about scale and constraints

2. **Think Out Loud**

   - Explain your reasoning
   - Discuss trade-offs
   - Show problem-solving process

3. **Start High-Level**

   - Draw big picture first
   - Then dive into details
   - Iterate and refine

4. **Consider Trade-offs**

   - Discuss pros and cons
   - Explain why you chose a solution
   - Mention alternative approaches

5. **Scale Gradually**

   - Start simple
   - Add complexity as needed
   - Show how to handle growth

6. **Be Specific**

   - Use concrete numbers
   - Mention actual technologies
   - Provide examples

7. **Handle Feedback**
   - Listen to hints
   - Adapt your design
   - Show flexibility

### Don'ts ❌

1. **Don't Jump to Details**

   - Avoid premature optimization
   - Don't start coding immediately
   - First get the high-level right

2. **Don't Ignore Requirements**

   - Consider all functional requirements
   - Address non-functional requirements
   - Think about constraints

3. **Don't Forget Scale**

   - Always consider scalability
   - Plan for growth
   - Handle increased load

4. **Don't Ignore Monitoring**

   - Include logging and metrics
   - Plan for debugging
   - Consider operations

5. **Don't Over-Engineer**

   - Keep it simple initially
   - Add complexity only when needed
   - Justify every addition

6. **Don't Forget Security**
   - Consider authentication/authorization
   - Think about data protection
   - Plan for common attacks

### What Interviewers Look For

#### Communication Skills

- Clear explanations
- Structured thinking
- Ability to articulate trade-offs

#### Problem-Solving

- Breaking down complex problems
- Systematic approach
- Handling ambiguity

#### Technical Knowledge

- Understanding of core concepts
- Knowledge of technologies
- Awareness of trade-offs

#### Practical Experience

- Real-world understanding
- Operational considerations
- Best practices awareness

#### Scalability Mindset

- Thinking about growth
- Planning for scale
- Understanding bottlenecks

## 🎓 Common Interview Questions by Company

### FAANG-Level Companies

**Meta (Facebook)**

- Design Facebook News Feed
- Design Facebook Messenger
- Design Instagram
- Design WhatsApp

**Amazon**

- Design Amazon's recommendation system
- Design Amazon's inventory system
- Design a distributed cache
- Design an e-commerce platform

**Apple**

- Design iCloud
- Design FaceTime
- Design Apple Music
- Design iMessage

**Netflix**

- Design video streaming service
- Design content recommendation
- Design video upload system
- Design Netflix's CDN

**Google**

- Design YouTube
- Design Google Maps
- Design Google Drive
- Design Gmail

### Tech Unicorns

**Uber/Lyft**

- Design ride-sharing system
- Design real-time location tracking
- Design surge pricing
- Design driver matching

**Airbnb**

- Design booking system
- Design search and discovery
- Design payment system
- Design review system

**Twitter**

- Design Twitter feed
- Design trending topics
- Design direct messaging
- Design tweet search

**Spotify**

- Design music streaming
- Design playlist management
- Design music recommendations
- Design podcast platform

### Common Baseline Questions

These are asked across most companies:

1. **URL Shortener** - Tests basic system design skills
2. **Rate Limiter** - Tests understanding of scalability
3. **Key-Value Store** - Tests distributed systems knowledge
4. **Web Crawler** - Tests understanding of distributed processing
5. **Notification System** - Tests event-driven architecture
6. **Chat System** - Tests real-time systems
7. **Search Autocomplete** - Tests caching and trie structures
8. **Parking Lot** - Tests OOP and system modeling

## 📖 Study Resources

### Books

- **"Designing Data-Intensive Applications"** by Martin Kleppmann
- **"System Design Interview"** by Alex Xu (Volumes 1 & 2)
- **"Building Microservices"** by Sam Newman
- **"Database Internals"** by Alex Petrov

### Online Courses

- Grokking the System Design Interview (Educative)
- System Design Fundamentals (Coursera)
- Scalability & System Design (Udemy)

### Websites & Blogs

- High Scalability Blog
- Martin Fowler's Blog
- AWS Architecture Blog
- Netflix Tech Blog
- Uber Engineering Blog

### YouTube Channels

- Gaurav Sen
- Tech Dummies Narendra L
- System Design Interview
- ByteByteGo

### Practice Platforms

- LeetCode System Design
- Pramp
- interviewing.io
- ExponentHQ

## 🎯 Study Plan Template

### Week-by-Week Breakdown

**Week 1: Fundamentals**

- Days 1-2: Load balancing, caching
- Days 3-4: Database basics, SQL vs NoSQL
- Days 5-6: API design, REST vs gRPC
- Day 7: Practice - Design URL shortener

**Week 2: Intermediate Concepts**

- Days 1-2: Database sharding, replication
- Days 3-4: Message queues, pub/sub
- Days 5-6: Caching strategies, CDN
- Day 7: Practice - Design Twitter

**Week 3: Advanced Topics**

- Days 1-2: Distributed systems, CAP theorem
- Days 3-4: Microservices, service mesh
- Days 5-6: Event sourcing, CQRS
- Day 7: Practice - Design Netflix

**Week 4: Real-World Practice**

- Days 1-2: Design Instagram, WhatsApp
- Days 3-4: Design Uber, Airbnb
- Days 5-6: Design YouTube, Spotify
- Day 7: Mock interviews

## 🏆 Success Metrics

Track your progress:

- [ ] Can explain system design fundamentals clearly
- [ ] Can perform back-of-the-envelope calculations quickly
- [ ] Can draw architecture diagrams effectively
- [ ] Can identify bottlenecks and scalability issues
- [ ] Can discuss trade-offs confidently
- [ ] Can design 10+ common systems
- [ ] Can complete design in 45 minutes
- [ ] Comfortable with follow-up questions

## 💪 Final Tips

1. **Practice Regularly**: Design 1-2 systems daily
2. **Time Yourself**: Stick to 45-60 minute limit
3. **Draw Diagrams**: Practice on whiteboard/paper
4. **Explain Aloud**: Practice articulating your thoughts
5. **Study Real Systems**: Read engineering blogs
6. **Mock Interviews**: Practice with peers
7. **Review Designs**: Analyze your past designs
8. **Stay Current**: Follow tech trends and new patterns

---

**Good luck with your system design interviews! 🍀**

Remember: System design interviews are about demonstrating your ability to think through complex problems, make informed trade-offs, and communicate effectively. Practice is key!
