# Tree & Graph Interview Questions

## Table of Contents

- [Binary Tree Traversals](#binary-tree-traversals)
- [Binary Search Tree](#binary-search-tree)
- [Tree Properties](#tree-properties)
- [Graph Traversals](#graph-traversals)
- [Advanced Graph Problems](#advanced-graph-problems)

---

## Binary Tree Traversals

### Q1: What are the different ways to traverse a binary tree?

**Difficulty:** ⭐ Easy

**Answer:**

There are two main categories:

**1. Depth First Search (DFS):**

- **Inorder** (Left → Root → Right): For BST, gives sorted order
- **Preorder** (Root → Left → Right): Used to create copy of tree
- **Postorder** (Left → Right → Root): Used to delete tree

**2. Breadth First Search (BFS):**

- **Level Order**: Visit nodes level by level

```javascript
// DFS - Inorder (Recursive)
function inorder(root) {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

// DFS - Preorder (Recursive)
function preorder(root) {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
}

// DFS - Postorder (Recursive)
function postorder(root) {
  if (!root) return [];
  return [...postorder(root.left), ...postorder(root.right), root.val];
}

// BFS - Level Order (Iterative)
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}

// Example tree:
//       1
//      / \
//     2   3
//    / \
//   4   5
//
// Inorder:   [4, 2, 5, 1, 3]
// Preorder:  [1, 2, 4, 5, 3]
// Postorder: [4, 5, 2, 3, 1]
// Level:     [[1], [2, 3], [4, 5]]
```

---

### Q2: Maximum Depth of Binary Tree (LeetCode 104)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
// Recursive approach
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Iterative approach (BFS)
function maxDepthIterative(root) {
  if (!root) return 0;

  const queue = [root];
  let depth = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    depth++;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}

// Time: O(n), Space: O(h) where h is height
```

---

## Binary Search Tree

### Q3: Validate Binary Search Tree (LeetCode 98)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;

    // Current node must be within range
    if (node.val <= min || node.val >= max) {
      return false;
    }

    // Left subtree: all values < node.val
    // Right subtree: all values > node.val
    return (
      validate(node.left, min, node.val) && validate(node.right, node.val, max)
    );
  }

  return validate(root, -Infinity, Infinity);
}

// Common mistake: Only checking immediate children
// Wrong:
// function isValidBST(root) {
//   if (!root) return true;
//   if (root.left && root.left.val >= root.val) return false;
//   if (root.right && root.right.val <= root.val) return false;
//   return isValidBST(root.left) && isValidBST(root.right);
// }
//
// This fails for:
//     5
//    / \
//   1   7
//      / \
//     6   8
// Node 6 is valid locally but 1 < 5 < 6 violates BST property

// Time: O(n), Space: O(h)
```

---

### Q4: Lowest Common Ancestor of BST (LeetCode 235)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function lowestCommonAncestor(root, p, q) {
  // If both p and q are smaller, LCA is in left subtree
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }

  // If both p and q are greater, LCA is in right subtree
  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }

  // We've found the split point
  return root;
}

// Iterative version
function lowestCommonAncestorIterative(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) {
      root = root.left;
    } else if (p.val > root.val && q.val > root.val) {
      root = root.right;
    } else {
      return root;
    }
  }
  return null;
}

// Time: O(h), Space: O(h) recursive, O(1) iterative
```

---

## Tree Properties

### Q5: Diameter of Binary Tree (LeetCode 543)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function diameterOfBinaryTree(root) {
  let diameter = 0;

  function height(node) {
    if (!node) return 0;

    const leftHeight = height(node.left);
    const rightHeight = height(node.right);

    // Update diameter at each node
    diameter = Math.max(diameter, leftHeight + rightHeight);

    return 1 + Math.max(leftHeight, rightHeight);
  }

  height(root);
  return diameter;
}

// Example:
//       1
//      / \
//     2   3
//    / \
//   4   5
//
// Diameter = 3 (path: 4 -> 2 -> 1 -> 3)
// At node 2: leftHeight=1, rightHeight=1, diameter=2
// At node 1: leftHeight=2, rightHeight=1, diameter=3

// Time: O(n), Space: O(h)
```

---

### Q6: Balanced Binary Tree (LeetCode 110)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function isBalanced(root) {
  function checkHeight(node) {
    if (!node) return 0;

    const leftHeight = checkHeight(node.left);
    if (leftHeight === -1) return -1; // Left subtree not balanced

    const rightHeight = checkHeight(node.right);
    if (rightHeight === -1) return -1; // Right subtree not balanced

    // Check if current node is balanced
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1;
    }

    return 1 + Math.max(leftHeight, rightHeight);
  }

  return checkHeight(root) !== -1;
}

// Balanced tree: height difference ≤ 1 for all nodes
//       1
//      / \
//     2   3
//    /
//   4         <- Balanced (max difference = 1)
//
// Unbalanced:
//       1
//      /
//     2
//    /
//   3           <- Not balanced (difference = 2)

// Time: O(n), Space: O(h)
```

---

### Q7: Symmetric Tree (LeetCode 101)

**Difficulty:** ⭐ Easy

**Answer:**

```javascript
function isSymmetric(root) {
  function isMirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;

    return (
      left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  }

  return isMirror(root.left, root.right);
}

