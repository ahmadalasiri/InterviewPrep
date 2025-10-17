/**
 * Sorting Algorithms - JavaScript Implementation
 *
 * Topics covered:
 * - Bubble Sort
 * - Selection Sort
 * - Insertion Sort
 * - Merge Sort
 * - Quick Sort
 * - Heap Sort
 * - Counting Sort
 */

// ============================================
// BUBBLE SORT
// ============================================

/**
 * Bubble Sort - Repeatedly swap adjacent elements if in wrong order
 * Time: O(n²) average/worst, O(n) best
 * Space: O(1)
 * Stable: Yes
 */
function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // Optimization: if no swaps, array is sorted
    if (!swapped) break;
  }

  return arr;
}

// ============================================
// SELECTION SORT
// ============================================

/**
 * Selection Sort - Find minimum and place at beginning
 * Time: O(n²) all cases
 * Space: O(1)
 * Stable: No
 */
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Find minimum element in remaining array
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap minimum with first element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}

// ============================================
// INSERTION SORT
// ============================================

/**
 * Insertion Sort - Build sorted array one element at a time
 * Time: O(n²) average/worst, O(n) best
 * Space: O(1)
 * Stable: Yes
 */
function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}

// ============================================
// MERGE SORT
// ============================================

/**
 * Merge Sort - Divide and conquer
 * Time: O(n log n) all cases
 * Space: O(n)
 * Stable: Yes
 */
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
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

// ============================================
// QUICK SORT
// ============================================

/**
 * Quick Sort - Pick pivot and partition
 * Time: O(n log n) average, O(n²) worst
 * Space: O(log n) stack space
 * Stable: No
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }

  return arr;
}

function partition(arr, low, high) {
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
 * Quick Sort - Alternative with random pivot
 */
function quickSortRandom(arr) {
  if (arr.length <= 1) return arr;

  const pivotIndex = Math.floor(Math.random() * arr.length);
  const pivot = arr[pivotIndex];

  const left = arr.filter(
    (val, idx) => val < pivot || (val === pivot && idx < pivotIndex)
  );
  const middle = arr.filter((val) => val === pivot);
  const right = arr.filter(
    (val, idx) => val > pivot || (val === pivot && idx > pivotIndex)
  );

  return [...quickSortRandom(left), ...middle, ...quickSortRandom(right)];
}

// ============================================
// HEAP SORT
// ============================================

/**
 * Heap Sort - Build max heap and extract maximum
 * Time: O(n log n) all cases
 * Space: O(1)
 * Stable: No
 */
function heapSort(arr) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, n, i) {
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

// ============================================
// COUNTING SORT
// ============================================

/**
 * Counting Sort - Count occurrences and place in order
 * Time: O(n + k) where k is range
 * Space: O(k)
 * Stable: Yes
 */
function countingSort(arr) {
  if (arr.length === 0) return arr;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Count occurrences
  for (let num of arr) {
    count[num - min]++;
  }

  // Cumulative count
  for (let i = 1; i < count.length; i++) {
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

// ============================================
// RADIX SORT
// ============================================

/**
 * Radix Sort - Sort by digits
 * Time: O(d * (n + k)) where d is number of digits
 * Space: O(n + k)
 * Stable: Yes
 */
function radixSort(arr) {
  if (arr.length === 0) return arr;

  const max = Math.max(...arr);
  let exp = 1;

  while (Math.floor(max / exp) > 0) {
    countingSortByDigit(arr, exp);
    exp *= 10;
  }

  return arr;
}

function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // Count occurrences of digits
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Cumulative count
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

// ============================================
// BUCKET SORT
// ============================================

/**
 * Bucket Sort - Distribute into buckets and sort
 * Time: O(n + k) average, O(n²) worst
 * Space: O(n + k)
 * Stable: Yes
 */
function bucketSort(arr, bucketSize = 5) {
  if (arr.length === 0) return arr;

  const min = Math.min(...arr);
  const max = Math.max(...arr);

  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  // Distribute into buckets
  for (let num of arr) {
    const bucketIndex = Math.floor((num - min) / bucketSize);
    buckets[bucketIndex].push(num);
  }

  // Sort each bucket and concatenate
  const result = [];
  for (let bucket of buckets) {
    insertionSort(bucket);
    result.push(...bucket);
  }

  return result;
}

// ============================================
// COMPARISON FUNCTIONS
// ============================================

/**
 * Compare sorting algorithms
 */
function compareSorts(arr) {
  const algorithms = [
    { name: "Bubble Sort", fn: bubbleSort },
    { name: "Selection Sort", fn: selectionSort },
    { name: "Insertion Sort", fn: insertionSort },
    { name: "Merge Sort", fn: mergeSort },
    { name: "Quick Sort (Random)", fn: quickSortRandom },
    { name: "Heap Sort", fn: heapSort },
    { name: "Counting Sort", fn: countingSort },
    { name: "Radix Sort", fn: radixSort },
    { name: "Bucket Sort", fn: bucketSort },
  ];

  console.log("\nSorting Algorithm Comparison:");
  console.log("Array size:", arr.length);
  console.log("-".repeat(50));

  for (let algo of algorithms) {
    const testArr = [...arr];
    const start = Date.now();
    algo.fn(testArr);
    const end = Date.now();

    console.log(
      `${algo.name.padEnd(25)} ${(end - start).toString().padStart(10)}ms`
    );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if array is sorted
 */
function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

/**
 * Generate random array
 */
function generateRandomArray(size, max = 1000) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

// ============================================
// TESTS
// ============================================

function runTests() {
  const testArr = [64, 34, 25, 12, 22, 11, 90];

  console.log("Original:", testArr);
  console.log("\n=== Sorting Algorithm Tests ===");

  console.log("Bubble Sort:", bubbleSort([...testArr]));
  console.log("Selection Sort:", selectionSort([...testArr]));
  console.log("Insertion Sort:", insertionSort([...testArr]));
  console.log("Merge Sort:", mergeSort([...testArr]));
  console.log("Quick Sort:", quickSort([...testArr]));
  console.log("Heap Sort:", heapSort([...testArr]));
  console.log("Counting Sort:", countingSort([...testArr]));
  console.log("Radix Sort:", radixSort([...testArr]));
  console.log("Bucket Sort:", bucketSort([...testArr]));

  // Performance comparison with larger array
  console.log("\n=== Performance Test ===");
  const largeArr = generateRandomArray(1000);
  compareSorts(largeArr);
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
  bucketSort,
  isSorted,
  generateRandomArray,
};
