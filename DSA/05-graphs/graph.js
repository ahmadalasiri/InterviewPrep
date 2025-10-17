/**
 * Graphs - JavaScript Implementation
 *
 * Topics covered:
 * - Graph representations
 * - DFS and BFS traversals
 * - Topological Sort
 * - Shortest paths
 * - Common graph problems
 */

// ============================================
// GRAPH IMPLEMENTATION
// ============================================

/**
 * Adjacency List Graph
 */
class Graph {
  constructor(isDirected = false) {
    this.adjacencyList = new Map();
    this.isDirected = isDirected;
  }

  // Add vertex
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  // Add edge
  addEdge(v1, v2, weight = 1) {
    this.addVertex(v1);
    this.addVertex(v2);

    this.adjacencyList.get(v1).push({ node: v2, weight });

    if (!this.isDirected) {
      this.adjacencyList.get(v2).push({ node: v1, weight });
    }
  }

  // Remove edge
  removeEdge(v1, v2) {
    if (this.adjacencyList.has(v1)) {
      this.adjacencyList.set(
        v1,
        this.adjacencyList.get(v1).filter((edge) => edge.node !== v2)
      );
    }

    if (!this.isDirected && this.adjacencyList.has(v2)) {
      this.adjacencyList.set(
        v2,
        this.adjacencyList.get(v2).filter((edge) => edge.node !== v1)
      );
    }
  }

  // Remove vertex
  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) return;

    // Remove all edges to this vertex
    for (let v of this.adjacencyList.keys()) {
      this.removeEdge(v, vertex);
    }

    this.adjacencyList.delete(vertex);
  }

  // Print graph
  print() {
    for (let [vertex, edges] of this.adjacencyList) {
      console.log(
        `${vertex} -> ${edges.map((e) => `${e.node}(${e.weight})`).join(", ")}`
      );
    }
  }
}

// ============================================
// GRAPH TRAVERSALS
// ============================================

/**
 * Depth First Search (DFS) - Recursive
 * Time: O(V + E), Space: O(V)
 */
function dfsRecursive(graph, start) {
  const visited = new Set();
  const result = [];

  function dfs(vertex) {
    visited.add(vertex);
    result.push(vertex);

    const neighbors = graph.adjacencyList.get(vertex) || [];
    for (let edge of neighbors) {
      if (!visited.has(edge.node)) {
        dfs(edge.node);
      }
    }
  }

  dfs(start);
  return result;
}

/**
 * Depth First Search (DFS) - Iterative
 * Time: O(V + E), Space: O(V)
 */
function dfsIterative(graph, start) {
  const visited = new Set();
  const result = [];
  const stack = [start];

  while (stack.length > 0) {
    const vertex = stack.pop();

    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);

      const neighbors = graph.adjacencyList.get(vertex) || [];
      for (let edge of neighbors) {
        if (!visited.has(edge.node)) {
          stack.push(edge.node);
        }
      }
    }
  }

  return result;
}

/**
 * Breadth First Search (BFS)
 * Time: O(V + E), Space: O(V)
 */
function bfs(graph, start) {
  const visited = new Set();
  const result = [];
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);

    const neighbors = graph.adjacencyList.get(vertex) || [];
    for (let edge of neighbors) {
      if (!visited.has(edge.node)) {
        visited.add(edge.node);
        queue.push(edge.node);
      }
    }
  }

  return result;
}

// ============================================
// COMMON PROBLEMS
// ============================================

/**
 * Number of Islands (LeetCode 200)
 * Time: O(m * n), Space: O(m * n)
 */
function numIslands(grid) {
  if (grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === "0") {
      return;
    }

    grid[r][c] = "0"; // Mark as visited

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

/**
 * Clone Graph (LeetCode 133)
 * Time: O(V + E), Space: O(V)
 */
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

/**
 * Course Schedule (LeetCode 207)
 * Detect cycle in directed graph
 * Time: O(V + E), Space: O(V)
 */
function canFinish(numCourses, prerequisites) {
  const graph = new Map();
  const visited = new Set();
  const recursionStack = new Set();

  // Build adjacency list
  for (let i = 0; i < numCourses; i++) {
    graph.set(i, []);
  }

  for (let [course, prereq] of prerequisites) {
    graph.get(course).push(prereq);
  }

  // Check for cycle using DFS
  function hasCycle(course) {
    if (recursionStack.has(course)) return true;
    if (visited.has(course)) return false;

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

/**
 * Course Schedule II (LeetCode 210)
 * Topological Sort using DFS
 * Time: O(V + E), Space: O(V)
 */
function findOrder(numCourses, prerequisites) {
  const graph = new Map();
  const visited = new Set();
  const recursionStack = new Set();
  const result = [];

  // Build adjacency list
  for (let i = 0; i < numCourses; i++) {
    graph.set(i, []);
  }

  for (let [course, prereq] of prerequisites) {
    graph.get(course).push(prereq);
  }

  // DFS with cycle detection
  function dfs(course) {
    if (recursionStack.has(course)) return false; // Cycle detected
    if (visited.has(course)) return true;

    visited.add(course);
    recursionStack.add(course);

    for (let prereq of graph.get(course)) {
      if (!dfs(prereq)) return false;
    }

    recursionStack.delete(course);
    result.push(course);
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return [];
  }

  return result;
}

/**
 * Pacific Atlantic Water Flow (LeetCode 417)
 * Time: O(m * n), Space: O(m * n)
 */
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

/**
 * Shortest Path in Binary Matrix (LeetCode 1091)
 * Time: O(n²), Space: O(n²)
 */
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;

  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) {
    return -1;
  }

  const queue = [[0, 0, 1]]; // [row, col, distance]
  grid[0][0] = 1; // Mark as visited

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();

    if (r === n - 1 && c === n - 1) {
      return dist;
    }

    for (let [dr, dc] of directions) {
      const newR = r + dr;
      const newC = c + dc;

      if (
        newR >= 0 &&
        newR < n &&
        newC >= 0 &&
        newC < n &&
        grid[newR][newC] === 0
      ) {
        queue.push([newR, newC, dist + 1]);
        grid[newR][newC] = 1; // Mark as visited
      }
    }
  }

  return -1;
}

