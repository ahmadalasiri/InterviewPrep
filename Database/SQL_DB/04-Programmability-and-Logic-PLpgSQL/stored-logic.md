# Stored Procedures vs. Functions

PostgreSQL differentiates between Functions and Stored Procedures (added in Postgres 11).

## 1. Functions (`FUNCTION`)
- Must return a value.
- Cannot manage transactions (no `COMMIT`/`ROLLBACK` inside).
- Can be used in SQL expressions (`SELECT my_func()`).

## 2. Stored Procedures (`PROCEDURE`)
- Does not return a value (use `INOUT` parameters instead).
- **Can manage transactions**. This is their primary advantage.
```sql
CREATE PROCEDURE transfer_funds(from_id INT, to_id INT, amount NUMERIC)
AS $$
BEGIN
    UPDATE accounts SET balance = balance - amount WHERE id = from_id;
    UPDATE accounts SET balance = balance + amount WHERE id = to_id;
    COMMIT; -- Possible in Procedures!
END;
$$ LANGUAGE plpgsql;

-- To call:
CALL transfer_funds(1, 2, 100);
```

## Senior Consideration
- Use Procedures for batch processing and tasks requiring explicit transaction control.
- Use Functions for data transformation and logic that needs to be used within queries.

