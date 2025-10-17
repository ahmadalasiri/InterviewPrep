/**
 * ============================================================================
 * SEARCHING ALGORITHMS - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS SEARCHING?
 * ------------------
 * Searching is the process of finding a specific element or its position
 * in a data structure. It's one of the most common operations in computing.
 *
 * WHY IS SEARCHING IMPORTANT?
 * - Foundation of data retrieval
 * - Used in databases, file systems, web search
 * - Critical for algorithm efficiency
 * - Basis for many other algorithms
 *
 * SEARCH CATEGORIES:
 *
 * 1. **Sequential/Linear Search**: Check elements one by one
 *    - Works on unsorted data
 *    - O(n) time complexity
 *
 * 2. **Interval/Divide-and-Conquer Search**: Repeatedly divide search space
 *    - Requires sorted data
 *    - O(log n) or better time complexity
 *
 * SEARCHING ALGORITHMS OVERVIEW:
 *
 * **BASIC SEARCHING:**
 *
 * 1. **Linear Search** (Sequential Search)
 *    - Check each element until found or end reached
 *    - Time: O(n), Space: O(1)
 *    - Use when: Unsorted data, small datasets
 *    - Advantage: Simple, works on any data
 *    - Disadvantage: Slow for large datasets
 *
 * 2. **Binary Search** (Most Important!)
 *    - Repeatedly divide sorted array in half
 *    - Time: O(log n), Space: O(1) iterative, O(log n) recursive
 *    - **Requirement: Array must be SORTED**
 *    - Use when: Sorted array, random access possible
 *    - Advantage: Very fast (log n)
 *    - Disadvantage: Requires sorted data
 *
 * BINARY SEARCH VARIANTS:
 * These are EXTREMELY COMMON in interviews!
 *
 * 1. **Find First Occurrence**: Leftmost target
 * 2. **Find Last Occurrence**: Rightmost target
 * 3. **Count Occurrences**: Last - First + 1
 * 4. **Search Insert Position**: Where to insert to keep sorted
 * 5. **Search in Rotated Array**: Modified binary search
 * 6. **Find Peak Element**: Element greater than neighbors
 * 7. **Find Minimum in Rotated Array**
 * 8. **Search in 2D Matrix**: Treat as 1D or staircase search
 * 9. **Find Square Root**: Binary search on answer
 * 10. **Find Closest Elements**: Binary search + expand
 *
 * **ADVANCED SEARCHING:**
 *
 * 3. **Jump Search**
 *    - Jump ahead by fixed steps, then linear search
 *    - Time: O(√n), Space: O(1)
 *    - Optimal jump size: √n
 *    - Use when: Sorted array, jumping is cheaper than binary search
 *
 * 4. **Interpolation Search**
 *    - Estimates position based on value (like dictionary)
 *    - Time: O(log log n) average, O(n) worst
 *    - Space: O(1)
 *    - Use when: Uniformly distributed sorted data
 *    - Better than binary search for uniform data
 *
 * 5. **Exponential Search**
 *    - Find range where element exists, then binary search
 *    - Time: O(log n), Space: O(1)
 *    - Use when: Unbounded/infinite array, element near beginning
 *
 * 6. **Ternary Search**
 *    - Divide into 3 parts instead of 2
 *    - Time: O(log₃ n) ≈ O(log n)
 *    - Use when: Finding maximum/minimum of unimodal function
 *
 * COMPLEXITY COMPARISON:
 *
 * Algorithm             | Best  | Average      | Worst | Space | Requirement
 * ----------------------|-------|--------------|-------|-------|-------------
 * Linear Search         | O(1)  | O(n)         | O(n)  | O(1)  | None
 * Binary Search         | O(1)  | O(log n)     | O(log n)| O(1)| Sorted array
 * Jump Search           | O(1)  | O(√n)        | O(√n) | O(1)  | Sorted array
 * Interpolation Search  | O(1)  | O(log log n) | O(n)  | O(1)  | Sorted, uniform
 * Exponential Search    | O(1)  | O(log n)     | O(log n)| O(1)| Sorted array
 * Ternary Search        | O(1)  | O(log₃ n)    | O(log₃ n)| O(1)| Unimodal function
 *
 * BINARY SEARCH - THE MOST IMPORTANT PATTERN:
 *
 * **Binary Search Template:**
 * ```typescript
 * function binarySearch(arr: number[], target: number): number {
 *   let left = 0;
 *   let right = arr.length - 1;
 *
 *   while (left <= right) {  // Note: <=
 *     const mid = left + Math.floor((right - left) / 2);  // Avoid overflow
 *
 *     if (arr[mid] === target) {
 *       return mid;
 *     } else if (arr[mid] < target) {
 *       left = mid + 1;
 *     } else {
 *       right = mid - 1;
 *     }
 *   }
 *
 *   return -1;  // Not found
 * }
 * ```
 *
 * **Key Points:**
 * - Use `left + Math.floor((right - left) / 2)` to avoid integer overflow
 * - Condition: `while (left <= right)` not `left < right`
 * - Update: `left = mid + 1` or `right = mid - 1` (not `mid`)
 *
 * **Binary Search on Answer:**
 * When you can verify a solution in O(n) but finding it is hard:
 * - Define search space [min, max]
 * - Binary search on possible answers
 * - Use a function to check if answer is valid
 * - Examples: Square root, Aggressive cows, Painter's partition
 *
 * COMMON INTERVIEW QUESTIONS:
 *
 * **Binary Search:**
 * 1. Binary Search (basic)
 * 2. Search in Rotated Sorted Array
 * 3. Find First and Last Position of Element
 * 4. Search Insert Position
 * 5. Find Peak Element
 * 6. Find Minimum in Rotated Sorted Array
 * 7. Search a 2D Matrix / Matrix II
 * 8. Sqrt(x)
 * 9. Find K Closest Elements
 * 10. Median of Two Sorted Arrays (hard)
 * 11. Split Array Largest Sum
 * 12. Capacity To Ship Packages Within D Days
 *
 * **Other Searches:**
 * 13. First Bad Version
 * 14. Valid Perfect Square
 * 15. Arranging Coins
 * 16. Koko Eating Bananas
 *
 * WHEN TO USE BINARY SEARCH?
 *
 * **Direct indicators:**
 * - Array is sorted
 * - Problem asks for O(log n) solution
 * - Need to find target in sorted data
 *
 * **Hidden indicators:**
 * - "Find minimum/maximum value such that..." (binary search on answer)
 * - Search space can be divided
 * - Monotonic property (if f(x) is true, f(x+1) is also true)
 * - "Given a sorted array..."
 *
 * INTERVIEW TIPS:
 *
 * 1. **Always clarify:**
 *    - Is the array sorted?
 *    - Duplicates allowed?
 *    - What to return if not found?
 *
 * 2. **Edge cases to consider:**
 *    - Empty array
 *    - Single element
 *    - All elements same
 *    - Target at boundaries
 *    - Target not in array
 *
 * 3. **Common mistakes:**
 *    - Overflow in `mid = (left + right) / 2`
 *    - Wrong loop condition (< vs <=)
 *    - Wrong update (mid vs mid±1)
 *    - Off-by-one errors
 *
 * 4. **Optimization:**
 *    - For small arrays, linear search can be faster (due to overhead)
 *    - Consider cache performance for large datasets
 *
 * PRACTICAL APPLICATIONS:
 * - Databases: Index searching
 * - File systems: Finding files
 * - Libraries: Finding books
 * - Games: AI decision making
 * - Machine Learning: Hyperparameter tuning
 * - Version control: Finding first bad commit (bisect)
 *
 * ============================================================================
 */

