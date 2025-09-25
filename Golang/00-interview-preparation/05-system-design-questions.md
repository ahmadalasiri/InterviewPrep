# System Design Interview Questions

## Microservices Architecture

### 1. Design a URL Shortener Service

**Problem:** Design a service like bit.ly that shortens long URLs.

**Requirements:**

- Shorten long URLs to short URLs
- Redirect short URLs to original URLs
- Handle 100M URLs per day
- 99.9% uptime

**Solution:**

```go
// URL Shortener Service
type URLShortener struct {
    db        Database
    cache     Cache
    generator IDGenerator
}

type ShortURL struct {
    ID       string    `json:"id"`
    LongURL  string    `json:"long_url"`
    ShortURL string    `json:"short_url"`
    Created  time.Time `json:"created"`
    Expires  time.Time `json:"expires"`
}

type Database interface {
    Save(url ShortURL) error
    GetByID(id string) (*ShortURL, error)
    GetByLongURL(longURL string) (*ShortURL, error)
}

type Cache interface {
    Set(key string, value interface{}, ttl time.Duration) error
    Get(key string) (interface{}, error)
}

type IDGenerator interface {
    Generate() string
}

// Base62 ID Generator
type Base62Generator struct {
    chars string
}

func NewBase62Generator() *Base62Generator {
    return &Base62Generator{
        chars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    }
}

func (g *Base62Generator) Generate() string {
    // Generate random 6-character string
    result := make([]byte, 6)
    for i := range result {
        result[i] = g.chars[rand.Intn(len(g.chars))]
    }
    return string(result)
}

// Service methods
func (us *URLShortener) Shorten(longURL string) (*ShortURL, error) {
    // Check if URL already exists
    if existing, err := us.db.GetByLongURL(longURL); err == nil {
        return existing, nil
    }

    // Generate new short ID
    id := us.generator.Generate()

    // Check for collisions
    for {
        if _, err := us.db.GetByID(id); err != nil {
            break // ID is available
        }
        id = us.generator.Generate()
    }

    shortURL := &ShortURL{
        ID:       id,
        LongURL:  longURL,
        ShortURL: fmt.Sprintf("https://short.ly/%s", id),
        Created:  time.Now(),
        Expires:  time.Now().Add(365 * 24 * time.Hour), // 1 year
    }

    // Save to database
    if err := us.db.Save(*shortURL); err != nil {
        return nil, err
    }

    // Cache the result
    us.cache.Set(id, shortURL, 24*time.Hour)

    return shortURL, nil
}

func (us *URLShortener) Redirect(shortID string) (string, error) {
    // Try cache first
    if cached, err := us.cache.Get(shortID); err == nil {
        if url, ok := cached.(*ShortURL); ok {
            return url.LongURL, nil
        }
    }

    // Get from database
    url, err := us.db.GetByID(shortID)
    if err != nil {
        return "", err
    }

    // Check if expired
    if time.Now().After(url.Expires) {
        return "", errors.New("URL expired")
    }

    // Cache the result
    us.cache.Set(shortID, url, 24*time.Hour)

    return url.LongURL, nil
}
```

### 2. Design a Chat System

**Problem:** Design a real-time chat system like WhatsApp or Slack.

**Requirements:**

- Real-time messaging
- Support for 1M concurrent users
- Message history
- Group chats
- File sharing

**Solution:**

