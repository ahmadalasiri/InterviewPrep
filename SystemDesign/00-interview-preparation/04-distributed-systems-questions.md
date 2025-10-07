# Distributed Systems Questions

## Core Distributed Systems Concepts

### 1. What is the CAP theorem and how does it apply in practice?

**Answer:**

The CAP theorem states that a distributed system can only guarantee 2 out of 3 properties simultaneously:

**C - Consistency**

- All nodes see the same data at the same time
- Every read receives the most recent write
- Strong consistency guarantee

**A - Availability**

- Every request receives a response (success or failure)
- System remains operational
- No request times out

**P - Partition Tolerance**

- System continues to operate despite network partitions
- Messages can be dropped or delayed between nodes
- Essential for distributed systems

**Why You Can't Have All Three:**

When a network partition occurs, you must choose:

- **CP**: Reject requests to maintain consistency (sacrifice availability)
- **AP**: Serve potentially stale data to remain available (sacrifice consistency)

**Real-World Examples:**

**CP Systems (Consistency + Partition Tolerance)**

```
MongoDB (default), HBase, Redis Cluster
```

**Behavior during partition:**

- Minority partition rejects writes
- Ensures no split-brain
- Some nodes unavailable

**Use Cases:**

- Banking systems
- Inventory management
- Booking systems
- Any system where consistency is critical

**AP Systems (Availability + Partition Tolerance)**

```
Cassandra, DynamoDB, Riak, CouchDB
```

**Behavior during partition:**

- All partitions accept writes
- Eventual consistency
- Conflict resolution needed

**Use Cases:**

- Social media feeds
- Shopping carts
- User profiles
- Analytics and metrics

**CA Systems (Consistency + Availability)**

```
Single-node databases (PostgreSQL, MySQL)
```

**Limitation:**

- Cannot tolerate network partitions
- Not truly distributed
- Single point of failure

**Practical Application:**

```typescript
// CP System Example: Strong consistency required
class BankingSystem {
  async transfer(from: string, to: string, amount: number) {
    // Must be consistent - either succeeds on all nodes or fails
    if (!this.canReachQuorum()) {
      throw new Error("Cannot guarantee consistency - partition detected");
    }

    await this.debit(from, amount);
    await this.credit(to, amount);
    return { success: true };
  }
}

// AP System Example: Availability preferred
class SocialMediaFeed {
  async getLikes(postId: string): Promise<number> {
    // Return any available count, even if slightly stale
    try {
      return await this.cache.get(`likes:${postId}`);
    } catch {
      // If cache down, get from any available replica
      return await this.getFromAnyReplica(postId);
    }
  }
}
```

### 2. Explain consensus algorithms (Raft/Paxos)

**Answer:**

Consensus algorithms allow distributed systems to agree on a single value even with failures.

**Raft Consensus Algorithm:**

**Key Concepts:**

1. **Leader Election**: One node is the leader
2. **Log Replication**: Leader replicates log to followers
3. **Safety**: Only committed entries can be executed

**Roles:**

- **Leader**: Handles all client requests, replicates log
- **Follower**: Passive, responds to leader/candidate
- **Candidate**: Requests votes to become leader

**Leader Election:**

```
1. Follower times out → becomes Candidate
2. Candidate requests votes from other nodes
3. If majority votes → becomes Leader
4. Leader sends heartbeats to prevent new elections
```

**Log Replication:**

```
Client ──► Leader ──► Followers
            │
            └──► Waits for majority ACK
            └──► Commits entry
            └──► Responds to client
```

**Example:**

```go
type RaftNode struct {
    state       NodeState  // Leader, Follower, Candidate
    currentTerm int
    log         []LogEntry
    commitIndex int
}

func (rn *RaftNode) AppendEntries(entry LogEntry) error {
    if rn.state != Leader {
        return rn.forwardToLeader(entry)
    }

    // Leader appends to its log
    rn.log = append(rn.log, entry)

    // Replicate to followers
    acks := rn.replicateToFollowers(entry)

    // Wait for majority
    if acks >= rn.majoritySize() {
        rn.commitIndex++
        return nil
    }

    return errors.New("failed to achieve consensus")
}
```

