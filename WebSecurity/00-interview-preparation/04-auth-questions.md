# Authentication & Authorization Interview Questions

## Authentication Fundamentals

### Q1: What is the difference between Authentication and Authorization?

**Answer:**

**Authentication (Who are you?):**
- Verifies user identity
- Confirms user is who they claim to be
- Examples: Login, password verification, biometrics

**Authorization (What can you do?):**
- Determines user permissions
- Controls access to resources
- Examples: Role-based access, permissions, API keys

**Example:**
```typescript
// Authentication: Verify user identity
const user = await authenticate(username, password);
if (!user) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

// Authorization: Check permissions
if (user.role !== 'admin') {
  return res.status(403).json({ error: 'Forbidden' });
}

// User is authenticated AND authorized
res.json({ data: sensitiveData });
```

---

### Q2: How do you securely store passwords?

**Answer:**

**Never store plain text passwords!**

**1. Hashing with bcrypt:**
```typescript
import bcrypt from 'bcrypt';

// Hash password
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**2. Hashing with argon2 (More secure):**
```typescript
import argon2 from 'argon2';

// Hash password
const hashedPassword = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4
});

// Verify password
const isValid = await argon2.verify(hashedPassword, password);
```

**3. Password Requirements:**
```typescript
import { z } from 'zod';

const passwordSchema = z.string()
  .min(12) // Minimum length
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');
```

**Best Practices:**
- Use bcrypt (minimum) or argon2 (recommended)
- Salt rounds: 10-12 for bcrypt
- Never use MD5, SHA1, SHA256 for passwords
- Enforce strong password requirements
- Consider password managers

---

### Q3: What is JWT (JSON Web Token)?

**Answer:**

JWT is a compact, URL-safe token format for securely transmitting information between parties.

**Structure:**
```
header.payload.signature
```

**Example:**
```typescript
import jwt from 'jsonwebtoken';

// Create token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**JWT Parts:**
1. **Header**: Algorithm and token type
2. **Payload**: Claims (user data)
3. **Signature**: Verifies token integrity

**Advantages:**
- Stateless (no server-side storage)
- Scalable
- Works across domains
- Contains user information

**Disadvantages:**
- Can't revoke easily (until expiration)
- Larger than session IDs
- XSS can steal tokens
- Must be stored securely

---

### Q4: How do you implement JWT authentication?

**Answer:**

**1. Login - Issue Token:**
```typescript
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Authenticate user
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});
```

**2. Middleware - Verify Token:**
```typescript
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = decoded;
    next();
  });
}
```

**3. Protected Route:**
```typescript
app.get('/api/profile', authenticateJWT, (req, res) => {
  // req.user contains decoded token data
  res.json({ userId: req.user.userId });
});
```

---

### Q5: How do you handle JWT token refresh?

**Answer:**

**Refresh Token Pattern:**
```typescript
// Login - Issue both access and refresh tokens
app.post('/api/login', async (req, res) => {
  const user = await authenticateUser(req.body);
  
  // Short-lived access token
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  // Long-lived refresh token (stored in database)
  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Store refresh token
  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  
  res.json({ accessToken, refreshToken });
});

// Refresh endpoint
app.post('/api/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  
  // Check if token exists in database
  const stored = await RefreshToken.findOne({
    token: refreshToken,
    userId: decoded.userId
  });
  
  if (!stored || stored.expiresAt < new Date()) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
  
  // Issue new access token
  const accessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  res.json({ accessToken });
});
```

---

### Q6: What is the difference between Sessions and JWT?

**Answer:**

| Aspect | Sessions | JWT |
|--------|----------|-----|
| **Storage** | Server-side (database/memory) | Client-side (localStorage/cookie) |
| **State** | Stateful | Stateless |
| **Revocation** | Easy (delete session) | Hard (wait for expiration) |
| **Size** | Small (session ID) | Larger (contains data) |
| **Scalability** | Requires shared storage | No shared storage needed |
| **Security** | httpOnly cookies | XSS vulnerable if in localStorage |

**Sessions:**
```typescript
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'strict' }
}));

app.post('/login', (req, res) => {
  req.session.userId = user.id;
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // ...
});
```

**JWT:**
```typescript
const token = jwt.sign({ userId: user.id }, secret);
// Client stores token and sends in Authorization header
```

**When to use:**
- **Sessions**: Traditional web apps, need revocation, security critical
- **JWT**: APIs, microservices, stateless requirements

---

### Q7: How do you implement Role-Based Access Control (RBAC)?

**Answer:**

**1. Define Roles and Permissions:**
```typescript
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

const PERMISSIONS = {
  READ_USERS: 'read:users',
  WRITE_USERS: 'write:users',
  DELETE_USERS: 'delete:users',
  MODERATE_CONTENT: 'moderate:content'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MODERATOR]: [PERMISSIONS.READ_USERS, PERMISSIONS.MODERATE_CONTENT],
  [ROLES.USER]: [PERMISSIONS.READ_USERS]
};
```

