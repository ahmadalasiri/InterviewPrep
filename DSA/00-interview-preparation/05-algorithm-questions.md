# Algorithm Interview Questions

## Table of Contents

- [Sorting Algorithms](#sorting-algorithms)
- [Searching Algorithms](#searching-algorithms)
- [Dynamic Programming](#dynamic-programming)
- [Greedy Algorithms](#greedy-algorithms)
- [Backtracking](#backtracking)

---

## Sorting Algorithms

### Q1: Compare different sorting algorithms

**Difficulty:** ⭐ Easy

**Answer:**

| Algorithm      | Best       | Average    | Worst      | Space    | Stable |
| -------------- | ---------- | ---------- | ---------- | -------- | ------ |
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)     | No     |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)     | Yes    |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n) | No     |
| Heap Sort      | O(n log n) | O(n log n) | O(n log n) | O(1)     | No     |
| Counting Sort  | O(n + k)   | O(n + k)   | O(n + k)   | O(k)     | Yes    |

**When to use each:**

- **Bubble/Selection/Insertion**: Small datasets, educational purposes
- **Merge Sort**: Need stable sort, linked lists
- **Quick Sort**: General purpose, fastest in practice
- **Heap Sort**: Memory constrained, guaranteed O(n log n)
- **Counting Sort**: Small range of integers

---

## Searching Algorithms

### Q2: When would you use binary search?

**Difficulty:** ⭐ Easy

**Answer:**

**Use Binary Search when:**

1. **Data is sorted**
2. **Need O(log n) search time**
3. **Have random access** (arrays, not linked lists)

**Classic Binary Search:**

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
```

**Binary Search Template:**

```javascript
// 1. Find exact match
while (left <= right) {
  // ...
}

// 2. Find leftmost position
while (left < right) {
  const mid = Math.floor((left + right) / 2);
  if (condition) right = mid;
  else left = mid + 1;
}

// 3. Find rightmost position
while (left < right) {
  const mid = Math.ceil((left + right) / 2);
  if (condition) left = mid;
  else right = mid - 1;
}
```

---

## Dynamic Programming

### Q3: What is Dynamic Programming and when should you use it?

**Difficulty:** ⭐⭐ Medium

**Answer:**

**Dynamic Programming (DP)** is an optimization technique that solves complex problems by breaking them down into simpler subproblems and storing their solutions.

**When to use DP:**

1. **Optimal substructure**: Optimal solution contains optimal solutions to subproblems
2. **Overlapping subproblems**: Same subproblems solved multiple times

**Two approaches:**

**1. Memoization (Top-Down):**

```javascript
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}
```

**2. Tabulation (Bottom-Up):**

```javascript
function fib(n) {
  if (n <= 1) return n;

  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

---

### Q4: Solve the Coin Change problem

**Difficulty:** ⭐⭐ Medium

**Answer:**

**Problem:** Given coins of different denominations and a total amount, find the minimum number of coins needed.

```javascript
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

// Example: coins = [1, 2, 5], amount = 11
// dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]
// Answer: 3 coins (5 + 5 + 1)

// Time: O(n * amount), Space: O(amount)
```

**Why DP?**

- Optimal substructure: `dp[i] = min(dp[i-coin]) + 1`
- Overlapping subproblems: Same amounts calculated multiple times

---

### Q5: Longest Common Subsequence

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
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

// Example:
// text1 = "abcde"
// text2 = "ace"
//
// DP table:
//     ""  a  c  e
// ""   0  0  0  0
// a    0  1  1  1
// b    0  1  1  1
// c    0  1  2  2
// d    0  1  2  2
// e    0  1  2  3
//
// LCS = "ace", length = 3

// Time: O(m * n), Space: O(m * n)
```

---

## Greedy Algorithms

### Q6: What is a greedy algorithm and when can you use it?

**Difficulty:** ⭐⭐ Medium

**Answer:**

**Greedy Algorithm:** Makes locally optimal choice at each step, hoping to find global optimum.

**When to use:**

1. **Greedy choice property**: Local optimum leads to global optimum
2. **Optimal substructure**: Optimal solution contains optimal subproblems

**Classic Examples:**

**1. Activity Selection:**

```javascript
function maxActivities(start, end) {
  const activities = start.map((s, i) => [s, end[i]]);
  activities.sort((a, b) => a[1] - b[1]); // Sort by end time

  let count = 1;
  let lastEnd = activities[0][1];

  for (let i = 1; i < activities.length; i++) {
    if (activities[i][0] >= lastEnd) {
      count++;
      lastEnd = activities[i][1];
    }
  }

  return count;
}
```

**2. Jump Game (LeetCode 55):**

```javascript
function canJump(nums) {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }

  return true;
}
```

**When Greedy Doesn't Work:**

- Coin change with arbitrary coins: [1, 3, 4], amount = 6
  - Greedy: 4 + 1 + 1 = 3 coins
  - Optimal: 3 + 3 = 2 coins ✓

---

## Backtracking

### Q7: What is backtracking?

**Difficulty:** ⭐⭐ Medium

**Answer:**

**Backtracking:** Build solution incrementally, abandoning candidates that fail to satisfy constraints.

**Template:**

```javascript
function backtrack(candidate) {
  if (isValidSolution(candidate)) {
    output(candidate);
    return;
  }

  for (let nextCandidate of generateCandidates(candidate)) {
    if (isValid(nextCandidate)) {
      makeMove(nextCandidate);
      backtrack(nextCandidate);
      undoMove(nextCandidate); // Backtrack!
    }
  }
}
```

**Classic Problems:**

**1. Subsets (LeetCode 78):**

```javascript
function subsets(nums) {
  const result = [];

  function backtrack(start, current) {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop(); // Backtrack
    }
  }

  backtrack(0, []);
  return result;
}

