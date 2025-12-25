# 09 - High Availability and Scalability

Strategies for ensuring the database is always available and can grow with demand.

## Topics
- **Mirroring & Always On Availability Groups**: Synchronous vs. asynchronous replication.
- **Replication**: Snapshot, Transactional, and Merge replication.
- **Log Shipping**: Simple HA solution using transaction log backups.
- **Partitioning**: Horizontal partitioning (sharding) and vertical partitioning.
- **Failover Clustering**: Instance-level high availability.

## Senior Engineer Considerations
- CAP Theorem and its implications for distributed databases.
- Load balancing read traffic vs. write traffic.
- Designing for high availability in cloud environments (e.g., AWS RDS, Azure SQL).
- Handling schema migrations in high-availability environments.