/**
 * Word Ladder (LeetCode 127)
 * Time: O(M² * N) where M is word length, N is wordList size
 * Space: O(M * N)
 */
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

/**
 * Dijkstra's Algorithm - Shortest path with weights
 * Time: O((V + E) log V), Space: O(V)
 */
function dijkstra(graph, start) {
  const distances = new Map();
  const visited = new Set();
  const pq = [[0, start]]; // [distance, node]

  // Initialize distances
  for (let vertex of graph.adjacencyList.keys()) {
    distances.set(vertex, Infinity);
  }
  distances.set(start, 0);

  while (pq.length > 0) {
    // Get minimum distance node
    pq.sort((a, b) => a[0] - b[0]);
    const [currentDist, current] = pq.shift();

    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = graph.adjacencyList.get(current) || [];
    for (let edge of neighbors) {
      const newDist = currentDist + edge.weight;

      if (newDist < distances.get(edge.node)) {
        distances.set(edge.node, newDist);
        pq.push([newDist, edge.node]);
      }
    }
  }

  return distances;
}

/**
 * Bellman-Ford Algorithm - Shortest path with negative weights
 * Time: O(V * E), Space: O(V)
 */
function bellmanFord(graph, start) {
  const distances = new Map();

  // Initialize distances
  for (let vertex of graph.adjacencyList.keys()) {
    distances.set(vertex, Infinity);
  }
  distances.set(start, 0);

  const vertices = Array.from(graph.adjacencyList.keys());

  // Relax edges V-1 times
  for (let i = 0; i < vertices.length - 1; i++) {
    for (let vertex of vertices) {
      const neighbors = graph.adjacencyList.get(vertex) || [];

      for (let edge of neighbors) {
        const newDist = distances.get(vertex) + edge.weight;

        if (newDist < distances.get(edge.node)) {
          distances.set(edge.node, newDist);
        }
      }
    }
  }

  // Check for negative cycles
  for (let vertex of vertices) {
    const neighbors = graph.adjacencyList.get(vertex) || [];

    for (let edge of neighbors) {
      if (distances.get(vertex) + edge.weight < distances.get(edge.node)) {
        throw new Error("Graph contains negative cycle");
      }
    }
  }

  return distances;
}

// ============================================
// TESTS
// ============================================

function runTests() {
  console.log("=== Graph Tests ===");
  const graph = new Graph(false);

  graph.addEdge("A", "B");
  graph.addEdge("A", "C");
  graph.addEdge("B", "D");
  graph.addEdge("C", "D");
  graph.addEdge("D", "E");

  console.log("Graph structure:");
  graph.print();

  console.log("\nDFS (Recursive):", dfsRecursive(graph, "A"));
  console.log("DFS (Iterative):", dfsIterative(graph, "A"));
  console.log("BFS:", bfs(graph, "A"));

  console.log("\n=== Weighted Graph Tests ===");
  const weightedGraph = new Graph(true);
  weightedGraph.addEdge("A", "B", 4);
  weightedGraph.addEdge("A", "C", 2);
  weightedGraph.addEdge("C", "B", 1);
  weightedGraph.addEdge("C", "D", 5);
  weightedGraph.addEdge("B", "D", 1);

  console.log("Dijkstra from A:", dijkstra(weightedGraph, "A"));

  console.log("\n=== Problem Tests ===");
  const grid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];
  console.log("Number of Islands:", numIslands(grid)); // 3

  console.log("Can Finish Courses:", canFinish(2, [[1, 0]])); // true
  console.log(
    "Course Order:",
    findOrder(4, [
      [1, 0],
      [2, 0],
      [3, 1],
      [3, 2],
    ])
  );
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = {
  Graph,
  dfsRecursive,
  dfsIterative,
  bfs,
  numIslands,
  cloneGraph,
  canFinish,
  findOrder,
  pacificAtlantic,
  shortestPathBinaryMatrix,
  ladderLength,
  dijkstra,
  bellmanFord,
};
