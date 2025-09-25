# Practical Coding Interview Questions

## Algorithm Implementation

### 1. Implement a LRU (Least Recently Used) Cache

**Problem:** Design and implement a data structure for Least Recently Used (LRU) cache.

**Solution:**

```go
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
    head := &Node{key: 0, value: 0}
    tail := &Node{key: 0, value: 0}
    head.next = tail
    tail.prev = head

    return LRUCache{
        capacity: capacity,
        cache:    make(map[int]*Node),
        head:     head,
        tail:     tail,
    }
}

func (lru *LRUCache) Get(key int) int {
    if node, exists := lru.cache[key]; exists {
        lru.moveToHead(node)
        return node.value
    }
    return -1
}

func (lru *LRUCache) Put(key int, value int) {
    if node, exists := lru.cache[key]; exists {
        node.value = value
        lru.moveToHead(node)
    } else {
        newNode := &Node{key: key, value: value}

        if len(lru.cache) >= lru.capacity {
            tail := lru.removeTail()
            delete(lru.cache, tail.key)
        }

        lru.cache[key] = newNode
        lru.addToHead(newNode)
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
    lastNode := lru.tail.prev
    lru.removeNode(lastNode)
    return lastNode
}
```

### 2. Implement a Rate Limiter

**Problem:** Implement a rate limiter that allows N requests per second.

**Solution:**

```go
type RateLimiter struct {
    requests chan time.Time
    rate     time.Duration
}

func NewRateLimiter(requestsPerSecond int) *RateLimiter {
    rl := &RateLimiter{
        requests: make(chan time.Time, requestsPerSecond),
        rate:     time.Second / time.Duration(requestsPerSecond),
    }

    go rl.cleanup()
    return rl
}

func (rl *RateLimiter) Allow() bool {
    select {
    case rl.requests <- time.Now():
        return true
    default:
        return false
    }
}

func (rl *RateLimiter) cleanup() {
    ticker := time.NewTicker(rl.rate)
    defer ticker.Stop()

    for range ticker.C {
        select {
        case <-rl.requests:
        default:
        }
    }
}
```

### 3. Implement a Concurrent Safe Counter

**Problem:** Implement a thread-safe counter that can be incremented and decremented.

**Solution:**

```go
type SafeCounter struct {
    mu    sync.RWMutex
    value int64
}

func NewSafeCounter() *SafeCounter {
    return &SafeCounter{}
}

func (c *SafeCounter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *SafeCounter) Decrement() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value--
}

func (c *SafeCounter) Value() int64 {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.value
}

func (c *SafeCounter) Reset() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value = 0
}
```

### 4. Implement a Worker Pool

**Problem:** Create a worker pool that processes jobs concurrently.

**Solution:**

```go
type Job struct {
    ID   int
    Data interface{}
}

type WorkerPool struct {
    workers    int
    jobQueue   chan Job
    resultChan chan interface{}
    wg         sync.WaitGroup
}

func NewWorkerPool(workers int, jobQueueSize int) *WorkerPool {
    return &WorkerPool{
        workers:    workers,
        jobQueue:   make(chan Job, jobQueueSize),
        resultChan: make(chan interface{}, jobQueueSize),
    }
}

func (wp *WorkerPool) Start(processor func(Job) interface{}) {
    for i := 0; i < wp.workers; i++ {
        wp.wg.Add(1)
        go wp.worker(i, processor)
    }
}

func (wp *WorkerPool) worker(id int, processor func(Job) interface{}) {
    defer wp.wg.Done()

    for job := range wp.jobQueue {
        result := processor(job)
        wp.resultChan <- result
    }
}

func (wp *WorkerPool) Submit(job Job) {
    wp.jobQueue <- job
}

func (wp *WorkerPool) Close() {
    close(wp.jobQueue)
    wp.wg.Wait()
    close(wp.resultChan)
}

func (wp *WorkerPool) Results() <-chan interface{} {
    return wp.resultChan
}
```

## Data Structure Implementation

### 5. Implement a Trie (Prefix Tree)

**Problem:** Implement a trie data structure for efficient string operations.

**Solution:**

```go
type TrieNode struct {
    children map[rune]*TrieNode
    isEnd    bool
}

type Trie struct {
    root *TrieNode
}

func NewTrie() *Trie {
    return &Trie{
        root: &TrieNode{
            children: make(map[rune]*TrieNode),
        },
    }
}

func (t *Trie) Insert(word string) {
    node := t.root
    for _, char := range word {
        if _, exists := node.children[char]; !exists {
            node.children[char] = &TrieNode{
                children: make(map[rune]*TrieNode),
            }
        }
        node = node.children[char]
    }
    node.isEnd = true
}

func (t *Trie) Search(word string) bool {
    node := t.root
    for _, char := range word {
        if _, exists := node.children[char]; !exists {
            return false
        }
        node = node.children[char]
    }
    return node.isEnd
}

func (t *Trie) StartsWith(prefix string) bool {
    node := t.root
    for _, char := range prefix {
        if _, exists := node.children[char]; !exists {
            return false
        }
        node = node.children[char]
    }
    return true
}
```

