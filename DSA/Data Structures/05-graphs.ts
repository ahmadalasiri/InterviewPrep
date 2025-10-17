/**
 * ============================================================================
 * GRAPHS - COMPREHENSIVE GUIDE
 * ============================================================================
 * 
 * WHAT IS A GRAPH?
 * ----------------
 * A graph is a non-linear data structure consisting of vertices (nodes) and
 * edges (connections between nodes). It's used to represent relationships
 * and networks.
 * 
 * GRAPH TERMINOLOGY:
 * - **Vertex (Node)**: A point in the graph
 * - **Edge**: Connection between two vertices
 * - **Adjacent**: Two vertices connected by an edge
 * - **Degree**: Number of edges connected to a vertex
 *   - In-degree: Edges coming into vertex (directed graph)
 *   - Out-degree: Edges going out from vertex (directed graph)
 * - **Path**: Sequence of vertices connected by edges
 * - **Cycle**: Path that starts and ends at the same vertex
 * - **Connected Graph**: Path exists between every pair of vertices
 * - **Weighted Graph**: Edges have weights/costs
 * 
 * TYPES OF GRAPHS:
 * 1. **Directed Graph (Digraph)**: Edges have direction (A → B)
 *    Example: Twitter followers, web pages
 * 
 * 2. **Undirected Graph**: Edges have no direction (A — B)
 *    Example: Facebook friends, road networks
 * 
 * 3. **Weighted Graph**: Edges have weights
 *    Example: Road networks (distances), network latency
 * 
 * 4. **Unweighted Graph**: All edges have equal weight
 * 
 * 5. **Cyclic Graph**: Contains at least one cycle
 * 
 * 6. **Acyclic Graph**: Contains no cycles
 *    - DAG (Directed Acyclic Graph): Used in task scheduling, dependency resolution
 * 
 * 7. **Complete Graph**: Every pair of vertices is connected
 * 
 * GRAPH REPRESENTATIONS:
 * 
 * 1. **Adjacency Matrix**: 2D array where matrix[i][j] = 1 if edge exists
 *    - Space: O(V²)
 *    - Edge lookup: O(1)
 *    - Add edge: O(1)
 *    - Remove edge: O(1)
 *    - Get all neighbors: O(V)
 *    - Good for: Dense graphs, frequent edge lookups
 * 
 * 2. **Adjacency List**: Array/Map of lists (most common)
 *    - Space: O(V + E)
 *    - Edge lookup: O(degree)
 *    - Add edge: O(1)
 *    - Remove edge: O(degree)
 *    - Get all neighbors: O(degree)
 *    - Good for: Sparse graphs, memory efficiency
 * 
 * 3. **Edge List**: List of all edges
 *    - Space: O(E)
 *    - Good for: Kruskal's MST algorithm
 * 
 * GRAPH TRAVERSAL ALGORITHMS:
 * 
 * 1. **Depth-First Search (DFS)**
 *    - Explores as far as possible along each branch
 *    - Uses stack (or recursion)
 *    - Time: O(V + E), Space: O(V)
 *    - Applications: Cycle detection, topological sort, pathfinding, maze solving
 * 
 * 2. **Breadth-First Search (BFS)**
 *    - Explores neighbors level by level
 *    - Uses queue
 *    - Time: O(V + E), Space: O(V)
 *    - Applications: Shortest path (unweighted), level order traversal
 * 
 * IMPORTANT GRAPH ALGORITHMS:
 * 
 * **Shortest Path:**
 * - Dijkstra's Algorithm: Non-negative weights, O((V + E) log V)
 * - Bellman-Ford: Handles negative weights, O(V·E)
 * - Floyd-Warshall: All pairs shortest path, O(V³)
 * - BFS: Unweighted graphs, O(V + E)
 * 
 * **Minimum Spanning Tree (MST):**
 * - Prim's Algorithm: O((V + E) log V) with heap
 * - Kruskal's Algorithm: O(E log E)
 * 
 * **Topological Sort:**
 * - DFS-based or Kahn's Algorithm: O(V + E)
 * - Only for DAGs (Directed Acyclic Graphs)
 * 
 * **Cycle Detection:**
 * - DFS with coloring: O(V + E)
 * - Union-Find: O(E · α(V)) where α is inverse Ackermann
 * 
 * **Connected Components:**
 * - DFS/BFS: O(V + E)
 * - Union-Find: O(E · α(V))
 * 
 * COMMON INTERVIEW PATTERNS:
 * 1. DFS traversal (recursive or iterative)
 * 2. BFS traversal (level by level)
 * 3. Cycle detection
 * 4. Topological sorting
 * 5. Shortest path algorithms
 * 6. Connected components
 * 7. Bipartite graph checking
 * 8. Graph coloring
 * 
 * COMMON INTERVIEW QUESTIONS:
 * 1. Number of Islands (DFS/BFS)
 * 2. Clone Graph
 * 3. Course Schedule (Topological Sort, Cycle Detection)
 * 4. Network Delay Time (Dijkstra)
 * 5. Word Ladder (BFS)
 * 6. Graph Valid Tree
 * 7. Minimum Spanning Tree
 * 8. Cheapest Flights Within K Stops
 * 9. Alien Dictionary (Topological Sort)
 * 10. Critical Connections in a Network (Bridges)
 * 11. Reconstruct Itinerary (Eulerian Path)
 * 12. Accounts Merge (Union-Find)
 * 
 * WHEN TO USE GRAPHS:
 * - Network modeling (social networks, computer networks)
 * - Route planning (GPS, delivery systems)
 * - Dependency resolution (build systems, package managers)
 * - Recommendation systems
 * - Game AI (pathfinding)
 * - Circuit design
 * 
 * ADVANTAGES:
 * + Represents complex relationships
 * + Efficient algorithms for many problems
 * + Flexible structure
 * 
 * DISADVANTAGES:
 * - Can be memory intensive
 * - Some algorithms are computationally expensive
 * - Complexity in implementation
 * 
 * ============================================================================
 */

