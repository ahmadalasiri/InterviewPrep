/**
 * Binary Trees - JavaScript Implementation
 *
 * Topics covered:
 * - Binary Tree basics
 * - Binary Search Tree (BST)
 * - Tree traversals
 * - Common tree problems
 */

// ============================================
// TREE NODE CLASS
// ============================================

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ============================================
// BINARY SEARCH TREE
// ============================================

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insert node - O(log n) average, O(n) worst
  insert(val) {
    const newNode = new TreeNode(val);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;

    while (true) {
      if (val === current.val) return undefined; // Duplicate

      if (val < current.val) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // Search - O(log n) average, O(n) worst
  search(val) {
    let current = this.root;

    while (current) {
      if (val === current.val) return current;
      current = val < current.val ? current.left : current.right;
    }

    return null;
  }

  // Find minimum - O(log n) average
  findMin(node = this.root) {
    if (!node) return null;

    while (node.left) {
      node = node.left;
    }

    return node;
  }

  // Find maximum - O(log n) average
  findMax(node = this.root) {
    if (!node) return null;

    while (node.right) {
      node = node.right;
    }

    return node;
  }

  // Delete node - O(log n) average
  delete(val) {
    this.root = this.deleteNode(this.root, val);
  }

  deleteNode(node, val) {
    if (!node) return null;

    if (val < node.val) {
      node.left = this.deleteNode(node.left, val);
    } else if (val > node.val) {
      node.right = this.deleteNode(node.right, val);
    } else {
      // Node found
      // Case 1: No children (leaf node)
      if (!node.left && !node.right) {
        return null;
      }

      // Case 2: One child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Two children
      // Find min in right subtree
      const minRight = this.findMin(node.right);
      node.val = minRight.val;
      node.right = this.deleteNode(node.right, minRight.val);
    }

    return node;
  }
}

// ============================================
// TREE TRAVERSALS
// ============================================

/**
 * Inorder Traversal (Left -> Root -> Right)
 * Time: O(n), Space: O(h) where h is height
 */
function inorderTraversal(root) {
  const result = [];

  function traverse(node) {
    if (!node) return;

    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }

  traverse(root);
  return result;
}

/**
 * Preorder Traversal (Root -> Left -> Right)
 * Time: O(n), Space: O(h)
 */
function preorderTraversal(root) {
  const result = [];

  function traverse(node) {
    if (!node) return;

    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);
  return result;
}

/**
 * Postorder Traversal (Left -> Right -> Root)
 * Time: O(n), Space: O(h)
 */
function postorderTraversal(root) {
  const result = [];

  function traverse(node) {
    if (!node) return;

    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }

  traverse(root);
  return result;
}

/**
 * Level Order Traversal (BFS)
 * Time: O(n), Space: O(w) where w is max width
 */
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}

// ============================================
// COMMON PROBLEMS
// ============================================

/**
 * Maximum Depth of Binary Tree (LeetCode 104)
 * Time: O(n), Space: O(h)
 */
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/**
 * Minimum Depth of Binary Tree (LeetCode 111)
 * Time: O(n), Space: O(h)
 */
function minDepth(root) {
  if (!root) return 0;

  if (!root.left) return 1 + minDepth(root.right);
  if (!root.right) return 1 + minDepth(root.left);

  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

/**
 * Invert Binary Tree (LeetCode 226)
 * Time: O(n), Space: O(h)
 */
function invertTree(root) {
  if (!root) return null;

  [root.left, root.right] = [root.right, root.left];

  invertTree(root.left);
  invertTree(root.right);

  return root;
}

/**
 * Diameter of Binary Tree (LeetCode 543)
 * Time: O(n), Space: O(h)
 */
function diameterOfBinaryTree(root) {
  let diameter = 0;

  function height(node) {
    if (!node) return 0;

    const leftHeight = height(node.left);
    const rightHeight = height(node.right);

    diameter = Math.max(diameter, leftHeight + rightHeight);

    return 1 + Math.max(leftHeight, rightHeight);
  }

  height(root);
  return diameter;
}

/**
 * Balanced Binary Tree (LeetCode 110)
 * Time: O(n), Space: O(h)
 */
function isBalanced(root) {
  function checkHeight(node) {
    if (!node) return 0;

    const leftHeight = checkHeight(node.left);
    if (leftHeight === -1) return -1;

    const rightHeight = checkHeight(node.right);
    if (rightHeight === -1) return -1;

    if (Math.abs(leftHeight - rightHeight) > 1) return -1;

    return 1 + Math.max(leftHeight, rightHeight);
  }

  return checkHeight(root) !== -1;
}

/**
 * Symmetric Tree (LeetCode 101)
 * Time: O(n), Space: O(h)
 */
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

  return isMirror(root, root);
}

/**
 * Same Tree (LeetCode 100)
 * Time: O(n), Space: O(h)
 */
function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;

  return (
    p.val === q.val &&
    isSameTree(p.left, q.left) &&
    isSameTree(p.right, q.right)
  );
}

/**
 * Subtree of Another Tree (LeetCode 572)
 * Time: O(m * n), Space: O(h)
 */
