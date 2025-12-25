# VACUUM and MVCC

Managing concurrency and disk space in PostgreSQL.

## 1. MVCC (Multi-Version Concurrency Control)
- Instead of locking rows for updates, Postgres creates a **new version** of the row.
- Each row has a `xmin` (created by) and `xmax` (deleted by) transaction ID.
- Readers don't block writers, and writers don't block readers.

## 2. The Problem: Dead Tuples
- After an `UPDATE` or `DELETE`, the old version of the row remains on disk. It's now a "dead tuple".

## 3. The Solution: VACUUM
- **Standard VACUUM**: Reclaims the space occupied by dead tuples so it can be reused by the same table. It does *not* return space to the OS.
- **VACUUM FULL**: Compacts the table and returns space to the OS. **Warning**: This locks the table entirely.
- **Autovacuum**: A background daemon that automatically runs VACUUM when the number of dead tuples exceeds a threshold.

## Senior Consideration
- **Transaction ID Wraparound**: A critical state where Postgres runs out of transaction IDs. VACUUM is required to prevent this by "freezing" old tuples.
- **Visibility Map**: A bit map that tells Postgres which pages contain only all-visible tuples, allowing it to skip them during VACUUM and speed up Index-Only scans.

