/**
 * ============================================================================
 * BIT MANIPULATION - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS BIT MANIPULATION?
 * -------------------------
 * Bit manipulation involves directly working with binary representations of numbers
 * using bitwise operations. It's fast, space-efficient, and elegant when used correctly.
 *
 * WHY BIT MANIPULATION?
 * - **Fast**: Bitwise operations are among the fastest operations
 * - **Space-efficient**: Can store multiple boolean flags in one integer
 * - **Elegant**: Some problems have beautiful bit manipulation solutions
 * - **Hardware-level**: Closest to how computers actually work
 *
 * BINARY NUMBER SYSTEM BASICS:
 *
 * Decimal → Binary:
 * - 5 = 101₂ (1×2² + 0×2¹ + 1×2⁰)
 * - 13 = 1101₂ (1×2³ + 1×2² + 0×2¹ + 1×2⁰)
 *
 * Two's Complement (negative numbers):
 * - -x = ~x + 1 (flip bits and add 1)
 * - Example: -5 = ~5 + 1 = ...11111010 + 1 = ...11111011
 *
 * BITWISE OPERATORS:
 *
 * 1. **AND (&)**: Both bits must be 1
 *    - 5 & 3 = 101 & 011 = 001 = 1
 *    - Use: Check if bit is set, clear bits, mask operations
 *    - Properties: x & 0 = 0, x & x = x, x & -1 = x
 *
 * 2. **OR (|)**: At least one bit must be 1
 *    - 5 | 3 = 101 | 011 = 111 = 7
 *    - Use: Set bits, combine flags
 *    - Properties: x | 0 = x, x | x = x, x | -1 = -1
 *
 * 3. **XOR (^)**: Bits must be DIFFERENT (exclusive or)
 *    - 5 ^ 3 = 101 ^ 011 = 110 = 6
 *    - Use: Toggle bits, find differences, swap without temp
 *    - Properties: x ^ 0 = x, x ^ x = 0, x ^ y ^ x = y
 *    - **MAGIC PROPERTY**: Commutative and Associative
 *
 * 4. **NOT (~)**: Flip all bits (one's complement)
 *    - ~5 = ~00000101 = 11111010 = -6 (in two's complement)
 *    - Use: Invert bits, create masks
 *
 * 5. **LEFT SHIFT (<<)**: Multiply by 2^n
 *    - 5 << 2 = 00000101 << 2 = 00010100 = 20 (5 × 2²)
 *    - Use: Fast multiplication by powers of 2
 *    - Pattern: x << n = x × 2ⁿ
 *
 * 6. **RIGHT SHIFT (>>)**: Divide by 2^n (arithmetic shift)
 *    - 20 >> 2 = 00010100 >> 2 = 00000101 = 5 (20 ÷ 2²)
 *    - Use: Fast division by powers of 2
 *    - Pattern: x >> n = x ÷ 2ⁿ (rounds down)
 *    - Note: Sign bit is preserved (arithmetic shift)
 *
 * 7. **UNSIGNED RIGHT SHIFT (>>>)**: Logical shift (fills with 0)
 *    - Fills leftmost bits with 0 regardless of sign
 *
 * ESSENTIAL BIT TRICKS:
 *
 * **Check/Set/Clear/Toggle Operations:**
 * ```
 * Check if ith bit is set:    x & (1 << i) != 0
 * Set ith bit:                x | (1 << i)
 * Clear ith bit:              x & ~(1 << i)
 * Toggle ith bit:             x ^ (1 << i)
 * ```
 *
 * **Power of 2:**
 * ```
 * Check if power of 2:        x & (x - 1) == 0 && x != 0
 * Why? Power of 2 has only 1 bit set: 8 = 1000, 8-1 = 0111
 * ```
 *
 * **Rightmost Set Bit:**
 * ```
 * Remove rightmost set bit:   x & (x - 1)
 * Isolate rightmost set bit:  x & -x  (or x & (~x + 1))
 * Example: 12 = 1100, 12 & -12 = 0100 = 4
 * ```
 *
 * **Count Set Bits (Brian Kernighan's Algorithm):**
 * ```typescript
 * function countBits(n: number): number {
 *   let count = 0;
 *   while (n > 0) {
 *     n = n & (n - 1);  // Remove rightmost set bit
 *     count++;
 *   }
 *   return count;
 * }
 * ```
 *
 * **XOR Magic:**
 * ```
 * Swap without temp:
 *   a = a ^ b
 *   b = a ^ b  // b = a
 *   a = a ^ b  // a = b
 *
 * Find single number (all others appear twice):
 *   result = nums[0] ^ nums[1] ^ ... ^ nums[n]
 *   Duplicates cancel out!
 * ```
 *
 * **Check if odd/even:**
 * ```
 * Check if odd:   x & 1 == 1
 * Check if even:  x & 1 == 0
 * ```
 *
 * **Sign operations:**
 * ```
 * Check opposite signs:  (x ^ y) < 0
 * Absolute value:        (x ^ (x >> 31)) - (x >> 31)
 * Min of x, y:          y ^ ((x ^ y) & -(x < y))
 * Max of x, y:          x ^ ((x ^ y) & -(x < y))
 * ```
 *
 * **Set all bits:**
 * ```
 * Set all bits to right of rightmost 1:  x | (x - 1)
 * Set all bits from 0 to i:             (1 << (i + 1)) - 1
 * ```
 *
 * COMMON PATTERNS:
 *
 * 1. **XOR for Finding Unique**
 *    - Single number among duplicates
 *    - Missing number in sequence
 *    - Pattern: XOR all elements
 *
 * 2. **Bit Masking**
 *    - Represent subsets as integers
 *    - Each bit = inclusion/exclusion
 *    - Pattern: Use shifts and masks
 *
 * 3. **Brian Kernighan's Algorithm**
 *    - Count/iterate set bits
 *    - Pattern: x & (x-1) in loop
 *
 * 4. **Gray Code**
 *    - Binary to Gray: n ^ (n >> 1)
 *    - Gray to Binary: More complex
 *
 * 5. **Bit DP**
 *    - Use integers to represent states
 *    - Traveling Salesman Problem
 *    - Pattern: dp[mask]
 *
 * COMMON INTERVIEW QUESTIONS:
 *
 * **Basic Bit Operations:**
 * 1. Number of 1 Bits (Hamming Weight)
 * 2. Counting Bits (0 to n)
 * 3. Power of Two
 * 4. Power of Four
 * 5. Reverse Bits
 * 6. Hamming Distance
 *
 * **XOR Problems:**
 * 7. Single Number (I, II, III)
 * 8. Missing Number
 * 9. Find the Duplicate Number
 * 10. Maximum XOR of Two Numbers
 * 11. XOR Queries of a Subarray
 *
 * **Bit Manipulation Tricks:**
 * 12. Bitwise AND of Numbers Range
 * 13. Sum of Two Integers (without +/-)
 * 14. Divide Two Integers (without /)
 * 15. Integer Replacement
 * 16. Binary Number with Alternating Bits
 *
 * **Advanced:**
 * 17. Concatenated Binary in Integer
 * 18. UTF-8 Validation
 * 19. Number Complement / Complement of Base 10
 * 20. Subsets (using bit masks)
 *
 * INTERVIEW TIPS:
 *
 * 1. **Draw Binary Representation**
 *    - Visualize what happens to bits
 *    - Example: 5 = 0101, ~5 = 1010
 *
 * 2. **Know Common Tricks**
 *    - x & (x-1): Remove rightmost set bit
 *    - x & -x: Isolate rightmost set bit
 *    - x ^ x = 0
 *
 * 3. **Think About Edge Cases**
 *    - Zero
 *    - Negative numbers
 *    - Integer overflow
 *    - All bits set
 *
 * 4. **Understand Two's Complement**
 *    - How negative numbers work
 *    - -x = ~x + 1
 *
 * 5. **Consider Alternatives**
 *    - Sometimes bit manipulation isn't clearer
 *    - Readability vs performance trade-off
 *
 * WHEN TO USE BIT MANIPULATION:
 *
 * - **Good for:**
 *   - Flag storage (permissions, states)
 *   - Low-level optimization
 *   - Problems specifically about bits
 *   - XOR cancellation properties
 *   - Subset enumeration
 *
 * - **Avoid for:**
 *   - When it makes code unreadable
 *   - When performance gain is negligible
 *   - When higher-level approach is clearer
 *
 * TIME COMPLEXITY:
 * - Most bitwise operations: O(1)
 * - Counting bits: O(number of set bits) with Brian Kernighan
 * - Iterating all subsets: O(2ⁿ)
 *
 * SPACE COMPLEXITY:
 * - Usually O(1) - in-place operations
 * - Bit masking for states: Can reduce from O(n) to O(1)
 *
 * PRACTICAL APPLICATIONS:
 * - Graphics programming (pixel manipulation)
 * - Cryptography
 * - Compression algorithms
 * - Network protocols
 * - Low-level system programming
 * - Embedded systems
 * - Database indexes (bitmap indexes)
 *
 * REMEMBER:
 * - Bitwise operations are FAST
 * - But clarity > cleverness
 * - Use when it makes sense
 * - Comment your bit manipulation code!
 *
 * ============================================================================
 */

