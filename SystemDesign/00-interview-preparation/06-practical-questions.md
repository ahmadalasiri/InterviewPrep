# Practical System Design Questions

## Real-World System Design Scenarios

### 1. Design a URL Shortener (like bit.ly)

**Requirements:**

- Functional:

  - Shorten long URLs to short URLs
  - Redirect short URL to original URL
  - Custom short URLs (optional)
  - URL expiration (optional)
  - Analytics (click tracking)

- Non-Functional:
  - High availability (99.9%)
  - Low latency (< 100ms)
  - 100M URLs generated per month
  - 10:1 read to write ratio

**Capacity Estimation:**

```
URLs per month: 100M
URLs per second: 100M / (30 * 86400) ≈ 38 writes/second
Reads per second: 38 * 10 = 380 reads/second

Storage:
Average URL size: 500 bytes
100M * 500 bytes * 12 months * 10 years = 6 TB

Cache (20% of reads):
20% * 100M URLs * 10 years * 500 bytes ≈ 1 TB
```

**API Design:**

```
POST /api/shorten
Request: { "url": "https://very-long-url.com/..." }
Response: { "short_url": "https://short.url/abc123" }

GET /{shortCode}
Response: 302 Redirect to original URL
```

**Database Schema:**

```sql
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    click_count INT DEFAULT 0,
    INDEX idx_short_code (short_code),
    INDEX idx_user_id (user_id)
);

CREATE TABLE clicks (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL,
    clicked_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    INDEX idx_short_code_time (short_code, clicked_at)
);
```

**High-Level Design:**

```
Client ──► Load Balancer ──► Web Servers ──► Cache (Redis) ──► Database (Primary)
                                              │                       │
                                              └──► If not cached ────┘
                                                                      │
                                                                 Read Replicas
```

**Short Code Generation:**

**Approach 1: Base62 Encoding**

```go
const base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func encodeBase62(num int64) string {
    if num == 0 {
        return string(base62[0])
    }

    result := ""
    for num > 0 {
        remainder := num % 62
        result = string(base62[remainder]) + result
        num = num / 62
    }
    return result
}

func generateShortCode(id int64) string {
    return encodeBase62(id)
}

// ID 1 -> "1"
// ID 62 -> "10"
// ID 3844 -> "100"
```

**Approach 2: Random Generation with Collision Check**

```go
func generateShortCode() string {
    const length = 7
    code := make([]byte, length)

    for i := 0; i < length; i++ {
        code[i] = base62[rand.Intn(62)]
    }

    shortCode := string(code)

    // Check if exists
    if db.Exists(shortCode) {
        return generateShortCode() // Retry
    }

    return shortCode
}
```

**Caching Strategy:**

```go
func redirectToOriginalURL(shortCode string) (string, error) {
    // Try cache first
    if url, err := cache.Get("url:" + shortCode); err == nil {
        return url, nil
    }

    // Cache miss - fetch from database
    url, err := db.GetURL(shortCode)
    if err != nil {
        return "", err
    }

    // Store in cache (24 hour TTL)
    cache.Set("url:"+shortCode, url, 24*time.Hour)

    return url, nil
}
```

**Analytics (Async):**

```go
func redirectHandler(shortCode string) {
    // Get URL (from cache or DB)
    url := getOriginalURL(shortCode)

    // Async click tracking (non-blocking)
    go trackClick(shortCode, request)

    // Redirect immediately
    redirect(url)
}

func trackClick(shortCode string, req *http.Request) {
    // Send to message queue
    queue.Send("click-events", ClickEvent{
        ShortCode: shortCode,
        Timestamp: time.Now(),
        IPAddress: req.RemoteAddr,
        UserAgent: req.UserAgent(),
        Referrer:  req.Referer(),
    })
}
```

**Scalability:**

- Use consistent hashing for cache distribution
- Shard database by short_code hash
- Use CDN for popular URLs
- Implement rate limiting per user

### 2. Design Twitter

**Requirements:**

- Functional:

  - Post tweets (280 characters)
  - Follow users
  - Timeline (home feed, user feed)
  - Like, retweet, reply
  - Trending topics
  - Search

- Non-Functional:
  - 200M daily active users
  - 100M tweets per day
  - Timeline latency < 200ms
  - High availability

**Capacity Estimation:**

