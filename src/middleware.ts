import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: 'nonce-${nonce}' ${
      process.env.NODE_ENV === 'production' ? '' : "'unsafe-eval'"
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: http:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('x-nonce', nonce);
  response.headers.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  );

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