### 6. Implement a Circular Buffer

**Problem:** Implement a fixed-size circular buffer.

**Solution:**

```go
type CircularBuffer struct {
    buffer []interface{}
    size   int
    head   int
    tail   int
    count  int
    mu     sync.Mutex
}

func NewCircularBuffer(size int) *CircularBuffer {
    return &CircularBuffer{
        buffer: make([]interface{}, size),
        size:   size,
    }
}

func (cb *CircularBuffer) Put(item interface{}) bool {
    cb.mu.Lock()
    defer cb.mu.Unlock()

    if cb.count == cb.size {
        return false // Buffer is full
    }

    cb.buffer[cb.tail] = item
    cb.tail = (cb.tail + 1) % cb.size
    cb.count++
    return true
}

func (cb *CircularBuffer) Get() (interface{}, bool) {
    cb.mu.Lock()
    defer cb.mu.Unlock()

    if cb.count == 0 {
        return nil, false // Buffer is empty
    }

    item := cb.buffer[cb.head]
    cb.head = (cb.head + 1) % cb.size
    cb.count--
    return item, true
}

func (cb *CircularBuffer) IsFull() bool {
    cb.mu.Lock()
    defer cb.mu.Unlock()
    return cb.count == cb.size
}

func (cb *CircularBuffer) IsEmpty() bool {
    cb.mu.Lock()
    defer cb.mu.Unlock()
    return cb.count == 0
}
```

## HTTP and Web Services

### 7. Implement a REST API Client

**Problem:** Create a REST API client with proper error handling and timeouts.

**Solution:**

```go
type APIClient struct {
    baseURL    string
    httpClient *http.Client
    headers    map[string]string
}

type APIError struct {
    StatusCode int
    Message    string
}

func (e APIError) Error() string {
    return fmt.Sprintf("API error %d: %s", e.StatusCode, e.Message)
}

func NewAPIClient(baseURL string) *APIClient {
    return &APIClient{
        baseURL: baseURL,
        httpClient: &http.Client{
            Timeout: 30 * time.Second,
        },
        headers: make(map[string]string),
    }
}

func (c *APIClient) SetHeader(key, value string) {
    c.headers[key] = value
}

func (c *APIClient) Get(path string, result interface{}) error {
    return c.request("GET", path, nil, result)
}

func (c *APIClient) Post(path string, data interface{}, result interface{}) error {
    return c.request("POST", path, data, result)
}

func (c *APIClient) request(method, path string, data interface{}, result interface{}) error {
    var body io.Reader
    if data != nil {
        jsonData, err := json.Marshal(data)
        if err != nil {
            return err
        }
        body = bytes.NewBuffer(jsonData)
    }

    req, err := http.NewRequest(method, c.baseURL+path, body)
    if err != nil {
        return err
    }

    // Set headers
    for key, value := range c.headers {
        req.Header.Set(key, value)
    }
    req.Header.Set("Content-Type", "application/json")

    resp, err := c.httpClient.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode >= 400 {
        body, _ := io.ReadAll(resp.Body)
        return APIError{
            StatusCode: resp.StatusCode,
            Message:    string(body),
        }
    }

    if result != nil {
        return json.NewDecoder(resp.Body).Decode(result)
    }

    return nil
}
```

### 8. Implement a Simple HTTP Server

**Problem:** Create a simple HTTP server with middleware support.

**Solution:**

```go
type HandlerFunc func(http.ResponseWriter, *http.Request)

type Middleware func(HandlerFunc) HandlerFunc

type Server struct {
    mux         *http.ServeMux
    middlewares []Middleware
}

func NewServer() *Server {
    return &Server{
        mux: http.NewServeMux(),
    }
}

func (s *Server) Use(middleware Middleware) {
    s.middlewares = append(s.middlewares, middleware)
}

func (s *Server) HandleFunc(pattern string, handler HandlerFunc) {
    wrappedHandler := s.wrapHandler(handler)
    s.mux.HandleFunc(pattern, wrappedHandler)
}

func (s *Server) wrapHandler(handler HandlerFunc) http.HandlerFunc {
    for i := len(s.middlewares) - 1; i >= 0; i-- {
        handler = s.middlewares[i](handler)
    }
    return http.HandlerFunc(handler)
}

func (s *Server) Start(addr string) error {
    return http.ListenAndServe(addr, s.mux)
}

// Example middleware
func LoggingMiddleware(next HandlerFunc) HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next(w, r)
        fmt.Printf("%s %s %v\n", r.Method, r.URL.Path, time.Since(start))
    }
}

func CORSMiddleware(next HandlerFunc) HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        next(w, r)
    }
}
```

