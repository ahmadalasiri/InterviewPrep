# Views and Materialized Views

Abstractions for complex queries.

## 1. Standard Views
- A virtual table representing the result of a `SELECT` query.
- Does not store data physically.
- Best for: Simplifying complex joins, security (limiting column access).
```sql
CREATE VIEW user_order_summary AS
SELECT u.username, COUNT(o.id) as total_orders
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.username;
```

## 2. Materialized Views
- Stores the result of a query physically.
- Needs to be refreshed to get updated data.
- Best for: Expensive analytical queries that don't need real-time data.
```sql
CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT sale_date, SUM(amount)
FROM sales
GROUP BY sale_date;

-- Refreshing the data
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
```

## Senior Consideration
- **CONCURRENTLY**: Use this during refresh to allow users to continue reading from the view (requires a unique index on the materialized view).
- **Security**: Views can be used to implement row-level security or hide sensitive columns.

