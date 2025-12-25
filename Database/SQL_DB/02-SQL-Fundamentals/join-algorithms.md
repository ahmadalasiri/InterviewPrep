# Join Algorithms in PostgreSQL

While you write `JOIN`, the Postgres engine chooses an algorithm to execute it.

## 1. Nested Loop Join
- For each row in the outer table, it scans the inner table.
- Best for: Small tables or when the inner table has an index on the join key.
- `O(N * M)` without index, `O(N * log M)` with index.

## 2. Hash Join
- It builds a hash table in memory for the smaller table and then scans the larger table.
- Best for: Large tables with no indexes, and equality joins (`=`).
- `O(N + M)` time, but requires `O(smaller table)` memory.

## 3. Merge Join
- Both tables are sorted on the join key, and then merged.
- Best for: Large tables that are already sorted (e.g., via a B-Tree index) or for range joins.
- `O(N log N + M log M)` due to sorting.

## How to check?
Use `EXPLAIN` or `EXPLAIN ANALYZE`:
```sql
EXPLAIN SELECT * FROM users u JOIN orders o ON u.id = o.user_id;
```

## Senior Insight
- If you see a "Nested Loop" on two large tables, you likely have a missing index.
- If you see "Hash Join" spilling to disk (External Merge), you might need to increase `work_mem`.

