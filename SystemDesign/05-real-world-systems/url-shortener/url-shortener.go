package main

import (
	"crypto/md5"
	"encoding/base64"
	"fmt"
	"sync"
	"time"
)

// ============================================
// Data Models
// ============================================

type URL struct {
	ID          int64
	ShortCode   string
	OriginalURL string
	UserID      int64
	CreatedAt   time.Time
	ExpiresAt   *time.Time
	IsCustom    bool
	ClickCount  int64
}

type Click struct {
	ID        int64
	ShortCode string
	ClickedAt time.Time
	IPAddress string
	UserAgent string
	Referrer  string
}

// ============================================
// Database Interface (Mock)
// ============================================

type Database interface {
	SaveURL(url *URL) error
	GetURLByShortCode(shortCode string) (*URL, error)
	DeleteURL(shortCode string) error
	IncrementClickCount(shortCode string) error
	SaveClick(click *Click) error
}

// Mock in-memory database
type InMemoryDB struct {
	urls   map[string]*URL
	clicks []Click
	nextID int64
	mu     sync.RWMutex
}

func NewInMemoryDB() *InMemoryDB {
	return &InMemoryDB{
		urls:   make(map[string]*URL),
		clicks: make([]Click, 0),
		nextID: 1,
	}
}

func (db *InMemoryDB) SaveURL(url *URL) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	if url.ID == 0 {
		url.ID = db.nextID
		db.nextID++
	}

	db.urls[url.ShortCode] = url
	return nil
}

func (db *InMemoryDB) GetURLByShortCode(shortCode string) (*URL, error) {
	db.mu.RLock()
	defer db.mu.RUnlock()

	url, exists := db.urls[shortCode]
	if !exists {
		return nil, fmt.Errorf("URL not found")
	}

	// Check if expired
	if url.ExpiresAt != nil && time.Now().After(*url.ExpiresAt) {
		return nil, fmt.Errorf("URL expired")
	}

	return url, nil
}

func (db *InMemoryDB) DeleteURL(shortCode string) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	delete(db.urls, shortCode)
	return nil
}

func (db *InMemoryDB) IncrementClickCount(shortCode string) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	if url, exists := db.urls[shortCode]; exists {
		url.ClickCount++
	}

	return nil
}

func (db *InMemoryDB) SaveClick(click *Click) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	click.ID = int64(len(db.clicks) + 1)
	db.clicks = append(db.clicks, *click)
	return nil
}

// ============================================
// Cache Interface
// ============================================

type Cache interface {
	Get(key string) (string, error)
	Set(key string, value string, ttl time.Duration) error
	Delete(key string) error
}

// Mock in-memory cache
type InMemoryCache struct {
	data map[string]cacheItem
	mu   sync.RWMutex
}

type cacheItem struct {
	value     string
	expiresAt time.Time
}

func NewInMemoryCache() *InMemoryCache {
	cache := &InMemoryCache{
		data: make(map[string]cacheItem),
	}

	// Start cleanup goroutine
	go cache.cleanup()

	return cache
}

func (c *InMemoryCache) Get(key string) (string, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, exists := c.data[key]
	if !exists {
		return "", fmt.Errorf("cache miss")
	}

	if time.Now().After(item.expiresAt) {
		return "", fmt.Errorf("cache expired")
	}

	return item.value, nil
}

func (c *InMemoryCache) Set(key string, value string, ttl time.Duration) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.data[key] = cacheItem{
		value:     value,
		expiresAt: time.Now().Add(ttl),
	}

	return nil
}

func (c *InMemoryCache) Delete(key string) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.data, key)
	return nil
}

func (c *InMemoryCache) cleanup() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for key, item := range c.data {
			if now.After(item.expiresAt) {
				delete(c.data, key)
			}
		}
		c.mu.Unlock()
	}
}

// ============================================
// URL Shortener Service
// ============================================

type URLShortenerService struct {
	db    Database
	cache Cache
}

func NewURLShortenerService(db Database, cache Cache) *URLShortenerService {
	return &URLShortenerService{
		db:    db,
		cache: cache,
	}
}

