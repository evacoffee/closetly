import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rateLimitMiddleware } from '@/lib/security';
import { prisma } from '@/lib/prisma';

// Initialize Prisma client if not already imported
if (!global.prisma) {
  global.prisma = new PrismaClient();
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      },
      security: {
        isAuthenticated: true,
        sessionExpires: session.expires,
        features: {
          twoFactorAuth: true,
          emailVerification: !!user.emailVerified,
          passwordPolicies: true,
          rateLimiting: true,
        },
      },
    });
  } catch (error) {
    console.error('Security API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  const body = await request.json();
  
  switch (body.operation) {
    case 'generate-csrf-token':
      return NextResponse.json({ 
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      
    case 'validate-password':
      const { password } = body;
      if (!password) {
        return new NextResponse(
          JSON.stringify({ error: 'Password is required' }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const result = validatePassword(password);
      return NextResponse.json({ valid: result.valid, message: result.message });
      
    default:
      return new NextResponse(
        JSON.stringify({ error: 'Invalid operation' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
  }
}

function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 12) {
    return { valid: false, message: 'Password must be at least 12 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
}
