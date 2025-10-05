// WeakMap and WeakSet in JavaScript

console.log("=== WeakMap and WeakSet ===\n");

// 1. WeakMap Basics
console.log("--- WeakMap Basics ---");

const weakMap = new WeakMap();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakMap.set(obj1, 'value1');
weakMap.set(obj2, 'value2');

console.log(weakMap.get(obj1)); // 'value1'
console.log(weakMap.has(obj2)); // true

weakMap.delete(obj2);
console.log(weakMap.has(obj2)); // false

// 2. WeakMap vs Map
console.log("\n--- WeakMap vs Map ---");

// Map allows any key type
const map = new Map();
map.set(1, 'number key');
map.set('key', 'string key');
console.log('Map size:', map.size);
console.log('Map is iterable:', Symbol.iterator in map);

// WeakMap only allows objects as keys
const wm = new WeakMap();
// wm.set(1, 'value'); // TypeError: Invalid value used as weak map key
wm.set({}, 'object key');
// WeakMap doesn't have size or iteration
console.log('WeakMap has size:', 'size' in wm); // false
console.log('WeakMap is iterable:', Symbol.iterator in wm); // false

// 3. Garbage Collection with WeakMap
console.log("\n--- Garbage Collection ---");

let data = { name: 'John' };
const metadata = new WeakMap();
metadata.set(data, { created: Date.now() });

console.log('Metadata exists:', metadata.has(data)); // true

// When data is garbage collected, metadata entry is automatically removed
data = null; // Remove reference
// metadata entry will be garbage collected

// 4. Private Data with WeakMap
console.log("\n--- Private Data Pattern ---");

const privateData = new WeakMap();

class Person {
  constructor(name, ssn) {
    this.name = name; // Public
    privateData.set(this, { ssn }); // Private
  }
  
  getSSN() {
    return privateData.get(this).ssn;
  }
}

const person = new Person('Alice', '123-45-6789');
console.log(person.name); // 'Alice'
console.log(person.ssn); // undefined (private)
console.log(person.getSSN()); // '123-45-6789'

// 5. Caching with WeakMap
console.log("\n--- Caching ---");

const cache = new WeakMap();

function processData(obj) {
  if (cache.has(obj)) {
    console.log('Returning cached result');
    return cache.get(obj);
  }
  
  console.log('Computing result...');
  const result = obj.value * 2;
  cache.set(obj, result);
  return result;
}

const dataObj = { value: 10 };
console.log(processData(dataObj)); // Computing result... 20
console.log(processData(dataObj)); // Returning cached result 20

// 6. DOM Node Metadata
console.log("\n--- DOM Node Metadata (Conceptual) ---");

const nodeMetadata = new WeakMap();

// Simulating DOM nodes
class DOMNode {
  constructor(id) {
    this.id = id;
  }
}

function attachMetadata(node, data) {
  nodeMetadata.set(node, data);
}

function getMetadata(node) {
  return nodeMetadata.get(node);
}

const element = new DOMNode('button1');
attachMetadata(element, { clicks: 0, lastClicked: null });

const meta = getMetadata(element);
meta.clicks++;
console.log('Element metadata:', getMetadata(element));

// 7. WeakSet Basics
console.log("\n--- WeakSet Basics ---");

const weakSet = new WeakSet();

let item1 = { name: 'Item 1' };
let item2 = { name: 'Item 2' };

weakSet.add(item1);
weakSet.add(item2);

console.log(weakSet.has(item1)); // true
console.log(weakSet.has(item2)); // true

weakSet.delete(item2);
console.log(weakSet.has(item2)); // false

// 8. WeakSet for Object Tracking
console.log("\n--- Object Tracking ---");

const processedObjects = new WeakSet();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    console.log('Already processed');
    return;
  }
  
  console.log('Processing:', obj.name);
  // Process the object...
  processedObjects.add(obj);
}

const task1 = { name: 'Task 1' };
processObject(task1); // Processing: Task 1
processObject(task1); // Already processed

