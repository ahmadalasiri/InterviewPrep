# Backup and Restore in PostgreSQL

Ensuring you can recover from disaster.

## 1. Logical Backups (`pg_dump`)
- Dumps the database into a SQL file or a custom archive.
- Best for: Small to medium databases, upgrading between major versions.
- `pg_dump dbname > backup.sql`

## 2. Physical Backups (`pg_basebackup`)
- Copies the actual data files (pages/blocks).
- Best for: Large databases, setting up replication.
- Faster to restore than logical backups.

## 3. Continuous Archiving (WAL Archiving)
- Combines a base backup with a stream of WAL files.
- **PITR (Point-In-Time Recovery)**: Allows you to restore the database to any specific second in the past.

## Senior Consideration
- **RPO (Recovery Point Objective)**: How much data can you afford to lose? (Minimized by WAL archiving).
- **RTO (Recovery Time Objective)**: How fast can you get back online? (Physical backups are faster).
- **Backup Validation**: A backup is only good if you've tested restoring it. Automate restore tests.

