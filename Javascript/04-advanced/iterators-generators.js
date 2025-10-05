// Iterators and Generators in JavaScript

console.log("=== Iterators and Generators ===\n");

// 1. Iterator Protocol
console.log("--- Iterator Protocol ---");

// Custom iterator
const customIterator = {
  data: ['a', 'b', 'c'],
  index: 0,
  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.index < this.data.length) {
          return { value: this.data[this.index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const item of customIterator) {
  console.log(item);
}

// 2. Basic Generator Function
console.log("\n--- Basic Generator ---");

function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 3. Generator with Loop
console.log("\n--- Generator with Loop ---");

function* rangeGenerator(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for (const num of rangeGenerator(1, 5)) {
  console.log(num);
}

// 4. Infinite Generator
console.log("\n--- Infinite Generator ---");

function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const infinite = infiniteSequence();
console.log(infinite.next().value); // 0
console.log(infinite.next().value); // 1
console.log(infinite.next().value); // 2

// 5. Generator with Return
console.log("\n--- Generator with Return ---");

function* generatorWithReturn() {
  yield 1;
  yield 2;
  return 3; // This value is returned but not iterated
  yield 4; // Never reached
}

const genReturn = generatorWithReturn();
console.log(genReturn.next()); // { value: 1, done: false }
console.log(genReturn.next()); // { value: 2, done: false }
console.log(genReturn.next()); // { value: 3, done: true }

// 6. Passing Values to Generators
console.log("\n--- Passing Values to Generators ---");

function* generatorWithInput() {
  const input1 = yield 'First yield';
  console.log('Received:', input1);
  const input2 = yield 'Second yield';
  console.log('Received:', input2);
  return 'Done';
}

const genInput = generatorWithInput();
console.log(genInput.next());           // { value: 'First yield', done: false }
console.log(genInput.next('Value 1'));  // Logs: Received: Value 1
console.log(genInput.next('Value 2'));  // Logs: Received: Value 2

// 7. Generator Delegation (yield*)
console.log("\n--- Generator Delegation ---");

function* generator1() {
  yield 'a';
  yield 'b';
}

function* generator2() {
  yield 1;
  yield* generator1(); // Delegate to another generator
  yield 2;
}

for (const value of generator2()) {
  console.log(value); // 1, 'a', 'b', 2
}

// 8. Practical Example: ID Generator
console.log("\n--- ID Generator ---");

function* idGenerator() {
  let id = 1;
  while (true) {
    yield `ID-${id++}`;
  }
}

const ids = idGenerator();
console.log(ids.next().value); // ID-1
console.log(ids.next().value); // ID-2
console.log(ids.next().value); // ID-3

// 9. Fibonacci Generator
console.log("\n--- Fibonacci Generator ---");

function* fibonacci(limit = 10) {
  let [prev, curr] = [0, 1];
  let count = 0;
  
  while (count < limit) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
    count++;
  }
}

console.log([...fibonacci(8)]);

// 10. Async Generator
console.log("\n--- Async Generator ---");

async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

(async () => {
  for await (const value of asyncGenerator()) {
    console.log(value);
  }
})();

// 11. Iterator for Custom Object
console.log("\n--- Custom Iterable Object ---");

class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  }
}

const range = new Range(1, 5);
console.log([...range]); // [1, 2, 3, 4, 5]

// 12. Generator for Tree Traversal
console.log("\n--- Tree Traversal Generator ---");

class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(child) {
    this.children.push(child);
  }
  
  *traverse() {
    yield this.value;
    for (const child of this.children) {
      yield* child.traverse();
    }
  }
}

const root = new TreeNode('root');
const child1 = new TreeNode('child1');
const child2 = new TreeNode('child2');
child1.addChild(new TreeNode('grandchild1'));
child1.addChild(new TreeNode('grandchild2'));
root.addChild(child1);
root.addChild(child2);

console.log([...root.traverse()]);

console.log("\n--- Summary ---");
console.log("✓ Iterators implement next() method returning {value, done}");
console.log("✓ Generators use function* syntax");
console.log("✓ yield pauses execution and returns value");
console.log("✓ yield* delegates to another generator");
console.log("✓ Generators can receive values via next(value)");
console.log("✓ for...of works with any iterable");
