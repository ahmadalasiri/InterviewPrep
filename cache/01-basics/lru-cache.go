package main

import (
	"container/list"
	"fmt"
	"sync"
)

/*
LRU (Least Recently Used) Cache Implementation

LRU evicts the least recently used items when capacity is reached.
This implementation uses:
- HashMap for O(1) lookups
- Doubly linked list for O(1) insertion/deletion
- Mutex for thread-safety

Time Complexity:
- Get: O(1)
- Put: O(1)

Space Complexity: O(capacity)
*/

// Entry represents a cache entry
type Entry struct {
	key   string
	value interface{}
}

// LRUCache is a thread-safe LRU cache
type LRUCache struct {
	capacity int
	cache    map[string]*list.Element  // Key -> List element
	list     *list.List                // Doubly linked list
	mu       sync.RWMutex              // Read-write lock
	stats    Stats
}

// Stats tracks cache statistics
type Stats struct {
	Hits   int64
	Misses int64
	Sets   int64
	Evictions int64
}

// NewLRUCache creates a new LRU cache with given capacity
func NewLRUCache(capacity int) *LRUCache {
	if capacity <= 0 {
		capacity = 100
	}

	return &LRUCache{
		capacity: capacity,
		cache:    make(map[string]*list.Element),
		list:     list.New(),
	}
}

// Get retrieves a value from cache and marks it as recently used
func (c *LRUCache) Get(key string) (interface{}, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check if key exists
	element, exists := c.cache[key]
	if !exists {
		c.stats.Misses++
		return nil, false
	}

	// Move to front (most recently used)
	c.list.MoveToFront(element)
	c.stats.Hits++

	entry := element.Value.(*Entry)
	return entry.value, true
}

// Put adds or updates a value in cache
func (c *LRUCache) Put(key string, value interface{}) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// If key exists, update and move to front
	if element, exists := c.cache[key]; exists {
		c.list.MoveToFront(element)
		entry := element.Value.(*Entry)
		entry.value = value
		c.stats.Sets++
		return
	}

	// Check capacity - evict if necessary
	if c.list.Len() >= c.capacity {
		c.evict()
	}

	// Add new entry to front
	entry := &Entry{key: key, value: value}
	element := c.list.PushFront(entry)
	c.cache[key] = element
	c.stats.Sets++
}

// evict removes least recently used item (from back of list)
func (c *LRUCache) evict() {
	element := c.list.Back()
	if element != nil {
		c.list.Remove(element)
		entry := element.Value.(*Entry)
		delete(c.cache, entry.key)
		c.stats.Evictions++
	}
}

// Delete removes a key from cache
func (c *LRUCache) Delete(key string) bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	element, exists := c.cache[key]
	if !exists {
		return false
	}

	c.list.Remove(element)
	delete(c.cache, key)
	return true
}

// Clear removes all items from cache
func (c *LRUCache) Clear() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.list.Init()
	c.cache = make(map[string]*list.Element)
}

// Size returns current number of items in cache
func (c *LRUCache) Size() int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.list.Len()
}

// Capacity returns maximum capacity of cache
func (c *LRUCache) Capacity() int {
	return c.capacity
}

// GetStats returns cache statistics
func (c *LRUCache) GetStats() Stats {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.stats
}

// HitRate returns cache hit rate as percentage
func (c *LRUCache) HitRate() float64 {
	c.mu.RLock()
	defer c.mu.RUnlock()

	total := c.stats.Hits + c.stats.Misses
	if total == 0 {
		return 0
	}
	return float64(c.stats.Hits) / float64(total) * 100
}

// Keys returns all keys in cache (most recent first)
func (c *LRUCache) Keys() []string {
	c.mu.RLock()
	defer c.mu.RUnlock()

	keys := make([]string, 0, c.list.Len())
	for element := c.list.Front(); element != nil; element = element.Next() {
		entry := element.Value.(*Entry)
		keys = append(keys, entry.key)
	}
	return keys
}

// ============================================================================
// EXAMPLES
// ============================================================================

func main() {
	fmt.Println("=== LRU Cache Examples ===\n")

	// Example 1: Basic usage
	example1BasicUsage()

	// Example 2: Eviction
	example2Eviction()

	// Example 3: Statistics
	example3Statistics()

	// Example 4: Cache-aside pattern
	example4CacheAside()
}

// Example 1: Basic Get/Put operations
func example1BasicUsage() {
	fmt.Println("Example 1: Basic Usage")
	cache := NewLRUCache(3)

	cache.Put("user:1", "John")
	cache.Put("user:2", "Jane")
	cache.Put("user:3", "Bob")

	// Get values
	if val, ok := cache.Get("user:1"); ok {
		fmt.Printf("Found user:1 = %v\n", val)
	}

	if val, ok := cache.Get("user:4"); !ok {
		fmt.Printf("user:4 not found\n")
	}

	fmt.Printf("Cache size: %d/%d\n\n", cache.Size(), cache.Capacity())
}

