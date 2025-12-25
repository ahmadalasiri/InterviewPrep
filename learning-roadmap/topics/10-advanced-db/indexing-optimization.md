# 🚀 Indexing & Query Optimization

Deep dive into how databases store and retrieve data efficiently.

## 📑 Topics to Master

- [ ] **Data Structures for Indexing**
  - **B-Trees / B+ Trees**: Why they are used for most relational databases.
  - **LSM-Trees (Log-Structured Merge-Trees)**: Used in write-heavy NoSQL (Cassandra, RocksDB).
  - **Hash Indexes**: O(1) lookups but no range queries.
- [ ] **Index Types**
  - Clustered vs. Non-Clustered Indexes.
  - Composite Indexes (Leftmost prefix rule).
  - Partial Indexes and Expression Indexes.
- [ ] **Query Execution**
  - Reading Explain Plans.
  - Index Scans vs. Index Seeks.
  - Joins: Nested Loop, Hash Join, Merge Join.
- [ ] **Statistics & Maintenance**
  - Why stale statistics kill performance.
  - Index fragmentation and rebuilding.

