/**
 * ============================================================================
 * GREEDY ALGORITHMS - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS A GREEDY ALGORITHM?
 * ---------------------------
 * A greedy algorithm makes the locally optimal choice at each step with the
 * hope of finding a global optimum. It never reconsiders choices (no backtracking).
 *
 * "Take what you can get now!" - Greedy Philosophy
 *
 * KEY CHARACTERISTICS:
 *
 * 1. **Local Optimization**: Make best choice at current step
 * 2. **No Look Back**: Once a choice is made, never reconsider it
 * 3. **Hope for Global Optimum**: Local choices lead to global optimum
 * 4. **Fast**: Usually O(n log n) due to sorting
 *
 * WHEN DOES GREEDY WORK?
 *
 * Two properties must hold:
 *
 * 1. **Greedy-Choice Property**
 *    - Locally optimal choice leads to globally optimal solution
 *    - Can make choice without solving subproblems
 *    - Example: In Activity Selection, choosing earliest ending activity
 *      is always part of optimal solution
 *
 * 2. **Optimal Substructure**
 *    - Optimal solution contains optimal solutions to subproblems
 *    - Similar to DP but without overlapping subproblems
 *
 * HOW TO PROVE GREEDY IS CORRECT?
 *
 * Two common proof techniques:
 *
 * 1. **Exchange Argument (Greedy Stays Ahead)**
 *    - Show that any optimal solution can be transformed to greedy solution
 *    - Without making it worse
 *    - Example: Prove Activity Selection works
 *
 * 2. **Induction**
 *    - Show greedy choice is safe (doesn't prevent optimal solution)
 *    - Show remaining subproblem has same form
 *
 * GREEDY vs DYNAMIC PROGRAMMING:
 *
 * **When to use GREEDY:**
 * - Greedy-choice property holds
 * - Faster (usually O(n log n))
 * - Simpler to implement
 * - Examples: Activity Selection, Huffman Coding, Fractional Knapsack
 *
 * **When to use DP:**
 * - Greedy doesn't work (need to try all options)
 * - Slower (polynomial but higher degree)
 * - More complex
 * - Examples: 0/1 Knapsack, Longest Common Subsequence
 *
 * **Classic Example - Knapsack:**
 * - **Fractional Knapsack**: Greedy works! (take highest value/weight ratio)
 * - **0/1 Knapsack**: Greedy fails! (must use DP)
 *
 * COMMON GREEDY PATTERNS:
 *
 * 1. **ACTIVITY SELECTION / INTERVAL SCHEDULING**
 *    - Sort by end time (or start time)
 *    - Greedily select non-overlapping intervals
 *    - Pattern: Sort + greedy selection
 *    - Problems: Meeting Rooms, Non-overlapping Intervals
 *
 * 2. **HUFFMAN CODING / OPTIMAL MERGE**
 *    - Always merge smallest elements first
 *    - Uses min heap
 *    - Pattern: Repeatedly combine smallest
 *    - Problems: Huffman Encoding, Connect Ropes
 *
 * 3. **FRACTIONAL KNAPSACK**
 *    - Sort by value/weight ratio
 *    - Take highest ratio items first
 *    - Pattern: Sort by ratio + greedy selection
 *
 * 4. **MINIMUM SPANNING TREE (MST)**
 *    - Prim's: Greedily add cheapest edge from tree
 *    - Kruskal's: Greedily add cheapest edge that doesn't form cycle
 *    - Pattern: Sort edges + union-find or heap
 *
 * 5. **SHORTEST PATH**
 *    - Dijkstra's Algorithm (non-negative weights)
 *    - Greedily visit nearest unvisited node
 *    - Pattern: Min heap + relaxation
 *
 * 6. **SCHEDULING**
 *    - Job scheduling with deadlines and profits
 *    - Sort by profit/deadline
 *    - Pattern: Sort + greedy scheduling
 *
 * 7. **STRING MANIPULATION**
 *    - Remove K digits for minimum number
 *    - Partition labels
 *    - Pattern: Stack or frequency-based greedy
 *
 * COMMON GREEDY STRATEGIES:
 *
 * 1. **Sort then iterate**
 *    - Most common pattern
 *    - Sort by some criteria
 *    - Make greedy choice from sorted order
 *
 * 2. **Use priority queue (heap)**
 *    - For dynamic greedy choices
 *    - Always access min/max efficiently
 *
 * 3. **Two pointers**
 *    - Often combined with sorting
 *    - Greedy movement of pointers
 *
 * 4. **Frequency counting**
 *    - Count occurrences
 *    - Greedy arrangement based on frequency
 *
 * COMMON INTERVIEW QUESTIONS:
 *
 * **Interval Problems:**
 * 1. Meeting Rooms II (min heap)
 * 2. Non-overlapping Intervals
 * 3. Merge Intervals
 * 4. Insert Interval
 * 5. Minimum Number of Arrows to Burst Balloons
 *
 * **Array/Sequence Problems:**
 * 6. Jump Game / Jump Game II
 * 7. Gas Station
 * 8. Candy
 * 9. Assign Cookies
 * 10. Lemonade Change
 *
 * **String Problems:**
 * 11. Remove K Digits
 * 12. Partition Labels
 * 13. Reorganize String
 * 14. Remove Duplicate Letters
 * 15. Smallest Subsequence of Distinct Characters
 *
 * **Scheduling:**
 * 16. Task Scheduler
 * 17. Least Interval
 * 18. Maximum Profit in Job Scheduling
 *
 * **Other:**
 * 19. Container With Most Water (two pointers)
 * 20. Maximum Swap
 * 21. Minimum Cost to Connect Sticks
 * 22. Queue Reconstruction by Height
 *
 * ALGORITHM EXAMPLES:
 *
 * **Activity Selection:**
 * ```
 * Sort activities by end time
 * Select first activity
 * For each remaining activity:
 *   If start >= previous end:
 *     Select it
 * ```
 *
 * **Fractional Knapsack:**
 * ```
 * Calculate value/weight ratio for each item
 * Sort by ratio (descending)
 * Take items until capacity full
 * If item doesn't fit completely, take fraction
 * ```
 *
 * **Huffman Coding:**
 * ```
 * Put all frequencies in min heap
 * While heap has more than 1 element:
 *   Extract two minimum
 *   Create new node with sum frequency
 *   Add back to heap
 * ```
 *
 * INTERVIEW TIPS:
 *
 * 1. **Identify if Greedy Works**
 *    - Can you make a local choice that's always safe?
 *    - Think: "What should I do first?"
 *    - Try to find a sorting strategy
 *
 * 2. **Start with Sorting**
 *    - Most greedy problems involve sorting
 *    - Think: Sort by what criteria?
 *    - End time? Start time? Ratio? Frequency?
 *
 * 3. **Prove or Disprove Correctness**
 *    - Give counterexample if greedy fails
 *    - Or explain why greedy works
 *    - Shows deep understanding!
 *
 * 4. **Consider Edge Cases**
 *    - Empty input
 *    - All same values
 *    - Extreme values
 *
 * 5. **Common Pitfalls**
 *    - Assuming greedy always works (it often doesn't!)
 *    - Wrong sorting criteria
 *    - Not handling ties properly
 *
 * HOW TO APPROACH GREEDY PROBLEMS:
 *
 * Step 1: **Understand the problem**
 *    - What's being optimized?
 *    - What are the constraints?
 *
 * Step 2: **Think of greedy choice**
 *    - What's the local optimal choice?
 *    - Can you sort by something?
 *
 * Step 3: **Verify correctness**
 *    - Does greedy-choice property hold?
 *    - Try counterexamples
 *
 * Step 4: **Implement**
 *    - Usually involves sorting or heap
 *    - Linear scan after sorting
 *
 * Step 5: **Analyze complexity**
 *    - Usually O(n log n) due to sorting
 *    - Or O(n log k) with heap
 *
 * WHEN GREEDY FAILS:
 *
 * Common scenarios where greedy doesn't work:
 *
 * 1. **0/1 Knapsack**: Can't take fractions
 * 2. **Longest Increasing Subsequence**: Need DP
 * 3. **Coin Change (certain coin systems)**: May not give minimum coins
 * 4. **Matrix Chain Multiplication**: Need DP
 *
 * If greedy fails, usually need:
 * - Dynamic Programming (if overlapping subproblems)
 * - Backtracking (if need all solutions)
 * - Divide and Conquer (if independent subproblems)
 *
 * TIME COMPLEXITY:
 * - Usually O(n log n) due to sorting
 * - With heap: O(n log k) where k is heap size
 * - Linear scan after sorting: O(n)
 * - Much faster than DP which is often O(n²) or O(n³)
 *
 * PRACTICAL APPLICATIONS:
 * - Task scheduling in OS
 * - Huffman coding (data compression)
 * - Dijkstra's shortest path (GPS, routing)
 * - Prim's/Kruskal's MST (network design)
 * - Cache replacement policies (LRU)
 * - Load balancing
 *
 * REMEMBER:
 * - Greedy is fast and simple when it works
 * - But it doesn't always work!
 * - Always verify correctness
 * - If in doubt, try to find a counterexample
 *
 * ============================================================================
 */

