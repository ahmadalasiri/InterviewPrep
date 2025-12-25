# Isolation Levels in PostgreSQL

How transactions see each other's data changes.

## 1. Read Committed (Default)
- A statement sees only rows committed before the **statement** began.
- **Phenomena**: Non-repeatable reads and Phantoms can occur.

## 2. Repeatable Read
- A statement sees only rows committed before the **transaction** began.
- **Postgres Special**: Unlike other DBs, Postgres's Repeatable Read also prevents **Phantom Reads**.
- **Serialization Error**: If two transactions try to update the same row, one will fail with a serialization error and must be retried.

## 3. Serializable
- The strictest level. Guarantees that the result is the same as if transactions ran one after another.
- Prevents **Serialization Anomalies** (e.g., Write Skew).

## Summary Table
| Level | Dirty Read | Non-repeatable Read | Phantom Read | Serialization Anomaly |
| :--- | :--- | :--- | :--- | :--- |
| Read Committed | No | Possible | Possible | Possible |
| Repeatable Read | No | No | No | Possible |
| Serializable | No | No | No | No |

## Senior Consideration
- **Retry Logic**: When using `Repeatable Read` or `Serializable`, your application **must** be prepared to catch serialization errors and retry the transaction.
- **Snapshot Isolation**: Postgres's implementation of Repeatable Read is actually Snapshot Isolation.
- **Performance**: Higher isolation levels increase the chance of transaction failures and overhead.

