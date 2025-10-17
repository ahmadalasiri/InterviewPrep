/**
 * ============================================================================
 * HASH TABLES - COMPREHENSIVE GUIDE
 * ============================================================================
 * 
 * WHAT IS A HASH TABLE?
 * ---------------------
 * A hash table (hash map) is a data structure that maps keys to values using
 * a hash function. It provides extremely fast lookups, insertions, and deletions.
 * 
 * HOW IT WORKS:
 * 1. **Hash Function**: Converts a key into an array index
 *    - Input: Key (any type)
 *    - Output: Integer (array index)
 *    - Must be deterministic (same input → same output)
 * 
 * 2. **Storage**: Values stored in an array at hashed index
 * 
 * 3. **Collision Handling**: When two keys hash to same index
 * 
 * KEY CHARACTERISTICS:
 * - Unordered collection of key-value pairs
 * - Keys must be unique
 * - Keys must be hashable (immutable in most languages)
 * - Dynamic size
 * 
 * TIME COMPLEXITIES:
 * - Insert: O(1) average, O(n) worst case
 * - Delete: O(1) average, O(n) worst case
 * - Search: O(1) average, O(n) worst case
 * - Worst case occurs with many collisions
 * 
 * SPACE COMPLEXITY: O(n)
 * 
 * HASH FUNCTIONS:
 * Good hash functions should:
 * - Be deterministic
 * - Distribute keys uniformly
 * - Be fast to compute
 * - Minimize collisions
 * 
 * Common techniques:
 * - Division method: hash(k) = k % table_size
 * - Multiplication method: hash(k) = floor(m * (k * A % 1))
 * - Universal hashing: Randomly chosen hash function
 * 
 * COLLISION RESOLUTION:
 * 
 * 1. **Chaining (Separate Chaining)**
 *    - Each bucket stores a linked list of entries
 *    - Multiple entries can hash to same index
 *    - Simple to implement
 *    - Degrades to O(n) with many collisions
 * 
 * 2. **Open Addressing**
 *    - All entries stored in the table itself
 *    - If collision, probe for next available slot
 *    
 *    Probing methods:
 *    a) **Linear Probing**: Try next slot (index + 1, index + 2, ...)
 *       - Simple but causes clustering
 *    
 *    b) **Quadratic Probing**: Try index + 1², index + 2², ...
 *       - Reduces primary clustering
 *    
 *    c) **Double Hashing**: Use second hash function
 *       - Best distribution, more complex
 * 
 * LOAD FACTOR:
 * - Load Factor = Number of entries / Table size
 * - Typically resize when load factor > 0.75
 * - Resizing: Create larger table, rehash all entries
 * - Amortized O(1) insertion even with resizing
 * 
 * HASH TABLE vs HASH SET:
 * - **Hash Table (Map)**: Stores key-value pairs
 * - **Hash Set**: Stores only keys (values are implicit/boolean)
 * 
 * COMMON INTERVIEW PATTERNS:
 * 1. Frequency counting
 * 2. Detecting duplicates
 * 3. Two Sum pattern (complement lookup)
 * 4. Grouping/Categorizing (group anagrams)
 * 5. Caching/Memoization
 * 6. Tracking seen elements
 * 7. Sliding window with character counts
 * 
 * COMMON INTERVIEW QUESTIONS:
 * 1. Two Sum
 * 2. Group Anagrams
 * 3. Longest Consecutive Sequence
 * 4. Subarray Sum Equals K
 * 5. LRU Cache (Hash Map + Doubly Linked List)
 * 6. First Unique Character in a String
 * 7. Valid Anagram
 * 8. Contains Duplicate
 * 9. Intersection of Two Arrays
 * 10. Top K Frequent Elements (Hash Map + Heap)
 * 11. Isomorphic Strings
 * 12. 4Sum II
 * 
 * WHEN TO USE HASH TABLES:
 * - Need O(1) lookups
 * - Counting frequencies
 * - Checking for duplicates
 * - Caching results
 * - Implementing sets
 * - Finding pairs/complements
 * 
 * ADVANTAGES:
 * + Average O(1) for insert, delete, search
 * + Very fast in practice
 * + Flexible keys (any hashable type)
 * + Dynamic size
 * 
 * DISADVANTAGES:
 * - Unordered (can't efficiently find min/max)
 * - Worst case O(n) with collisions
 * - Extra space for hash table structure
 * - Hash function overhead
 * - Keys must be hashable/immutable
 * 
 * ALTERNATIVES:
 * - **Ordered Map (TreeMap)**: O(log n) operations but maintains order
 * - **Array**: Use if keys are small integers (0 to n)
 * - **Trie**: Better for string prefix problems
 * 
 * IMPLEMENTATION NOTES:
 * - JavaScript/TypeScript: Map, Set (built-in hash tables)
 * - Map vs Object: Map preserves insertion order, allows any key type
 * - WeakMap/WeakSet: Keys can be garbage collected
 * 
 * ============================================================================
 */

