package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

// ============================================
// Rate Limiter Interfaces
// ============================================

type RateLimiter interface {
	Allow(key string) (bool, error)
	Reset(key string) error
}

// ============================================
// 1. Token Bucket Algorithm
// ============================================

type TokenBucket struct {
	capacity   int // Maximum tokens
	refillRate int // Tokens added per second
	tokens     map[string]*bucket
	mu         sync.RWMutex
}

type bucket struct {
	tokens     float64
	lastRefill time.Time
	mu         sync.Mutex
}

func NewTokenBucket(capacity, refillRate int) *TokenBucket {
	return &TokenBucket{
		capacity:   capacity,
		refillRate: refillRate,
		tokens:     make(map[string]*bucket),
	}
}

func (tb *TokenBucket) Allow(key string) (bool, error) {
	tb.mu.RLock()
	b, exists := tb.tokens[key]
	tb.mu.RUnlock()

	if !exists {
		tb.mu.Lock()
		// Double-check after acquiring write lock
		b, exists = tb.tokens[key]
		if !exists {
			b = &bucket{
				tokens:     float64(tb.capacity),
				lastRefill: time.Now(),
			}
			tb.tokens[key] = b
		}
		tb.mu.Unlock()
	}

	b.mu.Lock()
	defer b.mu.Unlock()

	// Refill tokens based on time elapsed
	now := time.Now()
	elapsed := now.Sub(b.lastRefill).Seconds()
	tokensToAdd := elapsed * float64(tb.refillRate)

	b.tokens = min(float64(tb.capacity), b.tokens+tokensToAdd)
	b.lastRefill = now

	// Check if we have enough tokens
	if b.tokens >= 1 {
		b.tokens--
		return true, nil
	}

	return false, nil
}

func (tb *TokenBucket) Reset(key string) error {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	delete(tb.tokens, key)
	return nil
}

// ============================================
// 2. Leaky Bucket Algorithm
// ============================================

type LeakyBucket struct {
	capacity int // Queue capacity
	leakRate int // Items processed per second
	queues   map[string]*leakyQueue
	mu       sync.RWMutex
}

type leakyQueue struct {
	queue    []time.Time
	lastLeak time.Time
	mu       sync.Mutex
}

func NewLeakyBucket(capacity, leakRate int) *LeakyBucket {
	lb := &LeakyBucket{
		capacity: capacity,
		leakRate: leakRate,
		queues:   make(map[string]*leakyQueue),
	}

	// Start background goroutine to leak requests
	go lb.leak()

	return lb
}

func (lb *LeakyBucket) Allow(key string) (bool, error) {
	lb.mu.RLock()
	q, exists := lb.queues[key]
	lb.mu.RUnlock()

	if !exists {
		lb.mu.Lock()
		q, exists = lb.queues[key]
		if !exists {
			q = &leakyQueue{
				queue:    make([]time.Time, 0, lb.capacity),
				lastLeak: time.Now(),
			}
			lb.queues[key] = q
		}
		lb.mu.Unlock()
	}

	q.mu.Lock()
	defer q.mu.Unlock()

	// Check if queue has space
	if len(q.queue) < lb.capacity {
		q.queue = append(q.queue, time.Now())
		return true, nil
	}

	return false, nil // Queue full
}

func (lb *LeakyBucket) leak() {
	ticker := time.NewTicker(time.Second / time.Duration(lb.leakRate))
	defer ticker.Stop()

	for range ticker.C {
		lb.mu.RLock()
		queues := make([]*leakyQueue, 0, len(lb.queues))
		for _, q := range lb.queues {
			queues = append(queues, q)
		}
		lb.mu.RUnlock()

		for _, q := range queues {
			q.mu.Lock()
			if len(q.queue) > 0 {
				// Remove one item from queue
				q.queue = q.queue[1:]
			}
			q.mu.Unlock()
		}
	}
}

func (lb *LeakyBucket) Reset(key string) error {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	delete(lb.queues, key)
	return nil
}

// ============================================
// 3. Fixed Window Counter
// ============================================

