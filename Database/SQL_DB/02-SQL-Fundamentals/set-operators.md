# Set Operators

Operators that combine results from two or more queries.

## 1. UNION & UNION ALL
- `UNION`: Combines results and removes duplicates (expensive).
- `UNION ALL`: Combines results and keeps duplicates (faster).

## 2. INTERSECT
- Returns only the rows that exist in both query results.

## 3. EXCEPT (MINUS in other DBs)
- Returns rows from the first query that do not exist in the second.

## Rules
- Number of columns must match.
- Data types of corresponding columns must be compatible.

## Senior Tip
Always prefer `UNION ALL` over `UNION` if you know there won't be duplicates or if you don't care about them, as it avoids a costly sort/de-duplicate step.

