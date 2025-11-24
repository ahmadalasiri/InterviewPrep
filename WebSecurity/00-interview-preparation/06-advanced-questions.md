# Advanced Web Security Interview Questions

## OWASP Top 10

### Q1: What is the OWASP Top 10?

**Answer:**

OWASP Top 10 is a list of the most critical web application security risks:

**2021 OWASP Top 10:**
1. **A01:2021 – Broken Access Control**
2. **A02:2021 – Cryptographic Failures**
3. **A03:2021 – Injection**
4. **A04:2021 – Insecure Design**
5. **A05:2021 – Security Misconfiguration**
6. **A06:2021 – Vulnerable and Outdated Components**
7. **A07:2021 – Identification and Authentication Failures**
8. **A08:2021 – Software and Data Integrity Failures**
9. **A09:2021 – Security Logging and Monitoring Failures**
10. **A10:2021 – Server-Side Request Forgery (SSRF)**

**How to address:**
- Regular security audits
- Security training
- Secure coding practices
- Dependency scanning
- Penetration testing

---

### Q2: What is Broken Access Control?

**Answer:**

Broken Access Control allows unauthorized access to resources:

**Examples:**
```typescript
// ❌ Vulnerable: No authorization check
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user); // Any user can access any profile
});

// ✅ Secure: Check authorization
app.get('/api/users/:id', authenticateJWT, async (req, res) => {
  if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = await User.findByPk(req.params.id);
  res.json(user);
});
```

**Common Issues:**
- Missing authorization checks
- Insecure direct object references
- Privilege escalation
- Horizontal/vertical access control failures

---

### Q3: What is SSRF (Server-Side Request Forgery)?

**Answer:**

SSRF forces server to make requests to unintended locations:

**Example:**
```typescript
// ❌ Vulnerable
app.get('/api/fetch', async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url); // Attacker controls URL
  res.json(await response.json());
});

// Attacker sends: /api/fetch?url=http://localhost:6379
// Accesses internal Redis server

// ✅ Secure: Whitelist URLs
const ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com'];

app.get('/api/fetch', async (req, res) => {
  const url = new URL(req.query.url);
  
  if (!ALLOWED_DOMAINS.includes(url.hostname)) {
    return res.status(400).json({ error: 'Invalid domain' });
  }
  
  // Block internal IPs
  if (url.hostname === 'localhost' || url.hostname.startsWith('127.') || url.hostname.startsWith('192.168.')) {
    return res.status(400).json({ error: 'Internal IPs not allowed' });
  }
  
  const response = await fetch(url);
  res.json(await response.json());
});
```

**Prevention:**
- Whitelist allowed domains/IPs
- Block internal IPs
- Use URL parsing and validation
- Implement network segmentation

---

### Q4: What is Insecure Direct Object Reference (IDOR)?

**Answer:**

IDOR allows access to objects by manipulating identifiers:

**Example:**
```typescript
// ❌ Vulnerable
app.get('/api/users/:id', authenticateJWT, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user); // User can access any ID
});

// Attacker: GET /api/users/1 (admin account)

// ✅ Secure: Check ownership
app.get('/api/users/:id', authenticateJWT, async (req, res) => {
  if (req.user.userId !== parseInt(req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = await User.findByPk(req.params.id);
  res.json(user);
});
```

**Prevention:**
- Verify user owns resource
- Use indirect references (maps)
- Implement proper authorization
- Don't expose internal IDs

---

### Q5: What is Security Misconfiguration?

**Answer:**

Security misconfiguration includes:
- Default credentials
- Unnecessary features enabled
- Missing security headers
- Exposed error messages
- Outdated software

**Example:**
```typescript
// ❌ Bad: Default credentials, verbose errors
const app = express();
app.use(express.json());

app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: err.message,
    stack: err.stack // Exposes internal structure
  });
});

// ✅ Good: Secure defaults
import helmet from 'helmet';
app.use(helmet());

app.use(express.json({ limit: '10kb' }));

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

**Checklist:**
- [ ] Remove default accounts
- [ ] Disable unnecessary features
- [ ] Set security headers
- [ ] Use secure defaults
- [ ] Keep software updated
- [ ] Don't expose stack traces

---

### Q6: How do you implement security logging?

**Answer:**

**Security Event Logging:**
```typescript
import winston from 'winston';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

// Log security events
function logSecurityEvent(event: string, details: any) {
  securityLogger.info({
    event,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.userId,
    ...details
  });
}

