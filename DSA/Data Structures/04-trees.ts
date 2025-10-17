/**
 * ============================================================================
 * TREES - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS A TREE?
 * ---------------
 * A tree is a hierarchical data structure consisting of nodes connected by edges.
 * It's a non-linear structure where each node can have multiple children, but
 * only one parent (except the root, which has no parent).
 *
 * TREE TERMINOLOGY:
 * - **Root**: Topmost node (no parent)
 * - **Parent**: Node with children
 * - **Child**: Node connected below another node
 * - **Leaf**: Node with no children
 * - **Siblings**: Nodes with the same parent
 * - **Ancestor**: All nodes on path from root to a node
 * - **Descendant**: All nodes below a node
 * - **Height**: Longest path from node to a leaf
 * - **Depth/Level**: Distance from root to node
 * - **Subtree**: Tree formed by a node and its descendants
 *
 * BINARY TREE:
 * ------------
 * A tree where each node has at most TWO children (left and right).
 *
 * TYPES OF BINARY TREES:
 * 1. **Full Binary Tree**: Every node has 0 or 2 children
 * 2. **Complete Binary Tree**: All levels filled except possibly last, filled left to right
 * 3. **Perfect Binary Tree**: All internal nodes have 2 children, all leaves at same level
 * 4. **Balanced Binary Tree**: Height difference between left and right subtrees ≤ 1
 * 5. **Degenerate Tree**: Each node has only one child (like a linked list)
 *
 * BINARY SEARCH TREE (BST):
 * -------------------------
 * A binary tree with the property:
 * - All values in LEFT subtree < node value
 * - All values in RIGHT subtree > node value
 * - This property holds for ALL nodes
 *
 * TIME COMPLEXITIES:
 * Binary Tree:
 * - Search: O(n) - must check all nodes
 * - Insert: O(n)
 * - Delete: O(n)
 * - Traversal: O(n)
 *
 * Binary Search Tree (Balanced):
 * - Search: O(log n) average, O(n) worst (skewed tree)
 * - Insert: O(log n) average, O(n) worst
 * - Delete: O(log n) average, O(n) worst
 * - Space: O(h) for recursion stack, where h is height
 *
 * TREE TRAVERSAL METHODS:
 * 1. **Inorder (Left, Root, Right)**: Gives sorted order in BST
 * 2. **Preorder (Root, Left, Right)**: Copy tree structure
 * 3. **Postorder (Left, Right, Root)**: Delete tree, evaluate expressions
 * 4. **Level Order (BFS)**: Level by level traversal
 *
 * COMMON INTERVIEW PATTERNS:
 * 1. DFS traversals (inorder, preorder, postorder)
 * 2. BFS / Level order traversal
 * 3. Recursion (most tree problems)
 * 4. Divide and conquer
 * 5. Top-down vs Bottom-up approach
 *
 * COMMON INTERVIEW QUESTIONS:
 * 1. Maximum/Minimum Depth of Binary Tree
 * 2. Validate Binary Search Tree
 * 3. Lowest Common Ancestor (LCA)
 * 4. Binary Tree Level Order Traversal
 * 5. Invert/Mirror Binary Tree
 * 6. Symmetric Tree
 * 7. Diameter of Binary Tree
 * 8. Path Sum / Path Sum II
 * 9. Serialize and Deserialize Binary Tree
 * 10. Construct Tree from Traversals (Inorder + Preorder/Postorder)
 * 11. Kth Smallest Element in BST
 * 12. Binary Tree Maximum Path Sum
 * 13. Flatten Binary Tree to Linked List
 * 14. Count Complete Tree Nodes
 *
 * WHEN TO USE TREES:
 * - Hierarchical data (file system, organization chart)
 * - Fast search, insert, delete (BST)
 * - Sorted data storage (BST)
 * - Expression parsing
 * - Routing algorithms
 *
 * ADVANTAGES:
 * + Hierarchical structure
 * + O(log n) operations in balanced BST
 * + Sorted data in BST
 * + Flexible size
 *
 * DISADVANTAGES:
 * - Can degrade to O(n) if unbalanced
 * - More complex than linear structures
 * - Extra memory for pointers
 *
 * SPECIAL TREES:
 * - AVL Tree: Self-balancing BST (strict balancing)
 * - Red-Black Tree: Self-balancing BST (relaxed balancing)
 * - B-Tree: Multi-way tree (databases)
 * - Trie: Prefix tree (string problems)
 * - Segment Tree: Range queries
 * - Fenwick Tree (Binary Indexed Tree): Prefix sums
 *
 * ============================================================================
 */

// ============================================================================
// TREE NODE DEFINITIONS
// ============================================================================