// ============================================================================
// BASIC BIT OPERATIONS
// ============================================================================

class BitOperations {
  /**
   * Check if ith bit is set
   * Time: O(1)
   */
  static isBitSet(num: number, i: number): boolean {
    return (num & (1 << i)) !== 0;
  }

  /**
   * Set ith bit
   * Time: O(1)
   */
  static setBit(num: number, i: number): number {
    return num | (1 << i);
  }

  /**
   * Clear ith bit
   * Time: O(1)
   */
  static clearBit(num: number, i: number): number {
    return num & ~(1 << i);
  }

  /**
   * Toggle ith bit
   * Time: O(1)
   */
  static toggleBit(num: number, i: number): number {
    return num ^ (1 << i);
  }

  /**
   * Clear all bits from MSB to i (inclusive)
   * Time: O(1)
   */
  static clearBitsFromMSBToI(num: number, i: number): number {
    const mask = (1 << i) - 1;
    return num & mask;
  }

  /**
   * Clear all bits from i to 0 (inclusive)
   * Time: O(1)
   */
  static clearBitsFromITo0(num: number, i: number): number {
    const mask = ~((1 << (i + 1)) - 1);
    return num & mask;
  }

  /**
   * Update ith bit with value
   * Time: O(1)
   */
  static updateBit(num: number, i: number, value: boolean): number {
    const clearMask = ~(1 << i);
    return (num & clearMask) | ((value ? 1 : 0) << i);
  }
}

