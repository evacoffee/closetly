import { NextResponse } from 'next/server';
import { Request } from 'node-fetch';
import { rateLimitMiddleware } from '../src/lib/security';

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-1234',
  },
});

describe('Security Middleware', () => {
  const mockRequest = (ip = '127.0.0.1') => {
    return new Request('http://localhost:3000', {
      headers: { 'x-forwarded-for': ip },
    }) as unknown as Request;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('rateLimitMiddleware', () => {
    it('allows requests under the rate limit', async () => {
      const request = mockRequest();
      
      for (let i = 0; i < 99; i++) {
        const response = await rateLimitMiddleware(request);
        expect(response.status).toBe(200);
      }
    });

    it('blocks requests over the rate limit', async () => {
      const request = mockRequest();
      
      for (let i = 0; i < 100; i++) {
        await rateLimitMiddleware(request);
      }
      
      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(429);
    });

    it('resets rate limit after window', async () => {
      const request = mockRequest();
      
      for (let i = 0; i < 100; i++) {
        await rateLimitMiddleware(request);
      }
      
      jest.advanceTimersByTime(16 * 60 * 1000);
      
      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(200);
    });

    it('tracks different IPs separately', async () => {
      const ip1 = '192.168.1.1';
      const ip2 = '10.0.0.1';
      
      for (let i = 0; i < 100; i++) {
        const request = mockRequest(ip1);
        await rateLimitMiddleware(request);
      }
      
      const request = mockRequest(ip2);
      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(200);
    });
  });
});