**Paxos Algorithm:**

More complex but similar goal - achieve consensus.

**Phases:**

1. **Prepare**: Proposer sends prepare request
2. **Promise**: Acceptors promise not to accept older proposals
3. **Accept**: Proposer sends accept request
4. **Accepted**: Acceptors accept the value

**Key Difference from Raft:**

- Paxos: Multiple proposers possible (more complex)
- Raft: Single leader (simpler, easier to understand)

**Use Cases:**

- Distributed databases (CockroachDB uses Raft)
- Configuration management (etcd, Consul)
- Leader election
- Distributed locks

### 3. How do distributed transactions work?

**Answer:**

Distributed transactions ensure ACID properties across multiple databases/services.

**1. Two-Phase Commit (2PC)**

**Phase 1: Prepare**

```
Coordinator: "Prepare to commit transaction X"
Participant 1: "Ready to commit" (locks resources)
Participant 2: "Ready to commit" (locks resources)
Participant 3: "Ready to commit" (locks resources)
```

**Phase 2: Commit**

```
Coordinator: "Commit transaction X"
Participant 1: "Committed"
Participant 2: "Committed"
Participant 3: "Committed"
```

**Implementation:**

```go
type TwoPhaseCommit struct {
    coordinator *Coordinator
    participants []Participant
}

func (tpc *TwoPhaseCommit) Execute(transaction Transaction) error {
    // Phase 1: Prepare
    for _, participant := range tpc.participants {
        if err := participant.Prepare(transaction); err != nil {
            tpc.Abort(transaction)
            return err
        }
    }

    // Phase 2: Commit
    for _, participant := range tpc.participants {
        if err := participant.Commit(transaction); err != nil {
            // Problematic: Can't roll back after some committed
            log.Error("Partial commit failure!")
        }
    }

    return nil
}
```

**Problems with 2PC:**

- **Blocking**: If coordinator fails, participants stuck
- **Performance**: Multiple round trips
- **Single point of failure**: Coordinator

**2. Three-Phase Commit (3PC)**

Adds pre-commit phase to avoid blocking:

```
Phase 1: Prepare
Phase 2: Pre-commit (can still abort)
Phase 3: Commit
```

Still has issues with network partitions.

**3. Saga Pattern (Recommended for Microservices)**

Break transaction into local transactions with compensating actions:

```typescript
class OrderSaga {
  async createOrder(order: Order) {
    const steps = [
      {
        action: () => this.inventoryService.reserve(order.items),
        compensate: () => this.inventoryService.release(order.items),
      },
      {
        action: () => this.paymentService.charge(order.payment),
        compensate: () => this.paymentService.refund(order.payment),
      },
      {
        action: () => this.shippingService.createShipment(order),
        compensate: () => this.shippingService.cancelShipment(order),
      },
    ];

    const completed = [];

    try {
      for (const step of steps) {
        await step.action();
        completed.push(step);
      }
      return { success: true };
    } catch (error) {
      // Compensate in reverse order
      for (const step of completed.reverse()) {
        await step.compensate();
      }
      return { success: false, error };
    }
  }
}
```

**Saga Types:**

**Choreography**: Services emit events

```
Order Service → OrderCreated event
  → Inventory Service (reserves)
    → InventoryReserved event
      → Payment Service (charges)
```

**Orchestration**: Central coordinator

```
Saga Orchestrator
├─► Inventory Service
├─► Payment Service
└─► Shipping Service
```

**4. Event Sourcing**

Store all state changes as immutable events:

```typescript
interface Event {
  type: string;
  timestamp: Date;
  data: any;
}

class AccountEventStore {
  private events: Event[] = [];

  addEvent(event: Event) {
    this.events.push(event);
  }

  getCurrentState(): Account {
    return this.events.reduce((state, event) => {
      switch (event.type) {
        case "ACCOUNT_CREATED":
          return { ...state, balance: 0 };
        case "MONEY_DEPOSITED":
          return { ...state, balance: state.balance + event.data.amount };
        case "MONEY_WITHDRAWN":
          return { ...state, balance: state.balance - event.data.amount };
        default:
          return state;
      }
    }, {} as Account);
  }
}
```

