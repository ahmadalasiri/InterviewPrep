# Basic DSA Interview Questions

## Table of Contents

- [Time & Space Complexity](#time--space-complexity)
- [Big-O Notation](#big-o-notation)
- [Data Structures Fundamentals](#data-structures-fundamentals)
- [Problem-Solving Approach](#problem-solving-approach)

---

## Time & Space Complexity

### Q1: What is time complexity and why is it important?

**Answer:**
Time complexity is a measure of how the runtime of an algorithm grows as the input size increases.

**Key Points:**

- **Measure of efficiency**: Helps compare algorithms
- **Scalability**: Predicts performance with large inputs
- **Optimization**: Identifies bottlenecks
- **Interview essential**: Always discuss complexity

**Common Time Complexities (best to worst):**

```
O(1)        - Constant
O(log n)    - Logarithmic
O(n)        - Linear
O(n log n)  - Linearithmic
O(n²)       - Quadratic
O(n³)       - Cubic
O(2ⁿ)       - Exponential
O(n!)       - Factorial
```

**Example:**

```javascript
// O(1) - Constant time
function getFirst(arr) {
  return arr[0]; // Always one operation
}

// O(n) - Linear time
function sum(arr) {
  let total = 0;
  for (let num of arr) {
    // n operations
    total += num;
  }
  return total;
}

// O(n²) - Quadratic time
function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    // n times
    for (let j = 0; j < arr.length; j++) {
      // n times each
      console.log(arr[i], arr[j]);
    }
  }
}
```

---

### Q2: What is space complexity?

**Answer:**
Space complexity measures the amount of memory an algorithm uses relative to the input size.

**Components:**

1. **Input space**: Memory for input data
2. **Auxiliary space**: Extra memory used by algorithm
3. **Output space**: Memory for results

**Space Complexity = Input Space + Auxiliary Space**

**Examples:**

```javascript
// O(1) space - Constant
function sum(arr) {
  let total = 0; // Only one variable
  for (let num of arr) {
    total += num;
  }
  return total;
}

// O(n) space - Linear
function double(arr) {
  const result = []; // New array of size n
  for (let num of arr) {
    result.push(num * 2);
  }
  return result;
}

// O(n) space - Recursive call stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // n stack frames
}
```

---

### Q3: How do you calculate Big-O notation?

**Answer:**
Big-O describes the upper bound (worst case) of an algorithm's growth rate.

**Rules for Calculating:**

1. **Drop constants**: O(2n) → O(n)
2. **Drop lower terms**: O(n² + n) → O(n²)
3. **Consider worst case**: Focus on largest input scenario
4. **Different inputs**: Use different variables (n, m)

**Examples:**

```javascript
// Example 1: O(n)
function example1(arr) {
  for (let i = 0; i < arr.length; i++) {
    // n times
    console.log(arr[i]);
  }
  for (let i = 0; i < arr.length; i++) {
    // n times
    console.log(arr[i] * 2);
  }
  // O(n + n) = O(2n) = O(n)
}

// Example 2: O(n²)
function example2(arr) {
  for (let i = 0; i < arr.length; i++) {
    // n times
    for (let j = i + 1; j < arr.length; j++) {
      // (n-1) + (n-2) + ... + 1
      console.log(arr[i], arr[j]);
    }
  }
  // O(n(n-1)/2) = O(n²)
}

// Example 3: O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
  // Divides search space by 2 each iteration
}
```

---

### Q4: What's the difference between best, average, and worst case complexity?

**Answer:**

- **Best Case (Ω)**: Minimum time/space required (ideal scenario)
- **Average Case (Θ)**: Expected time/space for typical input
- **Worst Case (O)**: Maximum time/space required (pessimistic scenario)

**Example - Linear Search:**

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Best Case: O(1) - target is first element
// Average Case: O(n/2) = O(n) - target in middle
// Worst Case: O(n) - target not found or last element
```

**Example - Quick Sort:**

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[0];
  const left = arr.slice(1).filter((x) => x <= pivot);
  const right = arr.slice(1).filter((x) => x > pivot);

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// Best Case: O(n log n) - balanced partitions
// Average Case: O(n log n) - typical random data
// Worst Case: O(n²) - already sorted or reverse sorted
```

---

## Big-O Notation

### Q5: What does O(log n) mean?

**Answer:**
O(log n) means the algorithm's runtime grows logarithmically - it divides the problem in half (or by a constant factor) at each step.

**Common in:**

- Binary search
- Balanced tree operations
- Divide and conquer algorithms

**Example:**

```javascript
// Binary search - O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1; // Eliminate left half
    } else {
      right = mid - 1; // Eliminate right half
    }
  }

  return -1;
}

// For array of 1000 elements:
// Worst case: ~10 comparisons (log₂(1000) ≈ 10)
// For 1,000,000 elements: ~20 comparisons
```

**Visualization:**

```
n = 16: 16 → 8 → 4 → 2 → 1  (4 steps, log₂(16) = 4)
n = 32: 32 → 16 → 8 → 4 → 2 → 1  (5 steps, log₂(32) = 5)
```

---

### Q6: What's the difference between O(n) and O(n²)?

**Answer:**

**O(n) - Linear Time:**

- Single loop through data
- Time doubles when input doubles
- Example: Linear search, array traversal

**O(n²) - Quadratic Time:**

- Nested loops
- Time quadruples when input doubles
- Example: Bubble sort, nested iteration

**Comparison:**

```javascript
// O(n) - Linear
function findMax(arr) {
  let max = arr[0];
  for (let num of arr) {
    // Single loop
    if (num > max) max = num;
  }
  return max;
}

// O(n²) - Quadratic
function printAllPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    // Outer loop: n times
    for (let j = 0; j < arr.length; j++) {
      // Inner loop: n times
      console.log(arr[i], arr[j]);
    }
  }
}

// Performance comparison:
// n = 10:   O(n) = 10 ops,    O(n²) = 100 ops
// n = 100:  O(n) = 100 ops,   O(n²) = 10,000 ops
// n = 1000: O(n) = 1000 ops,  O(n²) = 1,000,000 ops
```

---

### Q7: What is amortized time complexity?

**Answer:**
Amortized analysis considers the average time per operation over a sequence of operations, accounting for occasional expensive operations.

**Example - Dynamic Array (ArrayList):**

```javascript
class DynamicArray {
  constructor() {
    this.array = new Array(1);
    this.size = 0;
    this.capacity = 1;
  }

  push(value) {
    // Resize when full - expensive operation
    if (this.size === this.capacity) {
      this.resize(); // O(n) operation
    }

    this.array[this.size] = value;
    this.size++;
  }

  resize() {
    this.capacity *= 2;
    const newArray = new Array(this.capacity);
    for (let i = 0; i < this.size; i++) {
      newArray[i] = this.array[i];
    }
    this.array = newArray;
  }
}

// Individual push: O(1) most times, O(n) occasionally
// Amortized analysis: O(1) per push
//
// Sequence of n pushes:
// 1st resize at 1: copy 1 element
// 2nd resize at 2: copy 2 elements
// 3rd resize at 4: copy 4 elements
// ...
// Total copies: 1 + 2 + 4 + ... + n/2 ≈ n
// Total operations: 2n
// Amortized: 2n/n = O(1) per operation
```

---

## Data Structures Fundamentals

### Q8: What are the main types of data structures?

**Answer:**

**1. Linear Data Structures:**

- **Arrays**: Fixed size, contiguous memory
- **Linked Lists**: Dynamic size, non-contiguous
- **Stacks**: LIFO (Last In, First Out)
- **Queues**: FIFO (First In, First Out)

**2. Non-Linear Data Structures:**

- **Trees**: Hierarchical structure
- **Graphs**: Nodes with connections
- **Heaps**: Complete binary tree with ordering

**3. Hash-Based:**

- **Hash Tables**: Key-value pairs, O(1) lookup
- **Hash Sets**: Unique values, O(1) membership

**Comparison:**

```javascript
// Array - O(1) access, O(n) search
const arr = [1, 2, 3, 4, 5];
console.log(arr[2]); // O(1)

// Linked List - O(n) access, easy insertion
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

// Stack - LIFO operations
const stack = [];
stack.push(1); // O(1)
stack.push(2); // O(1)
stack.pop(); // O(1) - returns 2

// Queue - FIFO operations
const queue = [];
queue.push(1); // O(1) enqueue
queue.push(2); // O(1) enqueue
queue.shift(); // O(n) dequeue (use linked list for O(1))

// Hash Table - O(1) average operations
const map = new Map();
map.set("key", "value"); // O(1)
map.get("key"); // O(1)
```

---

### Q9: When should you use an array vs a linked list?

**Answer:**

**Use Arrays When:**

- Need random access (index-based)
- Know the size in advance
- Memory locality is important (cache performance)
- Space efficiency matters (no pointers)

**Use Linked Lists When:**

- Frequent insertions/deletions at beginning
- Size is unknown or varies dramatically
- Don't need random access
- Want O(1) insertions at known positions

**Comparison Table:**

| Operation           | Array       | Linked List      |
| ------------------- | ----------- | ---------------- |
| Access by index     | O(1)        | O(n)             |
| Search              | O(n)        | O(n)             |
| Insert at beginning | O(n)        | O(1)             |
| Insert at end       | O(1)\*      | O(n) or O(1)\*\* |
| Insert at middle    | O(n)        | O(n)\*\*\*       |
| Delete at beginning | O(n)        | O(1)             |
| Delete at end       | O(1)        | O(n) or O(1)\*\* |
| Space               | No overhead | Pointer overhead |

\* Amortized for dynamic arrays  
\*\* O(1) with tail pointer  
\*\*\* O(1) if position is known

**Code Example:**

```javascript
// Array: Fast access, slow insertion
const arr = [1, 2, 3, 4, 5];
console.log(arr[3]); // O(1) - Fast!
arr.splice(0, 0, 0); // O(n) - Must shift all elements

// Linked List: Slow access, fast insertion
class LinkedList {
  constructor() {
    this.head = null;
  }

  addFirst(val) {
    // O(1) - Fast!
    const node = new Node(val);
    node.next = this.head;
    this.head = node;
  }

  get(index) {
    // O(n) - Must traverse
    let current = this.head;
    for (let i = 0; i < index; i++) {
      if (!current) return null;
      current = current.next;
    }
    return current;
  }
}
```

---

### Q10: What is the difference between a stack and a queue?

**Answer:**

**Stack (LIFO - Last In, First Out):**

- Like a stack of plates
- Add and remove from same end (top)
- Operations: push, pop, peek

**Queue (FIFO - First In, First Out):**

- Like a line at a store
- Add at one end (rear), remove from other (front)
- Operations: enqueue, dequeue, peek

**Implementations:**

```javascript
// Stack Implementation
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element); // Add to end
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop(); // Remove from end
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Usage
const stack = new Stack();
stack.push(1); // Stack: [1]
stack.push(2); // Stack: [1, 2]
stack.push(3); // Stack: [1, 2, 3]
stack.pop(); // Returns 3, Stack: [1, 2]
stack.pop(); // Returns 2, Stack: [1]

// Queue Implementation
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element); // Add to end
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift(); // Remove from beginning
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Usage
const queue = new Queue();
queue.enqueue(1); // Queue: [1]
queue.enqueue(2); // Queue: [1, 2]
queue.enqueue(3); // Queue: [1, 2, 3]
queue.dequeue(); // Returns 1, Queue: [2, 3]
queue.dequeue(); // Returns 2, Queue: [3]
```

**Use Cases:**

```javascript
// Stack Use Cases:
// 1. Function call stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Stack: f(5) → f(4) → f(3) → f(2) → f(1)
}

// 2. Undo functionality
class TextEditor {
  constructor() {
    this.stack = [];
  }

  write(text) {
    this.stack.push(text);
  }

  undo() {
    return this.stack.pop();
  }
}

// 3. Parentheses matching
function isBalanced(str) {
  const stack = [];
  const pairs = { ")": "(", "}": "{", "]": "[" };

  for (let char of str) {
    if ("({[".includes(char)) {
      stack.push(char);
    } else if (")]} ".includes(char)) {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  return stack.length === 0;
}

// Queue Use Cases:
// 1. BFS traversal
function bfs(root) {
  const queue = [root];
  const result = [];

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

// 2. Task scheduling
class TaskScheduler {
  constructor() {
    this.queue = [];
  }

  addTask(task) {
    this.queue.push(task);
  }

  processNext() {
    return this.queue.shift();
  }
}

// 3. Print queue
class PrintQueue {
  constructor() {
    this.queue = [];
  }

  addDocument(doc) {
    this.queue.push(doc);
    console.log(`Document "${doc}" added to queue`);
  }

  print() {
    if (this.queue.length === 0) {
      console.log("Queue is empty");
      return;
    }
    const doc = this.queue.shift();
    console.log(`Printing: ${doc}`);
  }
}
```

---

## Problem-Solving Approach

### Q11: What's your approach to solving a new coding problem?

**Answer:**

**Step-by-Step Framework:**

**1. Understand the Problem (5 minutes)**

- Read carefully, clarify requirements
- Identify inputs, outputs, constraints
- Ask clarifying questions
- Discuss edge cases

**2. Plan the Solution (5-10 minutes)**

- Think of similar problems
- Consider different approaches
- Discuss trade-offs
- Choose an approach

**3. Implement (15-20 minutes)**

- Start with brute force if needed
- Write clean, readable code
- Use meaningful variable names
- Add comments for complex logic

**4. Test (5 minutes)**

- Walk through with examples
- Test edge cases
- Check for bugs
- Verify complexity

**5. Optimize (if time)**

- Analyze bottlenecks
- Consider better data structures
- Reduce time/space complexity

**Example Problem: Two Sum**

```javascript
/*
Problem: Given an array of integers and a target, return indices 
of two numbers that add up to target.

Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Clarifying questions:
- Can we use the same element twice? No
- Are there always exactly one solution? Yes
- Are numbers sorted? Not necessarily
- Can numbers be negative? Yes
*/

// Approach 1: Brute Force - O(n²) time, O(1) space
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return null;
}

// Approach 2: Hash Map - O(n) time, O(n) space
function twoSum(nums, target) {
  const map = new Map(); // Store value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return null;
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
console.log(twoSum([3, 3], 6)); // [0, 1]

// Edge cases to consider:
// - Empty array: []
// - Single element: [5]
// - No solution: [1, 2, 3], target = 10
// - Negative numbers: [-1, -2, -3], target = -5
// - Zero: [0, 4, 3, 0], target = 0
```

---

### Q12: How do you optimize a solution?

**Answer:**

**Optimization Strategies:**

**1. Use Better Data Structures**

- Array → Hash Map for O(1) lookups
- Array → Set for uniqueness
- Array → Heap for min/max operations

**2. Reduce Nested Loops**

- Two nested loops → Hash map
- Multiple passes → Single pass
- Recursion → Iteration (if appropriate)

**3. Use Two Pointers/Sliding Window**

- For sorted arrays
- For finding pairs/triplets
- For substring problems

**4. Apply Sorting**

- Sometimes O(n log n) sort helps achieve better overall complexity
- Enables binary search, two pointers

**5. Use Space to Save Time**

- Memoization for recursion
- Hash maps for lookups
- Precomputation

**Examples:**

```javascript
// Example 1: Find duplicates
// Brute Force: O(n²)
function findDuplicatesBrute(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// Optimized: O(n) using Set
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (let num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    }
    seen.add(num);
  }

  return Array.from(duplicates);
}

// Example 2: Two sum in sorted array
// Hash Map: O(n) time, O(n) space
function twoSumHash(nums, target) {
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

// Two Pointers: O(n) time, O(1) space
function twoSumTwoPointers(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return null;
}

// Example 3: Fibonacci
// Recursive: O(2ⁿ) - Very slow!
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// Memoization: O(n) time, O(n) space
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Iterative: O(n) time, O(1) space
function fibIterative(n) {
  if (n <= 1) return n;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

// Example 4: Maximum subarray sum
// Brute Force: O(n³)
function maxSubarrayBrute(nums) {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      let sum = 0;
      for (let k = i; k <= j; k++) {
        sum += nums[k];
      }
      maxSum = Math.max(maxSum, sum);
    }
  }
  return maxSum;
}

// Kadane's Algorithm: O(n)
function maxSubarray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}
```

---

### Q13: What are common problem-solving patterns?

**Answer:**

**1. Two Pointers Pattern**

```javascript
// Use for: Arrays, linked lists, strings
// Example: Remove duplicates from sorted array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
```

**2. Sliding Window Pattern**

```javascript
// Use for: Subarray/substring problems
// Example: Maximum sum of k consecutive elements
function maxSumSubarray(arr, k) {
  let maxSum = 0;
  let windowSum = 0;

  // Initial window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}
```

**3. Fast & Slow Pointers**

```javascript
// Use for: Cycle detection, middle element
// Example: Detect cycle in linked list
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
}
```

**4. Hash Map Pattern**

```javascript
// Use for: Frequency counting, lookups
// Example: First non-repeating character
function firstUniqChar(s) {
  const freq = new Map();

  // Count frequencies
  for (let char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Find first with count 1
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i;
  }

  return -1;
}
```

**5. Binary Search Pattern**

```javascript
// Use for: Sorted arrays, finding thresholds
// Example: Search in rotated sorted array
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}
```

**6. DFS/BFS Pattern**

```javascript
// Use for: Tree/graph traversal
// DFS Example: Maximum depth of binary tree
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// BFS Example: Level order traversal
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}
```

**7. Dynamic Programming Pattern**

```javascript
// Use for: Optimization, counting problems
// Example: Climbing stairs
function climbStairs(n) {
  if (n <= 2) return n;

  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}
```

**8. Backtracking Pattern**

```javascript
// Use for: Generating combinations, permutations
// Example: Generate all subsets
function subsets(nums) {
  const result = [];

  function backtrack(start, current) {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}
```

---

Continue to [Array & String Questions](./02-array-string-questions.md) →




