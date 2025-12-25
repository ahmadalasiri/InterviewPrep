# RBAC and Permissions

Controlling who can do what in your database.

## 1. Roles and Users
In Postgres, `USER` and `GROUP` are both just `ROLE`s.
```sql
CREATE ROLE readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

CREATE USER ahmad WITH PASSWORD 'mypassword';
GRANT readonly TO ahmad;
```

## 2. Row-Level Security (RLS)
Restricting which rows a user can see within a table.
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_orders_policy ON orders
FOR SELECT USING (user_id = current_user_id());
```

## 3. The `search_path`
Controls which schemas Postgres looks in when you don't specify one. Setting this incorrectly can lead to security vulnerabilities (SQL Injection).

## Senior Consideration
- **Principle of Least Privilege**: Never use the `postgres` superuser for application connections.
- **Default Privileges**: Use `ALTER DEFAULT PRIVILEGES` to ensure new tables automatically get the right permissions.
- **Auditing**: Use extensions like `pgaudit` to track who executed which commands.