```
DAU: 200M
Tweets per day: 100M
Reads per day: 200M * 20 = 4B (each user views 20 tweets)

QPS:
Write: 100M / 86400 ≈ 1,200 tweets/second
Read: 4B / 86400 ≈ 46,000 reads/second

Storage:
Tweet size: ~300 bytes (including metadata)
100M * 300 bytes * 365 days * 5 years ≈ 55 TB

Cache:
Cache 20% of active users' timelines
200M * 0.2 * 100 tweets * 300 bytes ≈ 1.2 TB
```

**Database Schema:**

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    INDEX idx_username (username)
);

CREATE TABLE tweets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content VARCHAR(280) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    like_count INT DEFAULT 0,
    retweet_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_created (created_at)
);

CREATE TABLE follows (
    follower_id BIGINT NOT NULL,
    followee_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, followee_id),
    INDEX idx_follower (follower_id),
    INDEX idx_followee (followee_id)
);

CREATE TABLE timeline_cache (
    user_id BIGINT NOT NULL,
    tweet_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, created_at, tweet_id)
);
```

**API Design:**

```
POST /api/tweets
GET /api/tweets/:id
GET /api/users/:id/tweets
GET /api/timeline/home
GET /api/timeline/user/:id

POST /api/users/:id/follow
DELETE /api/users/:id/unfollow

POST /api/tweets/:id/like
POST /api/tweets/:id/retweet
```

**High-Level Architecture:**

```
                    CDN (Media)
                        │
Client ──► Load Balancer ──┬──► Web Servers ──► App Servers
                           │                         │
                           │                    ┌────┴────┐
                           │                    │         │
                           └──► API Gateway ────┤    Services
                                                │         │
                                                └─────────┘
                                                     │
                                    ┌────────────────┼────────────────┐
                                    │                │                │
                              Tweet Service    Timeline Service   User Service
                                    │                │                │
                                    ├──► DB          ├──► Redis       ├──► DB
                                    ├──► Redis       └──► Kafka       └──► Redis
                                    └──► Kafka
```

**Timeline Generation (Fan-out Approaches):**

**1. Fan-out on Write (Pre-compute)**

```go
// When user posts tweet
func postTweet(userId int64, content string) error {
    // Save tweet
    tweet := db.CreateTweet(userId, content)

    // Get all followers
    followers := db.GetFollowers(userId)

    // Fan-out: Add to each follower's timeline
    for _, follower := range followers {
        cache.ZAdd("timeline:"+follower.ID, tweet.ID, tweet.CreatedAt)
    }

    return nil
}

// Reading timeline is fast
func getTimeline(userId int64) []Tweet {
    // Already pre-computed in cache
    tweetIds := cache.ZRevRange("timeline:"+userId, 0, 100)
    return db.GetTweets(tweetIds)
}
```

**Pros:** Fast reads
**Cons:** Slow writes (for users with millions of followers)

**2. Fan-out on Read (Compute on demand)**

```go
func getTimeline(userId int64) []Tweet {
    // Get users I follow
    following := db.GetFollowing(userId)

    // Fetch recent tweets from each
    var allTweets []Tweet
    for _, user := range following {
        tweets := db.GetRecentTweets(user.ID, 100)
        allTweets = append(allTweets, tweets...)
    }

    // Merge and sort
    sort.Slice(allTweets, func(i, j int) bool {
        return allTweets[i].CreatedAt.After(allTweets[j].CreatedAt)
    })

    return allTweets[:100]
}
```

**Pros:** Fast writes
**Cons:** Slow reads

**3. Hybrid Approach (Best)**

```go
func postTweet(userId int64, content string) error {
    tweet := db.CreateTweet(userId, content)

    followerCount := db.GetFollowerCount(userId)

    if followerCount > 1000000 {
        // Celebrity: Don't fan-out, compute on read
        cache.Set("celebrity:"+userId, true)
    } else {
        // Regular user: Fan-out to followers
        followers := db.GetFollowers(userId)
        for _, follower := range followers {
            cache.ZAdd("timeline:"+follower.ID, tweet.ID, tweet.CreatedAt)
        }
    }

    return nil
}

