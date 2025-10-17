/**
 * ============================================================================
 * SORTING ALGORITHMS - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS SORTING?
 * ----------------
 * Sorting is the process of arranging elements in a specific order (ascending
 * or descending). It's one of the most fundamental operations in computer science
 * and is used as a preprocessing step for many algorithms.
 *
 * WHY IS SORTING IMPORTANT?
 * - Enables binary search (O(log n) instead of O(n))
 * - Makes data easier to understand and visualize
 * - Required for many algorithms (merge, median finding, etc.)
 * - Improves efficiency of other algorithms
 * - Common in real-world applications (databases, search engines)
 *
 * SORTING PROPERTIES:
 *
 * 1. **Stability**: Does the algorithm preserve the relative order of equal elements?
 *    - Stable: Merge Sort, Insertion Sort, Bubble Sort
 *    - Unstable: Quick Sort, Heap Sort, Selection Sort
 *
 * 2. **In-place**: Does it use O(1) extra space?
 *    - In-place: Quick Sort, Heap Sort, Insertion Sort, Bubble Sort, Selection Sort
 *    - Not in-place: Merge Sort (O(n) extra space)
 *
 * 3. **Adaptive**: Does it perform better on partially sorted data?
 *    - Adaptive: Insertion Sort, Bubble Sort (with optimization)
 *    - Not adaptive: Selection Sort, Heap Sort
 *
 * 4. **Comparison-based vs Non-comparison-based**:
 *    - Comparison-based: Compare elements directly (Bubble, Merge, Quick, etc.)
 *      - Lower bound: Ω(n log n)
 *    - Non-comparison-based: Use properties of data (Counting, Radix, Bucket)
 *      - Can be linear time with restrictions
 *
 * SORTING ALGORITHMS OVERVIEW:
 *
 * **SIMPLE SORTS (O(n²))** - Good for small datasets or educational purposes
 *
 * 1. **Bubble Sort**: Compare adjacent elements, swap if needed
 *    - Time: O(n²) worst/avg, O(n) best
 *    - Space: O(1)
 *    - Stable, In-place, Adaptive
 *    - Rarely used in practice
 *
 * 2. **Selection Sort**: Find minimum, place at beginning
 *    - Time: O(n²) all cases
 *    - Space: O(1)
 *    - Unstable, In-place, Not adaptive
 *    - Fewer swaps than bubble sort
 *
 * 3. **Insertion Sort**: Insert each element into sorted portion
 *    - Time: O(n²) worst/avg, O(n) best
 *    - Space: O(1)
 *    - Stable, In-place, Adaptive
 *    - Excellent for small/nearly sorted data
 *    - Used in hybrid algorithms (Timsort, Introsort)
 *
 * **EFFICIENT SORTS (O(n log n))** - Used in practice
 *
 * 4. **Merge Sort**: Divide, sort, merge
 *    - Time: O(n log n) all cases
 *    - Space: O(n)
 *    - Stable, Not in-place
 *    - Predictable performance
 *    - Good for linked lists
 *
 * 5. **Quick Sort**: Pick pivot, partition around it
 *    - Time: O(n log n) avg, O(n²) worst
 *    - Space: O(log n) for call stack
 *    - Unstable, In-place
 *    - Fastest in practice (good cache performance)
 *    - Randomization avoids worst case
 *
 * 6. **Heap Sort**: Build heap, extract max repeatedly
 *    - Time: O(n log n) all cases
 *    - Space: O(1)
 *    - Unstable, In-place
 *    - Not adaptive
 *    - Good worst-case guarantee
 *
 * **SPECIAL SORTS (Linear time with restrictions)**
 *
 * 7. **Counting Sort**: Count occurrences, reconstruct
 *    - Time: O(n + k) where k is range
 *    - Space: O(k)
 *    - Stable
 *    - Best when k = O(n)
 *    - Requires knowing the range
 *
 * 8. **Radix Sort**: Sort by each digit
 *    - Time: O(d·(n + k)) where d is digits, k is base
 *    - Space: O(n + k)
 *    - Stable
 *    - Good for integers with limited digits
 *
 * 9. **Bucket Sort**: Distribute into buckets, sort buckets
 *    - Time: O(n + k) average, O(n²) worst
 *    - Space: O(n)
 *    - Good for uniformly distributed data
 *
 * COMPLEXITY COMPARISON TABLE:
 *
 * Algorithm      | Best      | Average   | Worst     | Space  | Stable | In-place
 * ---------------|-----------|-----------|-----------|--------|--------|----------
 * Bubble Sort    | O(n)      | O(n²)     | O(n²)     | O(1)   | Yes    | Yes
 * Selection Sort | O(n²)     | O(n²)     | O(n²)     | O(1)   | No     | Yes
 * Insertion Sort | O(n)      | O(n²)     | O(n²)     | O(1)   | Yes    | Yes
 * Merge Sort     | O(n log n)| O(n log n)| O(n log n)| O(n)   | Yes    | No
 * Quick Sort     | O(n log n)| O(n log n)| O(n²)     | O(log n)| No    | Yes
 * Heap Sort      | O(n log n)| O(n log n)| O(n log n)| O(1)   | No     | Yes
 * Counting Sort  | O(n + k)  | O(n + k)  | O(n + k)  | O(k)   | Yes    | No
 * Radix Sort     | O(d·n)    | O(d·n)    | O(d·n)    | O(n+k) | Yes    | No
 * Bucket Sort    | O(n + k)  | O(n + k)  | O(n²)     | O(n)   | Yes    | No
 *
 * WHEN TO USE WHICH SORTING ALGORITHM?
 *
 * - **Small dataset (n < 50)**: Insertion Sort
 * - **Nearly sorted data**: Insertion Sort or Bubble Sort
 * - **Need stability**: Merge Sort or Insertion Sort
 * - **Memory is limited**: Heap Sort or Quick Sort (in-place)
 * - **Average case performance**: Quick Sort
 * - **Worst case guarantee**: Merge Sort or Heap Sort
 * - **Linked list**: Merge Sort
 * - **Integers with small range**: Counting Sort
 * - **Integers with limited digits**: Radix Sort
 * - **Uniformly distributed data**: Bucket Sort
 *
 * COMMON INTERVIEW QUESTIONS:
 * 1. Sort Colors (Dutch National Flag) - 3-way partitioning
 * 2. Merge Intervals - custom sorting
 * 3. Largest Number - custom comparator
 * 4. Meeting Rooms II - sorting + heap
 * 5. Kth Largest Element - Quick Select (modified Quick Sort)
 * 6. Sort List - Merge Sort on linked list
 * 7. Wiggle Sort - custom arrangement
 * 8. Top K Frequent Elements - sorting + counting
 *
 * INTERVIEW TIPS:
 * - Always ask about constraints (size, range, memory)
 * - Ask if data is nearly sorted
 * - Ask about stability requirement
 * - Know when to use built-in sort (it's optimized!)
 * - Understand time-space trade-offs
 *
 * REAL-WORLD USAGE:
 * - Most languages use **hybrid algorithms**:
 *   - Timsort (Python, Java): Merge Sort + Insertion Sort
 *   - Introsort (C++ STL): Quick Sort + Heap Sort + Insertion Sort
 * - These adapt to the data characteristics
 *
 * ============================================================================
 */

