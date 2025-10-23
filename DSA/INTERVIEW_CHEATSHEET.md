# DSA Interview Cheatsheet

A quick reference guide for data structures and algorithms interview preparation.

## 🚀 Quick Pattern Recognition

### Given a Problem Type → Use This Approach

| Problem Type               | Approach             | Time           | Example                |
| -------------------------- | -------------------- | -------------- | ---------------------- |
| Find all solutions         | Backtracking         | O(2ⁿ)          | Subsets, Permutations  |
| Optimization (max/min)     | DP or Greedy         | O(n) - O(n²)   | Coin Change, Jump Game |
| Sorted array search        | Binary Search        | O(log n)       | Search Insert Position |
| Substring/subarray         | Sliding Window       | O(n)           | Longest Substring      |
| Two elements sum           | Two Pointers or Hash | O(n)           | Two Sum                |
| K elements                 | Heap                 | O(n log k)     | Top K Elements         |
| Connected components       | Union-Find or DFS    | O(n)           | Number of Islands      |
| Shortest path (unweighted) | BFS                  | O(V + E)       | Word Ladder            |
| Shortest path (weighted)   | Dijkstra             | O((V+E) log V) | Network Delay          |

---

## 📊 Time Complexity Cheatsheet

### Common Operations

```typescript
// O(1) - Constant
hash.get(key)
arr[i]
num % 2

// O(log n) - Logarithmic
Binary Search
Balanced Tree operations
Heap operations

// O(n) - Linear
Array traversal
Hash table operations
DFS/BFS

// O(n log n) - Linearithmic
Merge Sort
Quick Sort (average)
Heap Sort
Sorting-based solutions

// O(n²) - Quadratic
Nested loops
Bubble/Selection/Insertion Sort
Some DP problems

// O(2ⁿ) - Exponential
Recursive Fibonacci (naive)
Generating all subsets
Backtracking (worst case)

// O(n!) - Factorial
Generating all permutations
Traveling Salesman (brute force)
```

---

## 🎯 Pattern Templates

### 1. Two Pointers

```typescript
// Same direction
function twoPointers(arr: number[]): void {
  let left = 0;
  let right = 0;

  while (right < arr.length) {
    // Expand window
    // ... do something with right

    while (/* needs_shrinking */) {
      // Shrink window
      // ... do something with left
      left++;
    }

    right++;
  }
}

// Opposite direction
function oppositePointers(arr: number[]): void {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    if (/* condition */) {
      left++;
    } else {
      right--;
    }
  }
}
```

**Use When:**

- Sorted array
- Removing duplicates
- Finding pairs with target sum
- Reversing

---

### 2. Sliding Window

```typescript
// Fixed size window
function fixedWindow(arr: number[], k: number): number {
  let windowSum = 0;

  // Initial window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Variable size window
function variableWindow(arr: number[], target: number): number {
  let left = 0;
  let windowSum = 0;
  let minLen = Infinity;

  for (let right = 0; right < arr.length; right++) {
    windowSum += arr[right];

    while (windowSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      windowSum -= arr[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}
```

**Use When:**

- Contiguous subarray/substring
- Maximum/minimum with size constraint
- All substrings of certain property

---

### 3. Binary Search

```typescript
// Standard binary search
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// Find leftmost position
function findFirst(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

// Binary search on answer
function binarySearchAnswer(arr: number[], target: number): number {
  let left = minPossible;
  let right = maxPossible;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (canAchieve(mid)) {
      right = mid; // Try for smaller
    } else {
      left = mid + 1;
    }
  }

  return left;
}
```

**Use When:**

- Sorted array
- Finding position/range
- Minimizing/maximizing with binary property

---

### 4. Dynamic Programming

```typescript
// Top-Down (Memoization)
function dpTopDown(n: number, memo: Map<number, number> = new Map()): number {
  // Base case
  if (n <= 1) return n;

  // Check memo
  if (memo.has(n)) return memo.get(n)!;

  // Recursive call
  const result = dpTopDown(n - 1, memo) + dpTopDown(n - 2, memo);
  memo.set(n, result);

  return result;
}

// Bottom-Up (Tabulation)
function dpBottomUp(n: number): number {
  if (n <= 1) return n;

  const dp: number[] = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Space Optimized
function dpOptimized(n: number): number {
  if (n <= 1) return n;

  let prev2 = 0;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

**Use When:**

- Optimization problems (min/max)
- Counting problems
- Overlapping subproblems

---

### 5. Backtracking

```typescript
function backtrack(state: any[], choices: any[], result: any[][]): void {
  // Base case
  if (isComplete(state)) {
    result.push([...state]);
    return;
  }

  // Try each choice
  for (const choice of choices) {
    // Make choice
    if (isValid(choice)) {
      state.push(choice);

      // Recurse
      backtrack(state, getNewChoices(choice), result);

      // Undo choice (backtrack)
      state.pop();
    }
  }
}

