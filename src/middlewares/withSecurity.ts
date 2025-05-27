'use server';

import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from './securityMiddleware';

/**
 * Higher-order function that wraps a request handler with security middleware
 * @param handler The original request handler function
 * @returns A new handler function with security middleware applied
 */
export function withSecurity<T = any>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>
): (req: NextRequest) => Promise<NextResponse<T>> {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    try {
      // Apply security middleware
      const securityResponse = await securityMiddleware(request);
      
      // If security middleware returned a response (e.g., rate limit exceeded, CSRF failed)
      if (securityResponse.status >= 400) {
        return securityResponse as NextResponse<T>;
      }
      
      // Call the original handler
      const response = await handler(request);
      
      // Merge security headers with the response
      securityResponse.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-length') {
          response.headers.set(key, value);
        }
      });
      
      return response;
    } catch (error) {
      console.error('Request handler error:', error);
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
      ) as NextResponse<T>;
    }
  };
}

// Re-export security middleware for direct use
export * from './securityMiddleware';