// ============================================================================
// ACTIVITY SELECTION
// ============================================================================

/**
 * Activity Selection - Maximum non-overlapping activities
 * Time: O(n log n), Space: O(1)
 */
function activitySelection(starts: number[], ends: number[]): number {
  const n = starts.length;
  const activities: [number, number][] = [];

  for (let i = 0; i < n; i++) {
    activities.push([starts[i], ends[i]]);
  }

  // Sort by end time
  activities.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = activities[0][1];

  for (let i = 1; i < n; i++) {
    if (activities[i][0] >= lastEnd) {
      count++;
      lastEnd = activities[i][1];
    }
  }

  return count;
}

// ============================================================================
// INTERVAL PROBLEMS
// ============================================================================

class IntervalProblems {
  /**
   * Minimum Meeting Rooms
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
   * Merge Intervals
   * Time: O(n log n), Space: O(n)
   */
  static merge(intervals: [number, number][]): [number, number][] {
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
   * Insert Interval
   * Time: O(n), Space: O(n)
   */
  static insert(
    intervals: [number, number][],
    newInterval: [number, number]
  ): [number, number][] {
    const result: [number, number][] = [];
    let i = 0;

    // Add all intervals before newInterval
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
      result.push(intervals[i]);
      i++;
    }

    // Merge overlapping intervals
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
      newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
      newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
      i++;
    }
    result.push(newInterval);