class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class NaryTreeNode<T> {
  value: T;
  children: NaryTreeNode<T>[];

  constructor(value: T) {
    this.value = value;
    this.children = [];
  }
}

// ============================================================================
// BINARY SEARCH TREE
// ============================================================================

class BinarySearchTree {
  root: TreeNode<number> | null = null;

  /**
   * Insert value into BST
   * Time: O(log n) average, O(n) worst
   */
  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(
    node: TreeNode<number> | null,
    value: number
  ): TreeNode<number> {
    if (!node) {
      return new TreeNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  /**
   * Search for value in BST
   * Time: O(log n) average, O(n) worst
   */
  search(value: number): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode<number> | null, value: number): boolean {
    if (!node) return false;
    if (node.value === value) return true;

    return value < node.value
      ? this.searchNode(node.left, value)
      : this.searchNode(node.right, value);
  }

  /**
   * Delete value from BST
   * Time: O(log n) average, O(n) worst
   */
  delete(value: number): void {
    this.root = this.deleteNode(this.root, value);
  }

  private deleteNode(
    node: TreeNode<number> | null,
    value: number
  ): TreeNode<number> | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Node to delete found
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node has two children: find inorder successor
      const minRight = this.findMin(node.right);
      node.value = minRight.value;
      node.right = this.deleteNode(node.right, minRight.value);
    }

    return node;
  }

  private findMin(node: TreeNode<number>): TreeNode<number> {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}

// ============================================================================
// TREE TRAVERSAL
// ============================================================================

class TreeTraversal {
  /**
   * Inorder: Left -> Root -> Right (sorted for BST)
   * Time: O(n), Space: O(h) where h is height
   */
  static inorder<T>(root: TreeNode<T> | null): T[] {
    const result: T[] = [];

    const traverse = (node: TreeNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };

    traverse(root);
    return result;
  }

  /**
   * Preorder: Root -> Left -> Right
   */
  static preorder<T>(root: TreeNode<T> | null): T[] {
    const result: T[] = [];

    const traverse = (node: TreeNode<T> | null) => {
      if (!node) return;
      result.push(node.value);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(root);
    return result;
  }

  /**
   * Postorder: Left -> Right -> Root
   */
  static postorder<T>(root: TreeNode<T> | null): T[] {
    const result: T[] = [];

    const traverse = (node: TreeNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node.value);
    };

    traverse(root);
    return result;
  }

  /**
   * Level Order (BFS): Level by level
   * Time: O(n), Space: O(w) where w is max width
   */
  static levelOrder<T>(root: TreeNode<T> | null): T[][] {
    if (!root) return [];

    const result: T[][] = [];
    const queue: TreeNode<T>[] = [root];

    while (queue.length > 0) {
      const levelSize = queue.length;
      const level: T[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        level.push(node.value);

        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }

      result.push(level);
    }

    return result;
  }

  /**
   * Iterative Inorder using stack
   */
  static inorderIterative<T>(root: TreeNode<T> | null): T[] {
    const result: T[] = [];
    const stack: TreeNode<T>[] = [];
    let current = root;

    while (current || stack.length > 0) {
      while (current) {
        stack.push(current);
        current = current.left;
      }

      current = stack.pop()!;
      result.push(current.value);
      current = current.right;
    }

    return result;
  }

  /**
   * Zigzag Level Order
   * Time: O(n), Space: O(w)
   */
  static zigzagLevelOrder<T>(root: TreeNode<T> | null): T[][] {
    if (!root) return [];

    const result: T[][] = [];
    const queue: TreeNode<T>[] = [root];
    let leftToRight = true;

    while (queue.length > 0) {
      const levelSize = queue.length;
      const level: T[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;

        if (leftToRight) {
          level.push(node.value);
        } else {
          level.unshift(node.value);
        }

        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }

      result.push(level);
      leftToRight = !leftToRight;
    }

    return result;
  }

  /**
   * Vertical Order Traversal
   */
  static verticalOrder<T>(root: TreeNode<T> | null): T[][] {
    if (!root) return [];

    const columnMap = new Map<number, T[]>();
    const queue: [TreeNode<T>, number][] = [[root, 0]];
    let minCol = 0;
    let maxCol = 0;

    while (queue.length > 0) {
      const [node, col] = queue.shift()!;

      if (!columnMap.has(col)) {
        columnMap.set(col, []);
      }
      columnMap.get(col)!.push(node.value);

      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);

      if (node.left) queue.push([node.left, col - 1]);
      if (node.right) queue.push([node.right, col + 1]);
    }

    const result: T[][] = [];
    for (let col = minCol; col <= maxCol; col++) {
      result.push(columnMap.get(col)!);
    }