// ============================================================================
// BUBBLE SORT
// ============================================================================

/**
 * Bubble Sort - Compare adjacent elements and swap
 * Time: O(n²), Space: O(1)
 * Stable: Yes
 */
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  const result = [...arr];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }

    // Optimization: break if no swaps occurred
    if (!swapped) break;
  }

  return result;
}

// ============================================================================
// SELECTION SORT
// ============================================================================

/**
 * Selection Sort - Find minimum and place at beginning
 * Time: O(n²), Space: O(1)
 * Stable: No
 */
function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  const result = [...arr];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [result[i], result[minIdx]] = [result[minIdx], result[i]];
    }
  }

  return result;
}

// ============================================================================
// INSERTION SORT
// ============================================================================

/**
 * Insertion Sort - Insert elements into sorted portion
 * Time: O(n²) worst, O(n) best, Space: O(1)
 * Stable: Yes
 * Good for: Small arrays or nearly sorted data
 */
function insertionSort(arr: number[]): number[] {
  const n = arr.length;
  const result = [...arr];

  for (let i = 1; i < n; i++) {
    const key = result[i];
    let j = i - 1;

    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }

    result[j + 1] = key;
  }

  return result;
}

// ============================================================================
// MERGE SORT
// ============================================================================

/**
 * Merge Sort - Divide and conquer
 * Time: O(n log n), Space: O(n)
 * Stable: Yes
 * Good for: Linked lists, external sorting
 */
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

