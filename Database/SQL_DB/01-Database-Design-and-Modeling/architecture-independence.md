# Database Architecture and Independence

Understanding the levels of abstraction in a database system.

## The Three-Schema Architecture (ANSI/SPARC)

1.  **External Level (View Schema)**:
    - Describes how individual users or applications see the data.
    - Multiple views can exist for different stakeholders.

2.  **Conceptual Level (Logical Schema)**:
    - Describes what data is stored and the relationships between them.
    - This is the "blueprint" of the entire database.

3.  **Internal Level (Physical Schema)**:
    - Describes how the data is actually stored on disk (B-Trees, Heaps, Indexing).
    - Managed by the DBMS (PostgreSQL).

## Data Independence
- **Logical Data Independence**: The ability to change the conceptual schema without changing the external views or application code.
- **Physical Data Independence**: The ability to change the physical storage structures (e.g., moving from HDD to SSD, changing an index type) without changing the conceptual or external levels.

## PostgreSQL Mapping
In Postgres, this is achieved through:
- **Schemas**: Namespaces for organizing tables.
- **Views**: Providing external abstractions.
- **Table Spaces**: Controlling physical storage locations.

