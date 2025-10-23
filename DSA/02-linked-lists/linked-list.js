/**
 * Linked Lists - JavaScript Implementation
 *
 * Topics covered:
 * - Singly Linked List
 * - Doubly Linked List
 * - Common operations and problems
 */

// ============================================
// NODE CLASSES
// ============================================

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class DoublyListNode {
  constructor(val, next = null, prev = null) {
    this.val = val;
    this.next = next;
    this.prev = prev;
  }
}

// ============================================
// SINGLY LINKED LIST
// ============================================

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Add node at beginning - O(1)
  addFirst(val) {
    const newNode = new ListNode(val);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  // Add node at end - O(n)
  addLast(val) {
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

  // Insert at index - O(n)
  insertAt(index, val) {
    if (index < 0 || index > this.size) return false;

    if (index === 0) {
      this.addFirst(val);
      return true;
    }

    const newNode = new ListNode(val);
    let current = this.head;

    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }

    newNode.next = current.next;
    current.next = newNode;
    this.size++;
    return true;
  }

  // Remove first node - O(1)
  removeFirst() {
    if (!this.head) return null;

    const val = this.head.val;
    this.head = this.head.next;
    this.size--;
    return val;
  }

  // Remove last node - O(n)
  removeLast() {
    if (!this.head) return null;

    if (!this.head.next) {
      const val = this.head.val;
      this.head = null;
      this.size--;
      return val;
    }

    let current = this.head;
    while (current.next.next) {
      current = current.next;
    }

    const val = current.next.val;
    current.next = null;
    this.size--;
    return val;
  }

  // Remove at index - O(n)
  removeAt(index) {
    if (index < 0 || index >= this.size) return null;

    if (index === 0) {
      return this.removeFirst();
    }

    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }

    const val = current.next.val;
    current.next = current.next.next;
    this.size--;
    return val;
  }

  // Get value at index - O(n)
  get(index) {
    if (index < 0 || index >= this.size) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current.val;
  }

  // Search for value - O(n)
  indexOf(val) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.val === val) return index;
      current = current.next;
      index++;
    }

    return -1;
  }

  // Print list - O(n)
  print() {
    const values = [];
    let current = this.head;

    while (current) {
      values.push(current.val);
      current = current.next;
    }

    console.log(values.join(" -> "));
  }

  // Convert to array - O(n)
  toArray() {
    const result = [];
    let current = this.head;

    while (current) {
      result.push(current.val);
      current = current.next;
    }

    return result;
  }
}

// ============================================
// DOUBLY LINKED LIST
// ============================================

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Add at beginning - O(1)
  addFirst(val) {
    const newNode = new DoublyListNode(val);

    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.size++;
  }

  // Add at end - O(1)
  addLast(val) {
    const newNode = new DoublyListNode(val);

    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
  }

  // Remove first - O(1)
  removeFirst() {
    if (!this.head) return null;

    const val = this.head.val;

    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else {
      this.head = this.head.next;
      this.head.prev = null;
    }

    this.size--;
    return val;
  }

  // Remove last - O(1)
  removeLast() {
    if (!this.tail) return null;

    const val = this.tail.val;

    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }

    this.size--;
    return val;
  }

  // Print forward - O(n)
  printForward() {
    const values = [];
    let current = this.head;

    while (current) {
      values.push(current.val);
      current = current.next;
    }

    console.log(values.join(" <-> "));
  }

  // Print backward - O(n)
  printBackward() {
    const values = [];
    let current = this.tail;

    while (current) {
      values.push(current.val);
      current = current.prev;
    }

    console.log(values.join(" <-> "));
  }
}

// ============================================
// COMMON PROBLEMS
// ============================================

/**
 * Reverse Linked List (LeetCode 206)
 * Time: O(n), Space: O(1)
 */
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

/**
 * Reverse Linked List (Recursive)
 * Time: O(n), Space: O(n) stack space
 */
function reverseListRecursive(head) {
  if (!head || !head.next) return head;

  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}

/**
 * Detect Cycle (LeetCode 141)
 * Time: O(n), Space: O(1)
 */
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

/**
 * Find Cycle Start (LeetCode 142)
 * Time: O(n), Space: O(1)
 */
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

  // Find start of cycle
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }

  return slow;
}

/**
 * Middle of Linked List (LeetCode 876)
 * Time: O(n), Space: O(1)
 */