### 4. How do you implement distributed caching?

**Answer:**

**Distributed Cache Architecture:**

```
Application Servers        Cache Cluster
    Server 1 ──┬──► Redis Master 1 ─► Replica
    Server 2 ──┤        ├─ Partition 1: keys 0-5460
    Server 3 ──┘        ├─ Partition 2: keys 5461-10922
                       └─ Partition 3: keys 10923-16383
```

**Cache Strategies:**

**1. Cache-Aside (Lazy Loading)**

```go
func GetUser(id string) (*User, error) {
    // Try cache first
    if cached, err := cache.Get("user:" + id); err == nil {
        return parseUser(cached), nil
    }

    // Cache miss - fetch from DB
    user, err := db.GetUser(id)
    if err != nil {
        return nil, err
    }

    // Update cache
    cache.Set("user:"+id, user, 1*time.Hour)

    return user, nil
}
```

**2. Write-Through**

```go
func UpdateUser(user *User) error {
    // Write to cache
    if err := cache.Set("user:"+user.ID, user, 1*time.Hour); err != nil {
        return err
    }

    // Write to DB
    return db.UpdateUser(user)
}
```

**3. Write-Behind (Write-Back)**

```go
func UpdateUser(user *User) error {
    // Write to cache immediately
    cache.Set("user:"+user.ID, user, 1*time.Hour)

    // Queue for async DB write
    queue.Push(WriteJob{
        Type: "UPDATE_USER",
        Data: user,
    })

    return nil
}
```

**Cache Consistency Patterns:**

**1. Time-To-Live (TTL)**

```go
cache.Set("user:123", user, 5*time.Minute)
```

**2. Event-Based Invalidation**

```go
func onUserUpdated(userID string) {
    cache.Delete("user:" + userID)
    // Also invalidate related caches
    cache.Delete("user_posts:" + userID)
    cache.Delete("user_friends:" + userID)
}
```

**3. Version-Based Invalidation**

```go
version := atomic.AddInt64(&globalVersion, 1)
cache.Set("user:123:v"+version, user, 1*time.Hour)
```

**Cache Stampede Prevention:**

Problem: Cache expires, many requests hit DB simultaneously

**Solution 1: Lock**

```go
func GetUser(id string) (*User, error) {
    key := "user:" + id

    if cached, _ := cache.Get(key); cached != nil {
        return cached, nil
    }

    // Acquire lock
    lock := distributedLock.Acquire(key + ":lock")
    defer lock.Release()

    // Check cache again (might have been populated)
    if cached, _ := cache.Get(key); cached != nil {
        return cached, nil
    }

    // Fetch from DB
    user, _ := db.GetUser(id)
    cache.Set(key, user, 1*time.Hour)

    return user, nil
}
```

**Solution 2: Probabilistic Early Expiration**

```go
ttl := 3600 // 1 hour
earlyExpiry := ttl * 0.9 + rand.Float64() * ttl * 0.1
cache.Set(key, value, earlyExpiry)
```

**Consistent Hashing for Cache Distribution:**

```go
type ConsistentHash struct {
    circle map[uint32]string
    nodes  []string
}

func (ch *ConsistentHash) GetNode(key string) string {
    hash := ch.hash(key)

    // Find first node >= hash
    for _, h := range ch.sortedHashes {
        if h >= hash {
            return ch.circle[h]
        }
    }

    // Wrap around
    return ch.circle[ch.sortedHashes[0]]
}

func (ch *ConsistentHash) AddNode(node string) {
    // Add virtual nodes for better distribution
    for i := 0; i < 100; i++ {
        virtualKey := fmt.Sprintf("%s:%d", node, i)
        hash := ch.hash(virtualKey)
        ch.circle[hash] = node
    }
}
```

### 5. How do you handle distributed system failures?

**Answer:**

**Failure Types:**