```go
// Chat System
type ChatSystem struct {
    messageStore MessageStore
    userStore    UserStore
    roomStore    RoomStore
    hub          *Hub
}

type Message struct {
    ID        string    `json:"id"`
    RoomID    string    `json:"room_id"`
    UserID    string    `json:"user_id"`
    Content   string    `json:"content"`
    Type      string    `json:"type"` // text, image, file
    Timestamp time.Time `json:"timestamp"`
}

type User struct {
    ID       string `json:"id"`
    Username string `json:"username"`
    Status   string `json:"status"` // online, offline, away
}

type Room struct {
    ID      string   `json:"id"`
    Name    string   `json:"name"`
    Type    string   `json:"type"` // direct, group
    Members []string `json:"members"`
}

// WebSocket Hub for real-time communication
type Hub struct {
    clients    map[*Client]bool
    rooms      map[string]map[*Client]bool
    register   chan *Client
    unregister chan *Client
    broadcast  chan []byte
    mu         sync.RWMutex
}

type Client struct {
    hub    *Hub
    conn   *websocket.Conn
    send   chan []byte
    userID string
    rooms  map[string]bool
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.mu.Lock()
            h.clients[client] = true
            h.mu.Unlock()

        case client := <-h.unregister:
            h.mu.Lock()
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
                close(client.send)

                // Remove from all rooms
                for roomID := range client.rooms {
                    if room, exists := h.rooms[roomID]; exists {
                        delete(room, client)
                    }
                }
            }
            h.mu.Unlock()

        case message := <-h.broadcast:
            h.mu.RLock()
            for client := range h.clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(h.clients, client)
                }
            }
            h.mu.RUnlock()
        }
    }
}

// Service methods
func (cs *ChatSystem) SendMessage(roomID, userID, content string) (*Message, error) {
    message := &Message{
        ID:        generateID(),
        RoomID:    roomID,
        UserID:    userID,
        Content:   content,
        Type:      "text",
        Timestamp: time.Now(),
    }

    // Save message
    if err := cs.messageStore.Save(message); err != nil {
        return nil, err
    }

    // Broadcast to room
    cs.hub.broadcastToRoom(roomID, message)

    return message, nil
}

func (cs *ChatSystem) JoinRoom(roomID, userID string) error {
    // Add user to room
    if err := cs.roomStore.AddMember(roomID, userID); err != nil {
        return err
    }

    // Notify other members
    notification := map[string]interface{}{
        "type":    "user_joined",
        "room_id": roomID,
        "user_id": userID,
    }

    cs.hub.broadcastToRoom(roomID, notification)
    return nil
}
```

## Database Design

### 3. Design a Social Media Feed System

**Problem:** Design a system like Twitter or Instagram that shows personalized feeds.

**Requirements:**

- Follow/unfollow users
- Post content (text, images, videos)
- Personalized timeline
- Handle 1B posts per day

**Solution:**

```go
// Social Media Feed System
type FeedSystem struct {
    userStore    UserStore
    postStore    PostStore
    followStore  FollowStore
    feedStore    FeedStore
    cache        Cache
}

type Post struct {
    ID        string    `json:"id"`
    UserID    string    `json:"user_id"`
    Content   string    `json:"content"`
    Type      string    `json:"type"` // text, image, video
    MediaURL  string    `json:"media_url,omitempty"`
    Created   time.Time `json:"created"`
    Likes     int       `json:"likes"`
    Comments  int       `json:"comments"`
}

type User struct {
    ID       string `json:"id"`
    Username string `json:"username"`
    Bio      string `json:"bio"`
    Followers int   `json:"followers"`
    Following int   `json:"following"`
}

type Follow struct {
    FollowerID string    `json:"follower_id"`
    FollowingID string   `json:"following_id"`
    Created    time.Time `json:"created"`
}

// Feed generation strategies
type FeedStrategy interface {
    GenerateFeed(userID string, limit int) ([]Post, error)
}

// Timeline-based feed (chronological)
type TimelineFeed struct {
    postStore   PostStore
    followStore FollowStore
}

func (tf *TimelineFeed) GenerateFeed(userID string, limit int) ([]Post, error) {
    // Get followed users
    following, err := tf.followStore.GetFollowing(userID)
    if err != nil {
        return nil, err
    }

    // Get recent posts from followed users
    posts, err := tf.postStore.GetRecentPosts(following, limit)
    if err != nil {
        return nil, err
    }

    return posts, nil
}

// Algorithmic feed (engagement-based)
type AlgorithmicFeed struct {
    postStore   PostStore
    followStore FollowStore
    cache       Cache
}

func (af *AlgorithmicFeed) GenerateFeed(userID string, limit int) ([]Post, error) {
    // Try cache first
    cacheKey := fmt.Sprintf("feed:%s", userID)
    if cached, err := af.cache.Get(cacheKey); err == nil {
        if posts, ok := cached.([]Post); ok {
            return posts, nil
        }
    }

    // Get followed users
    following, err := af.followStore.GetFollowing(userID)
    if err != nil {
        return nil, err
    }

    // Get posts with engagement scores
    posts, err := af.postStore.GetEngagedPosts(following, limit)
    if err != nil {
        return nil, err
    }

    // Cache the result
    af.cache.Set(cacheKey, posts, 5*time.Minute)

    return posts, nil
}

// Service methods
func (fs *FeedSystem) CreatePost(userID, content, postType string) (*Post, error) {
    post := &Post{
        ID:      generateID(),
        UserID:  userID,
        Content: content,
        Type:    postType,
        Created: time.Now(),
    }

    // Save post
    if err := fs.postStore.Save(post); err != nil {
        return nil, err
    }

    // Update followers' feeds (async)
    go fs.updateFollowersFeeds(userID, post)

    return post, nil
}

func (fs *FeedSystem) GetFeed(userID string, limit int) ([]Post, error) {
    // Use algorithmic feed for better engagement
    strategy := &AlgorithmicFeed{
        postStore:   fs.postStore,
        followStore: fs.followStore,
        cache:       fs.cache,
    }

    return strategy.GenerateFeed(userID, limit)
}

func (fs *FeedSystem) updateFollowersFeeds(userID string, post *Post) {
    followers, err := fs.followStore.GetFollowers(userID)
    if err != nil {
        return
    }

    // Update each follower's feed
    for _, followerID := range followers {
        fs.feedStore.AddToFeed(followerID, post)
    }
}
```

