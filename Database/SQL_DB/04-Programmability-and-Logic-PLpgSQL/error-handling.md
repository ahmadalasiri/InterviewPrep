# Error Handling in PL/pgSQL

Handling exceptions gracefully within the database.

## TRY...CATCH equivalent
```sql
BEGIN
    -- Dangerous operation
    INSERT INTO users (email) VALUES ('duplicate@example.com');
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'User already exists, skipping...';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An unexpected error occurred: %', SQLERRM;
END;
```

## RAISE Levels
- `DEBUG`, `LOG`, `INFO`, `NOTICE`, `WARNING`, `EXCEPTION`.
- `RAISE EXCEPTION` will roll back the current transaction.

## Senior Consideration
- Always log enough context in your exceptions.
- Be careful with `EXCEPTION WHEN OTHERS` as it can hide bugs if not handled properly.
- Use specific error codes (SQLSTATE) for precise control.

