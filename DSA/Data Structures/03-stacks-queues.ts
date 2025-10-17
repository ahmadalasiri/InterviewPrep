/**
 * ============================================================================
 * STACKS & QUEUES - COMPREHENSIVE GUIDE
 * ============================================================================
 * 
 * WHAT IS A STACK?
 * ----------------
 * A stack is a linear data structure that follows the LIFO (Last In, First Out)
 * principle. Think of it like a stack of plates - you can only add or remove
 * from the top.
 * 
 * STACK OPERATIONS:
 * - Push: Add element to top - O(1)
 * - Pop: Remove and return top element - O(1)
 * - Peek/Top: View top element without removing - O(1)
 * - isEmpty: Check if stack is empty - O(1)
 * - Search: Find element - O(n)
 * 
 * STACK USE CASES:
 * - Function call stack (recursion)
 * - Undo/Redo operations
 * - Expression evaluation (postfix, infix)
 * - Parentheses matching
 * - Backtracking algorithms
 * - Browser history (back button)
 * - Depth-First Search (DFS)
 * 
 * COMMON STACK INTERVIEW QUESTIONS:
 * 1. Valid Parentheses
 * 2. Min Stack (design problem)
 * 3. Evaluate Reverse Polish Notation
 * 4. Daily Temperatures (monotonic stack)
 * 5. Largest Rectangle in Histogram
 * 6. Next Greater Element
 * 7. Simplify Path
 * 8. Decode String
 * 
 * ============================================================================
 * 
 * WHAT IS A QUEUE?
 * ----------------
 * A queue is a linear data structure that follows the FIFO (First In, First Out)
 * principle. Think of it like a line at a store - first person in line is
 * first to be served.
 * 
 * QUEUE OPERATIONS:
 * - Enqueue: Add element to rear - O(1)
 * - Dequeue: Remove and return front element - O(1)
 * - Peek/Front: View front element without removing - O(1)
 * - isEmpty: Check if queue is empty - O(1)
 * - Search: Find element - O(n)
 * 
 * QUEUE TYPES:
 * 1. Simple Queue: Basic FIFO
 * 2. Circular Queue: Last position connects to first
 * 3. Deque: Double-ended queue (insert/delete from both ends)
 * 4. Priority Queue: Elements have priority (implemented with heap)
 * 
 * QUEUE USE CASES:
 * - Task scheduling
 * - Breadth-First Search (BFS)
 * - Request handling (web servers)
 * - Message queues
 * - Print spooling
 * - Level order tree traversal
 * 
 * COMMON QUEUE INTERVIEW QUESTIONS:
 * 1. Implement Queue using Stacks
 * 2. Implement Stack using Queues
 * 3. Design Circular Queue
 * 4. Moving Average from Data Stream
 * 5. Number of Recent Calls
 * 6. Design Hit Counter
 * 7. Sliding Window Maximum (monotonic queue)
 * 
 * ============================================================================
 * 
 * STACK vs QUEUE:
 * - Stack: LIFO - Last In, First Out (like a stack of books)
 * - Queue: FIFO - First In, First Out (like a line of people)
 * 
 * IMPLEMENTATION OPTIONS:
 * 1. Array-based: Simple but may need resizing
 * 2. Linked List-based: Dynamic size, no resizing needed
 * 
 * SPECIAL VARIATIONS:
 * - Monotonic Stack: Maintains elements in increasing/decreasing order
 * - Monotonic Queue: Similar concept for queues
 * - Min/Max Stack: Track minimum/maximum at each state
 * 
 * ============================================================================
 */

// ============================================================================
// STACK IMPLEMENTATION
// ============================================================================

class Stack<T> {
  private items: T[] = [];

  /**
   * Add element to top
   * Time: O(1)
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Remove and return top element
   * Time: O(1)
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Return top element without removing
   * Time: O(1)
   */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// ============================================================================
// QUEUE IMPLEMENTATION
// ============================================================================

class Queue<T> {
  private items: T[] = [];
  private front: number = 0;

  /**
   * Add element to back
   * Time: O(1)
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Remove and return front element
   * Time: O(1) amortized
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    
    const item = this.items[this.front];
    this.front++;
    
    // Reset array when half is unused
    if (this.front > this.items.length / 2) {
      this.items = this.items.slice(this.front);
      this.front = 0;
    }
    
    return item;
  }

  /**
   * Return front element without removing
   * Time: O(1)
   */
  peek(): T | undefined {
    return this.items[this.front];
  }

  isEmpty(): boolean {
    return this.front >= this.items.length;
  }

  size(): number {
    return this.items.length - this.front;
  }

  clear(): void {
    this.items = [];
    this.front = 0;
  }

