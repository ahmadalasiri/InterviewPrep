// Security Best Practices in Node.js

console.log("=== Node.js Security Best Practices ===\n");

// 1. Introduction to Node.js Security
console.log("--- Security Overview ---");

/*
Node.js Security Pillars:

1. Dependency Security
   - Third-party packages vulnerabilities
   - Supply chain attacks
   - Outdated dependencies

2. Input Validation
   - User input sanitization
   - SQL/NoSQL injection prevention
   - XSS prevention

3. Authentication & Authorization
   - Password security
   - JWT handling
   - Session management

4. Data Protection
   - Encryption
   - Secure storage
   - Data leakage prevention

5. Application Security
   - Code injection
   - Path traversal
   - Prototype pollution

6. Infrastructure Security
   - Environment variables
   - HTTPS/TLS
   - Security headers

Common Vulnerabilities:
- Injection attacks (SQL, NoSQL, Command)
- Broken authentication
- Sensitive data exposure
- XML External Entities (XXE)
- Broken access control
- Security misconfiguration
- Cross-Site Scripting (XSS)
- Insecure deserialization
- Using components with known vulnerabilities
- Insufficient logging & monitoring
*/

console.log("✓ Security concepts explained");

// 2. Dependency Security
console.log("\n--- Dependency Security ---");

/*
Best Practices:

1. Audit dependencies regularly:
   npm audit
   npm audit fix
   
2. Use lock files:
   - package-lock.json (npm)
   - yarn.lock (yarn)
   
3. Tools for vulnerability scanning:
   - npm audit
   - Snyk (snyk test)
   - WhiteSource
   - OWASP Dependency-Check
   - GitHub Dependabot

4. Keep dependencies updated:
   npm outdated
   npm update
   npm-check-updates

5. Minimize dependencies:
   - Review necessity of each package
   - Consider package size and maintenance
   - Avoid packages with many subdependencies
*/

// Example: Checking package security
function dependencySecurity() {
  console.log("Dependency security practices:");

  /*
  // Check for vulnerabilities
  npm audit
  
  // Fix automatically fixable vulnerabilities
  npm audit fix
  
  // Force fix (may break)
  npm audit fix --force
  
  // Generate detailed report
  npm audit --json > audit-report.json
  
  // Check for outdated packages
  npm outdated
  
  // Update to latest versions
  npm update
  
  // Using Snyk
  npm install -g snyk
  snyk test
  snyk wizard
  snyk monitor
  */

  console.log("✓ Dependency security commands documented");
}

// Example: Package validation
function validatePackage() {
  console.log("\nPackage validation:");

  const packageChecklist = {
    beforeInstalling: [
      "Check npm weekly downloads",
      "Review GitHub stars and activity",
      "Check last published date",
      "Review open issues",
      "Check for license",
      "Review dependencies count",
      "Check maintainers",
      "Review security advisories",
    ],
    afterInstalling: [
      "Run npm audit",
      "Review package.json scripts",
      "Check for postinstall scripts",
      "Review actual code (for critical packages)",
    ],
  };

  console.log("Package validation checklist:");
  console.log(JSON.stringify(packageChecklist, null, 2));
}

console.log("✓ Dependency security practices created");

// 3. Input Validation and Sanitization
console.log("\n--- Input Validation ---");

