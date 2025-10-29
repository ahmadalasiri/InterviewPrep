# PostgreSQL Schema Design & Database Design Questions

## Database Design Fundamentals

### Q1: What are the key principles of PostgreSQL database design?

**Answer:**
PostgreSQL database design follows these key principles:

1. **Normalization** - Organize data to reduce redundancy and improve data integrity
2. **ACID Compliance** - Ensure Atomicity, Consistency, Isolation, and Durability
3. **Referential Integrity** - Use foreign keys to maintain relationships
4. **Appropriate Data Types** - Choose the right data types for optimal storage and performance
5. **Indexing Strategy** - Create indexes based on query patterns
6. **Constraints** - Use constraints to enforce data validity
7. **Naming Conventions** - Consistent and meaningful names for tables, columns, and constraints

### Q2: Explain the concept of normalization and its different forms.

**Answer:**

**First Normal Form (1NF):**

- Each column contains atomic (indivisible) values
- Each column contains values of a single type
- Each column has a unique name
- Order doesn't matter

```sql
-- Violates 1NF - multiple values in one column
CREATE TABLE orders_bad (
  id SERIAL PRIMARY KEY,
  customer VARCHAR(100),
  products VARCHAR(500) -- 'Laptop, Mouse, Keyboard'
);

-- Conforms to 1NF
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer VARCHAR(100)
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product VARCHAR(100)
);
```

**Second Normal Form (2NF):**

- Must be in 1NF
- All non-key columns are fully dependent on the primary key
- No partial dependencies

```sql
-- Violates 2NF - course_name depends only on course_id, not on (student_id, course_id)
CREATE TABLE enrollments_bad (
  student_id INTEGER,
  course_id INTEGER,
  course_name VARCHAR(100), -- Partial dependency
  grade CHAR(2),
  PRIMARY KEY (student_id, course_id)
);

-- Conforms to 2NF
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE enrollments (
  student_id INTEGER REFERENCES students(id),
  course_id INTEGER REFERENCES courses(id),
  grade CHAR(2),
  PRIMARY KEY (student_id, course_id)
);
```

**Third Normal Form (3NF):**

