# PostgreSQL Constraints

Constraints are the "guards" of your data integrity at the database level.

## Common Constraints in Postgres

### 1. NOT NULL
Ensures a column cannot have a NULL value.
```sql
CREATE TABLE users (
    username TEXT NOT NULL
);
```

### 2. UNIQUE
Ensures all values in a column (or a group of columns) are different.
```sql
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

### 3. PRIMARY KEY
Uniquely identifies each row. It is a combination of `NOT NULL` and `UNIQUE`.
```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY
);
```

### 4. FOREIGN KEY
Ensures referential integrity between two tables.
```sql
CREATE TABLE orders (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 5. CHECK
Ensures that all values in a column satisfy a specific condition.
```sql
ALTER TABLE users ADD CONSTRAINT check_age CHECK (age >= 18);
```

## Advanced: Exclusion Constraints
Postgres specific. Used to prevent overlapping data (e.g., booking the same room for overlapping times).
```sql
CREATE TABLE room_reservations (
    room_id INT,
    booking_period TSRANGE,
    EXCLUDE USING GIST (room_id WITH =, booking_period WITH &&)
);
```