// ============================================================================
// COUNT BITS
// ============================================================================

class CountBits {
  /**
   * Count number of 1 bits (Hamming Weight)
   * Time: O(k) where k is number of set bits
   */
  static countSetBits(n: number): number {
    let count = 0;

    while (n > 0) {
      n = n & (n - 1); // Remove rightmost set bit
      count++;
    }

    return count;
  }

  /**
   * Count set bits - Alternative method
   * Time: O(log n)
   */
  static countSetBitsAlt(n: number): number {
    let count = 0;

    while (n > 0) {
      count += n & 1;
      n >>= 1;
    }

    return count;
  }

  /**
   * Counting Bits - Count bits for [0, n]
   * Time: O(n), Space: O(n)
   */
  static countingBits(n: number): number[] {
    const result: number[] = new Array(n + 1);
    result[0] = 0;

    for (let i = 1; i <= n; i++) {
      result[i] = result[i >> 1] + (i & 1);
    }

    return result;
  }

  /**
   * Check if number has only one bit set (power of 2)
   * Time: O(1)
   */
  static isPowerOfTwo(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0;
  }

  /**
   * Check if power of four
   * Time: O(1)
   */
  static isPowerOfFour(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0 && (n & 0x55555555) !== 0;
  }
}

// ============================================================================
// XOR PROBLEMS
// ============================================================================

