'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Extend the NextRequest interface to include the ip property
declare module 'next/server' {
  interface NextRequest {
    ip?: string;
  }
}

// Define allowed origins for CORS
const allowedOrigins: string[] = [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'https://your-production-domain.com'
].filter(Boolean) as string[];

interface RateLimitEntry {
  count: number;
  resetTime: number;
  limitExceeded: boolean;
  remaining?: number;
}

// Simple in-memory rate limiting (consider using Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check and update rate limiting for a given key
 */
async function getRateLimit(key: string): Promise<RateLimitEntry> {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // New time window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
      limitExceeded: false,
      remaining: 99
    };
    rateLimitStore.set(key, newEntry);
    return newEntry;
  }
  
  // Increment counter in current window
  const updatedEntry = {
    ...entry,
    count: entry.count + 1,
    limitExceeded: entry.count >= 100,
    remaining: Math.max(0, 100 - (entry.count + 1))
  };
  
  rateLimitStore.set(key, updatedEntry);
  return updatedEntry;
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Try to get IP from x-forwarded-for header
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  // Try to get IP from request connection
  // @ts-ignore - ip might be available in some environments
  if (request.ip) {
    return request.ip;
  }
  
  // Fallback to a default value
  return 'unknown';
}

/**
 * Main security middleware function
 */
export async function securityMiddleware(request: NextRequest) {
  try {
    // CORS Headers
    const origin = request.headers.get('origin') || '';
    const responseOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*';
    
    // Skip preflight requests from the same origin
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': responseOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-csrf-token',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }
    
    // Rate limiting (basic implementation)
    const ip = getClientIp(request);
    const rateLimitKey = `rate-limit-${ip}`;
    const rateLimit = await getRateLimit(rateLimitKey);
    
    if (rateLimit.limitExceeded) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests', 
          retryAfter,
          code: 'RATE_LIMIT_EXCEEDED'
        }), 
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': responseOrigin,
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    // CSRF Protection for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token');
      const cookieToken = request.cookies.get('csrf-token')?.value;
      
      if (!csrfToken || csrfToken !== cookieToken) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Invalid or missing CSRF token',
            code: 'INVALID_CSRF_TOKEN'
          }), 
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': responseOrigin,
            },
          }
        );
      }
    }

    // Create a response with security headers
    const response = NextResponse.next();
    
    // Set security headers
    response.headers.set('Access-Control-Allow-Origin', responseOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-csrf-token');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    
    // Add rate limit headers to the response
    if (typeof rateLimit.remaining === 'number') {
      response.headers.set('X-RateLimit-Limit', '100');
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
    }
    
    return response;
  } catch (error) {
    console.error('Security middleware error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }), 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
}