// ============================================================================
// HASH TABLE IMPLEMENTATION
// ============================================================================

class HashTable<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private size: number;
  private capacity: number;
  private loadFactorThreshold: number = 0.75;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.buckets = new Array(capacity);
    this.size = 0;
    
    for (let i = 0; i < capacity; i++) {
      this.buckets[i] = [];
    }
  }

  /**
   * Hash function
   */
  private hash(key: K): number {
    const str = JSON.stringify(key);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash) % this.capacity;
  }

  /**
   * Insert key-value pair
   * Time: O(1) average
   */
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // Update if key exists
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    
    // Insert new key-value pair
    bucket.push([key, value]);
    this.size++;
    
    // Resize if load factor exceeded
    if (this.size / this.capacity > this.loadFactorThreshold) {
      this.resize();
    }
  }

  /**
   * Get value by key
   * Time: O(1) average
   */
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (const [k, v] of bucket) {
      if (k === key) {
        return v;
      }
    }
    
    return undefined;
  }

  /**
   * Check if key exists
   * Time: O(1) average
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete key-value pair
   * Time: O(1) average
   */
  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    
    return false;
  }

  /**
   * Resize hash table
   */
  private resize(): void {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = new Array(this.capacity);
    this.size = 0;
    
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = [];
    }
    
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  /**
   * Get all keys
   */
  keys(): K[] {
    const keys: K[] = [];
    for (const bucket of this.buckets) {
      for (const [key] of bucket) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get all values
   */
  values(): V[] {
    const values: V[] = [];
    for (const bucket of this.buckets) {
      for (const [, value] of bucket) {
        values.push(value);
      }
    }
    return values;
  }

  /**
   * Get size
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Clear hash table
   */
  clear(): void {
    this.buckets = new Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = [];
    }
    this.size = 0;
  }
}

// ============================================================================
// HASH SET IMPLEMENTATION
// ============================================================================

class HashSet<T> {
  private hashTable: HashTable<T, boolean>;

  constructor(capacity?: number) {
    this.hashTable = new HashTable(capacity);
  }

  add(value: T): void {
    this.hashTable.set(value, true);
  }

  has(value: T): boolean {
    return this.hashTable.has(value);
  }

  delete(value: T): boolean {
    return this.hashTable.delete(value);
  }

  size(): number {
    return this.hashTable.getSize();
  }

  values(): T[] {
    return this.hashTable.keys();
  }

  clear(): void {
    this.hashTable.clear();
  }
}

// ============================================================================
// HASH TABLE ALGORITHMS
// ============================================================================

class HashTableAlgorithms {
  /**
   * Two Sum - Find indices of two numbers that add up to target
   * Time: O(n), Space: O(n)
   */
  static twoSum(nums: number[], target: number): [number, number] | null {
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      
      if (map.has(complement)) {
        return [map.get(complement)!, i];
      }
      
      map.set(nums[i], i);
    }
    