- Must be in 2NF
- No transitive dependencies (non-key columns don't depend on other non-key columns)

```sql
-- Violates 3NF - city and state depend on zip_code
CREATE TABLE customers_bad (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  zip_code VARCHAR(10),
  city VARCHAR(50), -- Transitive dependency
  state VARCHAR(2)  -- Transitive dependency
);

-- Conforms to 3NF
CREATE TABLE zip_codes (
  zip_code VARCHAR(10) PRIMARY KEY,
  city VARCHAR(50),
  state VARCHAR(2)
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  zip_code VARCHAR(10) REFERENCES zip_codes(zip_code)
);
```

**Boyce-Codd Normal Form (BCNF):**

- Stricter version of 3NF
- Every determinant must be a candidate key

**Fourth Normal Form (4NF):**

- Must be in BCNF
- No multi-valued dependencies

**Fifth Normal Form (5NF):**

- Must be in 4NF
- No join dependencies

**Practical Note:** Most applications aim for 3NF as a balance between normalization and performance.

### Q3: When should you denormalize a PostgreSQL database?

**Answer:**

**Denormalize when:**

1. **Read-Heavy Workloads:**

```sql
-- Normalized (requires JOIN)
SELECT o.id, o.order_date, c.name, c.email
FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- Denormalized (no JOIN needed)
CREATE TABLE orders_denormalized (
  id SERIAL PRIMARY KEY,
  order_date TIMESTAMP,
  customer_id INTEGER,
  customer_name VARCHAR(100), -- Denormalized
  customer_email VARCHAR(100) -- Denormalized
);
```

2. **Reporting and Analytics:**

```sql
-- Denormalized reporting table
CREATE TABLE sales_summary (
  id SERIAL PRIMARY KEY,
  date DATE,
  product_id INTEGER,
  product_name VARCHAR(100), -- Denormalized
  category_name VARCHAR(50), -- Denormalized
  total_quantity INTEGER,
  total_revenue DECIMAL(10, 2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Caching Computed Values:**

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10, 2),
  -- Denormalized computed fields
  reviews_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0
);

-- Update with triggers
CREATE OR REPLACE FUNCTION update_product_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id),
    average_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_stats();
```

4. **Materialized Views:**

```sql
-- Denormalized view for complex queries
CREATE MATERIALIZED VIEW order_summary AS
SELECT
  o.id,
  o.order_date,
  c.name AS customer_name,
  c.email AS customer_email,
  SUM(oi.quantity * oi.unit_price) AS total_amount,
  COUNT(oi.id) AS item_count
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_date, c.name, c.email;

-- Refresh periodically
REFRESH MATERIALIZED VIEW order_summary;
```

**Trade-offs:**

- Improved read performance
- Increased storage requirements
- Complexity in maintaining data consistency
- Potential for data anomalies

## One-to-Many Relationships

### Q4: How do you implement one-to-many relationships in PostgreSQL?

**Answer:**

**Standard Approach - Foreign Key:**

```sql
-- Parent table
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  bio TEXT
);

-- Child table with foreign key
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author_id INTEGER NOT NULL,
  published_date DATE,
  isbn VARCHAR(13) UNIQUE,
  CONSTRAINT fk_author
    FOREIGN KEY (author_id)
    REFERENCES authors(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Index on foreign key for query performance
CREATE INDEX idx_books_author_id ON books(author_id);

-- Query
SELECT
  a.name,
  b.title,
  b.published_date
FROM authors a
JOIN books b ON a.id = b.author_id
WHERE a.name = 'John Doe';
```

**With Additional Constraints:**

```sql
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INTEGER NOT NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary DECIMAL(10, 2) CHECK (salary > 0),
  CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE RESTRICT -- Prevent deletion if employees exist
);
```

**ON DELETE Options:**

- `CASCADE` - Automatically delete child records
- `SET NULL` - Set foreign key to NULL
- `SET DEFAULT` - Set foreign key to default value
- `RESTRICT` - Prevent deletion if child records exist
- `NO ACTION` - Similar to RESTRICT

## Many-to-Many Relationships

### Q5: How do you implement many-to-many relationships in PostgreSQL?

**Answer:**

**Junction Table (Association Table):**

```sql
-- First entity
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE
);

-- Second entity
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  credits INTEGER CHECK (credits > 0)
);

-- Junction table
CREATE TABLE enrollments (
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  enrolled_date DATE DEFAULT CURRENT_DATE,
  grade CHAR(2),
  PRIMARY KEY (student_id, course_id),
  CONSTRAINT fk_student
    FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_course
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE
);

-- Indexes for both directions of queries
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- Query: Find all courses for a student
SELECT c.code, c.name, e.grade
FROM courses c
JOIN enrollments e ON c.id = e.course_id
WHERE e.student_id = 1;

-- Query: Find all students in a course
SELECT s.name, s.email, e.grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
WHERE e.course_id = 101;
```

**With Additional Metadata:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_members (
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, project_id),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_project
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_role ON project_members(role);
```

## One-to-One Relationships

### Q6: How do you implement one-to-one relationships in PostgreSQL?

**Answer:**

**Approach 1: Separate Tables with Unique Foreign Key:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL, -- UNIQUE enforces one-to-one
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  date_of_birth DATE,
  bio TEXT,
  avatar_url VARCHAR(255),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Alternative: Make user_id the primary key
CREATE TABLE user_profiles_alt (
  user_id INTEGER PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  date_of_birth DATE,
  bio TEXT,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
```

**Approach 2: Single Table (when data is always present):**

```sql
CREATE TABLE users_combined (
  id SERIAL PRIMARY KEY,
  -- Authentication fields
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  -- Profile fields
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  date_of_birth DATE,
  bio TEXT,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**When to use separate tables:**

- Optional relationship (not all users have profiles)
- Different access patterns
- Security concerns (separate sensitive data)
- Large optional data (keeps main table smaller)

## Data Types and Constraints

### Q7: How do you choose appropriate data types in PostgreSQL?

**Answer:**

**Numeric Types:**

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY, -- Auto-incrementing integer
  sku VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,

  -- Use DECIMAL/NUMERIC for money (exact precision)
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),

  -- Use INTEGER for whole numbers
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),

  -- Use BIGINT for large numbers
  views_count BIGINT DEFAULT 0,

  -- Use REAL/DOUBLE PRECISION for scientific calculations
  weight_kg REAL,

  is_active BOOLEAN DEFAULT true
);
```

**String Types:**

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,

  -- VARCHAR(n) for limited length strings
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,

  -- TEXT for unlimited length
  content TEXT NOT NULL,
  summary TEXT,

  -- CHAR(n) for fixed-length (padded with spaces)
  country_code CHAR(2), -- 'US', 'UK'

  -- Consider ENUM for predefined values
  status VARCHAR(20) CHECK (status IN ('draft', 'published', 'archived'))
);

