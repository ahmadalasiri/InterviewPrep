# Index Types in PostgreSQL

Postgres offers more than just B-Trees.

## 1. B-Tree (Default)
- Best for: Equality and range queries.
- Most common index type.

## 2. GIN (Generalized Inverted Index)
- Best for: Array types, full-text search, and JSONB keys.
- `O(1)` for "contains" (`@>`) operations.

## 3. GiST (Generalized Search Tree)
- Best for: Geometric data, range types, and proximity searches.

## 4. BRIN (Block Range Index)
- Best for: Very large tables (billions of rows) where data is naturally sorted (e.g., timestamps).
- Extremely small on disk compared to B-Tree.

## 5. Hash Index
- Best for: Equality only (`=`).
- Note: B-Tree usually performs just as well and is more flexible.

## 6. Partial and Expression Indexes
- **Partial**: Index only a subset of rows (e.g., `WHERE status = 'active'`).
- **Expression**: Index the result of a function (e.g., `LOWER(email)`).

## Senior Consideration
- **Index-Only Scans**: When all requested columns are in the index, Postgres doesn't need to visit the main table (Heap).
- **Maintenance**: Indexes add overhead to `INSERT`/`UPDATE`/`DELETE`. Don't over-index.
- **Write Amplification**: Every new index increases the volume of WAL generated.

