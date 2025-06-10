import { validatePassword } from '@/lib/security';

/**
 * Client-side security utilities
 */

// Generate a CSRF token
let csrfToken: string | null = null;
let csrfTokenExpiry: number | null = null;

export async function getCSRFToken(): Promise<string> {
  // Return cached token if valid
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

// Secure fetch wrapper with CSRF protection
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getCSRFToken();
  
  const headers = new Headers(options.headers);
  headers.set('X-CSRF-Token', token);
  
  // Add security headers
  headers.set('X-Requested-With', 'XMLHttpRequest');
  headers.set('Content-Type', 'application/json');
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'same-origin',
    });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Redirect to login or handle unauthorized
      window.location.href = '/auth/signin';
      throw new Error('Unauthorized');
    }
    
    return response;
  } catch (error) {
    console.error('Secure fetch error:', error);
    throw error;
  }
}

// Validate password client-side
export function validatePasswordClient(password: string): { valid: boolean; message?: string } {
  return validatePassword(password);
}

// Sanitize HTML to prevent XSS
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Generate a secure random string
export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Check if the current connection is secure (HTTPS)
export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

// Log security events
export function logSecurityEvent(event: string, details: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Security Event] ${event}`, details);
  }
  
  // In production, you would typically send this to a security monitoring service
  // Example:
  // fetch('/api/security/log', {
  //   method: 'POST',
  //   body: JSON.stringify({ event, details }),
  //   headers: { 'Content-Type': 'application/json' },
  // });
}
