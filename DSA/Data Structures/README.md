# Data Structures - Interview Preparation

A comprehensive collection of data structure implementations in TypeScript with detailed explanations and common interview problems.

## 📚 Contents

### 1. Arrays & Strings (`01-arrays.ts`)

**Time Complexity:**

- Access: O(1)
- Search: O(n)
- Insert/Delete: O(n)

**Key Patterns:**

- Two Pointers
- Sliding Window
- Prefix Sum
- Binary Search

**Common Problems:**

- Two Sum
- Container With Most Water
- Longest Substring Without Repeating Characters
- Maximum Subarray
- Product Except Self

---

### 2. Linked Lists (`02-linked-lists.ts`)

**Time Complexity:**

- Access: O(n)
- Search: O(n)
- Insert/Delete: O(1) with reference

**Key Patterns:**

- Fast & Slow Pointers
- Cycle Detection
- Reversal
- Merge

**Common Problems:**

- Reverse Linked List
- Detect Cycle
- Merge Two Sorted Lists
- Find Middle
- Remove Nth From End

---

### 3. Stacks & Queues (`03-stacks-queues.ts`)

**Time Complexity:**

- Push/Enqueue: O(1)
- Pop/Dequeue: O(1)
- Peek: O(1)

**Key Patterns:**

- Monotonic Stack/Queue
- Min/Max Stack
- Design Problems

**Common Problems:**

- Valid Parentheses
- Daily Temperatures
- Sliding Window Maximum
- Implement Queue Using Stacks
- Min Stack

---

### 4. Trees (`04-trees.ts`)

**Time Complexity:**

- Search: O(log n) BST, O(n) general
- Insert: O(log n) BST
- Delete: O(log n) BST
- Traversal: O(n)

**Key Patterns:**

- DFS (Inorder, Preorder, Postorder)
- BFS (Level Order)
- Binary Search Tree
- Path Problems

**Common Problems:**

- Maximum Depth
- Validate BST
- Lowest Common Ancestor
- Serialize/Deserialize
- Path Sum
- Binary Tree Level Order

---

### 5. Graphs (`05-graphs.ts`)

**Time Complexity:**

- BFS/DFS: O(V + E)
- Dijkstra: O((V + E) log V)
- Topological Sort: O(V + E)

**Key Patterns:**

- Graph Traversal (DFS, BFS)
- Shortest Path
- Cycle Detection
- Connected Components
- Topological Sort

**Common Problems:**

- Number of Islands
- Course Schedule
- Clone Graph
- Word Ladder
- Minimum Spanning Tree

---

### 6. Hash Tables (`06-hash-tables.ts`)

**Time Complexity:**

- Insert: O(1) average
- Delete: O(1) average
- Search: O(1) average

**Key Patterns:**

- Frequency Counting
- Two Sum Pattern
- Sliding Window with Hash
- Design Problems

**Common Problems:**

- Two Sum
- Group Anagrams
- Longest Consecutive Sequence
- LRU Cache
- Subarray Sum Equals K

---

### 7. Heaps (`07-heaps.ts`)

**Time Complexity:**

- Insert: O(log n)
- Extract Min/Max: O(log n)
- Peek: O(1)
- Heapify: O(n)

**Key Patterns:**

- Top K Elements
- Merge K Sorted
- Priority Queue
- Median Finder

**Common Problems:**

- Kth Largest Element
- Top K Frequent Elements
- Merge K Sorted Lists
- Find Median from Data Stream
- Task Scheduler

---

## 🎯 Interview Tips

### 1. **Time & Space Complexity**

Always analyze and communicate the time and space complexity of your solution.

### 2. **Trade-offs**

Be prepared to discuss trade-offs between different approaches:

- Time vs Space
- Readability vs Optimization
- Iterative vs Recursive

### 3. **Edge Cases**

Consider these common edge cases:

- Empty input
- Single element
- Duplicates
- Negative numbers
- Integer overflow
- Null/undefined values

### 4. **Common Optimizations**

#### Arrays:

- Use two pointers for sorted arrays
- Sliding window for contiguous subarrays
- Hash table for O(1) lookups

#### Linked Lists:

- Fast & slow pointers for cycle detection
- Dummy node to simplify edge cases
- Reverse in groups

