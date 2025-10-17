# Algorithms - Interview Preparation

A comprehensive collection of algorithm implementations in TypeScript with detailed explanations and common interview problems.

## 📚 Contents

### 1. Sorting Algorithms (`01-sorting.ts`)

**Algorithms Covered:**

- Bubble Sort: O(n²)
- Selection Sort: O(n²)
- Insertion Sort: O(n²)
- Merge Sort: O(n log n)
- Quick Sort: O(n log n) avg
- Heap Sort: O(n log n)
- Counting Sort: O(n + k)
- Radix Sort: O(d \* (n + k))
- Bucket Sort: O(n + k)

**When to Use:**

- **Merge Sort**: Stable, guaranteed O(n log n), good for linked lists
- **Quick Sort**: In-place, fast average case, cache-friendly
- **Heap Sort**: In-place, guaranteed O(n log n), no recursion
- **Counting/Radix**: Integer arrays with limited range

**Common Problems:**

- Sort Colors (Dutch National Flag)
- Merge Intervals
- Kth Largest Element
- Meeting Rooms
- Largest Number

---

### 2. Searching Algorithms (`02-searching.ts`)

**Algorithms Covered:**

- Linear Search: O(n)
- Binary Search: O(log n)
- Jump Search: O(√n)
- Interpolation Search: O(log log n)
- Exponential Search: O(log n)

**Binary Search Variants:**

- Find First/Last Occurrence
- Search in Rotated Array
- Find Peak Element
- Search in 2D Matrix

**Common Problems:**

- Search Insert Position
- Find Minimum in Rotated Sorted Array
- Kth Smallest Element
- Median of Two Sorted Arrays
- Search a 2D Matrix

---

### 3. Dynamic Programming (`03-dynamic-programming.ts`)

**Key Concepts:**

- Overlapping Subproblems
- Optimal Substructure
- Memoization (Top-Down)
- Tabulation (Bottom-Up)

**Problem Categories:**

#### Linear DP

- Fibonacci
- Climbing Stairs
- House Robber
- Maximum Subarray

#### String DP

- Longest Common Subsequence
- Edit Distance
- Longest Palindromic Substring
- Word Break

#### 2D DP

- 0/1 Knapsack
- Coin Change
- Unique Paths
- Minimum Path Sum

#### Advanced DP

- Matrix Chain Multiplication
- Palindrome Partitioning
- Regular Expression Matching
- Wildcard Matching

**Common Problems:**

- Longest Increasing Subsequence
- Partition Equal Subset Sum
- Target Sum
- Best Time to Buy and Sell Stock

---

### 4. Backtracking (`04-backtracking.ts`)

**Key Concepts:**

- Exhaustive search with pruning
- Build solution incrementally
- Backtrack when constraint violated

**Problem Categories:**

#### Subsets & Combinations

- All Subsets (Power Set)
- Combinations
- Combination Sum

#### Permutations

- All Permutations
- Next Permutation
- Permutations with Duplicates

#### Constraint Satisfaction

- N-Queens
- Sudoku Solver
- Word Search
- Palindrome Partitioning

#### Generation Problems

- Generate Parentheses
- Letter Combinations
- IP Addresses

**Common Problems:**

- Phone Number Letter Combinations
- Restore IP Addresses
- Word Search II
- Combination Sum

---

### 5. Greedy Algorithms (`05-greedy.ts`)

**Key Concepts:**

- Make locally optimal choice
- Hope for global optimum
- Prove greedy choice property

**Problem Categories:**

#### Interval Problems

- Activity Selection
- Meeting Rooms
- Merge Intervals
- Non-overlapping Intervals

#### Array Problems

- Jump Game
- Container With Most Water
- Best Time to Buy and Sell Stock
- Candy Distribution

#### String Problems

- Remove K Digits
- Partition Labels
- Reorganize String

#### Scheduling

- Task Scheduler
- Job Scheduling
- Course Schedule

**Common Problems:**

- Gas Station
- Fractional Knapsack
- Minimum Number of Arrows
- Queue Reconstruction

---

### 6. Bit Manipulation (`06-bit-manipulation.ts`)

**Key Operations:**

- AND (&): Both bits 1
- OR (|): At least one bit 1
- XOR (^): Bits different
- NOT (~): Flip bits
- Left Shift (<<): Multiply by 2
- Right Shift (>>): Divide by 2

**Common Tricks:**

```typescript
// Check if odd
x & 1;

// Check if power of 2
x & (x - 1 === 0);

// Get rightmost set bit
x & -x;

// Remove rightmost set bit
x & (x - 1);

// Set ith bit
x | (1 << i);

// Clear ith bit
x & ~(1 << i);

// Toggle ith bit
x ^ (1 << i);
```

**Problem Categories:**

#### Basic Operations

- Count Set Bits
- Power of Two/Four
- Bit Manipulation Operations

#### XOR Problems

- Single Number
- Missing Number
- Find Duplicate

#### Advanced

- Maximum XOR
- Reverse Bits
- Hamming Distance
- Gray Code

**Common Problems:**

- Single Number (I, II, III)
- Counting Bits
- Sum of Two Integers
- UTF-8 Validation

---

## 🎯 Algorithm Selection Guide

### Given a Problem, Choose:

#### **Optimization Problem (Max/Min)**

1. Try Greedy first (if greedy choice property)
2. Use DP if overlapping subproblems
3. Consider Binary Search on answer

#### **Finding All Solutions**

1. Use Backtracking
2. Consider DP for counting

#### **Searching in Sorted Array**

1. Binary Search O(log n)
2. Two Pointers if additional constraint

