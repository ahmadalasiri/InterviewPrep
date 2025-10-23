/**
 * Dynamic Programming - JavaScript Implementation
 *
 * Topics covered:
 * - 1D DP problems
 * - 2D DP problems
 * - Memoization vs Tabulation
 * - Common DP patterns
 */

// ============================================
// FIBONACCI SERIES
// ============================================

/**
 * Fibonacci - Recursive (Exponential Time)
 * Time: O(2ⁿ), Space: O(n) stack
 */
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

/**
 * Fibonacci - Memoization (Top-Down DP)
 * Time: O(n), Space: O(n)
 */
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

/**
 * Fibonacci - Tabulation (Bottom-Up DP)
 * Time: O(n), Space: O(n)
 */
function fibTab(n) {
  if (n <= 1) return n;

  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/**
 * Fibonacci - Space Optimized
 * Time: O(n), Space: O(1)
 */
function fibOptimized(n) {
  if (n <= 1) return n;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

// ============================================
// CLIMBING STAIRS
// ============================================

/**
 * Climbing Stairs (LeetCode 70)
 * Time: O(n), Space: O(n)
 */
function climbStairs(n) {
  if (n <= 2) return n;

  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/**
 * Climbing Stairs - Space Optimized
 * Time: O(n), Space: O(1)
 */
function climbStairsOptimized(n) {
  if (n <= 2) return n;

  let prev2 = 1;
  let prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }

  return prev1;
}

// ============================================
// HOUSE ROBBER
// ============================================

/**
 * House Robber (LeetCode 198)
 * Time: O(n), Space: O(n)
 */
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  const dp = new Array(nums.length);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }

  return dp[nums.length - 1];
}

/**
 * House Robber - Space Optimized
 * Time: O(n), Space: O(1)
 */
function robOptimized(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let prev2 = nums[0];
  let prev1 = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    const curr = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = curr;
  }

  return prev1;
}

// ============================================
// COIN CHANGE
// ============================================

/**
 * Coin Change (LeetCode 322)
 * Time: O(n * amount), Space: O(amount)
 */
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * Coin Change 2 - Number of ways (LeetCode 518)
 * Time: O(n * amount), Space: O(amount)
 */
function coinChange2(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }

  return dp[amount];
}

// ============================================
// LONGEST COMMON SUBSEQUENCE
// ============================================

/**
 * Longest Common Subsequence (LeetCode 1143)
 * Time: O(m * n), Space: O(m * n)
 */
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Longest Common Subsequence - Space Optimized
 * Time: O(m * n), Space: O(n)
 */
function longestCommonSubsequenceOptimized(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  let prev = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1).fill(0);

    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }

    prev = curr;
  }

  return prev[n];
}

// ============================================
// LONGEST INCREASING SUBSEQUENCE
// ============================================

/**
 * Longest Increasing Subsequence (LeetCode 300)
 * Time: O(n²), Space: O(n)
 */
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;

  const dp = new Array(nums.length).fill(1);
  let maxLength = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }

  return maxLength;
}

/**
 * Longest Increasing Subsequence - Binary Search
 * Time: O(n log n), Space: O(n)
 */
function lengthOfLISOptimized(nums) {
  const tails = [];

  for (let num of nums) {
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }

  return tails.length;
}

// ============================================
// 0/1 KNAPSACK
// ============================================

/**
 * 0/1 Knapsack Problem
 * Time: O(n * W), Space: O(n * W)
 */
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}

/**
 * 0/1 Knapsack - Space Optimized
 * Time: O(n * W), Space: O(W)
 */
function knapsackOptimized(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}

// ============================================
// EDIT DISTANCE
// ============================================

/**
 * Edit Distance (Levenshtein Distance) (LeetCode 72)
 * Time: O(m * n), Space: O(m * n)
 */
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Initialize first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          Math.min(
            dp[i - 1][j], // Delete
            dp[i][j - 1], // Insert
            dp[i - 1][j - 1] // Replace
          ) + 1;
      }
    }
  }

  return dp[m][n];
}

// ============================================
// PARTITION PROBLEMS
// ============================================

/**
 * Partition Equal Subset Sum (LeetCode 416)
 * Time: O(n * sum), Space: O(sum)
 */
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0);

  if (sum % 2 !== 0) return false;

  const target = sum / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (let num of nums) {
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }

  return dp[target];
}

