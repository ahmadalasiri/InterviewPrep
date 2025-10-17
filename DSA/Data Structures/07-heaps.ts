/**
 * ============================================================================
 * HEAPS & PRIORITY QUEUES - COMPREHENSIVE GUIDE
 * ============================================================================
 * 
 * WHAT IS A HEAP?
 * ---------------
 * A heap is a specialized tree-based data structure that satisfies the heap
 * property. It's a complete binary tree (all levels filled except possibly last,
 * filled left to right).
 * 
 * HEAP PROPERTY:
 * 
 * 1. **Min Heap**: Parent ≤ Children (smallest element at root)
 *    - Root is the minimum element
 *    - Each node is smaller than or equal to its children
 * 
 * 2. **Max Heap**: Parent ≥ Children (largest element at root)
 *    - Root is the maximum element
 *    - Each node is larger than or equal to its children
 * 
 * NOTE: No ordering between siblings!
 * 
 * ARRAY REPRESENTATION:
 * Heaps are typically implemented using arrays for efficiency:
 * - Root at index 0
 * - For node at index i:
 *   - Left child: 2*i + 1
 *   - Right child: 2*i + 2
 *   - Parent: floor((i - 1) / 2)
 * 
 * Example Min Heap:
 *       1
 *      / \
 *     3   6
 *    / \ / \
 *   5  9 8  10
 * 
 * Array: [1, 3, 6, 5, 9, 8, 10]
 * 
 * TIME COMPLEXITIES:
 * - Insert (Push): O(log n) - bubble up
 * - Extract Min/Max (Pop): O(log n) - bubble down
 * - Peek Min/Max: O(1) - just look at root
 * - Heapify (build heap from array): O(n)
 * - Search: O(n) - heap is not for searching!
 * - Delete arbitrary element: O(log n) if you have the index
 * 
 * SPACE COMPLEXITY: O(n)
 * 
 * HEAP OPERATIONS:
 * 
 * 1. **Bubble Up (Heapify Up, Sift Up)**
 *    - Used after insertion
 *    - Compare with parent, swap if needed
 *    - Repeat until heap property restored
 *    - Time: O(log n)
 * 
 * 2. **Bubble Down (Heapify Down, Sift Down)**
 *    - Used after extraction
 *    - Compare with children, swap with smaller/larger
 *    - Repeat until heap property restored
 *    - Time: O(log n)
 * 
 * 3. **Heapify (Build Heap)**
 *    - Convert array to heap
 *    - Start from last non-leaf, bubble down each
 *    - Time: O(n) - not O(n log n)!
 * 
 * WHAT IS A PRIORITY QUEUE?
 * --------------------------
 * A priority queue is an abstract data type where each element has a priority.
 * Elements are served based on priority, not insertion order.
 * 
 * - Highest priority element is served first
 * - Typically implemented using a heap
 * - Operations: insert, extractMin/Max, peek
 * 
 * TYPES OF PRIORITY QUEUES:
 * 1. **Min Priority Queue**: Smallest value has highest priority
 * 2. **Max Priority Queue**: Largest value has highest priority
 * 
 * COMMON USE CASES:
 * - Task scheduling (OS schedulers)
 * - Dijkstra's shortest path algorithm
 * - Huffman coding (data compression)
 * - A* pathfinding algorithm
 * - Event-driven simulation
 * - Merge K sorted arrays/lists
 * - Finding Kth largest/smallest element
 * - Median maintenance
 * 
 * COMMON INTERVIEW PATTERNS:
 * 1. Top K elements (Min/Max Heap of size K)
 * 2. Kth largest/smallest element
 * 3. Merge K sorted lists
 * 4. Running median (two heaps: max and min)
 * 5. Meeting rooms / interval scheduling
 * 6. Continuous median tracking
 * 7. Sliding window maximum/minimum
 * 
 * COMMON INTERVIEW QUESTIONS:
 * 1. Kth Largest Element in an Array
 * 2. Top K Frequent Elements
 * 3. Merge K Sorted Lists
 * 4. Find Median from Data Stream (two heaps)
 * 5. Meeting Rooms II (min heap for end times)
 * 6. Task Scheduler
 * 7. Reorganize String
 * 8. K Closest Points to Origin
 * 9. Ugly Number II
 * 10. Smallest Range Covering Elements from K Lists
 * 11. IPO (maximize capital)
 * 12. Find K Pairs with Smallest Sums
 * 
 * WHEN TO USE HEAPS:
 * - Need to repeatedly find/remove min or max element
 * - Implement priority queue
 * - Need to find top K elements
 * - Maintain a running median
 * - Merge K sorted sequences
 * 
 * ADVANTAGES:
 * + O(1) access to min/max
 * + O(log n) insertion and deletion
 * + O(n) heapify (build heap)
 * + Space efficient (array implementation)
 * + Good for streaming data
 * 
 * DISADVANTAGES:
 * - O(n) search (not for searching!)
 * - No O(1) arbitrary access
 * - Not suitable for sorted iteration
 * - Can't efficiently delete arbitrary elements
 * 
 * HEAP vs OTHER DATA STRUCTURES:
 * 
 * **Heap vs Binary Search Tree (BST):**
 * - Heap: O(1) min/max, O(log n) insert/delete, O(n) search
 * - BST: O(log n) for all operations, supports ordered iteration
 * - Use Heap: When you only need min/max
 * - Use BST: When you need ordered data or range queries
 * 
 * **Heap vs Sorted Array:**
 * - Heap: O(log n) insert, O(1) find min/max
 * - Sorted Array: O(n) insert, O(1) find min/max
 * - Use Heap: For dynamic data with frequent insertions
 * - Use Array: For static data or infrequent insertions
 * 
 * **Heap vs Hash Map:**
 * - Heap: Ordered by priority
 * - Hash Map: Unordered, O(1) lookup by key
 * - Often used together! (e.g., LRU cache with eviction)
 * 
 * TWO HEAPS PATTERN:
 * For finding median of a stream:
 * - Max heap for smaller half
 * - Min heap for larger half
 * - Balance sizes to differ by at most 1
 * - Median is at root(s)
 * 
 * SPECIAL HEAP VARIANTS:
 * - Fibonacci Heap: O(1) amortized insert, decrease-key
 * - Binomial Heap: O(log n) merge operation
 * - d-ary Heap: Each node has d children (not just 2)
 * 
 * ============================================================================
 */

