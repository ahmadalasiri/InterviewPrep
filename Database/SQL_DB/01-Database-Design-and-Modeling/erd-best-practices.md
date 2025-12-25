# ERD Best Practices

Entity-Relationship Diagrams (ERDs) are the visual representation of your database schema.

## Core Components
- **Entities**: Objects or concepts (e.g., User, Product).
- **Attributes**: Properties of entities (e.g., user_id, email).
- **Relationships**: How entities interact (1:1, 1:N, M:N).

## Best Practices for Senior Engineers
1.  **Naming Conventions**: Use consistent, descriptive names. (e.g., `user_id` instead of just `id` in large joins).
2.  **Explicit Relationships**: Always define Foreign Key constraints. Don't rely on "soft" relationships in the application layer.
3.  **Indexes from the Start**: Mark columns that will be frequently searched or joined as candidates for indexing during the design phase.
4.  **Handling Many-to-Many**: Always use a join table (junction table) with its own primary key or a composite key.
5.  **NULL vs. NOT NULL**: Be explicit about nullability. `NOT NULL` is usually safer and more performant unless the data is truly optional.

## Tools
- `draw.io` / `Lucidchart`
- `dbdiagram.io` (Great for DSL-based modeling)
- `pgAdmin` / `DBeaver` ERD viewers

