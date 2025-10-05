// Symbols in JavaScript

console.log("=== Symbols ===\n");

// 1. Creating Symbols
console.log("--- Creating Symbols ---");

const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

console.log(sym2 === sym3); // false - Each symbol is unique
console.log(typeof sym1); // 'symbol'
console.log(sym2.toString()); // 'Symbol(description)'
console.log(sym2.description); // 'description'

// 2. Symbols as Object Properties
console.log("\n--- Symbols as Object Properties ---");

const id = Symbol('id');
const user = {
  name: 'John',
  [id]: 123 // Symbol as property key
};

console.log(user[id]); // 123
console.log(user.name); // 'John'

// Symbols don't show in normal iteration
console.log(Object.keys(user)); // ['name']
console.log(JSON.stringify(user)); // {"name":"John"}

// But can be accessed with special methods
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]
console.log(Reflect.ownKeys(user)); // ['name', Symbol(id)]

// 3. Global Symbol Registry
console.log("\n--- Global Symbol Registry ---");

const globalSym1 = Symbol.for('app.id');
const globalSym2 = Symbol.for('app.id');

console.log(globalSym1 === globalSym2); // true - Same symbol from registry
console.log(Symbol.keyFor(globalSym1)); // 'app.id'

// 4. Well-Known Symbols
console.log("\n--- Well-Known Symbols ---");

// Symbol.iterator - Makes object iterable
const iterableObj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};

console.log([...iterableObj]); // [1, 2, 3]

// Symbol.toStringTag - Customizes Object.prototype.toString
console.log("\n--- Symbol.toStringTag ---");

class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass';
  }
}

const obj = new MyClass();
console.log(Object.prototype.toString.call(obj)); // [object MyClass]

// Symbol.hasInstance - Customizes instanceof
console.log("\n--- Symbol.hasInstance ---");

class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true
console.log({} instanceof MyArray); // false

// Symbol.toPrimitive - Customizes type conversion
console.log("\n--- Symbol.toPrimitive ---");

const customObj = {
  value: 42,
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.value;
    }
    if (hint === 'string') {
      return `Value: ${this.value}`;
    }
    return true; // default
  }
};

console.log(+customObj); // 42 (number)
console.log(`${customObj}`); // "Value: 42" (string)
console.log(customObj + 0); // 42 (default -> number)

// 5. Symbol.species - Customizes derived objects
console.log("\n--- Symbol.species ---");

class MyArraySubclass extends Array {
  static get [Symbol.species]() {
    return Array; // Return Array instead of MyArraySubclass
  }
}

const myArr = new MyArraySubclass(1, 2, 3);
const mapped = myArr.map(x => x * 2);
console.log(mapped instanceof MyArraySubclass); // false
console.log(mapped instanceof Array); // true

// 6. Symbol.isConcatSpreadable
console.log("\n--- Symbol.isConcatSpreadable ---");

const arr1 = [1, 2];
const arr2 = [3, 4];
arr2[Symbol.isConcatSpreadable] = false;

console.log(arr1.concat(arr2)); // [1, 2, [3, 4]]

// 7. Hidden Properties with Symbols
console.log("\n--- Hidden Properties ---");

const _internal = Symbol('internal');

class Counter {
  constructor() {
    this[_internal] = 0; // Hidden property
  }
  
  increment() {
    this[_internal]++;
  }
  
  getValue() {
    return this[_internal];
  }
}

const counter = new Counter();
counter.increment();
counter.increment();
console.log(counter.getValue()); // 2
console.log(Object.keys(counter)); // []
console.log(counter[_internal]); // 2 (if we have the symbol)

// 8. Preventing Property Collisions
console.log("\n--- Preventing Collisions ---");

const myLib = {
  [Symbol.for('myLib.version')]: '1.0.0',
  [Symbol.for('myLib.config')]: { debug: true }
};

// Another library can safely add properties without collision
const extendedLib = {
  ...myLib,
  [Symbol.for('otherLib.version')]: '2.0.0'
};

console.log(extendedLib[Symbol.for('myLib.version')]); // '1.0.0'
console.log(extendedLib[Symbol.for('otherLib.version')]); // '2.0.0'

// 9. Symbol.match, Symbol.search, Symbol.replace, Symbol.split
console.log("\n--- String Matching Symbols ---");

class MyMatcher {
  [Symbol.match](string) {
    return string.indexOf('match') !== -1;
  }
  
  [Symbol.search](string) {
    return string.indexOf('search');
  }
}

const matcher = new MyMatcher();
console.log('test match'.match(matcher)); // true
console.log('test search here'.search(matcher)); // 5

// 10. Symbol.asyncIterator
console.log("\n--- Symbol.asyncIterator ---");

const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
  }
};

(async () => {
  for await (const value of asyncIterable) {
    console.log(value);
  }
})();

// 11. Practical Use Case: Metadata
console.log("\n--- Metadata with Symbols ---");

const metadata = Symbol('metadata');

class Task {
  constructor(title) {
    this.title = title;
    this[metadata] = {
      created: new Date(),
      modified: null
    };
  }
  
  update(newTitle) {
    this.title = newTitle;
    this[metadata].modified = new Date();
  }
  
  getMetadata() {
    return this[metadata];
  }
}

const task = new Task('Learn Symbols');
setTimeout(() => {
  task.update('Master Symbols');
  console.log('Metadata:', task.getMetadata());
}, 100);

console.log("\n--- Summary ---");
console.log("✓ Symbols are unique and immutable primitives");
console.log("✓ Symbol() creates unique symbol each time");
console.log("✓ Symbol.for() creates/retrieves from global registry");
console.log("✓ Symbols as keys don't show in Object.keys()");
console.log("✓ Well-known symbols customize language behavior");
console.log("✓ Use symbols for private properties and metadata");