## Scalability and Performance

### 4. Design a Distributed Cache System

**Problem:** Design a distributed cache system like Redis or Memcached.

**Requirements:**

- High availability
- Horizontal scaling
- Consistent hashing
- Cache invalidation

**Solution:**

```go
// Distributed Cache System
type DistributedCache struct {
    nodes    []CacheNode
    hashRing *ConsistentHash
    replicas int
}

type CacheNode struct {
    ID       string
    Address  string
    Port     int
    IsActive bool
}

type ConsistentHash struct {
    ring     map[uint32]string
    nodes    []string
    replicas int
    mu       sync.RWMutex
}

func NewConsistentHash(replicas int) *ConsistentHash {
    return &ConsistentHash{
        ring:     make(map[uint32]string),
        nodes:    make([]string, 0),
        replicas: replicas,
    }
}

func (ch *ConsistentHash) AddNode(node string) {
    ch.mu.Lock()
    defer ch.mu.Unlock()

    ch.nodes = append(ch.nodes, node)

    for i := 0; i < ch.replicas; i++ {
        hash := ch.hash(fmt.Sprintf("%s:%d", node, i))
        ch.ring[hash] = node
    }
}

func (ch *ConsistentHash) GetNode(key string) string {
    ch.mu.RLock()
    defer ch.mu.RUnlock()

    if len(ch.ring) == 0 {
        return ""
    }

    hash := ch.hash(key)

    // Find the first node with hash >= key hash
    for h, node := range ch.ring {
        if h >= hash {
            return node
        }
    }

    // Wrap around to the first node
    minHash := uint32(0)
    for h := range ch.ring {
        if h < minHash {
            minHash = h
        }
    }

    return ch.ring[minHash]
}

func (ch *ConsistentHash) hash(key string) uint32 {
    h := fnv.New32a()
    h.Write([]byte(key))
    return h.Sum32()
}

// Cache operations
func (dc *DistributedCache) Set(key string, value interface{}, ttl time.Duration) error {
    node := dc.hashRing.GetNode(key)
    if node == "" {
        return errors.New("no available nodes")
    }

    // Send to primary node
    if err := dc.sendToNode(node, "SET", key, value, ttl); err != nil {
        return err
    }

    // Replicate to other nodes
    go dc.replicate(key, value, ttl)

    return nil
}

func (dc *DistributedCache) Get(key string) (interface{}, error) {
    node := dc.hashRing.GetNode(key)
    if node == "" {
        return nil, errors.New("no available nodes")
    }

    return dc.sendToNode(node, "GET", key, nil, 0)
}

func (dc *DistributedCache) sendToNode(node, command, key string, value interface{}, ttl time.Duration) error {
    // Implementation would send HTTP request or use gRPC
    // to the specific cache node
    return nil
}

func (dc *DistributedCache) replicate(key string, value interface{}, ttl time.Duration) {
    // Replicate to other nodes for redundancy
    for _, node := range dc.nodes {
        if node != dc.hashRing.GetNode(key) {
            dc.sendToNode(node, "SET", key, value, ttl)
        }
    }
}
```