// ============================================================================
// GRAPH REPRESENTATIONS
// ============================================================================

/**
 * Graph using Adjacency List
 */
class Graph {
  private adjacencyList: Map<number, number[]>;
  private isDirected: boolean;

  constructor(isDirected: boolean = false) {
    this.adjacencyList = new Map();
    this.isDirected = isDirected;
  }

  addVertex(vertex: number): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(from: number, to: number): void {
    this.addVertex(from);
    this.addVertex(to);
    
    this.adjacencyList.get(from)!.push(to);
    
    if (!this.isDirected) {
      this.adjacencyList.get(to)!.push(from);
    }
  }

  getNeighbors(vertex: number): number[] {
    return this.adjacencyList.get(vertex) || [];
  }

  getVertices(): number[] {
    return Array.from(this.adjacencyList.keys());
  }

  print(): void {
    for (const [vertex, neighbors] of this.adjacencyList) {
      console.log(`${vertex} -> ${neighbors.join(', ')}`);
    }
  }
}

/**
 * Weighted Graph
 */
class WeightedGraph {
  private adjacencyList: Map<number, [number, number][]>;
  private isDirected: boolean;

  constructor(isDirected: boolean = false) {
    this.adjacencyList = new Map();
    this.isDirected = isDirected;
  }

  addVertex(vertex: number): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(from: number, to: number, weight: number): void {
    this.addVertex(from);
    this.addVertex(to);
    
    this.adjacencyList.get(from)!.push([to, weight]);
    
    if (!this.isDirected) {
      this.adjacencyList.get(to)!.push([from, weight]);
    }
  }

  getNeighbors(vertex: number): [number, number][] {
    return this.adjacencyList.get(vertex) || [];
  }

  getVertices(): number[] {
    return Array.from(this.adjacencyList.keys());
  }
}

// ============================================================================
// GRAPH TRAVERSAL
// ============================================================================

class GraphTraversal {
  /**
   * Depth-First Search (DFS) - Recursive
   * Time: O(V + E), Space: O(V)
   */
  static dfsRecursive(graph: Graph, start: number): number[] {
    const visited = new Set<number>();
    const result: number[] = [];
    
    const dfs = (vertex: number) => {
      visited.add(vertex);
      result.push(vertex);
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    };
    
    dfs(start);
    return result;
  }

  /**
   * Depth-First Search (DFS) - Iterative
   * Time: O(V + E), Space: O(V)
   */
  static dfsIterative(graph: Graph, start: number): number[] {
    const visited = new Set<number>();
    const stack: number[] = [start];
    const result: number[] = [];
    
    while (stack.length > 0) {
      const vertex = stack.pop()!;
      
      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);
        
        const neighbors = graph.getNeighbors(vertex);
        for (let i = neighbors.length - 1; i >= 0; i--) {
          if (!visited.has(neighbors[i])) {
            stack.push(neighbors[i]);
          }
        }
      }
    }
    
    return result;
  }

  /**
   * Breadth-First Search (BFS)
   * Time: O(V + E), Space: O(V)
   */
  static bfs(graph: Graph, start: number): number[] {
    const visited = new Set<number>();
    const queue: number[] = [start];
    const result: number[] = [];
    
    visited.add(start);
    
    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex);
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }

  /**
   * BFS to find shortest path (unweighted graph)
   * Time: O(V + E), Space: O(V)
   */
  static shortestPath(graph: Graph, start: number, end: number): number[] {
    const visited = new Set<number>();
    const queue: [number, number[]][] = [[start, [start]]];
    visited.add(start);
    
    while (queue.length > 0) {
      const [vertex, path] = queue.shift()!;
      
      if (vertex === end) {
        return path;
      }
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
    
    return [];
  }

  /**
   * All paths from source to destination
   * Time: O(V!), Space: O(V)
   */
  static allPaths(graph: Graph, start: number, end: number): number[][] {
    const paths: number[][] = [];
    const visited = new Set<number>();
    
    const dfs = (vertex: number, path: number[]) => {
      if (vertex === end) {
        paths.push([...path]);
        return;
      }
      
      visited.add(vertex);
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path, neighbor]);
        }
      }
      
      visited.delete(vertex);
    };
    
    dfs(start, [start]);
    return paths;
  }
}

