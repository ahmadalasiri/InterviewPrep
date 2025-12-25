# Query Tuning Strategies

Practical steps to fix slow queries.

## 1. Identify Slow Queries
- Enable `pg_stat_statements` extension to track query statistics.
- Monitor long-running queries via `pg_stat_activity`.

## 2. Common Bottlenecks
- **Missing Indexes**: Check for Seq Scans on large tables.
- **Stale Statistics**: Run `ANALYZE` (or let Autovacuum do it) so the optimizer has accurate info.
- **SARGability**: Avoid functions on columns in `WHERE` clauses (e.g., use `col >= '2023-01-01'` instead of `YEAR(col) = 2023`).
- **Join Order**: Sometimes the optimizer gets it wrong. Check if joining in a different order or using CTEs helps.

## 3. Configuration Tuning
- `work_mem`: Memory for sorts and joins.
- `random_page_cost`: Tell the optimizer how fast your disks are (lower for SSDs).

## Senior Tip
- **Parameter Sniffing**: Be aware that the optimizer might choose a plan based on a specific parameter value that is inefficient for others.
- **Benchmarking**: Always test performance changes in a production-like environment with realistic data volume.

