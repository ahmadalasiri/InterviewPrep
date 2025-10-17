/**
 * ============================================================================
 * BACKTRACKING - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS BACKTRACKING?
 * ---------------------
 * Backtracking is an algorithmic technique for solving problems recursively
 * by trying to build a solution incrementally, abandoning (backtracking)
 * candidates that fail to satisfy constraints as soon as it's determined
 * they cannot possibly lead to a valid solution.
 *
 * "Try, fail, learn, retry" - Backtracking Philosophy
 *
 * BACKTRACKING = RECURSION + PRUNING + CHOICE + CONSTRAINT
 *
 * KEY CONCEPTS:
 *
 * 1. **Choice**: At each step, what choices do we have?
 *    - Example in Subsets: Include or exclude current element
 *
 * 2. **Constraint**: What rules must be satisfied?
 *    - Example in N-Queens: No two queens in same row/column/diagonal
 *
 * 3. **Goal**: When have we found a complete solution?
 *    - Example in Permutations: When we've used all elements
 *
 * 4. **Pruning**: Skip paths that can't lead to solution
 *    - Example in Sudoku: If digit violates rules, skip it
 *
 * WHEN TO USE BACKTRACKING?
 *
 * Use backtracking when:
 * - Need to find ALL solutions (not just optimal one)
 * - Need to generate combinations/permutations
 * - Problem has constraints to satisfy
 * - Can abandon partial solutions early
 * - Brute force is too slow but DP doesn't apply
 *
 * Keywords that hint at backtracking:
 * - "Generate all..."
 * - "Find all possible..."
 * - "Combinations", "Permutations", "Subsets"
 * - "N-Queens", "Sudoku", "Maze"
 *
 * BACKTRACKING TEMPLATE:
 *
 * ```typescript
 * function backtrack(
 *   currentPath: any[],     // Current partial solution
 *   choices: any[],         // Available choices
 *   solutions: any[][]      // All solutions found
 * ): void {
 *   // Base case: Found complete solution
 *   if (isGoalReached(currentPath)) {
 *     solutions.push([...currentPath]);  // Save copy!
 *     return;
 *   }
 *
 *   // Try each possible choice
 *   for (const choice of choices) {
 *     // Pruning: Skip if choice violates constraints
 *     if (!isValid(choice, currentPath)) {
 *       continue;
 *     }
 *
 *     // Make choice
 *     currentPath.push(choice);
 *
 *     // Explore with this choice
 *     backtrack(currentPath, newChoices, solutions);
 *
 *     // Unmake choice (BACKTRACK!)
 *     currentPath.pop();
 *   }
 * }
 * ```
 *
 * THE THREE STEPS:
 * 1. **Choose**: Add element to current path
 * 2. **Explore**: Recursively solve with this choice
 * 3. **Unchoose**: Remove element (backtrack)
 *
 * TIME COMPLEXITY:
 *
 * Backtracking is generally exponential:
 * - Subsets: O(n · 2ⁿ) - 2ⁿ subsets, each takes O(n) to copy
 * - Permutations: O(n · n!) - n! permutations, each takes O(n)
 * - Combinations: O(k · C(n,k)) - C(n,k) combinations
 * - N-Queens: O(n!) with pruning
 * - Sudoku: O(9^(n*n)) worst case, much better with pruning
 *
 * Pruning can dramatically improve performance!
 *
 * COMMON BACKTRACKING PATTERNS:
 *
 * 1. **SUBSETS/POWER SET**
 *    - Generate all possible subsets
 *    - At each element: include or exclude
 *    - Time: O(n · 2ⁿ)
 *    - Problems: Subsets, Subset Sum
 *
 * 2. **COMBINATIONS**
 *    - Choose k elements from n elements
 *    - Order doesn't matter: [1,2] same as [2,1]
 *    - Use start index to avoid duplicates
 *    - Time: O(C(n,k))
 *    - Problems: Combinations, Combination Sum
 *
 * 3. **PERMUTATIONS**
 *    - Arrange n elements in all possible orders
 *    - Order matters: [1,2] different from [2,1]
 *    - Use visited array or swap technique
 *    - Time: O(n · n!)
 *    - Problems: Permutations, Permutations II
 *
 * 4. **CONSTRAINT SATISFACTION**
 *    - Place elements following rules
 *    - Check constraints at each step
 *    - Prune invalid branches early
 *    - Problems: N-Queens, Sudoku Solver
 *
 * 5. **PATH FINDING**
 *    - Find paths in grid/graph
 *    - Mark visited, explore, unmark
 *    - Problems: Word Search, Rat in Maze
 *
 * 6. **PARTITION/SPLIT**
 *    - Split string/array into valid parts
 *    - Check validity at each partition
 *    - Problems: Palindrome Partitioning, IP Addresses
 *
 * BACKTRACKING vs OTHER TECHNIQUES:
 *
 * **Backtracking vs Brute Force:**
 * - Brute Force: Tries everything
 * - Backtracking: Prunes invalid branches (faster!)
 *
 * **Backtracking vs Dynamic Programming:**
 * - Backtracking: Finds ALL solutions, exponential
 * - DP: Finds ONE optimal solution, polynomial
 * - Use Backtracking: Need all solutions
 * - Use DP: Need optimal solution, have overlapping subproblems
 *
 * **Backtracking vs Greedy:**
 * - Backtracking: Explores all possibilities
 * - Greedy: Makes one choice, never looks back
 * - Backtracking is slower but guarantees finding solution
 *
 * COMMON INTERVIEW QUESTIONS:
 *
 * **Subsets & Combinations:**
 * 1. Subsets / Subsets II (with duplicates)
 * 2. Combinations
 * 3. Combination Sum / II / III / IV
 * 4. Letter Combinations of Phone Number
 * 5. Generate Parentheses
 *
 * **Permutations:**
 * 6. Permutations / Permutations II (with duplicates)
 * 7. Next Permutation
 * 8. Permutation Sequence
 *
 * **Constraint Satisfaction:**
 * 9. N-Queens / N-Queens II
 * 10. Sudoku Solver
 * 11. Valid Sudoku
 *
 * **Path & Grid:**
 * 12. Word Search / Word Search II
 * 13. Robot Room Cleaner
 * 14. Unique Paths III
 *
 * **Partition:**
 * 15. Palindrome Partitioning / II
 * 16. Restore IP Addresses
 * 17. Word Break II
 *
 * **Other:**
 * 18. Expression Add Operators
 * 19. Matchsticks to Square
 * 20. Beautiful Arrangement
 *
 * OPTIMIZATION TECHNIQUES:
 *
 * 1. **Pruning**: Skip invalid branches early
 *    - Check constraints BEFORE recursing
 *    - Saves massive amounts of computation
 *
 * 2. **Ordering**: Choose which branches to explore first
 *    - Try most likely to succeed first
 *    - Fail fast principle
 *
 * 3. **Constraint Propagation**: Update available choices
 *    - If choosing A eliminates B, update immediately
 *    - Used in Sudoku solvers
 *
 * 4. **Memoization** (if applicable):
 *    - Cache results of subproblems
 *    - Converts to DP if subproblems overlap
 *
 * 5. **Symmetry Breaking**: Avoid exploring symmetric solutions
 *    - In N-Queens, only place first queen in half the columns
 *
 * INTERVIEW TIPS:
 *
 * 1. **Draw the Decision Tree**
 *    - Visualize the recursion tree
 *    - See where pruning can happen
 *    - Understand time complexity
 *
 * 2. **Start Simple**
 *    - Implement without optimization first
 *    - Add pruning incrementally
 *    - Test each version
 *
 * 3. **Watch Out for Duplicates**
 *    - Sort input if needed
 *    - Skip duplicate choices
 *    - Use visited set/array
 *
 * 4. **Copy Data Structures**
 *    - When saving solution, use [...path] not path
 *    - Avoid reference issues
 *
 * 5. **Base Cases Matter**
 *    - Clear goal condition
 *    - Handle empty input
 *
 * 6. **Explain Pruning**
 *    - Show how you optimize
 *    - Calculate complexity
 *    - Impressive in interviews!
 *
 * COMMON MISTAKES:
 *
 * 1. Forgetting to backtrack (not removing choice)
 * 2. Not copying solution when saving
 * 3. Not checking constraints early enough
 * 4. Wrong base case
 * 5. Modifying input when shouldn't
 * 6. Not handling duplicates properly
 *
 * PRACTICAL APPLICATIONS:
 * - Puzzle solving (Sudoku, crosswords)
 * - Game AI (chess, checkers)
 * - Scheduling problems
 * - Configuration problems
 * - Theorem proving
 * - Constraint satisfaction problems
 *
 * ============================================================================
 */