// Symmetric tree:
//       1
//      / \
//     2   2
//    / \ / \
//   3  4 4  3
//
// Not symmetric:
//       1
//      / \
//     2   2
//      \   \
//       3   3

// Time: O(n), Space: O(h)
```

---

## Graph Traversals

### Q8: Number of Islands (LeetCode 200)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function numIslands(grid) {
  if (grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    // Base cases
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === "0") {
      return;
    }

    grid[r][c] = "0"; // Mark as visited

    // Explore all 4 directions
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}

// Example:
// [
//   ['1','1','0','0','0'],
//   ['1','1','0','0','0'],
//   ['0','0','1','0','0'],
//   ['0','0','0','1','1']
// ]
// Output: 3 islands

// Time: O(m * n), Space: O(m * n) for DFS stack
```

---

### Q9: Course Schedule (Cycle Detection) (LeetCode 207)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function canFinish(numCourses, prerequisites) {
  // Build adjacency list
  const graph = new Map();
  for (let i = 0; i < numCourses; i++) {
    graph.set(i, []);
  }

  for (let [course, prereq] of prerequisites) {
    graph.get(course).push(prereq);
  }

  const visited = new Set();
  const recursionStack = new Set();

  function hasCycle(course) {
    if (recursionStack.has(course)) return true; // Cycle detected
    if (visited.has(course)) return false; // Already processed

    visited.add(course);
    recursionStack.add(course);

    for (let prereq of graph.get(course)) {
      if (hasCycle(prereq)) return true;
    }

    recursionStack.delete(course);
    return false;
  }

  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }

  return true;
}

// Example:
// numCourses = 4
// prerequisites = [[1,0],[2,0],[3,1],[3,2]]
//
// Graph:
// 0 <- 1 <- 3
// 0 <- 2 <- 3
//
// No cycle, can finish all courses

// Time: O(V + E), Space: O(V + E)
```

---

### Q10: Course Schedule II (Topological Sort) (LeetCode 210)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function findOrder(numCourses, prerequisites) {
  const graph = new Map();
  for (let i = 0; i < numCourses; i++) {
    graph.set(i, []);
  }

  for (let [course, prereq] of prerequisites) {
    graph.get(course).push(prereq);
  }

  const visited = new Set();
  const recursionStack = new Set();
  const result = [];

  function dfs(course) {
    if (recursionStack.has(course)) return false;
    if (visited.has(course)) return true;

    visited.add(course);
    recursionStack.add(course);

    for (let prereq of graph.get(course)) {
      if (!dfs(prereq)) return false;
    }

    recursionStack.delete(course);
    result.push(course); // Add to result after processing dependencies
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return [];
  }

  return result;
}

// Topological sort: Linear ordering of vertices
// such that for every edge u -> v, u comes before v

// Time: O(V + E), Space: O(V + E)
```

---

## Advanced Graph Problems

### Q11: Clone Graph (LeetCode 133)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function cloneGraph(node) {
  if (!node) return null;

  const visited = new Map();

  function clone(node) {
    if (visited.has(node.val)) {
      return visited.get(node.val);
    }

    const newNode = { val: node.val, neighbors: [] };
    visited.set(node.val, newNode);

    for (let neighbor of node.neighbors) {
      newNode.neighbors.push(clone(neighbor));
    }

    return newNode;
  }

  return clone(node);
}

// Time: O(V + E), Space: O(V)
```

---

### Q12: Word Ladder (LeetCode 127)

**Difficulty:** ⭐⭐⭐ Hard

**Answer:**

```javascript
function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const queue = [[beginWord, 1]];
  const visited = new Set([beginWord]);

  while (queue.length > 0) {
    const [word, level] = queue.shift();

    if (word === endWord) return level;

    // Try changing each character
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        // 'a' to 'z'
        const newWord =
          word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);

        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push([newWord, level + 1]);
        }
      }
    }
  }

  return 0;
}

// Example:
// beginWord = "hit"
// endWord = "cog"
// wordList = ["hot","dot","dog","lot","log","cog"]
//
// Shortest path:
// hit -> hot -> dot -> dog -> cog (length = 5)

// Time: O(M² * N) where M is word length, N is wordList size
// Space: O(M * N)
```

---

### Q13: Pacific Atlantic Water Flow (LeetCode 417)

**Difficulty:** ⭐⭐ Medium

**Answer:**

```javascript
function pacificAtlantic(heights) {
  if (heights.length === 0) return [];

  const rows = heights.length;
  const cols = heights[0].length;
  const pacific = new Set();
  const atlantic = new Set();

  function dfs(r, c, visited) {
    const key = `${r},${c}`;
    if (visited.has(key)) return;

    visited.add(key);

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    for (let [dr, dc] of directions) {
      const newR = r + dr;
      const newC = c + dc;

      if (
        newR >= 0 &&
        newR < rows &&
        newC >= 0 &&
        newC < cols &&
        heights[newR][newC] >= heights[r][c]
      ) {
        dfs(newR, newC, visited);
      }
    }
  }

  // DFS from Pacific borders
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pacific);
    dfs(rows - 1, c, atlantic);
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pacific);
    dfs(r, cols - 1, atlantic);
  }

  // Find intersection
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (pacific.has(key) && atlantic.has(key)) {
        result.push([r, c]);
      }
    }
  }

  return result;
}

// Time: O(m * n), Space: O(m * n)
```

---

Continue to [Algorithm Questions](./05-algorithm-questions.md) →




