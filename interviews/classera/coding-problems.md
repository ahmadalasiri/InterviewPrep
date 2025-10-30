# Coding Problems - Go Developer Interview

## Common Golang Coding Problems

### 1. Implement a Thread-Safe Cache with Expiration

```go
package main

import (
    "sync"
    "time"
)

type CacheItem struct {
    Value      interface{}
    Expiration int64
}

type Cache struct {
    items map[string]CacheItem
    mu    sync.RWMutex
}

func NewCache() *Cache {
    cache := &Cache{
        items: make(map[string]CacheItem),
    }

    // Start cleanup goroutine
    go cache.cleanup()

    return cache
}

func (c *Cache) Set(key string, value interface{}, duration time.Duration) {
    c.mu.Lock()
    defer c.mu.Unlock()

    expiration := time.Now().Add(duration).UnixNano()
    c.items[key] = CacheItem{
        Value:      value,
        Expiration: expiration,
    }
}

func (c *Cache) Get(key string) (interface{}, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()

    item, found := c.items[key]
    if !found {
        return nil, false
    }

    // Check expiration
    if time.Now().UnixNano() > item.Expiration {
        return nil, false
    }

    return item.Value, true
}

func (c *Cache) Delete(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    delete(c.items, key)
}

func (c *Cache) cleanup() {
    ticker := time.NewTicker(5 * time.Minute)
    defer ticker.Stop()

    for range ticker.C {
        c.mu.Lock()
        now := time.Now().UnixNano()
        for key, item := range c.items {
            if now > item.Expiration {
                delete(c.items, key)
            }
        }
        c.mu.Unlock()
    }
}
```

**Interview Discussion Points:**

- Why use RWMutex instead of Mutex?
- How to prevent goroutine leaks in cleanup?
- How to make it more memory efficient?
- Time complexity of operations?

---

### 2. Implement a Rate Limiter (Token Bucket)

```go
package main

import (
    "sync"
    "time"
)

type TokenBucket struct {
    capacity   int
    tokens     int
    refillRate int // tokens per second
    lastRefill time.Time
    mu         sync.Mutex
}

func NewTokenBucket(capacity, refillRate int) *TokenBucket {
    return &TokenBucket{
        capacity:   capacity,
        tokens:     capacity,
        refillRate: refillRate,
        lastRefill: time.Now(),
    }
}

func (tb *TokenBucket) Allow() bool {
    tb.mu.Lock()
    defer tb.mu.Unlock()

    // Refill tokens based on time passed
    tb.refill()

    if tb.tokens > 0 {
        tb.tokens--
        return true
    }

    return false
}

func (tb *TokenBucket) refill() {
    now := time.Now()
    elapsed := now.Sub(tb.lastRefill)

    tokensToAdd := int(elapsed.Seconds()) * tb.refillRate
    if tokensToAdd > 0 {
        tb.tokens = min(tb.capacity, tb.tokens+tokensToAdd)
        tb.lastRefill = now
    }
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}

// Usage
func main() {
    limiter := NewTokenBucket(10, 2) // 10 capacity, 2 tokens/sec

    for i := 0; i < 15; i++ {
        if limiter.Allow() {
            println("Request", i, "allowed")
        } else {
            println("Request", i, "rate limited")
        }
        time.Sleep(100 * time.Millisecond)
    }
}
```

**Variants to Discuss:**

- Sliding window algorithm
- Distributed rate limiting with Redis
- Per-user vs global rate limits

---

### 3. Implement a Connection Pool

```go
package main

import (
    "errors"
    "sync"
)

type Connection struct {
    ID string
}

func (c *Connection) Close() error {
    // Close connection
    return nil
}

type Pool struct {
    connections chan *Connection
    factory     func() (*Connection, error)
    mu          sync.Mutex
    size        int
    maxSize     int
}

func NewPool(maxSize int, factory func() (*Connection, error)) *Pool {
    return &Pool{
        connections: make(chan *Connection, maxSize),
        factory:     factory,
        maxSize:     maxSize,
    }
}

func (p *Pool) Get() (*Connection, error) {
    select {
    case conn := <-p.connections:
        // Return existing connection
        return conn, nil
    default:
        // Create new connection if pool not at max
        p.mu.Lock()
        defer p.mu.Unlock()

        if p.size < p.maxSize {
            conn, err := p.factory()
            if err != nil {
                return nil, err
            }
            p.size++
            return conn, nil
        }

        // Wait for available connection
        return <-p.connections, nil
    }
}

func (p *Pool) Put(conn *Connection) error {
    if conn == nil {
        return errors.New("connection is nil")
    }

    select {
    case p.connections <- conn:
        return nil
    default:
        // Pool is full, close connection
        p.mu.Lock()
        p.size--
        p.mu.Unlock()
        return conn.Close()
    }
}

func (p *Pool) Close() {
    close(p.connections)
    for conn := range p.connections {
        conn.Close()
    }
}
```