  toArray(): T[] {
    return this.items.slice(this.front);
  }
}

// ============================================================================
// DEQUE (Double-Ended Queue)
// ============================================================================

class Deque<T> {
  private items: T[] = [];

  addFront(item: T): void {
    this.items.unshift(item);
  }

  addRear(item: T): void {
    this.items.push(item);
  }

  removeFront(): T | undefined {
    return this.items.shift();
  }

  removeRear(): T | undefined {
    return this.items.pop();
  }

  peekFront(): T | undefined {
    return this.items[0];
  }

  peekRear(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// ============================================================================
// MIN/MAX STACK
// ============================================================================

class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    
    if (this.minStack.length === 0 || val <= this.getMin()) {
      this.minStack.push(val);
    }
  }

  pop(): void {
    const val = this.stack.pop();
    
    if (val === this.getMin()) {
      this.minStack.pop();
    }
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

// ============================================================================
// STACK ALGORITHMS
// ============================================================================

class StackAlgorithms {
  /**
   * Check if parentheses are balanced
   * Time: O(n), Space: O(n)
   */
  static isValidParentheses(s: string): boolean {
    const stack = new Stack<string>();
    const pairs: { [key: string]: string } = {
      ')': '(',
      '}': '{',
      ']': '['
    };
    
    for (const char of s) {
      if (char === '(' || char === '{' || char === '[') {
        stack.push(char);
      } else if (char === ')' || char === '}' || char === ']') {
        if (stack.isEmpty() || stack.pop() !== pairs[char]) {
          return false;
        }
      }
    }
    
    return stack.isEmpty();
  }

  /**
   * Evaluate Reverse Polish Notation (RPN)
   * Time: O(n), Space: O(n)
   */
  static evalRPN(tokens: string[]): number {
    const stack = new Stack<number>();
    const operators = new Set(['+', '-', '*', '/']);
    
    for (const token of tokens) {
      if (operators.has(token)) {
        const b = stack.pop()!;
        const a = stack.pop()!;
        
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(Math.trunc(a / b)); break;
        }
      } else {
        stack.push(parseInt(token));
      }
    }
    
    return stack.pop()!;
  }

  /**
   * Next Greater Element
   * Time: O(n), Space: O(n)
   */
  static nextGreaterElement(nums: number[]): number[] {
    const result = new Array(nums.length).fill(-1);
    const stack = new Stack<number>();
    
    for (let i = 0; i < nums.length; i++) {
      while (!stack.isEmpty() && nums[stack.peek()!] < nums[i]) {
        const idx = stack.pop()!;
        result[idx] = nums[i];
      }
      stack.push(i);
    }
    
    return result;
  }

  /**
   * Largest Rectangle in Histogram
   * Time: O(n), Space: O(n)
   */
  static largestRectangle(heights: number[]): number {
    const stack = new Stack<number>();
    let maxArea = 0;
    
    for (let i = 0; i <= heights.length; i++) {
      const currentHeight = i === heights.length ? 0 : heights[i];
      
      while (!stack.isEmpty() && heights[stack.peek()!] > currentHeight) {
        const height = heights[stack.pop()!];
        const width = stack.isEmpty() ? i : i - stack.peek()! - 1;
        maxArea = Math.max(maxArea, height * width);
      }
      
      stack.push(i);
    }
    
    return maxArea;
  }

  /**
   * Simplify Unix Path
   * Time: O(n), Space: O(n)
   */
  static simplifyPath(path: string): string {
    const stack = new Stack<string>();
    const parts = path.split('/');
    
    for (const part of parts) {
      if (part === '' || part === '.') {
        continue;
      } else if (part === '..') {
        if (!stack.isEmpty()) {
          stack.pop();
        }
      } else {
        stack.push(part);
      }
    }
    
    return '/' + stack.toArray().join('/');
  }

  /**
   * Daily Temperatures (Next Warmer Day)
   * Time: O(n), Space: O(n)
   */
  static dailyTemperatures(temperatures: number[]): number[] {
    const result = new Array(temperatures.length).fill(0);
    const stack = new Stack<number>();
    
    for (let i = 0; i < temperatures.length; i++) {
      while (!stack.isEmpty() && temperatures[stack.peek()!] < temperatures[i]) {
        const idx = stack.pop()!;
        result[idx] = i - idx;
      }
      stack.push(i);
    }
    
    return result;
  }
}

// ============================================================================
// QUEUE ALGORITHMS
// ============================================================================

class QueueAlgorithms {
  /**
   * Implement Stack using Queues
   */
  static class StackUsingQueues<T> {
    private q1 = new Queue<T>();
    private q2 = new Queue<T>();

