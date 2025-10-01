# Practical Coding Questions

## Common Algorithm and Coding Challenges

---

## Array & String Problems

### Q1: Implement array methods (map, filter, reduce)

**Answer:**

```javascript
// Custom map
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

// Custom filter
Array.prototype.myFilter = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// Custom reduce
Array.prototype.myReduce = function(callback, initial) {
  let acc = initial !== undefined ? initial : this[0];
  let start = initial !== undefined ? 0 : 1;
  
  for (let i = start; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};
```

---

### Q2: Implement debounce and throttle

**Answer:**

```javascript
// Debounce - delay execution until pause
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Usage
const search = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Throttle - limit execution rate
function throttle(fn, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const onScroll = throttle(() => {
  console.log('Scrolled');
}, 200);
```

---

### Q3: Deep clone an object

**Answer:**

```javascript
function deepClone(obj, hash = new WeakMap()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    const arrCopy = [];
    hash.set(obj, arrCopy);
    obj.forEach((item, index) => {
      arrCopy[index] = deepClone(item, hash);
    });
    return arrCopy;
  }
  
  // Handle Object
  const objCopy = {};
  hash.set(obj, objCopy);
  Object.keys(obj).forEach(key => {
    objCopy[key] = deepClone(obj[key], hash);
  });
  
  return objCopy;
}

// Usage
const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const copy = deepClone(original);
```

---

## Async Problems

### Q4: Implement Promise.all

**Answer:**

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve(results);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Usage
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]
```

---

### Q5: Implement retry logic with exponential backoff

**Answer:**

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed. Retrying in ${waitTime}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Usage
retry(() => fetch('/api/data'), 3, 1000)
  .then(response => response.json())
  .catch(error => console.error('Failed after retries:', error));
```

---

## Data Structure Problems

### Q6: Flatten a nested array

**Answer:**

```javascript
// Recursive approach
function flatten(arr) {
  const result = [];
  
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// Using reduce
function flattenReduce(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flattenReduce(item) : item);
  }, []);
}

// Built-in (ES2019)
const arr = [1, [2, [3, [4]]]];
arr.flat(Infinity); // [1, 2, 3, 4]

// Usage
flatten([1, [2, [3, [4, 5]]]]); // [1, 2, 3, 4, 5]
```

---

### Q7: Find duplicates in an array

**Answer:**

```javascript
// Using Set
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  }
  
  return Array.from(duplicates);
}

// Using frequency counter
function findDuplicatesCounter(arr) {
  const freq = {};
  const duplicates = [];
  
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  
  for (const key in freq) {
    if (freq[key] > 1) {
      duplicates.push(key);
    }
  }
  
  return duplicates;
}

// Usage
findDuplicates([1, 2, 3, 2, 4, 3]); // [2, 3]
```

---

## Common Challenges

### Q8: Implement function currying

**Answer:**

```javascript
// Simple curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Usage
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

---

These practical questions cover common interview scenarios. Practice implementing them!

