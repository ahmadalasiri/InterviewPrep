# URL Shortener - Complete System Design

A production-ready URL shortener service (like bit.ly, TinyURL) with complete implementation examples.

## Requirements

### Functional Requirements

1. Shorten long URLs to short URLs
2. Redirect short URLs to original URLs
3. Custom short URLs (optional)
4. URL expiration (optional)
5. Analytics (click tracking)
6. User accounts (optional)

### Non-Functional Requirements

1. High availability (99.9%)
2. Low latency (<100ms for redirects)
3. Scalable to millions of URLs
4. Read-heavy system (100:1 read to write ratio)

## Capacity Estimation

### Traffic Estimates

```
New URLs per month: 100 million
URLs per second (write): 100M / (30 * 86400) ≈ 40 writes/sec
Read:Write ratio: 100:1
Redirects per second (read): 40 * 100 = 4000 reads/sec

Peak traffic (3x average):
  - 120 writes/sec
  - 12,000 reads/sec
```

### Storage Estimates

```
Average URL size: 500 bytes (original URL + metadata)
Storage for 5 years: 100M * 12 months * 5 years * 500 bytes = 300 GB

With replication (3x): 900 GB ≈ 1 TB
```

### Bandwidth Estimates

```
Write: 40 URLs/sec * 500 bytes = 20 KB/sec
Read: 4000 URLs/sec * 500 bytes = 2 MB/sec
```

### Cache Estimates

```
Cache 20% of daily traffic (most popular URLs)
Daily requests: 4000 * 86400 = 345M requests
Cache size: 345M * 0.2 * 500 bytes = 35 GB
```

## API Design

### 1. Create Short URL

```http
POST /api/v1/urls
Content-Type: application/json

Request:
{
  "url": "https://www.example.com/very/long/url/path",
  "custom_alias": "mylink",  // optional
  "expires_at": "2024-12-31T23:59:59Z"  // optional
}

Response: 201 Created
{
  "short_url": "https://short.url/abc123",
  "original_url": "https://www.example.com/very/long/url/path",
  "created_at": "2024-01-01T10:00:00Z",
  "expires_at": "2024-12-31T23:59:59Z"
}
```

### 2. Get Original URL (Redirect)

```http
GET /abc123

Response: 302 Found
Location: https://www.example.com/very/long/url/path
```

### 3. Get URL Analytics

```http
GET /api/v1/urls/abc123/analytics

Response: 200 OK
{
  "short_code": "abc123",
  "clicks": 1543,
  "created_at": "2024-01-01T10:00:00Z",
  "click_by_date": [
    {"date": "2024-01-01", "clicks": 100},
    {"date": "2024-01-02", "clicks": 150}
  ],
  "top_referrers": [
    {"referrer": "google.com", "clicks": 500},
    {"referrer": "facebook.com", "clicks": 300}
  ]
}
```

### 4. Delete Short URL

```http
DELETE /api/v1/urls/abc123

Response: 204 No Content
```

## Database Schema

### SQL Schema (PostgreSQL)

```sql
-- URLs table
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_custom BOOLEAN DEFAULT FALSE,

    INDEX idx_short_code (short_code),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Analytics table (for click tracking)
CREATE TABLE clicks (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL,
    clicked_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),

    INDEX idx_short_code (short_code),
    INDEX idx_clicked_at (clicked_at)
);

-- Users table (optional)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### NoSQL Schema (MongoDB)

```javascript
// urls collection
{
  "_id": ObjectId("..."),
  "shortCode": "abc123",
  "originalUrl": "https://www.example.com/...",
  "userId": ObjectId("..."),
  "createdAt": ISODate("2024-01-01T10:00:00Z"),
  "expiresAt": ISODate("2024-12-31T23:59:59Z"),
  "isCustom": false,
  "clickCount": 1543
}

// clicks collection (for detailed analytics)
{
  "_id": ObjectId("..."),
  "shortCode": "abc123",
  "clickedAt": ISODate("2024-01-01T10:15:00Z"),
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com",
  "country": "US"
}
```

## High-Level Architecture

```
                            CDN (for static assets)
                                    │
                                    │
┌─────────┐              ┌──────────▼──────────┐
│ Client  │─────────────►│   Load Balancer     │
└─────────┘              └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐   ┌─────▼─────┐  ┌─────▼─────┐
              │ Web Server│   │ Web Server│  │ Web Server│
              └─────┬─────┘   └─────┬─────┘  └─────┬─────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐   ┌─────▼──────┐  ┌────▼─────┐
              │   Cache   │   │  Message   │  │ Database │
              │  (Redis)  │   │   Queue    │  │  Master  │
              └───────────┘   └─────┬──────┘  └────┬─────┘
                                    │               │
                              ┌─────▼─────┐    ┌────▼─────┐
                              │  Analytics│    │ Database │
                              │   Worker  │    │ Replicas │
                              └───────────┘    └──────────┘
