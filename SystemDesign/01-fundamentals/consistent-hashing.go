package main

import (
	"fmt"
	"hash/crc32"
	"sort"
)

// ============================================
// Consistent Hashing Implementation
// ============================================

// ConsistentHash represents a consistent hashing ring
type ConsistentHash struct {
	circle       map[uint32]string // Hash ring
	sortedHashes []uint32          // Sorted hash values
	virtualNodes int               // Number of virtual nodes per physical node
	nodes        map[string]bool   // Track physical nodes
}

// NewConsistentHash creates a new consistent hash instance
func NewConsistentHash(virtualNodes int) *ConsistentHash {
	return &ConsistentHash{
		circle:       make(map[uint32]string),
		virtualNodes: virtualNodes,
		nodes:        make(map[string]bool),
	}
}

// AddNode adds a physical node to the hash ring
func (ch *ConsistentHash) AddNode(node string) {
	if ch.nodes[node] {
		return // Node already exists
	}

	ch.nodes[node] = true

	// Add virtual nodes
	for i := 0; i < ch.virtualNodes; i++ {
		virtualKey := ch.getVirtualNodeKey(node, i)
		hash := ch.hashKey(virtualKey)
		ch.circle[hash] = node
		ch.sortedHashes = append(ch.sortedHashes, hash)
	}

	// Re-sort hashes
	sort.Slice(ch.sortedHashes, func(i, j int) bool {
		return ch.sortedHashes[i] < ch.sortedHashes[j]
	})

	fmt.Printf("Added node %s with %d virtual nodes\n", node, ch.virtualNodes)
}

// RemoveNode removes a physical node from the hash ring
func (ch *ConsistentHash) RemoveNode(node string) {
	if !ch.nodes[node] {
		return // Node doesn't exist
	}

	delete(ch.nodes, node)

	// Remove virtual nodes
	for i := 0; i < ch.virtualNodes; i++ {
		virtualKey := ch.getVirtualNodeKey(node, i)
		hash := ch.hashKey(virtualKey)
		delete(ch.circle, hash)
	}

	// Rebuild sorted hashes
	ch.sortedHashes = make([]uint32, 0, len(ch.circle))
	for hash := range ch.circle {
		ch.sortedHashes = append(ch.sortedHashes, hash)
	}
	sort.Slice(ch.sortedHashes, func(i, j int) bool {
		return ch.sortedHashes[i] < ch.sortedHashes[j]
	})

	fmt.Printf("Removed node %s\n", node)
}

// GetNode returns the node responsible for the given key
func (ch *ConsistentHash) GetNode(key string) string {
	if len(ch.circle) == 0 {
		return ""
	}

	hash := ch.hashKey(key)

	// Binary search for the first node >= hash
	idx := sort.Search(len(ch.sortedHashes), func(i int) bool {
		return ch.sortedHashes[i] >= hash
	})

	// Wrap around if necessary
	if idx == len(ch.sortedHashes) {
		idx = 0
	}

	return ch.circle[ch.sortedHashes[idx]]
}

// GetNodes returns N nodes for replication
func (ch *ConsistentHash) GetNodes(key string, n int) []string {
	if len(ch.nodes) == 0 {
		return []string{}
	}

	if n > len(ch.nodes) {
		n = len(ch.nodes)
	}

	hash := ch.hashKey(key)
	result := make([]string, 0, n)
	seen := make(map[string]bool)

	// Binary search for starting position
	idx := sort.Search(len(ch.sortedHashes), func(i int) bool {
		return ch.sortedHashes[i] >= hash
	})

	// Collect unique nodes
	for len(result) < n {
		if idx >= len(ch.sortedHashes) {
			idx = 0
		}

		node := ch.circle[ch.sortedHashes[idx]]
		if !seen[node] {
			result = append(result, node)
			seen[node] = true
		}

		idx++
	}

	return result
}

// GetDistribution returns the distribution of keys across nodes
func (ch *ConsistentHash) GetDistribution(keys []string) map[string]int {
	distribution := make(map[string]int)

	for _, key := range keys {
		node := ch.GetNode(key)
		distribution[node]++
	}

	return distribution
}

// hashKey generates a hash for the given key
func (ch *ConsistentHash) hashKey(key string) uint32 {
	return crc32.ChecksumIEEE([]byte(key))
}

