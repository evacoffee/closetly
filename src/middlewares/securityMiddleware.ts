import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'https://your-production-domain.com',
].filter(Boolean);

export function securityMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // CORS Headers
    const origin = req.headers.get('origin');
    const responseOrigin = allowedOrigins.includes(origin || '') ? origin : allowedOrigins[0];
    
    // Rate limiting (basic implementation)
    const rateLimitKey = `rate-limit-${req.ip}`;
    const rateLimit = await getRateLimit(rateLimitKey);
    
    if (rateLimit.limitExceeded) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': responseOrigin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // CSRF Protection
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
      const csrfToken = req.headers.get('x-csrf-token');
      const cookieToken = req.cookies.get('csrf-token')?.value;
      
      if (!csrfToken || csrfToken !== cookieToken) {
        return new NextResponse(JSON.stringify({ error: 'Invalid CSRF token' }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': responseOrigin || '*',
          },
        });
      }
    }

    // Execute the route handler
    const response = await handler(req);

    // Add security headers to the response
    response.headers.set('Access-Control-Allow-Origin', responseOrigin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return response;
  };
}

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

async function getRateLimit(key: string) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // New time window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { limitExceeded: false };
  }
  
  // Increment counter in current window
  entry.count += 1;
  rateLimitStore.set(key, entry);
  
  return {
    limitExceeded: entry.count > 100, // 100 requests per window
    remaining: Math.max(0, 100 - entry.count),
    resetTime: entry.resetTime,
  };
}