    // Add remaining intervals
    while (i < intervals.length) {
      result.push(intervals[i]);
      i++;
    }

    return result;
  }

  /**
   * Remove Covered Intervals
   * Time: O(n log n), Space: O(1)
   */
  static removeCoveredIntervals(intervals: [number, number][]): number {
    intervals.sort((a, b) => {
      if (a[0] === b[0]) return b[1] - a[1];
      return a[0] - b[0];
    });

    let count = 0;
    let prevEnd = 0;

    for (const [, end] of intervals) {
      if (end > prevEnd) {
        count++;
        prevEnd = end;
      }
    }

    return count;
  }
}

// ============================================================================
// JUMP GAME
// ============================================================================

class JumpGame {
  /**
   * Jump Game - Can reach last index?
   * Time: O(n), Space: O(1)
   */
  static canJump(nums: number[]): boolean {
    let maxReach = 0;

    for (let i = 0; i < nums.length; i++) {
      if (i > maxReach) return false;
      maxReach = Math.max(maxReach, i + nums[i]);
    }

    return true;
  }

  /**
   * Jump Game II - Minimum jumps to reach end
   * Time: O(n), Space: O(1)
   */
  static jump(nums: number[]): number {
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;

    for (let i = 0; i < nums.length - 1; i++) {
      farthest = Math.max(farthest, i + nums[i]);

      if (i === currentEnd) {
        jumps++;
        currentEnd = farthest;
      }
    }

    return jumps;
  }
}

// ============================================================================
// GAS STATION
// ============================================================================

/**
 * Gas Station - Can complete circuit?
 * Time: O(n), Space: O(1)
 */
function canCompleteCircuit(gas: number[], cost: number[]): number {
  let totalGas = 0;
  let totalCost = 0;
  let tank = 0;
  let start = 0;

  for (let i = 0; i < gas.length; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
    tank += gas[i] - cost[i];

    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }

  return totalGas >= totalCost ? start : -1;
}

// ============================================================================
// FRACTIONAL KNAPSACK
// ============================================================================

/**
 * Fractional Knapsack - Can take fractions
 * Time: O(n log n), Space: O(n)
 */
