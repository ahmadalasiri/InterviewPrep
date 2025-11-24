// XSS Protection Middleware for Express
// Comprehensive XSS prevention middleware

import { Request, Response, NextFunction } from 'express';
import { escape } from 'html-escaper';
import helmet from 'helmet';

// ============================================================================
// 1. CONTENT SECURITY POLICY (CSP) MIDDLEWARE
// ============================================================================

/**
 * Configure Content Security Policy
 * Most effective XSS prevention
 */
export function configureCSP() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          // "'unsafe-inline'", // Avoid if possible
          // "'unsafe-eval'", // Never use
        ],
        styleSrc: ["'self'", "'unsafe-inline'"], // CSS often needs inline
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"], // Block plugins
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"], // Block iframes
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: []
      }
    }
  });
}

// CSP with nonce for inline scripts
export function configureCSPWithNonce() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Generate nonce for this request
    const nonce = Buffer.from(crypto.randomBytes(16)).toString('base64');
    res.locals.nonce = nonce;
    
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            `'nonce-${nonce}'` // Allow scripts with this nonce
          ],
          styleSrc: ["'self'", "'unsafe-inline'"]
        }
      }
    })(req, res, next);
  };
}

// ============================================================================
// 2. XSS FILTER MIDDLEWARE
// ============================================================================

/**
 * Sanitize request parameters, query, and body
 */
export function xssFilter() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    // Sanitize route parameters
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    
    // Sanitize body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    next();
  };
}

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return escapeHTML(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  
  return obj;
}

function escapeHTML(input: string): string {
  return escape(input);
}

// ============================================================================
// 3. OUTPUT ENCODING HELPER
// ============================================================================

/**
 * Helper to encode output based on context
 */
export class OutputEncoder {
  // HTML context
  static html(input: string): string {
    return escape(input);
  }
  
  // HTML attribute context
  static attribute(input: string): string {
    return escape(input).replace(/"/g, '&quot;');
  }
  
  // JavaScript context
  static javascript(input: string): string {
    return JSON.stringify(input);
  }
  
  // URL context
  static url(input: string): string {
    return encodeURIComponent(input);
  }
  
  // CSS context
  static css(input: string): string {
    // Remove dangerous characters
    return input.replace(/[<>'"]/g, '');
  }
}

// ============================================================================
// 4. RESPONSE SANITIZATION MIDDLEWARE
// ============================================================================

/**
 * Sanitize JSON responses
 */
export function sanitizeResponse() {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    
    res.json = function(data: any) {
      const sanitized = sanitizeResponseData(data);
      return originalJson.call(this, sanitized);
    };
    
    next();
  };
}

function sanitizeResponseData(data: any): any {
  if (typeof data === 'string') {
    // Don't escape JSON strings - they're already safe
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponseData(item));
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const key in data) {
      sanitized[key] = sanitizeResponseData(data[key]);
    }
    return sanitized;
  }
  
  return data;
}

// ============================================================================
// 5. COMPREHENSIVE XSS PROTECTION MIDDLEWARE
// ============================================================================

/**
 * Complete XSS protection setup
 */
export function xssProtection() {
  return [
    // Security headers (including CSP)
    configureCSP(),
    
    // XSS filter
    xssFilter(),
    
    // Additional security headers
    helmet.xssFilter(), // Legacy XSS protection
    helmet.noSniff(), // Prevent MIME sniffing
    helmet.frameguard({ action: 'deny' }) // Prevent clickjacking
  ];
}

// ============================================================================
// 6. TEMPLATE ENGINE PROTECTION
// ============================================================================

/**
 * Configure template engine to auto-escape
 * Example for EJS
 */
export function configureTemplateEngine(app: any) {
  // EJS auto-escapes by default with <%= %>
  // Use <%- %> only when you need raw HTML (and sanitize it first)
  
  // Example helper for EJS
  app.locals.escape = (str: string) => escape(str);
  app.locals.sanitize = (html: string) => {
    const DOMPurify = require('isomorphic-dompurify');
    return DOMPurify.sanitize(html);
  };
}

// ============================================================================
// 7. API RESPONSE PROTECTION
// ============================================================================

/**
 * Middleware to ensure API responses are safe
 */
export function apiXSSProtection() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set content type
    res.setHeader('Content-Type', 'application/json');
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
  };
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
import express from 'express';
import { xssProtection, OutputEncoder } from './xss-middleware';

const app = express();

// Apply XSS protection
app.use(xssProtection());

// Example route with safe output
app.get('/user/:name', (req, res) => {
  const name = req.params.name; // Already sanitized by middleware
  
  // Safe HTML output
  res.send(`
    <h1>Welcome ${OutputEncoder.html(name)}</h1>
    <script>
      const userName = ${OutputEncoder.javascript(name)};
    </script>
  `);
});

// JSON API
app.get('/api/user/:name', (req, res) => {
  res.json({
    name: req.params.name, // Safe in JSON context
    message: `Hello ${req.params.name}`
  });
});
*/

export default {
  configureCSP,
  configureCSPWithNonce,
  xssFilter,
  sanitizeResponse,
  xssProtection,
  OutputEncoder,
  apiXSSProtection
};

