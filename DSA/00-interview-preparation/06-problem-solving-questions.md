# Problem Solving & System Design with DSA

## Table of Contents

- [Problem-Solving Framework](#problem-solving-framework)
- [Pattern Recognition](#pattern-recognition)
- [Optimization Techniques](#optimization-techniques)
- [Real-World Applications](#real-world-applications)
- [System Design with DSA](#system-design-with-dsa)

---

## Problem-Solving Framework

### Q1: What's your approach to solving a new coding problem?

**Difficulty:** ⭐ Easy

**Answer:**

**Step-by-Step Framework (UMPIRE):**

**1. Understand (5 min)**

- Read problem carefully
- Identify inputs, outputs, constraints
- Ask clarifying questions
- Discuss edge cases

**2. Match (5 min)**

- Recognize problem pattern
- Similar problems you've solved
- Appropriate data structures

**3. Plan (5-10 min)**

- Discuss approach
- Consider trade-offs
- Walk through example
- Analyze complexity

**4. Implement (15-20 min)**

- Write clean code
- Use meaningful names
- Add comments for complex logic

**5. Review (5 min)**

- Test with examples
- Check edge cases
- Verify logic

**6. Evaluate (5 min)**

- Analyze time/space complexity
- Discuss optimizations
- Consider alternatives

**Example: Two Sum**

```javascript
// 1. UNDERSTAND
// Input: array of integers, target number
// Output: indices of two numbers that add to target
// Constraints: exactly one solution, can't use same element twice

// 2. MATCH
// Pattern: Hash map for O(1) lookups
// Similar to: checking duplicates

// 3. PLAN
// - Use hash map to store seen numbers
// - For each number, check if complement exists
// - Return indices when found

// 4. IMPLEMENT
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return null;
}

// 5. REVIEW
// Test: [2, 7, 11, 15], target = 9
// i=0: complement=7, map={2:0}
// i=1: complement=2, found! return [0,1]

// 6. EVALUATE
// Time: O(n) - single pass
// Space: O(n) - hash map
// Better than O(n²) brute force
```

---

## Pattern Recognition

### Q2: What are the most common problem-solving patterns?

**Difficulty:** ⭐⭐ Medium

**Answer:**

**1. Two Pointers**

- **When**: Sorted arrays, finding pairs, palindromes
- **Example**: Two sum in sorted array, remove duplicates

```javascript
// Container With Most Water
function maxArea(height) {
  let left = 0,
    right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, area);

    height[left] < height[right] ? left++ : right--;
  }

  return maxWater;
}
```

**2. Sliding Window**

- **When**: Subarray/substring problems, fixed/variable window size
- **Example**: Max sum subarray, longest substring

```javascript
// Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0,
    maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1;
    }
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

**3. Fast & Slow Pointers**

- **When**: Cycle detection, middle element
- **Example**: Linked list cycle, happy number

```javascript
// Linked List Cycle
function hasCycle(head) {
  let slow = head,
    fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}
```

**4. Merge Intervals**

- **When**: Overlapping intervals
- **Example**: Merge intervals, meeting rooms

```javascript
// Merge Intervals
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];

    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      result.push(intervals[i]);
    }
  }

  return result;
}
```

**5. Binary Search**

- **When**: Sorted data, finding threshold
- **Example**: Search rotated array, find peak

**6. DFS/BFS**

- **When**: Tree/graph traversal, connected components
- **Example**: Number of islands, word ladder

**7. Dynamic Programming**

- **When**: Optimization, counting problems
- **Example**: Coin change, longest subsequence

**8. Backtracking**

- **When**: Generate all solutions, constraints
- **Example**: Subsets, permutations, N-Queens

**9. Monotonic Stack**

- **When**: Next greater/smaller element
- **Example**: Daily temperatures, histogram area

**10. Topological Sort**

- **When**: Dependency ordering
- **Example**: Course schedule, build order

---

## Optimization Techniques

### Q3: How do you optimize a brute force solution?

**Difficulty:** ⭐⭐ Medium

**Answer:**

**Common Optimization Strategies:**

**1. Use Better Data Structures**

```javascript
// BEFORE: O(n²) - nested loops
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// AFTER: O(n) - hash set
function hasDuplicate(arr) {
  const seen = new Set();
  for (let num of arr) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
```

**2. Eliminate Redundant Work**

```javascript
// BEFORE: O(2^n) - recompute same values
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// AFTER: O(n) - memoization
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}
```

**3. Sort First**

```javascript
// Two Sum in unsorted array: O(n²) brute force
// Sort + Two Pointers: O(n log n)

function twoSumSorted(nums, target) {
  nums.sort((a, b) => a - b);
  let left = 0,
    right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return true;
    sum < target ? left++ : right--;
  }

  return false;
}
```

**4. Trade Space for Time**

```javascript
// Prefix sum: Precompute to answer queries in O(1)
class NumArray {
  constructor(nums) {
    this.prefixSum = [0];
    for (let num of nums) {
      this.prefixSum.push(this.prefixSum[this.prefixSum.length - 1] + num);
    }
  }

