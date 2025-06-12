import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 100,
};

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  rateLimits.forEach((value, key) => {
    if (value.resetAt < now) {
      rateLimits.delete(key);
    }
  });

  let rateLimit = rateLimits.get(ip);
  
  if (!rateLimit || now > rateLimit.resetAt) {
    rateLimit = { count: 0, resetAt: now + RATE_LIMIT.WINDOW_MS };
    rateLimits.set(ip, rateLimit);
  }

  rateLimit.count++;
  const remaining = Math.max(0, RATE_LIMIT.MAX_REQUESTS - rateLimit.count);
  
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetAt / 1000).toString());

  if (rateLimit.count > RATE_LIMIT.MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests, please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(RATE_LIMIT.WINDOW_MS / 1000).toString(),
        },
      }
    );
  }

  return response;
}

export function getSecurityHeaders(nonce: string) {
  return {
    'Content-Security-Policy': [
      "default-src 'self';",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
        process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ""
      } https:;`,
      "style-src 'self' 'unsafe-inline' https:;",
      "img-src 'self' blob: data: https:;",
      "font-src 'self' https:;",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || ''} https:;`,
      "frame-ancestors 'none';",
      "form-action 'self';",
      "base-uri 'self';",
      "object-src 'none';",
      "block-all-mixed-content;",
      "upgrade-insecure-requests;"
    ].join(' '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-DNS-Prefetch-Control': 'on',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 12) {
    return { valid: false, message: 'Password must be at least 12 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
}