### 5. Design a Load Balancer

**Problem:** Design a load balancer that distributes traffic across multiple servers.

**Requirements:**

- Multiple load balancing algorithms
- Health checks
- Session persistence
- Auto-scaling

**Solution:**

```go
// Load Balancer
type LoadBalancer struct {
    servers    []Server
    algorithm  LoadBalancingAlgorithm
    healthCheck HealthChecker
    mu         sync.RWMutex
}

type Server struct {
    ID       string
    Address  string
    Port     int
    Weight   int
    IsHealthy bool
    Requests int
}

type LoadBalancingAlgorithm interface {
    SelectServer(servers []Server) *Server
}

// Round Robin Algorithm
type RoundRobin struct {
    current int
    mu      sync.Mutex
}

func (rr *RoundRobin) SelectServer(servers []Server) *Server {
    rr.mu.Lock()
    defer rr.mu.Unlock()

    healthyServers := make([]Server, 0)
    for _, server := range servers {
        if server.IsHealthy {
            healthyServers = append(healthyServers, server)
        }
    }

    if len(healthyServers) == 0 {
        return nil
    }

    server := &healthyServers[rr.current%len(healthyServers)]
    rr.current++

    return server
}

// Weighted Round Robin
type WeightedRoundRobin struct {
    current int
    mu      sync.Mutex
}

func (wrr *WeightedRoundRobin) SelectServer(servers []Server) *Server {
    wrr.mu.Lock()
    defer wrr.mu.Unlock()

    totalWeight := 0
    healthyServers := make([]Server, 0)

    for _, server := range servers {
        if server.IsHealthy {
            healthyServers = append(healthyServers, server)
            totalWeight += server.Weight
        }
    }

    if totalWeight == 0 {
        return nil
    }

    current := wrr.current % totalWeight
    wrr.current++

    for _, server := range healthyServers {
        current -= server.Weight
        if current < 0 {
            return &server
        }
    }

    return nil
}

// Least Connections
type LeastConnections struct{}

func (lc *LeastConnections) SelectServer(servers []Server) *Server {
    var selected *Server
    minRequests := int(^uint(0) >> 1) // Max int

    for i := range servers {
        if servers[i].IsHealthy && servers[i].Requests < minRequests {
            selected = &servers[i]
            minRequests = servers[i].Requests
        }
    }

    return selected
}

// Health Checker
type HealthChecker struct {
    interval time.Duration
    timeout  time.Duration
}

func (hc *HealthChecker) CheckHealth(server *Server) bool {
    // Implementation would make HTTP request to health endpoint
    // Return true if server is healthy, false otherwise
    return true
}

func (hc *HealthChecker) StartHealthChecks(servers []Server) {
    ticker := time.NewTicker(hc.interval)
    defer ticker.Stop()

    for range ticker.C {
        for i := range servers {
            go func(server *Server) {
                server.IsHealthy = hc.CheckHealth(server)
            }(&servers[i])
        }
    }
}

// Load Balancer methods
func (lb *LoadBalancer) SelectServer() *Server {
    lb.mu.RLock()
    servers := make([]Server, len(lb.servers))
    copy(servers, lb.servers)
    lb.mu.RUnlock()

    return lb.algorithm.SelectServer(servers)
}

func (lb *LoadBalancer) HandleRequest(req *http.Request) (*http.Response, error) {
    server := lb.SelectServer()
    if server == nil {
        return nil, errors.New("no healthy servers available")
    }

    // Increment request count
    lb.mu.Lock()
    for i := range lb.servers {
        if lb.servers[i].ID == server.ID {
            lb.servers[i].Requests++
            break
        }
    }
    lb.mu.Unlock()

    // Forward request to selected server
    return lb.forwardRequest(server, req)
}

func (lb *LoadBalancer) forwardRequest(server *Server, req *http.Request) (*http.Response, error) {
    // Implementation would forward the request to the selected server
    return nil, nil
}
```