**Discussion Points:**

- How to handle connection health checks?
- Connection timeout strategies
- How to implement connection reuse priority?

---

### 4. Merge K Sorted Arrays

```go
package main

import "container/heap"

type Item struct {
    value    int
    arrayIdx int
    elemIdx  int
}

type MinHeap []Item

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i].value < h[j].value }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x interface{}) {
    *h = append(*h, x.(Item))
}

func (h *MinHeap) Pop() interface{} {
    old := *h
    n := len(old)
    item := old[n-1]
    *h = old[0 : n-1]
    return item
}

func mergeKSortedArrays(arrays [][]int) []int {
    if len(arrays) == 0 {
        return []int{}
    }

    h := &MinHeap{}
    heap.Init(h)

    // Initialize heap with first element from each array
    for i, arr := range arrays {
        if len(arr) > 0 {
            heap.Push(h, Item{
                value:    arr[0],
                arrayIdx: i,
                elemIdx:  0,
            })
        }
    }

    result := []int{}

    for h.Len() > 0 {
        item := heap.Pop(h).(Item)
        result = append(result, item.value)

        // Add next element from the same array
        nextIdx := item.elemIdx + 1
        if nextIdx < len(arrays[item.arrayIdx]) {
            heap.Push(h, Item{
                value:    arrays[item.arrayIdx][nextIdx],
                arrayIdx: item.arrayIdx,
                elemIdx:  nextIdx,
            })
        }
    }

    return result
}

// Example
func main() {
    arrays := [][]int{
        {1, 4, 7},
        {2, 5, 8},
        {3, 6, 9},
    }

    result := mergeKSortedArrays(arrays)
    println(result) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
}
```

**Time Complexity:** O(N log K) where N is total elements, K is number of arrays
**Space Complexity:** O(K) for heap

---

### 5. Find Top K Frequent Elements

```go
package main

import (
    "container/heap"
)

type FreqItem struct {
    num   int
    count int
}

type MaxHeap []FreqItem

func (h MaxHeap) Len() int           { return len(h) }
func (h MaxHeap) Less(i, j int) bool { return h[i].count > h[j].count }
func (h MaxHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MaxHeap) Push(x interface{}) {
    *h = append(*h, x.(FreqItem))
}

func (h *MaxHeap) Pop() interface{} {
    old := *h
    n := len(old)
    item := old[n-1]
    *h = old[0 : n-1]
    return item
}

func topKFrequent(nums []int, k int) []int {
    // Count frequencies
    freqMap := make(map[int]int)
    for _, num := range nums {
        freqMap[num]++
    }

    // Build heap
    h := &MaxHeap{}
    heap.Init(h)

    for num, count := range freqMap {
        heap.Push(h, FreqItem{num: num, count: count})
    }

    // Extract top K
    result := make([]int, k)
    for i := 0; i < k; i++ {
        item := heap.Pop(h).(FreqItem)
        result[i] = item.num
    }

    return result
}
```

**Alternative:** Bucket sort approach for O(n) time complexity

---

### 6. LRU Cache

```go
package main

type Node struct {
    key   int
    value int
    prev  *Node
    next  *Node
}

type LRUCache struct {
    capacity int
    cache    map[int]*Node
    head     *Node
    tail     *Node
}

func Constructor(capacity int) LRUCache {
    lru := LRUCache{
        capacity: capacity,
        cache:    make(map[int]*Node),
        head:     &Node{},
        tail:     &Node{},
    }
    lru.head.next = lru.tail
    lru.tail.prev = lru.head
    return lru
}

func (lru *LRUCache) Get(key int) int {
    if node, ok := lru.cache[key]; ok {
        lru.moveToHead(node)
        return node.value
    }
    return -1
}

func (lru *LRUCache) Put(key int, value int) {
    if node, ok := lru.cache[key]; ok {
        node.value = value
        lru.moveToHead(node)
        return
    }

    node := &Node{key: key, value: value}
    lru.cache[key] = node
    lru.addToHead(node)

    if len(lru.cache) > lru.capacity {
        removed := lru.removeTail()
        delete(lru.cache, removed.key)
    }
}

func (lru *LRUCache) addToHead(node *Node) {
    node.prev = lru.head
    node.next = lru.head.next
    lru.head.next.prev = node
    lru.head.next = node
}

func (lru *LRUCache) removeNode(node *Node) {
    node.prev.next = node.next
    node.next.prev = node.prev
}

func (lru *LRUCache) moveToHead(node *Node) {
    lru.removeNode(node)
    lru.addToHead(node)
}

func (lru *LRUCache) removeTail() *Node {
    node := lru.tail.prev
    lru.removeNode(node)
    return node
}
```

**Time Complexity:** O(1) for both Get and Put
**Space Complexity:** O(capacity)