## File and Data Processing

### 9. Implement a File Processor

**Problem:** Create a concurrent file processor that reads, processes, and writes files.

**Solution:**

```go
type FileProcessor struct {
    inputDir  string
    outputDir string
    workers   int
}

type FileJob struct {
    InputPath  string
    OutputPath string
}

type FileProcessor struct {
    inputDir  string
    outputDir string
    workers   int
}

func NewFileProcessor(inputDir, outputDir string, workers int) *FileProcessor {
    return &FileProcessor{
        inputDir:  inputDir,
        outputDir: outputDir,
        workers:   workers,
    }
}

func (fp *FileProcessor) ProcessFiles(processor func([]byte) ([]byte, error)) error {
    files, err := filepath.Glob(filepath.Join(fp.inputDir, "*.txt"))
    if err != nil {
        return err
    }

    jobs := make(chan FileJob, len(files))
    results := make(chan error, len(files))

    // Start workers
    var wg sync.WaitGroup
    for i := 0; i < fp.workers; i++ {
        wg.Add(1)
        go fp.worker(jobs, results, processor, &wg)
    }

    // Send jobs
    for _, file := range files {
        outputPath := filepath.Join(fp.outputDir, filepath.Base(file))
        jobs <- FileJob{InputPath: file, OutputPath: outputPath}
    }
    close(jobs)

    // Wait for workers
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    for err := range results {
        if err != nil {
            return err
        }
    }

    return nil
}

func (fp *FileProcessor) worker(jobs <-chan FileJob, results chan<- error, processor func([]byte) ([]byte, error), wg *sync.WaitGroup) {
    defer wg.Done()

    for job := range jobs {
        // Read file
        data, err := os.ReadFile(job.InputPath)
        if err != nil {
            results <- err
            continue
        }

        // Process data
        processedData, err := processor(data)
        if err != nil {
            results <- err
            continue
        }

        // Write file
        err = os.WriteFile(job.OutputPath, processedData, 0644)
        results <- err
    }
}
```

### 10. Implement a JSON Stream Processor

**Problem:** Process large JSON files by streaming and parsing them incrementally.

**Solution:**

```go
type JSONStreamProcessor struct {
    decoder *json.Decoder
}

type Person struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    Age  int    `json:"age"`
}

func NewJSONStreamProcessor(reader io.Reader) *JSONStreamProcessor {
    return &JSONStreamProcessor{
        decoder: json.NewDecoder(reader),
    }
}

func (jsp *JSONStreamProcessor) ProcessPersons(processor func(Person) error) error {
    // Read opening bracket
    token, err := jsp.decoder.Token()
    if err != nil {
        return err
    }
    if delim, ok := token.(json.Delim); !ok || delim != '[' {
        return fmt.Errorf("expected array start")
    }

    // Process each person
    for jsp.decoder.More() {
        var person Person
        if err := jsp.decoder.Decode(&person); err != nil {
            return err
        }

        if err := processor(person); err != nil {
            return err
        }
    }

    // Read closing bracket
    token, err = jsp.decoder.Token()
    if err != nil {
        return err
    }
    if delim, ok := token.(json.Delim); !ok || delim != ']' {
        return fmt.Errorf("expected array end")
    }

    return nil
}
```

## Database Operations

### 11. Implement a Database Connection Pool

**Problem:** Create a connection pool for database operations.

**Solution:**

```go
type ConnectionPool struct {
    connections chan *sql.DB
    factory     func() (*sql.DB, error)
    maxSize     int
    mu          sync.RWMutex
    closed      bool
}

func NewConnectionPool(factory func() (*sql.DB, error), maxSize int) *ConnectionPool {
    return &ConnectionPool{
        connections: make(chan *sql.DB, maxSize),
        factory:     factory,
        maxSize:     maxSize,
    }
}

func (cp *ConnectionPool) Get() (*sql.DB, error) {
    cp.mu.RLock()
    if cp.closed {
        cp.mu.RUnlock()
        return nil, errors.New("pool is closed")
    }
    cp.mu.RUnlock()

    select {
    case conn := <-cp.connections:
        return conn, nil
    default:
        return cp.factory()
    }
}

func (cp *ConnectionPool) Put(conn *sql.DB) {
    cp.mu.RLock()
    if cp.closed {
        cp.mu.RUnlock()
        conn.Close()
        return
    }
    cp.mu.RUnlock()

    select {
    case cp.connections <- conn:
    default:
        conn.Close()
    }
}

func (cp *ConnectionPool) Close() {
    cp.mu.Lock()
    defer cp.mu.Unlock()

    if cp.closed {
        return
    }

    cp.closed = true
    close(cp.connections)

    for conn := range cp.connections {
        conn.Close()
    }
}
```

