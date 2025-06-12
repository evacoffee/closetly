import { NextRequest } from 'next/server';

export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

export function getContentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  const directives = [
    "default-src 'self';",
    
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
      isDev ? "'unsafe-eval'" : ""
    } https:;`,
    
    "style-src 'self' 'unsafe-inline' https:;",
    
    "img-src 'self' blob: data: https:;",
    
    "font-src 'self' https:;",
    
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || ''} https:;`,
    
    "media-src 'self' https:;",
    
    "object-src 'none';",
    
    "frame-ancestors 'none';",
    
    "form-action 'self';",
    
    "base-uri 'self';",
    
    "block-all-mixed-content;",
    
    "upgrade-insecure-requests;"
  ];

  return directives.join(' ');
}

export function getSecurityHeaders(request: NextRequest) {
  const nonce = generateNonce();
  
  const headers = new Headers();
  
  headers.set('Content-Security-Policy', getContentSecurityPolicy(nonce));
  
  const securityHeaders = {
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

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  headers.set('x-nonce', nonce);

  return headers;
}

export function applySecurityHeaders(
  request: NextRequest,
  response: Response
): Response {
  const securityHeaders = getSecurityHeaders(request);
  
  const newHeaders = new Headers(response.headers);
  
  securityHeaders.forEach((value, key) => {
    if (key.toLowerCase() === 'content-security-policy' && newHeaders.has(key)) {
      const existingCsp = newHeaders.get(key) || '';
      newHeaders.set(key, `${existingCsp}; ${value}`);
    } else {
      newHeaders.set(key, value);
    }
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