function fractionalKnapsack(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const n = weights.length;
  const items: [number, number, number][] = [];

  for (let i = 0; i < n; i++) {
    const ratio = values[i] / weights[i];
    items.push([ratio, weights[i], values[i]]);
  }

  items.sort((a, b) => b[0] - a[0]); // Sort by value/weight ratio

  let totalValue = 0;
  let remainingCapacity = capacity;

  for (const [, weight, value] of items) {
    if (remainingCapacity >= weight) {
      totalValue += value;
      remainingCapacity -= weight;
    } else {
      totalValue += value * (remainingCapacity / weight);
      break;
    }
  }

  return totalValue;
}

// ============================================================================
// JOB SCHEDULING
// ============================================================================

class JobScheduling {
  /**
   * Maximum Profit Job Scheduling
   * Time: O(n log n), Space: O(n)
   */
  static jobScheduling(
    startTime: number[],
    endTime: number[],
    profit: number[]
  ): number {
    const n = startTime.length;
    const jobs: [number, number, number][] = [];

    for (let i = 0; i < n; i++) {
      jobs.push([endTime[i], startTime[i], profit[i]]);
    }

    jobs.sort((a, b) => a[0] - b[0]);

    const dp: number[] = [0];
    const endTimes: number[] = [0];

    for (const [end, start, prof] of jobs) {
      // Binary search for latest non-conflicting job
      let left = 0;
      let right = endTimes.length - 1;

      while (left < right) {
        const mid = Math.ceil((left + right) / 2);
        if (endTimes[mid] <= start) {
          left = mid;
        } else {
          right = mid - 1;
        }
      }

      const currentProfit = dp[left] + prof;
      const maxProfit = Math.max(dp[dp.length - 1], currentProfit);

      dp.push(maxProfit);
      endTimes.push(end);
    }

    return dp[dp.length - 1];
  }

  /**
   * Task Scheduler - Minimum intervals
   * Time: O(n), Space: O(26)
   */
  static leastInterval(tasks: string[], n: number): number {
    const freq = new Map<string, number>();
    let maxFreq = 0;

    for (const task of tasks) {
      freq.set(task, (freq.get(task) || 0) + 1);
      maxFreq = Math.max(maxFreq, freq.get(task)!);
    }

    let maxCount = 0;
    for (const count of freq.values()) {
      if (count === maxFreq) maxCount++;
    }

    const partCount = maxFreq - 1;
    const partLength = n - (maxCount - 1);
    const emptySlots = partCount * partLength;
    const availableTasks = tasks.length - maxFreq * maxCount;
    const idles = Math.max(0, emptySlots - availableTasks);

    return tasks.length + idles;
  }
}

// ============================================================================
// STRING PROBLEMS
// ============================================================================

class GreedyStrings {
  /**
   * Remove K Digits - Smallest number
   * Time: O(n), Space: O(n)
   */
  static removeKdigits(num: string, k: number): string {
    const stack: string[] = [];

    for (const digit of num) {
      while (stack.length > 0 && k > 0 && stack[stack.length - 1] > digit) {
        stack.pop();
        k--;
      }
      stack.push(digit);
    }

    // Remove remaining k digits from end
    while (k > 0) {
      stack.pop();
      k--;
    }

    // Remove leading zeros
    let result = stack.join("").replace(/^0+/, "");
    return result || "0";
  }

  /**
   * Partition Labels
   * Time: O(n), Space: O(26)
   */
  static partitionLabels(s: string): number[] {
    const last = new Map<string, number>();

    // Record last occurrence of each character
    for (let i = 0; i < s.length; i++) {
      last.set(s[i], i);
    }

    const result: number[] = [];
    let start = 0;
    let end = 0;

    for (let i = 0; i < s.length; i++) {
      end = Math.max(end, last.get(s[i])!);

      if (i === end) {
        result.push(end - start + 1);
        start = i + 1;
      }
    }

    return result;
  }

  /**
   * Reorganize String - No adjacent duplicates
   * Time: O(n log 26), Space: O(26)
   */
  static reorganizeString(s: string): string {
    const freq = new Map<string, number>();

    for (const char of s) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }

    // Check if reorganization is possible
    const maxFreq = Math.max(...freq.values());
    if (maxFreq > Math.ceil(s.length / 2)) return "";

