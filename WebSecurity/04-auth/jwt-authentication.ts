// JWT Authentication Implementation
// Complete JWT authentication system

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// ============================================================================
// 1. JWT TOKEN GENERATION AND VERIFICATION
// ============================================================================

export interface JWTPayload {
  userId: number;
  email: string;
  role?: string;
}

export class JWTAuth {
  private static readonly SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';
  
  /**
   * Generate access token
   */
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY
    });
  }
  
  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(
      { ...payload, type: 'refresh' },
      this.REFRESH_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );
  }
  
  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.SECRET) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      throw new Error('Invalid token');
    }
  }
  
  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.REFRESH_SECRET) as JWTPayload & { type?: string };
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

// ============================================================================
// 2. AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Middleware to authenticate JWT tokens
 */
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = JWTAuth.verifyAccessToken(token);
    req.user = decoded; // Attach user to request
    next();
  } catch (error: any) {
    if (error.message === 'Token expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// ============================================================================
// 3. LOGIN ENDPOINT
// ============================================================================

/**
 * Login handler
 */
export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  
  // Find user (replace with your database query)
  // const user = await User.findOne({ where: { email } });
  const user = { id: 1, email: 'user@example.com', password: '$2b$10$...' }; // Example
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: 'user' // Get from user record
  };
  
  const accessToken = JWTAuth.generateAccessToken(payload);
  const refreshToken = JWTAuth.generateRefreshToken(payload);
  
  // Store refresh token in database (optional)
  // await RefreshToken.create({ userId: user.id, token: refreshToken });
  
  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email
    }
  });
}

// ============================================================================
// 4. REFRESH TOKEN ENDPOINT
// ============================================================================

/**
 * Refresh access token
 */
export async function refreshTokenHandler(req: Request, res: Response) {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  
  try {
    // Verify refresh token
    const decoded = JWTAuth.verifyRefreshToken(refreshToken);
    
    // Optional: Check if token exists in database
    // const stored = await RefreshToken.findOne({ token: refreshToken });
    // if (!stored) {
    //   return res.status(403).json({ error: 'Invalid refresh token' });
    // }
    
    // Generate new access token
    const payload: JWTPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    const accessToken = JWTAuth.generateAccessToken(payload);
    
    res.json({ accessToken });
  } catch (error: any) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
}

// ============================================================================
// 5. LOGOUT ENDPOINT
// ============================================================================

/**
 * Logout handler
 * For stateless JWT, we can't "delete" the token
 * Options:
 * 1. Token blacklist
 * 2. Short token expiry + delete refresh token
 * 3. Store tokens in database
 */
export class TokenBlacklist {
  private static blacklist = new Set<string>();
  
  static add(token: string) {
    this.blacklist.add(token);
  }
  
  static has(token: string): boolean {
    return this.blacklist.has(token);
  }
  
  static remove(token: string) {
    this.blacklist.delete(token);
  }
}

export async function logoutHandler(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    // Add to blacklist
    TokenBlacklist.add(token);
    
    // Optional: Delete refresh token from database
    // await RefreshToken.destroy({ where: { token: req.body.refreshToken } });
  }
  
  res.json({ message: 'Logged out successfully' });
}

// Update authenticateJWT to check blacklist
export function authenticateJWTWithBlacklist(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Check blacklist
  if (TokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  
  try {
    const decoded = JWTAuth.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.message === 'Token expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// ============================================================================
// 6. PASSWORD HASHING
// ============================================================================

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// ============================================================================
// 7. REGISTER ENDPOINT
// ============================================================================

/**
 * Register handler
 */
export async function registerHandler(req: Request, res: Response) {
  const { email, password, username } = req.body;
  
  // Validate input
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if user exists
  // const existing = await User.findOne({ where: { email } });
  // if (existing) {
  //   return res.status(409).json({ error: 'User already exists' });
  // }
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Create user (replace with your database query)
  // const user = await User.create({ email, username, password: hashedPassword });
  const user = { id: 1, email, username }; // Example
  
  // Generate tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email
  };
  
  const accessToken = JWTAuth.generateAccessToken(payload);
  const refreshToken = JWTAuth.generateRefreshToken(payload);
  
  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    }
  });
}

// ============================================================================
// 8. ROLE-BASED AUTHORIZATION
// ============================================================================

/**
 * Require specific role
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

/**
 * Require admin role
 */
export const requireAdmin = requireRole('admin');

/**
 * Require user or admin
 */
export const requireUser = requireRole('user', 'admin');

// ============================================================================
// 9. PASSWORD RESET TOKEN
// ============================================================================

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash password reset token (for storage)
 */
export async function hashResetToken(token: string): Promise<string> {
  return await bcrypt.hash(token, 10);
}

/**
 * Verify password reset token
 */
export async function verifyResetToken(token: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(token, hash);
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
import express from 'express';
import {
  authenticateJWT,
  loginHandler,
  registerHandler,
  refreshTokenHandler,
  logoutHandler,
  requireAdmin
} from './jwt-authentication';

const app = express();
app.use(express.json());

// Public routes
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);
app.post('/api/refresh', refreshTokenHandler);

// Protected routes
app.get('/api/profile', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

app.delete('/api/users/:id', authenticateJWT, requireAdmin, (req, res) => {
  // Delete user
  res.json({ success: true });
});

app.post('/api/logout', authenticateJWT, logoutHandler);
*/

export default {
  JWTAuth,
  authenticateJWT,
  authenticateJWTWithBlacklist,
  loginHandler,
  registerHandler,
  refreshTokenHandler,
  logoutHandler,
  hashPassword,
  verifyPassword,
  requireRole,
  requireAdmin,
  requireUser,
  generatePasswordResetToken,
  hashResetToken,
  verifyResetToken
};

