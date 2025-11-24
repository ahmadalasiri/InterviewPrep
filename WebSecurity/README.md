# Web Security - Complete Learning Guide

A comprehensive guide to web security vulnerabilities, defenses, and best practices for building secure Node.js/TypeScript applications.

## 📚 Contents

### 00. Interview Preparation

Complete set of web security interview questions with detailed answers:

- [XSS Questions](00-interview-preparation/01-xss-questions.md) - Cross-Site Scripting attacks and prevention
- [CSRF Questions](00-interview-preparation/02-csrf-questions.md) - Cross-Site Request Forgery protection
- [SQL Injection Questions](00-interview-preparation/03-sql-injection-questions.md) - Database security
- [Authentication & Authorization](00-interview-preparation/04-auth-questions.md) - JWT, OAuth, session management
- [HTTPS & SSL/TLS](00-interview-preparation/05-https-questions.md) - Encryption and secure communication
- [Advanced Security Topics](00-interview-preparation/06-advanced-questions.md) - OWASP Top 10, security headers, etc.

### 01. XSS Protection

Cross-Site Scripting prevention and mitigation:

- [Input Sanitization](01-xss-protection/input-sanitization.ts) - Sanitize user input
- [Content Security Policy](01-xss-protection/csp-headers.ts) - CSP implementation
- [Output Encoding](01-xss-protection/output-encoding.ts) - Encode output properly
- [XSS Middleware](01-xss-protection/xss-middleware.ts) - Express middleware for XSS protection

### 02. CSRF Protection

Cross-Site Request Forgery prevention:

- [CSRF Tokens](02-csrf-protection/csrf-tokens.ts) - Token-based CSRF protection
- [SameSite Cookies](02-csrf-protection/samesite-cookies.ts) - Cookie security
- [CSRF Middleware](02-csrf-protection/csrf-middleware.ts) - Express CSRF middleware
- [Double Submit Cookie](02-csrf-protection/double-submit-cookie.ts) - Alternative CSRF protection

### 03. SQL Injection Prevention

Database security and parameterized queries:

- [Parameterized Queries](03-sql-injection/parameterized-queries.ts) - Safe database queries
- [ORM Security](03-sql-injection/orm-security.ts) - Using ORMs safely
- [Input Validation](03-sql-injection/input-validation.ts) - Validate and sanitize inputs
- [Query Escaping](03-sql-injection/query-escaping.ts) - Manual escaping (not recommended)

### 04. Authentication & Authorization

Secure authentication and authorization patterns:

- [JWT Implementation](04-auth/jwt-authentication.ts) - JSON Web Tokens
- [Password Hashing](04-auth/password-hashing.ts) - bcrypt, argon2
- [Session Management](04-auth/session-management.ts) - Secure session handling
- [OAuth2 Flow](04-auth/oauth2-flow.ts) - OAuth2 implementation
- [Role-Based Access Control](04-auth/rbac.ts) - RBAC implementation

### 05. HTTPS & Encryption

Secure communication and data encryption:

- [HTTPS Setup](05-https/https-setup.ts) - HTTPS configuration
- [SSL/TLS Configuration](05-https/ssl-config.ts) - TLS settings
- [Data Encryption](05-https/data-encryption.ts) - Encrypt sensitive data
- [Certificate Management](05-https/certificate-management.ts) - SSL certificate handling

### 06. Security Headers

HTTP security headers implementation:

- [Security Headers Middleware](06-security-headers/security-headers.ts) - All security headers
- [CORS Configuration](06-security-headers/cors-config.ts) - Proper CORS setup
- [HSTS Implementation](06-security-headers/hsts.ts) - HTTP Strict Transport Security
- [Content Security Policy](06-security-headers/csp.ts) - CSP configuration

### 07. Input Validation

Comprehensive input validation and sanitization:

- [Input Validation Middleware](07-input-validation/validation-middleware.ts) - Validation utilities
- [Schema Validation](07-input-validation/schema-validation.ts) - Using Zod/Joi
- [File Upload Security](07-input-validation/file-upload-security.ts) - Secure file handling
- [Rate Limiting](07-input-validation/rate-limiting.ts) - Prevent abuse

### 08. Advanced Security

Advanced security patterns and practices:

