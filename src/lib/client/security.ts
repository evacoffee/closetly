import { validatePassword } from '@/lib/security';


let csrfToken: string | null = null;
let csrfTokenExpiry: number | null = null;

export async function getCSRFToken(): Promise<string> {
  if (csrfToken && csrfTokenExpiry && Date.now() < csrfTokenExpiry) {
    return csrfToken;
  }

  try {
    const response = await fetch('/api/security', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'generate-csrf-token' }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate CSRF token');
    }

    const data = await response.json();
    csrfToken = data.token;
    csrfTokenExpiry = new Date(data.expiresAt).getTime();
    return csrfToken;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    throw error;
  }
}

export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getCSRFToken();
  
  const headers = new Headers(options.headers);
  headers.set('X-CSRF-Token', token);
  
  headers.set('X-Requested-With', 'XMLHttpRequest');
  headers.set('Content-Type', 'application/json');
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'same-origin',
    });
    
    if (response.status === 401) {
      window.location.href = '/auth/signin';
      throw new Error('Unauthorized');
    }
    
    return response;
  } catch (error) {
    console.error('Secure fetch error:', error);
    throw error;
  }
}

export function validatePasswordClient(password: string): { valid: boolean; message?: string } {
  return validatePassword(password);
}

export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

export function logSecurityEvent(event: string, details: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Security Event] ${event}`, details);
  }
  
}
