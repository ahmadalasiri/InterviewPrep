# Arrays and Strings

## Overview

Arrays and strings are the most fundamental data structures. Master these patterns:

- Two Pointers
- Sliding Window
- Prefix Sum
- Matrix Manipulation

## Time Complexities

| Operation          | Array | Dynamic Array |
| ------------------ | ----- | ------------- |
| Access             | O(1)  | O(1)          |
| Search             | O(n)  | O(n)          |
| Insert (end)       | N/A   | O(1)\*        |
| Insert (beginning) | N/A   | O(n)          |
| Delete (end)       | N/A   | O(1)          |
| Delete (beginning) | N/A   | O(n)          |

\* Amortized

## Key Patterns

### 1. Two Pointers

Use when dealing with sorted arrays or when you need to find pairs.

```javascript
// Example: Two Sum in sorted array
function twoSum(arr, target) {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    sum < target ? left++ : right--;
  }
}
```

### 2. Sliding Window

Use for subarray/substring problems.

```javascript
// Example: Max sum of k consecutive elements
function maxSum(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b);
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
```

### 3. Fast & Slow Pointers

Use for cycle detection and finding middle element.

```javascript
// Example: Remove duplicates from sorted array
function removeDuplicates(nums) {
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      nums[++slow] = nums[fast];
    }
  }
  return slow + 1;
}
```

## Common Problems

### Easy

- [ ] Two Sum
- [ ] Best Time to Buy and Sell Stock
- [ ] Valid Palindrome
- [ ] Contains Duplicate
- [ ] Maximum Subarray
- [ ] Merge Sorted Array
- [ ] Remove Duplicates from Sorted Array
- [ ] Plus One

### Medium

- [ ] Container With Most Water
- [ ] 3Sum
- [ ] Longest Substring Without Repeating Characters
- [ ] Longest Palindromic Substring
- [ ] Group Anagrams
- [ ] Rotate Image
- [ ] Spiral Matrix
- [ ] Set Matrix Zeroes
- [ ] Product of Array Except Self
- [ ] Find Minimum in Rotated Sorted Array

### Hard

- [ ] Trapping Rain Water
- [ ] Minimum Window Substring
- [ ] Median of Two Sorted Arrays
- [ ] Longest Valid Parentheses
- [ ] First Missing Positive

## Practice Strategy

1. **Start with basics** - Array manipulation, reversal
2. **Master two pointers** - Works on 30% of problems
3. **Learn sliding window** - Essential for substring problems
4. **Practice matrix problems** - Common in interviews
5. **Optimize solutions** - Go from O(n²) to O(n)

## Resources

- [LeetCode Array Problems](https://leetcode.com/tag/array/)
- [LeetCode String Problems](https://leetcode.com/tag/string/)
- [Two Pointers Pattern](https://leetcode.com/discuss/study-guide/1688903/Solved-all-two-pointers-problems-in-100-days)
- [Sliding Window Pattern](https://leetcode.com/discuss/study-guide/657507/Sliding-Window-for-Beginners-Problems-or-Template-or-Sample-Solutions)

## Files in This Directory

- `arrays.js` - JavaScript implementations
- `arrays.go` - Go implementations
- `README.md` - This file