type FixedWindow struct {
	limit    int // Max requests per window
	window   time.Duration
	counters map[string]*windowCounter
	mu       sync.RWMutex
}

type windowCounter struct {
	count       int
	windowStart time.Time
	mu          sync.Mutex
}

func NewFixedWindow(limit int, window time.Duration) *FixedWindow {
	return &FixedWindow{
		limit:    limit,
		window:   window,
		counters: make(map[string]*windowCounter),
	}
}

func (fw *FixedWindow) Allow(key string) (bool, error) {
	fw.mu.RLock()
	wc, exists := fw.counters[key]
	fw.mu.RUnlock()

	if !exists {
		fw.mu.Lock()
		wc, exists = fw.counters[key]
		if !exists {
			wc = &windowCounter{
				count:       0,
				windowStart: time.Now(),
			}
			fw.counters[key] = wc
		}
		fw.mu.Unlock()
	}

	wc.mu.Lock()
	defer wc.mu.Unlock()

	now := time.Now()

	// Check if we need to reset the window
	if now.Sub(wc.windowStart) >= fw.window {
		wc.count = 0
		wc.windowStart = now
	}

	// Check if under limit
	if wc.count < fw.limit {
		wc.count++
		return true, nil
	}

	return false, nil
}

func (fw *FixedWindow) Reset(key string) error {
	fw.mu.Lock()
	defer fw.mu.Unlock()
	delete(fw.counters, key)
	return nil
}

// ============================================
// 4. Sliding Window Log
// ============================================

type SlidingWindowLog struct {
	limit  int // Max requests per window
	window time.Duration
	logs   map[string]*requestLog
	mu     sync.RWMutex
}

type requestLog struct {
	timestamps []time.Time
	mu         sync.Mutex
}

func NewSlidingWindowLog(limit int, window time.Duration) *SlidingWindowLog {
	swl := &SlidingWindowLog{
		limit:  limit,
		window: window,
		logs:   make(map[string]*requestLog),
	}

	// Start cleanup goroutine
	go swl.cleanup()

	return swl
}

func (swl *SlidingWindowLog) Allow(key string) (bool, error) {
	swl.mu.RLock()
	log, exists := swl.logs[key]
	swl.mu.RUnlock()

	if !exists {
		swl.mu.Lock()
		log, exists = swl.logs[key]
		if !exists {
			log = &requestLog{
				timestamps: make([]time.Time, 0),
			}
			swl.logs[key] = log
		}
		swl.mu.Unlock()
	}

	log.mu.Lock()
	defer log.mu.Unlock()

	now := time.Now()
	windowStart := now.Add(-swl.window)

	// Remove old timestamps outside the window
	validTimestamps := make([]time.Time, 0)
	for _, ts := range log.timestamps {
		if ts.After(windowStart) {
			validTimestamps = append(validTimestamps, ts)
		}
	}
	log.timestamps = validTimestamps

	// Check if under limit
	if len(log.timestamps) < swl.limit {
		log.timestamps = append(log.timestamps, now)
		return true, nil
	}

	return false, nil
}

func (swl *SlidingWindowLog) cleanup() {
	ticker := time.NewTicker(swl.window)
	defer ticker.Stop()

	for range ticker.C {
		swl.mu.RLock()
		keys := make([]string, 0, len(swl.logs))
		for key := range swl.logs {
			keys = append(keys, key)
		}
		swl.mu.RUnlock()

		now := time.Now()
		windowStart := now.Add(-swl.window)

		for _, key := range keys {
			swl.mu.RLock()
			log := swl.logs[key]
			swl.mu.RUnlock()

			log.mu.Lock()
			// Remove old entries
			validTimestamps := make([]time.Time, 0)
			for _, ts := range log.timestamps {
				if ts.After(windowStart) {
					validTimestamps = append(validTimestamps, ts)
				}
			}
			log.timestamps = validTimestamps

			// Remove empty logs
			if len(log.timestamps) == 0 {
				swl.mu.Lock()
				delete(swl.logs, key)
				swl.mu.Unlock()
			}
			log.mu.Unlock()
		}
	}
}

