# Locking Mechanisms

How PostgreSQL handles resource contention.

## 1. Row-Level Locks
- `FOR UPDATE`: Locks rows as if they were being updated (prevents others from locking or modifying them).
- `FOR SHARE`: Allows others to read/share lock, but not modify.
- Note: Row-level locks do not block readers (thanks to MVCC).

## 2. Table-Level Locks
- `ACCESS SHARE`: Acquired by simple `SELECT`. Conflicts with `ACCESS EXCLUSIVE`.
- `ROW SHARE` / `ROW EXCLUSIVE`: Acquired by `UPDATE`/`DELETE`.
- `ACCESS EXCLUSIVE`: The strongest lock. Acquired by `ALTER TABLE`, `DROP TABLE`, `VACUUM FULL`. Blocks everything.

## 3. Advisory Locks
- Application-defined locks. Useful for coordinating tasks across multiple app instances (e.g., ensuring a background job only runs once).
```sql
SELECT pg_advisory_lock(123);
-- ... do work ...
SELECT pg_advisory_unlock(123);
```

## Senior Consideration
- **Lock Contention**: Monitor `pg_locks` and `pg_stat_activity` to find blocked processes.
- **Skip Locked**: Use `SELECT ... FOR UPDATE SKIP LOCKED` for high-concurrency queue processing to avoid waiting on locked rows.
- **Lock Timeout**: Always set a `lock_timeout` in your application to prevent a single migration or query from hanging the entire system.

