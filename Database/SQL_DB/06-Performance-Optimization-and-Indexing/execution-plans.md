# Execution Plans

Reading the roadmap of your query.

## How to use
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM users WHERE id = 5;
```

## Key Indicators
- **Seq Scan**: A full table scan. Usually bad for large tables.
- **Index Scan**: Using an index to find specific rows.
- **Index Only Scan**: Using only the index (no Heap access).
- **Bitmap Index Scan**: A middle ground for multiple matches.
- **Cost**: An arbitrary unit of work estimated by the optimizer.
- **Actual Time**: The real time taken (only with `ANALYZE`).

## Senior Insight: BUFFERS
Always use `BUFFERS` with `EXPLAIN ANALYZE`. It shows how many pages were read from memory (`shared_buffers`) vs. disk. 
- High `shared read` means the data wasn't in cache.
- High `shared hit` means it was cached.

