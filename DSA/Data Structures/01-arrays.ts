/**
 * ============================================================================
 * ARRAYS - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS AN ARRAY?
 * -----------------
 * An array is a collection of elements stored in contiguous memory locations.
 * Each element can be accessed directly using its index (position).
 *
 * KEY CHARACTERISTICS:
 * - Fixed size in most languages (dynamic in JavaScript/TypeScript)
 * - Elements of the same type
 * - Zero-based indexing
 * - Random access in O(1) time
 * - Sequential memory allocation
 *
 * TIME COMPLEXITIES:
 * - Access by index: O(1)
 * - Search (unsorted): O(n)
 * - Search (sorted): O(log n) with binary search
 * - Insert at end: O(1) amortized
 * - Insert at beginning/middle: O(n)
 * - Delete from end: O(1)
 * - Delete from beginning/middle: O(n)
 *
 * SPACE COMPLEXITY: O(n)
 *
 * COMMON INTERVIEW PATTERNS:
 * 1. Two Pointers (opposite or same direction)
 * 2. Sliding Window (fixed or variable size)
 * 3. Prefix Sum / Cumulative Sum
 * 4. Kadane's Algorithm (max subarray)
 * 5. Binary Search (for sorted arrays)
 * 6. In-place array manipulation
 *
 * COMMON INTERVIEW QUESTIONS:
 * 1. Two Sum / Three Sum / Four Sum
 * 2. Container With Most Water
 * 3. Trapping Rain Water
 * 4. Product of Array Except Self
 * 5. Maximum Subarray (Kadane's Algorithm)
 * 6. Merge Intervals
 * 7. Rotate Array
 * 8. Remove Duplicates from Sorted Array
 * 9. Find Missing Number
 * 10. Sort Colors (Dutch National Flag)
 *
 * WHEN TO USE ARRAYS:
 * - Need fast access by index
 * - Know the size in advance
 * - Need to store a collection of similar items
 * - Implementing other data structures (heap, stack, queue)
 *
 * ADVANTAGES:
 * + O(1) access time by index
 * + Cache-friendly (contiguous memory)
 * + Simple and widely supported
 *
 * DISADVANTAGES:
 * - Fixed size (in most languages)
 * - Expensive insertions/deletions (O(n))
 * - Wasted space if not fully utilized
 *
 * ============================================================================
 */

// ============================================================================
// BASIC ARRAY OPERATIONS
// ============================================================================

class ArrayOperations {
  /**
   * Two Pointers Pattern
   * Common for: Palindrome, pair sum, remove duplicates
   */
  static reverseArray<T>(arr: T[]): T[] {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }

    return arr;
  }

  /**
   * Find pair with target sum in sorted array
   * Time: O(n), Space: O(1)
   */
  static twoSum(arr: number[], target: number): [number, number] | null {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
      const sum = arr[left] + arr[right];

      if (sum === target) {
        return [left, right];
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }

    return null;
  }

  /**
   * Remove duplicates from sorted array in-place
   * Time: O(n), Space: O(1)
   */
  static removeDuplicates(arr: number[]): number {
    if (arr.length === 0) return 0;

    let writeIndex = 1;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] !== arr[i - 1]) {
        arr[writeIndex] = arr[i];
        writeIndex++;
      }
    }

    return writeIndex;
  }
}

// ============================================================================
// SLIDING WINDOW PATTERN
// ============================================================================

class SlidingWindow {
  /**
   * Fixed Size Window: Maximum sum of k consecutive elements
   * Time: O(n), Space: O(1)
   */
  static maxSumSubarray(arr: number[], k: number): number {
    if (arr.length < k) return -1;

    let windowSum = 0;

    // Calculate sum of first window
    for (let i = 0; i < k; i++) {
      windowSum += arr[i];
    }

    let maxSum = windowSum;

    // Slide the window
    for (let i = k; i < arr.length; i++) {
      windowSum = windowSum - arr[i - k] + arr[i];
      maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
  }

  /**
   * Variable Size Window: Smallest subarray with sum >= target
   * Time: O(n), Space: O(1)
   */
  static minSubarrayLen(arr: number[], target: number): number {
    let minLen = Infinity;
    let windowSum = 0;
    let left = 0;

    for (let right = 0; right < arr.length; right++) {
      windowSum += arr[right];

      while (windowSum >= target) {
        minLen = Math.min(minLen, right - left + 1);
        windowSum -= arr[left];
        left++;
      }
    }

    return minLen === Infinity ? 0 : minLen;
  }

  /**
   * Longest substring with at most k distinct characters
   * Time: O(n), Space: O(k)
   */
  static longestSubstringKDistinct(s: string, k: number): number {
    const charCount = new Map<string, number>();
    let maxLen = 0;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
      const rightChar = s[right];
      charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

      while (charCount.size > k) {
        const leftChar = s[left];
        charCount.set(leftChar, charCount.get(leftChar)! - 1);
        if (charCount.get(leftChar) === 0) {
          charCount.delete(leftChar);
        }
        left++;
      }

      maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
  }
}

// ============================================================================
// ARRAY MANIPULATION
// ============================================================================

class ArrayManipulation {
  /**
   * Rotate array right by k steps
   * Time: O(n), Space: O(1)
   */
  static rotateArray(arr: number[], k: number): void {
    k = k % arr.length;

    const reverse = (start: number, end: number) => {
      while (start < end) {
        [arr[start], arr[end]] = [arr[end], arr[start]];
        start++;
        end--;
      }
    };

    // Reverse entire array
    reverse(0, arr.length - 1);
    // Reverse first k elements
    reverse(0, k - 1);
    // Reverse remaining elements
    reverse(k, arr.length - 1);
  }