- [Security Audit](08-advanced/security-audit.ts) - Security scanning
- [Dependency Scanning](08-advanced/dependency-scanning.ts) - Check for vulnerabilities
- [Secrets Management](08-advanced/secrets-management.ts) - Environment variables and secrets
- [Logging & Monitoring](08-advanced/security-logging.ts) - Security event logging

## 🎯 What is Web Security?

Web security involves protecting web applications from various attacks and vulnerabilities that could compromise data integrity, confidentiality, or availability.

### Why is Web Security Important?

- **Data Protection**: Protect user data from unauthorized access
- **Trust**: Users trust applications that handle their data securely
- **Compliance**: Meet regulatory requirements (GDPR, HIPAA, etc.)
- **Business Continuity**: Prevent attacks that could disrupt services
- **Reputation**: Security breaches damage brand reputation

### Common Web Security Threats

1. **XSS (Cross-Site Scripting)** - Injecting malicious scripts into web pages
2. **CSRF (Cross-Site Request Forgery)** - Forcing users to perform unwanted actions
3. **SQL Injection** - Injecting malicious SQL queries
4. **Authentication Bypass** - Gaining unauthorized access
5. **Session Hijacking** - Stealing user sessions
6. **Man-in-the-Middle** - Intercepting communications
7. **DDoS Attacks** - Overwhelming servers with traffic
8. **Insecure Direct Object References** - Accessing unauthorized resources
9. **Security Misconfiguration** - Improper security settings
10. **Sensitive Data Exposure** - Leaking sensitive information

## 🔑 Key Security Concepts

### Defense in Depth

Multiple layers of security controls:

```typescript
// Layer 1: Input validation
const validated = validateInput(userInput);

// Layer 2: Sanitization
const sanitized = sanitize(validated);

// Layer 3: Parameterized queries
const result = await db.query('SELECT * FROM users WHERE id = ?', [sanitized]);

// Layer 4: Output encoding
res.send(encodeOutput(result));
```

### Principle of Least Privilege

Users and processes should have minimum necessary permissions:

```typescript
// ❌ Bad: Admin access for all
if (user) {
  await deleteAllUsers();
}

// ✅ Good: Role-based access
if (user.role === 'admin' && user.hasPermission('delete_users')) {
  await deleteUser(userId);
}
```

### Secure by Default

Applications should be secure without additional configuration:

```typescript
// ✅ Good: Secure defaults
const app = express();
app.use(helmet()); // Security headers by default
app.use(express.json({ limit: '10kb' })); // Limit payload size
```

## 🚀 Quick Start

### Basic Secure Express Server

```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### XSS Protection Example

```typescript
import { escape } from 'html-escaper';

// ❌ Vulnerable: Direct output
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`<h1>Results for: ${query}</h1>`); // XSS vulnerability!
});

// ✅ Secure: Escaped output
app.get('/search', (req, res) => {
  const query = escape(req.query.q as string);
  res.send(`<h1>Results for: ${query}</h1>`);
});
```

### CSRF Protection Example

```typescript
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Get CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protected route
app.post('/api/users', (req, res) => {
  // CSRF token validated automatically
  // ... create user
});
```

### SQL Injection Prevention

```typescript
// ❌ Vulnerable: String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Secure: Parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
const result = await db.query(query, [userId]);

// ✅ Secure: Using ORM
const user = await User.findOne({ where: { id: userId } });
```

## 🛠️ Best Practices

### 1. Always Validate Input

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/)
});

app.post('/api/users', async (req, res) => {
  try {
    const validated = userSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

### 2. Use Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 3. Secure Password Storage

```typescript
import bcrypt from 'bcrypt';

// Hash password
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 4. Implement Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/login', authLimiter, async (req, res) => {
  // Login logic
});
```

### 5. Use HTTPS in Production

```typescript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

## 🎓 Learning Path

### Week 1: Fundamentals
- [ ] Understand OWASP Top 10
- [ ] Learn XSS attacks and prevention
- [ ] Study CSRF protection
- [ ] Practice input validation
- [ ] Implement security headers

### Week 2: Authentication & Authorization
- [ ] Learn JWT implementation
- [ ] Study password hashing
- [ ] Understand session management
- [ ] Implement OAuth2
- [ ] Practice RBAC

