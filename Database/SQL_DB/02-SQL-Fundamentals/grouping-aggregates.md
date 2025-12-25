# Grouping and Aggregates

Analyzing data by combining multiple rows into a single result.

## Basic Aggregates
- `COUNT(*)`: Total rows.
- `SUM(col)`: Total sum.
- `AVG(col)`: Average.
- `MIN(col)` / `MAX(col)`: Bounds.

## GROUP BY and HAVING
`HAVING` is like `WHERE` but for groups.
```sql
SELECT department, AVG(salary)
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000;
```

## Advanced: GROUPING SETS, ROLLUP, and CUBE
Postgres supports advanced grouping for reporting.
- **ROLLUP**: Generates hierarchical subtotals.
- **CUBE**: Generates subtotals for every combination of columns.
```sql
SELECT region, product, SUM(sales)
FROM sales_data
GROUP BY ROLLUP (region, product);
```

## Performance Note
Aggregates on large tables can be slow. Use **Indexed Views (Materialized Views)** or **Summary Tables** for frequent high-volume aggregations.

