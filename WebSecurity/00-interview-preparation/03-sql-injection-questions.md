# SQL Injection Interview Questions

## SQL Injection Fundamentals

### Q1: What is SQL Injection?

**Answer:**

SQL Injection is a code injection technique that exploits security vulnerabilities in an application's database layer. Attackers can insert malicious SQL code into input fields, which is then executed by the database.

**How it works:**
1. Application constructs SQL query using user input
2. Attacker provides malicious SQL in input
3. Malicious SQL is executed by database
4. Attacker gains unauthorized access to data

**Example:**
```typescript
// ❌ Vulnerable code
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

// Attacker input:
username = "admin'--"
password = "anything"

// Resulting query:
SELECT * FROM users WHERE username = 'admin'--' AND password = 'anything'
// -- comments out rest of query, bypassing password check
```

---

### Q2: How do you prevent SQL Injection?

**Answer:**

**1. Parameterized Queries (Prepared Statements):**
```typescript
// ✅ Safe: Parameterized query
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
const result = await db.query(query, [username, password]);

// Database treats parameters as data, not SQL code
```

**2. ORM (Object-Relational Mapping):**
```typescript
// ✅ Safe: Using ORM
const user = await User.findOne({
  where: { username, password }
});

// ORM automatically uses parameterized queries
```

**3. Input Validation:**
```typescript
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8)
});

const validated = userSchema.parse({ username, password });
```

**4. Least Privilege:**
```typescript
// Database user should have minimum necessary permissions
// Don't use root/admin database user for application
```

---

### Q3: What are the different types of SQL Injection?

**Answer:**

**1. Classic SQL Injection:**
```sql
-- Union-based
' UNION SELECT username, password FROM users--

-- Error-based
' AND (SELECT * FROM (SELECT COUNT(*),CONCAT(username,0x3a,password,FLOOR(RAND(0)*2))x FROM users GROUP BY x)a)--
```

**2. Blind SQL Injection:**
```sql
-- Boolean-based blind
' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE id=1)='a'--

-- Time-based blind
'; WAITFOR DELAY '00:00:05'--
```

**3. Second-Order SQL Injection:**
```typescript
// Data stored and used later
const username = sanitize(userInput); // Stored as: admin'--
// Later used in query without sanitization
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**4. NoSQL Injection:**
```javascript
// MongoDB example
// Attacker input: {"$ne": null}
const user = await User.findOne({ password: { $ne: null } });
// Matches all users with non-null password
```

---

### Q4: How do parameterized queries prevent SQL Injection?

**Answer:**

Parameterized queries separate SQL code from data:

**How it works:**
1. SQL structure is defined first (with placeholders)
2. Parameters are sent separately
3. Database treats parameters as data, not SQL
4. Parameters are properly escaped/encoded

**Example:**
```typescript
// Parameterized query
const query = 'SELECT * FROM users WHERE id = ? AND status = ?';
const params = [userId, 'active'];

// Database processes:
// 1. Parse SQL structure: SELECT * FROM users WHERE id = ? AND status = ?
// 2. Bind parameters: userId → properly escaped, 'active' → properly escaped
// 3. Execute: No SQL injection possible

// Even if userId = "1' OR '1'='1"
// It's treated as literal string, not SQL code
```

**Why it's safe:**
- Parameters are type-checked
- Special characters are escaped
- SQL structure is fixed
- Database handles encoding

---

### Q5: Can ORMs prevent SQL Injection?

**Answer:**

**Yes, when used correctly:**

**Safe ORM Usage:**
```typescript
// ✅ Safe: Using ORM query methods
const user = await User.findOne({
  where: { username, password }
});

// ✅ Safe: Using parameterized methods
const users = await User.findAll({
  where: {
    id: { [Op.in]: [1, 2, 3] }
  }
});
```

**Unsafe ORM Usage:**
```typescript
// ❌ Dangerous: Raw SQL with string concatenation
const query = `SELECT * FROM users WHERE username = '${username}'`;
const user = await sequelize.query(query);

// ❌ Dangerous: Using $where with user input
const user = await User.findOne({
  $where: `this.username === '${username}'`
});
```

**Best Practice:**
- Always use ORM query methods
- Never use raw SQL with user input
- Use parameterized queries if raw SQL is needed
- Validate input before using in queries

---

### Q6: What is NoSQL Injection?

**Answer:**

NoSQL Injection targets NoSQL databases (MongoDB, CouchDB, etc.) by injecting malicious queries:

**MongoDB Example:**
```javascript
// ❌ Vulnerable
const user = await User.findOne({
  username: req.body.username,
  password: req.body.password
});