-- Or use custom ENUM type
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE articles_with_enum (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  status article_status DEFAULT 'draft'
);
```

**Date and Time Types:**

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),

  -- DATE for dates without time
  event_date DATE,

  -- TIME for time without date
  start_time TIME,

  -- TIMESTAMP for date and time (no timezone)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- TIMESTAMPTZ (recommended) for date and time with timezone
  scheduled_at TIMESTAMPTZ NOT NULL,

  -- INTERVAL for time differences
  duration INTERVAL
);

-- Example usage
INSERT INTO events (name, event_date, start_time, scheduled_at, duration)
VALUES (
  'Conference',
  '2024-06-15',
  '09:00:00',
  '2024-06-15 09:00:00-05',
  INTERVAL '8 hours'
);
```

**JSON Types:**

```sql
CREATE TABLE products_with_metadata (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),

  -- JSON for storing structured data
  attributes JSON,

  -- JSONB (recommended) for better performance and indexing
  specifications JSONB,

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index on JSONB column
CREATE INDEX idx_specifications ON products_with_metadata USING GIN (specifications);

-- Query JSONB data
SELECT * FROM products_with_metadata
WHERE specifications @> '{"brand": "Apple"}';

SELECT * FROM products_with_metadata
WHERE specifications->>'color' = 'black';
```

**Array Types:**

```sql
CREATE TABLE articles_with_arrays (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),

  -- Array of text
  tags TEXT[],

  -- Array of integers
  category_ids INTEGER[],

  -- Multi-dimensional array
  matrix INTEGER[][]
);

-- Insert data
INSERT INTO articles_with_arrays (title, tags, category_ids)
VALUES ('My Article', ARRAY['tech', 'database'], ARRAY[1, 2, 3]);

-- Query arrays
SELECT * FROM articles_with_arrays
WHERE 'database' = ANY(tags);

SELECT * FROM articles_with_arrays
WHERE tags @> ARRAY['tech'];
```

### Q8: What are the different types of constraints in PostgreSQL?

**Answer:**

**1. PRIMARY KEY:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50)
);

-- Composite primary key
CREATE TABLE order_items (
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  PRIMARY KEY (order_id, product_id)
);
```

**2. FOREIGN KEY:**

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_customer
    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

**3. UNIQUE:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Composite unique constraint
CREATE TABLE user_roles (
  user_id INTEGER,
  role_id INTEGER,
  UNIQUE (user_id, role_id)
);
```

**4. CHECK:**

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10, 2) CHECK (price > 0),
  stock_quantity INTEGER CHECK (stock_quantity >= 0),
  discount_percent INTEGER CHECK (discount_percent BETWEEN 0 AND 100),
  status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'discontinued'))
);

-- Table-level check constraint
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  salary DECIMAL(10, 2),
  bonus DECIMAL(10, 2),
  CONSTRAINT check_bonus CHECK (bonus < salary)
);
```

**5. NOT NULL:**

```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) -- Can be NULL
);
```

**6. DEFAULT:**

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT false
);
```

**7. EXCLUSION:**

```sql
-- Prevent overlapping time ranges
CREATE TABLE room_bookings (
  id SERIAL PRIMARY KEY,
  room_id INTEGER,
  during TSTZRANGE,
  EXCLUDE USING GIST (room_id WITH =, during WITH &&)
);
```

## Indexes and Performance

### Q9: What are the different types of indexes in PostgreSQL and when should you use them?

**Answer:**

**1. B-Tree Index (Default):**

```sql
-- Best for: Equality and range queries, sorting
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Composite B-tree index
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date DESC);

-- Usage
SELECT * FROM orders WHERE customer_id = 123 ORDER BY order_date DESC;
```

**2. Hash Index:**

```sql
-- Best for: Equality comparisons only
CREATE INDEX idx_users_username_hash ON users USING HASH (username);

-- Usage
SELECT * FROM users WHERE username = 'johndoe';
```

**3. GIN Index (Generalized Inverted Index):**

```sql
-- Best for: Full-text search, JSONB, arrays
-- Full-text search
CREATE INDEX idx_articles_content_gin ON articles USING GIN (to_tsvector('english', content));

-- JSONB
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);

-- Arrays
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);

-- Usage
SELECT * FROM articles WHERE to_tsvector('english', content) @@ to_tsquery('database');
SELECT * FROM products WHERE attributes @> '{"color": "red"}';
SELECT * FROM posts WHERE tags @> ARRAY['postgresql'];
```

**4. GiST Index (Generalized Search Tree):**

