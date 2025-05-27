import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { securityMiddleware } from './securityMiddleware';

export function withSecurity(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Convert Next.js API route to NextResponse for middleware
    const nextReq = new Request(req.url as string, {
      method: req.method,
      headers: req.headers as any,
      // @ts-ignore
      ip: req.socket.remoteAddress,
    });

    // @ts-ignore
    nextReq.cookies = req.cookies;

    try {
      const response = await securityMiddleware(async () => {
        // Call the original handler
        await handler(req, res);
        // Return a mock response for the middleware
        return new Response(null, {
          status: res.statusCode,
          headers: Object.entries(res.getHeaders()).reduce((acc, [key, value]) => {
            if (value) acc.set(key, String(value));
            return acc;
          }, new Headers()),
        });
      })(nextReq as any);

      // Copy security headers from the middleware response to the actual response
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-length') {
          res.setHeader(key, value);
        }
      });

      // If the middleware already sent a response, end the request
      if (response.status >= 400) {
        return res.status(response.status).end();
      }
    } catch (error) {
      console.error('Security middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