// 9. WeakSet for Marking Objects
console.log("\n--- Marking Objects ---");

const marked = new WeakSet();

class User {
  constructor(name) {
    this.name = name;
  }
}

function markAsVIP(user) {
  marked.add(user);
}

function isVIP(user) {
  return marked.has(user);
}

const user1 = new User('Alice');
const user2 = new User('Bob');

markAsVIP(user1);
console.log('Alice is VIP:', isVIP(user1)); // true
console.log('Bob is VIP:', isVIP(user2)); // false

// 10. Preventing Memory Leaks
console.log("\n--- Memory Leak Prevention ---");

// BAD: Regular Map can cause memory leaks
const regularMap = new Map();
let tempObj = { data: 'large data' };
regularMap.set(tempObj, 'metadata');
// Even if we don't need tempObj anymore, it stays in memory
// because the Map holds a strong reference

// GOOD: WeakMap allows garbage collection
const safeMap = new WeakMap();
let tempObj2 = { data: 'large data' };
safeMap.set(tempObj2, 'metadata');
tempObj2 = null; // Object can be garbage collected

console.log('Regular Map still has entry:', regularMap.size > 0);
// WeakMap entry will be automatically cleaned up

// 11. Instance Tracking
console.log("\n--- Instance Tracking ---");

const instances = new WeakSet();

class TrackedClass {
  constructor(name) {
    this.name = name;
    instances.add(this);
  }
  
  static isInstance(obj) {
    return instances.has(obj);
  }
}

const tracked1 = new TrackedClass('Instance 1');
const notTracked = { name: 'Not tracked' };

console.log(TrackedClass.isInstance(tracked1)); // true
console.log(TrackedClass.isInstance(notTracked)); // false

// 12. Circular Reference Handling
console.log("\n--- Circular Reference Handling ---");

const visited = new WeakSet();

function detectCircular(obj) {
  if (visited.has(obj)) {
    return true;
  }
  
  visited.add(obj);
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (detectCircular(obj[key])) {
        return true;
      }
    }
  }
  
  return false;
}

const circular = { name: 'Circular' };
circular.self = circular;

// This would cause infinite loop without WeakSet
// console.log('Has circular reference:', detectCircular(circular));

// 13. Event Listener Cleanup
console.log("\n--- Event Listener Management ---");

const eventListeners = new WeakMap();

class EventEmitter {
  constructor() {
    eventListeners.set(this, new Map());
  }
  
  on(event, callback) {
    const listeners = eventListeners.get(this);
    if (!listeners.has(event)) {
      listeners.set(event, []);
    }
    listeners.get(event).push(callback);
  }
  
  emit(event, ...args) {
    const listeners = eventListeners.get(this);
    const callbacks = listeners.get(event) || [];
    callbacks.forEach(cb => cb(...args));
  }
}

const emitter = new EventEmitter();
emitter.on('test', (data) => console.log('Event:', data));
emitter.emit('test', 'Hello'); // Event: Hello

// 14. Relationship Mapping
console.log("\n--- Object Relationships ---");

const relationships = new WeakMap();

function addRelationship(obj1, obj2, type) {
  if (!relationships.has(obj1)) {
    relationships.set(obj1, []);
  }
  relationships.get(obj1).push({ target: obj2, type });
}

function getRelationships(obj) {
  return relationships.get(obj) || [];
}

const parent = { name: 'Parent' };
const child = { name: 'Child' };

addRelationship(parent, child, 'parent-child');
console.log('Relationships:', getRelationships(parent));

console.log("\n--- Summary ---");
console.log("✓ WeakMap: Key-value pairs with object keys only");
console.log("✓ WeakSet: Collection of objects only");
console.log("✓ Keys/values are weakly held (allow GC)");
console.log("✓ Not iterable, no size property");
console.log("✓ Use for private data, caching, metadata");
console.log("✓ Prevents memory leaks for temporary associations");
console.log("✓ Perfect for DOM nodes and object tracking");
