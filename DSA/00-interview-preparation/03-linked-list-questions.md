# Linked List Interview Questions

## Table of Contents

- [Linked List Basics](#linked-list-basics)
- [Two Pointer Technique](#two-pointer-technique)
- [Reversal Problems](#reversal-problems)
- [Cycle Detection](#cycle-detection)
- [Merge and Sort](#merge-and-sort)

---

## Linked List Basics

### Q1: When would you use a linked list over an array?

**Difficulty:** ⭐ Easy

**Answer:**

**Use Linked Lists when:**

1. Frequent insertions/deletions at beginning: O(1)
2. Size is unknown or varies dramatically
3. Don't need random access to elements
4. Want O(1) insertions at known positions

**Use Arrays when:**

1. Need fast random access by index: O(1)
2. Size is known in advance
3. Memory locality is important (cache performance)
4. Sequential access pattern

**Comparison:**

| Operation         | Array       | Linked List      |
| ----------------- | ----------- | ---------------- |
| Access by index   | O(1)        | O(n)             |
| Search            | O(n)        | O(n)             |
| Insert at start   | O(n)        | O(1)             |
| Insert at end     | O(1)\*      | O(n)\*\*         |
| Delete at start   | O(n)        | O(1)             |
| Space per element | No overhead | Pointer overhead |

\* Amortized for dynamic arrays  
\*\* O(1) with tail pointer

---

### Q2: Implement a singly linked list with insert, delete, and search operations

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Insert at beginning - O(1)
  insertFirst(val) {
    const newNode = new ListNode(val);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  // Insert at end - O(n)
  insertLast(val) {
    const newNode = new ListNode(val);

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  // Delete by value - O(n)
  delete(val) {
    if (!this.head) return false;

    if (this.head.val === val) {
      this.head = this.head.next;
      this.size--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.val === val) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  // Search - O(n)
  search(val) {
    let current = this.head;

    while (current) {
      if (current.val === val) return true;
      current = current.next;
    }

    return false;
  }
}
```

---

## Two Pointer Technique

### Q3: Find the middle of a linked list

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function middleNode(head) {
  let slow = head;
  let fast = head;

  // Fast moves twice as fast as slow
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

// Example:
// 1 -> 2 -> 3 -> 4 -> 5
// slow: 1 -> 2 -> 3 (middle)
// fast: 1 -> 3 -> 5 -> null

// Time: O(n), Space: O(1)
```

**For even-length lists:**

- Returns second middle node by default
- For first middle: `while (fast.next && fast.next.next)`

---

### Q4: Remove Nth node from end of list (LeetCode 19)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;

  let first = dummy;
  let second = dummy;

  // Move first n+1 steps ahead
  for (let i = 0; i <= n; i++) {
    first = first.next;
  }

  // Move both pointers until first reaches end
  while (first) {
    first = first.next;
    second = second.next;
  }

  // Remove nth node
  second.next = second.next.next;

  return dummy.next;
}

// Visualization for removing 2nd from end:
// List: 1 -> 2 -> 3 -> 4 -> 5, n = 2
//
// Step 1: Move first 3 steps
// dummy -> 1 -> 2 -> 3 -> 4 -> 5
// second           first
//
// Step 2: Move both until first reaches end
// dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
//                   second      first
//
// Step 3: Remove second.next (4)

// Time: O(n), Space: O(1)
```

---

## Reversal Problems

### Q5: Reverse a linked list (LeetCode 206)

**Difficulty:** ⭐ Easy

**Answer:**

**Iterative Approach:**

```javascript
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next; // Save next
    current.next = prev; // Reverse pointer
    prev = current; // Move prev forward
    current = next; // Move current forward
  }

  return prev;
}

// Visualization:
// Original: 1 -> 2 -> 3 -> null
//
// Step 1: null <- 1    2 -> 3 -> null
//         prev   curr  next
//
// Step 2: null <- 1 <- 2    3 -> null
//                prev  curr  next
//
// Step 3: null <- 1 <- 2 <- 3
//                      prev  curr(null)

// Time: O(n), Space: O(1)
```

**Recursive Approach:**

```javascript
function reverseListRecursive(head) {
  // Base case
  if (!head || !head.next) return head;

  // Reverse rest of list
  const newHead = reverseListRecursive(head.next);

  // Fix current node
  head.next.next = head;
  head.next = null;

  return newHead;
}

// Visualization:
// reverse(1 -> 2 -> 3 -> null)
//   reverse(2 -> 3 -> null)
//     reverse(3 -> null)
//       return 3
//     3.next.next = 3  (makes: 3 -> 2)
//     3.next = null
//     return 3
//   2.next.next = 2  (makes: 3 -> 2 -> 1)
//   2.next = null
//   return 3

// Time: O(n), Space: O(n) call stack
```

---

### Q6: Reverse linked list in groups of K (LeetCode 25)

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

```javascript
function reverseKGroup(head, k) {
  // Check if there are k nodes remaining
  let current = head;
  for (let i = 0; i < k; i++) {
    if (!current) return head;
    current = current.next;
  }

  // Reverse k nodes
  let prev = null;
  current = head;

  for (let i = 0; i < k; i++) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  // Recursively reverse remaining groups
  head.next = reverseKGroup(current, k);

  return prev;
}

// Example: k = 3
// Input:  1 -> 2 -> 3 -> 4 -> 5
// Output: 3 -> 2 -> 1 -> 5 -> 4

// Time: O(n), Space: O(n/k) recursion depth
```

---

## Cycle Detection

### Q7: Detect if linked list has a cycle (LeetCode 141)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function hasCycle(head) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
}

// Floyd's Cycle Detection Algorithm (Tortoise and Hare)
// If there's a cycle, fast will eventually meet slow
//
// No cycle:
// 1 -> 2 -> 3 -> null
// slow: 1 -> 2 -> 3
// fast: 1 -> 3 -> null
//
// With cycle:
// 1 -> 2 -> 3 -> 4
//      ^         |
//      |_________|
// Eventually slow and fast meet inside cycle

// Time: O(n), Space: O(1)
```

---

### Q8: Find the starting node of a cycle (LeetCode 142)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function detectCycle(head) {
  if (!head || !head.next) return null;

  let slow = head;
  let fast = head;
  let hasCycle = false;

  // Detect cycle
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      hasCycle = true;
      break;
    }
  }

  if (!hasCycle) return null;

  // Find cycle start
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }

  return slow;
}