// ============================================================================
// MIN HEAP IMPLEMENTATION
// ============================================================================

class MinHeap<T> {
  private heap: T[];
  private compareFn: (a: T, b: T) => number;

  constructor(compareFn?: (a: T, b: T) => number) {
    this.heap = [];
    this.compareFn = compareFn || ((a: any, b: any) => a - b);
  }

  /**
   * Get parent index
   */
  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  /**
   * Get left child index
   */
  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  /**
   * Get right child index
   */
  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  /**
   * Swap elements
   */
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  /**
   * Insert element
   * Time: O(log n)
   */
  insert(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Bubble up (heapify up)
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIdx = this.parent(index);
      
      if (this.compareFn(this.heap[index], this.heap[parentIdx]) < 0) {
        this.swap(index, parentIdx);
        index = parentIdx;
      } else {
        break;
      }
    }
  }

  /**
   * Extract minimum element
   * Time: O(log n)
   */
  extractMin(): T | undefined {
    if (this.isEmpty()) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    
    return min;
  }

  /**
   * Bubble down (heapify down)
   */
  private bubbleDown(index: number): void {
    while (this.leftChild(index) < this.heap.length) {
      let smallerChild = this.leftChild(index);
      const rightChild = this.rightChild(index);
      
      if (
        rightChild < this.heap.length &&
        this.compareFn(this.heap[rightChild], this.heap[smallerChild]) < 0
      ) {
        smallerChild = rightChild;
      }
      
      if (this.compareFn(this.heap[smallerChild], this.heap[index]) < 0) {
        this.swap(index, smallerChild);
        index = smallerChild;
      } else {
        break;
      }
    }
  }

  /**
   * Peek at minimum element
   * Time: O(1)
   */
  peek(): T | undefined {
    return this.heap[0];
  }

  /**
   * Get size
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Check if empty
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Build heap from array
   * Time: O(n)
   */
  static buildHeap<T>(arr: T[], compareFn?: (a: T, b: T) => number): MinHeap<T> {
    const heap = new MinHeap(compareFn);
    heap.heap = [...arr];
    
    // Start from last non-leaf node and heapify down
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heap.bubbleDown(i);
    }
    
    return heap;
  }

  /**
   * Convert to array
   */
  toArray(): T[] {
    return [...this.heap];
  }
}

