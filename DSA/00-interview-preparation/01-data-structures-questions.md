# Data Structures Interview Questions

## Arrays & Strings

### Basic Questions

1. **What is an array?**

   - A collection of elements stored in contiguous memory locations
   - Fixed size (in most languages), O(1) access time by index
   - Best for: Random access, iteration

2. **What are the common patterns for array problems?**

   - Two Pointers (opposite/same direction)
   - Sliding Window (fixed/variable size)
   - Prefix Sum
   - Kadane's Algorithm (max subarray)

3. **How do you remove duplicates from a sorted array in-place?**
   - Use two pointers: one for reading, one for writing
   - Time: O(n), Space: O(1)

### Advanced Questions

4. **How would you find all pairs in an array that sum to a target?**

   - Two Pointers (sorted array): O(n)
   - Hash Map (unsorted): O(n)

5. **What is the difference between substr, substring, and slice in strings?**
   - Important for string manipulation problems

---

## Linked Lists

### Basic Questions

1. **What is a linked list?**

   - A linear data structure where elements are stored in nodes
   - Each node contains data and pointer(s) to next/previous nodes
   - Dynamic size, O(1) insertion/deletion (if node is known)

2. **What are the types of linked lists?**

   - Singly Linked List: One pointer (next)
   - Doubly Linked List: Two pointers (next, prev)
   - Circular Linked List: Last node points to first

3. **How do you detect a cycle in a linked list?**
   - Floyd's Cycle Detection (Fast & Slow Pointers)
   - Time: O(n), Space: O(1)

### Advanced Questions

4. **How do you find the middle of a linked list in one pass?**

   - Fast & Slow Pointers: Slow moves 1 step, Fast moves 2 steps

5. **How would you reverse a linked list?**
   - Iterative: Three pointers (prev, current, next)
   - Recursive: Base case when current is null

---

## Stacks & Queues

### Basic Questions

1. **What is a stack?**

   - LIFO (Last In, First Out) data structure
   - Operations: push, pop, peek, isEmpty
   - Used for: Function calls, undo operations, expression evaluation

2. **What is a queue?**

   - FIFO (First In, First Out) data structure
   - Operations: enqueue, dequeue, peek, isEmpty
   - Used for: BFS, task scheduling, buffering

3. **How would you implement a queue using stacks?**
   - Use two stacks: one for enqueue, one for dequeue
   - Amortized O(1) for both operations

### Advanced Questions

4. **What is a monotonic stack?**

   - A stack that maintains elements in increasing or decreasing order
   - Used for: Next Greater Element, Largest Rectangle

5. **How would you design a Min Stack?**
   - Maintain two stacks: one for values, one for minimums
   - All operations in O(1)

---

## Trees

### Basic Questions

1. **What is a tree?**

   - A hierarchical data structure with a root and children
   - Each node has at most one parent (except root)
   - No cycles

2. **What is a Binary Tree?**

   - Each node has at most two children (left, right)
   - Types: Full, Complete, Perfect, Balanced

3. **What is a Binary Search Tree (BST)?**

   - Binary tree where left < parent < right
   - Average O(log n) search, insert, delete
   - Worst case O(n) if unbalanced

4. **What are tree traversal methods?**
   - Inorder (Left, Root, Right) - gives sorted order in BST
   - Preorder (Root, Left, Right)
   - Postorder (Left, Right, Root)
   - Level Order (BFS)

### Advanced Questions

5. **How do you find the Lowest Common Ancestor (LCA)?**

   - Recursive approach comparing node values/positions
   - Time: O(n) for binary tree, O(log n) for BST

6. **What is the difference between balanced and unbalanced trees?**
   - Balanced: Height difference between left and right subtrees ≤ 1
   - Unbalanced: Can degrade to O(n) operations

---

## Graphs

### Basic Questions

1. **What is a graph?**

   - Collection of vertices (nodes) connected by edges
   - Can be directed or undirected, weighted or unweighted
   - Used for: Networks, relationships, paths

2. **How can you represent a graph?**

   - Adjacency Matrix: 2D array, O(V²) space
   - Adjacency List: Array of lists, O(V + E) space (preferred)
   - Edge List: List of edges

3. **What is DFS (Depth-First Search)?**

   - Explores as far as possible along each branch
   - Uses stack (or recursion)
   - Applications: Cycle detection, topological sort, path finding

4. **What is BFS (Breadth-First Search)?**
   - Explores neighbors level by level
   - Uses queue
   - Applications: Shortest path (unweighted), level order traversal

### Advanced Questions