// Attacker sends:
// username: { $ne: null }
// password: { $ne: null }
// Matches all users!

// ✅ Safe: Validate input
const userSchema = z.object({
  username: z.string(),
  password: z.string()
});
const { username, password } = userSchema.parse(req.body);

const user = await User.findOne({ username, password });
```

**Prevention:**
- Validate input types
- Use schema validation (Zod, Joi)
- Sanitize input
- Use parameterized queries when available
- Whitelist allowed operators

---

### Q7: How do you sanitize input to prevent SQL Injection?

**Answer:**

**Note: Sanitization is NOT the primary defense. Use parameterized queries!**

**Input Validation:**
```typescript
import { z } from 'zod';

// Whitelist approach (better than blacklist)
const usernameSchema = z.string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/); // Only alphanumeric and underscore

const validated = usernameSchema.parse(username);
```

**Escaping (Last Resort):**
```typescript
// Only if parameterized queries aren't possible
function escapeSQL(str: string): string {
  return str
    .replace(/'/g, "''")  // Escape single quotes
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/%/g, '\\%')   // Escape wildcards
    .replace(/_/g, '\\_');  // Escape wildcards
}

// But still use parameterized queries when possible!
```

**Best Practice:**
1. **Primary**: Use parameterized queries
2. **Secondary**: Validate input (whitelist)
3. **Tertiary**: Sanitize/escape (if absolutely necessary)

---

### Q8: What are the impacts of SQL Injection?

**Answer:**

**1. Data Breach:**
```sql
-- Extract all user data
' UNION SELECT * FROM users--
```

**2. Authentication Bypass:**
```sql
-- Login without password
admin'--
```

**3. Data Modification:**
```sql
-- Update data
'; UPDATE users SET password = 'hacked' WHERE username = 'admin'--
```

**4. Data Deletion:**
```sql
-- Delete data
'; DROP TABLE users--
```

**5. Privilege Escalation:**
```sql
-- Execute as database admin
'; EXEC xp_cmdshell('net user hacker password /add')--
```

**6. Database Fingerprinting:**
```sql
-- Identify database version
' AND (SELECT @@version)--
```

**Business Impact:**
- Data loss
- Privacy violations
- Regulatory fines (GDPR, etc.)
- Reputation damage
- Financial losses

---

### Q9: How do you test for SQL Injection vulnerabilities?

**Answer:**

**1. Manual Testing:**
```sql
-- Basic test
' OR '1'='1
' OR '1'='1'--
' OR '1'='1'/*
" OR "1"="1
') OR ('1'='1

-- Union-based
' UNION SELECT NULL--
' UNION SELECT 1,2,3--

-- Error-based
' AND (SELECT * FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--
```

**2. Automated Tools:**
- SQLMap
- OWASP ZAP
- Burp Suite
- Acunetix

**3. Code Review:**
```typescript
// Look for:
- String concatenation in SQL queries
- Raw SQL with user input
- Unsafe ORM usage
- Missing input validation
```

**4. Error Messages:**
- Check if database errors are exposed
- Look for SQL syntax in error messages
- Test error handling

---

### Q10: How do you handle SQL Injection in stored procedures?

**Answer:**

**Safe Stored Procedure:**
```sql
-- Database stored procedure
CREATE PROCEDURE GetUser
    @Username NVARCHAR(50),
    @Password NVARCHAR(50)
AS
BEGIN
    SELECT * FROM users 
    WHERE username = @Username 
    AND password = @Password
