import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { recommendationId, rating, feedback, userId } = await req.json();

    if (userId !== user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Store the feedback in the database
    await prisma.recommendationFeedback.create({
      data: {
        recommendationId,
        userId,
        rating,
        feedback,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