// ============================================================================
// MAX HEAP IMPLEMENTATION
// ============================================================================

class MaxHeap<T> {
  private minHeap: MinHeap<T>;

  constructor(compareFn?: (a: T, b: T) => number) {
    // Reverse the comparison for max heap
    const maxCompareFn = compareFn
      ? (a: T, b: T) => -compareFn(a, b)
      : (a: any, b: any) => b - a;
    
    this.minHeap = new MinHeap(maxCompareFn);
  }

  insert(value: T): void {
    this.minHeap.insert(value);
  }

  extractMax(): T | undefined {
    return this.minHeap.extractMin();
  }

  peek(): T | undefined {
    return this.minHeap.peek();
  }

  size(): number {
    return this.minHeap.size();
  }

  isEmpty(): boolean {
    return this.minHeap.isEmpty();
  }

  toArray(): T[] {
    return this.minHeap.toArray();
  }
}

// ============================================================================
// PRIORITY QUEUE
// ============================================================================

class PriorityQueue<T> {
  private heap: MinHeap<[number, T]>;

  constructor() {
    this.heap = new MinHeap((a, b) => a[0] - b[0]);
  }

  /**
   * Enqueue with priority (lower number = higher priority)
   */
  enqueue(item: T, priority: number): void {
    this.heap.insert([priority, item]);
  }

  /**
   * Dequeue highest priority item
   */
  dequeue(): T | undefined {
    const entry = this.heap.extractMin();
    return entry ? entry[1] : undefined;
  }

  peek(): T | undefined {
    const entry = this.heap.peek();
    return entry ? entry[1] : undefined;
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  size(): number {
    return this.heap.size();
  }
}

// ============================================================================
// HEAP ALGORITHMS
// ============================================================================

class HeapAlgorithms {
  /**
   * Kth Largest Element
   * Time: O(n log k), Space: O(k)
   */
  static findKthLargest(nums: number[], k: number): number {
    const minHeap = new MinHeap<number>();
    
    for (const num of nums) {
      minHeap.insert(num);
      
      if (minHeap.size() > k) {
        minHeap.extractMin();
      }
    }
    
    return minHeap.peek()!;
  }

