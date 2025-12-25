# Window Functions

Performing calculations across a set of table rows that are somehow related to the current row.

## Key Syntax
`FUNCTION() OVER (PARTITION BY col ORDER BY col)`

## 1. Ranking Functions
- `ROW_NUMBER()`: Unique number for each row.
- `RANK()`: Number with gaps for ties.
- `DENSE_RANK()`: Number without gaps for ties.

## 2. Value Functions
- `LAG(col, offset)`: Value from a previous row.
- `LEAD(col, offset)`: Value from a following row.
- `FIRST_VALUE()` / `LAST_VALUE()`: Bound values in the window.

## Example: Cumulative Sum
```sql
SELECT 
    sale_date, 
    amount,
    SUM(amount) OVER (ORDER BY sale_date) as running_total
FROM sales;
```

## Senior Consideration
- Window functions are processed *after* `WHERE`, `GROUP BY`, and `HAVING`.
- They are often more performant than self-joins for analytical tasks.
- Avoid large partitions in memory-constrained environments.

