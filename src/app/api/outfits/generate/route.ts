import { NextResponse } from 'next/server';
import { OutfitGenerator } from '@/utils/outfitGenerator';
import { OutfitGeneratorParams } from '@/types/outfitGenerator';
import { Clothing } from '@/models/Clothing';
import { Outfit } from '@/models/Outfit';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const params: OutfitGeneratorParams = await request.json();
    
    // Merge base style preferences with user's preferred styles
    params.preferredStyles = [
      ...(params.baseStylePreferences || []),
      ...(params.preferredStyles || [])
    ];

    // Fetch user's clothes that match the age category's style preferences
    const userClothes = await Clothing.find({ 
      userId: params.userId,
      style: { $in: params.preferredStyles }
    });

    if (userClothes.length === 0) {
      return NextResponse.json(
        { error: 'No clothes found in wardrobe' },
        { status: 404 }
      );
    }

    // Generate outfit
    const generatedOutfit = await OutfitGenerator.generateOutfit(userClothes, params);

    // Save the generated outfit
    const outfit = new Outfit({
      ...generatedOutfit,
      name: 'AI Generated Outfit',
      description: 'Automatically generated based on your preferences',
    });

    await outfit.save();

    return NextResponse.json(outfit);
  } catch (error) {
    console.error('Error generating outfit:', error);
    return NextResponse.json(
      { error: 'Failed to generate outfit' },
      { status: 500 }
    );
  }
}