  /**
   * Top K Frequent Elements
   * Time: O(n log k), Space: O(n)
   */
  static topKFrequent(nums: number[], k: number): number[] {
    const freqMap = new Map<number, number>();
    
    for (const num of nums) {
      freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    const minHeap = new MinHeap<[number, number]>((a, b) => a[1] - b[1]);
    
    for (const [num, freq] of freqMap) {
      minHeap.insert([num, freq]);
      
      if (minHeap.size() > k) {
        minHeap.extractMin();
      }
    }
    
    return minHeap.toArray().map(([num]) => num);
  }

  /**
   * Merge K Sorted Lists
   * Time: O(N log k) where N is total elements, Space: O(k)
   */
  static mergeKSortedArrays(arrays: number[][]): number[] {
    const minHeap = new MinHeap<[number, number, number]>(
      (a, b) => a[0] - b[0] // Compare by value
    );
    
    // Initialize heap with first element from each array
    for (let i = 0; i < arrays.length; i++) {
      if (arrays[i].length > 0) {
        minHeap.insert([arrays[i][0], i, 0]); // [value, arrayIndex, elementIndex]
      }
    }
    
    const result: number[] = [];
    
    while (!minHeap.isEmpty()) {
      const [value, arrayIdx, elemIdx] = minHeap.extractMin()!;
      result.push(value);
      
      // Add next element from same array
      if (elemIdx + 1 < arrays[arrayIdx].length) {
        minHeap.insert([
          arrays[arrayIdx][elemIdx + 1],
          arrayIdx,
          elemIdx + 1
        ]);
      }
    }
    
    return result;
  }

  /**
   * Find Median from Data Stream
   */
  static class MedianFinder {
    private maxHeap: MaxHeap<number>; // Lower half
    private minHeap: MinHeap<number>; // Upper half

    constructor() {
      this.maxHeap = new MaxHeap();
      this.minHeap = new MinHeap();
    }

    /**
     * Add number
     * Time: O(log n)
     */
    addNum(num: number): void {
      if (this.maxHeap.isEmpty() || num <= this.maxHeap.peek()!) {
        this.maxHeap.insert(num);
      } else {
        this.minHeap.insert(num);
      }
      
      // Balance heaps
      if (this.maxHeap.size() > this.minHeap.size() + 1) {
        this.minHeap.insert(this.maxHeap.extractMax()!);
      } else if (this.minHeap.size() > this.maxHeap.size()) {
        this.maxHeap.insert(this.minHeap.extractMin()!);
      }
    }

    /**
     * Find median
     * Time: O(1)
     */
    findMedian(): number {
      if (this.maxHeap.size() === this.minHeap.size()) {
        return (this.maxHeap.peek()! + this.minHeap.peek()!) / 2;
      } else {
        return this.maxHeap.peek()!;
      }
    }
  }

  /**
   * Kth Smallest Element in Sorted Matrix
   * Time: O(k log n), Space: O(n)
   */
  static kthSmallest(matrix: number[][], k: number): number {
    const n = matrix.length;
    const minHeap = new MinHeap<[number, number, number]>(
      (a, b) => a[0] - b[0]
    );
    
    // Add first element from each row
    for (let i = 0; i < Math.min(n, k); i++) {
      minHeap.insert([matrix[i][0], i, 0]);
    }
    
    let result = 0;
    for (let i = 0; i < k; i++) {
      const [value, row, col] = minHeap.extractMin()!;
      result = value;
      
      if (col + 1 < n) {
        minHeap.insert([matrix[row][col + 1], row, col + 1]);
      }
    }
    
    return result;
  }

  /**
   * Task Scheduler
   * Time: O(n), Space: O(26)
   */
  static leastInterval(tasks: string[], n: number): number {
    const freqMap = new Map<string, number>();
    
    for (const task of tasks) {
      freqMap.set(task, (freqMap.get(task) || 0) + 1);
    }
    
    const maxHeap = new MaxHeap<number>();
    for (const freq of freqMap.values()) {
      maxHeap.insert(freq);
    }
    
    let time = 0;
    
    while (!maxHeap.isEmpty()) {
      const temp: number[] = [];
      
      for (let i = 0; i <= n; i++) {
        if (!maxHeap.isEmpty()) {
          const freq = maxHeap.extractMax()!;
          if (freq > 1) {
            temp.push(freq - 1);
          }
        }
      }
      
      for (const freq of temp) {
        maxHeap.insert(freq);
      }
      
      time += maxHeap.isEmpty() ? temp.length + 1 : n + 1;
    }
    
    return time;
  }

  /**
   * Sliding Window Median
   * Time: O(n log k), Space: O(k)
   */
  static medianSlidingWindow(nums: number[], k: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i <= nums.length - k; i++) {
      const window = nums.slice(i, i + k).sort((a, b) => a - b);
      
      if (k % 2 === 0) {
        result.push((window[k / 2 - 1] + window[k / 2]) / 2);
      } else {
        result.push(window[Math.floor(k / 2)]);
      }
    }
    
    return result;
  }