5. **How do you detect a cycle in a directed graph?**

   - DFS with three states: unvisited, visiting, visited
   - If we visit a "visiting" node, there's a cycle

6. **What are the shortest path algorithms?**
   - BFS: Unweighted graphs, O(V + E)
   - Dijkstra: Non-negative weights, O((V + E) log V)
   - Bellman-Ford: Handles negative weights, O(VE)
   - Floyd-Warshall: All pairs, O(V³)

---

## Hash Tables

### Basic Questions

1. **What is a hash table?**

   - Data structure that maps keys to values using a hash function
   - Average O(1) insert, delete, search
   - Used for: Frequency counting, caching, quick lookups

2. **How do you handle collisions?**

   - Chaining: Store multiple values in a linked list
   - Open Addressing: Find another slot (linear probing, quadratic)

3. **When would you use a hash map vs a hash set?**
   - Hash Map: Key-value pairs, store additional data
   - Hash Set: Only keys, check existence

### Advanced Questions

4. **What is the difference between HashMap and TreeMap?**

   - HashMap: O(1) operations, unordered
   - TreeMap: O(log n) operations, ordered (sorted keys)

5. **How would you design an LRU Cache?**
   - Hash Map + Doubly Linked List
   - O(1) get and put operations

---

## Heaps

### Basic Questions

1. **What is a heap?**

   - Complete binary tree that satisfies heap property
   - Min Heap: Parent ≤ Children
   - Max Heap: Parent ≥ Children
   - Usually implemented using arrays

2. **What are common heap operations?**

   - Insert: O(log n)
   - Extract Min/Max: O(log n)
   - Peek: O(1)
   - Heapify: O(n)

3. **What is a Priority Queue?**
   - Abstract data type implemented using heap
   - Elements processed by priority, not order

### Advanced Questions

4. **How do you find the Kth largest element?**

   - Min Heap of size K: O(n log k)
   - Quick Select: O(n) average, O(n²) worst

5. **How would you merge K sorted lists?**
   - Min Heap of size K
   - Time: O(N log k), where N is total elements

---

## Common Interview Patterns

### 1. Two Pointers

- Opposite direction: Two Sum, Container With Most Water
- Same direction: Remove Duplicates, Fast & Slow Pointers

### 2. Sliding Window

- Fixed size: Maximum Sum Subarray
- Variable size: Longest Substring Without Repeating Characters

### 3. Fast & Slow Pointers

- Cycle Detection
- Finding Middle Element
- Palindrome Check

### 4. Tree Traversals

- Inorder: Binary Search Tree problems
- Level Order: Level-based problems, zigzag
- Postorder: Bottom-up calculations

### 5. Graph Traversals

- DFS: Cycle detection, connected components, topological sort
- BFS: Shortest path, level order

### 6. Union Find

- Connected components
- Cycle detection (Kruskal's MST)
- Dynamic connectivity

---

## Interview Tips

### 1. Always Ask Clarifying Questions

- Input size? Constraints?
- Can the array be empty? Negative numbers?
- Sorted or unsorted?
- Duplicates allowed?

### 2. Complexity Analysis

- Always discuss time and space complexity
- Mention trade-offs between approaches

### 3. Start with Brute Force

- Explain the naive solution first
- Then optimize

### 4. Test Your Code

- Walk through with examples
- Consider edge cases
- Think about boundary conditions

### 5. Common Edge Cases

- Empty input
- Single element
- All elements same
- Negative numbers
- Integer overflow
- Null pointers

---

## Must Practice Problems by Data Structure

### Arrays

- Two Sum / Three Sum
- Container With Most Water
- Trapping Rain Water
- Product of Array Except Self
- Maximum Subarray (Kadane's)

### Linked Lists

- Reverse Linked List
- Detect Cycle
- Merge Two Sorted Lists
- Remove Nth Node From End
- Add Two Numbers

### Stacks & Queues

- Valid Parentheses
- Min Stack
- Daily Temperatures
- Sliding Window Maximum

### Trees

- Maximum Depth
- Validate BST
- Lowest Common Ancestor
- Binary Tree Level Order Traversal
- Serialize and Deserialize

### Graphs

- Number of Islands
- Clone Graph
- Course Schedule (Topological Sort)
- Word Ladder
- Network Delay Time (Dijkstra)

### Hash Tables

- Group Anagrams
- Longest Consecutive Sequence
- LRU Cache
- Subarray Sum Equals K

### Heaps

- Kth Largest Element
- Top K Frequent Elements
- Merge K Sorted Lists
- Find Median from Data Stream
