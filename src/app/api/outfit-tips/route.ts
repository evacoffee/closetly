import { NextResponse } from 'next/server';
import { OutfitTip } from '@/models/OutfitTip';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const age = parseInt(searchParams.get('age') || '0');
    const styles = searchParams.get('styles')?.split(',') || [];
    const gender = searchParams.get('gender') || 'unisex';

    // Get approved tips that match the age range and styles
    const tips = await OutfitTip.find({
      status: 'approved',
      'ageRange.min': { $lte: age },
      'ageRange.max': { $gte: age },
      styles: { $in: styles },
      $or: [
        { 'metadata.gender': gender },
        { 'metadata.gender': 'unisex' }
      ]
    })
    .sort({ likes: -1, verifiedByExperts: -1 })
    .limit(10);

    return NextResponse.json(tips);
  } catch (error) {
    console.error('Error fetching outfit tips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outfit tips' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const tip = new OutfitTip(data);
    await tip.save();

    return NextResponse.json(tip);
  } catch (error) {
    console.error('Error creating outfit tip:', error);
    return NextResponse.json(
      { error: 'Failed to create outfit tip' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const tipId = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!tipId || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const tip = await OutfitTip.findById(tipId);
    if (!tip) {
      return NextResponse.json(
        { error: 'Tip not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'like':
        tip.likes += 1;
        break;
      case 'dislike':
        tip.dislikes += 1;
        break;
      case 'report':
        tip.reports += 1;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await tip.save();
    return NextResponse.json(tip);
  } catch (error) {
    console.error('Error updating outfit tip:', error);
    return NextResponse.json(
      { error: 'Failed to update outfit tip' },
      { status: 500 }
    );
  }
}