```

## Short Code Generation

### Approach 1: Base62 Encoding with Auto-Increment ID

```
ID: 1 → Short Code: "1"
ID: 62 → Short Code: "10"
ID: 125 → Short Code: "21"

Base62 uses: 0-9, a-z, A-Z (62 characters)

7 characters = 62^7 = 3.5 trillion possible URLs
```

**Pros:**

- Simple implementation
- Predictable, short codes
- No collisions

**Cons:**

- Sequential (predictable)
- Requires centralized ID generation

### Approach 2: Random Generation with Collision Check

```
Generate random 7-character string
Check if exists in database
If exists, regenerate
```

**Pros:**

- Not predictable
- Distributed friendly

**Cons:**

- Collision possibility
- Extra database check

### Approach 3: MD5 Hash + Encoding (Recommended)

```
Hash = MD5(original_url + timestamp)
Take first 43 bits of hash
Encode to Base62
Result: 7-character short code
```

**Pros:**

- Same URL generates same code (cache friendly)
- Low collision probability
- Distributed friendly

**Cons:**

- Still need collision check

## Caching Strategy

### Cache Layer (Redis)

```
Key: "url:{short_code}"
Value: Original URL
TTL: 24 hours

Key: "stats:{short_code}"
Value: Click count
TTL: 1 hour
```

### Cache Flow

```
1. Redirect Request
   └─► Check Redis
       ├─► Cache Hit → Return URL (fast path)
       └─► Cache Miss
           └─► Query Database
               └─► Store in Redis
               └─► Return URL
```

### Cache Invalidation

- TTL-based (24 hours)
- Manual invalidation on URL update/delete
- LRU eviction policy

## Scaling Considerations

### Database Scaling

**Option 1: Read Replicas**

```
Master (writes) ──┬──► Replica 1 (reads)
                  ├──► Replica 2 (reads)
                  └──► Replica 3 (reads)
```

**Option 2: Sharding by Short Code**

```
Shard = hash(short_code) % num_shards

Shard 1: short_codes [0-2]
Shard 2: short_codes [3-5]
Shard 3: short_codes [6-9, a-z, A-Z]
```

### Application Scaling

- Stateless web servers
- Horizontal scaling with load balancer
- Session storage in Redis
- Rate limiting per user/IP

### CDN

- Cache 302 redirects for popular URLs
- Geographic distribution
- Reduce latency

## Analytics Implementation

### Real-time Analytics

```
1. User clicks short URL
2. Async send click event to message queue
3. Background worker processes event
4. Store in analytics database
5. Update cache counters
```

### Analytics Database

**Option 1: Same Database**

- Simple
- May impact performance

**Option 2: Separate Database**

- Better performance
- Can use specialized DB (ClickHouse, BigQuery)

### Batch Processing

```
Hourly batch job:
- Aggregate clicks by date, referrer, country
- Update summary tables
- Generate reports
```

## Security Considerations

1. **Rate Limiting**: Prevent abuse
2. **URL Validation**: Check for malicious URLs
3. **CAPTCHA**: For public API
4. **Authentication**: For custom URLs
5. **HTTPS**: Encrypt traffic
6. **Input Sanitization**: Prevent injection attacks

## Monitoring & Operations

### Key Metrics

- Request rate (reads/writes)
- Response latency (p50, p95, p99)
- Error rate
- Cache hit rate
- Database query time
- Queue length

### Alerts

- High error rate
- High latency
- Low cache hit rate
- Database connection issues
- High queue backlog

### Logging

- Access logs (for analytics)
- Error logs (for debugging)
- Audit logs (for compliance)

## Trade-offs

| Decision      | Option 1       | Option 2 | Chosen   | Why                                    |
| ------------- | -------------- | -------- | -------- | -------------------------------------- |
| ID Generation | Auto-increment | Random   | MD5 Hash | Balance of simplicity and distribution |
| Database      | SQL            | NoSQL    | SQL      | Need ACID for URL creation             |
| Caching       | Application    | Redis    | Redis    | Distributed caching                    |
| Analytics     | Real-time      | Batch    | Hybrid   | Balance accuracy and performance       |

## Implementation Files

- `url-shortener.go` - Go implementation
- `url-shortener.ts` - TypeScript implementation
- `docker-compose.yml` - Local development setup
- `kubernetes.yaml` - Production deployment

## Future Enhancements

1. **Custom domains**: Allow users to use their own domains
2. **QR codes**: Generate QR codes for short URLs
3. **Link bundling**: Group multiple links
4. **A/B testing**: Split traffic between URLs
5. **API keys**: For programmatic access
6. **Webhooks**: Notify on URL events
7. **Link preview**: Show preview before redirect

---

See implementation files for complete working examples!
