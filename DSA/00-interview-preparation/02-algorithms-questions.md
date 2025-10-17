# Algorithms Interview Questions

## Sorting Algorithms

### Basic Questions

1. **What is sorting?**

   - Arranging elements in a specific order (ascending/descending)
   - Comparison-based vs Non-comparison-based
   - In-place vs Out-of-place
   - Stable vs Unstable

2. **What are the main sorting algorithms?**

   - **Simple Sorts**: Bubble (O(n²)), Selection (O(n²)), Insertion (O(n²))
   - **Efficient Sorts**: Merge (O(n log n)), Quick (O(n log n)), Heap (O(n log n))
   - **Special Sorts**: Counting (O(n+k)), Radix (O(d·n)), Bucket (O(n+k))

3. **What is a stable sorting algorithm?**
   - Maintains relative order of equal elements
   - Stable: Merge, Insertion, Bubble
   - Unstable: Quick, Heap, Selection

### Advanced Questions

4. **When would you use Quick Sort vs Merge Sort?**

   - Quick Sort: In-place (O(1) space), faster in practice, unstable
   - Merge Sort: Stable, guaranteed O(n log n), requires O(n) space

5. **How does Counting Sort work?**

   - Non-comparison based, counts occurrences
   - Best when range (k) is small compared to n
   - Time: O(n + k), Space: O(k)

6. **What is the best sorting algorithm?**
   - No "best" - depends on:
     - Data size
     - Is data nearly sorted?
     - Memory constraints
     - Stability requirement

---

## Searching Algorithms

### Basic Questions

1. **What is searching?**

   - Finding an element or its position in a data structure
   - Linear vs Binary search
   - Requires understanding of time-space trade-offs

2. **What is Binary Search?**

   - Divide and conquer on sorted data
   - Time: O(log n), Space: O(1) iterative, O(log n) recursive
   - Must be sorted!

3. **What are Binary Search variants?**
   - Find first/last occurrence
   - Find insertion position
   - Search in rotated array
   - Find peak element

### Advanced Questions

4. **How do you search in a rotated sorted array?**

   - Modified binary search
   - Determine which half is sorted
   - Time: O(log n)

5. **What is Ternary Search?**

   - Divide into 3 parts instead of 2
   - Used for unimodal functions
   - Time: O(log₃ n)

6. **How do you find the square root using binary search?**
   - Binary search on answer range [0, x]
   - Check if mid² ≤ x < (mid+1)²

---

## Dynamic Programming

### Basic Questions

1. **What is Dynamic Programming (DP)?**

   - Optimization technique for overlapping subproblems
   - Two properties:
     - **Overlapping Subproblems**: Same subproblems solved multiple times
     - **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems

2. **What are the two main DP approaches?**

   - **Memoization (Top-Down)**: Recursion + caching
     - Pros: Intuitive, only computes needed states
     - Cons: Recursion overhead, stack space
   - **Tabulation (Bottom-Up)**: Iterative, fill table
     - Pros: No recursion, often faster
     - Cons: May compute unnecessary states

3. **How do you identify a DP problem?**
   - Keywords: "maximum/minimum", "count ways", "optimize"
   - Can break into smaller subproblems
   - Subproblems overlap

### Classic DP Problems

4. **Fibonacci Sequence**

   - Classic example of overlapping subproblems
   - Memoization: O(n) time, O(n) space
   - Optimized: O(n) time, O(1) space

5. **0/1 Knapsack**

   - Include or exclude each item
   - DP[i][w] = max value with first i items and weight limit w
   - Time: O(n·W), Space: O(n·W) or O(W)

6. **Longest Common Subsequence (LCS)**

   - DP[i][j] = LCS of first i chars of s1 and first j chars of s2
   - Time: O(m·n), Space: O(m·n) or O(min(m,n))

7. **Longest Increasing Subsequence (LIS)**
   - DP solution: O(n²)
   - Binary Search + DP: O(n log n)

### Advanced Questions

8. **What is space optimization in DP?**

   - Often only need previous row/column
   - Can reduce 2D DP to 1D
   - Example: Knapsack O(W) instead of O(n·W)

9. **What is the difference between subsequence and substring?**

   - Subsequence: Elements in order, not necessarily contiguous
   - Substring: Contiguous sequence of characters

10. **How do you solve interval DP problems?**
    - Matrix Chain Multiplication pattern
    - DP[i][j] = optimal solution for interval [i, j]
    - Try all possible split points

---

## Backtracking

### Basic Questions

1. **What is Backtracking?**

   - Systematic way to try all possibilities
   - Build solution incrementally
   - Abandon ("backtrack") when solution can't be completed
   - Essentially DFS with pruning

2. **What is the general backtracking template?**

   ```typescript
   function backtrack(path, choices) {
     if (isSolution(path)) {
       solutions.add(path);
       return;
     }
     for (choice of choices) {
       makeChoice(choice);
       backtrack(path, newChoices);
       unmakeChoice(choice); // backtrack
     }
   }
   ```

3. **What are common backtracking problems?**
   - Permutations/Combinations
   - Subsets
   - N-Queens
   - Sudoku Solver
   - Word Search
   - Generate Parentheses

### Advanced Questions

4. **How do you optimize backtracking?**

   - **Pruning**: Skip invalid branches early
   - **Constraint Propagation**: Reduce search space
   - **Memoization**: Cache results (if subproblems overlap)

5. **What's the difference between backtracking and DFS?**

   - Backtracking: Explores all solutions, backtracks on invalid paths
   - DFS: Graph/tree traversal
   - Backtracking uses DFS but with explicit path tracking and undoing

6. **How do you generate all subsets?**
   - Include/exclude each element
   - Time: O(2ⁿ·n), Space: O(n) for recursion

