import { NextRequest } from 'next/server';

/**
 * Generates a nonce for CSP
 */
export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

/**
 * Gets the Content Security Policy for the application
 */
export function getContentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  const directives = [
    // Default source restrictions
    "default-src 'self';",
    
    // Script sources
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
      isDev ? "'unsafe-eval'" : ""
    } https:;`,
    
    // Style sources
    "style-src 'self' 'unsafe-inline' https:;",
    
    // Image sources
    "img-src 'self' blob: data: https:;",
    
    // Font sources
    "font-src 'self' https:;",
    
    // Connect sources
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || ''} https:;`,
    
    // Media sources
    "media-src 'self' https:;",
    
    // Object sources - explicitly disable
    "object-src 'none';",
    
    // Frame sources - disable embedding in iframes
    "frame-ancestors 'none';",
    
    // Form actions - restrict to same origin
    "form-action 'self';",
    
    // Base URI - prevent base tag injection
    "base-uri 'self';",
    
    // Block mixed content
    "block-all-mixed-content;",
    
    // Upgrade insecure requests
    "upgrade-insecure-requests;"
  ];

  return directives.join(' ');
}

/**
 * Gets all security headers for the application
 */
export function getSecurityHeaders(request: NextRequest) {
  const nonce = generateNonce();
  
  const headers = new Headers();
  
  // Set Content Security Policy
  headers.set('Content-Security-Policy', getContentSecurityPolicy(nonce));
  
  // Set other security headers
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

  // Add all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  // Add nonce to headers for pages to use
  headers.set('x-nonce', nonce);

  return headers;
}

/**
 * Applies security headers to a response
 */
export function applySecurityHeaders(
  request: NextRequest,
  response: Response
): Response {
  const securityHeaders = getSecurityHeaders(request);
  
  // Create new headers object to avoid mutating the original
  const newHeaders = new Headers(response.headers);
  
  // Add security headers
  securityHeaders.forEach((value, key) => {
    if (key.toLowerCase() === 'content-security-policy' && newHeaders.has(key)) {
      // If CSP header already exists, merge them
      const existingCsp = newHeaders.get(key) || '';
      newHeaders.set(key, `${existingCsp}; ${value}`);
    } else {
      newHeaders.set(key, value);
    }
  });

  // Return new response with security headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