**2. Middleware:**
```typescript
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}
```

**3. Usage:**
```typescript
// Role-based
app.delete('/api/users/:id', 
  authenticateJWT,
  requireRole(ROLES.ADMIN),
  deleteUser
);

// Permission-based
app.get('/api/users',
  authenticateJWT,
  requirePermission(PERMISSIONS.READ_USERS),
  getUsers
);
```

---

### Q8: What is OAuth2 and how does it work?

**Answer:**

OAuth2 is an authorization framework that allows third-party applications to access user resources without exposing passwords.

**OAuth2 Flow:**
1. User clicks "Login with Google"
2. App redirects to Google authorization server
3. User authenticates with Google
4. Google redirects back with authorization code
5. App exchanges code for access token
6. App uses access token to access user resources

**Implementation:**
```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Step 1: Get authorization URL
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email']
  });
  res.redirect(url);
});

// Step 2: Handle callback
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  // Exchange code for tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  
  // Get user info
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  
  // Create or update user
  let user = await User.findOne({ googleId: data.id });
  if (!user) {
    user = await User.create({
      googleId: data.id,
      email: data.email,
      name: data.name
    });
  }
  
  // Create session or JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});
```

---

### Q9: How do you prevent session hijacking?

**Answer:**

**1. Use Secure Cookies:**
```typescript
app.use(session({
  secret: 'secret',
  cookie: {
    httpOnly: true, // Prevents JavaScript access
    secure: true, // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));
```

**2. Regenerate Session ID:**
```typescript
app.post('/login', async (req, res) => {
  const user = await authenticateUser(req.body);
  
  // Regenerate session ID after login
  req.session.regenerate((err) => {
    if (err) throw err;
    
    req.session.userId = user.id;
    res.json({ success: true });
  });
});
```

**3. Bind Session to IP:**
```typescript
app.use((req, res, next) => {
  if (req.session.userId) {
    if (req.session.ip !== req.ip) {
      // IP changed - invalidate session
      req.session.destroy();
      return res.status(401).json({ error: 'Session invalidated' });
    }
  } else {
    req.session.ip = req.ip;
  }
  next();
});
```

**4. Use Strong Session Secrets:**
```typescript
const sessionSecret = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: sessionSecret
}));
```

**5. Implement Session Timeout:**
```typescript
app.use((req, res, next) => {
  if (req.session.lastActivity) {
    const timeout = 30 * 60 * 1000; // 30 minutes
    if (Date.now() - req.session.lastActivity > timeout) {
      req.session.destroy();
      return res.status(401).json({ error: 'Session expired' });
    }
  }
  req.session.lastActivity = Date.now();
  next();
});
```

---

### Q10: What is Multi-Factor Authentication (MFA)?

**Answer:**

MFA requires users to provide multiple forms of authentication:

**Factors:**
1. **Something you know**: Password, PIN
2. **Something you have**: Phone, hardware token
3. **Something you are**: Biometric (fingerprint, face)

**TOTP (Time-based One-Time Password) Implementation:**
```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Generate secret for user
app.post('/api/mfa/setup', authenticateJWT, (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `MyApp (${req.user.email})`
  });
  
  // Store secret (temporarily, until verified)
  req.session.mfaSecret = secret.base32;
  
  // Generate QR code
  QRCode.toDataURL(secret.otpauth_url, (err, dataURL) => {
    res.json({ qrCode: dataURL, secret: secret.base32 });
  });
});

// Verify and enable MFA
app.post('/api/mfa/verify', authenticateJWT, async (req, res) => {
  const { token } = req.body;
  const secret = req.session.mfaSecret;
  
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps tolerance
  });
  
  if (verified) {
    // Store secret in user record
    await User.update(
      { mfaSecret: secret },
      { where: { id: req.user.userId } }
    );
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid token' });
  }
});

// Login with MFA
app.post('/api/login', async (req, res) => {
  const { username, password, mfaToken } = req.body;
  
  const user = await authenticateUser(username, password);
  
  if (user.mfaSecret) {
    // Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaToken
    });
    
    if (!verified) {
      return res.status(401).json({ error: 'Invalid MFA token' });
    }
  }
  
  // Issue token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});
```

---

### Q11: How do you implement password reset securely?

**Answer:**