    return null;
  }

  /**
   * Group Anagrams
   * Time: O(n * k log k) where k is max string length, Space: O(n * k)
   */
  static groupAnagrams(strs: string[]): string[][] {
    const map = new Map<string, string[]>();
    
    for (const str of strs) {
      const sorted = str.split('').sort().join('');
      
      if (!map.has(sorted)) {
        map.set(sorted, []);
      }
      map.get(sorted)!.push(str);
    }
    
    return Array.from(map.values());
  }

  /**
   * Longest Consecutive Sequence
   * Time: O(n), Space: O(n)
   */
  static longestConsecutive(nums: number[]): number {
    const numSet = new Set(nums);
    let maxLength = 0;
    
    for (const num of numSet) {
      // Only start sequence from the beginning
      if (!numSet.has(num - 1)) {
        let currentNum = num;
        let currentLength = 1;
        
        while (numSet.has(currentNum + 1)) {
          currentNum++;
          currentLength++;
        }
        
        maxLength = Math.max(maxLength, currentLength);
      }
    }
    
    return maxLength;
  }

  /**
   * Find all duplicates in array
   * Time: O(n), Space: O(n)
   */
  static findDuplicates(nums: number[]): number[] {
    const seen = new Set<number>();
    const duplicates: number[] = [];
    
    for (const num of nums) {
      if (seen.has(num)) {
        duplicates.push(num);
      } else {
        seen.add(num);
      }
    }
    
    return duplicates;
  }

  /**
   * Subarray sum equals k
   * Time: O(n), Space: O(n)
   */
  static subarraySum(nums: number[], k: number): number {
    const prefixSumCount = new Map<number, number>();
    prefixSumCount.set(0, 1);
    
    let count = 0;
    let sum = 0;
    
    for (const num of nums) {
      sum += num;
      
      if (prefixSumCount.has(sum - k)) {
        count += prefixSumCount.get(sum - k)!;
      }
      
      prefixSumCount.set(sum, (prefixSumCount.get(sum) || 0) + 1);
    }
    
    return count;
  }

  /**
   * Longest substring without repeating characters
   * Time: O(n), Space: O(min(n, m)) where m is charset size
   */
  static lengthOfLongestSubstring(s: string): number {
    const charIndex = new Map<string, number>();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
      const char = s[right];
      
      if (charIndex.has(char) && charIndex.get(char)! >= left) {
        left = charIndex.get(char)! + 1;
      }
      
      charIndex.set(char, right);
      maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
  }

  /**
   * First unique character in string
   * Time: O(n), Space: O(1) - max 26 characters
   */
  static firstUniqChar(s: string): number {
    const charCount = new Map<string, number>();
    
    for (const char of s) {
      charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    for (let i = 0; i < s.length; i++) {
      if (charCount.get(s[i]) === 1) {
        return i;
      }
    }
    
    return -1;
  }

  /**
   * Isomorphic Strings
   * Time: O(n), Space: O(n)
   */
  static isIsomorphic(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    
    const mapS = new Map<string, string>();
    const mapT = new Map<string, string>();
    
    for (let i = 0; i < s.length; i++) {
      const charS = s[i];
      const charT = t[i];
      
      if (mapS.has(charS)) {
        if (mapS.get(charS) !== charT) return false;
      } else {
        mapS.set(charS, charT);
      }
      
      if (mapT.has(charT)) {
        if (mapT.get(charT) !== charS) return false;
      } else {
        mapT.set(charT, charS);
      }
    }
    
    return true;
  }

  /**
   * Valid Anagram
   * Time: O(n), Space: O(1) - max 26 characters
   */
  static isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    
    const charCount = new Map<string, number>();
    
    for (const char of s) {
      charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    for (const char of t) {
      if (!charCount.has(char)) return false;
      charCount.set(char, charCount.get(char)! - 1);
      if (charCount.get(char) === 0) {
        charCount.delete(char);
      }
    }
    
    return charCount.size === 0;
  }

  /**
   * Top K Frequent Elements
   * Time: O(n log k), Space: O(n)
   */
  static topKFrequent(nums: number[], k: number): number[] {
    const freqMap = new Map<number, number>();
    
    for (const num of nums) {
      freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    return Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([num]) => num);
  }

  /**
   * Contains Duplicate II - duplicate within k distance
   * Time: O(n), Space: O(min(n, k))
   */
  static containsNearbyDuplicate(nums: number[], k: number): boolean {
    const indexMap = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
      if (indexMap.has(nums[i])) {
        if (i - indexMap.get(nums[i])! <= k) {
          return true;
        }
      }
      indexMap.set(nums[i], i);
    }
    
    return false;
  }

  /**
   * LRU Cache using Hash Map + Doubly Linked List
   */
  static class LRUCache {
    private capacity: number;
    private cache: Map<number, number>;
    private order: number[];

    constructor(capacity: number) {
      this.capacity = capacity;
      this.cache = new Map();
      this.order = [];
    }

    get(key: number): number {
      if (!this.cache.has(key)) return -1;
      
      // Move to end (most recently used)
      const index = this.order.indexOf(key);
      this.order.splice(index, 1);
      this.order.push(key);
      
      return this.cache.get(key)!;
    }

    put(key: number, value: number): void {
      if (this.cache.has(key)) {
        // Update existing
        const index = this.order.indexOf(key);
        this.order.splice(index, 1);
      } else if (this.cache.size >= this.capacity) {
        // Evict least recently used
        const lruKey = this.order.shift()!;
        this.cache.delete(lruKey);
      }
      
      this.cache.set(key, value);
      this.order.push(key);
    }
  }

  /**
   * Design HashSet with limited range
   */
  static class MyHashSet {
    private buckets: boolean[];
    private range: number;

    constructor(range: number = 1000001) {
      this.range = range;
      this.buckets = new Array(range).fill(false);
    }

    add(key: number): void {
      if (key < this.range) {
        this.buckets[key] = true;
      }
    }

    remove(key: number): void {
      if (key < this.range) {
        this.buckets[key] = false;
      }
    }

    contains(key: number): boolean {
      return key < this.range && this.buckets[key];
    }
  }

  /**
   * Minimum Window Substring
   * Time: O(m + n), Space: O(k) where k is unique chars in t
   */
  static minWindow(s: string, t: string): string {
    if (s.length < t.length) return '';
    
    const targetCount = new Map<string, number>();
    for (const char of t) {
      targetCount.set(char, (targetCount.get(char) || 0) + 1);
    }
    
    const windowCount = new Map<string, number>();
    let have = 0;
    const need = targetCount.size;
    let result = '';
    let minLen = Infinity;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
      const char = s[right];
      windowCount.set(char, (windowCount.get(char) || 0) + 1);
      
      if (targetCount.has(char) && windowCount.get(char) === targetCount.get(char)) {
        have++;
      }
      
      while (have === need) {
        if (right - left + 1 < minLen) {
          minLen = right - left + 1;
          result = s.substring(left, right + 1);
        }
        
        const leftChar = s[left];
        windowCount.set(leftChar, windowCount.get(leftChar)! - 1);
        
        if (targetCount.has(leftChar) && windowCount.get(leftChar)! < targetCount.get(leftChar)!) {
          have--;
        }
        
        left++;
      }
    }
    
    return result;
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log('=== Hash Table Operations ===');
const hashTable = new HashTable<string, number>();
hashTable.set('one', 1);
hashTable.set('two', 2);
hashTable.set('three', 3);
console.log('Get "two":', hashTable.get('two'));
console.log('Has "three":', hashTable.has('three'));
hashTable.delete('two');
console.log('Keys:', hashTable.keys());
console.log('Values:', hashTable.values());

