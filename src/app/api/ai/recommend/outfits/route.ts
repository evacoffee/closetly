import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai-edge';
import { getOutfitsByUser } from '@/lib/outfits';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { userId, limit = 5, ...filters } = await req.json();

    if (userId !== user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Get user's wardrobe and past outfits
    const userOutfits = await getOutfitsByUser(userId);
    
    // Get user's style preferences
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId },
      select: {
        stylePreferences: true,
        colorPreferences: true,
      },
    });

    // Prepare context for AI
    const context = {
      userPreferences: {
        ...userPreferences,
        ...filters,
      },
      wardrobeItems: userOutfits.map(outfit => ({
        id: outfit.id,
        name: outfit.name,
        items: outfit.items,
        tags: outfit.tags || [],
        lastWorn: outfit.lastWorn,
      })),
    };

    // Call OpenAI API for recommendations
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a fashion assistant that provides personalized outfit recommendations.
          Consider the user's wardrobe, preferences, occasion, and weather conditions.
          Return an array of ${limit} outfit recommendations with confidence scores and reasoning.`,
        },
        {
          role: 'user',
          content: JSON.stringify(context),
        },
      ],
      temperature: 0.7,
    });

    const data = await completion.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