```sql
-- Best for: Geometric data, full-text search, range types
CREATE INDEX idx_locations ON locations USING GIST (geom);
CREATE INDEX idx_events_timerange ON events USING GIST (event_time_range);

-- Usage
SELECT * FROM locations WHERE geom && ST_MakeEnvelope(-180, -90, 180, 90);
```

**5. BRIN Index (Block Range Index):**

```sql
-- Best for: Very large tables with naturally ordered data
-- Much smaller than B-tree, good for time-series data
CREATE INDEX idx_logs_timestamp_brin ON logs USING BRIN (timestamp);

-- Usage
SELECT * FROM logs WHERE timestamp > '2024-01-01';
```

**6. Partial Index:**

```sql
-- Index only a subset of rows
CREATE INDEX idx_orders_pending ON orders(created_at)
WHERE status = 'pending';

CREATE INDEX idx_users_active ON users(email)
WHERE is_active = true;

-- Usage
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;
```

**7. Expression Index:**

```sql
-- Index on computed values
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
CREATE INDEX idx_users_full_name ON users((first_name || ' ' || last_name));

-- Usage
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';
SELECT * FROM users WHERE (first_name || ' ' || last_name) = 'John Doe';
```

**8. Unique Index:**

```sql
-- Enforce uniqueness and provide index
CREATE UNIQUE INDEX idx_users_username_unique ON users(username);

-- Partial unique index
CREATE UNIQUE INDEX idx_users_email_active ON users(email)
WHERE is_active = true;
```

**9. Covering Index (Index with INCLUDE):**

```sql
-- Include additional columns in index for covering queries
CREATE INDEX idx_orders_customer_includes
ON orders(customer_id)
INCLUDE (order_date, total_amount);

-- This query can be satisfied entirely from the index
SELECT order_date, total_amount
FROM orders
WHERE customer_id = 123;
```

### Q10: How do you design an indexing strategy for optimal performance?

**Answer:**

**Principles:**

1. **Index Foreign Keys:**

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id)
);

-- Always index foreign keys
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

2. **Index Columns Used in WHERE Clauses:**

```sql
-- Frequently queried columns
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_products_category ON products(category_id);
```

3. **Compound Indexes for Multiple Conditions:**

```sql
-- Query: WHERE status = 'active' AND created_at > '2024-01-01'
CREATE INDEX idx_users_status_created ON users(status, created_at);

-- Column order matters! Put equality conditions first
```

4. **Index Columns Used in ORDER BY:**

```sql
-- Query: ORDER BY created_at DESC
CREATE INDEX idx_posts_created_desc ON posts(created_at DESC);

-- Compound index for WHERE + ORDER BY
CREATE INDEX idx_posts_status_created ON posts(status, created_at DESC);
```

5. **Use Partial Indexes for Selective Queries:**

```sql
-- If 95% of orders are 'completed', only index the 5%
CREATE INDEX idx_orders_pending ON orders(created_at)
WHERE status IN ('pending', 'processing');
```

6. **Monitor and Optimize:**

```sql
-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;

-- Find missing indexes (requires pg_stat_statements extension)
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public';

-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 123;
```

7. **Balance Read vs. Write Performance:**

```sql
-- Too many indexes slow down writes
-- Only create indexes that benefit your queries

-- Example: For a write-heavy table
CREATE TABLE logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  level VARCHAR(10),
  message TEXT
);

-- Minimal indexes for write performance
CREATE INDEX idx_logs_timestamp_brin ON logs USING BRIN (timestamp);
-- Avoid creating indexes on every column
```

## Advanced Schema Patterns

### Q11: How do you implement inheritance in PostgreSQL?

**Answer:**

**Table Inheritance:**

```sql
-- Parent table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Child tables inherit from parent
CREATE TABLE customers (
  customer_number VARCHAR(20) UNIQUE,
  loyalty_points INTEGER DEFAULT 0
) INHERITS (contacts);

CREATE TABLE suppliers (
  supplier_code VARCHAR(20) UNIQUE,
  payment_terms VARCHAR(50)
) INHERITS (contacts);

-- Insert data
INSERT INTO customers (name, email, customer_number, loyalty_points)
VALUES ('John Doe', 'john@example.com', 'CUST001', 100);

INSERT INTO suppliers (name, email, supplier_code, payment_terms)
VALUES ('ABC Corp', 'info@abc.com', 'SUPP001', 'Net 30');

-- Query parent table (includes all child tables)
SELECT * FROM contacts; -- Returns customers and suppliers

-- Query only specific table
SELECT * FROM ONLY contacts; -- Returns only contacts, not children

-- Query child table
SELECT * FROM customers;
```

**Alternative: Using Type Column (Preferred for most cases):**