console.log('\n=== Hash Set Operations ===');
const hashSet = new HashSet<number>();
hashSet.add(1);
hashSet.add(2);
hashSet.add(3);
hashSet.add(2); // duplicate
console.log('Has 2:', hashSet.has(2));
console.log('Size:', hashSet.size());
console.log('Values:', hashSet.values());

console.log('\n=== Hash Table Algorithms ===');
console.log('Two Sum:', HashTableAlgorithms.twoSum([2, 7, 11, 15], 9));
console.log('Group Anagrams:', HashTableAlgorithms.groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));
console.log('Longest Consecutive:', HashTableAlgorithms.longestConsecutive([100, 4, 200, 1, 3, 2]));
console.log('Longest Substring:', HashTableAlgorithms.lengthOfLongestSubstring('abcabcbb'));
console.log('First Uniq Char:', HashTableAlgorithms.firstUniqChar('leetcode'));
console.log('Is Anagram:', HashTableAlgorithms.isAnagram('anagram', 'nagaram'));
console.log('Top 2 Frequent:', HashTableAlgorithms.topKFrequent([1, 1, 1, 2, 2, 3], 2));

console.log('\n=== LRU Cache ===');
const lru = new HashTableAlgorithms.LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log('Get 1:', lru.get(1));
lru.put(3, 3); // evicts key 2
console.log('Get 2:', lru.get(2)); // returns -1
lru.put(4, 4); // evicts key 1
console.log('Get 1:', lru.get(1)); // returns -1
console.log('Get 3:', lru.get(3));
console.log('Get 4:', lru.get(4));

export { HashTable, HashSet, HashTableAlgorithms };

