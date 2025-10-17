/**
 * Searching Algorithms - JavaScript Implementation
 *
 * Topics covered:
 * - Linear Search
 * - Binary Search
 * - Binary Search Variations
 * - Search in Rotated Array
 * - Search in 2D Matrix
 */

// ============================================
// LINEAR SEARCH
// ============================================

/**
 * Linear Search
 * Time: O(n), Space: O(1)
 */
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

// ============================================
// BINARY SEARCH
// ============================================

/**
 * Binary Search - Iterative
 * Time: O(log n), Space: O(1)
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

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
 * Time: O(log n), Space: O(log n)
 */
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}

// ============================================
// BINARY SEARCH VARIATIONS
// ============================================

/**
 * Find First Occurrence
 * Time: O(log n), Space: O(1)
 */
function findFirst(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

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
 * Time: O(log n), Space: O(1)
 */
function findLast(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

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
 * Find Range (LeetCode 34)
 * Time: O(log n), Space: O(1)
 */
function searchRange(nums, target) {
  return [findFirst(nums, target), findLast(nums, target)];
}

/**
 * Search Insert Position (LeetCode 35)
 * Time: O(log n), Space: O(1)
 */
function searchInsert(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
}

/**
 * Find Peak Element (LeetCode 162)
 * Time: O(log n), Space: O(1)
 */
function findPeakElement(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[mid + 1]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * Find Minimum in Rotated Sorted Array (LeetCode 153)
 * Time: O(log n), Space: O(1)
 */
function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return nums[left];
}

// ============================================
// SEARCH IN ROTATED SORTED ARRAY
// ============================================

/**
 * Search in Rotated Sorted Array (LeetCode 33)
 * Time: O(log n), Space: O(1)
 */
function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

/**
 * Search in Rotated Sorted Array II - With duplicates (LeetCode 81)
 * Time: O(log n) average, O(n) worst, Space: O(1)
 */
function searchRotatedII(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return true;
    }

    // Handle duplicates
    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left++;
      right--;
      continue;
    }

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return false;
}

// ============================================
// SEARCH IN 2D MATRIX
// ============================================

/**
 * Search a 2D Matrix (LeetCode 74)
 * Time: O(log(m * n)), Space: O(1)
 */
function searchMatrix(matrix, target) {
  if (matrix.length === 0) return false;

  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const row = Math.floor(mid / n);
    const col = mid % n;
    const midValue = matrix[row][col];

    if (midValue === target) {
      return true;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return false;
}

/**
 * Search a 2D Matrix II (LeetCode 240)
 * Time: O(m + n), Space: O(1)
 */
function searchMatrixII(matrix, target) {
  if (matrix.length === 0) return false;

  const m = matrix.length;
  const n = matrix[0].length;

  // Start from top-right corner
  let row = 0;
  let col = n - 1;

  while (row < m && col >= 0) {
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

// ============================================
// SPECIAL SEARCH PROBLEMS
// ============================================

/**
 * Find First Bad Version (LeetCode 278)
 * Time: O(log n), Space: O(1)
 */
function firstBadVersion(n, isBadVersion) {
  let left = 1;
  let right = n;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (isBadVersion(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * Sqrt(x) (LeetCode 69)
 * Time: O(log n), Space: O(1)
 */
function mySqrt(x) {
  if (x < 2) return x;

  let left = 0;
  let right = x;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
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
 * Koko Eating Bananas (LeetCode 875)
 * Time: O(n log m), Space: O(1)
 */
function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles);

  function canFinish(speed) {
    let hours = 0;
    for (let pile of piles) {
      hours += Math.ceil(pile / speed);
    }
    return hours <= h;
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canFinish(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * Capacity To Ship Packages (LeetCode 1011)
 * Time: O(n log(sum-max)), Space: O(1)
 */
function shipWithinDays(weights, days) {
  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);

  function canShip(capacity) {
    let daysNeeded = 1;
    let currentWeight = 0;

    for (let weight of weights) {
      if (currentWeight + weight > capacity) {
        daysNeeded++;
        currentWeight = 0;
      }
      currentWeight += weight;
    }

    return daysNeeded <= days;
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canShip(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * Find K Closest Elements (LeetCode 658)
 * Time: O(log n + k), Space: O(1)
 */
function findClosestElements(arr, k, x) {
  let left = 0;
  let right = arr.length - k;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (x - arr[mid] > arr[mid + k] - x) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return arr.slice(left, left + k);
}

// ============================================
// EXPONENTIAL SEARCH
// ============================================

/**
 * Exponential Search
 * Time: O(log n), Space: O(1)
 */
function exponentialSearch(arr, target) {
  if (arr.length === 0) return -1;
  if (arr[0] === target) return 0;

  // Find range
  let i = 1;
  while (i < arr.length && arr[i] <= target) {
    i *= 2;
  }

  // Binary search in range
  return (
    binarySearch(arr.slice(i / 2, Math.min(i, arr.length)), target) + i / 2
  );
}

// ============================================
// TERNARY SEARCH
// ============================================

/**
 * Ternary Search
 * Time: O(log₃ n), Space: O(1)
 */
function ternarySearch(arr, target) {
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

// ============================================
// TESTS
// ============================================

function runTests() {
  console.log("=== Basic Search Tests ===");
  const arr = [1, 3, 5, 7, 9, 11, 13, 15];
  console.log("Linear Search(7):", linearSearch(arr, 7)); // 3
  console.log("Binary Search(7):", binarySearch(arr, 7)); // 3
  console.log("Binary Search Recursive(7):", binarySearchRecursive(arr, 7)); // 3

  console.log("\n=== Binary Search Variations ===");
  const arr2 = [1, 2, 2, 2, 3, 4, 5];
  console.log("Find First(2):", findFirst(arr2, 2)); // 1
  console.log("Find Last(2):", findLast(arr2, 2)); // 3
  console.log("Search Range(2):", searchRange(arr2, 2)); // [1, 3]
  console.log("Search Insert(6):", searchInsert(arr2, 6)); // 7

  console.log("\n=== Rotated Array Search ===");
  const rotated = [4, 5, 6, 7, 0, 1, 2];
  console.log("Search Rotated(0):", searchRotated(rotated, 0)); // 4
  console.log("Find Min:", findMin(rotated)); // 0

  console.log("\n=== 2D Matrix Search ===");
  const matrix = [
    [1, 3, 5, 7],
    [10, 11, 16, 20],
    [23, 30, 34, 60],
  ];
  console.log("Search Matrix(3):", searchMatrix(matrix, 3)); // true
  console.log("Search Matrix(13):", searchMatrix(matrix, 13)); // false

  console.log("\n=== Special Problems ===");
  console.log("Sqrt(16):", mySqrt(16)); // 4
  console.log("Sqrt(8):", mySqrt(8)); // 2
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  linearSearch,
  binarySearch,
  binarySearchRecursive,
  findFirst,
  findLast,
  searchRange,
  searchInsert,
  findPeakElement,
  findMin,
  searchRotated,
  searchRotatedII,
  searchMatrix,
  searchMatrixII,
  firstBadVersion,
  mySqrt,
  minEatingSpeed,
  shipWithinDays,
  findClosestElements,
  exponentialSearch,
  ternarySearch,
};