// ============================================================================
// SUBSETS & COMBINATIONS
// ============================================================================

class SubsetsProblems {
  /**
   * All Subsets (Power Set)
   * Time: O(n * 2ⁿ), Space: O(n * 2ⁿ)
   */
  static subsets(nums: number[]): number[][] {
    const result: number[][] = [];

    const backtrack = (start: number, current: number[]) => {
      result.push([...current]);

      for (let i = start; i < nums.length; i++) {
        current.push(nums[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    };

    backtrack(0, []);
    return result;
  }

  /**
   * Subsets II - With duplicates
   * Time: O(n * 2ⁿ), Space: O(n * 2ⁿ)
   */
  static subsetsWithDup(nums: number[]): number[][] {
    const result: number[][] = [];
    nums.sort((a, b) => a - b);

    const backtrack = (start: number, current: number[]) => {
      result.push([...current]);

      for (let i = start; i < nums.length; i++) {
        if (i > start && nums[i] === nums[i - 1]) continue;
        current.push(nums[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    };

    backtrack(0, []);
    return result;
  }

  /**
   * Combinations - Choose k numbers from [1, n]
   * Time: O(k * C(n,k)), Space: O(C(n,k))
   */
  static combine(n: number, k: number): number[][] {
    const result: number[][] = [];

    const backtrack = (start: number, current: number[]) => {
      if (current.length === k) {
        result.push([...current]);
        return;
      }

      for (let i = start; i <= n; i++) {
        current.push(i);
        backtrack(i + 1, current);
        current.pop();
      }
    };

    backtrack(1, []);
    return result;
  }

  /**
   * Combination Sum - Can reuse same number
   * Time: O(n^(target/min)), Space: O(target/min)
   */
  static combinationSum(candidates: number[], target: number): number[][] {
    const result: number[][] = [];

    const backtrack = (start: number, current: number[], sum: number) => {
      if (sum === target) {
        result.push([...current]);
        return;
      }

      if (sum > target) return;

      for (let i = start; i < candidates.length; i++) {
        current.push(candidates[i]);
        backtrack(i, current, sum + candidates[i]); // i not i+1 (can reuse)
        current.pop();
      }
    };

    backtrack(0, [], 0);
    return result;
  }

  /**
   * Combination Sum II - Each number used once
   * Time: O(2ⁿ), Space: O(n)
   */
  static combinationSum2(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    candidates.sort((a, b) => a - b);

    const backtrack = (start: number, current: number[], sum: number) => {
      if (sum === target) {
        result.push([...current]);
        return;
      }

      if (sum > target) return;

      for (let i = start; i < candidates.length; i++) {
        if (i > start && candidates[i] === candidates[i - 1]) continue;
        current.push(candidates[i]);
        backtrack(i + 1, current, sum + candidates[i]);
        current.pop();
      }
    };

    backtrack(0, [], 0);
    return result;
  }
}

// ============================================================================
// PERMUTATIONS
// ============================================================================

class PermutationProblems {
  /**
   * All Permutations
   * Time: O(n! * n), Space: O(n! * n)
   */
  static permute(nums: number[]): number[][] {
    const result: number[][] = [];

    const backtrack = (current: number[], remaining: number[]) => {
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
        current.pop();
      }
    };

    backtrack([], nums);
    return result;
  }

  /**
   * Permutations - In-place swap approach
   * Time: O(n! * n), Space: O(n)
   */
  static permuteInPlace(nums: number[]): number[][] {
    const result: number[][] = [];

    const backtrack = (start: number) => {
      if (start === nums.length) {
        result.push([...nums]);
        return;
      }

      for (let i = start; i < nums.length; i++) {
        [nums[start], nums[i]] = [nums[i], nums[start]];
        backtrack(start + 1);
        [nums[start], nums[i]] = [nums[i], nums[start]];
      }
    };

    backtrack(0);
    return result;
  }

  /**
   * Permutations II - With duplicates
   * Time: O(n! * n), Space: O(n)
   */
  static permuteUnique(nums: number[]): number[][] {
    const result: number[][] = [];
    nums.sort((a, b) => a - b);
    const used = new Array(nums.length).fill(false);

    const backtrack = (current: number[]) => {
      if (current.length === nums.length) {
        result.push([...current]);
        return;
      }

      for (let i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

        used[i] = true;
        current.push(nums[i]);
        backtrack(current);
        current.pop();
        used[i] = false;
      }
    };

    backtrack([]);
    return result;
  }

  /**
   * Next Permutation
   * Time: O(n), Space: O(1)
   */
  static nextPermutation(nums: number[]): void {
    // Find first decreasing element from right
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
      i--;
    }

    if (i >= 0) {
      // Find element just larger than nums[i]
      let j = nums.length - 1;
      while (nums[j] <= nums[i]) {
        j--;
      }
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    // Reverse from i+1 to end
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
    }
  }
}

// ============================================================================
// N-QUEENS
// ============================================================================

/**
 * N-Queens - Place N queens on N×N chessboard
 * Time: O(N!), Space: O(N²)
 */
class NQueens {
  static solveNQueens(n: number): string[][] {
    const result: string[][] = [];
    const board: string[][] = Array.from({ length: n }, () =>
      new Array(n).fill(".")
    );

    const cols = new Set<number>();
    const diag1 = new Set<number>();
    const diag2 = new Set<number>();

    const backtrack = (row: number) => {
      if (row === n) {
        result.push(board.map((r) => r.join("")));
        return;
      }

      for (let col = 0; col < n; col++) {
        if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
          continue;
        }

        board[row][col] = "Q";
        cols.add(col);
        diag1.add(row - col);
        diag2.add(row + col);

        backtrack(row + 1);

        board[row][col] = ".";
        cols.delete(col);
        diag1.delete(row - col);
        diag2.delete(row + col);
      }
    };

    backtrack(0);
    return result;
  }

  static totalNQueens(n: number): number {
    return this.solveNQueens(n).length;
  }
}

// ============================================================================
// SUDOKU SOLVER
// ============================================================================

/**
 * Sudoku Solver
 * Time: O(9^m) where m is empty cells, Space: O(1)
 */
class SudokuSolver {
  static solveSudoku(board: string[][]): void {
    this.solve(board);
  }

  private static solve(board: string[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === ".") {
          for (let num = 1; num <= 9; num++) {
            const char = num.toString();

            if (this.isValid(board, row, col, char)) {
              board[row][col] = char;

              if (this.solve(board)) {
                return true;
              }

              board[row][col] = ".";
            }
          }

          return false;
        }
      }
    }

    return true;
  }

  private static isValid(
    board: string[][],
    row: number,
    col: number,
    num: string
  ): boolean {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  }
}

// ============================================================================
// WORD SEARCH
// ============================================================================

class WordSearch {
  /**
   * Word Search - Find word in 2D grid
   * Time: O(m * n * 4^L) where L is word length
   */
  static exist(board: string[][], word: string): boolean {
    const m = board.length;
    const n = board[0].length;

    const backtrack = (row: number, col: number, index: number): boolean => {
      if (index === word.length) return true;

      if (
        row < 0 ||
        row >= m ||
        col < 0 ||
        col >= n ||
        board[row][col] !== word[index]
      ) {
        return false;
      }

      const temp = board[row][col];
      board[row][col] = "#"; // Mark as visited

      const found =
        backtrack(row + 1, col, index + 1) ||
        backtrack(row - 1, col, index + 1) ||
        backtrack(row, col + 1, index + 1) ||
        backtrack(row, col - 1, index + 1);

      board[row][col] = temp; // Restore

      return found;
    };

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (backtrack(i, j, 0)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Word Search II - Find all words
   * Time: O(m * n * 4^L)
   */
  static findWords(board: string[][], words: string[]): string[] {
    const result = new Set<string>();

    for (const word of words) {
      if (this.exist(board, word)) {
        result.add(word);
      }
    }

    return Array.from(result);
  }
}

// ============================================================================
// PALINDROME PARTITIONING
// ============================================================================

/**
 * Palindrome Partitioning - All possible partitions
 * Time: O(n * 2ⁿ), Space: O(n)
 */
function partition(s: string): string[][] {
  const result: string[][] = [];

  const isPalindrome = (str: string, left: number, right: number): boolean => {
    while (left < right) {
      if (str[left] !== str[right]) return false;
      left++;
      right--;
    }
    return true;
  };

  const backtrack = (start: number, current: string[]) => {
    if (start === s.length) {
      result.push([...current]);
      return;
    }

    for (let end = start; end < s.length; end++) {
      if (isPalindrome(s, start, end)) {
        current.push(s.substring(start, end + 1));
        backtrack(end + 1, current);
        current.pop();
      }
    }
  };

  backtrack(0, []);
  return result;
}

// ============================================================================
// GENERATE PARENTHESES
// ============================================================================

/**
 * Generate all valid parentheses combinations
 * Time: O(4ⁿ / √n), Space: O(n)
 */
function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  const backtrack = (current: string, open: number, close: number) => {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }

    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  };