    return result;
  }
}

// ============================================================================
// TREE ALGORITHMS
// ============================================================================

class TreeAlgorithms {
  /**
   * Maximum depth of binary tree
   * Time: O(n), Space: O(h)
   */
  static maxDepth<T>(root: TreeNode<T> | null): number {
    if (!root) return 0;
    return 1 + Math.max(this.maxDepth(root.left), this.maxDepth(root.right));
  }

  /**
   * Minimum depth of binary tree
   */
  static minDepth<T>(root: TreeNode<T> | null): number {
    if (!root) return 0;
    if (!root.left) return 1 + this.minDepth(root.right);
    if (!root.right) return 1 + this.minDepth(root.left);

    return 1 + Math.min(this.minDepth(root.left), this.minDepth(root.right));
  }

  /**
   * Check if tree is balanced
   * Time: O(n), Space: O(h)
   */
  static isBalanced<T>(root: TreeNode<T> | null): boolean {
    const checkHeight = (node: TreeNode<T> | null): number => {
      if (!node) return 0;

      const leftHeight = checkHeight(node.left);
      if (leftHeight === -1) return -1;

      const rightHeight = checkHeight(node.right);
      if (rightHeight === -1) return -1;

      if (Math.abs(leftHeight - rightHeight) > 1) return -1;

      return 1 + Math.max(leftHeight, rightHeight);
    };

    return checkHeight(root) !== -1;
  }

  /**
   * Check if tree is symmetric
   * Time: O(n), Space: O(h)
   */
  static isSymmetric<T>(root: TreeNode<T> | null): boolean {
    const isMirror = (
      t1: TreeNode<T> | null,
      t2: TreeNode<T> | null
    ): boolean => {
      if (!t1 && !t2) return true;
      if (!t1 || !t2) return false;

      return (
        t1.value === t2.value &&
        isMirror(t1.left, t2.right) &&
        isMirror(t1.right, t2.left)
      );
    };

    return !root || isMirror(root.left, root.right);
  }

  /**
   * Diameter of binary tree (longest path)
   * Time: O(n), Space: O(h)
   */
  static diameter<T>(root: TreeNode<T> | null): number {
    let maxDiameter = 0;

    const height = (node: TreeNode<T> | null): number => {
      if (!node) return 0;

      const leftHeight = height(node.left);
      const rightHeight = height(node.right);

      maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);

      return 1 + Math.max(leftHeight, rightHeight);
    };