  /**
   * Product of array except self (without division)
   * Time: O(n), Space: O(1) (excluding output array)
   */
  static productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(1);

    // Left products
    let leftProduct = 1;
    for (let i = 0; i < n; i++) {
      result[i] = leftProduct;
      leftProduct *= nums[i];
    }

    // Right products
    let rightProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
      result[i] *= rightProduct;
      rightProduct *= nums[i];
    }

    return result;
  }

  /**
   * Find all subarrays with sum equal to k
   * Time: O(n), Space: O(n)
   */
  static subarraySum(arr: number[], k: number): number {
    const prefixSumCount = new Map<number, number>();
    prefixSumCount.set(0, 1);

    let count = 0;
    let currentSum = 0;

    for (const num of arr) {
      currentSum += num;

      // Check if (currentSum - k) exists
      if (prefixSumCount.has(currentSum - k)) {
        count += prefixSumCount.get(currentSum - k)!;
      }

      prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);
    }

    return count;
  }

  /**
   * Merge two sorted arrays
   * Time: O(m + n), Space: O(1)
   */
  static mergeSortedArrays(
    arr1: number[],
    m: number,
    arr2: number[],
    n: number
  ): void {
    let p1 = m - 1;
    let p2 = n - 1;
    let p = m + n - 1;

    while (p2 >= 0) {
      if (p1 >= 0 && arr1[p1] > arr2[p2]) {
        arr1[p] = arr1[p1];
        p1--;
      } else {
        arr1[p] = arr2[p2];
        p2--;
      }
      p--;
    }
  }
}

// ============================================================================
// SEARCHING IN ARRAYS
// ============================================================================

class ArraySearch {
  /**
   * Binary Search in sorted array
   * Time: O(log n), Space: O(1)
   */
  static binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      if (arr[mid] === target) {
        return mid;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }

  /**
   * Find first and last position of element
   * Time: O(log n), Space: O(1)
   */
  static searchRange(arr: number[], target: number): [number, number] {
    const findBound = (isFirst: boolean): number => {
      let left = 0;
      let right = arr.length - 1;
      let result = -1;

      while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);

        if (arr[mid] === target) {
          result = mid;
          if (isFirst) {
            right = mid - 1; // Search left
          } else {
            left = mid + 1; // Search right
          }
        } else if (arr[mid] < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      return result;
    };

    return [findBound(true), findBound(false)];
  }

  /**
   * Search in rotated sorted array
   * Time: O(log n), Space: O(1)
   */
  static searchRotated(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      if (arr[mid] === target) {
        return mid;
      }

      // Determine which half is sorted
      if (arr[left] <= arr[mid]) {
        // Left half is sorted
        if (target >= arr[left] && target < arr[mid]) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      } else {
        // Right half is sorted
        if (target > arr[mid] && target <= arr[right]) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    }

    return -1;
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Array Operations ===");
console.log("Reverse:", ArrayOperations.reverseArray([1, 2, 3, 4, 5]));
console.log("Two Sum:", ArrayOperations.twoSum([1, 2, 3, 4, 5], 7));
console.log(
  "Remove Duplicates:",
  ArrayOperations.removeDuplicates([1, 1, 2, 2, 3, 4, 4])
);

console.log("\n=== Sliding Window ===");
console.log(
  "Max Sum Subarray:",
  SlidingWindow.maxSumSubarray([1, 4, 2, 10, 23, 3, 1, 0, 20], 4)
);
console.log(
  "Min Subarray Len:",
  SlidingWindow.minSubarrayLen([2, 3, 1, 2, 4, 3], 7)
);
console.log(
  "Longest K Distinct:",
  SlidingWindow.longestSubstringKDistinct("eceba", 2)
);

console.log("\n=== Array Manipulation ===");
const rotateArr = [1, 2, 3, 4, 5, 6, 7];
ArrayManipulation.rotateArray(rotateArr, 3);
console.log("Rotate Array:", rotateArr);
console.log(
  "Product Except Self:",
  ArrayManipulation.productExceptSelf([1, 2, 3, 4])
);
console.log("Subarray Sum:", ArrayManipulation.subarraySum([1, 1, 1], 2));

console.log("\n=== Array Search ===");
console.log("Binary Search:", ArraySearch.binarySearch([1, 2, 3, 4, 5], 3));
console.log("Search Range:", ArraySearch.searchRange([5, 7, 7, 8, 8, 10], 8));
console.log(
  "Search Rotated:",
  ArraySearch.searchRotated([4, 5, 6, 7, 0, 1, 2], 0)
);

export { ArrayOperations, SlidingWindow, ArrayManipulation, ArraySearch };