class XORProblems {
  /**
   * Single Number - Find unique element
   * Time: O(n), Space: O(1)
   */
  static singleNumber(nums: number[]): number {
    let result = 0;

    for (const num of nums) {
      result ^= num;
    }

    return result;
  }

  /**
   * Single Number II - Element appears once, others thrice
   * Time: O(n), Space: O(1)
   */
  static singleNumber2(nums: number[]): number {
    let ones = 0;
    let twos = 0;

    for (const num of nums) {
      ones = (ones ^ num) & ~twos;
      twos = (twos ^ num) & ~ones;
    }

    return ones;
  }

  /**
   * Single Number III - Two unique elements
   * Time: O(n), Space: O(1)
   */
  static singleNumber3(nums: number[]): number[] {
    // Get XOR of two unique numbers
    let xor = 0;
    for (const num of nums) {
      xor ^= num;
    }

    // Find rightmost set bit
    const rightmostBit = xor & -xor;

    // Divide numbers into two groups
    let num1 = 0;
    let num2 = 0;

    for (const num of nums) {
      if ((num & rightmostBit) !== 0) {
        num1 ^= num;
      } else {
        num2 ^= num;
      }
    }

    return [num1, num2];
  }

  /**
   * Missing Number in [0, n]
   * Time: O(n), Space: O(1)
   */
  static missingNumber(nums: number[]): number {
    let result = nums.length;

    for (let i = 0; i < nums.length; i++) {
      result ^= i ^ nums[i];
    }

    return result;
  }

  /**
   * Find Duplicate - Only one duplicate exists
   * Time: O(n), Space: O(1)
   */
  static findDuplicate(nums: number[]): number {
    let slow = nums[0];
    let fast = nums[0];

    // Find intersection point
    do {
      slow = nums[slow];
      fast = nums[nums[fast]];
    } while (slow !== fast);

    // Find entrance to cycle
    slow = nums[0];
    while (slow !== fast) {
      slow = nums[slow];
      fast = nums[fast];
    }

    return slow;
  }

  /**
   * Maximum XOR of Two Numbers
   * Time: O(n), Space: O(1)
   */
  static findMaximumXOR(nums: number[]): number {
    let max = 0;
    let mask = 0;

    for (let i = 31; i >= 0; i--) {
      mask |= 1 << i;
      const prefixes = new Set<number>();

      for (const num of nums) {
        prefixes.add(num & mask);
      }

      const candidate = max | (1 << i);

      for (const prefix of prefixes) {
        if (prefixes.has(candidate ^ prefix)) {
          max = candidate;
          break;
        }
      }
    }

    return max;
  }
}

// ============================================================================
// BIT MANIPULATION TECHNIQUES
// ============================================================================

class BitTechniques {
  /**
   * Reverse Bits
   * Time: O(32), Space: O(1)
   */
  static reverseBits(n: number): number {
    let result = 0;

    for (let i = 0; i < 32; i++) {
      result = (result << 1) | (n & 1);
      n >>= 1;
    }

    return result >>> 0; // Convert to unsigned 32-bit integer
  }

  /**
   * Hamming Distance - Number of different bits
   * Time: O(1), Space: O(1)
   */
  static hammingDistance(x: number, y: number): number {
    let xor = x ^ y;
    let count = 0;

    while (xor > 0) {
      count += xor & 1;
      xor >>= 1;
    }

    return count;
  }

  /**
   * Total Hamming Distance - Sum of hamming distances
   * Time: O(32n), Space: O(1)
   */
  static totalHammingDistance(nums: number[]): number {
    let total = 0;

    for (let i = 0; i < 32; i++) {
      let countOnes = 0;

      for (const num of nums) {
        countOnes += (num >> i) & 1;
      }

      total += countOnes * (nums.length - countOnes);
    }

    return total;
  }