### Week 3: Database Security
- [ ] Learn SQL injection prevention
- [ ] Study parameterized queries
- [ ] Understand ORM security
- [ ] Practice input sanitization
- [ ] Learn about NoSQL injection

### Week 4: Advanced Topics
- [ ] Study HTTPS/TLS configuration
- [ ] Learn about security headers
- [ ] Understand CORS properly
- [ ] Practice rate limiting
- [ ] Study secrets management

### Week 5: Security Testing
- [ ] Learn security testing tools
- [ ] Practice vulnerability scanning
- [ ] Study penetration testing basics
- [ ] Understand security audits
- [ ] Learn dependency scanning

### Week 6: Interview Preparation
- [ ] Review all question files
- [ ] Practice explaining security concepts
- [ ] Study real-world security breaches
- [ ] Review OWASP Top 10 in detail
- [ ] Practice coding secure applications

## 🔧 Common Tools & Libraries

### Security Libraries
- **helmet** - Security headers middleware
- **express-rate-limit** - Rate limiting
- **csurf** - CSRF protection
- **bcrypt** / **argon2** - Password hashing
- **jsonwebtoken** - JWT implementation
- **validator** / **zod** - Input validation
- **express-validator** - Express validation middleware

### Security Testing Tools
- **OWASP ZAP** - Security testing tool
- **Burp Suite** - Web vulnerability scanner
- **npm audit** - Dependency vulnerability scanning
- **Snyk** - Security scanning
- **SonarQube** - Code quality and security

## 💡 Common Pitfalls

### 1. Trusting Client-Side Validation Only

```typescript
// ❌ Bad: Only client-side validation
// Client sends: { age: "18" }
app.post('/api/users', (req, res) => {
  const user = req.body; // No server-side validation!
  // ...
});

// ✅ Good: Server-side validation
app.post('/api/users', (req, res) => {
  const validated = userSchema.parse(req.body);
  // ...
});
```

### 2. Exposing Sensitive Information in Errors

```typescript
// ❌ Bad: Exposing database errors
app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('User not found');
  } catch (error) {
    res.status(500).json({ error: error.message }); // Exposes DB structure!
  }
});

// ✅ Good: Generic error messages
app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});
```

### 3. Weak Password Requirements

```typescript
// ❌ Bad: Weak password
if (password.length >= 6) {
  // Accept password
}

// ✅ Good: Strong password requirements
const passwordSchema = z.string()
  .min(12)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);
```

## 🔗 Additional Resources

See [resources.md](resources.md) for:
- OWASP documentation
- Security best practices
- Video courses
- Books and articles
- Security tools
- Community resources

## 🏆 Skills Checklist

### Basic Skills
- [ ] Understand OWASP Top 10
- [ ] Implement XSS protection
- [ ] Implement CSRF protection
- [ ] Use parameterized queries
- [ ] Implement input validation
- [ ] Use security headers

### Intermediate Skills
- [ ] Implement JWT authentication
- [ ] Secure password storage
- [ ] Implement rate limiting
- [ ] Configure HTTPS/TLS
- [ ] Implement CORS properly
- [ ] Use security middleware

### Advanced Skills
- [ ] Design secure authentication systems
- [ ] Implement OAuth2
- [ ] Security auditing
- [ ] Penetration testing basics
- [ ] Security monitoring
- [ ] Incident response

## 📈 Interview Focus Areas

### Most Asked Topics
1. **XSS Prevention** - How to prevent and mitigate XSS attacks
2. **CSRF Protection** - Token-based and SameSite cookie protection
3. **SQL Injection** - Parameterized queries and ORM security
4. **Authentication** - JWT, sessions, password hashing
5. **Security Headers** - CSP, HSTS, X-Frame-Options
6. **OWASP Top 10** - Understanding common vulnerabilities

### Common Interview Questions
- How do you prevent XSS attacks?
- Explain CSRF and how to prevent it
- What is SQL injection and how do you prevent it?
- How do you securely store passwords?
- Explain JWT and its security considerations
- What security headers should you use?

---

**Happy Learning! 🚀**

Remember: Security is not a feature, it's a requirement. Always think about security from the start!

