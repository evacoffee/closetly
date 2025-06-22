import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Please log in first', { status: 401 })
  }

  try {
    const outfits = await prisma.outfit.findMany({
      where: { userId: session.user.id },
      include: { 
        _count: { 
          select: { items: true } 
        } 
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    })
    
    return NextResponse.json(outfits)
  } catch (err) {
    console.error('Problem getting outfits:', err)
    return NextResponse.json(
      { error: 'Had trouble loading your outfits' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'