#### **Searching in Unsorted Array**

1. Hash Table for O(1) lookup
2. Sorting first if multiple queries

#### **Range Queries**

1. Prefix Sum for static arrays
2. Segment Tree for updates
3. Binary Indexed Tree (Fenwick)

---

## 📊 Complexity Cheat Sheet

### Sorting Algorithms

| Algorithm | Best       | Average    | Worst      | Space    | Stable |
| --------- | ---------- | ---------- | ---------- | -------- | ------ |
| Bubble    | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Insertion | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Merge     | O(n log n) | O(n log n) | O(n log n) | O(n)     | Yes    |
| Quick     | O(n log n) | O(n log n) | O(n²)      | O(log n) | No     |
| Heap      | O(n log n) | O(n log n) | O(n log n) | O(1)     | No     |

### Search Algorithms

| Algorithm | Best | Average  | Worst    | Space |
| --------- | ---- | -------- | -------- | ----- |
| Linear    | O(1) | O(n)     | O(n)     | O(1)  |
| Binary    | O(1) | O(log n) | O(log n) | O(1)  |
| Jump      | O(1) | O(√n)    | O(√n)    | O(1)  |

### DP Problem Types

| Type     | Time  | Space | Example                    |
| -------- | ----- | ----- | -------------------------- |
| 1D DP    | O(n)  | O(n)  | Fibonacci, Climbing Stairs |
| 2D DP    | O(mn) | O(mn) | Longest Common Subsequence |
| Knapsack | O(nW) | O(nW) | 0/1 Knapsack               |

---

## 🚀 Practice Strategy

### Week 1-2: Fundamentals

- **Sorting**: Implement all major sorting algorithms
- **Searching**: Master binary search and variants
- **Problems**: 20-30 easy problems

### Week 3-4: Dynamic Programming

- **Linear DP**: Fibonacci, Climbing Stairs, House Robber
- **2D DP**: LCS, Edit Distance, Knapsack
- **Problems**: 30-40 medium DP problems

### Week 5: Backtracking & Greedy

- **Backtracking**: Subsets, Permutations, N-Queens
- **Greedy**: Intervals, Jump Game, Task Scheduler
- **Problems**: 20-30 medium problems

### Week 6: Advanced Topics

- **Bit Manipulation**: XOR problems, counting bits
- **Advanced DP**: Matrix chain, state machine
- **Problems**: 20-30 hard problems

---

## 💡 Problem-Solving Framework

### 1. **Identify Pattern**

```
Optimization (Max/Min) → DP or Greedy
All Solutions → Backtracking
Sorted Array → Binary Search
Unsorted Array → Hash Table or Sorting
```

### 2. **Choose Approach**

```
1. Brute Force (understand problem)
2. Optimize (identify bottlenecks)
3. Refine (use appropriate algorithm)
```

### 3. **Complexity Analysis**

- Calculate time complexity
- Calculate space complexity
- Consider trade-offs

---

## 🎓 Common Patterns

### Dynamic Programming Patterns

#### 1. **Linear DP**

```typescript
dp[i] = f(dp[i-1], dp[i-2], ...)
```

Examples: Fibonacci, Climbing Stairs

#### 2. **2D DP**

```typescript
dp[i][j] = f(dp[i-1][j], dp[i][j-1], ...)
```

Examples: Unique Paths, LCS

#### 3. **Knapsack**

```typescript
dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weight[i]] + value[i]);
```

#### 4. **String DP**

```typescript
dp[i][j] = dp[i-1][j-1] if s[i] == t[j]
```

### Backtracking Template

```typescript
function backtrack(state, choices) {
  if (satisfies_constraint(state)) {
    result.push(state);
    return;
  }

  for (const choice of choices) {
    make_choice(choice);
    backtrack(new_state, new_choices);
    undo_choice(choice);
  }
}
```

### Greedy Template

```typescript
function greedy(input) {
  sort(input); // Usually need to sort

  let result = initial_state;

  for (const item of input) {
    if (locally_optimal(item)) {
      result.add(item);
    }
  }

  return result;
}
```

---

## 📖 Must-Know Problems

### Sorting

- [ ] Merge Intervals
- [ ] Sort Colors
- [ ] Kth Largest Element
- [ ] Meeting Rooms II

### Searching

- [ ] Binary Search
- [ ] Search in Rotated Sorted Array
- [ ] Find Peak Element
- [ ] Search a 2D Matrix

### Dynamic Programming

- [ ] Climbing Stairs
- [ ] Longest Increasing Subsequence
- [ ] Coin Change
- [ ] Edit Distance
- [ ] Longest Common Subsequence
- [ ] 0/1 Knapsack
- [ ] House Robber
- [ ] Decode Ways

### Backtracking

- [ ] Subsets
- [ ] Permutations
- [ ] Combination Sum
- [ ] N-Queens
- [ ] Word Search
- [ ] Palindrome Partitioning

### Greedy

- [ ] Jump Game
- [ ] Gas Station
- [ ] Task Scheduler
- [ ] Partition Labels
- [ ] Best Time to Buy and Sell Stock

### Bit Manipulation

- [ ] Single Number
- [ ] Counting Bits
- [ ] Sum of Two Integers
- [ ] Reverse Bits
- [ ] Hamming Distance

---

## 🔗 Quick Links

- [Main DSA README](../README.md)
- [Data Structures](../Data%20Structures/)
- [Interview Preparation](../00-interview-preparation/)
- [Resources](../resources.md)

---

**Pro Tip:** Master the patterns, not individual problems. Once you understand the pattern, you can solve hundreds of similar problems!
