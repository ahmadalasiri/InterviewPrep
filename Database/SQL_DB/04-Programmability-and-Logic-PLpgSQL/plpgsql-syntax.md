# PL/pgSQL Syntax and Logic

PL/pgSQL is the procedural language for PostgreSQL.

## Basic Structure
```sql
CREATE OR REPLACE FUNCTION calculate_bonus(emp_id INT) 
RETURNS NUMERIC AS $$
DECLARE
    salary NUMERIC;
    bonus NUMERIC;
BEGIN
    -- Logic here
    SELECT e.salary INTO salary FROM employees e WHERE e.id = emp_id;
    
    IF salary > 5000 THEN
        bonus := salary * 0.1;
    ELSE
        bonus := salary * 0.05;
    END IF;
    
    RETURN bonus;
END;
$$ LANGUAGE plpgsql;
```

## Variables and Control Flow
- `DECLARE`: Variable declarations.
- `IF ... THEN ... ELSE ... END IF`: Branching.
- `CASE ... WHEN ... END CASE`: Multiple conditions.
- `WHILE ... LOOP ... END LOOP`: Iteration.
- `FOR ... IN ... LOOP`: Iterating over ranges or query results.

## Senior Consideration
- PL/pgSQL runs on the server, reducing network round-trips.
- However, keep complex business logic in the application layer if possible for easier testing and scaling, unless performance requires it in the DB.