```sql
CREATE TYPE contact_type AS ENUM ('customer', 'supplier', 'partner');

CREATE TABLE contacts_with_type (
  id SERIAL PRIMARY KEY,
  contact_type contact_type NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),

  -- Customer-specific fields (nullable)
  customer_number VARCHAR(20),
  loyalty_points INTEGER,

  -- Supplier-specific fields (nullable)
  supplier_code VARCHAR(20),
  payment_terms VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  -- Constraints based on type
  CONSTRAINT check_customer_fields
    CHECK (
      contact_type != 'customer' OR
      (customer_number IS NOT NULL)
    ),
  CONSTRAINT check_supplier_fields
    CHECK (
      contact_type != 'supplier' OR
      (supplier_code IS NOT NULL)
    )
);

-- Partial indexes for each type
CREATE INDEX idx_contacts_customers ON contacts_with_type(customer_number)
WHERE contact_type = 'customer';

CREATE INDEX idx_contacts_suppliers ON contacts_with_type(supplier_code)
WHERE contact_type = 'supplier';
```

### Q12: How do you implement polymorphic associations in PostgreSQL?

**Answer:**

**Approach 1: Multiple Foreign Keys (Type-Safe):**

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),

  -- Polymorphic: comment can belong to post OR video
  post_id INTEGER REFERENCES posts(id),
  video_id INTEGER REFERENCES videos(id),

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  -- Ensure exactly one foreign key is set
  CONSTRAINT check_one_parent
    CHECK (
      (post_id IS NOT NULL AND video_id IS NULL) OR
      (post_id IS NULL AND video_id IS NOT NULL)
    )
);

CREATE INDEX idx_comments_post ON comments(post_id) WHERE post_id IS NOT NULL;
CREATE INDEX idx_comments_video ON comments(video_id) WHERE video_id IS NOT NULL;
```

**Approach 2: Generic Foreign Key with Type (Less Safe):**

```sql
CREATE TABLE comments_polymorphic (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),

  -- Polymorphic association
  commentable_type VARCHAR(50) NOT NULL,
  commentable_id INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_commentable_type
    CHECK (commentable_type IN ('post', 'video', 'article'))
);

CREATE INDEX idx_comments_commentable
ON comments_polymorphic(commentable_type, commentable_id);

-- Query
SELECT * FROM comments_polymorphic
WHERE commentable_type = 'post' AND commentable_id = 123;
```

**Approach 3: Junction Tables (Most Type-Safe):**

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_comments (
  comment_id INTEGER PRIMARY KEY REFERENCES comments(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE video_comments (
  comment_id INTEGER PRIMARY KEY REFERENCES comments(id) ON DELETE CASCADE,
  video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE
);

-- Query comments for a post
SELECT c.*
FROM comments c
JOIN post_comments pc ON c.id = pc.comment_id
WHERE pc.post_id = 123;
```

### Q13: How do you implement soft deletes in PostgreSQL?

**Answer:**

**Basic Soft Delete:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Soft delete
UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = 123;

-- Query only active users
SELECT * FROM users WHERE deleted_at IS NULL;

-- Include soft-deleted users
SELECT * FROM users;

-- Restore
UPDATE users SET deleted_at = NULL WHERE id = 123;

-- Index for performance
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
```

**With Views for Convenience:**

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- View for active products
CREATE VIEW active_products AS
SELECT * FROM products WHERE deleted_at IS NULL;

-- View for deleted products
CREATE VIEW deleted_products AS
SELECT * FROM products WHERE deleted_at IS NOT NULL;

-- Usage
SELECT * FROM active_products;
```

**With Audit Trail:**

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  deleted_by INTEGER REFERENCES users(id),
  deleted_reason TEXT
);

-- Soft delete with audit
UPDATE documents
SET
  deleted_at = CURRENT_TIMESTAMP,
  deleted_by = 456,
  deleted_reason = 'Obsolete content'
WHERE id = 123;
```

**With Trigger for Automation:**

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  total_amount DECIMAL(10, 2),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Function to prevent hard deletes
CREATE OR REPLACE FUNCTION prevent_hard_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Soft delete instead
  UPDATE orders
  SET deleted_at = CURRENT_TIMESTAMP
  WHERE id = OLD.id;

  -- Prevent the actual delete
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soft_delete_trigger
BEFORE DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION prevent_hard_delete();

-- Now DELETE will soft delete
DELETE FROM orders WHERE id = 123;
```

## Schema Design for Specific Use Cases

### Q14: How would you design a database schema for a blog platform?