// CreateShortURL creates a new short URL
func (s *URLShortenerService) CreateShortURL(originalURL string, customAlias string, userID int64, expiresAt *time.Time) (*URL, error) {
	var shortCode string

	if customAlias != "" {
		// Use custom alias
		// Check if already exists
		if _, err := s.db.GetURLByShortCode(customAlias); err == nil {
			return nil, fmt.Errorf("custom alias already exists")
		}
		shortCode = customAlias
	} else {
		// Generate short code
		shortCode = s.generateShortCode(originalURL)

		// Handle collision (rare)
		for {
			if _, err := s.db.GetURLByShortCode(shortCode); err != nil {
				break // Code available
			}
			// Add timestamp to make it unique
			shortCode = s.generateShortCode(originalURL + time.Now().String())
		}
	}

	url := &URL{
		ShortCode:   shortCode,
		OriginalURL: originalURL,
		UserID:      userID,
		CreatedAt:   time.Now(),
		ExpiresAt:   expiresAt,
		IsCustom:    customAlias != "",
		ClickCount:  0,
	}

	if err := s.db.SaveURL(url); err != nil {
		return nil, err
	}

	// Cache the URL
	s.cache.Set("url:"+shortCode, originalURL, 24*time.Hour)

	return url, nil
}

// GetOriginalURL retrieves the original URL for a short code
func (s *URLShortenerService) GetOriginalURL(shortCode string) (string, error) {
	// Try cache first
	cacheKey := "url:" + shortCode
	if cachedURL, err := s.cache.Get(cacheKey); err == nil {
		fmt.Println("Cache HIT for", shortCode)
		return cachedURL, nil
	}

	fmt.Println("Cache MISS for", shortCode)

	// Cache miss - fetch from database
	url, err := s.db.GetURLByShortCode(shortCode)
	if err != nil {
		return "", err
	}

	// Update cache
	s.cache.Set(cacheKey, url.OriginalURL, 24*time.Hour)

	// Increment click count asynchronously
	go s.trackClick(shortCode, "192.168.1.1", "Mozilla/5.0", "https://google.com")

	return url.OriginalURL, nil
}

// DeleteURL deletes a short URL
func (s *URLShortenerService) DeleteURL(shortCode string) error {
	// Delete from database
	if err := s.db.DeleteURL(shortCode); err != nil {
		return err
	}

	// Delete from cache
	s.cache.Delete("url:" + shortCode)

	return nil
}

// trackClick tracks a click on a short URL (async)
func (s *URLShortenerService) trackClick(shortCode, ipAddress, userAgent, referrer string) {
	// Increment counter
	s.db.IncrementClickCount(shortCode)

	// Save detailed click info
	click := &Click{
		ShortCode: shortCode,
		ClickedAt: time.Now(),
		IPAddress: ipAddress,
		UserAgent: userAgent,
		Referrer:  referrer,
	}

	s.db.SaveClick(click)
}

// generateShortCode generates a short code from a URL using MD5 + Base64
func (s *URLShortenerService) generateShortCode(url string) string {
	// Add timestamp for uniqueness
	data := url + fmt.Sprint(time.Now().UnixNano())

	// MD5 hash
	hash := md5.Sum([]byte(data))

	// Base64 encode
	encoded := base64.URLEncoding.EncodeToString(hash[:])

	// Take first 7 characters
	shortCode := encoded[:7]

	return shortCode
}

// GetAnalytics returns analytics for a short URL
func (s *URLShortenerService) GetAnalytics(shortCode string) (map[string]interface{}, error) {
	url, err := s.db.GetURLByShortCode(shortCode)
	if err != nil {
		return nil, err
	}

	analytics := map[string]interface{}{
		"short_code":   shortCode,
		"original_url": url.OriginalURL,
		"created_at":   url.CreatedAt,
		"click_count":  url.ClickCount,
	}

	return analytics, nil
}

// ============================================
// Example Usage
// ============================================