#### Trees:

- Use BFS for level problems
- Use DFS for path problems
- Consider iterative solutions to save space

#### Graphs:

- BFS for shortest path (unweighted)
- DFS for connected components
- Topological sort for dependencies

---

## 📊 Complexity Cheat Sheet

| Data Structure | Access   | Search   | Insert   | Delete   | Space |
| -------------- | -------- | -------- | -------- | -------- | ----- |
| Array          | O(1)     | O(n)     | O(n)     | O(n)     | O(n)  |
| Linked List    | O(n)     | O(n)     | O(1)     | O(1)     | O(n)  |
| Stack          | O(n)     | O(n)     | O(1)     | O(1)     | O(n)  |
| Queue          | O(n)     | O(n)     | O(1)     | O(1)     | O(n)  |
| Hash Table     | N/A      | O(1)     | O(1)     | O(1)     | O(n)  |
| Binary Tree    | O(n)     | O(n)     | O(n)     | O(n)     | O(n)  |
| BST            | O(log n) | O(log n) | O(log n) | O(log n) | O(n)  |
| Heap           | O(n)     | O(n)     | O(log n) | O(log n) | O(n)  |

_Note: BST complexities assume balanced tree. Worst case is O(n)._

---

## 🚀 How to Practice

### Beginner (Weeks 1-2)

1. Arrays & Strings (Two Pointers, Sliding Window)
2. Linked Lists (Basic operations, Fast & Slow pointers)
3. Stacks & Queues (Parentheses, Next Greater Element)

### Intermediate (Weeks 3-4)

1. Trees (BFS, DFS, BST operations)
2. Hash Tables (Frequency problems, Two Sum variants)
3. Heaps (Top K problems)

### Advanced (Weeks 5-6)

1. Graphs (BFS, DFS, Shortest Path)
2. Advanced Trees (Serialize, LCA, Path problems)
3. Complex Data Structures (LRU Cache, Design problems)

---

## 💡 Problem-Solving Framework

### 1. **Understand**

- Read the problem carefully
- Ask clarifying questions
- Identify inputs, outputs, and constraints

### 2. **Plan**

- Think of brute force solution first
- Consider data structure choices
- Identify patterns

### 3. **Implement**

- Start with brute force if time is limited
- Write clean, readable code
- Use meaningful variable names

### 4. **Test**

- Walk through with examples
- Consider edge cases
- Verify time/space complexity

### 5. **Optimize**

- Look for redundant work
- Consider different data structures
- Discuss trade-offs

---

## 📖 Resources

### Books

- "Cracking the Coding Interview" by Gayle Laakmann McDowell
- "Elements of Programming Interviews" by Adnan Aziz
- "Algorithm Design Manual" by Steven Skiena

### Online Platforms

- LeetCode (focus on Top Interview Questions)
- HackerRank
- GeeksforGeeks
- AlgoExpert

### Practice Plans

- **LeetCode Patterns**: Focus on problem patterns rather than memorization
- **75 Blind Questions**: Curated list of most common interview problems
- **Grind 75**: Structured 75-problem list for interview prep

---

## 🎓 Company-Specific Tips

### FAANG Companies

- Focus on medium to hard problems
- Be able to optimize to best possible complexity
- Practice system design with data structures

### Startups

- Focus on practical problems
- Be able to implement quickly
- Discuss real-world trade-offs

### Financial Companies

- Focus on correctness and edge cases
- Be precise with complexity analysis
- Practice with large numbers and precision

---

## ✅ Practice Checklist

- [ ] Implement each data structure from scratch
- [ ] Solve at least 10 problems per data structure
- [ ] Can explain trade-offs between different approaches
- [ ] Can identify the right data structure for a problem
- [ ] Can optimize from brute force to optimal solution
- [ ] Comfortable with iterative and recursive solutions
- [ ] Can handle edge cases confidently
- [ ] Can code without IDE assistance

---

## 🔗 Quick Links

- [Main DSA README](../README.md)
- [Algorithms](../Algorithms/)
- [Interview Preparation](../00-interview-preparation/)
- [Resources](../resources.md)

---

**Remember:** Understanding patterns is more important than memorizing solutions. Focus on building intuition for when to use each data structure!




