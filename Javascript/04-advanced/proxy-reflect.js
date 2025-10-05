// Proxy and Reflect in JavaScript

console.log("=== Proxy and Reflect ===\n");

// 1. Basic Proxy
console.log("--- Basic Proxy ---");

const target = {
  name: 'John',
  age: 30
};

const handler = {
  get(target, property) {
    console.log(`Getting ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true; // Indicates success
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.name); // Logs: "Getting name", then "John"
proxy.age = 31; // Logs: "Setting age to 31"

// 2. Validation with Proxy
console.log("\n--- Validation Proxy ---");

const validatedUser = new Proxy({}, {
  set(target, property, value) {
    if (property === 'age') {
      if (typeof value !== 'number' || value < 0 || value > 150) {
        throw new TypeError('Age must be a number between 0 and 150');
      }
    }
    target[property] = value;
    return true;
  }
});

try {
  validatedUser.age = 25; // OK
  console.log('Age set successfully');
  validatedUser.age = -5; // Throws error
} catch (e) {
  console.log('Error:', e.message);
}

// 3. Default Values with Proxy
console.log("\n--- Default Values ---");

const withDefaults = new Proxy({}, {
  get(target, property) {
    return property in target ? target[property] : 'default value';
  }
});

console.log(withDefaults.name); // 'default value'
withDefaults.name = 'Alice';
console.log(withDefaults.name); // 'Alice'

// 4. Negative Array Indexing
console.log("\n--- Negative Array Indexing ---");

const createArray = (arr) => {
  return new Proxy(arr, {
    get(target, property) {
      const index = Number(property);
      if (index < 0) {
        return target[target.length + index];
      }
      return target[property];
    }
  });
};

const arr = createArray([1, 2, 3, 4, 5]);
console.log(arr[-1]); // 5
console.log(arr[-2]); // 4

// 5. Read-Only Object
console.log("\n--- Read-Only Object ---");

const readOnly = (obj) => {
  return new Proxy(obj, {
    set() {
      throw new Error('This object is read-only');
    },
    deleteProperty() {
      throw new Error('Cannot delete properties');
    }
  });
};

const config = readOnly({ apiKey: 'secret123' });
console.log(config.apiKey); // 'secret123'
try {
  config.apiKey = 'new'; // Throws error
} catch (e) {
  console.log('Error:', e.message);
}

// 6. Property Access Tracking
console.log("\n--- Property Access Tracking ---");

const createTracked = (obj) => {
  const accessed = new Set();
  
  const proxy = new Proxy(obj, {
    get(target, property) {
      if (property !== 'getAccessed') {
        accessed.add(property);
      }
      return target[property];
    }
  });
  
  proxy.getAccessed = () => [...accessed];
  return proxy;
};

const tracked = createTracked({ a: 1, b: 2, c: 3 });
tracked.a;
tracked.b;
tracked.a;
console.log(tracked.getAccessed()); // ['a', 'b']

// 7. Function Parameter Validation
console.log("\n--- Function Parameter Validation ---");

const validateParams = (fn, validator) => {
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      if (!validator(...args)) {
        throw new Error('Invalid parameters');
      }
      return target.apply(thisArg, args);
    }
  });
};

const sum = (a, b) => a + b;
const validatedSum = validateParams(sum, (a, b) => {
  return typeof a === 'number' && typeof b === 'number';
});

console.log(validatedSum(5, 3)); // 8
try {
  validatedSum('5', 3); // Throws error
} catch (e) {
  console.log('Error:', e.message);
}

// 8. Reflect API Basics
console.log("\n--- Reflect API ---");

const obj = { x: 1, y: 2 };

console.log(Reflect.get(obj, 'x')); // 1
console.log(Reflect.set(obj, 'z', 3)); // true
console.log(Reflect.has(obj, 'y')); // true
console.log(Reflect.ownKeys(obj)); // ['x', 'y', 'z']
console.log(Reflect.deleteProperty(obj, 'z')); // true

// 9. Reflect with Proxy
console.log("\n--- Reflect with Proxy ---");

const smartProxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`Accessing: ${property}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`Setting: ${property} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  }
});

smartProxy.name = 'Jane';
console.log(smartProxy.name);

// 10. Observable Pattern with Proxy
console.log("\n--- Observable Pattern ---");

const createObservable = (obj, onChange) => {
  return new Proxy(obj, {
    set(target, property, value) {
      const oldValue = target[property];
      const result = Reflect.set(target, property, value);
      if (oldValue !== value) {
        onChange(property, oldValue, value);
      }
      return result;
    }
  });
};

const data = createObservable({ count: 0 }, (prop, oldVal, newVal) => {
  console.log(`${prop} changed from ${oldVal} to ${newVal}`);
});

data.count = 1; // Logs: "count changed from 0 to 1"
data.count = 2; // Logs: "count changed from 1 to 2"

// 11. Revocable Proxy
console.log("\n--- Revocable Proxy ---");

const revocable = Proxy.revocable({ name: 'Alice' }, {
  get(target, property) {
    return target[property];
  }
});

console.log(revocable.proxy.name); // 'Alice'
revocable.revoke(); // Revoke access

try {
  console.log(revocable.proxy.name); // Throws error
} catch (e) {
  console.log('Error: Proxy has been revoked');
}

// 12. Has Trap
console.log("\n--- Has Trap ---");

const hiddenProps = new Proxy({ public: 1, _private: 2 }, {
  has(target, property) {
    if (property.startsWith('_')) {
      return false; // Hide private properties
    }
    return property in target;
  }
});

console.log('public' in hiddenProps); // true
console.log('_private' in hiddenProps); // false (even though it exists)

// 13. Object Composition with Proxy
console.log("\n--- Object Composition ---");

const chain = (obj1, obj2) => {
  return new Proxy(obj1, {
    get(target, property) {
      if (property in target) {
        return target[property];
      }
      return obj2[property];
    }
  });
};

const defaults = { theme: 'light', lang: 'en' };
const userSettings = { theme: 'dark' };
const settings = chain(userSettings, defaults);

console.log(settings.theme); // 'dark' (from userSettings)
console.log(settings.lang); // 'en' (from defaults)

// 14. Performance Monitoring
console.log("\n--- Performance Monitoring ---");

const monitor = (obj) => {
  const stats = {};
  
  return {
    proxy: new Proxy(obj, {
      get(target, property) {
        stats[property] = (stats[property] || 0) + 1;
        return target[property];
      }
    }),
    getStats: () => stats
  };
};

const { proxy: monitoredObj, getStats } = monitor({ a: 1, b: 2 });
monitoredObj.a;
monitoredObj.a;
monitoredObj.b;
console.log(getStats()); // { a: 2, b: 1 }

// 15. Type Coercion Proxy
console.log("\n--- Type Coercion ---");

const typed = new Proxy({}, {
  set(target, property, value) {
    if (property === 'age') {
      target[property] = Number(value);
    } else if (property === 'name') {
      target[property] = String(value);
    } else {
      target[property] = value;
    }
    return true;
  }
});

typed.age = '25';
typed.name = 123;
console.log(typeof typed.age); // 'number'
console.log(typeof typed.name); // 'string'

console.log("\n--- Summary ---");
console.log("✓ Proxy intercepts operations on objects");
console.log("✓ Handler traps: get, set, has, deleteProperty, apply, etc.");
console.log("✓ Reflect provides default implementations");
console.log("✓ Use Proxy for validation, logging, tracking");
console.log("✓ Revocable proxies can be disabled");
console.log("✓ Powerful for meta-programming and API design");