    push(x: T): void {
      this.q2.enqueue(x);
      
      while (!this.q1.isEmpty()) {
        this.q2.enqueue(this.q1.dequeue()!);
      }
      
      [this.q1, this.q2] = [this.q2, this.q1];
    }

    pop(): T | undefined {
      return this.q1.dequeue();
    }

    top(): T | undefined {
      return this.q1.peek();
    }

    empty(): boolean {
      return this.q1.isEmpty();
    }
  }

  /**
   * Moving Average from Data Stream
   */
  static class MovingAverage {
    private queue = new Queue<number>();
    private sum = 0;

    constructor(private size: number) {}

    next(val: number): number {
      this.queue.enqueue(val);
      this.sum += val;
      
      if (this.queue.size() > this.size) {
        this.sum -= this.queue.dequeue()!;
      }
      
      return this.sum / this.queue.size();
    }
  }

  /**
   * Design Circular Queue
   */
  static class CircularQueue<T> {
    private items: (T | null)[];
    private front = 0;
    private rear = -1;
    private count = 0;

    constructor(private capacity: number) {
      this.items = new Array(capacity).fill(null);
    }

    enqueue(item: T): boolean {
      if (this.isFull()) return false;
      
      this.rear = (this.rear + 1) % this.capacity;
      this.items[this.rear] = item;
      this.count++;
      return true;
    }

    dequeue(): T | null {
      if (this.isEmpty()) return null;
      
      const item = this.items[this.front];
      this.front = (this.front + 1) % this.capacity;
      this.count--;
      return item;
    }

    peek(): T | null {
      return this.isEmpty() ? null : this.items[this.front];
    }

    isEmpty(): boolean {
      return this.count === 0;
    }

    isFull(): boolean {
      return this.count === this.capacity;
    }
  }

  /**
   * First Unique Character using Queue
   * Time: O(n), Space: O(n)
   */
  static firstUniqChar(s: string): number {
    const count = new Map<string, number>();
    const queue = new Queue<number>();
    
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      count.set(char, (count.get(char) || 0) + 1);
      queue.enqueue(i);
    }
    
    while (!queue.isEmpty()) {
      const idx = queue.peek()!;
      if (count.get(s[idx]) === 1) {
        return idx;
      }
      queue.dequeue();
    }
    
    return -1;
  }
}

// ============================================================================
// MONOTONIC STACK/QUEUE
// ============================================================================

class MonotonicQueue {
  private deque = new Deque<number>();

  /**
   * Add element (maintain decreasing order)
   */
  push(val: number): void {
    while (!this.deque.isEmpty() && this.deque.peekRear()! < val) {
      this.deque.removeRear();
    }
    this.deque.addRear(val);
  }

  /**
   * Remove element if it's at front
   */
  pop(val: number): void {
    if (!this.deque.isEmpty() && this.deque.peekFront() === val) {
      this.deque.removeFront();
    }
  }

  /**
   * Get maximum element
   */
  max(): number {
    return this.deque.peekFront()!;
  }
}

/**
 * Sliding Window Maximum using Monotonic Queue
 * Time: O(n), Space: O(k)
 */
function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const mq = new MonotonicQueue();
  
  for (let i = 0; i < nums.length; i++) {
    mq.push(nums[i]);
    
    if (i >= k - 1) {
      result.push(mq.max());
      mq.pop(nums[i - k + 1]);
    }
  }
  
  return result;
}

// ============================================================================
// TESTING
// ============================================================================

console.log('=== Stack Operations ===');
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log('Stack:', stack.toArray());
console.log('Pop:', stack.pop());
console.log('Peek:', stack.peek());

console.log('\n=== Queue Operations ===');
const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log('Queue:', queue.toArray());
console.log('Dequeue:', queue.dequeue());
console.log('Peek:', queue.peek());

console.log('\n=== Stack Algorithms ===');
console.log('Valid Parentheses:', StackAlgorithms.isValidParentheses('({[]})'));
console.log('Eval RPN:', StackAlgorithms.evalRPN(['2', '1', '+', '3', '*']));
console.log('Next Greater:', StackAlgorithms.nextGreaterElement([2, 1, 2, 4, 3]));
console.log('Simplify Path:', StackAlgorithms.simplifyPath('/a/./b/../../c/'));
console.log('Daily Temps:', StackAlgorithms.dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));

console.log('\n=== Min Stack ===');
const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log('Min:', minStack.getMin());
minStack.pop();
console.log('Top:', minStack.top());
console.log('Min:', minStack.getMin());

console.log('\n=== Sliding Window Maximum ===');
console.log('Max Sliding Window:', maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));

export {
  Stack,
  Queue,
  Deque,
  MinStack,
  StackAlgorithms,
  QueueAlgorithms,
  MonotonicQueue,
  maxSlidingWindow
};