---

### 7. Concurrent Download Manager

```go
package main

import (
    "context"
    "fmt"
    "io"
    "net/http"
    "os"
    "sync"
)

type DownloadManager struct {
    maxConcurrent int
    sem           chan struct{}
}

func NewDownloadManager(maxConcurrent int) *DownloadManager {
    return &DownloadManager{
        maxConcurrent: maxConcurrent,
        sem:           make(chan struct{}, maxConcurrent),
    }
}

func (dm *DownloadManager) Download(ctx context.Context, urls []string) []error {
    var wg sync.WaitGroup
    errors := make([]error, len(urls))

    for i, url := range urls {
        wg.Add(1)
        go func(idx int, url string) {
            defer wg.Done()

            // Acquire semaphore
            dm.sem <- struct{}{}
            defer func() { <-dm.sem }()

            errors[idx] = dm.downloadFile(ctx, url, fmt.Sprintf("file_%d", idx))
        }(i, url)
    }

    wg.Wait()
    return errors
}

func (dm *DownloadManager) downloadFile(ctx context.Context, url, filename string) error {
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return err
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = io.Copy(file, resp.Body)
    return err
}

// Usage
func main() {
    urls := []string{
        "https://example.com/file1.txt",
        "https://example.com/file2.txt",
        "https://example.com/file3.txt",
    }

    dm := NewDownloadManager(2) // Max 2 concurrent downloads
    ctx := context.Background()

    errors := dm.Download(ctx, urls)
    for i, err := range errors {
        if err != nil {
            fmt.Printf("Download %d failed: %v\n", i, err)
        }
    }
}
```

---

### 8. Implement a Pub/Sub System

```go
package main

import (
    "sync"
)

type Message struct {
    Topic string
    Data  interface{}
}

type Subscriber struct {
    ID      string
    Channel chan Message
}

type PubSub struct {
    subscribers map[string][]*Subscriber
    mu          sync.RWMutex
}

func NewPubSub() *PubSub {
    return &PubSub{
        subscribers: make(map[string][]*Subscriber),
    }
}

func (ps *PubSub) Subscribe(topic string, sub *Subscriber) {
    ps.mu.Lock()
    defer ps.mu.Unlock()

    ps.subscribers[topic] = append(ps.subscribers[topic], sub)
}

func (ps *PubSub) Unsubscribe(topic string, subID string) {
    ps.mu.Lock()
    defer ps.mu.Unlock()

    subs := ps.subscribers[topic]
    for i, sub := range subs {
        if sub.ID == subID {
            ps.subscribers[topic] = append(subs[:i], subs[i+1:]...)
            close(sub.Channel)
            break
        }
    }
}

func (ps *PubSub) Publish(msg Message) {
    ps.mu.RLock()
    defer ps.mu.RUnlock()

    for _, sub := range ps.subscribers[msg.Topic] {
        // Non-blocking send
        select {
        case sub.Channel <- msg:
        default:
            // Subscriber channel full, skip
        }
    }
}

// Usage
func main() {
    ps := NewPubSub()

    // Create subscriber
    sub := &Subscriber{
        ID:      "sub1",
        Channel: make(chan Message, 10),
    }

    ps.Subscribe("events", sub)

    // Listen for messages
    go func() {
        for msg := range sub.Channel {
            fmt.Printf("Received: %v\n", msg.Data)
        }
    }()

    // Publish messages
    ps.Publish(Message{Topic: "events", Data: "Hello"})
    ps.Publish(Message{Topic: "events", Data: "World"})
}
```

---

## Quick Problem-Solving Tips

### 1. Always Clarify Requirements

- Input constraints (size, type, range)
- Edge cases (empty, null, negative)
- Expected output format
- Performance requirements

### 2. Think About Concurrency

- Race conditions
- Deadlocks
- Goroutine leaks
- Channel blocking

### 3. Common Patterns

- **Worker pool:** For concurrent processing
- **Pipeline:** For data transformation
- **Fan-in/Fan-out:** For parallel processing
- **Circuit breaker:** For fault tolerance

### 4. Error Handling

- Always handle errors explicitly
- Use custom error types when needed
- Consider error wrapping for context

### 5. Testing Approach

- Unit tests for individual functions
- Table-driven tests
- Benchmark tests for performance
- Race detector: `go test -race`

---

## Practice Questions

1. Implement a distributed lock using Redis
2. Build a simple load balancer
3. Create a job queue system
4. Implement consistent hashing
5. Design a circuit breaker
6. Build a retry mechanism with exponential backoff
7. Implement a simple event bus
8. Create a middleware chain for HTTP handlers
9. Build a connection timeout handler
10. Implement graceful shutdown for multiple services

**Remember:** Focus on:

- Clean, readable code
- Proper error handling
- Concurrency safety
- Performance considerations
- Testing your code


