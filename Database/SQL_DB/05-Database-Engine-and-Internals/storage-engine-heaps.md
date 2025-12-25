# Storage Engine and Heaps

How PostgreSQL stores your data physically on disk.

## 1. Pages and Blocks
- Data is stored in **Pages** (default size: 8 KB).
- A table is a collection of these pages, often called a **Heap**.
- Each page contains a header, pointers to the rows (line pointers), and the actual row data (tuples).

## 2. TOAST (The Oversized-Attribute Storage Technique)
- Since pages are 8KB, what happens to large columns (like a long `TEXT` or `JSONB`)?
- Postgres uses **TOAST** to store large values in a separate side table, keeping the main table page small and efficient.

## 3. The Buffer Cache
- Postgres uses a `shared_buffers` pool in RAM to cache pages.
- When you read a row, the whole 8KB page is brought into memory.

## Senior Consideration
- **Bloat**: Since Postgres uses MVCC, deleted rows are not immediately removed from disk (they are marked as "dead tuples"). This leads to table bloat.
- **Alignment Padding**: The order of columns in a table can affect the physical size due to CPU alignment requirements. (e.g., placing `INT` before `SMALLINT` can save a few bytes per row).