// Example 2: LRU eviction behavior
func example2Eviction() {
	fmt.Println("Example 2: LRU Eviction")
	cache := NewLRUCache(3)

	// Fill cache to capacity
	cache.Put("A", 1)
	cache.Put("B", 2)
	cache.Put("C", 3)
	fmt.Printf("After filling: %v\n", cache.Keys())

	// Access A (makes it most recent)
	cache.Get("A")
	fmt.Printf("After accessing A: %v\n", cache.Keys())

	// Add D (should evict least recently used = B)
	cache.Put("D", 4)
	fmt.Printf("After adding D: %v\n", cache.Keys())

	// B should be evicted
	if _, ok := cache.Get("B"); !ok {
		fmt.Println("B was evicted (LRU)")
	}

	fmt.Println()
}

// Example 3: Cache statistics
func example3Statistics() {
	fmt.Println("Example 3: Statistics")
	cache := NewLRUCache(10)

	// Perform operations
	cache.Put("key1", "value1")
	cache.Put("key2", "value2")
	cache.Put("key3", "value3")

	cache.Get("key1")  // Hit
	cache.Get("key1")  // Hit
	cache.Get("key2")  // Hit
	cache.Get("key99") // Miss
	cache.Get("key99") // Miss

	// Print statistics
	stats := cache.GetStats()
	fmt.Printf("Hits: %d\n", stats.Hits)
	fmt.Printf("Misses: %d\n", stats.Misses)
	fmt.Printf("Sets: %d\n", stats.Sets)
	fmt.Printf("Evictions: %d\n", stats.Evictions)
	fmt.Printf("Hit Rate: %.2f%%\n\n", cache.HitRate())
}

// Example 4: Cache-aside pattern with simulated database
func example4CacheAside() {
	fmt.Println("Example 4: Cache-Aside Pattern")

	// Simulated database
	database := map[string]string{
		"user:1": "John Doe",
		"user:2": "Jane Smith",
		"user:3": "Bob Johnson",
	}

	cache := NewLRUCache(10)

	// Function to get user with caching
	getUser := func(userID string) string {
		// Try cache first
		if val, ok := cache.Get(userID); ok {
			fmt.Printf("  [CACHE HIT] %s\n", userID)
			return val.(string)
		}

		// Cache miss - query database
		fmt.Printf("  [CACHE MISS] %s - querying database\n", userID)
		if val, ok := database[userID]; ok {
			cache.Put(userID, val)
			return val
		}

		return ""
	}

	// Test cache-aside pattern
	fmt.Println("First access (cache miss):")
	getUser("user:1")

	fmt.Println("\nSecond access (cache hit):")
	getUser("user:1")

	fmt.Println("\nDifferent user (cache miss):")
	getUser("user:2")

	fmt.Printf("\nFinal hit rate: %.2f%%\n\n", cache.HitRate())
}

// ============================================================================
// BENCHMARKING EXAMPLE
// ============================================================================

/*
// To run benchmarks:
// go test -bench=. -benchmem

func BenchmarkLRUCache_Put(b *testing.B) {
	cache := NewLRUCache(1000)
	b.ResetTimer()
	
	for i := 0; i < b.N; i++ {
		cache.Put(fmt.Sprintf("key%d", i), i)
	}
}

func BenchmarkLRUCache_Get(b *testing.B) {
	cache := NewLRUCache(1000)
	
	// Populate cache
	for i := 0; i < 1000; i++ {
		cache.Put(fmt.Sprintf("key%d", i), i)
	}
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		cache.Get(fmt.Sprintf("key%d", i%1000))
	}
}
*/

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/*
LRU Cache Characteristics:

1. Eviction: Removes least recently used items
2. Performance: O(1) get and put operations
3. Implementation: HashMap + Doubly Linked List
4. Thread-safe: Uses mutex for concurrent access

When to use LRU:
✅ Web caching (recently accessed pages likely accessed again)
✅ Memory-constrained environments
✅ Temporal locality in access patterns

Pros:
- Simple and widely understood
- Good for most access patterns
- O(1) operations

Cons:
- Doesn't consider access frequency
- Can have cache pollution from one-time accesses
- Doesn't work well for scan-heavy workloads

Alternative eviction policies:
- LFU (Least Frequently Used) - for stable patterns
- FIFO (First In First Out) - simpler but less effective
- ARC (Adaptive Replacement Cache) - balances recency and frequency
*/