**Answer:**

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  bio TEXT,
  avatar_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(255),
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Post-Tag junction table (many-to-many)
CREATE TABLE post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Post likes table
CREATE TABLE post_likes (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
);

-- Indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX idx_comments_post ON comments(post_id, created_at DESC);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Full-text search index
CREATE INDEX idx_posts_content_gin ON posts USING GIN (to_tsvector('english', title || ' ' || content));

-- Trigger to update comments_count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comments_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Trigger to update likes_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_likes_count_trigger
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
```

### Q15: How would you design a database schema for an e-commerce application?

**Answer:**

```sql
-- Customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('billing', 'shipping')),
  street_address VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  compare_price DECIMAL(10, 2) CHECK (compare_price >= base_price),
  cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  weight_kg DECIMAL(8, 3),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB, -- For flexible attributes
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(200),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Product variants table (for products with options like size, color)
CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  attributes JSONB, -- {"size": "L", "color": "red"}
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),

  -- Amounts
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),

  -- Addresses (denormalized for historical record)
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,

  -- Payment
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,

  -- Snapshot of product data at time of order
  product_name VARCHAR(200) NOT NULL,
  sku VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Shopping carts table
CREATE TABLE shopping_carts (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Shopping cart items table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER NOT NULL REFERENCES shopping_carts(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, customer_id, order_id)
);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active, created_at DESC);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_product_images_product ON product_images(product_id, display_order);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_orders_customer ON orders(customer_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id, created_at DESC);
CREATE INDEX idx_addresses_customer ON addresses(customer_id);

-- GIN index for JSONB metadata search
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- Materialized view for product ratings
CREATE MATERIALIZED VIEW product_ratings AS
SELECT
  product_id,
  COUNT(*) AS review_count,
  AVG(rating) AS average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) AS five_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) AS four_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) AS three_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) AS two_star,
  COUNT(CASE WHEN rating = 1 THEN 1 END) AS one_star
FROM reviews
WHERE is_approved = true
GROUP BY product_id;

CREATE UNIQUE INDEX ON product_ratings(product_id);

-- Trigger to check stock before order
CREATE OR REPLACE FUNCTION check_product_stock()
RETURNS TRIGGER AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  IF NEW.variant_id IS NOT NULL THEN
    SELECT stock_quantity INTO available_stock
    FROM product_variants
    WHERE id = NEW.variant_id;
  ELSE
    SELECT stock_quantity INTO available_stock
    FROM products
    WHERE id = NEW.product_id;
  END IF;

  IF available_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for product';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_stock_trigger
BEFORE INSERT OR UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION check_product_stock();

-- Trigger to update stock after order
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.variant_id IS NOT NULL THEN
      UPDATE product_variants
      SET stock_quantity = stock_quantity - NEW.quantity
      WHERE id = NEW.variant_id;
    ELSE
      UPDATE products
      SET stock_quantity = stock_quantity - NEW.quantity
      WHERE id = NEW.product_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.variant_id IS NOT NULL THEN
      UPDATE product_variants
      SET stock_quantity = stock_quantity + OLD.quantity
      WHERE id = OLD.variant_id;
    ELSE
      UPDATE products
      SET stock_quantity = stock_quantity + OLD.quantity
      WHERE id = OLD.product_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_trigger
AFTER INSERT OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_product_stock();
```

## Anti-Patterns

### Q16: What are common database design anti-patterns in PostgreSQL?

**Answer:**

**1. EAV (Entity-Attribute-Value) Anti-Pattern:**

```sql
-- Bad: EAV pattern
CREATE TABLE entity_attributes (
  entity_id INTEGER,
  attribute_name VARCHAR(50),
  attribute_value TEXT
);

-- Difficult to query, no type safety, poor performance
SELECT * FROM entity_attributes
WHERE entity_id = 1 AND attribute_name = 'email';

-- Good: Proper columns
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  age INTEGER
);
```

**2. Using VARCHAR for Everything:**

```sql
-- Bad
CREATE TABLE bad_types (
  id VARCHAR(50), -- Should be INTEGER
  price VARCHAR(50), -- Should be DECIMAL
  created_at VARCHAR(50), -- Should be TIMESTAMP
  is_active VARCHAR(10) -- Should be BOOLEAN
);

