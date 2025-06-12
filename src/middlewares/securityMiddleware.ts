'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest {
    ip?: string;
  }
}

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

const rateLimitStore = new Map<string, RateLimitEntry>();

async function getRateLimit(key: string): Promise<RateLimitEntry> {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
      limitExceeded: false,
      remaining: 99
    };
    rateLimitStore.set(key, newEntry);
    return newEntry;
  }
  
  const updatedEntry = {
    ...entry,
    count: entry.count + 1,
    limitExceeded: entry.count >= 100,
    remaining: Math.max(0, 100 - (entry.count + 1))
  };
  
  rateLimitStore.set(key, updatedEntry);
  return updatedEntry;
}

function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (request.ip) {
    return request.ip;
  }
  
  return 'unknown';
}

export async function securityMiddleware(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';
    const responseOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*';
    
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

    const response = NextResponse.next();
    
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
