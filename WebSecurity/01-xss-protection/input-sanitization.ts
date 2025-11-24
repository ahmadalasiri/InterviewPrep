// Input Sanitization for XSS Prevention
// Sanitize user input before storing or displaying

import { escape } from 'html-escaper';
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// ============================================================================
// 1. HTML ESCAPING (For Plain Text Display)
// ============================================================================

/**
 * Escape HTML special characters
 * Use when displaying user input as plain text
 */
export function escapeHTML(input: string): string {
  return escape(input);
  // <script> → &lt;script&gt;
  // " → &quot;
  // ' → &#x27;
}

// Example usage
export function displayUserComment(comment: string): string {
  // ✅ Safe: Escaped output
  return `<div class="comment">${escapeHTML(comment)}</div>`;
}

// ============================================================================
// 2. INPUT VALIDATION (Whitelist Approach)
// ============================================================================

/**
 * Validate input using schema
 * Reject invalid input rather than sanitizing
 */
export const usernameSchema = z.string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric and underscore allowed');

export const emailSchema = z.string().email();

export const searchSchema = z.string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9\s]+$/, 'Only alphanumeric and spaces allowed');

export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  return schema.parse(input);
}

// Example usage
export function handleSearchRequest(searchInput: unknown) {
  try {
    const validated = validateInput(searchSchema, searchInput);
    // Use validated input safely
    return validated;
  } catch (error) {
    throw new Error('Invalid search input');
  }
}

// ============================================================================
// 3. HTML SANITIZATION (When HTML is Needed)
// ============================================================================

/**
 * Sanitize HTML input
 * Use when you need to allow some HTML formatting (rich text editors)
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
}

// Example: Rich text comment
export function saveRichTextComment(htmlComment: string): string {
  // ✅ Safe: Sanitized HTML
  return sanitizeHTML(htmlComment);
  // <script>alert('XSS')</script><p>Hello</p> → <p>Hello</p>
}

// ============================================================================
// 4. URL SANITIZATION
// ============================================================================

/**
 * Validate and sanitize URLs
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Block internal IPs
    if (parsed.hostname === 'localhost' || 
        parsed.hostname.startsWith('127.') ||
        parsed.hostname.startsWith('192.168.') ||
        parsed.hostname.startsWith('10.') ||
        parsed.hostname.startsWith('172.')) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

// Example usage
export function createLink(href: string, text: string): string {
  const safeURL = sanitizeURL(href);
  if (!safeURL) {
    return escapeHTML(text); // Just text if URL is invalid
  }
  return `<a href="${escapeHTML(safeURL)}">${escapeHTML(text)}</a>`;
}

// ============================================================================
// 5. EXPRESS MIDDLEWARE FOR INPUT SANITIZATION
// ============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to sanitize request body
 */
export function sanitizeBody(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    // Recursively sanitize string values
    req.body = sanitizeObject(req.body);
  }
  next();
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

// ============================================================================
// 6. CONTEXT-AWARE SANITIZATION
// ============================================================================

/**
 * Sanitize based on context
 * Different contexts need different sanitization
 */
export class ContextSanitizer {
  // HTML context
  static html(input: string): string {
    return escapeHTML(input);
  }
  
  // JavaScript context
  static javascript(input: string): string {
    return JSON.stringify(input); // JSON.stringify escapes properly
  }
  
  // URL context
  static url(input: string): string | null {
    return sanitizeURL(input);
  }
  
  // CSS context
  static css(input: string): string {
    // Remove dangerous CSS
    return input.replace(/[<>'"]/g, '');
  }
  
  // Attribute context
  static attribute(input: string): string {
    return escapeHTML(input).replace(/"/g, '&quot;');
  }
}

// Example usage
export function renderUserProfile(user: { name: string; bio: string; website: string }) {
  return `
    <div>
      <h1>${ContextSanitizer.html(user.name)}</h1>
      <p>${ContextSanitizer.html(user.bio)}</p>
      <a href="${ContextSanitizer.url(user.website) || '#'}">Website</a>
      <script>
        const userName = ${ContextSanitizer.javascript(user.name)};
      </script>
    </div>
  `;
}

// ============================================================================
// 7. FILE UPLOAD SANITIZATION
// ============================================================================

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal
  const basename = filename.split('/').pop() || filename;
  const name = basename.split('\\').pop() || basename;
  
  // Remove special characters
  const sanitized = name.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Limit length
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    return sanitized.substring(0, maxLength - ext.length) + ext;
  }
  
  return sanitized;
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Display user input
function example1() {
  const userInput = "<script>alert('XSS')</script>Hello";
  const safe = escapeHTML(userInput);
  console.log(safe); // &lt;script&gt;alert('XSS')&lt;/script&gt;Hello
}

// Example 2: Validate input
function example2() {
  try {
    const username = validateInput(usernameSchema, "john_doe123");
    console.log(username); // "john_doe123"
  } catch (error) {
    console.error('Invalid username');
  }
}

// Example 3: Sanitize HTML
function example3() {
  const html = "<script>alert('XSS')</script><p>Hello <strong>World</strong></p>";
  const safe = sanitizeHTML(html);
  console.log(safe); // <p>Hello <strong>World</strong></p>
}

// Example 4: Sanitize URL
function example4() {
  const url = sanitizeURL("https://example.com/page");
  console.log(url); // "https://example.com/page"
  
  const badUrl = sanitizeURL("javascript:alert('XSS')");
  console.log(badUrl); // null
}

export {
  example1,
  example2,
  example3,
  example4
};