func getTimeline(userId int64) []Tweet {
    // Get pre-computed timeline
    timelineTweets := cache.ZRevRange("timeline:"+userId, 0, 100)

    // Add tweets from celebrities I follow
    celebrities := db.GetFollowedCelebrities(userId)
    for _, celeb := range celebrities {
        celebrityTweets := db.GetRecentTweets(celeb.ID, 10)
        timelineTweets = append(timelineTweets, celebrityTweets...)
    }

    // Merge and sort
    sort.Slice(timelineTweets, func(i, j int) bool {
        return timelineTweets[i].CreatedAt.After(timelineTweets[j].CreatedAt)
    })

    return timelineTweets[:100]
}
```

### 3. Design Instagram

**Requirements:**

- Functional:

  - Upload photos/videos
  - Follow users
  - News feed
  - Like, comment
  - Direct messaging
  - Stories (24-hour content)

- Non-Functional:
  - 500M daily active users
  - 100M photos uploaded daily
  - Average photo size: 2MB
  - Read heavy (100:1 read to write)

**Capacity Estimation:**

```
DAU: 500M
Photos per day: 100M
Average size: 2MB

Storage per day: 100M * 2MB = 200TB/day
Storage per year: 200TB * 365 = 73PB/year

Bandwidth:
Upload: 100M * 2MB / 86400 ≈ 2.3 GB/second
Download: 2.3 GB * 100 = 230 GB/second (read heavy)
```

**Architecture:**

```
Client ──► CDN ──► Load Balancer ──┬──► Web Servers
                                    │
                                    └──► App Servers
                                              │
                        ┌─────────────────────┼─────────────────────┐
                        │                     │                     │
                   Upload Service        Feed Service         User Service
                        │                     │                     │
                   Object Storage         Redis Cache            Database
                   (S3, GCS)              + Database             (PostgreSQL)
```

**Photo Upload Flow:**

```typescript
class PhotoUploadService {
  async uploadPhoto(userId: string, photoFile: File) {
    // 1. Generate unique ID
    const photoId = generateUUID();

    // 2. Upload to object storage
    const url = await objectStorage.upload(photoFile, photoId);

    // 3. Generate thumbnails (async)
    queue.send("generate-thumbnails", {
      photoId,
      originalUrl: url,
    });

    // 4. Save metadata to database
    await db.createPhoto({
      id: photoId,
      userId,
      url,
      createdAt: new Date(),
    });

    // 5. Fan-out to followers' feeds
    const followers = await db.getFollowers(userId);
    for (const follower of followers) {
      await cache.addToFeed(follower.id, photoId);
    }

    return { photoId, url };
  }
}
```

**Image Processing:**

```go
func processThumbnails(photoId string, originalUrl string) error {
    // Download original
    image := downloadImage(originalUrl)

    // Generate multiple sizes
    sizes := []Size{
        {Width: 150, Height: 150, Name: "thumbnail"},
        {Width: 640, Height: 640, Name: "medium"},
        {Width: 1080, Height: 1080, Name: "large"},
    }

    for _, size := range sizes {
        resized := resizeImage(image, size.Width, size.Height)

        // Upload to object storage
        url := uploadToStorage(resized, photoId, size.Name)

        // Update database
        db.UpdatePhotoThumbnail(photoId, size.Name, url)
    }

    return nil
}
```

**Feed Generation (Similar to Twitter):**

```typescript
class FeedService {
  async getUserFeed(userId: string, page: number = 0) {
    const cacheKey = `feed:${userId}:${page}`;

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get from database
    const photoIds = await db.getFeedPhotos(userId, page * 20, 20);
    const photos = await db.getPhotos(photoIds);

    // Cache result
    await cache.set(cacheKey, photos, 5 * 60); // 5 min TTL

    return photos;
  }
}
```

### 4. Design Netflix (Video Streaming)

**Requirements:**

- Functional:

  - Upload videos
  - Stream videos
  - Search content
  - Recommendations
  - Watch history
  - Multiple quality levels (adaptive bitrate)

- Non-Functional:
  - 200M subscribers
  - 100M concurrent streams at peak
  - Low latency streaming
  - High availability (99.99%)

**Capacity Estimation:**

```
Concurrent streams: 100M
Average video bitrate: 5 Mbps
Bandwidth: 100M * 5 Mbps = 500 Tbps