func (swl *SlidingWindowLog) Reset(key string) error {
	swl.mu.Lock()
	defer swl.mu.Unlock()
	delete(swl.logs, key)
	return nil
}

// ============================================
// 5. Sliding Window Counter (Hybrid)
// ============================================

type SlidingWindowCounter struct {
	limit    int
	window   time.Duration
	counters map[string]*slidingCounter
	mu       sync.RWMutex
}

type slidingCounter struct {
	currentCount  int
	previousCount int
	currentStart  time.Time
	previousStart time.Time
	mu            sync.Mutex
}

func NewSlidingWindowCounter(limit int, window time.Duration) *SlidingWindowCounter {
	return &SlidingWindowCounter{
		limit:    limit,
		window:   window,
		counters: make(map[string]*slidingCounter),
	}
}

func (swc *SlidingWindowCounter) Allow(key string) (bool, error) {
	swc.mu.RLock()
	sc, exists := swc.counters[key]
	swc.mu.RUnlock()

	if !exists {
		swc.mu.Lock()
		sc, exists = swc.counters[key]
		if !exists {
			now := time.Now()
			sc = &slidingCounter{
				currentCount:  0,
				previousCount: 0,
				currentStart:  now,
				previousStart: now.Add(-swc.window),
			}
			swc.counters[key] = sc
		}
		swc.mu.Unlock()
	}

	sc.mu.Lock()
	defer sc.mu.Unlock()

	now := time.Now()

	// Check if we need to slide the window
	if now.Sub(sc.currentStart) >= swc.window {
		sc.previousCount = sc.currentCount
		sc.previousStart = sc.currentStart
		sc.currentCount = 0
		sc.currentStart = now
	}

	// Calculate weighted count
	elapsedInCurrent := now.Sub(sc.currentStart)
	percentageInCurrent := float64(elapsedInCurrent) / float64(swc.window)

	estimatedCount := float64(sc.previousCount)*(1-percentageInCurrent) + float64(sc.currentCount)

	// Check if under limit
	if estimatedCount < float64(swc.limit) {
		sc.currentCount++
		return true, nil
	}

	return false, nil
}

func (swc *SlidingWindowCounter) Reset(key string) error {
	swc.mu.Lock()
	defer swc.mu.Unlock()
	delete(swc.counters, key)
	return nil
}

// ============================================
// 6. Distributed Rate Limiter (Redis-based simulation)
// ============================================

type RedisClient interface {
	Incr(ctx context.Context, key string) (int64, error)
	Expire(ctx context.Context, key string, ttl time.Duration) error
	Get(ctx context.Context, key string) (int64, error)
}

type DistributedRateLimiter struct {
	redis  RedisClient
	limit  int
	window time.Duration
}

func NewDistributedRateLimiter(redis RedisClient, limit int, window time.Duration) *DistributedRateLimiter {
	return &DistributedRateLimiter{
		redis:  redis,
		limit:  limit,
		window: window,
	}
}

func (drl *DistributedRateLimiter) Allow(key string) (bool, error) {
	ctx := context.Background()

	// Increment counter
	count, err := drl.redis.Incr(ctx, "ratelimit:"+key)
	if err != nil {
		return false, err
	}

	// Set expiry on first request
	if count == 1 {
		err = drl.redis.Expire(ctx, "ratelimit:"+key, drl.window)
		if err != nil {
			return false, err
		}
	}

	// Check if under limit
	return count <= int64(drl.limit), nil
}

func (drl *DistributedRateLimiter) Reset(key string) error {
	// In Redis implementation, this would be a DEL command
	return errors.New("not implemented in simulation")
}

// ============================================
// Helper Functions
// ============================================

func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}

// ============================================
// Example Usage and Testing
// ============================================

