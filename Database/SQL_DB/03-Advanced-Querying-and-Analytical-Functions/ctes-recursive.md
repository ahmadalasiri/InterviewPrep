# CTEs and Recursive Queries

Common Table Expressions (CTEs) provide a way to write modular, readable queries.

## 1. Basic CTE
```sql
WITH regional_sales AS (
    SELECT region, SUM(amount) AS total_sales
    FROM orders
    GROUP BY region
)
SELECT * FROM regional_sales WHERE total_sales > 10000;
```

## 2. Recursive CTE
Used for hierarchical data (org charts, folder structures, graphs).
```sql
WITH RECURSIVE subordinates AS (
    -- Anchor member
    SELECT id, name, manager_id
    FROM employees
    WHERE id = 1  -- Start with the CEO
    
    UNION ALL
    
    -- Recursive member
    SELECT e.id, e.name, e.manager_id
    FROM employees e
    INNER JOIN subordinates s ON s.id = e.manager_id
)
SELECT * FROM subordinates;
```

## Senior Consideration
- In PostgreSQL 12+, CTEs are not always materialization boundaries by default. You can use `WITH ... AS MATERIALIZED` to force materialization if needed for performance.
- Recursive CTEs must have a termination condition to avoid infinite loops.