// nums = [1, 2, 3]
// Output: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

**2. Permutations (LeetCode 46):**

```javascript
function permute(nums) {
  const result = [];

  function backtrack(current, remaining) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      const newRemaining = [
        ...remaining.slice(0, i),
        ...remaining.slice(i + 1),
      ];
      backtrack(current, newRemaining);
      current.pop(); // Backtrack
    }
  }

  backtrack([], nums);
  return result;
}

// nums = [1, 2, 3]
// Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

**3. N-Queens (LeetCode 51):**

```javascript
function solveNQueens(n) {
  const result = [];
  const board = Array(n)
    .fill(".")
    .map(() => Array(n).fill("."));

  function isValid(row, col) {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === "Q") return false;
    }

    // Check diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === "Q") return false;
    }

    // Check anti-diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === "Q") return false;
    }

    return true;
  }

  function backtrack(row) {
    if (row === n) {
      result.push(board.map((r) => r.join("")));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = "Q";
        backtrack(row + 1);
        board[row][col] = "."; // Backtrack
      }
    }
  }

  backtrack(0);
  return result;
}
```

---

### Q8: Combination Sum (LeetCode 39)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function combinationSum(candidates, target) {
  const result = [];

  function backtrack(start, current, sum) {
    if (sum === target) {
      result.push([...current]);
      return;
    }

    if (sum > target) return;

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]); // Can reuse same element
      current.pop();
    }
  }

  backtrack(0, [], 0);
  return result;
}

// candidates = [2, 3, 6, 7], target = 7
// Output: [[2,2,3], [7]]

// Time: O(n^(target/min)), Space: O(target/min)
```

---

### Q9: Word Search (LeetCode 79)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function exist(board, word) {
  const rows = board.length;
  const cols = board[0].length;

  function backtrack(r, c, index) {
    if (index === word.length) return true;

    if (
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      board[r][c] !== word[index]
    ) {
      return false;
    }

    const temp = board[r][c];
    board[r][c] = "#"; // Mark as visited

    const found =
      backtrack(r + 1, c, index + 1) ||
      backtrack(r - 1, c, index + 1) ||
      backtrack(r, c + 1, index + 1) ||
      backtrack(r, c - 1, index + 1);

    board[r][c] = temp; // Backtrack

    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (backtrack(r, c, 0)) return true;
    }
  }

  return false;
}

// Time: O(m * n * 4^L) where L is word length
// Space: O(L) for recursion stack
```

---

### Q10: Generate Parentheses (LeetCode 22)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function generateParenthesis(n) {
  const result = [];

  function backtrack(current, open, close) {
    if (current.length === n * 2) {
      result.push(current);
      return;
    }

    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  }

  backtrack("", 0, 0);
  return result;
}

// n = 3
// Output: ["((()))","(()())","(())()","()(())","()()()"]

// Key insight:
// - Can only add '(' if open < n
// - Can only add ')' if close < open

// Time: O(4^n / √n), Space: O(n)
```

---

Continue to [Problem Solving Questions](./06-problem-solving-questions.md) →