    height(root);
    return maxDiameter;
  }

  /**
   * Lowest Common Ancestor (LCA)
   * Time: O(n), Space: O(h)
   */
  static lowestCommonAncestor<T>(
    root: TreeNode<T> | null,
    p: TreeNode<T>,
    q: TreeNode<T>
  ): TreeNode<T> | null {
    if (!root || root === p || root === q) return root;

    const left = this.lowestCommonAncestor(root.left, p, q);
    const right = this.lowestCommonAncestor(root.right, p, q);

    if (left && right) return root;
    return left || right;
  }

  /**
   * Path sum - check if root-to-leaf path with target sum exists
   * Time: O(n), Space: O(h)
   */
  static hasPathSum(root: TreeNode<number> | null, targetSum: number): boolean {
    if (!root) return false;

    if (!root.left && !root.right) {
      return root.value === targetSum;
    }

    return (
      this.hasPathSum(root.left, targetSum - root.value) ||
      this.hasPathSum(root.right, targetSum - root.value)
    );
  }

  /**
   * All root-to-leaf paths
   * Time: O(n), Space: O(h)
   */
  static allPaths<T>(root: TreeNode<T> | null): T[][] {
    const paths: T[][] = [];

    const dfs = (node: TreeNode<T> | null, path: T[]) => {
      if (!node) return;

      path.push(node.value);

      if (!node.left && !node.right) {
        paths.push([...path]);
      } else {
        dfs(node.left, path);
        dfs(node.right, path);
      }

      path.pop();
    };

    dfs(root, []);
    return paths;
  }

  /**
   * Flatten binary tree to linked list (in-place)
   * Time: O(n), Space: O(1)
   */
  static flatten<T>(root: TreeNode<T> | null): void {
    let prev: TreeNode<T> | null = null;

    const flattenTree = (node: TreeNode<T> | null) => {
      if (!node) return;

      flattenTree(node.right);
      flattenTree(node.left);

      node.right = prev;
      node.left = null;
      prev = node;
    };

    flattenTree(root);
  }

  /**
   * Validate Binary Search Tree
   * Time: O(n), Space: O(h)
   */
  static isValidBST(
    root: TreeNode<number> | null,
    min: number = -Infinity,
    max: number = Infinity
  ): boolean {
    if (!root) return true;

    if (root.value <= min || root.value >= max) return false;

    return (
      this.isValidBST(root.left, min, root.value) &&
      this.isValidBST(root.right, root.value, max)
    );
  }

  /**
   * Kth smallest element in BST
   * Time: O(h + k), Space: O(h)
   */
  static kthSmallest(root: TreeNode<number> | null, k: number): number {
    let count = 0;
    let result = -1;

    const inorder = (node: TreeNode<number> | null) => {
      if (!node || count >= k) return;

      inorder(node.left);

      count++;
      if (count === k) {
        result = node.value;
        return;
      }

      inorder(node.right);
    };

    inorder(root);
    return result;
  }

  /**
   * Serialize and Deserialize Binary Tree
   */
  static serialize<T>(root: TreeNode<T> | null): string {
    const values: (T | null)[] = [];

    const preorder = (node: TreeNode<T> | null) => {
      if (!node) {
        values.push(null);
        return;
      }

      values.push(node.value);
      preorder(node.left);
      preorder(node.right);
    };

    preorder(root);
    return JSON.stringify(values);
  }

  static deserialize<T>(data: string): TreeNode<T> | null {
    const values: (T | null)[] = JSON.parse(data);
    let index = 0;

    const buildTree = (): TreeNode<T> | null => {
      if (index >= values.length || values[index] === null) {
        index++;
        return null;
      }

      const node = new TreeNode(values[index]!);
      index++;
      node.left = buildTree();
      node.right = buildTree();

      return node;
    };

    return buildTree();
  }

  /**
   * Construct Binary Tree from Inorder and Preorder
   * Time: O(n), Space: O(n)
   */
  static buildTreeFromTraversal(
    preorder: number[],
    inorder: number[]
  ): TreeNode<number> | null {
    const inorderMap = new Map<number, number>();
    inorder.forEach((val, idx) => inorderMap.set(val, idx));

    let preorderIdx = 0;

    const build = (left: number, right: number): TreeNode<number> | null => {
      if (left > right) return null;

      const rootVal = preorder[preorderIdx++];
      const root = new TreeNode(rootVal);

      const inorderIdx = inorderMap.get(rootVal)!;
      root.left = build(left, inorderIdx - 1);
      root.right = build(inorderIdx + 1, right);

      return root;
    };

    return build(0, inorder.length - 1);
  }

  /**
   * Count complete tree nodes
   * Time: O((log n)²), Space: O(log n)
   */
  static countNodes<T>(root: TreeNode<T> | null): number {
    if (!root) return 0;

    const getHeight = (node: TreeNode<T> | null): number => {
      let height = 0;
      while (node) {
        height++;
        node = node.left;
      }
      return height;
    };

    const leftHeight = getHeight(root.left);
    const rightHeight = getHeight(root.right);

    if (leftHeight === rightHeight) {
      // Left subtree is perfect
      return (1 << leftHeight) + this.countNodes(root.right);
    } else {
      // Right subtree is perfect
      return (1 << rightHeight) + this.countNodes(root.left);
    }
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log("=== Binary Search Tree ===");
const bst = new BinarySearchTree();
[5, 3, 7, 2, 4, 6, 8].forEach((val) => bst.insert(val));
console.log("Search 4:", bst.search(4));
console.log("Search 9:", bst.search(9));

console.log("\n=== Tree Traversal ===");
console.log("Inorder:", TreeTraversal.inorder(bst.root));
console.log("Preorder:", TreeTraversal.preorder(bst.root));
console.log("Postorder:", TreeTraversal.postorder(bst.root));
console.log("Level Order:", TreeTraversal.levelOrder(bst.root));

console.log("\n=== Tree Algorithms ===");
console.log("Max Depth:", TreeAlgorithms.maxDepth(bst.root));
console.log("Is Balanced:", TreeAlgorithms.isBalanced(bst.root));
console.log("Is Valid BST:", TreeAlgorithms.isValidBST(bst.root));
console.log("Diameter:", TreeAlgorithms.diameter(bst.root));
console.log("Kth Smallest (k=3):", TreeAlgorithms.kthSmallest(bst.root, 3));
console.log("All Paths:", TreeAlgorithms.allPaths(bst.root));

console.log("\n=== Serialize/Deserialize ===");
const serialized = TreeAlgorithms.serialize(bst.root);
console.log("Serialized:", serialized);
const deserialized = TreeAlgorithms.deserialize(serialized);
console.log("Deserialized Inorder:", TreeTraversal.inorder(deserialized));

export {
  TreeNode,
  NaryTreeNode,
  BinarySearchTree,
  TreeTraversal,
  TreeAlgorithms,
};