  sumRange(left, right) {
    return this.prefixSum[right + 1] - this.prefixSum[left];
  }
}

// Without prefix sum: O(n) per query
// With prefix sum: O(1) per query, O(n) preprocessing
```

**5. Early Termination**

```javascript
// Binary search: Stop when found instead of searching all
// Backtracking: Prune branches that violate constraints
```

---

## Real-World Applications

### Q4: How are data structures used in real applications?

**Difficulty:** ⭐⭐ Medium

**Answer:**

**1. Hash Tables**

- Database indexing
- Caching (LRU cache)
- Symbol tables in compilers
- Router tables

**2. Trees**

- File systems (directory structure)
- HTML DOM
- Database indexing (B-trees)
- Expression parsing

**3. Graphs**

- Social networks (friend connections)
- Maps and navigation (shortest path)
- Web crawling (page links)
- Recommendation systems

**4. Stacks**

- Function call stack
- Undo/redo functionality
- Browser history
- Expression evaluation

**5. Queues**

- Task scheduling
- Print queue
- BFS for shortest path
- Message queues (Kafka, RabbitMQ)

**6. Heaps**

- Priority queues
- Task scheduling
- Median finding (two heaps)
- Top K elements

**7. Tries**

- Autocomplete
- Spell checkers
- IP routing tables
- T9 predictive text

---

## System Design with DSA

### Q5: Design a URL shortener

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

**Requirements:**

- Shorten long URLs
- Redirect short URL to original
- Handle millions of requests
- URLs don't expire

**Data Structures:**

**1. Hash Map for Storage**

```javascript
class URLShortener {
  constructor() {
    this.urlMap = new Map(); // shortCode -> longURL
    this.reverseMap = new Map(); // longURL -> shortCode
    this.base62 =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.counter = 0;
  }

  // Encode counter to base62
  encode(num) {
    let code = "";
    while (num > 0) {
      code = this.base62[num % 62] + code;
      num = Math.floor(num / 62);
    }
    return code || "0";
  }

  // Shorten URL - O(1)
  shorten(longURL) {
    if (this.reverseMap.has(longURL)) {
      return this.reverseMap.get(longURL);
    }

    const shortCode = this.encode(this.counter++);
    this.urlMap.set(shortCode, longURL);
    this.reverseMap.set(longURL, shortCode);

    return `http://short.url/${shortCode}`;
  }

  // Expand URL - O(1)
  expand(shortURL) {
    const shortCode = shortURL.split("/").pop();
    return this.urlMap.get(shortCode) || null;
  }
}