    // Create frequency array and sort
    const freqArr = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);

    const result: string[] = new Array(s.length);
    let index = 0;

    for (const [char, count] of freqArr) {
      for (let i = 0; i < count; i++) {
        if (index >= s.length) index = 1;
        result[index] = char;
        index += 2;
      }
    }

    return result.join("");
  }
}

// ============================================================================
// ARRAY PROBLEMS
// ============================================================================

class GreedyArrays {
  /**
   * Container With Most Water
   * Time: O(n), Space: O(1)
   */
  static maxArea(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;

    while (left < right) {
      const width = right - left;
      const minHeight = Math.min(height[left], height[right]);
      maxArea = Math.max(maxArea, width * minHeight);

      if (height[left] < height[right]) {
        left++;
      } else {
        right--;
      }
    }

    return maxArea;
  }

  /**
   * Best Time to Buy and Sell Stock
   * Time: O(n), Space: O(1)
   */
  static maxProfit(prices: number[]): number {
    let minPrice = Infinity;
    let maxProfit = 0;

    for (const price of prices) {
      minPrice = Math.min(minPrice, price);
      maxProfit = Math.max(maxProfit, price - minPrice);
    }

    return maxProfit;
  }

  /**
   * Best Time to Buy and Sell Stock II - Multiple transactions
   * Time: O(n), Space: O(1)
   */
  static maxProfitMultiple(prices: number[]): number {
    let profit = 0;

    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }

    return profit;
  }

  /**
   * Candy - Minimum candies to distribute
   * Time: O(n), Space: O(n)
   */
  static candy(ratings: number[]): number {
    const n = ratings.length;
    const candies = new Array(n).fill(1);

    // Left to right pass
    for (let i = 1; i < n; i++) {
      if (ratings[i] > ratings[i - 1]) {
        candies[i] = candies[i - 1] + 1;
      }
    }

    // Right to left pass
    for (let i = n - 2; i >= 0; i--) {
      if (ratings[i] > ratings[i + 1]) {
        candies[i] = Math.max(candies[i], candies[i + 1] + 1);
      }
    }

    return candies.reduce((a, b) => a + b, 0);
  }

  /**
   * Assign Cookies
   * Time: O(n log n + m log m), Space: O(1)
   */
  static findContentChildren(greed: number[], size: number[]): number {
    greed.sort((a, b) => a - b);
    size.sort((a, b) => a - b);

    let child = 0;
    let cookie = 0;

    while (child < greed.length && cookie < size.length) {
      if (size[cookie] >= greed[child]) {
        child++;
      }
      cookie++;
    }

    return child;
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Activity Selection ===");
console.log(
  "Max Activities:",
  activitySelection([1, 3, 0, 5, 8, 5], [2, 4, 6, 7, 9, 9])
);

console.log("\n=== Interval Problems ===");
const intervals: [number, number][] = [
  [0, 30],
  [5, 10],
  [15, 20],
];
console.log("Min Meeting Rooms:", IntervalProblems.minMeetingRooms(intervals));
console.log(
  "Merge Intervals:",
  IntervalProblems.merge([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ])
);

console.log("\n=== Jump Game ===");
console.log("Can Jump [2,3,1,1,4]:", JumpGame.canJump([2, 3, 1, 1, 4]));
console.log("Min Jumps:", JumpGame.jump([2, 3, 1, 1, 4]));

console.log("\n=== Gas Station ===");
console.log(
  "Starting Station:",
  canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])
);

console.log("\n=== Fractional Knapsack ===");
console.log("Max Value:", fractionalKnapsack([10, 20, 30], [60, 100, 120], 50));

console.log("\n=== String Problems ===");
console.log("Remove K Digits:", GreedyStrings.removeKdigits("1432219", 3));
console.log(
  "Partition Labels:",
  GreedyStrings.partitionLabels("ababcbacadefegdehijhklij")
);
console.log("Reorganize String:", GreedyStrings.reorganizeString("aab"));

console.log("\n=== Array Problems ===");
console.log("Max Area:", GreedyArrays.maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
console.log("Max Profit:", GreedyArrays.maxProfit([7, 1, 5, 3, 6, 4]));
console.log("Candy:", GreedyArrays.candy([1, 0, 2]));

export {
  activitySelection,
  IntervalProblems,
  JumpGame,
  canCompleteCircuit,
  fractionalKnapsack,
  JobScheduling,
  GreedyStrings,
  GreedyArrays,
};