1. **Node Failures**: Server crashes
2. **Network Partitions**: Network splits
3. **Byzantine Failures**: Malicious/corrupted nodes
4. **Slow Nodes**: Degraded performance

**Strategies:**

**1. Replication**

```
Primary ──► Replica 1
       ──► Replica 2
       ──► Replica 3
```

**Pros:**

- High availability
- Read scaling
- Fault tolerance

**Cons:**

- Consistency challenges
- Increased cost
- Replication lag

**2. Health Checks**

```go
type HealthChecker struct {
    nodes []Node
}

func (hc *HealthChecker) CheckHealth() {
    for _, node := range hc.nodes {
        go func(n Node) {
            if err := n.Ping(); err != nil {
                hc.MarkUnhealthy(n)
                hc.RemoveFromPool(n)
            }
        }(node)
    }
}

func (hc *HealthChecker) PeriodicallyCheck() {
    ticker := time.NewTicker(5 * time.Second)
    for range ticker.C {
        hc.CheckHealth()
    }
}
```

**3. Circuit Breaker**

```go
type CircuitBreaker struct {
    state         State  // Closed, Open, HalfOpen
    failures      int
    threshold     int
    timeout       time.Duration
    lastFailTime  time.Time
}

func (cb *CircuitBreaker) Call(fn func() error) error {
    if cb.state == Open {
        if time.Since(cb.lastFailTime) > cb.timeout {
            cb.state = HalfOpen
        } else {
            return errors.New("circuit breaker is open")
        }
    }

    err := fn()

    if err != nil {
        cb.failures++
        cb.lastFailTime = time.Now()

        if cb.failures >= cb.threshold {
            cb.state = Open
        }
        return err
    }

    cb.failures = 0
    cb.state = Closed
    return nil
}
```

**4. Retry with Exponential Backoff**

```go
func RetryWithBackoff(fn func() error, maxRetries int) error {
    var err error

    for attempt := 0; attempt < maxRetries; attempt++ {
        err = fn()
        if err == nil {
            return nil
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        backoff := time.Duration(math.Pow(2, float64(attempt))) * time.Second

        // Add jitter to prevent thundering herd
        jitter := time.Duration(rand.Int63n(1000)) * time.Millisecond

        time.Sleep(backoff + jitter)
    }

    return err
}
```

**5. Bulkhead Pattern**

Isolate resources to prevent cascade failures:

```go
type Bulkhead struct {
    semaphore chan struct{}
}

func NewBulkhead(maxConcurrent int) *Bulkhead {
    return &Bulkhead{
        semaphore: make(chan struct{}, maxConcurrent),
    }
}

func (b *Bulkhead) Execute(fn func() error) error {
    select {
    case b.semaphore <- struct{}{}:
        defer func() { <-b.semaphore }()
        return fn()
    default:
        return errors.New("bulkhead full - too many concurrent requests")
    }
}
```

**6. Graceful Degradation**

```go
func GetUserRecommendations(userID string) ([]Product, error) {
    // Try ML-based recommendations
    recommendations, err := mlService.GetRecommendations(userID)
    if err == nil {
        return recommendations, nil
    }

    // Fallback to popular items
    popular, err := cache.GetPopularItems()
    if err == nil {
        return popular, nil
    }

    // Last resort: empty list
    return []Product{}, nil
}
```

**7. Idempotency**

Ensure operations can be safely retried:

```go
func ProcessPayment(paymentID string, amount float64) error {
    // Check if already processed
    if exists, _ := db.PaymentExists(paymentID); exists {
        return nil // Already processed, safe to return success
    }

    // Process payment
    if err := paymentGateway.Charge(amount); err != nil {
        return err
    }

    // Store payment record
    db.SavePayment(paymentID, amount)

    return nil
}
```

### 6. Explain distributed locks

**Answer:**

Distributed locks coordinate access to shared resources across multiple nodes.

**Use Cases:**

- Ensure only one node processes a task
- Prevent duplicate cron jobs
- Coordinate resource access
- Leader election

**Implementation with Redis:**