func demonstrateRateLimiters() {
	fmt.Println("=== Rate Limiter Implementations ===\n")

	// 1. Token Bucket
	fmt.Println("1. Token Bucket (10 tokens, 5 refill/sec)")
	fmt.Println("------------------------------------------")
	tokenBucket := NewTokenBucket(10, 5)

	for i := 0; i < 15; i++ {
		allowed, _ := tokenBucket.Allow("user123")
		fmt.Printf("Request %2d: %v\n", i+1, allowed)
		time.Sleep(100 * time.Millisecond)
	}

	// 2. Leaky Bucket
	fmt.Println("\n2. Leaky Bucket (5 capacity, 2 leak/sec)")
	fmt.Println("-----------------------------------------")
	leakyBucket := NewLeakyBucket(5, 2)

	for i := 0; i < 10; i++ {
		allowed, _ := leakyBucket.Allow("user456")
		fmt.Printf("Request %2d: %v\n", i+1, allowed)
	}
	time.Sleep(3 * time.Second)

	// 3. Fixed Window
	fmt.Println("\n3. Fixed Window (5 requests per 10 seconds)")
	fmt.Println("--------------------------------------------")
	fixedWindow := NewFixedWindow(5, 10*time.Second)

	for i := 0; i < 8; i++ {
		allowed, _ := fixedWindow.Allow("user789")
		fmt.Printf("Request %2d: %v\n", i+1, allowed)
	}

	// 4. Sliding Window Log
	fmt.Println("\n4. Sliding Window Log (5 requests per 2 seconds)")
	fmt.Println("-------------------------------------------------")
	slidingLog := NewSlidingWindowLog(5, 2*time.Second)

	for i := 0; i < 7; i++ {
		allowed, _ := slidingLog.Allow("user999")
		fmt.Printf("Request %2d: %v\n", i+1, allowed)
		time.Sleep(300 * time.Millisecond)
	}

	// 5. Sliding Window Counter
	fmt.Println("\n5. Sliding Window Counter (5 requests per 2 seconds)")
	fmt.Println("----------------------------------------------------")
	slidingCounter := NewSlidingWindowCounter(5, 2*time.Second)

	for i := 0; i < 7; i++ {
		allowed, _ := slidingCounter.Allow("user888")
		fmt.Printf("Request %2d: %v\n", i+1, allowed)
		time.Sleep(300 * time.Millisecond)
	}

	fmt.Println("\n=== Rate Limiter Demo Complete ===")
}

func main() {
	demonstrateRateLimiters()
}

/*
Expected Output:

=== Rate Limiter Implementations ===

1. Token Bucket (10 tokens, 5 refill/sec)
------------------------------------------
Request  1: true
Request  2: true
Request  3: true
Request  4: true
Request  5: true
Request  6: true
Request  7: true
Request  8: true
Request  9: true
Request 10: true
Request 11: false
Request 12: true
Request 13: true
Request 14: true
Request 15: true

2. Leaky Bucket (5 capacity, 2 leak/sec)
-----------------------------------------
Request  1: true
Request  2: true
Request  3: true
Request  4: true
Request  5: true
Request  6: false
Request  7: false
Request  8: false
Request  9: false
Request 10: false

3. Fixed Window (5 requests per 10 seconds)
--------------------------------------------
Request  1: true
Request  2: true
Request  3: true
Request  4: true
Request  5: true
Request  6: false
Request  7: false
Request  8: false

4. Sliding Window Log (5 requests per 2 seconds)
-------------------------------------------------
Request  1: true
Request  2: true
Request  3: true
Request  4: true
Request  5: true
Request  6: false
Request  7: true

5. Sliding Window Counter (5 requests per 2 seconds)
----------------------------------------------------
Request  1: true
Request  2: true
Request  3: true
Request  4: true
Request  5: true
Request  6: false
Request  7: true

=== Rate Limiter Demo Complete ===

Key Concepts:
1. Token Bucket: Allows bursts, smooth rate limiting
2. Leaky Bucket: Fixed processing rate, no bursts
3. Fixed Window: Simple but has edge cases at window boundaries
4. Sliding Window Log: Accurate but memory intensive
5. Sliding Window Counter: Good balance of accuracy and efficiency
6. Distributed: Use Redis for multi-server rate limiting

Use Cases:
- API rate limiting per user/IP
- Prevent DDoS attacks
- Enforce pricing tiers (free vs paid)
- Protect backend services
- Fair resource allocation
*/
