# HTTPS & SSL/TLS Interview Questions

## HTTPS Fundamentals

### Q1: What is HTTPS and why is it important?

**Answer:**

HTTPS (HTTP Secure) is HTTP over SSL/TLS encryption. It provides:
- **Encryption**: Data is encrypted in transit
- **Authentication**: Verifies server identity
- **Integrity**: Detects data tampering

**Why it's important:**
- Protects sensitive data (passwords, credit cards)
- Prevents man-in-the-middle attacks
- Required for modern web features (Service Workers, etc.)
- SEO ranking factor
- User trust indicator

**Example:**
```typescript
// HTTP (insecure)
http://example.com/login
// Data sent in plain text

// HTTPS (secure)
https://example.com/login
// Data encrypted with TLS
```

---

### Q2: How does SSL/TLS work?

**Answer:**

**TLS Handshake Process:**

1. **Client Hello**: Client sends supported cipher suites
2. **Server Hello**: Server selects cipher suite and sends certificate
3. **Certificate Verification**: Client verifies server certificate
4. **Key Exchange**: Client and server exchange keys
5. **Encryption**: Symmetric encryption established
6. **Data Transfer**: Encrypted data exchange

**Simplified Flow:**
```
Client → Server: "Hello, I support TLS 1.3"
Server → Client: "Hello, here's my certificate, let's use AES-256"
Client: Verifies certificate
Client → Server: "Here's encrypted session key"
Server: Decrypts session key
Both: Now using symmetric encryption
```

---

### Q3: How do you configure HTTPS in Node.js/Express?

**Answer:**

**1. Using HTTPS Module:**
```typescript
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS server running on port 443');
});
```

**2. Using Reverse Proxy (Nginx):**
```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private-key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

**3. Redirect HTTP to HTTPS:**
```typescript
import http from 'http';

// HTTP server - redirect to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, {
    Location: `https://${req.headers.host}${req.url}`
  });
  res.end();
}).listen(80);
```

---

### Q4: What is a Certificate Authority (CA)?

**Answer:**

A Certificate Authority issues and verifies SSL/TLS certificates. They:
- Verify domain ownership
- Issue signed certificates
- Maintain certificate revocation lists

**Types of Certificates:**
1. **DV (Domain Validated)**: Basic, verifies domain ownership
2. **OV (Organization Validated)**: Verifies organization
3. **EV (Extended Validated)**: Highest validation, shows green bar

**Popular CAs:**
- Let's Encrypt (free, automated)
- DigiCert
- GlobalSign
- Sectigo

**Self-Signed Certificates:**
```typescript
// For development only
import { execSync } from 'child_process';

// Generate self-signed certificate
execSync('openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=localhost"');
```

---

### Q5: How do you get a free SSL certificate (Let's Encrypt)?

**Answer:**

**Using Certbot:**
```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d example.com -d www.example.com

# Certificates stored in:
# /etc/letsencrypt/live/example.com/fullchain.pem
# /etc/letsencrypt/live/example.com/privkey.pem
```

**Auto-renewal:**
```bash
# Add to crontab
0 0 * * * certbot renew --quiet
```

**Using in Node.js:**
```typescript
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/example.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/example.com/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

---

### Q6: What are the security headers for HTTPS?

**Answer:**

**1. Strict-Transport-Security (HSTS):**
```typescript
app.use((req, res, next) => {
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  next();
});
```

**2. Content-Security-Policy:**
```typescript
res.setHeader('Content-Security-Policy',
  "default-src 'self'; script-src 'self' 'unsafe-inline'"
);
```

**3. X-Frame-Options:**
```typescript
res.setHeader('X-Frame-Options', 'DENY');
```

**4. X-Content-Type-Options:**
```typescript
res.setHeader('X-Content-Type-Options', 'nosniff');
```

**Using Helmet:**
```typescript
import helmet from 'helmet';

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

### Q7: What is HSTS (HTTP Strict Transport Security)?

**Answer:**

HSTS forces browsers to use HTTPS for a domain:

**How it works:**
1. Server sends HSTS header
2. Browser stores HSTS policy
3. Future requests automatically use HTTPS
4. Prevents downgrade attacks

**Implementation:**
```typescript
app.use((req, res, next) => {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  next();
});
```

**Parameters:**
- `max-age`: How long to enforce (seconds)
- `includeSubDomains`: Apply to all subdomains
- `preload`: Include in browser preload list

---

### Q8: What is a man-in-the-middle attack?

**Answer:**

MITM attack intercepts communication between client and server:

**How it works:**
1. Attacker positions between client and server
2. Intercepts encrypted traffic
3. Decrypts, modifies, or reads data
4. Re-encrypts and forwards

**Prevention:**
- HTTPS (encryption)
- Certificate pinning
- HSTS
- Verify certificate validity

**Example:**
```
Client → Attacker → Server
  ↓         ↓         ↓
Encrypted  Decrypt  Encrypted
           Modify
           Re-encrypt
```

---

### Q9: What is certificate pinning?

**Answer:**

Certificate pinning binds a host to expected certificate:

**Implementation:**
```typescript
import https from 'https';
import crypto from 'crypto';