```go
func AcquireLock(key string, ttl time.Duration) (bool, error) {
    // SET key value NX PX milliseconds
    // NX: Only set if doesn't exist
    // PX: Set expiry in milliseconds

    result, err := redis.SetNX(
        context.Background(),
        "lock:"+key,
        "locked",
        ttl,
    ).Result()

    return result, err
}

func ReleaseLock(key string) error {
    return redis.Del(context.Background(), "lock:"+key).Err()
}

// Usage
func ProcessTask(taskID string) {
    acquired, _ := AcquireLock(taskID, 10*time.Second)
    if !acquired {
        return // Another node is processing this task
    }
    defer ReleaseLock(taskID)

    // Process task
    doWork(taskID)
}
```

**Redlock Algorithm (Multiple Redis Instances):**

```go
type Redlock struct {
    instances []*redis.Client
}

func (r *Redlock) Acquire(key string, ttl time.Duration) bool {
    startTime := time.Now()
    successCount := 0

    // Try to acquire lock on all instances
    for _, instance := range r.instances {
        acquired := instance.SetNX(key, "locked", ttl)
        if acquired {
            successCount++
        }
    }

    // Need majority to succeed
    majority := len(r.instances)/2 + 1
    elapsed := time.Since(startTime)

    if successCount >= majority && elapsed < ttl {
        return true
    }

    // Failed - release all locks
    r.Release(key)
    return false
}
```

**Issues with Distributed Locks:**

**1. Lock Timeout Problem:**

```
Node A acquires lock with 5s TTL
Node A takes 10s to process (slow)
Lock expires at 5s
Node B acquires same lock
Both nodes processing simultaneously!
```

**Solution: Fencing Tokens**

```go
var tokenCounter int64

func AcquireLock(key string) (int64, bool) {
    token := atomic.AddInt64(&tokenCounter, 1)
    acquired := redis.Set(key, token, 10*time.Second)
    return token, acquired
}

func UpdateResource(resourceID string, token int64, data string) error {
    currentToken := db.GetCurrentToken(resourceID)
    if token <= currentToken {
        return errors.New("stale token - lock was lost")
    }

    return db.Update(resourceID, token, data)
}
```

**2. Deadlock Prevention:**

```go
// Always acquire locks in same order
locks := []string{"userLock", "accountLock", "orderLock"}
sort.Strings(locks) // Consistent ordering

for _, lock := range locks {
    AcquireLock(lock)
}
```

---

## Distributed System Patterns

### Message Queue Patterns

**1. Competing Consumers**

```
Producer ──► Queue ──┬──► Consumer 1
                     ├──► Consumer 2
                     └──► Consumer 3
```

**2. Publish-Subscribe**

```
Publisher ──► Topic ──┬──► Subscriber 1
                      ├──► Subscriber 2
                      └──► Subscriber 3
```

**3. Request-Reply**

```
Client ──► Request Queue ──► Server
      ◄── Reply Queue ──────┘
```

### Data Replication Patterns

**1. Leader-Follower**

- One leader handles writes
- Followers replicate from leader
- Followers handle reads

**2. Multi-Leader**

- Multiple leaders accept writes
- Conflict resolution needed
- Complex but more available

**3. Leaderless**

- All nodes are equal
- Quorum-based reads/writes
- Example: Cassandra, DynamoDB

---

## Quick Reference

### Consistency Levels

| Level            | Description                | Latency | Use Case              |
| ---------------- | -------------------------- | ------- | --------------------- |
| Strong           | All nodes see same data    | High    | Banking, inventory    |
| Eventual         | Nodes converge over time   | Low     | Social media, caching |
| Causal           | Related operations ordered | Medium  | Commenting systems    |
| Read-your-writes | See own writes immediately | Medium  | User profiles         |

### Failure Detection

```go
// Heartbeat-based
for {
    sendHeartbeat()
    time.Sleep(1 * time.Second)
}

// Timeout-based
if time.Since(lastHeartbeat) > threshold {
    markAsFailed()
}

// Gossip protocol
for _, peer := range peers {
    shareHealthInfo(peer)
}
```

---

**Master these distributed system concepts to build resilient, scalable systems!**
