import { NextResponse } from 'next/server'
import { OutfitGenerator } from '@/utils/outfitGenerator'
import { OutfitGeneratorParams } from '@/types/outfit'
import { Clothing } from '@/models/Clothing'
import { Outfit } from '@/models/Outfit'
import { connectToDatabase } from '@/lib/mongodb'

// Generate a new outfit based on user preferences
export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectToDatabase()
    
    // Get the request parameters
    const params: OutfitGeneratorParams = await req.json()
    
    // Combine base styles with any additional preferred styles
    const styles = [
      ...(params.baseStylePreferences || []),
      ...(params.preferredStyles || [])
    ]

    // Find clothes that match the user's style preferences
    const clothes = await Clothing.find({ 
      userId: params.userId,
      style: { $in: styles }
    })

    // Check if we found any matching clothes
    if (!clothes.length) {
      return NextResponse.json(
        { error: "Couldn't find any clothes that match your style" },
        { status: 404 }
      )
    }

    // Generate a new outfit using the outfit generator
    const newOutfit = await OutfitGenerator.generateOutfit(clothes, {
      ...params,
      preferredStyles: styles
    })

    // Save the new outfit to the database
    const savedOutfit = await new Outfit({
      ...newOutfit,
      name: params.outfitName || 'New Outfit',
      description: params.description || 'Created just for you!',
      createdAt: new Date()
    }).save()

    // Return the newly created outfit
    return NextResponse.json(savedOutfit)
    
  } catch (err) {
    console.error('Something went wrong generating outfit:', err)
    return NextResponse.json(
      { error: 'Had trouble creating your outfit. Please try again.' },
      { status: 500 }
    )
  }
}