  backtrack("", 0, 0);
  return result;
}

// ============================================================================
// LETTER COMBINATIONS
// ============================================================================

/**
 * Letter Combinations of Phone Number
 * Time: O(4ⁿ), Space: O(n)
 */
function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];

  const phoneMap: { [key: string]: string } = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  const result: string[] = [];

  const backtrack = (index: number, current: string) => {
    if (index === digits.length) {
      result.push(current);
      return;
    }

    const letters = phoneMap[digits[index]];
    for (const letter of letters) {
      backtrack(index + 1, current + letter);
    }
  };

  backtrack(0, "");
  return result;
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Subsets ===");
console.log("Subsets [1,2,3]:", SubsetsProblems.subsets([1, 2, 3]));
console.log("Combinations C(4,2):", SubsetsProblems.combine(4, 2));
console.log(
  "Combination Sum:",
  SubsetsProblems.combinationSum([2, 3, 6, 7], 7)
);

console.log("\n=== Permutations ===");
console.log("Permutations [1,2,3]:", PermutationProblems.permute([1, 2, 3]));

console.log("\n=== N-Queens ===");
console.log("4-Queens Solutions:", NQueens.solveNQueens(4).length);

console.log("\n=== Word Search ===");
const board = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log('Word "ABCCED" exists:', WordSearch.exist(board, "ABCCED"));
console.log('Word "SEE" exists:', WordSearch.exist(board, "SEE"));

console.log("\n=== Palindrome Partition ===");
console.log('Partition "aab":', partition("aab"));

console.log("\n=== Generate Parentheses ===");
console.log("Generate Parentheses (3):", generateParenthesis(3));

console.log("\n=== Letter Combinations ===");
console.log('Letter Combinations "23":', letterCombinations("23"));

export {
  SubsetsProblems,
  PermutationProblems,
  NQueens,
  SudokuSolver,
  WordSearch,
  partition,
  generateParenthesis,
  letterCombinations,
};