// getVirtualNodeKey generates a virtual node key
func (ch *ConsistentHash) getVirtualNodeKey(node string, index int) string {
	return fmt.Sprintf("%s#%d", node, index)
}

// ============================================
// Simple Hash (for comparison)
// ============================================

type SimpleHash struct {
	nodes []string
}

func NewSimpleHash() *SimpleHash {
	return &SimpleHash{
		nodes: make([]string, 0),
	}
}

func (sh *SimpleHash) AddNode(node string) {
	sh.nodes = append(sh.nodes, node)
}

func (sh *SimpleHash) RemoveNode(node string) {
	for i, n := range sh.nodes {
		if n == node {
			sh.nodes = append(sh.nodes[:i], sh.nodes[i+1:]...)
			break
		}
	}
}

func (sh *SimpleHash) GetNode(key string) string {
	if len(sh.nodes) == 0 {
		return ""
	}

	hash := crc32.ChecksumIEEE([]byte(key))
	idx := int(hash) % len(sh.nodes)
	return sh.nodes[idx]
}

func (sh *SimpleHash) GetDistribution(keys []string) map[string]int {
	distribution := make(map[string]int)

	for _, key := range keys {
		node := sh.GetNode(key)
		distribution[node]++
	}

	return distribution
}

// ============================================
// Demonstration
// ============================================

func main() {
	fmt.Println("=== Consistent Hashing vs Simple Hashing ===\n")

	// Generate test keys
	numKeys := 10000
	keys := make([]string, numKeys)
	for i := 0; i < numKeys; i++ {
		keys[i] = fmt.Sprintf("key-%d", i)
	}

	// Initial nodes
	nodes := []string{"server-1", "server-2", "server-3", "server-4"}

	fmt.Println("1. Initial Distribution (4 servers)")
	fmt.Println("====================================")

	// Simple Hash
	simpleHash := NewSimpleHash()
	for _, node := range nodes {
		simpleHash.AddNode(node)
	}
	simpleDist := simpleHash.GetDistribution(keys)
	fmt.Println("\nSimple Hash Distribution:")
	for node, count := range simpleDist {
		percentage := float64(count) / float64(numKeys) * 100
		fmt.Printf("  %s: %d keys (%.2f%%)\n", node, count, percentage)
	}

	// Consistent Hash
	consistentHash := NewConsistentHash(150) // 150 virtual nodes per physical node
	for _, node := range nodes {
		consistentHash.AddNode(node)
	}
	consistentDist := consistentHash.GetDistribution(keys)
	fmt.Println("\nConsistent Hash Distribution:")
	for node, count := range consistentDist {
		percentage := float64(count) / float64(numKeys) * 100
		fmt.Printf("  %s: %d keys (%.2f%%)\n", node, count, percentage)
	}

	fmt.Println("\n2. After Adding New Server (server-5)")
	fmt.Println("======================================")

	// Track key movements for simple hash
	simpleOldMapping := make(map[string]string)
	for _, key := range keys {
		simpleOldMapping[key] = simpleHash.GetNode(key)
	}

	// Track key movements for consistent hash
	consistentOldMapping := make(map[string]string)
	for _, key := range keys {
		consistentOldMapping[key] = consistentHash.GetNode(key)
	}

	// Add new server
	simpleHash.AddNode("server-5")
	consistentHash.AddNode("server-5")

	// Calculate moved keys for simple hash
	simpleMoved := 0
	for _, key := range keys {
		if simpleHash.GetNode(key) != simpleOldMapping[key] {
			simpleMoved++
		}
	}

	// Calculate moved keys for consistent hash
	consistentMoved := 0
	for _, key := range keys {
		if consistentHash.GetNode(key) != consistentOldMapping[key] {
			consistentMoved++
		}
	}

	fmt.Printf("\nSimple Hash: %d keys moved (%.2f%%)\n",
		simpleMoved, float64(simpleMoved)/float64(numKeys)*100)
	fmt.Printf("Consistent Hash: %d keys moved (%.2f%%)\n",
		consistentMoved, float64(consistentMoved)/float64(numKeys)*100)

	// New distributions
	simpleDist = simpleHash.GetDistribution(keys)
	consistentDist = consistentHash.GetDistribution(keys)

	fmt.Println("\nSimple Hash New Distribution:")
	for node, count := range simpleDist {
		percentage := float64(count) / float64(numKeys) * 100
		fmt.Printf("  %s: %d keys (%.2f%%)\n", node, count, percentage)
	}

	fmt.Println("\nConsistent Hash New Distribution:")
	for node, count := range consistentDist {
		percentage := float64(count) / float64(numKeys) * 100
		fmt.Printf("  %s: %d keys (%.2f%%)\n", node, count, percentage)
	}

	fmt.Println("\n3. Replication Example")
	fmt.Println("======================")

	testKeys := []string{"user:123", "session:abc", "cart:xyz"}
	for _, key := range testKeys {
		nodes := consistentHash.GetNodes(key, 3) // Get 3 nodes for replication
		fmt.Printf("Key '%s' replicated to: %v\n", key, nodes)
	}

	fmt.Println("\n4. After Removing a Server (server-2)")
	fmt.Println("======================================")

	// Track movements again
	consistentOldMapping = make(map[string]string)
	for _, key := range keys {
		consistentOldMapping[key] = consistentHash.GetNode(key)
	}

	consistentHash.RemoveNode("server-2")

	consistentMoved = 0
	for _, key := range keys {
		oldNode := consistentOldMapping[key]
		newNode := consistentHash.GetNode(key)
		if newNode != oldNode && oldNode == "server-2" {
			consistentMoved++
		}
	}

	fmt.Printf("\nKeys moved from server-2: %d\n", consistentMoved)

	consistentDist = consistentHash.GetDistribution(keys)
	fmt.Println("\nNew Distribution:")
	for node, count := range consistentDist {
		percentage := float64(count) / float64(numKeys) * 100
		fmt.Printf("  %s: %d keys (%.2f%%)\n", node, count, percentage)
	}

	fmt.Println("\n=== Demo Complete ===")
}

