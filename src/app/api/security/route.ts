import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { rateLimitMiddleware } from '@/lib/security'
import { prisma } from '@/lib/prisma'

// Get current user's security info
export async function GET(request: NextRequest) {
  // Check rate limiting first
  const rateLimitResponse = await rateLimitMiddleware(request)
  if (rateLimitResponse.status === 429) return rateLimitResponse

  try {
    // Get the current session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not logged in' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Fetch user details from db
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true
      }
    })

    // Make sure user exists
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Return user and security info
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image
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

// Handle security-related operations
export async function POST(request: NextRequest) {
  // First check rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request)
  if (rateLimitResponse.status === 429) return rateLimitResponse

  try {
    const body = await request.json()
    
    // Handle different security operations
    switch (body.operation) {
      case 'generate-csrf-token':
        // Generate a new CSRF token that's valid for 24 hours
        return NextResponse.json({ 
          token: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        
      case 'validate-password':
        // Validate password strength
        const { password } = body
        if (!password?.trim()) {
          return NextResponse.json(
            { error: 'Please enter a password' }, 
            { status: 400 }
          )
        }
        
        // Check password meets requirements
        const result = validatePassword(password)
        return NextResponse.json({ 
          valid: result.valid, 
          message: result.message 
        })
        
      default:
        // Unknown operation
        return NextResponse.json(
          { error: 'Unknown security operation' }, 
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Security operation failed:', error)
    return NextResponse.json(
      { error: 'Something went wrong' }, 
      { status: 500 }
    )
  }
}

// Check if password meets security requirements
function validatePassword(password: string): { valid: boolean; message?: string } {
  // Check minimum length
  if (password.length < 12) {
    return { 
      valid: false, 
      message: 'Make it longer! Use at least 12 characters' 
    };
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    return { 
      valid: false, 
      message: 'Add an uppercase letter (A-Z)' 
    };
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    return { 
      valid: false, 
      message: 'Add a lowercase letter (a-z)' 
    };
  }
  
  // Check for numbers
  if (!/[0-9]/.test(password)) {
    return { 
      valid: false, 
      message: 'Include at least one number (0-9)' 
    };
  }
  
  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { 
      valid: false, 
      message: 'Add a special character (!@#$%^&*, etc.)' 
    };
  }

  // All good!
  return { 
    valid: true, 
    message: 'Great! Your password is strong' 
  };
}