**Secure Password Reset Flow:**
```typescript
import crypto from 'crypto';

// Step 1: Request password reset
app.post('/api/password/reset-request', async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists
    return res.json({ message: 'If email exists, reset link sent' });
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  
  // Store token
  await User.update(
    {
      resetToken: await bcrypt.hash(resetToken, 10),
      resetTokenExpiry
    },
    { where: { id: user.id } }
  );
  
  // Send email with reset link
  const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
  await sendEmail(user.email, 'Password Reset', resetLink);
  
  res.json({ message: 'If email exists, reset link sent' });
});

// Step 2: Reset password
app.post('/api/password/reset', async (req, res) => {
  const { token, newPassword } = req.body;
  
  // Find user with valid token
  const users = await User.findAll();
  let user = null;
  
  for (const u of users) {
    if (u.resetToken && u.resetTokenExpiry > new Date()) {
      const isValid = await bcrypt.compare(token, u.resetToken);
      if (isValid) {
        user = u;
        break;
      }
    }
  }
  
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  
  // Validate new password
  const passwordSchema = z.string().min(12);
  passwordSchema.parse(newPassword);
  
  // Update password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.update(
    {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    },
    { where: { id: user.id } }
  );
  
  res.json({ message: 'Password reset successful' });
});
```

**Security Considerations:**
- Use cryptographically random tokens
- Set expiration (1 hour typical)
- Hash tokens in database
- Rate limit reset requests
- Don't reveal if email exists
- Require strong new password

---

### Q12: What is the difference between httpOnly and secure cookie flags?

**Answer:**

**httpOnly:**
- Prevents JavaScript from accessing cookie
- Protects against XSS attacks
- Cookie only accessible via HTTP requests

```typescript
cookie: {
  httpOnly: true // document.cookie cannot access this
}
```

**secure:**
- Cookie only sent over HTTPS
- Protects against man-in-the-middle attacks
- Required in production

```typescript
cookie: {
  secure: true // Only sent over HTTPS
}
```

**Best Practice:**
```typescript
cookie: {
  httpOnly: true, // Prevent XSS
  secure: process.env.NODE_ENV === 'production', // HTTPS only
  sameSite: 'strict' // CSRF protection
}
```

---

### Q13: How do you implement API key authentication?

**Answer:**

**API keys identify and authenticate API clients:

**1. Generate API Key:**
```typescript
import crypto from 'crypto';

app.post('/api/keys/generate', authenticateJWT, async (req, res) => {
  const apiKey = crypto.randomBytes(32).toString('hex');
  const hashedKey = await bcrypt.hash(apiKey, 10);
  
  await ApiKey.create({
    userId: req.user.userId,
    keyHash: hashedKey,
    name: req.body.name
  });
  
  // Return key only once
  res.json({ apiKey }); // Store this securely!
});
```

**2. Authenticate with API Key:**
```typescript
async function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  const keys = await ApiKey.findAll({ where: { active: true } });
  
  for (const key of keys) {
    const isValid = await bcrypt.compare(apiKey, key.keyHash);
    if (isValid) {
      req.user = { userId: key.userId, type: 'api' };
      return next();
    }
  }
  
  res.status(401).json({ error: 'Invalid API key' });
}

app.get('/api/data', authenticateAPIKey, (req, res) => {
  res.json({ data: 'sensitive data' });
});
```

**3. Rate Limiting by API Key:**
```typescript
const rateLimitByKey = new Map();

function rateLimitAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const key = `api:${apiKey}`;
  
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;
  
  const requests = rateLimitByKey.get(key) || [];
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  recentRequests.push(now);
  rateLimitByKey.set(key, recentRequests);
  next();
}
```

---

### Q14: How do you handle token expiration and refresh?

**Answer:**

**Token Expiration Strategy:**
```typescript
// Issue tokens with expiration
const accessToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' } // Short-lived
);

const refreshToken = jwt.sign(
  { userId: user.id, type: 'refresh' },
  process.env.REFRESH_SECRET,
  { expiresIn: '7d' } // Long-lived
);

// Middleware to handle expiration
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Client handles expiration
// If 401 with TOKEN_EXPIRED, use refresh token to get new access token
```

---

### Q15: How do you implement logout with JWT?

**Answer:**

**Problem:** JWT is stateless, can't be "deleted" from server

**Solutions:**

**1. Token Blacklist:**
```typescript
const tokenBlacklist = new Set();

app.post('/api/logout', authenticateJWT, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  tokenBlacklist.add(token);
  res.json({ message: 'Logged out' });
});

// Check blacklist in middleware
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  
  // ... verify token
}
```

**2. Short Token Expiration + Refresh:**
```typescript
// Access tokens expire quickly (15 minutes)
// On logout, delete refresh token
app.post('/api/logout', authenticateJWT, async (req, res) => {
  await RefreshToken.destroy({
    where: { userId: req.user.userId }
  });
  res.json({ message: 'Logged out' });
});
```

**3. Store Tokens in Database:**
```typescript
// Store active tokens
await Token.create({
  userId: user.id,
  token: accessToken,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000)
});

// On logout, delete token
app.post('/api/logout', authenticateJWT, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  await Token.destroy({ where: { token } });
  res.json({ message: 'Logged out' });
});
```

