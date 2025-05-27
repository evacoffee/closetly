import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityMiddleware } from './middlewares/securityMiddleware';

// Extend the NextRequest interface to include the ip property
declare module 'next/server' {
  interface NextRequest {
    ip?: string;
  }
}

/**
 * Main middleware function that applies security headers and checks
 * to all routes except static files and API routes
 */
export async function middleware(request: NextRequest) {
  try {
    // Skip middleware for static files and API routes
    const pathname = request.nextUrl.pathname;
    
    // Skip middleware for static files and API routes
    if (
      pathname.startsWith('/_next/') || // Next.js internal files
      pathname.startsWith('/api/') ||    // API routes
      pathname.startsWith('/static/') || // Static files
      pathname.match(/\.(ico|svg|png|jpg|jpeg|css|js|json)$/) // Common static file extensions
    ) {
      return NextResponse.next();
    }

    // Apply security middleware
    const securityResponse = await securityMiddleware(request);
    
    // If security middleware returned a response (e.g., rate limit exceeded, CSRF failed)
    if (securityResponse.status >= 400) {
      return securityResponse;
    }
    
    // Get the response from the next handler
    const response = NextResponse.next();
    
    // Merge security headers with the response
    securityResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length') {
        response.headers.set(key, value);
      }
    });
    
    // Add security headers that should be on all responses
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
