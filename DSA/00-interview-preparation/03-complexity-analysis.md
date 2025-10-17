# Time and Space Complexity Analysis

## What is Complexity Analysis?

Complexity analysis helps us understand how an algorithm's performance scales with input size. It allows us to:

- Compare different algorithms
- Predict performance for large inputs
- Make informed trade-offs between time and space

---

## Big O Notation

Big O notation describes the **worst-case** upper bound of an algorithm's growth rate.

### Common Time Complexities (Best to Worst)

| Notation       | Name         | Example                                 | Description                       |
| -------------- | ------------ | --------------------------------------- | --------------------------------- |
| **O(1)**       | Constant     | Array access, Hash map lookup           | Doesn't depend on input size      |
| **O(log n)**   | Logarithmic  | Binary search, Balanced BST             | Divides problem in half each time |
| **O(n)**       | Linear       | Array traversal, Linear search          | Grows proportionally with input   |
| **O(n log n)** | Linearithmic | Merge sort, Quick sort (avg), Heap sort | Efficient sorting algorithms      |
| **O(n²)**      | Quadratic    | Bubble sort, Nested loops               | Two nested iterations             |
| **O(n³)**      | Cubic        | Floyd-Warshall, Matrix multiplication   | Three nested iterations           |
| **O(2ⁿ)**      | Exponential  | Fibonacci (naive), Power set            | Doubles with each addition        |
| **O(n!)**      | Factorial    | Permutations, Traveling salesman        | Grows extremely fast              |

### Visual Representation (Operations for n elements)

```
n = 10     n = 100    n = 1000
O(1)         1          1           1
O(log n)     3          7          10
O(n)        10        100        1000
O(n log n)  30        700       10000
O(n²)      100      10000     1000000
O(2ⁿ)     1024        ∞           ∞
```

---

## How to Calculate Time Complexity

### 1. Simple Loops

```typescript
// O(n)
for (let i = 0; i < n; i++) {
  console.log(i);
}

// O(n)
let i = 0;
while (i < n) {
  console.log(i);
  i++;
}
```

### 2. Nested Loops

```typescript
// O(n²)
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    console.log(i, j);
  }
}

// O(n · m) - different sizes
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    console.log(i, j);
  }
}
```

### 3. Logarithmic Complexity

```typescript
// O(log n) - dividing by constant
let i = 1;
while (i < n) {
  console.log(i);
  i *= 2; // or i = i * 2
}

// O(log n) - binary search
function binarySearch(arr: number[], target: number): number {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

### 4. O(n log n) Complexity

```typescript
// Merge Sort - divides array (log n) and merges (n)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid)); // log n divisions
  const right = mergeSort(arr.slice(mid));

  return merge(left, right); // O(n) merge
}
```

### 5. Recursive Complexity

```typescript
// O(2ⁿ) - Fibonacci (naive)
function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // Two recursive calls
}

// O(n) - Fibonacci (memoized)
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}
```

---

## Space Complexity

Space complexity measures the total memory used by an algorithm.

### Components:

1. **Input Space**: Space used by input (usually not counted)
2. **Auxiliary Space**: Extra space used by algorithm
3. **Recursion Stack**: Space used by recursive calls

### Examples

```typescript
// O(1) - Constant space
function sum(arr: number[]): number {
  let total = 0; // Only one variable
  for (const num of arr) {
    total += num;
  }
  return total;
}

// O(n) - Linear space (extra array)
function reverseArray(arr: number[]): number[] {
  const result = []; // New array of size n
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}

// O(log n) - Recursion stack for binary search
function binarySearchRecursive(
  arr: number[],
  target: number,
  left = 0,
  right = arr.length - 1
): number {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;

  if (arr[mid] < target)
    return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// O(n) - Recursion stack for tree traversal
function inorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  return [
    ...inorderTraversal(root.left),
    root.val,
    ...inorderTraversal(root.right),
  ];
}

// O(n²) - 2D DP table
function longestCommonSubsequence(s1: string, s2: string): number {
  const m = s1.length,
    n = s2.length;
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

---

## Data Structure Complexities

### Arrays

| Operation | Average | Worst |
| --------- | ------- | ----- |
| Access    | O(1)    | O(1)  |
| Search    | O(n)    | O(n)  |
| Insert    | O(n)    | O(n)  |
| Delete    | O(n)    | O(n)  |
| Space     | -       | O(n)  |

### Linked Lists

| Operation               | Average | Worst |
| ----------------------- | ------- | ----- |
| Access                  | O(n)    | O(n)  |
| Search                  | O(n)    | O(n)  |
| Insert (known position) | O(1)    | O(1)  |
| Delete (known position) | O(1)    | O(1)  |
| Space                   | -       | O(n)  |

### Stack/Queue

| Operation    | Average | Worst |
| ------------ | ------- | ----- |
| Push/Enqueue | O(1)    | O(1)  |
| Pop/Dequeue  | O(1)    | O(1)  |
| Peek         | O(1)    | O(1)  |
| Space        | -       | O(n)  |

### Hash Table

| Operation | Average | Worst |
| --------- | ------- | ----- |
| Search    | O(1)    | O(n)  |
| Insert    | O(1)    | O(n)  |
| Delete    | O(1)    | O(n)  |
| Space     | -       | O(n)  |

### Binary Search Tree

| Operation | Average  | Worst |
| --------- | -------- | ----- |
| Search    | O(log n) | O(n)  |
| Insert    | O(log n) | O(n)  |
| Delete    | O(log n) | O(n)  |
| Space     | -        | O(n)  |

### Binary Heap

| Operation       | Average  | Worst    |
| --------------- | -------- | -------- |
| Find Min/Max    | O(1)     | O(1)     |
| Extract Min/Max | O(log n) | O(log n) |
| Insert          | O(log n) | O(log n) |
| Space           | -        | O(n)     |

---

## Algorithm Complexities

### Sorting Algorithms

| Algorithm      | Best       | Average    | Worst      | Space    | Stable |
| -------------- | ---------- | ---------- | ---------- | -------- | ------ |
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)     | No     |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)     | Yes    |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n) | No     |
| Heap Sort      | O(n log n) | O(n log n) | O(n log n) | O(1)     | No     |
| Counting Sort  | O(n + k)   | O(n + k)   | O(n + k)   | O(k)     | Yes    |
| Radix Sort     | O(d·n)     | O(d·n)     | O(d·n)     | O(n + k) | Yes    |

