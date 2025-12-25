# Replication in PostgreSQL

Scaling reads and ensuring high availability.

## 1. Physical Replication (Streaming)
- Copies the entire database instance at the byte level (via WAL).
- **Primary**: Handles reads and writes.
- **Standby (Replica)**: Handles reads only.
- Best for: Disaster Recovery and Read Scaling.

## 2. Logical Replication
- Replicated specific tables or databases by streaming data changes.
- **Publication**: On the source.
- **Subscription**: On the target.
- Best for: Data migration with minimal downtime, cross-version replication, and consolidated reporting.

## 3. Synchronous vs. Asynchronous
- **Asynchronous (Default)**: Primary doesn't wait for standby. Minimal impact on write latency, but small risk of data loss.
- **Synchronous**: Primary waits for confirmation from standby. Zero data loss, but higher write latency.

## Senior Consideration
- **Replication Lag**: The delay between a write on the primary and its appearance on the standby. Monitor `pg_stat_replication`.
- **Slot Management**: Use **Replication Slots** to ensure the primary doesn't delete WAL files until all standbys have received them. (Warning: If a standby goes down, slots can cause the primary's disk to fill up).
- **Failover**: Postgres doesn't have built-in automatic failover. Use tools like **Patroni** or **repmgr**.

