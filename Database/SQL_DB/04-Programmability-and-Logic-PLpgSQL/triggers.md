# Triggers in PostgreSQL

Triggers are functions that automatically execute when a specific event occurs.

## Event Types
- `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`.

## Timing
- `BEFORE`: Execute before the data change (good for validation/normalization).
- `AFTER`: Execute after the data change (good for logging/auditing).
- `INSTEAD OF`: Used primarily on Views to make them updatable.

## Example: Audit Trigger
```sql
CREATE FUNCTION log_change() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, action, changed_at)
    VALUES (TG_TABLE_NAME, TG_OP, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_audit
AFTER UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION log_change();
```

## Senior Consideration
- **Hidden Logic**: Triggers can make debugging very difficult because they happen "magically" behind the scenes.
- **Performance**: Row-level triggers can significantly slow down bulk operations.
- **Infinite Loops**: Be careful not to trigger another event that triggers the same trigger.

