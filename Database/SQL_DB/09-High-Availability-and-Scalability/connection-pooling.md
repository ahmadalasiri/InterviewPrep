# Connection Pooling

Managing database connections efficiently.

## The Problem
Postgres creates a new process for every connection. Creating and destroying processes is expensive and consumes memory.

## The Solution: Connection Poolers
A pooler maintains a "pool" of open connections to the database and shares them among many application clients.

## Popular Tools
1.  **PgBouncer**:
    - Very lightweight.
    - **Session Pooling**: Connection stays with client until disconnect.
    - **Transaction Pooling**: Connection is returned to pool after every transaction. (Best for high scale).
2.  **pgagroal**: High-performance connection pooler.

## Senior Consideration
- **Transaction Pooling Limits**: You cannot use session-based features like `SET`, `PREPARE`, or `Advisory Locks` reliably with transaction pooling.
- **Max Connections**: Tune `max_connections` in Postgres based on your RAM and CPU, and use a pooler to handle the overflow.
- **Load Balancing**: Use poolers in combination with HA proxies to distribute read traffic to replicas.

