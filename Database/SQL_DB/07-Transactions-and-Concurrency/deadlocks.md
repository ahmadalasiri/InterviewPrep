# Deadlocks

When two transactions wait on each other indefinitely.

## The Scenario
1.  Transaction A locks Row 1.
2.  Transaction B locks Row 2.
3.  Transaction A tries to lock Row 2 (waits for B).
4.  Transaction B tries to lock Row 1 (waits for A).
**Deadlock!**

## How Postgres Handles It
- Postgres has a background **Deadlock Detector**.
- If it detects a cycle, it will automatically kill one of the transactions (the "victim") and roll it back.

## How to Prevent Deadlocks
- **Consistent Order**: Always access tables and rows in the same order across your application code.
- **Short Transactions**: Keep the time between the first lock and `COMMIT` as short as possible.
- **Lower Isolation**: Sometimes lower isolation levels or better indexing can reduce lock duration.

## Senior Tip
Deadlocks are often a sign of application design issues. If they happen frequently, log the deadlock details from Postgres logs and trace the sequence of SQL statements in both transactions.