// ============================================================================
// QUICK SORT
// ============================================================================

/**
 * Quick Sort - Partition around pivot
 * Time: O(n log n) avg, O(n²) worst, Space: O(log n)
 * Stable: No
 * Good for: In-memory sorting, cache-friendly
 */
function quickSort(arr: number[]): number[] {
  const result = [...arr];
  quickSortHelper(result, 0, result.length - 1);
  return result;
}

function quickSortHelper(arr: number[], low: number, high: number): void {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSortHelper(arr, low, pivotIdx - 1);
    quickSortHelper(arr, pivotIdx + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

/**
 * Quick Sort with Random Pivot (better worst case)
 */
function quickSortRandom(arr: number[]): number[] {
  const result = [...arr];
  quickSortRandomHelper(result, 0, result.length - 1);
  return result;
}

function quickSortRandomHelper(arr: number[], low: number, high: number): void {
  if (low < high) {
    const pivotIdx = partitionRandom(arr, low, high);
    quickSortRandomHelper(arr, low, pivotIdx - 1);
    quickSortRandomHelper(arr, pivotIdx + 1, high);
  }
}

function partitionRandom(arr: number[], low: number, high: number): number {
  const randomIdx = low + Math.floor(Math.random() * (high - low + 1));
  [arr[randomIdx], arr[high]] = [arr[high], arr[randomIdx]];
  return partition(arr, low, high);
}

// ============================================================================
// HEAP SORT
// ============================================================================

/**
 * Heap Sort - Build max heap and extract
 * Time: O(n log n), Space: O(1)
 * Stable: No
 */
function heapSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(result, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }

  return result;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// ============================================================================
// COUNTING SORT
// ============================================================================

/**
 * Counting Sort - Count occurrences
 * Time: O(n + k) where k is range, Space: O(k)
 * Stable: Yes
 * Good for: Small range of integers
 */
function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min + 1;

  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Count occurrences
  for (const num of arr) {
    count[num - min]++;
  }

  // Calculate cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build output array
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];
    output[count[num - min] - 1] = num;
    count[num - min]--;
  }

  return output;
}

// ============================================================================
// RADIX SORT
// ============================================================================

/**
 * Radix Sort - Sort digit by digit
 * Time: O(d * (n + k)), Space: O(n + k)
 * Stable: Yes
 * Good for: Large numbers
 */
function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const max = Math.max(...arr);
  const result = [...arr];

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(result, exp);
  }

  return result;
}

function countingSortByDigit(arr: number[], exp: number): void {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Calculate cumulative count
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  // Copy to original array
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}

// ============================================================================
// BUCKET SORT
// ============================================================================

/**
 * Bucket Sort - Distribute into buckets
 * Time: O(n + k) avg, O(n²) worst, Space: O(n + k)
 * Stable: Yes (if stable sort used in buckets)
 */
function bucketSort(arr: number[], bucketSize: number = 5): number[] {
  if (arr.length === 0) return [];

  const min = Math.min(...arr);
  const max = Math.max(...arr);

  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  // Distribute into buckets
  for (const num of arr) {
    const bucketIdx = Math.floor((num - min) / bucketSize);
    buckets[bucketIdx].push(num);
  }

  // Sort each bucket and concatenate
  const result: number[] = [];
  for (const bucket of buckets) {
    if (bucket.length > 0) {
      result.push(...insertionSort(bucket));
    }
  }

  return result;
}

// ============================================================================
// SORTING PROBLEM PATTERNS
// ============================================================================

class SortingProblems {
  /**
   * Sort Colors (Dutch National Flag)
   * Time: O(n), Space: O(1)
   */
  static sortColors(nums: number[]): void {
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    while (mid <= high) {
      if (nums[mid] === 0) {
        [nums[low], nums[mid]] = [nums[mid], nums[low]];
        low++;
        mid++;
      } else if (nums[mid] === 1) {
        mid++;
      } else {
        [nums[mid], nums[high]] = [nums[high], nums[mid]];
        high--;
      }
    }
  }