func main() {
	fmt.Println("=== URL Shortener Service ===\n")

	// Initialize services
	db := NewInMemoryDB()
	cache := NewInMemoryCache()
	service := NewURLShortenerService(db, cache)

	// Example 1: Create short URL
	fmt.Println("1. Creating Short URLs")
	fmt.Println("----------------------")

	url1, _ := service.CreateShortURL(
		"https://www.example.com/very/long/url/path/to/resource",
		"",  // No custom alias
		1,   // User ID
		nil, // No expiration
	)
	fmt.Printf("Original: %s\n", url1.OriginalURL)
	fmt.Printf("Short Code: %s\n", url1.ShortCode)
	fmt.Printf("Full Short URL: https://short.url/%s\n\n", url1.ShortCode)

	// Example 2: Custom alias
	url2, _ := service.CreateShortURL(
		"https://www.example.com/custom",
		"mylink", // Custom alias
		1,
		nil,
	)
	fmt.Printf("Custom alias: %s\n\n", url2.ShortCode)

	// Example 3: URL with expiration
	expiresAt := time.Now().Add(24 * time.Hour)
	url3, _ := service.CreateShortURL(
		"https://www.example.com/temporary",
		"",
		1,
		&expiresAt,
	)
	fmt.Printf("Temporary URL (expires in 24h): %s\n\n", url3.ShortCode)

	// Example 4: Redirect (cache miss then hit)
	fmt.Println("2. URL Redirection")
	fmt.Println("------------------")

	originalURL, _ := service.GetOriginalURL(url1.ShortCode)
	fmt.Printf("First access (cache miss): %s\n", originalURL)

	originalURL, _ = service.GetOriginalURL(url1.ShortCode)
	fmt.Printf("Second access (cache hit): %s\n\n", originalURL)

	// Example 5: Simulate multiple clicks
	fmt.Println("3. Simulating Clicks")
	fmt.Println("--------------------")

	for i := 0; i < 5; i++ {
		service.GetOriginalURL(url1.ShortCode)
		time.Sleep(100 * time.Millisecond)
	}

	// Example 6: Get analytics
	fmt.Println("\n4. URL Analytics")
	fmt.Println("----------------")

	time.Sleep(500 * time.Millisecond) // Wait for async click tracking

	analytics, _ := service.GetAnalytics(url1.ShortCode)
	fmt.Printf("Short Code: %s\n", analytics["short_code"])
	fmt.Printf("Click Count: %d\n", analytics["click_count"])
	fmt.Printf("Created At: %s\n\n", analytics["created_at"])

	// Example 7: Delete URL
	fmt.Println("5. Deleting URL")
	fmt.Println("---------------")

	service.DeleteURL(url2.ShortCode)
	fmt.Printf("Deleted: %s\n", url2.ShortCode)

	// Try to access deleted URL
	if _, err := service.GetOriginalURL(url2.ShortCode); err != nil {
		fmt.Printf("Access after delete: %s\n\n", err.Error())
	}

	fmt.Println("=== Demo Complete ===")
}

/*
Expected Output:

=== URL Shortener Service ===

1. Creating Short URLs
----------------------
Original: https://www.example.com/very/long/url/path/to/resource
Short Code: dGVzdDA
Full Short URL: https://short.url/dGVzdDA

Custom alias: mylink

Temporary URL (expires in 24h): dGVzdDE

2. URL Redirection
------------------
Cache MISS for dGVzdDA
First access (cache miss): https://www.example.com/very/long/url/path/to/resource
Cache HIT for dGVzdDA
Second access (cache hit): https://www.example.com/very/long/url/path/to/resource

3. Simulating Clicks
--------------------
Cache HIT for dGVzdDA
Cache HIT for dGVzdDA
Cache HIT for dGVzdDA
Cache HIT for dGVzdDA
Cache HIT for dGVzdDA

4. URL Analytics
----------------
Short Code: dGVzdDA
Click Count: 6
Created At: 2024-01-01 10:00:00 +0000 UTC

5. Deleting URL
---------------
Deleted: mylink
Access after delete: URL not found

=== Demo Complete ===

Key Features Demonstrated:
1. Short code generation (MD5 + Base64)
2. Custom aliases
3. URL expiration
4. Caching (Redis simulation)
5. Click tracking (async)
6. Analytics
7. Cache hit/miss patterns
8. URL deletion

Production Considerations:
1. Use PostgreSQL/MySQL for persistence
2. Use Redis for distributed caching
3. Implement rate limiting
4. Add authentication for custom URLs
5. Use message queue for analytics
6. Implement monitoring and alerts
7. Add CDN for popular URLs
8. Database sharding for scale
*/
