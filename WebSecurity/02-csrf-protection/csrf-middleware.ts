// CSRF Protection Middleware for Express
// Comprehensive CSRF prevention

import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

// ============================================================================
// 1. CSRF TOKEN MIDDLEWARE (Using csurf library)
// ============================================================================

/**
 * Setup CSRF protection with csurf
 * Requires cookie-parser and session
 */
export function setupCSRFProtection() {
  // Must use cookie-parser first
  const cookieMiddleware = cookieParser();
  
  // CSRF protection
  const csrfProtection = csrf({ 
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
  });
  
  return {
    cookieMiddleware,
    csrfProtection,
    
    // Get CSRF token endpoint
    getToken: (req: Request, res: Response) => {
      res.json({ csrfToken: req.csrfToken() });
    },
    
    // Error handler
    errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => {
      if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ error: 'Invalid CSRF token' });
      } else {
        next(err);
      }
    }
  };
}

// ============================================================================
// 2. DOUBLE SUBMIT COOKIE PATTERN
// ============================================================================

/**
 * Double Submit Cookie CSRF protection
 * Stateless alternative to session-based tokens
 */
export function doubleSubmitCookie() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set CSRF cookie if not exists
    if (!req.cookies.csrf) {
      const token = crypto.randomBytes(32).toString('hex');
      res.cookie('csrf', token, {
        httpOnly: false, // Must be readable by JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    }
    next();
  };
}

/**
 * Validate double submit cookie
 */
export function validateDoubleSubmitCookie() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get token from header or body
    const token = req.headers['x-csrf-token'] as string || 
                  req.body._csrf as string;
    const cookieToken = req.cookies.csrf;
    
    if (!token || !cookieToken || token !== cookieToken) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    
    next();
  };
}

// ============================================================================
// 3. CUSTOM HEADER CSRF PROTECTION
// ============================================================================

/**
 * Require custom header (simplest CSRF protection)
 * Browsers block custom headers in cross-origin requests
 */
export function requireCustomHeader() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only check for state-changing methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (!req.headers['x-requested-with']) {
        return res.status(403).json({ error: 'Missing required header' });
      }
    }
    next();
  };
}

// ============================================================================
// 4. SAME-SITE COOKIE PROTECTION
// ============================================================================

/**
 * Configure SameSite cookies
 * Prevents cookies from being sent in cross-site requests
 */
export function configureSameSiteCookies() {
  return (req: Request, res: Response, next: NextFunction) => {
    // This is typically done in session/cookie configuration
    // Example for express-session:
    /*
    app.use(session({
      cookie: {
        sameSite: 'strict', // or 'lax'
        secure: true, // HTTPS only
        httpOnly: true
      }
    }));
    */
    next();
  };
}

// ============================================================================
// 5. COMPREHENSIVE CSRF PROTECTION
// ============================================================================

/**
 * Complete CSRF protection setup
 * Combines multiple techniques
 */
export function comprehensiveCSRFProtection() {
  return [
    // SameSite cookies (first line of defense)
    configureSameSiteCookies(),
    
    // Double submit cookie
    doubleSubmitCookie(),
    
    // Validate CSRF token for state-changing operations
    (req: Request, res: Response, next: NextFunction) => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return validateDoubleSubmitCookie()(req, res, next);
      }
      next();
    },
    
    // Require custom header as additional check
    requireCustomHeader()
  ];
}

// ============================================================================
// 6. CSRF PROTECTION FOR SPAs
// ============================================================================

/**
 * CSRF protection for Single Page Applications
 * Token-based approach
 */
export class SPACSRFProtection {
  private static tokens = new Map<string, string>();
  
  /**
   * Get CSRF token endpoint
   */
  static getTokenEndpoint() {
    return (req: Request, res: Response) => {
      const token = crypto.randomBytes(32).toString('hex');
      const sessionId = req.sessionID || crypto.randomBytes(16).toString('hex');
      
      this.tokens.set(sessionId, token);
      
      // Set cookie
      res.cookie('csrf', token, {
        httpOnly: false, // Must be readable by JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.json({ csrfToken: token });
    };
  }
  
  /**
   * Validate CSRF token
   */
  static validateToken() {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers['x-csrf-token'] as string;
      const cookieToken = req.cookies.csrf;
      const sessionId = req.sessionID;
      
      if (!token || !cookieToken || token !== cookieToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
      }
      
      // Verify token exists in store
      const storedToken = this.tokens.get(sessionId || '');
      if (storedToken && storedToken !== token) {
        return res.status(403).json({ error: 'CSRF token mismatch' });
      }
      
      next();
    };
  }
}

// ============================================================================
// 7. CSRF PROTECTION FOR REST APIs
// ============================================================================

/**
 * CSRF protection for REST APIs
 * Uses token in Authorization header
 */
export function apiCSRFProtection() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only protect state-changing operations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }
    
    // Get token from header
    const token = req.headers['x-csrf-token'] as string;
    const cookieToken = req.cookies.csrf;
    
    if (!token || !cookieToken || token !== cookieToken) {
      return res.status(403).json({ 
        error: 'CSRF token required',
        code: 'CSRF_TOKEN_REQUIRED'
      });
    }
    
    next();
  };
}

// ============================================================================
// 8. CSRF TOKEN IN RESPONSE HEADER
// ============================================================================

/**
 * Include CSRF token in response header
 * Client reads and includes in subsequent requests
 */
export function csrfTokenHeader() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Generate or get existing token
    let token = req.cookies.csrf;
    if (!token) {
      token = crypto.randomBytes(32).toString('hex');
      res.cookie('csrf', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    
    // Include in response header
    res.setHeader('X-CSRF-Token', token);
    next();
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Using csurf library
import express from 'express';
import session from 'express-session';
import { setupCSRFProtection } from './csrf-middleware';

const app = express();

app.use(session({ secret: 'your-secret' }));
const { cookieMiddleware, csrfProtection, getToken, errorHandler } = setupCSRFProtection();

app.use(cookieMiddleware);

// Get token
app.get('/api/csrf-token', csrfProtection, getToken);

// Protected route
app.post('/api/users', csrfProtection, (req, res) => {
  res.json({ success: true });
});

app.use(errorHandler);
*/

/*
// Example 2: Double Submit Cookie
import express from 'express';
import cookieParser from 'cookie-parser';
import { doubleSubmitCookie, validateDoubleSubmitCookie } from './csrf-middleware';

const app = express();
app.use(cookieParser());
app.use(doubleSubmitCookie());

app.post('/api/users', validateDoubleSubmitCookie(), (req, res) => {
  res.json({ success: true });
});
*/

/*
// Example 3: SPA with CSRF
import express from 'express';
import { SPACSRFProtection } from './csrf-middleware';

const app = express();

app.get('/api/csrf-token', SPACSRFProtection.getTokenEndpoint());

app.post('/api/users', SPACSRFProtection.validateToken(), (req, res) => {
  res.json({ success: true });
});
*/

export default {
  setupCSRFProtection,
  doubleSubmitCookie,
  validateDoubleSubmitCookie,
  requireCustomHeader,
  configureSameSiteCookies,
  comprehensiveCSRFProtection,
  SPACSRFProtection,
  apiCSRFProtection,
  csrfTokenHeader
};