  /**
   * Merge Intervals
   * Time: O(n log n), Space: O(n)
   */
  static mergeIntervals(intervals: [number, number][]): [number, number][] {
    if (intervals.length === 0) return [];

    intervals.sort((a, b) => a[0] - b[0]);

    const result: [number, number][] = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const last = result[result.length - 1];

      if (current[0] <= last[1]) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        result.push(current);
      }
    }

    return result;
  }

  /**
   * Meeting Rooms II - Minimum rooms needed
   * Time: O(n log n), Space: O(n)
   */
  static minMeetingRooms(intervals: [number, number][]): number {
    const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
    const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

    let rooms = 0;
    let endIdx = 0;

    for (let i = 0; i < starts.length; i++) {
      if (starts[i] < ends[endIdx]) {
        rooms++;
      } else {
        endIdx++;
      }
    }

    return rooms;
  }

  /**
   * Largest Number - Arrange to form largest number
   * Time: O(n log n), Space: O(n)
   */
  static largestNumber(nums: number[]): string {
    const strings = nums.map(String);

    strings.sort((a, b) => {
      const order1 = a + b;
      const order2 = b + a;
      return order2.localeCompare(order1);
    });

    const result = strings.join("");
    return result[0] === "0" ? "0" : result;
  }

  /**
   * Wiggle Sort - nums[0] <= nums[1] >= nums[2] <= nums[3]
   * Time: O(n log n), Space: O(n)
   */
  static wiggleSort(nums: number[]): void {
    const sorted = [...nums].sort((a, b) => a - b);
    const n = nums.length;
    let left = Math.floor((n + 1) / 2) - 1;
    let right = n - 1;

    for (let i = 0; i < n; i++) {
      nums[i] = i % 2 === 0 ? sorted[left--] : sorted[right--];
    }
  }

  /**
   * Kth Largest Element using Quick Select
   * Time: O(n) avg, O(n²) worst, Space: O(1)
   */
  static findKthLargest(nums: number[], k: number): number {
    return this.quickSelect(nums, 0, nums.length - 1, nums.length - k);
  }

  private static quickSelect(
    nums: number[],
    left: number,
    right: number,
    k: number
  ): number {
    if (left === right) return nums[left];

    const pivotIdx = partition(nums, left, right);

    if (k === pivotIdx) {
      return nums[k];
    } else if (k < pivotIdx) {
      return this.quickSelect(nums, left, pivotIdx - 1, k);
    } else {
      return this.quickSelect(nums, pivotIdx + 1, right, k);
    }
  }
}

// ============================================================================
// CUSTOM COMPARATOR SORTING
// ============================================================================

/**
 * Sort with custom comparator
 */
function customSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
  return [...arr].sort(compareFn);
}

// Examples
const sortByAge = (people: { name: string; age: number }[]) => {
  return customSort(people, (a, b) => a.age - b.age);
};

const sortByMultipleKeys = (people: { name: string; age: number }[]) => {
  return customSort(people, (a, b) => {
    if (a.age !== b.age) return a.age - b.age;
    return a.name.localeCompare(b.name);
  });
};

// ============================================================================
// TESTING
// ============================================================================

const testArray = [64, 34, 25, 12, 22, 11, 90];

console.log("=== Sorting Algorithms ===");
console.log("Original:", testArray);
console.log("Bubble Sort:", bubbleSort(testArray));
console.log("Selection Sort:", selectionSort(testArray));
console.log("Insertion Sort:", insertionSort(testArray));
console.log("Merge Sort:", mergeSort(testArray));
console.log("Quick Sort:", quickSort(testArray));
console.log("Heap Sort:", heapSort(testArray));
console.log("Counting Sort:", countingSort(testArray));
console.log("Radix Sort:", radixSort(testArray));
console.log("Bucket Sort:", bucketSort(testArray));

console.log("\n=== Sorting Problems ===");
const colors = [2, 0, 2, 1, 1, 0];
SortingProblems.sortColors(colors);
console.log("Sort Colors:", colors);

const intervals: [number, number][] = [
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
];
console.log("Merge Intervals:", SortingProblems.mergeIntervals(intervals));

console.log(
  "Kth Largest (k=2):",
  SortingProblems.findKthLargest([3, 2, 1, 5, 6, 4], 2)
);
console.log(
  "Largest Number:",
  SortingProblems.largestNumber([3, 30, 34, 5, 9])
);

export {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
  bucketSort,
  SortingProblems,
  customSort,
};