  /**
   * Binary Number to Gray Code
   * Time: O(1)
   */
  static binaryToGray(n: number): number {
    return n ^ (n >> 1);
  }

  /**
   * Gray Code to Binary Number
   * Time: O(log n)
   */
  static grayToBinary(n: number): number {
    let result = n;

    while (n > 0) {
      n >>= 1;
      result ^= n;
    }

    return result;
  }

  /**
   * Generate Gray Code Sequence
   * Time: O(2^n), Space: O(2^n)
   */
  static grayCode(n: number): number[] {
    const result: number[] = [];
    const total = 1 << n;

    for (let i = 0; i < total; i++) {
      result.push(i ^ (i >> 1));
    }

    return result;
  }

  /**
   * Swap two numbers without temp variable
   * Time: O(1)
   */
  static swap(a: number, b: number): [number, number] {
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    return [a, b];
  }

  /**
   * Get absolute value without branching
   * Time: O(1)
   */
  static abs(n: number): number {
    const mask = n >> 31;
    return (n + mask) ^ mask;
  }

  /**
   * Get minimum of two numbers without branching
   * Time: O(1)
   */
  static min(a: number, b: number): number {
    return b ^ ((a ^ b) & -(a < b ? 1 : 0));
  }

  /**
   * Get maximum of two numbers without branching
   * Time: O(1)
   */
  static max(a: number, b: number): number {
    return a ^ ((a ^ b) & -(a < b ? 1 : 0));
  }

  /**
   * Check if signs are opposite
   * Time: O(1)
   */
  static oppositeSigns(a: number, b: number): boolean {
    return (a ^ b) < 0;
  }
}

// ============================================================================
// SUBSET GENERATION
// ============================================================================

class BitSubsets {
  /**
   * Generate all subsets using bit manipulation
   * Time: O(n * 2^n), Space: O(2^n)
   */
  static subsets(nums: number[]): number[][] {
    const n = nums.length;
    const total = 1 << n;
    const result: number[][] = [];

    for (let mask = 0; mask < total; mask++) {
      const subset: number[] = [];

      for (let i = 0; i < n; i++) {
        if ((mask & (1 << i)) !== 0) {
          subset.push(nums[i]);
        }
      }

      result.push(subset);
    }

    return result;
  }

  /**
   * Generate all subsets of size k
   * Time: O(C(n,k) * k), Space: O(C(n,k))
   */
  static subsetsOfSizeK(nums: number[], k: number): number[][] {
    const n = nums.length;
    const result: number[][] = [];

    // Iterate through all possible masks
    for (let mask = 0; mask < 1 << n; mask++) {
      if (CountBits.countSetBits(mask) === k) {
        const subset: number[] = [];

        for (let i = 0; i < n; i++) {
          if ((mask & (1 << i)) !== 0) {
            subset.push(nums[i]);
          }
        }

        result.push(subset);
      }
    }

    return result;
  }

  /**
   * Iterate through all submasks of a mask
   * Time: O(3^n) for all masks
   */
  static *submasks(mask: number): Generator<number> {
    let submask = mask;

    while (submask > 0) {
      yield submask;
      submask = (submask - 1) & mask;
    }

    yield 0; // Empty subset
  }
}

// ============================================================================
// ADVANCED PROBLEMS
// ============================================================================

class AdvancedBitProblems {
  /**
   * UTF-8 Validation
   * Time: O(n), Space: O(1)
   */
  static validUtf8(data: number[]): boolean {
    let count = 0;

    for (const num of data) {
      if (count === 0) {
        if (num >> 5 === 0b110) count = 1;
        else if (num >> 4 === 0b1110) count = 2;
        else if (num >> 3 === 0b11110) count = 3;
        else if (num >> 7 !== 0) return false;
      } else {
        if (num >> 6 !== 0b10) return false;
        count--;
      }
    }

    return count === 0;
  }

