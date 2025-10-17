/**
 * Arrays and Strings - JavaScript Implementation
 *
 * Topics covered:
 * - Array manipulation
 * - Two pointers
 * - Sliding window
 * - String operations
 */

// ============================================
// ARRAY BASICS
// ============================================

/**
 * Find maximum element in array
 * Time: O(n), Space: O(1)
 */
function findMax(arr) {
  if (arr.length === 0) return null;

  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

/**
 * Reverse array in place
 * Time: O(n), Space: O(1)
 */
function reverseArray(arr) {
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
 * Remove duplicates from sorted array
 * Time: O(n), Space: O(1)
 */
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
}

/**
 * Rotate array to right by k positions
 * Time: O(n), Space: O(1)
 */
function rotateArray(nums, k) {
  k = k % nums.length;

  function reverse(start, end) {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  }

  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);

  return nums;
}

// ============================================
// TWO POINTERS
// ============================================

/**
 * Two Sum II - Input array is sorted
 * Time: O(n), Space: O(1)
 */
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

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
 * Container With Most Water
 * Time: O(n), Space: O(1)
 */
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    const area = width * currentHeight;

    maxWater = Math.max(maxWater, area);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

/**
 * Three Sum
 * Time: O(n²), Space: O(1)
 */
function threeSum(nums) {
  const result = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;
    const target = -nums[i];

    while (left < right) {
      const sum = nums[left] + nums[right];

      if (sum === target) {
        result.push([nums[i], nums[left], nums[right]]);

        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;

        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

/**
 * Valid Palindrome
 * Time: O(n), Space: O(1)
 */
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, "");

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

// ============================================
// SLIDING WINDOW
// ============================================

/**
 * Maximum sum subarray of size k
 * Time: O(n), Space: O(1)
 */
function maxSumSubarray(arr, k) {
  if (arr.length < k) return null;

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

/**
 * Longest Substring Without Repeating Characters
 * Time: O(n), Space: O(min(m, n))
 */
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }

    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * Minimum Window Substring
 * Time: O(|S| + |T|), Space: O(|S| + |T|)
 */
function minWindow(s, t) {
  if (s.length === 0 || t.length === 0) return "";

  const need = new Map();
  for (let char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }

  let left = 0;
  let formed = 0;
  const required = need.size;
  const windowCounts = new Map();
  let ans = [Infinity, 0, 0];

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowCounts.set(char, (windowCounts.get(char) || 0) + 1);

    if (need.has(char) && windowCounts.get(char) === need.get(char)) {
      formed++;
    }

    while (left <= right && formed === required) {
      if (right - left + 1 < ans[0]) {
        ans = [right - left + 1, left, right];
      }

      const leftChar = s[left];
      windowCounts.set(leftChar, windowCounts.get(leftChar) - 1);

      if (
        need.has(leftChar) &&
        windowCounts.get(leftChar) < need.get(leftChar)
      ) {
        formed--;
      }

      left++;
    }
  }

  return ans[0] === Infinity ? "" : s.slice(ans[1], ans[2] + 1);
}

// ============================================
// STRING MANIPULATION
// ============================================

/**
 * Longest Palindromic Substring
 * Time: O(n²), Space: O(1)
 */
function longestPalindrome(s) {
  if (s.length < 2) return s;

  let start = 0;
  let maxLength = 1;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  for (let i = 0; i < s.length; i++) {
    const len1 = expandAroundCenter(i, i);
    const len2 = expandAroundCenter(i, i + 1);
    const len = Math.max(len1, len2);

    if (len > maxLength) {
      maxLength = len;
      start = i - Math.floor((len - 1) / 2);
    }
  }

  return s.substring(start, start + maxLength);
}

/**
 * Group Anagrams
 * Time: O(n * k log k), Space: O(n * k)
 */
function groupAnagrams(strs) {
  const map = new Map();

  for (let str of strs) {
    const key = str.split("").sort().join("");

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return Array.from(map.values());
}

/**
 * String to Integer (atoi)
 * Time: O(n), Space: O(1)
 */
function myAtoi(s) {
  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);

  let i = 0;
  let sign = 1;
  let result = 0;

  while (i < s.length && s[i] === " ") i++;

  if (i < s.length && (s[i] === "+" || s[i] === "-")) {
    sign = s[i] === "+" ? 1 : -1;
    i++;
  }

  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    const digit = s[i].charCodeAt(0) - "0".charCodeAt(0);

    if (
      result > Math.floor(INT_MAX / 10) ||
      (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10)
    ) {
      return sign === 1 ? INT_MAX : INT_MIN;
    }

    result = result * 10 + digit;
    i++;
  }

  return result * sign;
}

// ============================================
// MATRIX PROBLEMS
// ============================================

/**
 * Rotate Matrix 90 Degrees Clockwise
 * Time: O(n²), Space: O(1)
 */
function rotateMatrix(matrix) {
  const n = matrix.length;

  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }

  return matrix;
}

/**
 * Spiral Matrix
 * Time: O(m*n), Space: O(1)
 */
function spiralOrder(matrix) {
  if (matrix.length === 0) return [];

  const result = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    top++;

    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;

    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      bottom--;
    }

    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }

  return result;
}

/**
 * Set Matrix Zeroes
 * Time: O(m*n), Space: O(1)
 */
function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  let firstRowZero = false;
  let firstColZero = false;

  // Check if first row should be zero
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }

  // Check if first column should be zero
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }

  // Use first row and column as markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // Set zeros based on markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Handle first row
  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }

  // Handle first column
  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
}

// ============================================
// TESTS
// ============================================

function runTests() {
  console.log("=== Array Basics Tests ===");
  console.log("Find Max:", findMax([3, 1, 4, 1, 5, 9, 2])); // 9
  console.log("Reverse:", reverseArray([1, 2, 3, 4, 5])); // [5,4,3,2,1]
  console.log("Remove Duplicates:", removeDuplicates([1, 1, 2, 2, 3])); // 3
  console.log("Rotate Array:", rotateArray([1, 2, 3, 4, 5], 2)); // [4,5,1,2,3]

  console.log("\n=== Two Pointers Tests ===");
  console.log("Two Sum Sorted:", twoSumSorted([2, 7, 11, 15], 9)); // [0,1]
  console.log("Max Area:", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
  console.log("Three Sum:", threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
  console.log("Is Palindrome:", isPalindrome("A man, a plan, a canal: Panama")); // true

  console.log("\n=== Sliding Window Tests ===");
  console.log("Max Sum Subarray:", maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9
  console.log("Longest Substring:", lengthOfLongestSubstring("abcabcbb")); // 3
  console.log("Min Window:", minWindow("ADOBECODEBANC", "ABC")); // "BANC"

  console.log("\n=== String Tests ===");
  console.log("Longest Palindrome:", longestPalindrome("babad")); // "bab" or "aba"
  console.log(
    "Group Anagrams:",
    groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
  );
  console.log("String to Int:", myAtoi("   -42")); // -42

  console.log("\n=== Matrix Tests ===");
  console.log(
    "Spiral Order:",
    spiralOrder([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])
  ); // [1,2,3,6,9,8,7,4,5]
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  findMax,
  reverseArray,
  removeDuplicates,
  rotateArray,
  twoSumSorted,
  maxArea,
  threeSum,
  isPalindrome,
  maxSumSubarray,
  lengthOfLongestSubstring,
  minWindow,
  longestPalindrome,
  groupAnagrams,
  myAtoi,
  rotateMatrix,
  spiralOrder,
  setZeroes,
};
