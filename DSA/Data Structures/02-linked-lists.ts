/**
 * ============================================================================
 * LINKED LISTS - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS A LINKED LIST?
 * ----------------------
 * A linked list is a linear data structure where elements (nodes) are stored
 * in non-contiguous memory locations. Each node contains:
 * 1. Data (the actual value)
 * 2. Pointer(s) to the next (and/or previous) node
 *
 * TYPES OF LINKED LISTS:
 * 1. **Singly Linked List**: Each node has one pointer (next)
 *    HEAD -> [1|next] -> [2|next] -> [3|next] -> NULL
 *
 * 2. **Doubly Linked List**: Each node has two pointers (prev, next)
 *    NULL <- [prev|1|next] <-> [prev|2|next] <-> [prev|3|next] -> NULL
 *
 * 3. **Circular Linked List**: Last node points back to first
 *    HEAD -> [1|next] -> [2|next] -> [3|next] -> back to HEAD
 *
 * TIME COMPLEXITIES:
 * - Access: O(n) - must traverse from head
 * - Search: O(n) - must traverse from head
 * - Insert at head: O(1)
 * - Insert at tail: O(1) if tail pointer maintained, O(n) otherwise
 * - Insert at position: O(n)
 * - Delete with node reference: O(1)
 * - Delete by value: O(n)
 *
 * SPACE COMPLEXITY: O(n)
 *
 * COMMON INTERVIEW PATTERNS:
 * 1. Fast & Slow Pointers (Floyd's Cycle Detection)
 * 2. Reversing linked list (iterative or recursive)
 * 3. Merging two sorted lists
 * 4. Finding middle element
 * 5. Detecting and removing cycles
 * 6. In-place modification
 *
 * COMMON INTERVIEW QUESTIONS:
 * 1. Reverse Linked List (iterative and recursive)
 * 2. Detect Cycle in Linked List (Floyd's Algorithm)
 * 3. Find Middle of Linked List
 * 4. Merge Two Sorted Lists
 * 5. Remove Nth Node From End
 * 6. Intersection of Two Linked Lists
 * 7. Palindrome Linked List
 * 8. Add Two Numbers (represented as linked lists)
 * 9. Copy List with Random Pointer
 * 10. Flatten a Multilevel Doubly Linked List
 *
 * WHEN TO USE LINKED LISTS:
 * - Frequent insertions/deletions at beginning
 * - Unknown size or frequent size changes
 * - Implementing stacks, queues, or deques
 * - Don't need random access by index
 *
 * ADVANTAGES:
 * + Dynamic size
 * + O(1) insertion/deletion at known position
 * + No wasted memory (grows as needed)
 * + Easy to insert/delete at beginning
 *
 * DISADVANTAGES:
 * - O(n) access time by index
 * - Extra memory for pointers
 * - Not cache-friendly (non-contiguous memory)
 * - No backward traversal (in singly linked list)
 *
 * LINKED LIST vs ARRAY:
 * - Use Array: Need random access, known size, cache performance
 * - Use Linked List: Frequent insertions/deletions, unknown size, no random access needed
 *
 * ============================================================================
 */

// ============================================================================
// NODE DEFINITIONS
// ============================================================================

class ListNode<T> {
  value: T;
  next: ListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

class DoublyListNode<T> {
  value: T;
  prev: DoublyListNode<T> | null;
  next: DoublyListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

// ============================================================================
// SINGLY LINKED LIST
// ============================================================================

class SinglyLinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  size: number = 0;

  /**
   * Add element at the end
   * Time: O(1), Space: O(1)
   */
  append(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.size++;
  }

  /**
   * Add element at the beginning
   * Time: O(1), Space: O(1)
   */
  prepend(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.size++;
  }