function isSubtree(root, subRoot) {
  if (!root) return false;

  if (isSameTree(root, subRoot)) return true;

  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

/**
 * Lowest Common Ancestor of BST (LeetCode 235)
 * Time: O(h), Space: O(h)
 */
function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }

  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }

  return root;
}

/**
 * Path Sum (LeetCode 112)
 * Time: O(n), Space: O(h)
 */
function hasPathSum(root, targetSum) {
  if (!root) return false;

  if (!root.left && !root.right) {
    return root.val === targetSum;
  }

  return (
    hasPathSum(root.left, targetSum - root.val) ||
    hasPathSum(root.right, targetSum - root.val)
  );
}

/**
 * Binary Tree Paths (LeetCode 257)
 * Time: O(n), Space: O(h)
 */
function binaryTreePaths(root) {
  const result = [];

  function dfs(node, path) {
    if (!node) return;

    path.push(node.val);

    if (!node.left && !node.right) {
      result.push(path.join("->"));
    } else {
      dfs(node.left, [...path]);
      dfs(node.right, [...path]);
    }
  }

  dfs(root, []);
  return result;
}

/**
 * Construct Binary Tree from Preorder and Inorder (LeetCode 105)
 * Time: O(n), Space: O(n)
 */
function buildTree(preorder, inorder) {
  if (preorder.length === 0) return null;

  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  const rootIndex = inorder.indexOf(rootVal);

  root.left = buildTree(
    preorder.slice(1, rootIndex + 1),
    inorder.slice(0, rootIndex)
  );

  root.right = buildTree(
    preorder.slice(rootIndex + 1),
    inorder.slice(rootIndex + 1)
  );

  return root;
}

/**
 * Validate Binary Search Tree (LeetCode 98)
 * Time: O(n), Space: O(h)
 */
function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;

    if (node.val <= min || node.val >= max) return false;

    return (
      validate(node.left, min, node.val) && validate(node.right, node.val, max)
    );
  }

  return validate(root, -Infinity, Infinity);
}

/**
 * Kth Smallest Element in BST (LeetCode 230)
 * Time: O(k), Space: O(h)
 */
function kthSmallest(root, k) {
  const stack = [];
  let current = root;
  let count = 0;

  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);
      current = current.left;
    }

    current = stack.pop();
    count++;

    if (count === k) return current.val;

    current = current.right;
  }

  return -1;
}

/**
 * Binary Tree Right Side View (LeetCode 199)
 * Time: O(n), Space: O(w)
 */
function rightSideView(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();

      if (i === levelSize - 1) {
        result.push(node.val);
      }

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return result;
}

/**
 * Serialize and Deserialize Binary Tree (LeetCode 297)
 * Time: O(n), Space: O(n)
 */
function serialize(root) {
  if (!root) return "null";

  return `${root.val},${serialize(root.left)},${serialize(root.right)}`;
}

function deserialize(data) {
  const values = data.split(",");
  let index = 0;

  function buildTree() {
    if (values[index] === "null") {
      index++;
      return null;
    }

    const node = new TreeNode(parseInt(values[index]));
    index++;

    node.left = buildTree();
    node.right = buildTree();

    return node;
  }

  return buildTree();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create tree from array (level order)
 */
function createTree(arr) {
  if (arr.length === 0 || arr[0] === null) return null;

  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();

    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;

    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

/**
 * Print tree in visual format
 */
function printTree(root, prefix = "", isLeft = true) {
  if (!root) return;

  console.log(prefix + (isLeft ? "├── " : "└── ") + root.val);

  if (root.left || root.right) {
    if (root.left) {
      printTree(root.left, prefix + (isLeft ? "│   " : "    "), true);
    }
    if (root.right) {
      printTree(root.right, prefix + (isLeft ? "│   " : "    "), false);
    }
  }
}

// ============================================
// TESTS
// ============================================

function runTests() {
  console.log("=== Binary Search Tree Tests ===");
  const bst = new BinarySearchTree();
  [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));

  console.log("Inorder:", inorderTraversal(bst.root)); // [20,30,40,50,60,70,80]
  console.log("Preorder:", preorderTraversal(bst.root)); // [50,30,20,40,70,60,80]
  console.log("Postorder:", postorderTraversal(bst.root)); // [20,40,30,60,80,70,50]
  console.log("Level Order:", levelOrder(bst.root));

  console.log("\n=== Tree Problems Tests ===");
  const tree = createTree([3, 9, 20, null, null, 15, 7]);
  console.log("Max Depth:", maxDepth(tree)); // 3
  console.log("Is Balanced:", isBalanced(tree)); // true

  const tree2 = createTree([1, 2, 2, 3, 4, 4, 3]);
  console.log("Is Symmetric:", isSymmetric(tree2)); // true

  console.log("\n=== Tree Visualization ===");
  printTree(bst.root);
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  TreeNode,
  BinarySearchTree,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelOrder,
  maxDepth,
  minDepth,
  invertTree,
  diameterOfBinaryTree,
  isBalanced,
  isSymmetric,
  isSameTree,
  isSubtree,
  lowestCommonAncestor,
  hasPathSum,
  binaryTreePaths,
  buildTree,
  isValidBST,
  kthSmallest,
  rightSideView,
  serialize,
  deserialize,
  createTree,
  printTree,
};