// ============================================================================
// LINEAR SEARCH
// ============================================================================

/**
 * Linear Search - Check each element sequentially
 * Time: O(n), Space: O(1)
 * Use when: Unsorted data, small datasets
 */
function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

// ============================================================================
// BINARY SEARCH
// ============================================================================

/**
 * Binary Search - Divide and conquer on sorted array
 * Time: O(log n), Space: O(1)
 * Use when: Sorted array, random access
 */
function binarySearch(arr: number[], target: number): number {
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
 * Binary Search - Recursive
 */
function binarySearchRecursive(
  arr: number[],
  target: number,
  left: number = 0,
  right: number = arr.length - 1
): number {
  if (left > right) return -1;

  const mid = left + Math.floor((right - left) / 2);

  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}

// ============================================================================
// BINARY SEARCH VARIANTS
// ============================================================================

class BinarySearchVariants {
  /**
   * Find First Occurrence
   * Time: O(log n)
   */
  static findFirst(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      if (arr[mid] === target) {
        result = mid;
        right = mid - 1; // Continue searching left
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Find Last Occurrence
   * Time: O(log n)
   */
  static findLast(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      if (arr[mid] === target) {
        result = mid;
        left = mid + 1; // Continue searching right
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Count Occurrences
   * Time: O(log n)
   */
  static countOccurrences(arr: number[], target: number): number {
    const first = this.findFirst(arr, target);
    if (first === -1) return 0;

    const last = this.findLast(arr, target);
    return last - first + 1;
  }

  /**
   * Find Insertion Position
   * Time: O(log n)
   */
  static searchInsert(arr: number[], target: number): number {
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

    return left;
  }

  /**
   * Search in Rotated Sorted Array
   * Time: O(log n)
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

  /**
   * Find Minimum in Rotated Sorted Array
   * Time: O(log n)
   */
  static findMin(arr: number[]): number {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      if (arr[mid] > arr[right]) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return arr[left];
  }

  /**
   * Find Peak Element
   * Time: O(log n)
   */
  static findPeakElement(arr: number[]): number {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      if (arr[mid] > arr[mid + 1]) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  /**
   * Square Root using Binary Search
   * Time: O(log n)
   */
  static sqrt(x: number): number {
    if (x < 2) return x;

    let left = 1;
    let right = Math.floor(x / 2);

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const square = mid * mid;

      if (square === x) {
        return mid;
      } else if (square < x) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return right;
  }

  /**
   * Find K Closest Elements
   * Time: O(log n + k)
   */
  static findClosestElements(arr: number[], k: number, x: number): number[] {
    let left = 0;
    let right = arr.length - k;

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      if (x - arr[mid] > arr[mid + k] - x) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return arr.slice(left, left + k);
  }
}

// ============================================================================
// 2D MATRIX SEARCH
// ============================================================================

class MatrixSearch {
  /**
   * Search in 2D Matrix (sorted row-wise and column-wise)
   * Time: O(m + n), Space: O(1)
   */
  static searchMatrix(matrix: number[][], target: number): boolean {
    if (matrix.length === 0 || matrix[0].length === 0) return false;

    let row = 0;
    let col = matrix[0].length - 1;

    while (row < matrix.length && col >= 0) {
      if (matrix[row][col] === target) {
        return true;
      } else if (matrix[row][col] > target) {
        col--;
      } else {
        row++;
      }
    }

    return false;
  }

  /**
   * Search in Row-wise and Column-wise Sorted Matrix
   * Time: O(log(m*n))
   */
  static searchMatrixBinary(matrix: number[][], target: number): boolean {
    if (matrix.length === 0 || matrix[0].length === 0) return false;

    const m = matrix.length;
    const n = matrix[0].length;
    let left = 0;
    let right = m * n - 1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const row = Math.floor(mid / n);
      const col = mid % n;
      const value = matrix[row][col];

      if (value === target) {
        return true;
      } else if (value < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return false;
  }

  /**
   * Find Median in Row-wise Sorted Matrix
   * Time: O(32 * m * log n)
   */
  static findMedian(matrix: number[][]): number {
    const m = matrix.length;
    const n = matrix[0].length;

    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < m; i++) {
      min = Math.min(min, matrix[i][0]);
      max = Math.max(max, matrix[i][n - 1]);
    }

    const desired = Math.floor((m * n + 1) / 2);

    while (min < max) {
      const mid = min + Math.floor((max - min) / 2);
      let count = 0;

      for (let i = 0; i < m; i++) {
        count += this.countLessEqual(matrix[i], mid);
      }

      if (count < desired) {
        min = mid + 1;
      } else {
        max = mid;
      }
    }

    return min;
  }

  private static countLessEqual(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      if (arr[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return left;
  }
}

// ============================================================================
// ADVANCED SEARCH ALGORITHMS
// ============================================================================

class AdvancedSearch {
  /**
   * Jump Search
   * Time: O(√n), Space: O(1)
   * Good for: Sorted arrays, cheaper than binary search for certain data
   */
  static jumpSearch(arr: number[], target: number): number {
    const n = arr.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;

    while (arr[Math.min(step, n) - 1] < target) {
      prev = step;
      if (prev >= n) return -1;
    }

    while (arr[prev] < target) {
      prev++;
      if (prev === Math.min(step, n)) return -1;
    }

    if (arr[prev] === target) return prev;
    return -1;
  }

  /**
   * Interpolation Search
   * Time: O(log log n) avg, O(n) worst, Space: O(1)
   * Good for: Uniformly distributed sorted arrays
   */
  static interpolationSearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right && target >= arr[left] && target <= arr[right]) {
      if (left === right) {
        return arr[left] === target ? left : -1;
      }

      // Interpolation formula
      const pos =
        left +
        Math.floor(
          ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])
        );

      if (arr[pos] === target) {
        return pos;
      } else if (arr[pos] < target) {
        left = pos + 1;
      } else {
        right = pos - 1;
      }
    }

    return -1;
  }

  /**
   * Exponential Search
   * Time: O(log n), Space: O(1)
   * Good for: Unbounded/infinite arrays
   */
  static exponentialSearch(arr: number[], target: number): number {
    if (arr[0] === target) return 0;

    let i = 1;
    while (i < arr.length && arr[i] <= target) {
      i *= 2;
    }

    return binarySearch(
      arr.slice(Math.floor(i / 2), Math.min(i, arr.length)),
      target
    );
  }

  /**
   * Ternary Search
   * Time: O(log₃ n), Space: O(1)
   * Good for: Finding maximum/minimum in unimodal function
   */
  static ternarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid1 = left + Math.floor((right - left) / 3);
      const mid2 = right - Math.floor((right - left) / 3);

      if (arr[mid1] === target) return mid1;
      if (arr[mid2] === target) return mid2;

      if (target < arr[mid1]) {
        right = mid1 - 1;
      } else if (target > arr[mid2]) {
        left = mid2 + 1;
      } else {
        left = mid1 + 1;
        right = mid2 - 1;
      }
    }

    return -1;
  }
}

// ============================================================================
// SPECIAL SEARCH PROBLEMS
// ============================================================================

class SearchProblems {
  /**
   * Find Missing Number in [0, n]
   * Time: O(n), Space: O(1)
   */
  static missingNumber(nums: number[]): number {
    const n = nums.length;
    let sum = (n * (n + 1)) / 2;

    for (const num of nums) {
      sum -= num;
    }

    return sum;
  }

  /**
   * Single Element in Sorted Array
   * Time: O(log n)
   */
  static singleNonDuplicate(nums: number[]): number {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
      let mid = left + Math.floor((right - left) / 2);

      if (mid % 2 === 1) mid--;

      if (nums[mid] === nums[mid + 1]) {
        left = mid + 2;
      } else {
        right = mid;
      }
    }

    return nums[left];
  }

  /**
   * Capacity To Ship Packages Within D Days
   * Time: O(n * log(sum))
   */
  static shipWithinDays(weights: number[], days: number): number {
    let left = Math.max(...weights);
    let right = weights.reduce((a, b) => a + b, 0);

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      if (this.canShip(weights, days, mid)) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  private static canShip(
    weights: number[],
    days: number,
    capacity: number
  ): boolean {
    let daysNeeded = 1;
    let currentWeight = 0;

    for (const weight of weights) {
      if (currentWeight + weight > capacity) {
        daysNeeded++;
        currentWeight = weight;
      } else {
        currentWeight += weight;
      }
    }

    return daysNeeded <= days;
  }

  /**
   * Koko Eating Bananas
   * Time: O(n * log m) where m is max pile
   */
  static minEatingSpeed(piles: number[], h: number): number {
    let left = 1;
    let right = Math.max(...piles);

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      if (this.canEatAll(piles, h, mid)) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  private static canEatAll(piles: number[], h: number, k: number): boolean {
    let hours = 0;

    for (const pile of piles) {
      hours += Math.ceil(pile / k);
    }

    return hours <= h;
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Basic Search ===");
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log("Linear Search (7):", linearSearch(arr, 7));
console.log("Binary Search (7):", binarySearch(arr, 7));
console.log("Binary Search Recursive (7):", binarySearchRecursive(arr, 7));

console.log("\n=== Binary Search Variants ===");
const duplicates = [1, 2, 2, 2, 3, 4, 5];
console.log("Find First (2):", BinarySearchVariants.findFirst(duplicates, 2));
console.log("Find Last (2):", BinarySearchVariants.findLast(duplicates, 2));
console.log(
  "Count Occurrences (2):",
  BinarySearchVariants.countOccurrences(duplicates, 2)
);
console.log("Search Insert (2):", BinarySearchVariants.searchInsert(arr, 6));

const rotated = [4, 5, 6, 7, 0, 1, 2];
console.log(
  "Search Rotated (0):",
  BinarySearchVariants.searchRotated(rotated, 0)
);
console.log("Find Min Rotated:", BinarySearchVariants.findMin(rotated));
console.log("Square Root (16):", BinarySearchVariants.sqrt(16));

console.log("\n=== Matrix Search ===");
const matrix = [
  [1, 4, 7, 11],
  [2, 5, 8, 12],
  [3, 6, 9, 16],
  [10, 13, 14, 17],
];
console.log("Search Matrix (5):", MatrixSearch.searchMatrix(matrix, 5));
console.log(
  "Search Matrix Binary (5):",
  MatrixSearch.searchMatrixBinary(matrix, 5)
);

console.log("\n=== Advanced Search ===");
console.log("Jump Search (7):", AdvancedSearch.jumpSearch(arr, 7));
console.log(
  "Interpolation Search (7):",
  AdvancedSearch.interpolationSearch(arr, 7)
);
console.log(
  "Exponential Search (7):",
  AdvancedSearch.exponentialSearch(arr, 7)
);

console.log("\n=== Search Problems ===");
console.log("Missing Number:", SearchProblems.missingNumber([3, 0, 1]));
console.log(
  "Single Non-Duplicate:",
  SearchProblems.singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8])
);

export {
  linearSearch,
  binarySearch,
  binarySearchRecursive,
  BinarySearchVariants,
  MatrixSearch,
  AdvancedSearch,
  SearchProblems,
};