### Searching Algorithms

| Algorithm            | Best | Average      | Worst    | Space |
| -------------------- | ---- | ------------ | -------- | ----- |
| Linear Search        | O(1) | O(n)         | O(n)     | O(1)  |
| Binary Search        | O(1) | O(log n)     | O(log n) | O(1)  |
| Jump Search          | O(1) | O(√n)        | O(√n)    | O(1)  |
| Interpolation Search | O(1) | O(log log n) | O(n)     | O(1)  |

### Graph Algorithms

| Algorithm        | Time Complexity  | Space |
| ---------------- | ---------------- | ----- |
| DFS              | O(V + E)         | O(V)  |
| BFS              | O(V + E)         | O(V)  |
| Dijkstra         | O((V + E) log V) | O(V)  |
| Bellman-Ford     | O(V · E)         | O(V)  |
| Floyd-Warshall   | O(V³)            | O(V²) |
| Prim's MST       | O((V + E) log V) | O(V)  |
| Kruskal's MST    | O(E log E)       | O(V)  |
| Topological Sort | O(V + E)         | O(V)  |

---

## Rules for Complexity Analysis

### 1. Drop Constants

```typescript
// Both are O(n), not O(2n) or O(3n)
function example1(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) console.log(arr[i]);
  for (let i = 0; i < arr.length; i++) console.log(arr[i]);
}
```

### 2. Drop Non-Dominant Terms

```typescript
// O(n² + n) = O(n²)
// Drop the n because n² grows much faster
function example2(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    // O(n)
    console.log(arr[i]);
  }

  for (let i = 0; i < arr.length; i++) {
    // O(n²)
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
```

### 3. Different Inputs = Different Variables

```typescript
// O(a + b), not O(n)
function example3(arr1: number[], arr2: number[]): void {
  for (const x of arr1) console.log(x); // O(a)
  for (const y of arr2) console.log(y); // O(b)
}

// O(a · b), not O(n²)
function example4(arr1: number[], arr2: number[]): void {
  for (const x of arr1) {
    for (const y of arr2) {
      console.log(x, y);
    }
  }
}
```

### 4. Add vs Multiply

```typescript
// Add: Sequential operations - O(A + B)
function doThings(arr1: number[], arr2: number[]): void {
  processFirst(arr1); // O(A)
  processSecond(arr2); // O(B)
}

// Multiply: Nested operations - O(A · B)
function doThings2(arr1: number[], arr2: number[]): void {
  for (const a of arr1) {
    // O(A)
    for (const b of arr2) {
      // O(B)
      process(a, b);
    }
  }
}
```

---

## Amortized Analysis

Some operations may occasionally be expensive, but are cheap on average.

### Example: Dynamic Array

```typescript
// push() operation:
// - Usually O(1): Just append
// - Sometimes O(n): When array is full, resize (copy all elements)
// - Amortized O(1): Average over many operations is constant

class DynamicArray {
  private arr: number[];
  private size: number;
  private capacity: number;

  constructor() {
    this.arr = new Array(1);
    this.size = 0;
    this.capacity = 1;
  }

  push(val: number): void {
    if (this.size === this.capacity) {
      // Resize: O(n), but happens rarely
      this.capacity *= 2;
      const newArr = new Array(this.capacity);
      for (let i = 0; i < this.size; i++) {
        newArr[i] = this.arr[i];
      }
      this.arr = newArr;
    }

    // Add element: O(1)
    this.arr[this.size] = val;
    this.size++;
  }
}
```

---

## Interview Tips

### 1. Always Discuss Complexity

- After presenting solution, immediately discuss time and space complexity
- Compare with brute force approach

### 2. Explain Trade-offs

- "This solution uses O(n) space but reduces time from O(n²) to O(n)"
- "We can optimize space to O(1) but it would be harder to understand"

### 3. Consider All Cases

- Best case
- Average case
- Worst case

### 4. Recognize Patterns

- Two nested loops → Usually O(n²)
- Dividing problem in half → Usually O(log n)
- Exploring all possibilities → Usually O(2ⁿ) or O(n!)

### 5. Ask About Constraints

- "What's the size of the input?"
- If n < 1000: O(n²) might be acceptable
- If n > 10⁶: Need O(n) or O(n log n)

---

## Practice Problems

### Identify the Complexity

1. What's the time complexity of finding the maximum element in an unsorted array?
2. What's the time complexity of checking if a number is prime?
3. What's the space complexity of recursive Fibonacci with memoization?
4. What's the time complexity of finding all permutations of a string?
5. What's the time complexity of finding the median of two sorted arrays?

### Optimize These

1. Given an array, find all pairs that sum to k (brute force is O(n²))
2. Find the first non-repeating character in a string
3. Check if two strings are anagrams
4. Find the kth largest element in an array

### Answers

1. O(n) - must check all elements
2. O(√n) - only check up to square root
3. O(n) - store n values
4. O(n!) - n! permutations
5. O(log(min(m,n))) - binary search approach
