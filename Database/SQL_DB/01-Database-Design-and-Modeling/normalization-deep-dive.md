# Normalization Deep Dive

Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.

## Normal Forms (NF)

### 1. First Normal Form (1NF)
- Each column must contain only atomic values.
- No repeating groups or arrays in a single column.
- Each row must be uniquely identifiable (Primary Key).

### 2. Second Normal Form (2NF)
- Must be in 1NF.
- All non-key attributes must be fully functionally dependent on the entire Primary Key.
- No partial dependencies (where an attribute depends only on part of a composite key).

### 3. Third Normal Form (3NF)
- Must be in 2NF.
- No transitive dependencies (where a non-key attribute depends on another non-key attribute).

### 4. Boyce-Codd Normal Form (BCNF)
- A stronger version of 3NF.
- For every functional dependency (X → Y), X must be a superkey.

## Denormalization: When to do it?
Normalization is great for data integrity (OLTP), but sometimes you denormalize for:
- **Performance**: Reducing joins in complex queries.
- **Reporting (OLAP)**: Star schemas and Snowflake schemas are often denormalized for faster aggregation.

## PostgreSQL Implementation Note
PostgreSQL supports complex types like `JSONB` and `Arrays`. While these technically violate 1NF in the strictest sense, they are powerful tools for specific use cases where a semi-structured approach is more efficient than a purely normalized one.

