# 07 - Transactions and Concurrency

Ensuring data integrity and handling simultaneous access by multiple users.

## Topics
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability.
- **Isolation Levels**: Read Uncommitted, Read Committed, Repeatable Read, Serializable, Snapshot.
- **Locking & Blocking**: Shared, Exclusive, Update, Intent locks. Deadlocks.
- **Optimistic vs. Pessimistic Concurrency**: When to use each approach.
- **Multi-Version Concurrency Control (MVCC)**: How modern databases handle concurrency without locking.

## Senior Engineer Considerations
- Impact of isolation levels on application correctness and performance.
- Strategies for minimizing deadlocks and long-running transactions.
- Handling distributed transactions and the Two-Phase Commit (2PC) protocol.

