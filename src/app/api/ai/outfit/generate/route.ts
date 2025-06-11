import { NextResponse } from 'next/server';
import { outfitGenerator } from '@/lib/ai/outfit-generator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { occasion, location } = await request.json();
    
    if (!occasion || !location) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const suggestions = await outfitGenerator.generateOutfit(
      session.user.id,
      occasion,
      location
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating outfit:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}