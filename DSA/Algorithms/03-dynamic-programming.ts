/**
 * ============================================================================
 * DYNAMIC PROGRAMMING (DP) - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS DYNAMIC PROGRAMMING?
 * -----------------------------
 * Dynamic Programming is an algorithmic optimization technique that solves
 * complex problems by breaking them down into simpler overlapping subproblems
 * and storing their solutions to avoid redundant computations.
 *
 * "Those who cannot remember the past are condemned to repeat it." - DP Philosophy
 *
 * WHEN TO USE DYNAMIC PROGRAMMING?
 *
 * Two key properties must exist:
 *
 * 1. **Overlapping Subproblems**
 *    - Same subproblems are solved multiple times
 *    - Example: Fibonacci - fib(n) needs fib(n-1) and fib(n-2),
 *      and fib(n-1) also needs fib(n-2)
 *
 * 2. **Optimal Substructure**
 *    - Optimal solution contains optimal solutions to subproblems
 *    - Example: Shortest path - shortest path A→C through B uses
 *      shortest paths A→B and B→C
 *
 * TWO APPROACHES TO DP:
 *
 * 1. **MEMOIZATION (Top-Down)**
 *    - Start with original problem
 *    - Recursively solve subproblems
 *    - Store (memoize) results in cache (usually hash map)
 *    - Check cache before computing
 *
 *    Advantages:
 *    + Intuitive (follows natural recursion)
 *    + Only computes needed subproblems
 *
 *    Disadvantages:
 *    - Recursion overhead (call stack)
 *    - Risk of stack overflow
 *    - Usually slower than tabulation
 *
 * 2. **TABULATION (Bottom-Up)**
 *    - Start with smallest subproblems
 *    - Build up iteratively to original problem
 *    - Store results in table (usually array)
 *    - No recursion needed
 *
 *    Advantages:
 *    + No recursion overhead
 *    + Usually faster
 *    + Can optimize space
 *
 *    Disadvantages:
 *    - Less intuitive
 *    - May compute unnecessary subproblems
 *
 * EXAMPLE - FIBONACCI:
 *
 * Naive Recursion: O(2ⁿ) - exponential, SLOW!
 * ```
 * fib(5)
 *   ├─ fib(4)
 *   │   ├─ fib(3)
 *   │   │   ├─ fib(2)  ← computed
 *   │   │   └─ fib(1)
 *   │   └─ fib(2)  ← computed AGAIN!
 *   └─ fib(3)  ← computed AGAIN!
 *       ├─ fib(2)  ← computed AGAIN!
 *       └─ fib(1)
 * ```
 *
 * With Memoization: O(n) - linear, FAST!
 * Each fib(i) computed only once and cached.
 *
 * DP PROBLEM CATEGORIES:
 *
 * 1. **LINEAR DP** (1D array)
 *    - Fibonacci, Climbing Stairs, House Robber
 *    - dp[i] depends on previous elements
 *
 * 2. **2D DP** (2D array)
 *    - Longest Common Subsequence, Edit Distance
 *    - Grid path problems, Knapsack
 *    - dp[i][j] depends on dp[i-1][j], dp[i][j-1], etc.
 *
 * 3. **INTERVAL DP**
 *    - Matrix Chain Multiplication
 *    - Palindrome problems
 *    - dp[i][j] represents interval [i, j]
 *
 * 4. **TREE DP**
 *    - Maximum path sum in tree
 *    - Diameter of tree
 *    - Solve for subtrees first
 *
 * 5. **STATE MACHINE DP**
 *    - Best Time to Buy/Sell Stock
 *    - Different states (holding, not holding, cooldown)
 *
 * 6. **BITMASK DP**
 *    - Traveling Salesman Problem
 *    - Use bits to represent states
 *
 * COMMON DP PATTERNS:
 *
 * 1. **Fibonacci-style**: dp[i] = dp[i-1] + dp[i-2]
 *    - Climbing Stairs, House Robber
 *
 * 2. **Knapsack**: Include or exclude item
 *    - 0/1 Knapsack, Subset Sum, Partition
 *
 * 3. **Longest Common Subsequence (LCS)**
 *    - Compare two sequences
 *    - Edit Distance, Diff algorithm
 *
 * 4. **Longest Increasing Subsequence (LIS)**
 *    - Build increasing sequence
 *    - Can optimize with binary search
 *
 * 5. **Coin Change**: Make amount with given coins
 *    - Unbounded knapsack variant
 *
 * 6. **Palindrome**: Check/build palindromes
 *    - Longest Palindromic Subsequence/Substring
 *
 * HOW TO APPROACH DP PROBLEMS:
 *
 * Step 1: **Identify if it's DP**
 *    - Optimization problem (min/max/count)
 *    - Can break into subproblems
 *    - Subproblems overlap
 *
 * Step 2: **Define the state**
 *    - What parameters uniquely identify a subproblem?
 *    - Usually: dp[i], dp[i][j], or dp[state]
 *
 * Step 3: **Write the recurrence relation**
 *    - How to compute dp[i] from smaller subproblems?
 *    - This is the heart of DP!
 *
 * Step 4: **Identify base cases**
 *    - Smallest subproblems with known answers
 *    - Usually: dp[0], dp[0][0], etc.
 *
 * Step 5: **Decide order of computation**
 *    - Ensure dependencies are computed first
 *    - Usually: small to large indices
 *
 * Step 6: **Optimize space if possible**
 *    - Often can reduce 2D to 1D
 *    - Or even to O(1) with variables
 *
 * SPACE OPTIMIZATION:
 *
 * Many DP problems can be optimized:
 * - 2D DP → 1D DP (if only need previous row/column)
 * - 1D DP → Few variables (if only need last few values)
 *
 * Example: Fibonacci
 * - 1D array: O(n) space
 * - Two variables: O(1) space
 *
 * Example: Knapsack
 * - 2D array: O(n·W) space
 * - 1D array: O(W) space (with careful iteration)
 *
 * TIME COMPLEXITY ANALYSIS:
 *
 * General formula:
 * - Number of states × Time per state
 *
 * Examples:
 * - Fibonacci: n states × O(1) = O(n)
 * - Knapsack: n·W states × O(1) = O(n·W)
 * - LCS: m·n states × O(1) = O(m·n)
 *
 * COMMON INTERVIEW QUESTIONS:
 *
 * **Classic DP:**
 * 1. Climbing Stairs
 * 2. House Robber / House Robber II
 * 3. Coin Change / Coin Change 2
 * 4. Longest Increasing Subsequence
 * 5. Longest Common Subsequence
 * 6. Edit Distance (Levenshtein)
 * 7. 0/1 Knapsack
 * 8. Partition Equal Subset Sum
 *
 * **String DP:**
 * 9. Longest Palindromic Substring
 * 10. Palindrome Partitioning II
 * 11. Word Break
 * 12. Regular Expression Matching
 * 13. Wildcard Matching
 * 14. Distinct Subsequences
 *
 * **Grid DP:**
 * 15. Unique Paths / Unique Paths II
 * 16. Minimum Path Sum
 * 17. Maximal Square
 * 18. Dungeon Game
 *
 * **Advanced DP:**
 * 19. Maximum Product Subarray
 * 20. Best Time to Buy and Sell Stock (all variants)
 * 21. Decode Ways
 * 22. Interleaving String
 * 23. Scramble String
 * 24. Burst Balloons
 * 25. Stone Game
 *
 * INTERVIEW TIPS:
 *
 * 1. **Start with brute force recursion**
 *    - Write naive recursive solution first
 *    - Identify overlapping subproblems
 *    - Then add memoization
 *
 * 2. **Draw the recursion tree**
 *    - Visualize overlapping subproblems
 *    - Helps understand the pattern
 *
 * 3. **Define states clearly**
 *    - What does dp[i] or dp[i][j] represent?
 *    - Be precise!
 *
 * 4. **Check for space optimization**
 *    - Can you reduce dimensions?
 *    - Impressive in interviews!
 *
 * 5. **Practice common patterns**
 *    - Most problems are variations of classics
 *    - Recognize the pattern quickly
 *
 * 6. **Handle edge cases**
 *    - Empty input
 *    - Single element
 *    - All same elements
 *
 * DP vs GREEDY vs DIVIDE & CONQUER:
 *
 * - **DP**: Solves all subproblems, optimal for overlapping problems
 * - **Greedy**: Makes local optimal choice, faster but not always optimal
 * - **Divide & Conquer**: Solves independent subproblems (no overlap)
 *
 * COMMON PITFALLS:
 *
 * 1. Not checking if it's actually DP (maybe it's greedy!)
 * 2. Wrong recurrence relation
 * 3. Missing base cases
 * 4. Wrong iteration order (dependencies not met)
 * 5. Integer overflow (use long if needed)
 * 6. Not considering space optimization
 *
 * ============================================================================
 */