Storage:
Average movie: 50 GB (multiple qualities)
10,000 movies * 50 GB = 500 TB (just movies)
With all content + replication: ~100 PB
```

**Architecture:**

```
Client ──► CDN (Edge Caching) ──► Origin Servers ──► Object Storage
                                                        (Videos)

       ──► API Gateway ──┬──► Video Service
                         ├──► User Service
                         ├──► Recommendation Service
                         └──► Analytics Service
```

**Video Processing Pipeline:**

```go
type VideoProcessor struct {
    transcoder Transcoder
    storage    Storage
}

func (vp *VideoProcessor) ProcessVideo(videoId string) error {
    // 1. Download original video
    originalVideo := vp.storage.Download(videoId)

    // 2. Transcode to multiple qualities
    qualities := []Quality{
        {Resolution: "360p", Bitrate: "1Mbps"},
        {Resolution: "480p", Bitrate: "2Mbps"},
        {Resolution: "720p", Bitrate: "5Mbps"},
        {Resolution: "1080p", Bitrate: "8Mbps"},
        {Resolution: "4K", Bitrate: "25Mbps"},
    }

    for _, quality := range qualities {
        // Transcode
        transcoded := vp.transcoder.Transcode(originalVideo, quality)

        // Generate HLS segments (for adaptive streaming)
        segments := vp.generateHLSSegments(transcoded)

        // Upload to storage
        for _, segment := range segments {
            vp.storage.Upload(segment, videoId, quality.Resolution)
        }

        // Generate manifest file
        manifest := vp.generateManifest(segments, quality)
        vp.storage.Upload(manifest, videoId, "manifest")
    }

    return nil
}
```

**Adaptive Bitrate Streaming (HLS):**

```
Master Playlist (video123.m3u8):
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=640x360
360p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=8000000,RESOLUTION=1920x1080
1080p/playlist.m3u8

Each quality playlist (720p/playlist.m3u8):
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXTINF:10.0
segment-0001.ts
#EXTINF:10.0
segment-0002.ts
...
```

**CDN Strategy:**

```typescript
class CDNManager {
    async getVideoURL(videoId: string, quality: string) {
        // Determine user's location
        const userLocation = await this.getUserLocation();

        // Get nearest CDN edge server
        const cdnEdge = this.getNearestCDN(userLocation);

        // Generate signed URL (with expiration)
        const signedURL = this.generateSignedURL(
            cdnEdge,
            videoId,
            quality,
            expiresIn: 3600 // 1 hour
        );

        return signedURL;
    }

    private generateSignedURL(cdn: string, videoId: string, quality: string, expiresIn: number): string {
        const expires = Date.now() + expiresIn * 1000;
        const signature = this.createSignature(videoId, expires);

        return `https://${cdn}/videos/${videoId}/${quality}/playlist.m3u8?expires=${expires}&signature=${signature}`;
    }
}
```

**Recommendations (ML Service):**

```python
class RecommendationService:
    def get_recommendations(self, user_id: str, count: int = 20):
        # Get user's watch history
        history = db.get_watch_history(user_id)

        # Get user's ratings
        ratings = db.get_ratings(user_id)

        # Collaborative filtering
        similar_users = self.find_similar_users(user_id)

        # Content-based filtering
        liked_genres = self.extract_genres(history)

        # Combine recommendations
        recommendations = self.ml_model.predict(
            user_id=user_id,
            watch_history=history,
            similar_users=similar_users,
            preferred_genres=liked_genres
        )

        return recommendations[:count]
```

---

## Common System Design Patterns

### Caching Strategy

```
1. Cache frequently accessed data
2. Use TTL for auto-expiration
3. Implement cache invalidation
4. Use cache-aside pattern
5. Monitor cache hit rate
```

### Database Sharding

```
1. Choose shard key carefully (even distribution)
2. Use consistent hashing
3. Plan for resharding
4. Handle cross-shard queries
```

### Rate Limiting

```
1. Implement at multiple levels (user, IP, global)
2. Use token bucket algorithm
3. Return 429 with Retry-After header
4. Have different limits for tiers
```

### Async Processing

```
1. Use message queues for heavy operations
2. Implement idempotency
3. Handle failures with retries
4. Use dead letter queues
```

---

**Practice these system designs to prepare for interviews!**

Remember:

1. Clarify requirements first
2. Estimate capacity
3. Define APIs
4. Draw high-level design
5. Deep dive into components
6. Discuss trade-offs
7. Address bottlenecks