  /**
   * Integer Replacement
   * Time: O(log n), Space: O(1)
   */
  static integerReplacement(n: number): number {
    let steps = 0;

    while (n !== 1) {
      if (n % 2 === 0) {
        n /= 2;
      } else {
        // Choose +1 or -1 based on next bit
        if (n === 3 || ((n >> 1) & 1) === 0) {
          n--;
        } else {
          n++;
        }
      }
      steps++;
    }

    return steps;
  }

  /**
   * Bitwise AND of Numbers Range
   * Time: O(log n), Space: O(1)
   */
  static rangeBitwiseAnd(left: number, right: number): number {
    let shift = 0;

    while (left < right) {
      left >>= 1;
      right >>= 1;
      shift++;
    }

    return left << shift;
  }

  /**
   * Number Complement
   * Time: O(log n), Space: O(1)
   */
  static findComplement(num: number): number {
    let mask = 1;

    while (mask < num) {
      mask = (mask << 1) | 1;
    }

    return num ^ mask;
  }

  /**
   * Concatenation of Consecutive Binary Numbers
   * Time: O(n), Space: O(1)
   */
  static concatenatedBinary(n: number): number {
    const MOD = 1e9 + 7;
    let result = 0;
    let length = 0;

    for (let i = 1; i <= n; i++) {
      if ((i & (i - 1)) === 0) length++;
      result = ((result << length) | i) % MOD;
    }

    return result;
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Bit Operations ===");
console.log("Is 3rd bit set in 10:", BitOperations.isBitSet(10, 3));
console.log("Set 2nd bit in 5:", BitOperations.setBit(5, 2));
console.log("Clear 2nd bit in 7:", BitOperations.clearBit(7, 2));
console.log("Toggle 1st bit in 6:", BitOperations.toggleBit(6, 1));

console.log("\n=== Count Bits ===");
console.log("Count set bits in 15:", CountBits.countSetBits(15));
console.log("Is 16 power of 2:", CountBits.isPowerOfTwo(16));
console.log("Is 16 power of 4:", CountBits.isPowerOfFour(16));
console.log("Counting bits [0-5]:", CountBits.countingBits(5));

console.log("\n=== XOR Problems ===");
console.log("Single Number [2,2,1]:", XORProblems.singleNumber([2, 2, 1]));
console.log("Missing Number [3,0,1]:", XORProblems.missingNumber([3, 0, 1]));
console.log(
  "Single Number III [1,2,1,3,2,5]:",
  XORProblems.singleNumber3([1, 2, 1, 3, 2, 5])
);
console.log(
  "Max XOR [3,10,5,25,2,8]:",
  XORProblems.findMaximumXOR([3, 10, 5, 25, 2, 8])
);

console.log("\n=== Bit Techniques ===");
console.log("Reverse bits of 43261596:", BitTechniques.reverseBits(43261596));
console.log("Hamming Distance (1, 4):", BitTechniques.hammingDistance(1, 4));
console.log("Binary to Gray (10):", BitTechniques.binaryToGray(10));
console.log("Gray Code (2):", BitTechniques.grayCode(2));
console.log("Swap (5, 10):", BitTechniques.swap(5, 10));

console.log("\n=== Bit Subsets ===");
console.log("All subsets [1,2,3]:", BitSubsets.subsets([1, 2, 3]));
console.log(
  "Subsets of size 2 [1,2,3,4]:",
  BitSubsets.subsetsOfSizeK([1, 2, 3, 4], 2)
);

console.log("\n=== Advanced Problems ===");
console.log(
  "Range Bitwise AND (5, 7):",
  AdvancedBitProblems.rangeBitwiseAnd(5, 7)
);
console.log("Find Complement (5):", AdvancedBitProblems.findComplement(5));
console.log(
  "Integer Replacement (8):",
  AdvancedBitProblems.integerReplacement(8)
);

export {
  BitOperations,
  CountBits,
  XORProblems,
  BitTechniques,
  BitSubsets,
  AdvancedBitProblems,
};