// ============================================
// WORD BREAK
// ============================================

/**
 * Word Break (LeetCode 139)
 * Time: O(n² * m), Space: O(n)
 */
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}

// ============================================
// UNIQUE PATHS
// ============================================

/**
 * Unique Paths (LeetCode 62)
 * Time: O(m * n), Space: O(m * n)
 */
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

/**
 * Unique Paths II - With obstacles (LeetCode 63)
 * Time: O(m * n), Space: O(m * n)
 */
function uniquePathsWithObstacles(obstacleGrid) {
  const m = obstacleGrid.length;
  const n = obstacleGrid[0].length;

  if (obstacleGrid[0][0] === 1) return 0;

  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = 1;

  // Initialize first column
  for (let i = 1; i < m; i++) {
    dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i - 1][0];
  }

  // Initialize first row
  for (let j = 1; j < n; j++) {
    dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j - 1];
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0;
      } else {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
}

// ============================================
// MAXIMUM SUBARRAY
// ============================================

/**
 * Maximum Subarray (Kadane's Algorithm) (LeetCode 53)
 * Time: O(n), Space: O(1)
 */
function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

/**
 * Maximum Product Subarray (LeetCode 152)
 * Time: O(n), Space: O(1)
 */
function maxProduct(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  let minEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const temp = maxEndingHere;
    maxEndingHere = Math.max(
      nums[i],
      maxEndingHere * nums[i],
      minEndingHere * nums[i]
    );
    minEndingHere = Math.min(nums[i], temp * nums[i], minEndingHere * nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

// ============================================
// PALINDROME PROBLEMS
// ============================================

/**
 * Longest Palindromic Subsequence (LeetCode 516)
 * Time: O(n²), Space: O(n²)
 */
function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // Every single character is a palindrome of length 1
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // Build the table
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;

      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[0][n - 1];
}

// ============================================
// TESTS
// ============================================

function runTests() {
  console.log("=== Fibonacci Tests ===");
  console.log("Fib(10) Recursive:", fibRecursive(10)); // 55
  console.log("Fib(10) Memo:", fibMemo(10)); // 55
  console.log("Fib(10) Tab:", fibTab(10)); // 55
  console.log("Fib(10) Optimized:", fibOptimized(10)); // 55

  console.log("\n=== Climbing Stairs Tests ===");
  console.log("Climb Stairs(5):", climbStairs(5)); // 8
  console.log("Climb Stairs Optimized(5):", climbStairsOptimized(5)); // 8

  console.log("\n=== House Robber Tests ===");
  console.log("Rob([2,7,9,3,1]):", rob([2, 7, 9, 3, 1])); // 12
  console.log("Rob Optimized([2,7,9,3,1]):", robOptimized([2, 7, 9, 3, 1])); // 12

  console.log("\n=== Coin Change Tests ===");
  console.log("Coin Change([1,2,5], 11):", coinChange([1, 2, 5], 11)); // 3
  console.log("Coin Change 2(5, [1,2,5]):", coinChange2(5, [1, 2, 5])); // 4

  console.log("\n=== LCS Tests ===");
  console.log("LCS('abcde', 'ace'):", longestCommonSubsequence("abcde", "ace")); // 3

  console.log("\n=== LIS Tests ===");
  console.log(
    "LIS([10,9,2,5,3,7,101,18]):",
    lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])
  ); // 4

  console.log("\n=== Knapsack Tests ===");
  console.log(
    "Knapsack([1,2,3], [6,10,12], 5):",
    knapsack([1, 2, 3], [6, 10, 12], 5)
  ); // 22

  console.log("\n=== Edit Distance Tests ===");
  console.log("Edit Distance('horse', 'ros'):", minDistance("horse", "ros")); // 3

  console.log("\n=== Max Subarray Tests ===");
  console.log(
    "Max Subarray([-2,1,-3,4,-1,2,1,-5,4]):",
    maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])
  ); // 6
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  fibRecursive,
  fibMemo,
  fibTab,
  fibOptimized,
  climbStairs,
  rob,
  coinChange,
  coinChange2,
  longestCommonSubsequence,
  lengthOfLIS,
  knapsack,
  minDistance,
  canPartition,
  wordBreak,
  uniquePaths,
  uniquePathsWithObstacles,
  maxSubArray,
  maxProduct,
  longestPalindromeSubseq,
};