// Usage
app.post('/api/login', async (req, res) => {
  const user = await authenticateUser(req.body);
  
  if (!user) {
    logSecurityEvent('LOGIN_FAILED', {
      username: req.body.username,
      reason: 'Invalid credentials'
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  logSecurityEvent('LOGIN_SUCCESS', {
    userId: user.id
  });
  
  // ...
});

app.post('/api/sensitive-action', authenticateJWT, (req, res) => {
  logSecurityEvent('SENSITIVE_ACTION', {
    action: 'delete_user',
    targetUserId: req.body.userId
  });
  // ...
});
```

**What to log:**
- Authentication attempts (success/failure)
- Authorization failures
- Sensitive operations
- Input validation failures
- Rate limit violations
- Suspicious patterns

---

### Q7: What is Dependency Scanning?

**Answer:**

Dependency scanning checks for known vulnerabilities in dependencies:

**Tools:**
```bash
# npm audit
npm audit
npm audit fix

# Snyk
npx snyk test
npx snyk monitor

# OWASP Dependency-Check
dependency-check --project myapp --scan ./node_modules
```

**Automated Scanning:**
```json
// package.json
{
  "scripts": {
    "security:audit": "npm audit",
    "security:check": "snyk test"
  }
}
```

**CI/CD Integration:**
```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm audit
      - run: npx snyk test
```

**Best Practices:**
- Scan regularly
- Update dependencies
- Use automated tools
- Review security advisories
- Pin dependency versions

---

### Q8: What is Input Validation vs Sanitization?

**Answer:**

**Input Validation:**
- Checks if input meets criteria
- Rejects invalid input
- Whitelist approach

```typescript
import { z } from 'zod';

const emailSchema = z.string().email();
const validated = emailSchema.parse(input); // Throws if invalid
```

**Sanitization:**
- Modifies input to make it safe
- Removes/escapes dangerous content
- Used when input format is needed

```typescript
import DOMPurify from 'isomorphic-dompurify';
const sanitized = DOMPurify.sanitize(htmlInput);
```

**Best Practice:**
1. **Validate** (reject invalid)
2. **Sanitize** (if needed)
3. **Use parameterized queries** (for databases)

---

### Q9: What is Rate Limiting and why is it important?

**Answer:**

Rate limiting prevents abuse by limiting requests per time period:

**Implementation:**
```typescript
import rateLimit from 'express-rate-limit';

// General rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.use('/api/', limiter);

// Stricter for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/login', authLimiter, loginHandler);
```

**Why it's important:**
- Prevents brute force attacks
- Prevents DDoS
- Protects resources
- Prevents API abuse

---

### Q10: What is Clickjacking?

**Answer:**

Clickjacking tricks users into clicking something different than intended:

**Example:**
```html
<!-- Attacker's page -->
<iframe src="https://bank.com/transfer" style="opacity: 0.01">
</iframe>
<button>Click for free money!</button>
<!-- User clicks button but actually clicks transfer -->
```

**Prevention:**
```typescript
// X-Frame-Options header
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  // or 'SAMEORIGIN' to allow same origin
  next();
});

// Content Security Policy
app.use(helmet({
  frameguard: { action: 'deny' }
}));
```

---

### Q11: What is CORS and how do you configure it securely?

**Answer:**

CORS (Cross-Origin Resource Sharing) controls cross-origin requests:

**Secure Configuration:**
```typescript
import cors from 'cors';

// ❌ Dangerous: Allow all origins
app.use(cors());

// ✅ Secure: Whitelist origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Dynamic origin check
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**CORS Headers:**
- `Access-Control-Allow-Origin`: Allowed origins
- `Access-Control-Allow-Credentials`: Allow cookies
- `Access-Control-Allow-Methods`: Allowed HTTP methods
- `Access-Control-Allow-Headers`: Allowed headers

---

### Q12: What is the difference between encoding, escaping, and sanitization?

**Answer:**

**Encoding (Escaping):**
- Converts special characters to safe representations
- Reversible
- Preserves original data

```typescript
// HTML encoding
"<script>" → "&lt;script&gt;"
```

**Sanitization:**
- Removes dangerous content
- Irreversible
- Modifies data

```typescript
// HTML sanitization
"<script>alert('XSS')</script><p>Hello</p>" → "<p>Hello</p>"
```

**When to use:**
- **Encoding**: Displaying user input as text
- **Sanitization**: Allowing some HTML formatting

---

### Q13: What is a security header and which ones are important?

**Answer:**

Security headers instruct browsers on security behavior:

**Important Headers:**
```typescript
import helmet from 'helmet';

app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  // X-Frame-Options
  frameguard: { action: 'deny' },
  // X-Content-Type-Options
  noSniff: true,
  // X-XSS-Protection (legacy)
  xssFilter: true,
  // Referrer Policy
  referrerPolicy: { policy: 'no-referrer' }
}));
```

**Headers:**
- `Content-Security-Policy`: Controls resource loading
- `Strict-Transport-Security`: Force HTTPS
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `Referrer-Policy`: Control referrer information

---

### Q14: How do you handle secrets and environment variables?

**Answer:**

**Never commit secrets to code!**

**1. Environment Variables:**
```typescript
// .env file (not committed)
JWT_SECRET=your-secret-key
DB_PASSWORD=db-password
API_KEY=api-key

// Load with dotenv
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;
```

**2. Secrets Management:**
```typescript
// AWS Secrets Manager
import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager();
const secret = await secretsManager.getSecretValue({
  SecretId: 'myapp/secrets'
}).promise();

// HashiCorp Vault
import vault from 'node-vault';
const client = vault({ endpoint: 'https://vault.example.com' });
const secret = await client.read('secret/myapp');
```

**3. Best Practices:**
- Use `.env` files (not committed)
- Use secrets management services in production
- Rotate secrets regularly
- Use different secrets per environment
- Never log secrets

---

### Q15: What is a security audit and how do you perform one?

**Answer:**

Security audit identifies vulnerabilities and security issues:

**Steps:**
1. **Code Review**: Review code for security issues
2. **Dependency Scanning**: Check for vulnerable dependencies
3. **Penetration Testing**: Test for vulnerabilities
4. **Configuration Review**: Check security settings
5. **Access Control Review**: Verify authorization

**Tools:**
```bash
# Static Analysis
npm audit
snyk test
eslint-plugin-security

# Dynamic Analysis
OWASP ZAP
Burp Suite
Nessus

# Dependency Scanning
npm audit
snyk test
retire.js
```

**Checklist:**
- [ ] Input validation
- [ ] Authentication/Authorization
- [ ] SQL Injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security headers
- [ ] HTTPS configuration
- [ ] Secrets management
- [ ] Error handling
- [ ] Logging and monitoring

