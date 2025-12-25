# UPSERT and MERGE

Handling data synchronization efficiently.

## 1. INSERT ... ON CONFLICT (UPSERT)
The native Postgres way to handle duplicates.
```sql
INSERT INTO users (id, email, last_login)
VALUES (1, 'user@example.com', NOW())
ON CONFLICT (id) 
DO UPDATE SET last_login = EXCLUDED.last_login;
```

## 2. MERGE (Postgres 15+)
Standard SQL syntax for synchronizing two tables.
```sql
MERGE INTO target_table t
USING source_table s
ON t.id = s.id
WHEN MATCHED THEN
    UPDATE SET val = s.val
WHEN NOT MATCHED THEN
    INSERT (id, val) VALUES (s.id, s.val);
```

## Senior Consideration
- `ON CONFLICT` is often faster for single-row updates and has better handling of concurrency edge cases.
- `MERGE` is better for complex multi-table synchronization logic and is more portable across DB systems.
- Always ensure you have a unique index on the conflict target.