## Testing and Quality

### 12. Implement a Mock HTTP Client

**Problem:** Create a mock HTTP client for testing.

**Solution:**

```go
type MockHTTPClient struct {
    responses map[string]*http.Response
    requests  []*http.Request
    mu        sync.RWMutex
}

func NewMockHTTPClient() *MockHTTPClient {
    return &MockHTTPClient{
        responses: make(map[string]*http.Response),
        requests:  make([]*http.Request, 0),
    }
}

func (m *MockHTTPClient) SetResponse(url string, response *http.Response) {
    m.mu.Lock()
    defer m.mu.Unlock()
    m.responses[url] = response
}

func (m *MockHTTPClient) Do(req *http.Request) (*http.Response, error) {
    m.mu.Lock()
    m.requests = append(m.requests, req)
    m.mu.Unlock()

    m.mu.RLock()
    response, exists := m.responses[req.URL.String()]
    m.mu.RUnlock()

    if !exists {
        return nil, fmt.Errorf("no mock response for %s", req.URL.String())
    }

    return response, nil
}

func (m *MockHTTPClient) GetRequests() []*http.Request {
    m.mu.RLock()
    defer m.mu.RUnlock()
    return append([]*http.Request(nil), m.requests...)
}
```

## Practice Problems

### 13. Implement a Simple Cache with TTL

**Problem:** Create a cache that automatically expires entries after a specified time.

**Solution:**

```go
type CacheEntry struct {
    value     interface{}
    expiresAt time.Time
}

type TTLCache struct {
    entries map[string]CacheEntry
    mu      sync.RWMutex
    ttl     time.Duration
}

func NewTTLCache(ttl time.Duration) *TTLCache {
    cache := &TTLCache{
        entries: make(map[string]CacheEntry),
        ttl:     ttl,
    }

    go cache.cleanup()
    return cache
}

func (c *TTLCache) Set(key string, value interface{}) {
    c.mu.Lock()
    defer c.mu.Unlock()

    c.entries[key] = CacheEntry{
        value:     value,
        expiresAt: time.Now().Add(c.ttl),
    }
}

func (c *TTLCache) Get(key string) (interface{}, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()

    entry, exists := c.entries[key]
    if !exists {
        return nil, false
    }

    if time.Now().After(entry.expiresAt) {
        return nil, false
    }

    return entry.value, true
}

func (c *TTLCache) cleanup() {
    ticker := time.NewTicker(c.ttl / 2)
    defer ticker.Stop()

    for range ticker.C {
        c.mu.Lock()
        now := time.Now()
        for key, entry := range c.entries {
            if now.After(entry.expiresAt) {
                delete(c.entries, key)
            }
        }
        c.mu.Unlock()
    }
}
```

### 14. Implement a Simple Pub/Sub System

**Problem:** Create a publish-subscribe system for event-driven communication.

**Solution:**

```go
type Event struct {
    Type string
    Data interface{}
}

type Subscriber func(Event)

type PubSub struct {
    subscribers map[string][]Subscriber
    mu          sync.RWMutex
}

func NewPubSub() *PubSub {
    return &PubSub{
        subscribers: make(map[string][]Subscriber),
    }
}

func (ps *PubSub) Subscribe(eventType string, subscriber Subscriber) {
    ps.mu.Lock()
    defer ps.mu.Unlock()

    ps.subscribers[eventType] = append(ps.subscribers[eventType], subscriber)
}

func (ps *PubSub) Publish(event Event) {
    ps.mu.RLock()
    subscribers := ps.subscribers[event.Type]
    ps.mu.RUnlock()

    for _, subscriber := range subscribers {
        go subscriber(event)
    }
}

func (ps *PubSub) Unsubscribe(eventType string, subscriber Subscriber) {
    ps.mu.Lock()
    defer ps.mu.Unlock()

    subscribers := ps.subscribers[eventType]
    for i, sub := range subscribers {
        if &sub == &subscriber {
            ps.subscribers[eventType] = append(subscribers[:i], subscribers[i+1:]...)
            break
        }
    }
}
```

---

## Key Takeaways

1. **Think about concurrency** - Most real-world problems benefit from concurrent solutions
2. **Handle errors properly** - Always check and handle errors appropriately
3. **Use appropriate data structures** - Choose the right tool for the job
4. **Consider performance** - Optimize for the expected use case
5. **Write testable code** - Design for easy testing and mocking
6. **Follow Go conventions** - Use idiomatic Go patterns and practices
7. **Document your code** - Write clear comments and documentation