// Mathematical proof:
// Let L = distance from head to cycle start
// Let C = cycle length
// Let X = distance from cycle start to meeting point
//
// When they meet:
// slow traveled: L + X
// fast traveled: L + X + nC (n complete cycles)
// Since fast is 2x speed: 2(L + X) = L + X + nC
// Simplify: L + X = nC
// Therefore: L = nC - X
//
// So moving from head and from meeting point
// will meet at cycle start!

// Time: O(n), Space: O(1)
```

---

## Merge and Sort

### Q9: Merge two sorted linked lists (LeetCode 21)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  // Attach remaining nodes
  current.next = l1 || l2;

  return dummy.next;
}

// Example:
// L1: 1 -> 3 -> 5
// L2: 2 -> 4 -> 6
//
// Result: 1 -> 2 -> 3 -> 4 -> 5 -> 6

// Time: O(n + m), Space: O(1)
```

---

### Q10: Merge K sorted lists (LeetCode 23)

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

**Approach 1: Min Heap (Priority Queue)**

```javascript
function mergeKLists(lists) {
  if (lists.length === 0) return null;

  // Min heap of [value, listIndex, node]
  const heap = [];

  // Add first node from each list
  for (let i = 0; i < lists.length; i++) {
    if (lists[i]) {
      heap.push([lists[i].val, i, lists[i]]);
    }
  }

  // Sort heap
  heap.sort((a, b) => a[0] - b[0]);

  const dummy = new ListNode(0);
  let current = dummy;

  while (heap.length > 0) {
    // Extract min
    const [val, listIdx, node] = heap.shift();

    current.next = node;
    current = current.next;

    // Add next node from same list
    if (node.next) {
      heap.push([node.next.val, listIdx, node.next]);
      heap.sort((a, b) => a[0] - b[0]);
    }
  }

  return dummy.next;
}

// Time: O(n log k) where n is total nodes, k is number of lists
// Space: O(k) for heap
```

**Approach 2: Divide and Conquer**