// ============================================================================
// CYCLE DETECTION
// ============================================================================

class CycleDetection {
  /**
   * Detect cycle in undirected graph using DFS
   * Time: O(V + E), Space: O(V)
   */
  static hasCycleUndirected(graph: Graph): boolean {
    const visited = new Set<number>();
    
    const dfs = (vertex: number, parent: number): boolean => {
      visited.add(vertex);
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, vertex)) {
            return true;
          }
        } else if (neighbor !== parent) {
          return true;
        }
      }
      
      return false;
    };
    
    for (const vertex of graph.getVertices()) {
      if (!visited.has(vertex)) {
        if (dfs(vertex, -1)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Detect cycle in directed graph using DFS
   * Time: O(V + E), Space: O(V)
   */
  static hasCycleDirected(graph: Graph): boolean {
    const visited = new Set<number>();
    const recStack = new Set<number>();
    
    const dfs = (vertex: number): boolean => {
      visited.add(vertex);
      recStack.add(vertex);
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) {
            return true;
          }
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }
      
      recStack.delete(vertex);
      return false;
    };
    
    for (const vertex of graph.getVertices()) {
      if (!visited.has(vertex)) {
        if (dfs(vertex)) {
          return true;
        }
      }
    }
    
    return false;
  }
}

// ============================================================================
// TOPOLOGICAL SORT
// ============================================================================

class TopologicalSort {
  /**
   * Topological Sort using DFS (Kahn's Algorithm)
   * Time: O(V + E), Space: O(V)
   */
  static kahnAlgorithm(graph: Graph): number[] {
    const vertices = graph.getVertices();
    const inDegree = new Map<number, number>();
    
    // Initialize in-degrees
    for (const vertex of vertices) {
      inDegree.set(vertex, 0);
    }
    
    // Calculate in-degrees
    for (const vertex of vertices) {
      for (const neighbor of graph.getNeighbors(vertex)) {
        inDegree.set(neighbor, inDegree.get(neighbor)! + 1);
      }
    }
    
    // Queue with vertices having 0 in-degree
    const queue: number[] = [];
    for (const [vertex, degree] of inDegree) {
      if (degree === 0) {
        queue.push(vertex);
      }
    }
    
    const result: number[] = [];
    
    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex);
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // Check for cycle
    return result.length === vertices.length ? result : [];
  }

  /**
   * Topological Sort using DFS
   * Time: O(V + E), Space: O(V)
   */
  static dfsTopologicalSort(graph: Graph): number[] {
    const visited = new Set<number>();
    const stack: number[] = [];
    
    const dfs = (vertex: number) => {
      visited.add(vertex);
      
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
      
      stack.push(vertex);
    };
    
    for (const vertex of graph.getVertices()) {
      if (!visited.has(vertex)) {
        dfs(vertex);
      }
    }
    
    return stack.reverse();
  }
}

// ============================================================================
// SHORTEST PATH ALGORITHMS
// ============================================================================

class ShortestPath {
  /**
   * Dijkstra's Algorithm for shortest path
   * Time: O((V + E) log V), Space: O(V)
   */
  static dijkstra(graph: WeightedGraph, start: number): Map<number, number> {
    const distances = new Map<number, number>();
    const visited = new Set<number>();
    const pq: [number, number][] = []; // [distance, vertex]
    
    // Initialize distances
    for (const vertex of graph.getVertices()) {
      distances.set(vertex, Infinity);
    }
    distances.set(start, 0);
    pq.push([0, start]);
    
    while (pq.length > 0) {
      // Get vertex with minimum distance
      pq.sort((a, b) => a[0] - b[0]);
      const [currentDist, vertex] = pq.shift()!;
      
      if (visited.has(vertex)) continue;
      visited.add(vertex);
      
      for (const [neighbor, weight] of graph.getNeighbors(vertex)) {
        const newDist = currentDist + weight;
        
        if (newDist < distances.get(neighbor)!) {
          distances.set(neighbor, newDist);
          pq.push([newDist, neighbor]);
        }
      }
    }
    
    return distances;
  }

