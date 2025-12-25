# Maintenance Plans

Keeping your PostgreSQL instance healthy.

## 1. Statistics (`ANALYZE`)
- The optimizer needs to know how many rows are in a table and how data is distributed.
- `ANALYZE table_name;`

## 2. Reclaiming Space (`VACUUM`)
- Reclaims space from dead tuples. Usually handled by **Autovacuum**.
- Monitor bloat using tools like `pgstattuple`.

## 3. Index Maintenance (`REINDEX`)
- Indexes can also get bloated or corrupted.
- `REINDEX INDEX CONCURRENTLY idx_name;` (Postgres 12+).

## 4. Integrity Checks (`amcheck`)
- Use the `amcheck` extension to verify the logical consistency of your B-Tree indexes.

## Senior Consideration
- **Autovacuum Tuning**: On high-write tables, the default autovacuum settings might be too slow. Tune `autovacuum_vacuum_scale_factor` and `autovacuum_cost_limit`.
- **Bloat Management**: Excessive bloat causes Seq Scans to slow down because they have to read through many empty pages.