// ============================================================================
// FIBONACCI - Classic DP Example
// ============================================================================

class Fibonacci {
  /**
   * Fibonacci - Naive Recursive
   * Time: O(2ⁿ), Space: O(n)
   */
  static naive(n: number): number {
    if (n <= 1) return n;
    return this.naive(n - 1) + this.naive(n - 2);
  }

  /**
   * Fibonacci - Memoization (Top-Down)
   * Time: O(n), Space: O(n)
   */
  static memoization(n: number, memo: Map<number, number> = new Map()): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;

    const result =
      this.memoization(n - 1, memo) + this.memoization(n - 2, memo);
    memo.set(n, result);
    return result;
  }

  /**
   * Fibonacci - Tabulation (Bottom-Up)
   * Time: O(n), Space: O(n)
   */
  static tabulation(n: number): number {
    if (n <= 1) return n;

    const dp: number[] = new Array(n + 1);
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
  static optimized(n: number): number {
    if (n <= 1) return n;

    let prev2 = 0;
    let prev1 = 1;

    for (let i = 2; i <= n; i++) {
      const current = prev1 + prev2;
      prev2 = prev1;
      prev1 = current;
    }

    return prev1;
  }
}

// ============================================================================
// CLIMBING STAIRS
// ============================================================================

/**
 * Climbing Stairs - How many ways to reach top?
 * Time: O(n), Space: O(1)
 */
