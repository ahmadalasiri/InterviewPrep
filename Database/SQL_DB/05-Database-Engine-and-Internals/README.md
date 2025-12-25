# 05 - Database Engine and Internals

Understanding how the database works under the hood to write better queries and designs.

## Topics
- **[Storage Engine and Heaps](./storage-engine-heaps.md)**: Physical storage, Pages, and TOAST.
- **[Write-Ahead Log (WAL)](./write-ahead-log.md)**: Durability, Performance, and Recovery.
- **[VACUUM and MVCC](./vacuum-mvcc.md)**: Concurrency management and disk space reclamation.

## Senior Engineer Considerations
- Impact of MVCC on storage (Bloat).
- Tuning `shared_buffers` and `max_wal_size`.
- Preventing Transaction ID Wraparound.