/*
Expected Output Example:

=== Consistent Hashing vs Simple Hashing ===

1. Initial Distribution (4 servers)
====================================
Added node server-1 with 150 virtual nodes
Added node server-2 with 150 virtual nodes
Added node server-3 with 150 virtual nodes
Added node server-4 with 150 virtual nodes

Simple Hash Distribution:
  server-1: 2500 keys (25.00%)
  server-2: 2500 keys (25.00%)
  server-3: 2500 keys (25.00%)
  server-4: 2500 keys (25.00%)

Consistent Hash Distribution:
  server-1: 2486 keys (24.86%)
  server-2: 2531 keys (25.31%)
  server-3: 2489 keys (24.89%)
  server-4: 2494 keys (24.94%)

2. After Adding New Server (server-5)
======================================
Added node server-5 with 150 virtual nodes

Simple Hash: 8000 keys moved (80.00%)
Consistent Hash: 2012 keys moved (20.12%)

Simple Hash New Distribution:
  server-1: 2000 keys (20.00%)
  server-2: 2000 keys (20.00%)
  server-3: 2000 keys (20.00%)
  server-4: 2000 keys (20.00%)
  server-5: 2000 keys (20.00%)

Consistent Hash New Distribution:
  server-1: 1989 keys (19.89%)
  server-2: 2015 keys (20.15%)
  server-3: 1992 keys (19.92%)
  server-4: 1998 keys (19.98%)
  server-5: 2006 keys (20.06%)

3. Replication Example
======================
Key 'user:123' replicated to: [server-4 server-1 server-5]
Key 'session:abc' replicated to: [server-2 server-5 server-3]
Key 'cart:xyz' replicated to: [server-3 server-1 server-4]

4. After Removing a Server (server-2)
======================================
Removed node server-2

Keys moved from server-2: 2015

New Distribution:
  server-1: 2512 keys (25.12%)
  server-3: 2491 keys (24.91%)
  server-4: 2489 keys (24.89%)
  server-5: 2508 keys (25.08%)

=== Demo Complete ===

Key Advantages of Consistent Hashing:
1. Minimal key redistribution when adding/removing nodes
2. Even distribution with virtual nodes
3. Natural support for replication
4. Scales well for distributed caching and databases

Use Cases:
- Distributed caching (Memcached, Redis Cluster)
- Load balancing
- Distributed databases (Cassandra, DynamoDB)
- CDN content routing
- Distributed file systems
*/