function middleNode(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

/**
 * Remove Nth Node From End (LeetCode 19)
 * Time: O(n), Space: O(1)
 */
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;

  let first = dummy;
  let second = dummy;

  // Move first pointer n+1 steps ahead
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

/**
 * Merge Two Sorted Lists (LeetCode 21)
 * Time: O(n + m), Space: O(1)
 */
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

  current.next = l1 || l2;

  return dummy.next;
}

/**
 * Palindrome Linked List (LeetCode 234)
 * Time: O(n), Space: O(1)
 */
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
    if (firstHalf.val !== secondHalf.val) return false;
    firstHalf = firstHalf.next;
    secondHalf = secondHalf.next;
  }

  return true;
}

/**
 * Reorder List (LeetCode 143)
 * L0 → L1 → … → Ln-1 → Ln to L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …
 * Time: O(n), Space: O(1)
 */
function reorderList(head) {
  if (!head || !head.next) return;

  // Find middle
  let slow = head;
  let fast = head;

  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Reverse second half
  let secondHalf = reverseList(slow.next);
  slow.next = null;

  // Merge two halves
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

/**
 * Intersection of Two Linked Lists (LeetCode 160)
 * Time: O(n + m), Space: O(1)
 */
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let pA = headA;
  let pB = headB;

  // When one pointer reaches end, switch to other list's head
  // After at most 2 iterations, pointers will meet at intersection or null
  while (pA !== pB) {
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }

  return pA;
}

/**
 * Add Two Numbers (LeetCode 2)
 * Numbers stored in reverse order
 * Time: O(max(n, m)), Space: O(max(n, m))
 */
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

/**
 * Copy List with Random Pointer (LeetCode 138)
 * Time: O(n), Space: O(n)
 */
function copyRandomList(head) {
  if (!head) return null;

  const map = new Map();

  // First pass: create all nodes
  let current = head;
  while (current) {
    map.set(current, new ListNode(current.val));
    current = current.next;
  }

  // Second pass: assign next and random pointers
  current = head;
  while (current) {
    const newNode = map.get(current);
    newNode.next = map.get(current.next) || null;
    newNode.random = map.get(current.random) || null;
    current = current.next;
  }

  return map.get(head);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create linked list from array
 */
function createList(arr) {
  if (arr.length === 0) return null;

  const head = new ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }

  return head;
}

/**
 * Convert linked list to array
 */
function toArray(head) {
  const result = [];
  let current = head;

  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

/**
 * Print linked list
 */
function printList(head) {
  console.log(toArray(head).join(" -> "));
}

// ============================================
// TESTS
// ============================================

function runTests() {
  console.log("=== Singly Linked List Tests ===");
  const list = new LinkedList();
  list.addLast(1);
  list.addLast(2);
  list.addLast(3);
  list.addFirst(0);
  list.print(); // 0 -> 1 -> 2 -> 3
  console.log("Size:", list.size); // 4

  console.log("\n=== Doubly Linked List Tests ===");
  const dList = new DoublyLinkedList();
  dList.addLast(1);
  dList.addLast(2);
  dList.addLast(3);
  dList.addFirst(0);
  dList.printForward(); // 0 <-> 1 <-> 2 <-> 3
  dList.printBackward(); // 3 <-> 2 <-> 1 <-> 0

  console.log("\n=== Problem Tests ===");
  let head = createList([1, 2, 3, 4, 5]);
  console.log("Original:", toArray(head));
  console.log("Reversed:", toArray(reverseList(head)));

  head = createList([1, 2, 3, 4, 5]);
  console.log("Middle:", middleNode(head).val); // 3

  const l1 = createList([1, 2, 4]);
  const l2 = createList([1, 3, 4]);
  console.log("Merged:", toArray(mergeTwoLists(l1, l2))); // [1,1,2,3,4,4]

  head = createList([1, 2, 2, 1]);
  console.log("Is Palindrome:", isPalindrome(head)); // true
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  ListNode,
  DoublyListNode,
  LinkedList,
  DoublyLinkedList,
  reverseList,
  hasCycle,
  detectCycle,
  middleNode,
  removeNthFromEnd,
  mergeTwoLists,
  isPalindrome,
  reorderList,
  getIntersectionNode,
  addTwoNumbers,
  copyRandomList,
  createList,
  toArray,
  printList,
};




