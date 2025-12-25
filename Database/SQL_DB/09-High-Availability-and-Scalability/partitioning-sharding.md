# Partitioning and Sharding

Scaling large datasets.

## 1. Declarative Partitioning (Horizontal)
- Dividing one large table into smaller physical tables (partitions) based on a key.
- **Range Partitioning**: e.g., by month or year.
- **List Partitioning**: e.g., by country or status.
- **Hash Partitioning**: e.g., by `user_id % N`.
```sql
CREATE TABLE orders (id int, order_date date) PARTITION BY RANGE (order_date);
```

## 2. Sharding (Horizontal Scaling across Nodes)
- Distributing data across multiple independent database servers.
- Not natively built into core Postgres, but achieved via extensions like **Citus** or application-level logic.

## 3. Vertical Partitioning
- Moving frequently accessed columns to one table and rarely accessed columns to another.

## Senior Consideration
- **Partition Pruning**: The optimizer skips partitions that don't match the `WHERE` clause. This is the main performance benefit.
- **Maintenance**: It's much faster to drop an old partition (`DROP TABLE`) than to delete millions of rows (`DELETE FROM`).
- **Global Constraints**: Creating unique indexes across all partitions is challenging in some versions of Postgres.