function climbStairs(n: number): number {
  if (n <= 2) return n;

  let prev2 = 1;
  let prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// ============================================================================
// HOUSE ROBBER
// ============================================================================

class HouseRobber {
  /**
   * House Robber - Rob maximum without adjacent houses
   * Time: O(n), Space: O(n)
   */
  static rob(nums: number[]): number {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    const dp: number[] = new Array(nums.length);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (let i = 2; i < nums.length; i++) {
      dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
    }

    return dp[nums.length - 1];
  }

  /**
   * House Robber - Space Optimized
   * Time: O(n), Space: O(1)
   */
  static robOptimized(nums: number[]): number {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    let prev2 = nums[0];
    let prev1 = Math.max(nums[0], nums[1]);

    for (let i = 2; i < nums.length; i++) {
      const current = Math.max(prev1, nums[i] + prev2);
      prev2 = prev1;
      prev1 = current;
    }

    return prev1;
  }

  /**
   * House Robber II - Circular arrangement
   * Time: O(n), Space: O(1)
   */
  static robCircular(nums: number[]): number {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    // Either rob first house (can't rob last) or rob last house (can't rob first)
    return Math.max(
      this.robRange(nums, 0, nums.length - 2),
      this.robRange(nums, 1, nums.length - 1)
    );
  }

  private static robRange(nums: number[], start: number, end: number): number {
    let prev2 = 0;
    let prev1 = 0;

    for (let i = start; i <= end; i++) {
      const current = Math.max(prev1, nums[i] + prev2);
      prev2 = prev1;
      prev1 = current;
    }

    return prev1;
  }
}

// ============================================================================
// LONGEST INCREASING SUBSEQUENCE (LIS)
// ============================================================================

class LIS {
  /**
   * Longest Increasing Subsequence - DP
   * Time: O(n²), Space: O(n)
   */
  static lengthOfLIS(nums: number[]): number {
    if (nums.length === 0) return 0;

    const dp: number[] = new Array(nums.length).fill(1);

    for (let i = 1; i < nums.length; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[i] > nums[j]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
    }

    return Math.max(...dp);
  }

  /**
   * Longest Increasing Subsequence - Binary Search
   * Time: O(n log n), Space: O(n)
   */
  static lengthOfLISOptimized(nums: number[]): number {
    const tails: number[] = [];

    for (const num of nums) {
      let left = 0;
      let right = tails.length;

      while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
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
}

// ============================================================================
// LONGEST COMMON SUBSEQUENCE (LCS)
// ============================================================================

class LCS {
  /**
   * Longest Common Subsequence
   * Time: O(m * n), Space: O(m * n)
   */
  static longestCommonSubsequence(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      new Array(n + 1).fill(0)
    );

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
  static lcsOptimized(text1: string, text2: string): number {
    const n = text2.length;
    let prev: number[] = new Array(n + 1).fill(0);

    for (let i = 1; i <= text1.length; i++) {
      const current: number[] = new Array(n + 1).fill(0);

      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          current[j] = prev[j - 1] + 1;
        } else {
          current[j] = Math.max(prev[j], current[j - 1]);
        }
      }

      prev = current;
    }

    return prev[n];
  }
}

// ============================================================================
// EDIT DISTANCE (Levenshtein Distance)
// ============================================================================

/**
 * Edit Distance - Minimum operations to convert word1 to word2
 * Operations: Insert, Delete, Replace
 * Time: O(m * n), Space: O(m * n)
 */
function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // Delete
            dp[i][j - 1], // Insert
            dp[i - 1][j - 1] // Replace
          );
      }
    }
  }

  return dp[m][n];
}

