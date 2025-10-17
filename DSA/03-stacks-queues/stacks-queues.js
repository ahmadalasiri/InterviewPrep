/**
 * Stacks and Queues - JavaScript Implementation
 *
 * Topics covered:
 * - Stack (LIFO)
 * - Queue (FIFO)
 * - Priority Queue
 * - Common problems
 */

// ============================================
// STACK IMPLEMENTATION
// ============================================

class Stack {
  constructor() {
    this.items = [];
  }

  // Add element to top - O(1)
  push(element) {
    this.items.push(element);
  }

  // Remove and return top element - O(1)
  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items.pop();
  }

  // View top element without removing - O(1)
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  // Check if stack is empty - O(1)
  isEmpty() {
    return this.items.length === 0;
  }

  // Get size - O(1)
  size() {
    return this.items.length;
  }

  // Clear stack - O(1)
  clear() {
    this.items = [];
  }

  // Print stack
  print() {
    console.log(this.items.join(" <- "));
  }
}

// ============================================
// QUEUE IMPLEMENTATION
// ============================================

class Queue {
  constructor() {
    this.items = [];
  }

  // Add element to rear - O(1)
  enqueue(element) {
    this.items.push(element);
  }

  // Remove and return front element - O(n) [Use LinkedList for O(1)]
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items.shift();
  }

  // View front element - O(1)
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  // Check if queue is empty - O(1)
  isEmpty() {
    return this.items.length === 0;
  }

  // Get size - O(1)
  size() {
    return this.items.length;
  }

  // Clear queue - O(1)
  clear() {
    this.items = [];
  }

  // Print queue
  print() {
    console.log(this.items.join(" <- "));
  }
}

// ============================================
// EFFICIENT QUEUE (Using Object)
// ============================================

class EfficientQueue {
  constructor() {
    this.items = {};
    this.front = 0;
    this.rear = 0;
  }

  // Add element - O(1)
  enqueue(element) {
    this.items[this.rear] = element;
    this.rear++;
  }

  // Remove element - O(1)
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const item = this.items[this.front];
    delete this.items[this.front];
    this.front++;
    return item;
  }

  // View front - O(1)
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.front];
  }

  // Check if empty - O(1)
  isEmpty() {
    return this.rear === this.front;
  }

  // Get size - O(1)
  size() {
    return this.rear - this.front;
  }

  // Clear - O(1)
  clear() {
    this.items = {};
    this.front = 0;
    this.rear = 0;
  }
}

// ============================================
// MIN STACK
// ============================================

class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);

    if (this.minStack.length === 0 || val <= this.getMin()) {
      this.minStack.push(val);
    }
  }

  pop() {
    if (this.stack.length === 0) return null;

    const val = this.stack.pop();

    if (val === this.getMin()) {
      this.minStack.pop();
    }

    return val;
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// ============================================
// STACK USING QUEUES
// ============================================

class StackUsingQueues {
  constructor() {
    this.queue = [];
  }

  push(x) {
    this.queue.push(x);

    // Rotate queue to make last element first
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift());
    }
  }

  pop() {
    return this.queue.shift();
  }

  top() {
    return this.queue[0];
  }

  empty() {
    return this.queue.length === 0;
  }
}

// ============================================
// QUEUE USING STACKS
// ============================================

class QueueUsingStacks {
  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  enqueue(x) {
    this.stack1.push(x);
  }

  dequeue() {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2.pop();
  }

  peek() {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2[this.stack2.length - 1];
  }

  empty() {
    return this.stack1.length === 0 && this.stack2.length === 0;
  }
}

// ============================================
// COMMON PROBLEMS
// ============================================

/**
 * Valid Parentheses (LeetCode 20)
 * Time: O(n), Space: O(n)
 */
function isValid(s) {
  const stack = [];
  const pairs = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  for (let char of s) {
    if ("({[".includes(char)) {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

/**
 * Evaluate Reverse Polish Notation (LeetCode 150)
 * Time: O(n), Space: O(n)
 */
function evalRPN(tokens) {
  const stack = [];
  const operators = new Set(["+", "-", "*", "/"]);

  for (let token of tokens) {
    if (operators.has(token)) {
      const b = stack.pop();
      const a = stack.pop();

      let result;
      switch (token) {
        case "+":
          result = a + b;
          break;
        case "-":
          result = a - b;
          break;
        case "*":
          result = a * b;
          break;
        case "/":
          result = Math.trunc(a / b);
          break;
      }

      stack.push(result);
    } else {
      stack.push(parseInt(token));
    }
  }

  return stack[0];
}

/**
 * Daily Temperatures (LeetCode 739)
 * Time: O(n), Space: O(n)
 */
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // Store indices

  for (let i = 0; i < n; i++) {
    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const prevIndex = stack.pop();
      answer[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }

  return answer;
}

/**
 * Next Greater Element I (LeetCode 496)
 * Time: O(n + m), Space: O(n)
 */
function nextGreaterElement(nums1, nums2) {
  const map = new Map();
  const stack = [];

  // Find next greater for all elements in nums2
  for (let num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      map.set(stack.pop(), num);
    }
    stack.push(num);
  }

  // Map results for nums1
  return nums1.map((num) => map.get(num) || -1);
}

/**
 * Largest Rectangle in Histogram (LeetCode 84)
 * Time: O(n), Space: O(n)
 */
function largestRectangleArea(heights) {
  const stack = [];
  let maxArea = 0;

  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];

    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
  }

  return maxArea;
}

