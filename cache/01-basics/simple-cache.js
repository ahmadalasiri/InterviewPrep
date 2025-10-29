// Simple Cache Implementation - Minimalist approach
// Good starting point for understanding caching basics

class SimpleCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    // Simple eviction: delete oldest when full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Basic caching
console.log('Example 1: Basic Caching\n');

const cache = new SimpleCache(3);
cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);

console.log('Get a:', cache.get('a'));
console.log('Get b:', cache.get('b'));
console.log('Has z:', cache.has('z'));
console.log();

// Example 2: Cache with functions
console.log('Example 2: Expensive Function Caching\n');

const expensiveCache = new SimpleCache();

// Simulate expensive computation
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Cached version
function cachedFibonacci(n) {
  const key = `fib:${n}`;
  
  if (expensiveCache.has(key)) {
    console.log(`  [CACHE HIT] fib(${n})`);
    return expensiveCache.get(key);
  }
  
  console.log(`  [CACHE MISS] Computing fib(${n})...`);
  const result = fibonacci(n);
  expensiveCache.set(key, result);
  return result;
}

// Test caching
console.log('Result:', cachedFibonacci(10));  // Compute
console.log('Result:', cachedFibonacci(10));  // Cached
console.log('Result:', cachedFibonacci(15));  // Compute
console.log();

// Example 3: API Response Caching
console.log('Example 3: API Response Caching\n');

const apiCache = new SimpleCache();

async function fetchUser(userId) {
  const cacheKey = `user:${userId}`;
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    console.log(`  [CACHE] User ${userId} from cache`);
    return apiCache.get(cacheKey);
  }
  
  // Simulate API call
  console.log(`  [API] Fetching user ${userId}...`);
  const user = { id: userId, name: `User ${userId}` };
  
  // Store in cache
  apiCache.set(cacheKey, user);
  
  return user;
}

// Usage
(async () => {
  await fetchUser(1);  // API call
  await fetchUser(1);  // Cached
  await fetchUser(2);  // API call
})();

// ============================================================================
// SIMPLE DECORATOR PATTERN
// ============================================================================

function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example usage
const slowFunction = (n) => {
  console.log(`  Computing ${n}...`);
  return n * 2;
};

const cachedFunction = memoize(slowFunction);

console.log('\nExample 4: Memoization\n');
console.log(cachedFunction(5));  // Computes
console.log(cachedFunction(5));  // Cached
console.log(cachedFunction(10)); // Computes

module.exports = SimpleCache;