// Usage:
const shortener = new URLShortener();
const short = shortener.shorten("https://example.com/very/long/url");
// Returns: http://short.url/0
const original = shortener.expand(short);
// Returns: https://example.com/very/long/url
```

**2. For Scale (Distributed System):**

- **Database**: Use NoSQL (Cassandra) for horizontal scaling
- **Caching**: Redis for frequently accessed URLs
- **Load Balancing**: Distribute requests
- **Rate Limiting**: Prevent abuse (Token Bucket)

---

### Q6: Design an LRU Cache

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

**Requirements:**

- Get and Put operations in O(1)
- Evict least recently used when capacity reached

**Data Structures:**

- **Hash Map**: O(1) lookup
- **Doubly Linked List**: O(1) add/remove

```javascript
class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();

    // Dummy head and tail
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Move node to front (most recent)
  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    const node = this.cache.get(key);
    this.moveToFront(node);
    return node.val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.val = value;
      this.moveToFront(node);
    } else {
      const node = new Node(key, value);
      this.cache.set(key, node);
      this.addToFront(node);

      if (this.cache.size > this.capacity) {
        // Remove LRU (tail.prev)
        const lru = this.tail.prev;
        this.removeNode(lru);
        this.cache.delete(lru.key);
      }
    }
  }
}

// Time: O(1) for both get and put
// Space: O(capacity)
```

---

### Q7: Design a rate limiter

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

**Token Bucket Algorithm:**

```javascript
class RateLimiter {
  constructor(maxTokens, refillRate) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate; // tokens per second
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  allowRequest(tokens = 1) {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }
}

// Usage: 10 requests per second
const limiter = new RateLimiter(10, 10);

if (limiter.allowRequest()) {
  // Process request
} else {
  // Reject: 429 Too Many Requests
}
```

**For Distributed System:**

- Use Redis with sliding window
- Store request timestamps in sorted set
- Remove old timestamps, check count

---

### Q8: Design a file system

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

**Data Structure: Trie (Prefix Tree)**

```javascript
class FileNode {
  constructor(isFile = false) {
    this.isFile = isFile;
    this.children = new Map();
    this.content = "";
  }
}

class FileSystem {
  constructor() {
    this.root = new FileNode();
  }

  // Create file path - O(path length)
  createPath(path, value) {
    const parts = path.split("/").filter((p) => p);
    let node = this.root;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!node.children.has(parts[i])) {
        node.children.set(parts[i], new FileNode());
      }
      node = node.children.get(parts[i]);
    }

    const fileName = parts[parts.length - 1];
    if (!node.children.has(fileName)) {
      node.children.set(fileName, new FileNode(true));
    }

    node.children.get(fileName).content += value;
  }

  // Read file content - O(path length)
  readContentFromFile(path) {
    const node = this.getNode(path);
    return node?.isFile ? node.content : "";
  }

  // List directory - O(path length)
  ls(path) {
    const node = this.getNode(path);

    if (!node) return [];
    if (node.isFile) {
      return [path.split("/").pop()];
    }

    return Array.from(node.children.keys()).sort();
  }

  getNode(path) {
    const parts = path.split("/").filter((p) => p);
    let node = this.root;

    for (let part of parts) {
      if (!node.children.has(part)) return null;
      node = node.children.get(part);
    }

    return node;
  }
}

// Usage:
const fs = new FileSystem();
fs.createPath("/a/b/c/file.txt", "hello");
fs.createPath("/a/b/c/file.txt", " world");
console.log(fs.readContentFromFile("/a/b/c/file.txt")); // "hello world"
console.log(fs.ls("/a/b/c")); // ["file.txt"]
```

---

## Final Tips

### Q9: What are common mistakes in interviews?

**Difficulty:** ⭐ Easy

**Answer:**

**Don't:**

1. Jump to coding immediately
2. Ignore edge cases
3. Write messy code
4. Stay silent
5. Give up easily

**Do:**

1. Clarify requirements
2. Think out loud
3. Start with brute force, then optimize
4. Test your code
5. Discuss trade-offs

**Practice:**

- 1-2 problems daily
- Focus on patterns
- Time yourself
- Do mock interviews
- Review mistakes

---

**End of Interview Preparation** ✓

Good luck with your interviews! 🚀