```javascript
function mergeKLists(lists) {
  if (lists.length === 0) return null;
  if (lists.length === 1) return lists[0];

  // Merge lists in pairs
  while (lists.length > 1) {
    const mergedLists = [];

    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      mergedLists.push(mergeTwoLists(l1, l2));
    }

    lists = mergedLists;
  }

  return lists[0];
}

// Time: O(n log k), Space: O(1)
```

---

### Q11: Sort linked list (LeetCode 148)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function sortList(head) {
  // Base case
  if (!head || !head.next) return head;

  // Find middle
  let slow = head;
  let fast = head;
  let prev = null;

  while (fast && fast.next) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
  }

  // Split list
  prev.next = null;

  // Sort both halves
  const left = sortList(head);
  const right = sortList(slow);

  // Merge sorted halves
  return mergeTwoLists(left, right);
}

// Merge Sort for Linked List
// Time: O(n log n), Space: O(log n) recursion
```

---

### Q12: Reorder list (LeetCode 143)

**Difficulty:** ⭐⭐ Medium

**Answer:**

L0 → L1 → … → Ln-1 → Ln to  
L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …

```javascript
function reorderList(head) {
  if (!head || !head.next) return;

  // Step 1: Find middle
  let slow = head;
  let fast = head;

  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 2: Reverse second half
  let secondHalf = reverseList(slow.next);
  slow.next = null;

  // Step 3: Merge two halves
  let firstHalf = head;

  while (secondHalf) {
    const temp1 = firstHalf.next;
    const temp2 = secondHalf.next;

    firstHalf.next = secondHalf;
    secondHalf.next = temp1;

    firstHalf = temp1;
    secondHalf = temp2;
  }
}

// Example:
// Input:  1 -> 2 -> 3 -> 4 -> 5
// Step 1: 1 -> 2 -> 3 and 4 -> 5
// Step 2: 1 -> 2 -> 3 and 5 -> 4
// Step 3: 1 -> 5 -> 2 -> 4 -> 3

// Time: O(n), Space: O(1)
```

---

### Q13: Palindrome linked list (LeetCode 234)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function isPalindrome(head) {
  if (!head || !head.next) return true;

  // Find middle
  let slow = head;
  let fast = head;

  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Reverse second half
  let secondHalf = reverseList(slow.next);
  let firstHalf = head;

  // Compare both halves
  while (secondHalf) {
    if (firstHalf.val !== secondHalf.val) {
      return false;
    }
    firstHalf = firstHalf.next;
    secondHalf = secondHalf.next;
  }

  return true;
}

// Example:
// 1 -> 2 -> 2 -> 1 (palindrome)
// After middle: 1 -> 2 and 2 -> 1
// Reverse second: 1 -> 2 and 1 -> 2
// Compare: match!

// Time: O(n), Space: O(1)
```

---

### Q14: Add two numbers represented by linked lists (LeetCode 2)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const sum = (l1?.val || 0) + (l2?.val || 0) + carry;
    carry = Math.floor(sum / 10);

    current.next = new ListNode(sum % 10);
    current = current.next;

    l1 = l1?.next;
    l2 = l2?.next;
  }

  return dummy.next;
}

// Example:
// L1: 2 -> 4 -> 3 (represents 342)
// L2: 5 -> 6 -> 4 (represents 465)
// Result: 7 -> 0 -> 8 (represents 807)
//
// Step-by-step:
// 2 + 5 = 7, carry = 0
// 4 + 6 = 10, digit = 0, carry = 1
// 3 + 4 + 1 = 8, carry = 0

// Time: O(max(n, m)), Space: O(max(n, m))
```

---

### Q15: Intersection of two linked lists (LeetCode 160)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let pA = headA;
  let pB = headB;

  // When one reaches end, switch to other list's head
  // After at most 2 iterations, will meet at intersection
  while (pA !== pB) {
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }

  return pA;
}

// Why this works:
// ListA: a1 -> a2 -> c1 -> c2 -> c3
// ListB: b1 -> b2 -> b3 -> c1 -> c2 -> c3
//
// pA path: a1->a2->c1->c2->c3->b1->b2->b3->c1 (intersection!)
// pB path: b1->b2->b3->c1->c2->c3->a1->a2->c1 (intersection!)
//
// Both travel same distance: len(A) + len(B)

// Time: O(n + m), Space: O(1)
```

---

Continue to [Tree & Graph Questions](./04-tree-graph-questions.md) →
