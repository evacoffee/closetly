'use server';

import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from './securityMiddleware';

export function withSecurity<T = any>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>
): (req: NextRequest) => Promise<NextResponse<T>> {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    try {
      const securityResponse = await securityMiddleware(request);
      
      if (securityResponse.status >= 400) {
        return securityResponse as NextResponse<T>;
      }
      
      const response = await handler(request);
      
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

export * from './securityMiddleware';