END
```

**Calling from Application:**
```typescript
// ✅ Safe: Parameters are bound
await db.execute('EXEC GetUser @Username = ?, @Password = ?', [username, password]);
```

**Unsafe Stored Procedure:**
```sql
-- ❌ Dangerous: Dynamic SQL in stored procedure
CREATE PROCEDURE GetUser
    @Username NVARCHAR(50)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX)
    SET @sql = 'SELECT * FROM users WHERE username = ''' + @Username + ''''
    EXEC sp_executesql @sql
END
```

**Best Practice:**
- Use parameters in stored procedures
- Avoid dynamic SQL in stored procedures
- Validate input before calling procedures
- Use parameterized queries to call procedures

---

### Q11: What is the difference between SQL Injection and Command Injection?

**Answer:**

**SQL Injection:**
- Targets database queries
- Injects SQL code
- Affects database layer

```typescript
// SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;
// userId = "1; DROP TABLE users--"
```

**Command Injection:**
- Targets system commands
- Injects shell commands
- Affects operating system

```typescript
// Command Injection
const command = `ls ${filename}`;
exec(command);
// filename = "file.txt; rm -rf /"
```

**Prevention:**
- SQL Injection: Parameterized queries
- Command Injection: Avoid exec/eval, use safe APIs, validate input

---

### Q12: How do you prevent SQL Injection in dynamic queries?

**Answer:**

**If you MUST use dynamic queries:**

**1. Whitelist Approach:**
```typescript
const ALLOWED_COLUMNS = ['id', 'username', 'email'];
const ALLOWED_ORDERS = ['ASC', 'DESC'];

function buildQuery(column: string, order: string) {
  if (!ALLOWED_COLUMNS.includes(column)) {
    throw new Error('Invalid column');
  }
  if (!ALLOWED_ORDERS.includes(order)) {
    throw new Error('Invalid order');
  }
  
  // Safe: column and order are whitelisted
  const query = `SELECT * FROM users ORDER BY ${column} ${order}`;
  return query;
}
```

**2. Use Parameterized Queries:**
```typescript
// Even for dynamic queries, use parameters
const query = `SELECT * FROM users WHERE ${column} = ?`;
await db.query(query, [value]);
```

**3. Use ORM Query Builders:**
```typescript
// Using Sequelize
const query = User.findAll({
  order: [[column, order]], // ORM handles safely
  where: { [column]: value }
});
```

**Best Practice:** Avoid dynamic queries when possible. Use ORMs or query builders.

---

### Q13: How do you handle SQL Injection in search functionality?

**Answer:**

**Safe Search Implementation:**
```typescript
// ✅ Safe: Parameterized query with LIKE
const searchTerm = `%${search}%`;
const query = 'SELECT * FROM products WHERE name LIKE ?';
const results = await db.query(query, [searchTerm]);

// ✅ Safe: Using ORM
const results = await Product.findAll({
  where: {
    name: {
      [Op.like]: `%${search}%`
    }
  }
});
```

**Full-Text Search:**
```typescript
// ✅ Safe: Using database full-text search
const query = `
  SELECT * FROM products 
  WHERE MATCH(name, description) AGAINST(? IN BOOLEAN MODE)
`;
const results = await db.query(query, [search]);
```

**Input Validation:**
```typescript
const searchSchema = z.string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9\s]+$/);

const validated = searchSchema.parse(search);
```

---

### Q14: What is Time-Based Blind SQL Injection?

**Answer:**

Time-based blind SQL injection uses time delays to extract data when error messages aren't available:

**How it works:**
```sql
-- Test if condition is true
' AND IF(1=1, SLEEP(5), 0)--
-- If true, query takes 5 seconds

-- Extract data character by character
' AND IF(ASCII(SUBSTRING((SELECT password FROM users WHERE id=1),1,1))>64, SLEEP(5), 0)--
-- If first character ASCII > 64, delay 5 seconds
```

**Prevention:**
- Use parameterized queries (prevents all SQL injection)
- Limit query execution time
- Monitor for suspicious delays
- Use connection pooling with timeouts

**Detection:**
- Monitor query execution times
- Alert on unusually long queries
- Log all database queries

---

### Q15: How do you secure database connections?

**Answer:**

**1. Use Parameterized Queries:**
```typescript
// Always use parameters
const query = 'SELECT * FROM users WHERE id = ?';
await db.query(query, [userId]);
```

**2. Least Privilege:**
```sql
-- Create application user with minimal permissions
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON myapp.* TO 'app_user'@'localhost';
-- No DROP, ALTER, or administrative privileges
```

**3. Connection Security:**
```typescript
// Use SSL/TLS for database connections
const db = mysql.createConnection({
  host: 'localhost',
  user: 'app_user',
  password: 'password',
  ssl: {
    rejectUnauthorized: true
  }
});
```

**4. Connection Pooling:**
```typescript
// Limit connections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'app_user',
  password: 'password'
});
```

**5. Error Handling:**
```typescript
// Don't expose database errors to users
try {
  const result = await db.query(query, params);
} catch (error) {
  // Log error internally
  logger.error('Database error', error);
  // Return generic error to user
  res.status(500).json({ error: 'Internal server error' });
}
```

**6. Input Validation:**
```typescript
// Validate before querying
const userIdSchema = z.number().int().positive();
const userId = userIdSchema.parse(req.params.id);
```

