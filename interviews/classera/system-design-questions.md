# System Design Questions - Classera Interview

## Common System Design Questions for Go Developer Role

### 1. Design a Learning Management System (LMS)

**Context:** Classera's core product

#### Requirements:

- Students can enroll in courses
- Teachers can create and manage courses
- Real-time video streaming for live classes
- Assignment submission and grading
- Discussion forums
- Analytics and reporting
- Support 100K concurrent users

#### Components to Discuss:

**1. Architecture:**

```
┌─────────────┐
│   CDN       │ (Static content, videos)
└──────┬──────┘
       │
┌──────▼──────┐
│ API Gateway │ (Rate limiting, Auth)
└──────┬──────┘
       │
       ├───────────────────────────────────┐
       │                                   │
┌──────▼─────────┐               ┌────────▼────────┐
│ User Service   │               │ Course Service  │
│ (Microservice) │               │ (Microservice)  │
└────────┬───────┘               └─────────┬───────┘
         │                                 │
┌────────▼─────────────────────────────────▼──────┐
│          Message Queue (Kafka/RabbitMQ)         │
└─────────────────────┬───────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
┌────────▼───┐  ┌─────▼────┐  ┌───▼──────┐
│PostgreSQL  │  │ MongoDB  │  │  Redis   │
│(User data) │  │(Content) │  │ (Cache)  │
└────────────┘  └──────────┘  └──────────┘
```

**2. Key Services:**

- **User Service:** Authentication, authorization, profiles
- **Course Service:** Course CRUD, enrollment, content management
- **Video Service:** Streaming, live classes (WebRTC)
- **Assignment Service:** Submissions, grading, feedback
- **Notification Service:** Email, push notifications
- **Analytics Service:** Reporting, dashboards

**3. Database Design:**

**PostgreSQL (Relational data):**

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor_id UUID REFERENCES users(id),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50),
    UNIQUE(user_id, course_id)
);

-- Index for performance
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
```

**MongoDB (Flexible content):**

```javascript
// Course content (lessons, materials)
{
  "_id": "course_123",
  "title": "Introduction to Go",
  "modules": [
    {
      "id": "module_1",
      "title": "Basics",
      "lessons": [
        {
          "id": "lesson_1",
          "title": "Hello World",
          "content": "...",
          "videoUrl": "...",
          "duration": 300
        }
      ]
    }
  ],
  "metadata": {
    "tags": ["programming", "golang"],
    "difficulty": "beginner"
  }
}

// Assignments
{
  "_id": "assignment_123",
  "course_id": "course_123",
  "title": "Build a REST API",
  "description": "...",
  "due_date": ISODate("2025-11-01"),
  "submissions": [
    {
      "student_id": "user_456",
      "submitted_at": ISODate("2025-10-30"),
      "file_url": "s3://...",
      "grade": 95,
      "feedback": "Excellent work!"
    }
  ]
}
```

**Redis (Caching & Sessions):**

```
# Cache course data
SET course:123 "{...course json...}" EX 3600

# Session management
SET session:user_456 "{...session data...}" EX 86400

# Real-time active users
SADD active_users:course_123 user_456
EXPIRE active_users:course_123 300
```

**4. Scalability Considerations:**

- **Horizontal scaling:** Deploy multiple instances of each service
- **Database sharding:** Shard by user_id or course_id
- **Caching strategy:** Redis for frequently accessed data
- **CDN:** For static content and videos
- **Load balancing:** Distribute traffic across instances
- **Async processing:** Use message queues for notifications, analytics

**5. Real-time Features:**

```go
// WebSocket for live classes
type LiveClassHub struct {
    clients    map[string]*Client
    broadcast  chan []byte
    register   chan *Client
    unregister chan *Client
    mu         sync.RWMutex
}

