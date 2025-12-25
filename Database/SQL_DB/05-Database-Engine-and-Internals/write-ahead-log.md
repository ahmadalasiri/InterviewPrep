# Write-Ahead Log (WAL)

Ensuring data durability and performance.

## The Problem
Writing every data change to the main table on disk immediately would be extremely slow due to random I/O.

## The Solution: WAL
1.  Any change is first recorded in the **Write-Ahead Log** (sequentially).
2.  The change is then applied to the page in memory (the page becomes "dirty").
3.  The change is acknowledged to the user (Fast!).
4.  Later, a background process (**Checkpointer**) flushes dirty pages from memory to the main table on disk.

## Why WAL?
- **Crash Recovery**: If the database crashes, Postgres replays the WAL to restore consistency.
- **Replication**: WAL files are sent to standby servers to keep them in sync.

## Senior Consideration
- **Full Page Writes**: To prevent data corruption from partial page writes (e.g., during a crash), Postgres writes the entire page to WAL the first time it's modified after a checkpoint.
- **Archiving**: WAL files can be archived for Point-In-Time Recovery (PITR).