  /**
   * Heap Sort
   * Time: O(n log n), Space: O(1)
   */
  static heapSort(arr: number[]): number[] {
    const heap = MinHeap.buildHeap(arr);
    const sorted: number[] = [];
    
    while (!heap.isEmpty()) {
      sorted.push(heap.extractMin()!);
    }
    
    return sorted;
  }

  /**
   * Find K Closest Points to Origin
   * Time: O(n log k), Space: O(k)
   */
  static kClosest(points: [number, number][], k: number): [number, number][] {
    const maxHeap = new MaxHeap<[number, [number, number]]>(
      (a, b) => a[0] - b[0]
    );
    
    for (const point of points) {
      const [x, y] = point;
      const distance = x * x + y * y;
      
      maxHeap.insert([distance, point]);
      
      if (maxHeap.size() > k) {
        maxHeap.extractMax();
      }
    }
    
    return maxHeap.toArray().map(([, point]) => point);
  }

  /**
   * Reorganize String (no adjacent duplicates)
   * Time: O(n log 26), Space: O(26)
   */
  static reorganizeString(s: string): string {
    const freqMap = new Map<string, number>();
    
    for (const char of s) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
    
    const maxHeap = new MaxHeap<[string, number]>(
      (a, b) => a[1] - b[1]
    );
    
    for (const [char, freq] of freqMap) {
      maxHeap.insert([char, freq]);
    }
    
    let result = '';
    let prev: [string, number] | null = null;
    
    while (!maxHeap.isEmpty() || prev) {
      if (prev && maxHeap.isEmpty()) {
        return ''; // Not possible
      }
      
      const [char, freq] = maxHeap.extractMax()!;
      result += char;
      
      if (prev) {
        maxHeap.insert(prev);
      }
      
      prev = freq - 1 > 0 ? [char, freq - 1] : null;
    }
    
    return result;
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log('=== Min Heap Operations ===');
const minHeap = new MinHeap<number>();
[5, 3, 7, 1, 9, 2].forEach(num => minHeap.insert(num));
console.log('Heap:', minHeap.toArray());
console.log('Extract Min:', minHeap.extractMin());
console.log('Peek:', minHeap.peek());

console.log('\n=== Max Heap Operations ===');
const maxHeap = new MaxHeap<number>();
[5, 3, 7, 1, 9, 2].forEach(num => maxHeap.insert(num));
console.log('Heap:', maxHeap.toArray());
console.log('Extract Max:', maxHeap.extractMax());
console.log('Peek:', maxHeap.peek());

console.log('\n=== Priority Queue ===');
const pq = new PriorityQueue<string>();
pq.enqueue('Task A', 3);
pq.enqueue('Task B', 1);
pq.enqueue('Task C', 2);
console.log('Dequeue:', pq.dequeue());
console.log('Dequeue:', pq.dequeue());

console.log('\n=== Heap Algorithms ===');
console.log('Kth Largest (k=3):', HeapAlgorithms.findKthLargest([3, 2, 1, 5, 6, 4], 3));
console.log('Top 2 Frequent:', HeapAlgorithms.topKFrequent([1, 1, 1, 2, 2, 3], 2));
console.log('Merge K Sorted:', HeapAlgorithms.mergeKSortedArrays([[1, 4, 5], [1, 3, 4], [2, 6]]));
console.log('Heap Sort:', HeapAlgorithms.heapSort([5, 3, 7, 1, 9, 2]));
console.log('K Closest Points:', HeapAlgorithms.kClosest([[1, 3], [3, 4], [2, -1]], 2));

console.log('\n=== Median Finder ===');
const medianFinder = new HeapAlgorithms.MedianFinder();
medianFinder.addNum(1);
medianFinder.addNum(2);
console.log('Median:', medianFinder.findMedian());
medianFinder.addNum(3);
console.log('Median:', medianFinder.findMedian());

export { MinHeap, MaxHeap, PriorityQueue, HeapAlgorithms };