// ============================================================================
// 0/1 KNAPSACK
// ============================================================================

class Knapsack {
  /**
   * 0/1 Knapsack - Maximum value with weight constraint
   * Time: O(n * W), Space: O(n * W)
   */
  static knapsack(
    weights: number[],
    values: number[],
    capacity: number
  ): number {
    const n = weights.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () =>
      new Array(capacity + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(
            values[i - 1] + dp[i - 1][w - weights[i - 1]],
            dp[i - 1][w]
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
  static knapsackOptimized(
    weights: number[],
    values: number[],
    capacity: number
  ): number {
    const dp: number[] = new Array(capacity + 1).fill(0);

    for (let i = 0; i < weights.length; i++) {
      for (let w = capacity; w >= weights[i]; w--) {
        dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
      }
    }

    return dp[capacity];
  }

  /**
   * Partition Equal Subset Sum
   * Time: O(n * sum), Space: O(sum)
   */
  static canPartition(nums: number[]): boolean {
    const totalSum = nums.reduce((a, b) => a + b, 0);

    if (totalSum % 2 !== 0) return false;

    const target = totalSum / 2;
    const dp: boolean[] = new Array(target + 1).fill(false);
    dp[0] = true;

    for (const num of nums) {
      for (let j = target; j >= num; j--) {
        dp[j] = dp[j] || dp[j - num];
      }
    }

    return dp[target];
  }
}

// ============================================================================
// COIN CHANGE
// ============================================================================

class CoinChange {
  /**
   * Coin Change - Minimum coins to make amount
   * Time: O(amount * coins.length), Space: O(amount)
   */
  static coinChange(coins: number[], amount: number): number {
    const dp: number[] = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (i >= coin) {
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
      }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
  }

  /**
   * Coin Change II - Number of ways to make amount
   * Time: O(amount * coins.length), Space: O(amount)
   */
  static change(amount: number, coins: number[]): number {
    const dp: number[] = new Array(amount + 1).fill(0);
    dp[0] = 1;

    for (const coin of coins) {
      for (let i = coin; i <= amount; i++) {
        dp[i] += dp[i - coin];
      }
    }

    return dp[amount];
  }
}

// ============================================================================
// MATRIX CHAIN MULTIPLICATION
// ============================================================================

/**
 * Matrix Chain Multiplication - Minimum multiplications
 * Time: O(n³), Space: O(n²)
 */
function matrixChainMultiplication(dimensions: number[]): number {
  const n = dimensions.length - 1;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        const cost =
          dp[i][k] +
          dp[k + 1][j] +
          dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[0][n - 1];
}

// ============================================================================
// PALINDROME PROBLEMS
// ============================================================================

class PalindromeDP {
  /**
   * Longest Palindromic Substring
   * Time: O(n²), Space: O(n²)
   */
  static longestPalindrome(s: string): string {
    const n = s.length;
    const dp: boolean[][] = Array.from({ length: n }, () =>
      new Array(n).fill(false)
    );

    let start = 0;
    let maxLen = 1;

    // Single characters
    for (let i = 0; i < n; i++) {
      dp[i][i] = true;
    }

    // Two characters
    for (let i = 0; i < n - 1; i++) {
      if (s[i] === s[i + 1]) {
        dp[i][i + 1] = true;
        start = i;
        maxLen = 2;
      }
    }

    // Longer palindromes
    for (let len = 3; len <= n; len++) {
      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1;

        if (s[i] === s[j] && dp[i + 1][j - 1]) {
          dp[i][j] = true;
          start = i;
          maxLen = len;
        }
      }
    }

    return s.substring(start, start + maxLen);
  }

  /**
   * Palindromic Partitioning - Minimum cuts
   * Time: O(n²), Space: O(n²)
   */
  static minCut(s: string): number {
    const n = s.length;
    const isPalin: boolean[][] = Array.from({ length: n }, () =>
      new Array(n).fill(false)
    );
    const cuts: number[] = new Array(n);

    for (let i = 0; i < n; i++) {
      let minCuts = i;

      for (let j = 0; j <= i; j++) {
        if (s[j] === s[i] && (i - j <= 1 || isPalin[j + 1][i - 1])) {
          isPalin[j][i] = true;
          minCuts = j === 0 ? 0 : Math.min(minCuts, cuts[j - 1] + 1);
        }
      }

      cuts[i] = minCuts;
    }

    return cuts[n - 1];
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Fibonacci ===");
console.log("Fib(10) Tabulation:", Fibonacci.tabulation(10));
console.log("Fib(10) Optimized:", Fibonacci.optimized(10));

console.log("\n=== Climbing Stairs ===");
console.log("Climb Stairs (5):", climbStairs(5));

console.log("\n=== House Robber ===");
console.log("Rob Houses [2,7,9,3,1]:", HouseRobber.rob([2, 7, 9, 3, 1]));
console.log("Rob Circular [2,3,2]:", HouseRobber.robCircular([2, 3, 2]));

console.log("\n=== LIS ===");
console.log(
  "LIS [10,9,2,5,3,7,101,18]:",
  LIS.lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])
);
console.log(
  "LIS Optimized:",
  LIS.lengthOfLISOptimized([10, 9, 2, 5, 3, 7, 101, 18])
);

console.log("\n=== LCS ===");
console.log(
  'LCS ("abcde", "ace"):',
  LCS.longestCommonSubsequence("abcde", "ace")
);

console.log("\n=== Edit Distance ===");
console.log('Edit Distance ("horse", "ros"):', minDistance("horse", "ros"));

console.log("\n=== Knapsack ===");
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
console.log("Knapsack (capacity=7):", Knapsack.knapsack(weights, values, 7));
console.log("Can Partition [1,5,11,5]:", Knapsack.canPartition([1, 5, 11, 5]));

console.log("\n=== Coin Change ===");
console.log("Min Coins (amount=11):", CoinChange.coinChange([1, 2, 5], 11));
console.log("Coin Change Ways (amount=5):", CoinChange.change(5, [1, 2, 5]));

console.log("\n=== Palindrome ===");
console.log(
  'Longest Palindrome "babad":',
  PalindromeDP.longestPalindrome("babad")
);
console.log('Min Cut "aab":', PalindromeDP.minCut("aab"));

export {
  Fibonacci,
  climbStairs,
  HouseRobber,
  LIS,
  LCS,
  minDistance,
  Knapsack,
  CoinChange,
  matrixChainMultiplication,
  PalindromeDP,
};
