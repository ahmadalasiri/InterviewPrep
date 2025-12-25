# JSONB and Document Storage

Using PostgreSQL as a NoSQL database.

## 1. JSON vs. JSONB
- **JSON**: Stores an exact copy of the input text. Faster to write, slow to query.
- **JSONB**: Stores data in a decomposed binary format. Slower to write, **much faster** to query and supports indexing.

## 2. Querying JSONB
```sql
-- Does the JSON contain this key/value?
SELECT * FROM users WHERE data @> '{"city": "Cairo"}';

-- Extract value as text
SELECT data->>'email' FROM users;
```

## 3. Indexing JSONB
Use **GIN** indexes for high-performance JSONB searching.
```sql
CREATE INDEX idx_user_data ON users USING GIN (data);
```

## Senior Consideration
- **When to use?**: JSONB is great for sparse data, dynamic attributes, or rapid prototyping.
- **When to avoid?**: If your data is highly structured and relational, stick to columns. JSONB lacks schema validation (unless you add `CHECK` constraints with `jsonb_matches_schema`).
- **Storage**: JSONB is often larger on disk than traditional columns due to key repetition.

