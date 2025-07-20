import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again in 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com", "http://localhost:*", "ws://localhost:*"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com", "http://localhost:*", "ws://localhost:*", "wss://localhost:*"],
      frameSrc: ["'self'", "https://js.stripe.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Password strength validation
export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
  }
  
  return { valid: true };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// CSRF token middleware
export const csrfProtection = (req: Request & { session?: any }, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] as string;
    const sessionToken = req.session?.csrfToken;
    
    if (!token || !sessionToken || token !== sessionToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid CSRF token'
      });
    }
  }
  next();
};

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return require('crypto').randomBytes(32).toString('hex');
};

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' as const // CSRF protection
  }
};

// Account lockout tracking
const failedAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export const trackFailedLogin = (identifier: string): boolean => {
  const now = new Date();
  const attempts = failedAttempts.get(identifier);
  
  if (!attempts) {
    failedAttempts.set(identifier, { count: 1, lastAttempt: now });
    return false; // Not locked out
  }
  
  // Reset count if last attempt was more than 15 minutes ago
  if (now.getTime() - attempts.lastAttempt.getTime() > 15 * 60 * 1000) {
    failedAttempts.set(identifier, { count: 1, lastAttempt: now });
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  
  // Lock out after 5 failed attempts
  return attempts.count >= 5;
};

export const clearFailedAttempts = (identifier: string): void => {
  failedAttempts.delete(identifier);
};

// Security audit logging
export const auditLog = (req: Request, action: string, details?: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    action,
    details,
    userId: (req as any).user?.id
  };
  
  // In production, send to proper logging service
  console.log('SECURITY_AUDIT:', JSON.stringify(logEntry));
};