-- Good
CREATE TABLE good_types (
  id SERIAL PRIMARY KEY,
  price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

**3. Not Using Foreign Keys:**

```sql
-- Bad: No referential integrity
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER -- What if customer doesn't exist?
);

-- Good: Enforce referential integrity
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE
);
```

**4. UUID as VARCHAR:**

```sql
-- Bad
CREATE TABLE bad_uuid (
  id VARCHAR(36) PRIMARY KEY -- '550e8400-e29b-41d4-a716-446655440000'
);

-- Good
CREATE TABLE good_uuid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
```

**5. Storing Comma-Separated Lists:**

```sql
-- Bad
CREATE TABLE bad_tags (
  id SERIAL PRIMARY KEY,
  post_id INTEGER,
  tags TEXT -- 'tag1,tag2,tag3'
);

-- Good: Use array or junction table
CREATE TABLE good_tags (
  id SERIAL PRIMARY KEY,
  post_id INTEGER,
  tags TEXT[] -- ARRAY['tag1', 'tag2', 'tag3']
);

-- Or junction table
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);
```

**6. Polymorphic Associations Without Constraints:**

```sql
-- Bad: No referential integrity
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  commentable_type VARCHAR(50),
  commentable_id INTEGER -- Could reference non-existent record
);

-- Better: Multiple foreign keys with CHECK
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  video_id INTEGER REFERENCES videos(id),
  CHECK (
    (post_id IS NOT NULL AND video_id IS NULL) OR
    (post_id IS NULL AND video_id IS NOT NULL)
  )
);
```

**7. Not Using Indexes:**

```sql
-- Bad: No indexes on foreign keys or frequently queried columns
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  status VARCHAR(20)
);

-- Good: Index foreign keys and query columns
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id)
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
```

**8. Storing JSON When Relational Would Work:**

```sql
-- Bad: Using JSON for structured data
CREATE TABLE users_bad (
  id SERIAL PRIMARY KEY,
  data JSONB -- {"name": "John", "email": "john@example.com", "age": 30}
);

-- Good: Proper columns for structured data
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  age INTEGER,
  metadata JSONB -- Only for truly flexible/optional data
);
```

### Q17: How do you handle schema versioning and migrations?

**Answer:**

**Using Migration Tools (Recommended):**

1. **Flyway:**

```sql
-- V1__initial_schema.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL
);

-- V2__add_users_timestamp.sql
ALTER TABLE users
ADD COLUMN created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- V3__add_users_status.sql
ALTER TABLE users
ADD COLUMN status VARCHAR(20) DEFAULT 'active';
```

2. **Liquibase:**

```xml
<changeSet id="1" author="developer">
  <createTable tableName="users">
    <column name="id" type="serial">
      <constraints primaryKey="true"/>
    </column>
    <column name="username" type="varchar(50)">
      <constraints nullable="false"/>
    </column>
  </createTable>
</changeSet>
```

3. **Database Migration Best Practices:**

```sql
-- Always use transactions
BEGIN;

-- Make changes backwards compatible when possible
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Update existing data if needed
UPDATE users SET phone = '' WHERE phone IS NULL;

-- Add constraints later
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;

COMMIT;

-- For risky migrations, test rollback
BEGIN;
-- Migration steps
-- If error occurs, ROLLBACK will undo changes
ROLLBACK; -- or COMMIT if successful
```

4. **Schema Version Tracking:**

```sql
CREATE TABLE schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  description TEXT
);

-- Track each migration
INSERT INTO schema_migrations (version, description)
VALUES ('001', 'Initial schema');
```

5. **Zero-Downtime Migrations:**

```sql
-- Step 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN new_column VARCHAR(100);

-- Step 2: Deploy code that writes to both old and new
-- Application code handles both columns

-- Step 3: Backfill data
UPDATE users SET new_column = old_column WHERE new_column IS NULL;

-- Step 4: Add constraints
ALTER TABLE users ALTER COLUMN new_column SET NOT NULL;

-- Step 5: Deploy code that only uses new column

-- Step 6: Drop old column
ALTER TABLE users DROP COLUMN old_column;
```

## Performance Optimization

### Q18: How do you design schemas for optimal query performance?

**Answer:**

**1. Denormalize Strategic Data:**

```sql
-- Add computed columns
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  -- Denormalized for quick access
  item_count INTEGER,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Maintain with triggers
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET
    item_count = (SELECT COUNT(*) FROM order_items WHERE order_id = NEW.order_id),
    total_amount = (SELECT SUM(subtotal) FROM order_items WHERE order_id = NEW.order_id)
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**2. Use Appropriate Indexes:**

```sql
-- Composite indexes for common queries
CREATE INDEX idx_orders_customer_date
ON orders(customer_id, created_at DESC);

-- Partial indexes for selective queries
CREATE INDEX idx_orders_pending
ON orders(created_at) WHERE status = 'pending';

-- Covering indexes
CREATE INDEX idx_orders_covering
ON orders(customer_id) INCLUDE (order_date, total_amount);
```

**3. Partition Large Tables:**

```sql
-- Range partitioning by date
CREATE TABLE logs (
  id BIGSERIAL,
  timestamp TIMESTAMPTZ NOT NULL,
  level VARCHAR(10),
  message TEXT
) PARTITION BY RANGE (timestamp);

CREATE TABLE logs_2024_01 PARTITION OF logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE logs_2024_02 PARTITION OF logs
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Create index on each partition
CREATE INDEX ON logs_2024_01(timestamp);
CREATE INDEX ON logs_2024_02(timestamp);
```

**4. Use Materialized Views for Complex Queries:**

```sql
CREATE MATERIALIZED VIEW sales_summary AS
SELECT
  DATE_TRUNC('day', o.created_at) AS date,
  p.category_id,
  c.name AS category_name,
  COUNT(DISTINCT o.id) AS order_count,
  SUM(oi.quantity) AS items_sold,
  SUM(oi.subtotal) AS revenue
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
WHERE o.status = 'completed'
GROUP BY DATE_TRUNC('day', o.created_at), p.category_id, c.name;

CREATE INDEX ON sales_summary(date, category_id);

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_summary;
```

**5. Optimize Data Types:**

```sql
-- Use smallest appropriate type
CREATE TABLE optimized (
  id INTEGER PRIMARY KEY, -- Not BIGINT unless needed
  status SMALLINT, -- Not INTEGER for small numbers
  is_active BOOLEAN, -- Not INTEGER or VARCHAR
  price NUMERIC(10,2), -- Not FLOAT for money
  created_at TIMESTAMPTZ -- Not VARCHAR
);
```

### Q19: How do you monitor and optimize database performance?

**Answer:**

**1. Identify Slow Queries:**

```sql
-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slowest queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**2. Analyze Query Plans:**

```sql
-- EXPLAIN shows query plan
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;

-- EXPLAIN ANALYZE executes and shows actual performance
EXPLAIN ANALYZE
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.created_at > '2024-01-01';
```

**3. Monitor Index Usage:**

```sql
-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_size_pretty(pg_relation_size(indexrelid)) DESC;
```

**4. Monitor Table Bloat:**

```sql
-- Check table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- VACUUM to reclaim space
VACUUM ANALYZE orders;
```

### Q20: What are best practices for PostgreSQL schema design?

**Answer:**

**1. Use Consistent Naming Conventions:**

```sql
-- Tables: plural, lowercase, underscores
users, order_items, product_categories

-- Columns: singular, lowercase, underscores
id, first_name, created_at

-- Indexes: descriptive with prefix
idx_users_email, idx_orders_customer_date

-- Foreign keys: descriptive
fk_orders_customer, fk_products_category

-- Constraints: descriptive
check_price_positive, unique_username
```

**2. Document Your Schema:**

```sql
-- Use COMMENTs
COMMENT ON TABLE orders IS 'Customer orders with payment and shipping information';
COMMENT ON COLUMN orders.status IS 'Order status: pending, processing, shipped, delivered, cancelled';

-- Create ER diagrams
-- Use tools like dbdiagram.io, DBeaver, pgAdmin
```

**3. Plan for Scalability:**

```sql
-- Use BIGINT for high-growth tables
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL
);

-- Consider partitioning early
-- Use appropriate data types
-- Index strategically
```

**4. Security Considerations:**

```sql
-- Use separate users with minimal privileges
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE ON orders TO app_user;
GRANT USAGE ON SEQUENCE orders_id_seq TO app_user;

-- Don't store sensitive data in plain text
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL, -- Hashed, not plain text
  ssn_encrypted BYTEA -- Encrypted if storing sensitive data
);
```

**5. Maintainability:**

```sql
-- Use views for complex queries
CREATE VIEW active_users AS
SELECT id, username, email, created_at
FROM users
WHERE deleted_at IS NULL AND is_active = true;

-- Use functions for business logic
CREATE OR REPLACE FUNCTION calculate_order_total(order_id INTEGER)
RETURNS DECIMAL(10, 2) AS $$
  SELECT SUM(quantity * unit_price)
  FROM order_items
  WHERE order_id = $1;
$$ LANGUAGE SQL STABLE;
```

---

## Additional Resources

- [PostgreSQL Documentation - Data Definition](https://www.postgresql.org/docs/current/ddl.html)
- [PostgreSQL Performance Optimization](https://www.postgresql.org/docs/current/performance-tips.html)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-basics.html)