// Common patterns
// Subsets
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, current: number[]) {
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

**Use When:**

- Finding all solutions
- Combinatorial problems
- Constraint satisfaction

---

### 6. DFS (Depth-First Search)

```typescript
// Recursive DFS
function dfsRecursive(node: TreeNode | null): void {
  if (!node) return;

  // Process current node
  console.log(node.value);

  // Recurse on children
  dfsRecursive(node.left);
  dfsRecursive(node.right);
}

// Iterative DFS
function dfsIterative(root: TreeNode | null): void {
  if (!root) return;

  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;

    // Process node
    console.log(node.value);

    // Add children (right first for left-to-right traversal)
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
}

// Graph DFS
function dfsGraph(graph: Map<number, number[]>, start: number): Set<number> {
  const visited = new Set<number>();

  function dfs(node: number) {
    visited.add(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  dfs(start);
  return visited;
}
```

**Use When:**

- Tree/Graph traversal
- Finding paths
- Topological sort
- Cycle detection

---

### 7. BFS (Breadth-First Search)

```typescript
// Tree BFS
function bfs(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}

// Graph BFS (shortest path)
function bfsShortestPath(
  graph: Map<number, number[]>,
  start: number,
  end: number
): number {
  const queue: [number, number][] = [[start, 0]];
  const visited = new Set<number>([start]);

  while (queue.length > 0) {
    const [node, dist] = queue.shift()!;

    if (node === end) return dist;

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return -1;
}
```

**Use When:**

- Level-order traversal
- Shortest path (unweighted)
- Minimum depth

---

## 🎯 Quick Decision Tree

```
Is the array sorted?
├─ Yes → Binary Search
└─ No
   ├─ Need all elements? → Sort first or use Hash Table
   └─ Need specific elements? → Hash Table

Is it about subarrays/substrings?
├─ Contiguous? → Sliding Window
├─ Any subarray? → Prefix Sum
└─ Pairs with sum? → Two Pointers or Hash Table

Is it optimization (min/max)?
├─ Greedy choice property? → Greedy
├─ Overlapping subproblems? → Dynamic Programming
└─ Try all solutions? → Backtracking

Is it about graph/tree?
├─ Shortest path? → BFS (unweighted) or Dijkstra (weighted)
├─ All paths? → DFS with backtracking
└─ Connected components? → DFS or Union-Find

Is it about top K elements?
└─ Use Min/Max Heap (O(n log k))

Need to find duplicates/frequency?
└─ Use Hash Table

Need to maintain order while inserting?
└─ Use Binary Search with insertion
```

---

## 🔥 Common Tricks

### Bit Manipulation

```typescript
// Check if power of 2
(n & (n - 1)) === 0;

// Get rightmost set bit
n & -n;

// Remove rightmost set bit
n & (n - 1);

// Check if odd
n & 1;

// Multiply by 2
n << 1;

// Divide by 2
n >> 1;

// Toggle ith bit
n ^ (1 << i);

// XOR swap
a ^= b;
b ^= a;
a ^= b;
```

### Array/String

```typescript
// Reverse array in-place
let left = 0,
  right = arr.length - 1;
while (left < right) {
  [arr[left], arr[right]] = [arr[right], arr[left]];
  left++;
  right--;
}

// Remove duplicates (sorted)
let write = 1;
for (let i = 1; i < arr.length; i++) {
  if (arr[i] !== arr[i - 1]) {
    arr[write++] = arr[i];
  }
}

// Find missing number (1 to n)
const sum = (n * (n + 1)) / 2;
const actualSum = arr.reduce((a, b) => a + b, 0);
return sum - actualSum;
```

### Linked List

```typescript
// Reverse linked list
let prev = null;
while (current) {
  const next = current.next;
  current.next = prev;
  prev = current;
  current = next;
}

// Find middle (fast & slow)
let slow = head,
  fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
}

// Detect cycle
let slow = head,
  fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true;
}
```

---

## 📝 Interview Checklist

### Before Coding

- [ ] Understand the problem completely
- [ ] Ask clarifying questions
- [ ] Discuss examples and edge cases
- [ ] Explain your approach
- [ ] Discuss time/space complexity

### While Coding

- [ ] Use meaningful variable names
- [ ] Write clean, readable code
- [ ] Handle edge cases
- [ ] Add comments for complex logic
- [ ] Test with examples

### After Coding

- [ ] Walk through code with example
- [ ] Analyze time complexity
- [ ] Analyze space complexity
- [ ] Discuss optimizations
- [ ] Mention trade-offs

---

## 🎓 Common Mistakes to Avoid

1. **Not asking clarifying questions**
2. **Jumping into code too quickly**
3. **Not considering edge cases**
4. **Poor variable naming**
5. **Not explaining thought process**
6. **Ignoring time/space complexity**
7. **Not testing the solution**
8. **Over-optimizing prematurely**

---

## 💡 Final Tips

1. **Pattern Recognition > Memorization**
2. **Practice explaining your approach**
3. **Start with brute force, then optimize**
4. **Think out loud during interviews**
5. **Ask for hints if stuck**
6. **Practice on a whiteboard**
7. **Time yourself during practice**
8. **Review solutions even if you solve them**

---

**Remember:** The goal is not to memorize solutions, but to recognize patterns and apply the right technique!