  /**
   * Bellman-Ford Algorithm (handles negative weights)
   * Time: O(VE), Space: O(V)
   */
  static bellmanFord(
    graph: WeightedGraph,
    start: number
  ): Map<number, number> | null {
    const distances = new Map<number, number>();
    const vertices = graph.getVertices();
    
    // Initialize distances
    for (const vertex of vertices) {
      distances.set(vertex, Infinity);
    }
    distances.set(start, 0);
    
    // Relax edges V-1 times
    for (let i = 0; i < vertices.length - 1; i++) {
      for (const vertex of vertices) {
        if (distances.get(vertex) === Infinity) continue;
        
        for (const [neighbor, weight] of graph.getNeighbors(vertex)) {
          const newDist = distances.get(vertex)! + weight;
          if (newDist < distances.get(neighbor)!) {
            distances.set(neighbor, newDist);
          }
        }
      }
    }
    
    // Check for negative cycles
    for (const vertex of vertices) {
      if (distances.get(vertex) === Infinity) continue;
      
      for (const [neighbor, weight] of graph.getNeighbors(vertex)) {
        if (distances.get(vertex)! + weight < distances.get(neighbor)!) {
          return null; // Negative cycle detected
        }
      }
    }
    
    return distances;
  }
}

// ============================================================================
// CONNECTED COMPONENTS
// ============================================================================

class ConnectedComponents {
  /**
   * Find number of connected components
   * Time: O(V + E), Space: O(V)
   */
  static countComponents(graph: Graph): number {
    const visited = new Set<number>();
    let count = 0;
    
    const dfs = (vertex: number) => {
      visited.add(vertex);
      for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    };
    
    for (const vertex of graph.getVertices()) {
      if (!visited.has(vertex)) {
        dfs(vertex);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Union-Find (Disjoint Set Union)
   */
  static class UnionFind {
    private parent: Map<number, number>;
    private rank: Map<number, number>;

    constructor(vertices: number[]) {
      this.parent = new Map();
      this.rank = new Map();
      
      for (const vertex of vertices) {
        this.parent.set(vertex, vertex);
        this.rank.set(vertex, 0);
      }
    }

    find(x: number): number {
      if (this.parent.get(x) !== x) {
        this.parent.set(x, this.find(this.parent.get(x)!));
      }
      return this.parent.get(x)!;
    }

    union(x: number, y: number): boolean {
      const rootX = this.find(x);
      const rootY = this.find(y);
      
      if (rootX === rootY) return false;
      
      const rankX = this.rank.get(rootX)!;
      const rankY = this.rank.get(rootY)!;
      
      if (rankX < rankY) {
        this.parent.set(rootX, rootY);
      } else if (rankX > rankY) {
        this.parent.set(rootY, rootX);
      } else {
        this.parent.set(rootY, rootX);
        this.rank.set(rootX, rankX + 1);
      }
      
      return true;
    }

    isConnected(x: number, y: number): boolean {
      return this.find(x) === this.find(y);
    }
  }
}

// ============================================================================
// TESTING
// ============================================================================

console.log('=== Graph Creation ===');
const graph = new Graph(false);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 3);
graph.addEdge(3, 4);
console.log('Graph:');
graph.print();

console.log('\n=== Graph Traversal ===');
console.log('DFS Recursive:', GraphTraversal.dfsRecursive(graph, 0));
console.log('DFS Iterative:', GraphTraversal.dfsIterative(graph, 0));
console.log('BFS:', GraphTraversal.bfs(graph, 0));
console.log('Shortest Path 0->4:', GraphTraversal.shortestPath(graph, 0, 4));

console.log('\n=== Directed Graph ===');
const directedGraph = new Graph(true);
directedGraph.addEdge(0, 1);
directedGraph.addEdge(1, 2);
directedGraph.addEdge(2, 3);
directedGraph.addEdge(3, 4);
console.log('Topological Sort:', TopologicalSort.kahnAlgorithm(directedGraph));

console.log('\n=== Weighted Graph (Dijkstra) ===');
const weightedGraph = new WeightedGraph(false);
weightedGraph.addEdge(0, 1, 4);
weightedGraph.addEdge(0, 2, 1);
weightedGraph.addEdge(2, 1, 2);
weightedGraph.addEdge(1, 3, 1);
weightedGraph.addEdge(2, 3, 5);
const distances = ShortestPath.dijkstra(weightedGraph, 0);
console.log('Shortest distances from 0:', Object.fromEntries(distances));

console.log('\n=== Connected Components ===');
console.log('Component Count:', ConnectedComponents.countComponents(graph));

export {
  Graph,
  WeightedGraph,
  GraphTraversal,
  CycleDetection,
  TopologicalSort,
  ShortestPath,
  ConnectedComponents
};