func (h *LiveClassHub) Run() {
    for {
        select {
        case client := <-h.register:
            h.mu.Lock()
            h.clients[client.ID] = client
            h.mu.Unlock()

        case client := <-h.unregister:
            h.mu.Lock()
            delete(h.clients, client.ID)
            h.mu.Unlock()
            close(client.send)

        case message := <-h.broadcast:
            h.mu.RLock()
            for _, client := range h.clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(h.clients, client.ID)
                }
            }
            h.mu.RUnlock()
        }
    }
}
```

---

### 2. Design a URL Shortener

**Requirements:**

- Shorten long URLs
- Redirect to original URL
- Analytics (click count, geography)
- Custom short URLs
- Expiration support
- Handle 1000 requests/sec

#### Solution:

**1. URL Generation:**

```go
// Base62 encoding for short URLs
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func encodeBase62(num uint64) string {
    if num == 0 {
        return string(alphabet[0])
    }

    result := []byte{}
    base := uint64(len(alphabet))

    for num > 0 {
        result = append([]byte{alphabet[num%base]}, result...)
        num /= base
    }

    return string(result)
}

func generateShortURL(id uint64) string {
    return encodeBase62(id) // e.g., "aBc12"
}
```

**2. Database Schema:**

```sql
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    click_count INT DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_user_id ON urls(user_id);

CREATE TABLE clicks (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) REFERENCES urls(short_code),
    clicked_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(2)
);
```

**3. API Design:**

```go
type URLService struct {
    db    *sql.DB
    cache *redis.Client
}

// Create short URL
func (s *URLService) CreateShortURL(ctx context.Context, originalURL string) (string, error) {
    var id int64
    err := s.db.QueryRowContext(ctx, `
        INSERT INTO urls (original_url, short_code)
        VALUES ($1, $2)
        RETURNING id
    `, originalURL, "").Scan(&id)

    if err != nil {
        return "", err
    }

    shortCode := generateShortURL(uint64(id))

    // Update with generated short code
    _, err = s.db.ExecContext(ctx, `
        UPDATE urls SET short_code = $1 WHERE id = $2
    `, shortCode, id)

    if err != nil {
        return "", err
    }

    // Cache it
    s.cache.Set(ctx, shortCode, originalURL, 24*time.Hour)

    return shortCode, nil
}

// Redirect
func (s *URLService) GetOriginalURL(ctx context.Context, shortCode string) (string, error) {
    // Check cache first
    if url, err := s.cache.Get(ctx, shortCode).Result(); err == nil {
        go s.incrementClickCount(shortCode) // Async
        return url, nil
    }

    // Database lookup
    var originalURL string
    err := s.db.QueryRowContext(ctx, `
        SELECT original_url FROM urls
        WHERE short_code = $1 AND (expires_at IS NULL OR expires_at > NOW())
    `, shortCode).Scan(&originalURL)

    if err != nil {
        return "", err
    }

    // Update cache
    s.cache.Set(ctx, shortCode, originalURL, 24*time.Hour)

    // Increment click count asynchronously
    go s.incrementClickCount(shortCode)

    return originalURL, nil
}
```

**4. Scalability:**

- **Read-heavy:** Use Redis cache extensively
- **Write-heavy:** Use write-ahead log, batch inserts
- **High availability:** Multi-region deployment
- **Database sharding:** Shard by short_code hash

---

### 3. Design a Chat System

**Requirements:**

- One-on-one and group chats
- Real-time messaging
- Message history
- Online status
- Read receipts
- File sharing
- Support 1M concurrent connections

#### Solution:

**1. Architecture:**

```
┌──────────┐         ┌──────────┐
│ Client A │◄───────►│ Client B │
└─────┬────┘         └─────┬────┘
      │                    │
      │    WebSocket       │
      └────────┬───────────┘
               │
        ┌──────▼──────┐
        │ API Gateway │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ Chat Service│
        │ (Go servers)│
        └──────┬──────┘
               │
        ┌──────▼──────────┐
        │  Message Queue  │
        │  (Kafka/NATS)   │
        └──────┬──────────┘
               │
        ┌──────┴──────┐
        │             │
  ┌─────▼─────┐  ┌────▼─────┐
  │ PostgreSQL│  │  Redis   │
  │ (History) │  │ (Online) │
  └───────────┘  └──────────┘