## Monitoring and Observability

### 6. Design a Metrics Collection System

**Problem:** Design a system to collect, store, and query application metrics.

**Requirements:**

- Collect metrics from multiple services
- Store time-series data
- Support queries and aggregations
- Real-time dashboards

**Solution:**

```go
// Metrics Collection System
type MetricsCollector struct {
    storage    MetricsStorage
    aggregator MetricsAggregator
    queryEngine QueryEngine
}

type Metric struct {
    Name      string            `json:"name"`
    Value     float64           `json:"value"`
    Timestamp time.Time         `json:"timestamp"`
    Tags      map[string]string `json:"tags"`
}

type MetricsStorage interface {
    Store(metric Metric) error
    Query(query Query) ([]Metric, error)
}

type Query struct {
    Name      string
    StartTime time.Time
    EndTime   time.Time
    Tags      map[string]string
    Aggregation string // sum, avg, min, max, count
    GroupBy   []string
}

// In-memory storage for demonstration
type InMemoryStorage struct {
    metrics []Metric
    mu      sync.RWMutex
}

func (ims *InMemoryStorage) Store(metric Metric) error {
    ims.mu.Lock()
    defer ims.mu.Unlock()

    ims.metrics = append(ims.metrics, metric)
    return nil
}

func (ims *InMemoryStorage) Query(query Query) ([]Metric, error) {
    ims.mu.RLock()
    defer ims.mu.RUnlock()

    var results []Metric

    for _, metric := range ims.metrics {
        if metric.Name != query.Name {
            continue
        }

        if metric.Timestamp.Before(query.StartTime) || metric.Timestamp.After(query.EndTime) {
            continue
        }

        // Check tags
        matches := true
        for key, value := range query.Tags {
            if metric.Tags[key] != value {
                matches = false
                break
            }
        }

        if matches {
            results = append(results, metric)
        }
    }

    return results, nil
}

// Metrics Aggregator
type MetricsAggregator struct {
    storage MetricsStorage
}

func (ma *MetricsAggregator) Aggregate(query Query) (float64, error) {
    metrics, err := ma.storage.Query(query)
    if err != nil {
        return 0, err
    }

    if len(metrics) == 0 {
        return 0, nil
    }

    switch query.Aggregation {
    case "sum":
        sum := 0.0
        for _, metric := range metrics {
            sum += metric.Value
        }
        return sum, nil

    case "avg":
        sum := 0.0
        for _, metric := range metrics {
            sum += metric.Value
        }
        return sum / float64(len(metrics)), nil

    case "min":
        min := metrics[0].Value
        for _, metric := range metrics {
            if metric.Value < min {
                min = metric.Value
            }
        }
        return min, nil

    case "max":
        max := metrics[0].Value
        for _, metric := range metrics {
            if metric.Value > max {
                max = metric.Value
            }
        }
        return max, nil

    case "count":
        return float64(len(metrics)), nil

    default:
        return 0, errors.New("unsupported aggregation")
    }
}

// Service methods
func (mc *MetricsCollector) CollectMetric(name string, value float64, tags map[string]string) error {
    metric := Metric{
        Name:      name,
        Value:     value,
        Timestamp: time.Now(),
        Tags:      tags,
    }

    return mc.storage.Store(metric)
}

func (mc *MetricsCollector) QueryMetrics(query Query) ([]Metric, error) {
    return mc.storage.Query(query)
}

func (mc *MetricsCollector) GetAggregatedMetric(query Query) (float64, error) {
    return mc.aggregator.Aggregate(query)
}
```

---

## Key Takeaways

1. **Start with requirements** - Understand the problem before designing
2. **Think about scale** - Consider how the system will handle growth
3. **Design for failure** - Plan for component failures and recovery
4. **Use appropriate data structures** - Choose the right storage and algorithms
5. **Consider consistency vs availability** - Understand CAP theorem trade-offs
6. **Plan for monitoring** - Design observability from the start
7. **Think about security** - Consider authentication, authorization, and data protection
8. **Design for maintainability** - Create clean, modular, and testable code