/**
 * Implement Queue using Circular Array
 */
class CircularQueue {
  constructor(k) {
    this.queue = new Array(k);
    this.size = k;
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }

  enQueue(value) {
    if (this.isFull()) return false;

    this.rear = (this.rear + 1) % this.size;
    this.queue[this.rear] = value;
    this.count++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;

    this.front = (this.front + 1) % this.size;
    this.count--;
    return true;
  }

  Front() {
    if (this.isEmpty()) return -1;
    return this.queue[this.front];
  }

  Rear() {
    if (this.isEmpty()) return -1;
    return this.queue[this.rear];
  }

  isEmpty() {
    return this.count === 0;
  }

  isFull() {
    return this.count === this.size;
  }
}

/**
 * Sliding Window Maximum (LeetCode 239)
 * Time: O(n), Space: O(k)
 */
function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // Store indices

  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift();
    }

    // Remove smaller elements from rear
    while (deque.length > 0 && nums[i] > nums[deque[deque.length - 1]]) {
      deque.pop();
    }

    deque.push(i);

    // Add to result when window is complete
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

/**
 * Remove All Adjacent Duplicates In String (LeetCode 1047)
 * Time: O(n), Space: O(n)
 */
function removeDuplicates(s) {
  const stack = [];

  for (let char of s) {
    if (stack.length > 0 && stack[stack.length - 1] === char) {
      stack.pop();
    } else {
      stack.push(char);
    }
  }

  return stack.join("");
}

/**
 * Decode String (LeetCode 394)
 * Time: O(n), Space: O(n)
 */
function decodeString(s) {
  const stack = [];
  let currentNum = 0;
  let currentStr = "";

  for (let char of s) {
    if (char >= "0" && char <= "9") {
      currentNum = currentNum * 10 + parseInt(char);
    } else if (char === "[") {
      stack.push(currentStr);
      stack.push(currentNum);
      currentStr = "";
      currentNum = 0;
    } else if (char === "]") {
      const num = stack.pop();
      const prevStr = stack.pop();
      currentStr = prevStr + currentStr.repeat(num);
    } else {
      currentStr += char;
    }
  }

  return currentStr;
}

// ============================================
// TESTS
// ============================================

function runTests() {
  console.log("=== Stack Tests ===");
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  console.log("Stack:", stack.items); // [1, 2, 3]
  console.log("Pop:", stack.pop()); // 3
  console.log("Peek:", stack.peek()); // 2

  console.log("\n=== Queue Tests ===");
  const queue = new Queue();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  console.log("Queue:", queue.items); // [1, 2, 3]
  console.log("Dequeue:", queue.dequeue()); // 1
  console.log("Peek:", queue.peek()); // 2

  console.log("\n=== Problem Tests ===");
  console.log("Valid Parentheses:", isValid("()[]{}")); // true
  console.log("Valid Parentheses:", isValid("(]")); // false

  console.log("Eval RPN:", evalRPN(["2", "1", "+", "3", "*"])); // 9

  console.log(
    "Daily Temperatures:",
    dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])
  );
  // [1, 1, 4, 2, 1, 1, 0, 0]

  console.log("Remove Duplicates:", removeDuplicates("abbaca")); // "ca"

  console.log("Decode String:", decodeString("3[a2[c]]")); // "accaccacc"

  console.log("\n=== Min Stack Tests ===");
  const minStack = new MinStack();
  minStack.push(-2);
  minStack.push(0);
  minStack.push(-3);
  console.log("Min:", minStack.getMin()); // -3
  minStack.pop();
  console.log("Top:", minStack.top()); // 0
  console.log("Min:", minStack.getMin()); // -2
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  Stack,
  Queue,
  EfficientQueue,
  MinStack,
  StackUsingQueues,
  QueueUsingStacks,
  CircularQueue,
  isValid,
  evalRPN,
  dailyTemperatures,
  nextGreaterElement,
  largestRectangleArea,
  maxSlidingWindow,
  removeDuplicates,
  decodeString,
};