```

**2. WebSocket Handler:**

```go
type ChatServer struct {
    clients    map[string]*Client
    register   chan *Client
    unregister chan *Client
    broadcast  chan *Message
    mu         sync.RWMutex
}

type Client struct {
    ID     string
    UserID string
    conn   *websocket.Conn
    send   chan []byte
}

type Message struct {
    ID          string    `json:"id"`
    FromUserID  string    `json:"from_user_id"`
    ToUserID    string    `json:"to_user_id,omitempty"`
    RoomID      string    `json:"room_id,omitempty"`
    Content     string    `json:"content"`
    Timestamp   time.Time `json:"timestamp"`
    MessageType string    `json:"type"` // text, file, image
}

func (s *ChatServer) HandleConnection(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }

    userID := r.URL.Query().Get("user_id")
    client := &Client{
        ID:     uuid.New().String(),
        UserID: userID,
        conn:   conn,
        send:   make(chan []byte, 256),
    }

    s.register <- client

    go client.readPump(s)
    go client.writePump()
}

func (c *Client) readPump(server *ChatServer) {
    defer func() {
        server.unregister <- c
        c.conn.Close()
    }()

    for {
        _, message, err := c.conn.ReadMessage()
        if err != nil {
            break
        }

        var msg Message
        json.Unmarshal(message, &msg)

        // Publish to message queue
        server.publishMessage(&msg)
    }
}
```

**3. Message Storage:**

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    from_user_id UUID NOT NULL,
    to_user_id UUID,
    room_id UUID,
    content TEXT NOT NULL,
    message_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_messages_to_user ON messages(to_user_id, created_at);
CREATE INDEX idx_messages_room ON messages(room_id, created_at);
```

**4. Presence Management:**

```go
// Redis for online status
func (s *ChatServer) SetUserOnline(userID string) {
    ctx := context.Background()
    s.redis.Set(ctx, fmt.Sprintf("user:online:%s", userID), "1", 5*time.Minute)
    s.redis.Publish(ctx, "presence", fmt.Sprintf("online:%s", userID))
}

func (s *ChatServer) IsUserOnline(userID string) bool {
    ctx := context.Background()
    val, _ := s.redis.Get(ctx, fmt.Sprintf("user:online:%s", userID)).Result()
    return val == "1"
}
```

---

## Key Points to Remember

### Performance Optimization:

1. **Caching:** Use Redis for frequently accessed data
2. **Database indexing:** Proper indexes on query columns
3. **Connection pooling:** Reuse database connections
4. **Lazy loading:** Load data on demand
5. **CDN:** For static assets

### Scalability:

1. **Horizontal scaling:** Add more servers
2. **Load balancing:** Distribute traffic
3. **Database sharding:** Partition data
4. **Message queues:** Async processing
5. **Microservices:** Independent scaling

### Reliability:

1. **Health checks:** Monitor service health
2. **Graceful degradation:** Fallback strategies
3. **Circuit breakers:** Prevent cascade failures
4. **Retries with exponential backoff**
5. **Monitoring & alerting:** Prometheus, Grafana

### Security:

1. **Authentication:** JWT tokens
2. **Authorization:** RBAC
3. **Rate limiting:** Prevent abuse
4. **Input validation:** Prevent injection
5. **HTTPS:** Encrypt traffic
6. **API keys & secrets management**

---

## Questions to Ask Interviewer

1. What's your current system architecture?
2. How do you handle peak loads?
3. What monitoring tools do you use?
4. How is data partitioned/sharded?
5. What's your deployment process?
6. How do you handle database migrations?
7. What's your testing strategy?
8. How do you manage microservices communication?

