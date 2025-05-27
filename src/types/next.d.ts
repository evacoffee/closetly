import 'next';

declare module 'next' {
  interface NextRequest {
    ip?: string;
    cookies: {
      get: (name: string) => { value: string } | undefined;
    };
  }

  interface NextResponse {
    headers: Headers;
  }
}

declare global {
  interface Request {
    cookies: {
      get: (name: string) => { value: string } | undefined;
    };
  }
}