// Example: Input validation
function inputValidation() {
  const validator = require("validator"); // Would need to install

  console.log("Input validation examples:");

  // Email validation
  function validateEmail(email) {
    // Using validator library
    // return validator.isEmail(email);

    // Or manual regex (less reliable)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // String sanitization
  function sanitizeString(input) {
    // Remove HTML tags
    return input.replace(/<[^>]*>/g, "");
  }

  // Number validation
  function validateNumber(value, min, max) {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  }

  // URL validation
  function validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  console.log("✓ Input validation functions created");
}

// Example: SQL Injection Prevention
function preventSQLInjection() {
  console.log("\nSQL Injection prevention:");

  /*
  BAD - Vulnerable to SQL Injection:
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.query(query);
  
  GOOD - Using parameterized queries:
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId]);
  
  GOOD - Using ORM (Sequelize example):
  const user = await User.findOne({
    where: { id: userId }
  });
  */

  const sqlBestPractices = [
    "Use parameterized queries or prepared statements",
    "Use ORM/ODM libraries (Sequelize, TypeORM, Mongoose)",
    "Validate and sanitize all input",
    "Use least privilege database accounts",
    "Never concatenate user input into queries",
    "Implement input validation whitelist",
  ];

  console.log("SQL Injection prevention:", sqlBestPractices);
}

// Example: NoSQL Injection Prevention
function preventNoSQLInjection() {
  console.log("\nNoSQL Injection prevention:");

  /*
  BAD - Vulnerable to NoSQL Injection:
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // If attacker sends: {"username": {"$ne": null}, "password": {"$ne": null}}
    User.findOne({ username, password }, callback);
  });
  
  GOOD - Validate input types:
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Ensure they are strings
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).send('Invalid input');
    }
    
    User.findOne({ username, password }, callback);
  });
  
  GOOD - Sanitize MongoDB queries:
  const mongoSanitize = require('express-mongo-sanitize');
  app.use(mongoSanitize());
  */

  console.log("✓ NoSQL injection prevention demonstrated");
}

// Example: XSS Prevention
function preventXSS() {
  console.log("\nXSS (Cross-Site Scripting) prevention:");

  /*
  BAD - Vulnerable to XSS:
  app.get('/search', (req, res) => {
    const query = req.query.q;
    res.send(`<h1>Results for: ${query}</h1>`);
  });
  
  GOOD - Escape output:
  const escapeHtml = require('escape-html');
  app.get('/search', (req, res) => {
    const query = escapeHtml(req.query.q);
    res.send(`<h1>Results for: ${query}</h1>`);
  });
  
  GOOD - Use template engines with auto-escaping:
  app.set('view engine', 'ejs'); // or pug, handlebars
  app.get('/search', (req, res) => {
    res.render('search', { query: req.query.q }); // Auto-escaped
  });
  
  GOOD - Content Security Policy:
  const helmet = require('helmet');
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }));
  */

  // Manual HTML escaping function
  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  console.log("✓ XSS prevention techniques documented");
}

console.log("✓ Input validation examples created");

// 4. Authentication and Authorization
console.log("\n--- Authentication & Authorization ---");

// Example: Password Security
function passwordSecurity() {
  const crypto = require("crypto");
  const bcrypt = require("bcrypt"); // Would need to install

  console.log("Password security:");

  // NEVER store plain passwords
  // BAD: password = "mypassword123"

  // GOOD: Hash with bcrypt
  async function hashPassword(password) {
    const saltRounds = 12; // Higher = more secure but slower
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

  async function verifyPassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
  }

  // Password strength validation
  function validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  console.log("✓ Password security functions created");
}

// Example: JWT Security
function jwtSecurity() {
  console.log("\nJWT (JSON Web Token) security:");

  /*
  JWT Best Practices:
  
  1. Store secret securely:
  const JWT_SECRET = process.env.JWT_SECRET; // Use env variables
  
  2. Set appropriate expiration:
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '1h' } // Short-lived tokens
  );
  
  3. Use refresh tokens:
  const accessToken = jwt.sign(payload, SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
  
  4. Validate and verify:
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Use decoded.userId
  } catch (error) {
    // Invalid token
  }
  
  5. Use HTTPS only:
  res.cookie('token', token, {
    httpOnly: true,    // Prevent XSS
    secure: true,      // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000    // 1 hour
  });
  
  6. Implement token blacklist for logout:
  const blacklistedTokens = new Set();
  
  function logout(token) {
    blacklistedTokens.add(token);
  }
  
  function isBlacklisted(token) {
    return blacklistedTokens.has(token);
  }
  */

  const jwtBestPractices = [
    "Never store sensitive data in JWT payload",
    "Use strong, random secrets (min 256 bits)",
    "Set appropriate expiration times",
    "Validate token signature",
    "Use HTTPS only",
    "Store tokens securely (httpOnly cookies)",
    "Implement token refresh mechanism",
    "Revoke tokens on logout",
  ];

  console.log("JWT best practices:", jwtBestPractices);
}

// Example: Session Security
function sessionSecurity() {
  console.log("\nSession security:");

  /*
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const redis = require('redis');
  
  const redisClient = redis.createClient();
  
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,        // HTTPS only
      httpOnly: true,      // Prevent XSS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'strict'   // CSRF protection
    },
    name: 'sessionId'      // Don't use default name
  }));
  */

  const sessionBestPractices = [
    "Use secure session storage (Redis, database)",
    "Set httpOnly and secure flags",
    "Use strong session secrets",
    "Implement session timeout",
    "Regenerate session ID on login",
    "Clear session on logout",
    "Use CSRF tokens",
  ];

  console.log("Session best practices:", sessionBestPractices);
}

console.log("✓ Authentication examples created");

// 5. Data Protection and Encryption
console.log("\n--- Data Protection ---");

// Example: Encryption
function encryptionExamples() {
  const crypto = require("crypto");

  console.log("Encryption examples:");

  // AES encryption
  class AESEncryption {
    constructor(secret) {
      this.algorithm = "aes-256-cbc";
      this.key = crypto.scryptSync(secret, "salt", 32);
    }

    encrypt(text) {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      return iv.toString("hex") + ":" + encrypted;
    }

    decrypt(encryptedText) {
      const parts = encryptedText.split(":");
      const iv = Buffer.from(parts[0], "hex");
      const encrypted = parts[1];

      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    }
  }

  // Usage example
  const secret = process.env.ENCRYPTION_KEY || "your-secret-key";
  const aes = new AESEncryption(secret);

  const plaintext = "Sensitive data";
  const encrypted = aes.encrypt(plaintext);
  const decrypted = aes.decrypt(encrypted);

  console.log("Encryption demonstrated");
}

// Example: Hashing
function hashingExamples() {
  const crypto = require("crypto");

  console.log("\nHashing examples:");

  // SHA-256 hash
  function hashSHA256(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  // HMAC (Hash-based Message Authentication Code)
  function createHMAC(data, secret) {
    return crypto.createHmac("sha256", secret).update(data).digest("hex");
  }

  // Verify HMAC
  function verifyHMAC(data, secret, receivedHMAC) {
    const expectedHMAC = createHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(expectedHMAC),
      Buffer.from(receivedHMAC)
    );
  }

  console.log("✓ Hashing functions created");
}

// Example: Secure data storage
function secureStorage() {
  console.log("\nSecure data storage:");

  const bestPractices = [
    "Encrypt sensitive data at rest",
    "Use environment variables for secrets",
    "Never commit secrets to version control",
    "Use secret management services (AWS Secrets Manager, HashiCorp Vault)",
    "Implement proper access controls",
    "Regular security audits",
    "Encrypt database connections (SSL/TLS)",
    "Backup encryption keys securely",
  ];

  console.log("Storage best practices:", bestPractices);
}

console.log("✓ Data protection examples created");

// 6. Security Headers
console.log("\n--- Security Headers ---");

function securityHeaders() {
  console.log("HTTP security headers:");

  /*
  // Using Helmet.js
  const helmet = require('helmet');
  app.use(helmet());
  
  // Or configure individually:
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());
  
  // Manual implementation:
  app.use((req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // HTTPS enforcement
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'no-referrer');
    
    // Permissions Policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  });
  */

  const importantHeaders = {
    "Strict-Transport-Security": "Enforces HTTPS",
    "X-Frame-Options": "Prevents clickjacking",
    "X-Content-Type-Options": "Prevents MIME sniffing",
    "Content-Security-Policy": "Prevents XSS and injection",
    "X-XSS-Protection": "Browser XSS filter",
    "Referrer-Policy": "Controls referrer information",
    "Permissions-Policy": "Controls browser features",
  };

  console.log("Important security headers:", importantHeaders);
}

console.log("✓ Security headers documented");

// 7. Rate Limiting and DDoS Protection
console.log("\n--- Rate Limiting ---");

function rateLimiting() {
  console.log("Rate limiting implementation:");

  /*
  // Using express-rate-limit
  const rateLimit = require('express-rate-limit');
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use('/api/', limiter);
  
  // Stricter limit for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true
  });
  
  app.use('/api/auth/login', authLimiter);
  
  // Using Redis for distributed rate limiting
  const RedisStore = require('rate-limit-redis');
  const redis = require('redis');
  
  const client = redis.createClient();
  
  const limiter = rateLimit({
    store: new RedisStore({
      client: client,
      prefix: 'rate-limit:'
    }),
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  */

  console.log("✓ Rate limiting patterns documented");
}

// Example: Simple rate limiter implementation
class SimpleRateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const recentRequests = userRequests.filter(
      (time) => now - time < this.windowMs
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  reset(identifier) {
    this.requests.delete(identifier);
  }
}

console.log("✓ Rate limiting examples created");

// 8. Secure File Uploads
console.log("\n--- File Upload Security ---");

function fileUploadSecurity() {
  console.log("File upload security:");

  /*
  const multer = require('multer');
  const path = require('path');
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // Accept images only
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1
    },
    fileFilter: fileFilter
  });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    // Additional validation
    const file = req.file;
    
    // Verify file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];
    if (!allowedExts.includes(ext)) {
      fs.unlinkSync(file.path);
      return res.status(400).send('Invalid file type');
    }
    
    // Scan for malware (using ClamAV or similar)
    // scanFile(file.path);
    
    res.send('File uploaded successfully');
  });
  */

  const uploadBestPractices = [
    "Validate file type (MIME type and extension)",
    "Limit file size",
    "Generate random filenames",
    "Store outside webroot",
    "Scan for malware",
    "Use Content-Disposition header",
    "Implement access controls",
    "Validate file content, not just extension",
  ];

  console.log("Upload best practices:", uploadBestPractices);
}

console.log("✓ File upload security documented");

// 9. Environment and Configuration Security
console.log("\n--- Environment Security ---");

function environmentSecurity() {
  console.log("Environment configuration security:");

  /*
  // .env file (NEVER commit to version control)
  DATABASE_URL=postgresql://user:password@localhost:5432/db
  JWT_SECRET=your-super-secret-jwt-key
  ENCRYPTION_KEY=your-encryption-key
  API_KEY=your-api-key
  
  // Load environment variables
  require('dotenv').config();
  
  // Access variables
  const dbUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  
  // Validate required env variables
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'ENCRYPTION_KEY'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
  */

  const envBestPractices = [
    "Use .env files for local development",
    "Never commit .env files",
    "Add .env to .gitignore",
    "Use different configs for dev/staging/prod",
    "Validate required variables on startup",
    "Use secret management services in production",
    "Rotate secrets regularly",
    "Limit access to environment variables",
  ];

  console.log("Environment best practices:", envBestPractices);
}

console.log("✓ Environment security documented");

// 10. Security Checklist
console.log("\n--- Security Checklist ---");

const securityChecklist = {
  dependencies: [
    "Run npm audit regularly",
    "Keep dependencies updated",
    "Review package.json for unused packages",
    "Use lock files (package-lock.json)",
    "Enable Dependabot or Snyk",
  ],
  input: [
    "Validate all user input",
    "Sanitize HTML output",
    "Use parameterized queries",
    "Prevent command injection",
    "Implement CSRF protection",
  ],
  authentication: [
    "Hash passwords with bcrypt",
    "Implement password strength requirements",
    "Use JWT with expiration",
    "Implement secure session management",
    "Enable 2FA where possible",
  ],
  authorization: [
    "Implement proper access controls",
    "Validate user permissions",
    "Use principle of least privilege",
    "Implement role-based access control",
  ],
  data: [
    "Encrypt sensitive data at rest",
    "Use HTTPS for data in transit",
    "Implement proper key management",
    "Regular backups with encryption",
  ],
  headers: [
    "Use Helmet.js",
    "Implement CSP",
    "Set security headers",
    "Enable HSTS",
  ],
  rateLimit: [
    "Implement rate limiting",
    "Protect against DDoS",
    "Monitor for suspicious activity",
  ],
  logging: [
    "Log security events",
    "Don't log sensitive data",
    "Implement log monitoring",
    "Set up alerts for security events",
  ],
  deployment: [
    "Use environment variables",
    "Disable debug mode in production",
    "Keep Node.js updated",
    "Use security scanning tools",
    "Regular security audits",
  ],
};

console.log("\nComprehensive Security Checklist:");
console.log(JSON.stringify(securityChecklist, null, 2));

console.log("\n✓ Security module completed");

/*
Additional Resources:
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/
- npm Security: https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities
- Express Security: https://expressjs.com/en/advanced/best-practice-security.html
- Helmet.js: https://helmetjs.github.io/
- Node.js Security Checklist: https://blog.risingstack.com/node-js-security-checklist/
*/