  /**
   * Delete element by value
   * Time: O(n), Space: O(1)
   */
  delete(value: T): boolean {
    if (!this.head) return false;

    // Delete head
    if (this.head.value === value) {
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.size--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        if (!current.next) this.tail = current;
        this.size--;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Convert to array for visualization
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }
}

// ============================================================================
// LINKED LIST ALGORITHMS
// ============================================================================

class LinkedListAlgorithms {
  /**
   * Reverse a linked list iteratively
   * Time: O(n), Space: O(1)
   */
  static reverse<T>(head: ListNode<T> | null): ListNode<T> | null {
    let prev: ListNode<T> | null = null;
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
   * Reverse linked list recursively
   * Time: O(n), Space: O(n)
   */
  static reverseRecursive<T>(head: ListNode<T> | null): ListNode<T> | null {
    if (!head || !head.next) {
      return head;
    }

    const newHead = this.reverseRecursive(head.next);
    head.next.next = head;
    head.next = null;

    return newHead;
  }

  /**
   * Detect cycle using Floyd's algorithm (Fast & Slow pointers)
   * Time: O(n), Space: O(1)
   */
  static hasCycle<T>(head: ListNode<T> | null): boolean {
    if (!head) return false;

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
      slow = slow.next!;
      fast = fast.next.next!;

      if (slow === fast) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find the start of cycle
   * Time: O(n), Space: O(1)
   */
  static detectCycle<T>(head: ListNode<T> | null): ListNode<T> | null {
    if (!head) return null;

    let slow = head;
    let fast = head;
    let hasCycle = false;

    // Detect if cycle exists
    while (fast && fast.next) {
      slow = slow.next!;
      fast = fast.next.next!;

      if (slow === fast) {
        hasCycle = true;
        break;
      }
    }

    if (!hasCycle) return null;

    // Find cycle start
    slow = head;
    while (slow !== fast) {
      slow = slow.next!;
      fast = fast.next!;
    }

    return slow;
  }

  /**
   * Find middle of linked list
   * Time: O(n), Space: O(1)
   */
  static findMiddle<T>(head: ListNode<T> | null): ListNode<T> | null {
    if (!head) return null;

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
      slow = slow.next!;
      fast = fast.next.next!;
    }

    return slow;
  }

  /**
   * Find nth node from end
   * Time: O(n), Space: O(1)
   */
  static nthFromEnd<T>(
    head: ListNode<T> | null,
    n: number
  ): ListNode<T> | null {
    if (!head) return null;

    let first = head;
    let second = head;

    // Move first pointer n steps ahead
    for (let i = 0; i < n; i++) {
      if (!first) return null;
      first = first.next!;
    }

    // Move both pointers until first reaches end
    while (first && first.next) {
      first = first.next;
      second = second.next!;
    }

    return second;
  }

  /**
   * Merge two sorted linked lists
   * Time: O(m + n), Space: O(1)
   */
  static mergeSorted(
    l1: ListNode<number> | null,
    l2: ListNode<number> | null
  ): ListNode<number> | null {
    const dummy = new ListNode<number>(0);
    let current = dummy;

    while (l1 && l2) {
      if (l1.value <= l2.value) {
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
   * Remove nth node from end
   * Time: O(n), Space: O(1)
   */
  static removeNthFromEnd<T>(
    head: ListNode<T> | null,
    n: number
  ): ListNode<T> | null {
    const dummy = new ListNode<T>(null as T);
    dummy.next = head;

    let first = dummy;
    let second = dummy;

    // Move first n+1 steps ahead
    for (let i = 0; i <= n; i++) {
      first = first.next!;
    }

    // Move both until first reaches end
    while (first) {
      first = first.next!;
      second = second.next!;
    }

    // Remove nth node
    second.next = second.next!.next;

    return dummy.next;
  }

  /**
   * Check if linked list is palindrome
   * Time: O(n), Space: O(1)
   */
  static isPalindrome<T>(head: ListNode<T> | null): boolean {
    if (!head || !head.next) return true;

    // Find middle
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
      slow = slow.next!;
      fast = fast.next.next!;
    }

    // Reverse second half
    let secondHalf = this.reverse(slow);
    let firstHalf = head;

    // Compare
    while (secondHalf) {
      if (firstHalf.value !== secondHalf.value) {
        return false;
      }
      firstHalf = firstHalf.next!;
      secondHalf = secondHalf.next;
    }

    return true;
  }

  /**
   * Add two numbers represented by linked lists
   * Time: O(max(m, n)), Space: O(max(m, n))
   */
  static addTwoNumbers(
    l1: ListNode<number> | null,
    l2: ListNode<number> | null
  ): ListNode<number> | null {
    const dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;

    while (l1 || l2 || carry) {
      const sum = (l1?.value || 0) + (l2?.value || 0) + carry;
      carry = Math.floor(sum / 10);

      current.next = new ListNode(sum % 10);
      current = current.next;

      l1 = l1?.next || null;
      l2 = l2?.next || null;
    }

    return dummy.next;
  }

  /**
   * Flatten a multilevel doubly linked list
   * Time: O(n), Space: O(n)
   */
  static flatten<T>(head: DoublyListNode<T> | null): DoublyListNode<T> | null {
    if (!head) return null;

    const stack: DoublyListNode<T>[] = [];
    let current = head;
    let prev: DoublyListNode<T> | null = null;

    while (current) {
      if (current.next) {
        stack.push(current.next);
      }

      if (prev) {
        prev.next = current;
        current.prev = prev;
      }

      prev = current;
      current = stack.pop() || null;
    }

    return head;
  }

  /**
   * Copy list with random pointer
   * Time: O(n), Space: O(n)
   */
  static copyRandomList<T>(head: ListNode<T> | null): ListNode<T> | null {
    if (!head) return null;

    const map = new Map<ListNode<T>, ListNode<T>>();

    // First pass: create nodes
    let current = head;
    while (current) {
      map.set(current, new ListNode(current.value));
      current = current.next;
    }

    // Second pass: connect pointers
    current = head;
    while (current) {
      const newNode = map.get(current)!;
      newNode.next = map.get(current.next!) || null;
      current = current.next;
    }

    return map.get(head)!;
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Singly Linked List ===");
const list = new SinglyLinkedList<number>();
list.append(1);
list.append(2);
list.append(3);
list.append(4);
list.append(5);
console.log("Original:", list.toArray());

const reversedHead = LinkedListAlgorithms.reverse(list.head);
const reversedList = new SinglyLinkedList<number>();
reversedList.head = reversedHead;
console.log("Reversed:", reversedList.toArray());

console.log("\n=== Linked List Algorithms ===");
const list2 = new SinglyLinkedList<number>();
list2.append(1);
list2.append(2);
list2.append(3);
list2.append(2);
list2.append(1);
console.log("Palindrome Check:", LinkedListAlgorithms.isPalindrome(list2.head));

const middle = LinkedListAlgorithms.findMiddle(list2.head);
console.log("Middle:", middle?.value);

// Test merge sorted lists
const list3 = new SinglyLinkedList<number>();
list3.append(1);
list3.append(3);
list3.append(5);

const list4 = new SinglyLinkedList<number>();
list4.append(2);
list4.append(4);
list4.append(6);

const merged = LinkedListAlgorithms.mergeSorted(list3.head, list4.head);
const mergedList = new SinglyLinkedList<number>();
mergedList.head = merged;
console.log("Merged Sorted:", mergedList.toArray());

export { ListNode, DoublyListNode, SinglyLinkedList, LinkedListAlgorithms };
