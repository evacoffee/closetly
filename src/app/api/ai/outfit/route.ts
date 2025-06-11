import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { outfitGenerator } from '@/lib/ai/outfitGenerator';
import { OutfitGeneratorError } from '@/types/outfit';
import { z } from 'zod';

// Input validation schema
const OutfitRequestSchema = z.object({
  occasion: z.string().min(1, 'Occasion is required'),
  weather: z.object({
    location: z.string().optional(),
    temp: z.number().optional(),
    condition: z.string().optional()
  }).optional()
});

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // 2. Validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' }, 
        { status: 400 }
      );
    }

    // 3. Validate request data
    const validation = OutfitRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.format() 
        }, 
        { status: 400 }
      );
    }

    const { occasion, weather } = validation.data;

    try {
      // 4. Generate outfit suggestion
      const suggestion = await outfitGenerator.generateOutfitSuggestion(
        session.user.id,
        occasion,
        weather
      );

      // 5. Return successful response
      return NextResponse.json(suggestion);
    } catch (error) {
      console.error('Outfit generation error:', error);
      
      // Handle known errors
      if (error instanceof Error && 'code' in error) {
        const outfitError = error as OutfitGeneratorError;
        return NextResponse.json(
          { 
            error: error.message,
            code: outfitError.code
          },
          { status: outfitError.status || 500 }
        );
      }
      
      // Fallback for unknown errors
      return NextResponse.json(
        { error: 'Failed to generate outfit suggestion' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in outfit generation endpoint:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