const expectedFingerprint = 'SHA256:...'; // Your certificate fingerprint

const agent = new https.Agent({
  checkServerIdentity: (servername, cert) => {
    const fingerprint = crypto
      .createHash('sha256')
      .update(cert.raw)
      .digest('base64');
    
    if (fingerprint !== expectedFingerprint) {
      throw new Error('Certificate fingerprint mismatch');
    }
  }
});

https.get('https://api.example.com', { agent }, (res) => {
  // Request only succeeds if certificate matches
});
```

**Trade-offs:**
- **Pros**: Prevents MITM even with compromised CA
- **Cons**: Difficult certificate updates, can break app

---

### Q10: How do you handle mixed content?

**Answer:**

Mixed content occurs when HTTPS page loads HTTP resources:

**Types:**
1. **Active Mixed Content**: Scripts, stylesheets, iframes (blocked)
2. **Passive Mixed Content**: Images, audio, video (warned)

**Prevention:**
```typescript
// Use protocol-relative URLs (not recommended)
<img src="//example.com/image.jpg">

// Use HTTPS URLs
<img src="https://example.com/image.jpg">

// Use Content Security Policy
res.setHeader('Content-Security-Policy',
  "default-src https:; img-src https: data:"
);
```

**Upgrade Insecure Requests:**
```typescript
res.setHeader('Content-Security-Policy',
  "upgrade-insecure-requests"
);
// Automatically upgrades HTTP to HTTPS
```

---

### Q11: What is Perfect Forward Secrecy?

**Answer:**

PFS ensures past communications remain secure even if private key is compromised:

**How it works:**
- Each session uses unique key
- Keys are ephemeral (not stored)
- Compromised private key can't decrypt past sessions

**Configuration:**
```typescript
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    '!aNULL',
    '!eNULL',
    '!EXPORT',
    '!DES',
    '!RC4',
    '!MD5',
    '!PSK',
    '!SRP',
    '!CAMELLIA'
  ].join(':'),
  honorCipherOrder: true
};
```

**Modern TLS (1.3) has PFS by default**

---

### Q12: How do you test HTTPS configuration?

**Answer:**

**1. SSL Labs SSL Test:**
- Visit: https://www.ssllabs.com/ssltest/
- Enter your domain
- Get security rating

**2. Command Line:**
```bash
# Check certificate
openssl s_client -connect example.com:443

# Check cipher suites
nmap --script ssl-enum-ciphers -p 443 example.com

# Test TLS version
openssl s_client -connect example.com:443 -tls1_3
```

**3. Node.js Test:**
```typescript
import https from 'https';

https.get('https://example.com', (res) => {
  console.log('TLS Version:', res.socket.getProtocol());
  console.log('Cipher:', res.socket.getCipher());
});
```

**4. Check Headers:**
```bash
curl -I https://example.com
```

---

### Q13: What are the TLS version differences?

**Answer:**

**TLS 1.0/1.1:**
- Deprecated, insecure
- Vulnerable to attacks

**TLS 1.2:**
- Widely supported
- Secure with proper configuration
- Supports PFS

**TLS 1.3:**
- Latest version
- Faster handshake
- PFS by default
- Removed insecure features

**Configuration:**
```typescript
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  minVersion: 'TLSv1.2', // Minimum TLS 1.2
  maxVersion: 'TLSv1.3'   // Maximum TLS 1.3
};
```

---

### Q14: How do you handle certificate expiration?

**Answer:**

**1. Monitor Expiration:**
```typescript
import https from 'https';

function checkCertificate(hostname: string, port: number = 443) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      port,
      method: 'HEAD',
      agent: new https.Agent({ rejectUnauthorized: false })
    }, (res) => {
      const cert = res.socket.getPeerCertificate();
      const expires = new Date(cert.valid_to);
      const daysUntilExpiry = (expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      
      resolve({
        expires,
        daysUntilExpiry,
        isValid: daysUntilExpiry > 0
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Check weekly
setInterval(async () => {
  const cert = await checkCertificate('example.com');
  if (cert.daysUntilExpiry < 30) {
    // Alert: Certificate expiring soon
    sendAlert(`Certificate expires in ${cert.daysUntilExpiry} days`);
  }
}, 7 * 24 * 60 * 60 * 1000);
```

**2. Auto-renewal (Let's Encrypt):**
```bash
# Certbot auto-renewal
0 0 * * * certbot renew --quiet --deploy-hook "systemctl reload nginx"
```

---

### Q15: What is OCSP stapling?

**Answer:**

OCSP (Online Certificate Status Protocol) stapling improves performance:

**How it works:**
1. Server queries OCSP responder
2. Gets signed response
3. "Staples" response to TLS handshake
4. Client doesn't need to query OCSP

**Benefits:**
- Faster (no client OCSP query)
- Better privacy (OCSP responder doesn't see client IP)
- Reduced load on OCSP servers

**Configuration (Nginx):**
```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /path/to/chain.pem;
```

**Node.js doesn't support OCSP stapling directly - use reverse proxy**

