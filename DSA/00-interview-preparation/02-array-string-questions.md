# Array & String Interview Questions

## Table of Contents

- [Array Fundamentals](#array-fundamentals)
- [Two Pointers Technique](#two-pointers-technique)
- [Sliding Window](#sliding-window)
- [String Manipulation](#string-manipulation)
- [Matrix Problems](#matrix-problems)

---

## Array Fundamentals

### Q1: How do you reverse an array in place?

**Difficulty:** ⭐ Easy

**Answer:**
Use two pointers from both ends, swap elements while moving toward center.

```javascript
function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Swap elements
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr;
}

// Test
console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
console.log(reverseArray([1, 2])); // [2, 1]
console.log(reverseArray([1])); // [1]

// Time: O(n), Space: O(1)
```

**Go Implementation:**

```go
func reverseArray(arr []int) []int {
    left, right := 0, len(arr)-1

    for left < right {
        arr[left], arr[right] = arr[right], arr[left]
        left++
        right--
    }

    return arr
}
```

---

### Q2: How do you find the maximum and minimum in an array?

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
// Approach 1: Simple iteration - O(n)
function findMinMax(arr) {
  if (arr.length === 0) return null;

  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }

  return { min, max };
}

// Approach 2: Using Math methods
function findMinMax2(arr) {
  return {
    min: Math.min(...arr),
    max: Math.max(...arr),
  };
}

// Approach 3: Reduce
function findMinMax3(arr) {
  return arr.reduce(
    (acc, val) => ({
      min: Math.min(acc.min, val),
      max: Math.max(acc.max, val),
    }),
    { min: arr[0], max: arr[0] }
  );
}

// Test
console.log(findMinMax([3, 5, 1, 9, 2])); // { min: 1, max: 9 }
```

---

### Q3: How do you rotate an array to the right by k positions?

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
// Approach 1: Using extra space - O(n) time, O(n) space
function rotateArraySpace(arr, k) {
  const n = arr.length;
  k = k % n; // Handle k > n

  const rotated = new Array(n);
  for (let i = 0; i < n; i++) {
    rotated[(i + k) % n] = arr[i];
  }

  return rotated;
}

// Approach 2: In-place using reversal - O(n) time, O(1) space
function rotateArray(arr, k) {
  k = k % arr.length;

  // Helper function to reverse array segment
  function reverse(start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }

  // Reverse entire array
  reverse(0, arr.length - 1);
  // Reverse first k elements
  reverse(0, k - 1);
  // Reverse remaining elements
  reverse(k, arr.length - 1);

  return arr;
}

// Test
console.log(rotateArray([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]
console.log(rotateArray([1, 2, 3, 4, 5], 7)); // [4, 5, 1, 2, 3] (same as k=2)

// Explanation of algorithm:
// Original: [1, 2, 3, 4, 5], k=2
// Step 1 - Reverse all: [5, 4, 3, 2, 1]
// Step 2 - Reverse first k: [4, 5, 3, 2, 1]
// Step 3 - Reverse rest: [4, 5, 1, 2, 3] ✓
```

---

### Q4: How do you remove duplicates from a sorted array?

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
// Two pointers approach - O(n) time, O(1) space
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let slow = 0; // Points to last unique element

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1; // Length of array with unique elements
}

// Test
const arr = [1, 1, 2, 2, 3, 4, 4, 5];
const length = removeDuplicates(arr);
console.log(arr.slice(0, length)); // [1, 2, 3, 4, 5]

// Walkthrough:
// [1, 1, 2, 2, 3, 4, 4, 5]
//  s  f                      nums[f] === nums[s], f++
//  s     f                   nums[f] !== nums[s], s++, nums[s] = nums[f]
// [1, 2, 2, 2, 3, 4, 4, 5]
//     s     f               nums[f] === nums[s], f++
//     s        f            nums[f] !== nums[s], s++, nums[s] = nums[f]
// [1, 2, 3, 2, 3, 4, 4, 5]
//        s        f         Continue...
```

---

## Two Pointers Technique

### Q5: Find pair with given sum in sorted array

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }

  return null;
}

// Test
console.log(twoSumSorted([1, 2, 3, 4, 6], 6)); // [1, 3] (indices of 2 and 4)
console.log(twoSumSorted([1, 2, 3, 4, 6], 10)); // [3, 4] (indices of 4 and 6)

// Time: O(n), Space: O(1)
```

---

### Q6: Container With Most Water (LeetCode 11)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    // Calculate current area
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    const area = width * currentHeight;

    maxWater = Math.max(maxWater, area);

    // Move pointer with smaller height
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// Test
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
// Explanation: Lines at index 1 and 8 form container
// Area = (8-1) * min(8,7) = 7 * 7 = 49

// Time: O(n), Space: O(1)
```

---

### Q7: Three Sum (LeetCode 15)

**Difficulty:** ⭐⭐ Medium

**Answer:**
Find all unique triplets that sum to zero.

```javascript
function threeSum(nums) {
  const result = [];
  nums.sort((a, b) => a - b); // Sort array first

  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicates for first number
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;
    const target = -nums[i];

    while (left < right) {
      const sum = nums[left] + nums[right];

      if (sum === target) {
        result.push([nums[i], nums[left], nums[right]]);

        // Skip duplicates for second number
        while (left < right && nums[left] === nums[left + 1]) left++;
        // Skip duplicates for third number
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

// Test
console.log(threeSum([-1, 0, 1, 2, -1, -4]));
// Output: [[-1, -1, 2], [-1, 0, 1]]

// Time: O(n²), Space: O(1) (excluding output)
```

---

## Sliding Window

### Q8: Maximum Sum Subarray of Size K

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function maxSumSubarray(arr, k) {
  if (arr.length < k) return null;

  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Test
console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9 (5+1+3)
console.log(maxSumSubarray([2, 3, 4, 1, 5], 2)); // 7 (3+4)

// Time: O(n), Space: O(1)
```

---

### Q9: Longest Substring Without Repeating Characters (LeetCode 3)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If character seen and in current window, move left
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }

    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Test
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb")); // 1 ("b")
console.log(lengthOfLongestSubstring("pwwkew")); // 3 ("wke")

// Time: O(n), Space: O(min(m, n)) where m is charset size
```

---

### Q10: Minimum Window Substring (LeetCode 76)

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

```javascript
function minWindow(s, t) {
  if (s.length === 0 || t.length === 0) return "";

  // Count characters in t
  const need = new Map();
  for (let char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }

  let left = 0;
  let right = 0;
  let formed = 0;
  const required = need.size;
  const windowCounts = new Map();
  let ans = [Infinity, 0, 0]; // [length, left, right]

  while (right < s.length) {
    // Add character from right
    const char = s[right];
    windowCounts.set(char, (windowCounts.get(char) || 0) + 1);

    // Check if frequency matches
    if (need.has(char) && windowCounts.get(char) === need.get(char)) {
      formed++;
    }

    // Try to contract window
    while (left <= right && formed === required) {
      // Update result if smaller window found
      if (right - left + 1 < ans[0]) {
        ans = [right - left + 1, left, right];
      }

      // Remove character from left
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

    right++;
  }

  return ans[0] === Infinity ? "" : s.slice(ans[1], ans[2] + 1);
}

// Test
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a")); // "a"
console.log(minWindow("a", "aa")); // ""

// Time: O(|S| + |T|), Space: O(|S| + |T|)
```

---

## String Manipulation

### Q11: Valid Palindrome

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function isPalindrome(s) {
  // Clean string: lowercase, alphanumeric only
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

// Test
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome("")); // true

// Time: O(n), Space: O(n) for cleaned string
```

---

### Q12: Longest Palindromic Substring (LeetCode 5)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function longestPalindrome(s) {
  if (s.length < 2) return s;

  let start = 0;
  let maxLength = 1;

  // Helper function to expand around center
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1; // Length of palindrome
  }

  for (let i = 0; i < s.length; i++) {
    // Check for odd length palindrome (center is single character)
    const len1 = expandAroundCenter(i, i);
    // Check for even length palindrome (center is between characters)
    const len2 = expandAroundCenter(i, i + 1);

    const len = Math.max(len1, len2);

    if (len > maxLength) {
      maxLength = len;
      start = i - Math.floor((len - 1) / 2);
    }
  }

  return s.substring(start, start + maxLength);
}

// Test
console.log(longestPalindrome("babad")); // "bab" or "aba"
console.log(longestPalindrome("cbbd")); // "bb"
console.log(longestPalindrome("racecar")); // "racecar"

// Time: O(n²), Space: O(1)
```

---

### Q13: String to Integer (atoi) (LeetCode 8)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function myAtoi(s) {
  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);

  let i = 0;
  let sign = 1;
  let result = 0;

  // Step 1: Skip leading whitespace
  while (i < s.length && s[i] === " ") {
    i++;
  }

  // Step 2: Check for sign
  if (i < s.length && (s[i] === "+" || s[i] === "-")) {
    sign = s[i] === "+" ? 1 : -1;
    i++;
  }

  // Step 3: Convert digits
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    const digit = s[i].charCodeAt(0) - "0".charCodeAt(0);

    // Check for overflow
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

// Test
console.log(myAtoi("42")); // 42
console.log(myAtoi("   -42")); // -42
console.log(myAtoi("4193 with words")); // 4193
console.log(myAtoi("words and 987")); // 0
console.log(myAtoi("-91283472332")); // -2147483648 (INT_MIN)

// Time: O(n), Space: O(1)
```

---

## Matrix Problems

### Q14: Rotate Matrix 90 Degrees (LeetCode 48)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function rotate(matrix) {
  const n = matrix.length;

  // Step 1: Transpose matrix (swap rows and columns)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Step 2: Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }

  return matrix;
}

// Test
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(rotate(matrix));
// Output: [[7,4,1], [8,5,2], [9,6,3]]

// Visualization:
// Original:        Transpose:       Reverse rows:
// 1 2 3            1 4 7            7 4 1
// 4 5 6     -->    2 5 8     -->    8 5 2
// 7 8 9            3 6 9            9 6 3

// Time: O(n²), Space: O(1)
```

---

### Q15: Spiral Matrix (LeetCode 54)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function spiralOrder(matrix) {
  if (matrix.length === 0) return [];

  const result = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // Traverse right
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    top++;

    // Traverse down
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;

    // Traverse left (if still have rows)
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      bottom--;
    }

    // Traverse up (if still have columns)
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }

  return result;
}

// Test
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(spiralOrder(matrix)); // [1,2,3,6,9,8,7,4,5]

// Time: O(m*n), Space: O(1) (excluding output)
```

---

Continue to [Linked List Questions](./03-linked-list-questions.md) →