---

## Greedy Algorithms

### Basic Questions

1. **What is a Greedy Algorithm?**

   - Makes locally optimal choice at each step
   - Hopes to find global optimum
   - **Greedy Choice Property**: Local optimum leads to global optimum
   - **Optimal Substructure**: Optimal solution contains optimal subproblems

2. **When should you use Greedy vs DP?**

   - **Greedy**: When local optimum guarantees global optimum
     - Simpler, faster (usually O(n log n))
     - Examples: Activity Selection, Huffman Coding
   - **DP**: When need to consider all possibilities
     - More complex, slower
     - Examples: Knapsack, LCS

3. **What are classic Greedy problems?**
   - Activity Selection
   - Fractional Knapsack
   - Huffman Coding
   - Minimum Spanning Tree (Prim's, Kruskal's)
   - Dijkstra's Shortest Path

### Advanced Questions

4. **How do you prove a Greedy algorithm is correct?**

   - **Exchange Argument**: Show that any optimal solution can be transformed to greedy solution
   - **Staying Ahead**: Show greedy is always better than or equal to optimal at each step

5. **What is the difference between 0/1 Knapsack and Fractional Knapsack?**

   - **0/1 Knapsack**: Can't break items → DP (O(n·W))
   - **Fractional Knapsack**: Can take fractions → Greedy (O(n log n))

6. **Interval Scheduling Problems**
   - Sort by end time: Greedy works
   - Maximum number of non-overlapping intervals
   - Minimum meeting rooms needed

---

## Bit Manipulation

### Basic Questions

1. **What is Bit Manipulation?**

   - Operating directly on binary representations
   - Fast and memory efficient
   - Common in optimization and space-saving problems

2. **What are basic bitwise operators?**

   - **AND (&)**: Both bits 1 → 1
   - **OR (|)**: At least one bit 1 → 1
   - **XOR (^)**: Exactly one bit 1 → 1
   - **NOT (~)**: Flip bits
   - **Left Shift (<<)**: Multiply by 2
   - **Right Shift (>>)**: Divide by 2

3. **What are common bit manipulation tricks?**
   - Check if bit is set: `x & (1 << i)`
   - Set a bit: `x | (1 << i)`
   - Clear a bit: `x & ~(1 << i)`
   - Toggle a bit: `x ^ (1 << i)`
   - Check power of 2: `x & (x - 1) === 0`
   - Count set bits: Brian Kernighan's Algorithm

### Advanced Questions

4. **How does XOR help in finding single number?**

   - XOR properties:
     - `a ^ a = 0`
     - `a ^ 0 = a`
     - Commutative and associative
   - XOR all numbers: duplicates cancel out

5. **How do you swap two numbers without temp variable?**

   ```typescript
   a = a ^ b;
   b = a ^ b; // b = a
   a = a ^ b; // a = b
   ```

6. **What is bit masking?**
   - Using bits to represent states/sets
   - Space efficient: 32 states in 1 integer
   - Used in: DP with states, subset enumeration

---

## Algorithm Complexity Analysis

### Time Complexity Rankings

```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)

Excellent: O(1), O(log n)
Good: O(n), O(n log n)
Fair: O(n²)
Bad: O(n³), O(2ⁿ)
Terrible: O(n!)
```

### Space Complexity

- **O(1)**: In-place algorithms (Quick Sort, Heap Sort)
- **O(log n)**: Recursive call stack (Binary Search)
- **O(n)**: Extra array (Merge Sort, Counting Sort)
- **O(n²)**: 2D DP table

---

## Problem-Solving Framework

### 1. Understand the Problem

- Read carefully, identify inputs/outputs
- Ask clarifying questions
- Work through examples

### 2. Identify the Pattern

- Two Pointers? Sliding Window?
- Tree/Graph traversal?
- Dynamic Programming?
- Greedy approach?
- Backtracking?

### 3. Choose Data Structure

- Need fast lookup? → Hash Map
- Need ordering? → Heap, BST
- Need to track min/max? → Monotonic Stack/Queue
- Need to group/count? → Hash Map

### 4. Design Algorithm

- Start with brute force
- Identify bottlenecks
- Optimize step by step

### 5. Analyze Complexity

- Time complexity
- Space complexity
- Trade-offs

### 6. Code

- Use meaningful variable names
- Handle edge cases
- Write clean, readable code

### 7. Test

- Normal cases
- Edge cases
- Large inputs

---

## Must Practice Problems by Algorithm

### Sorting

- Sort Colors (Dutch National Flag)
- Merge Intervals
- Largest Number
- Meeting Rooms II

### Searching

- Binary Search
- Search in Rotated Sorted Array
- Find First and Last Position
- Sqrt(x)

### Dynamic Programming

- Climbing Stairs
- House Robber
- Longest Increasing Subsequence
- Coin Change
- Edit Distance
- Longest Common Subsequence

### Backtracking

- Permutations
- Subsets
- N-Queens
- Sudoku Solver
- Word Search
- Generate Parentheses

### Greedy

- Jump Game
- Gas Station
- Partition Labels
- Task Scheduler
- Remove K Digits

### Bit Manipulation

- Single Number
- Number of 1 Bits
- Reverse Bits
- Power of Two
- Missing Number

---

## Interview Tips

### 1. Communication

- Think out loud
- Explain your approach before coding
- Discuss trade-offs

### 2. Code Quality

- Use descriptive variable names
- Write modular code
- Handle edge cases

### 3. Optimization

- Start with brute force
- Identify bottlenecks
- Optimize incrementally

### 4. Testing

- Walk through your code
- Test with examples
- Consider edge cases

### 5. Time Management

- Don't get stuck on one approach
- Know when to move to next problem
- Partial credit is better than no credit
