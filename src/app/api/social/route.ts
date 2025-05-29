import { NextResponse } from 'next/server';
import User from '@/models/User';
import { Outfit } from '@/models/Outfit';
import { connectToDatabase } from '@/lib/mongodb';
import { Types } from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'followers':
        const followers = await User.find({
          _id: { $in: user.social.followers },
          'settings.profileVisibility': 'public'
        });
        return NextResponse.json(followers);

      case 'following':
        const following = await User.find({
          _id: { $in: user.social.following },
          'settings.profileVisibility': 'public'
        });
        return NextResponse.json(following);

      case 'favorite-outfits':
        const favoriteOutfits = await Outfit.find({
          _id: { $in: user.social.favoriteOutfits },
          $or: [
            { userId: userId },
            { publicVisibility: true }
          ]
        });
        return NextResponse.json(favoriteOutfits);

      default:
        // Return public profile info
        if (user.settings.profileVisibility === 'private') {
          return NextResponse.json({
            name: user.name,
            profileVisibility: 'private'
          });
        }
        return NextResponse.json(user);
    }
  } catch (error) {
    console.error('Error fetching social data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { userId, targetId, action } = await request.json();

    if (!userId || !targetId || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'follow':
        // Add to following list if not already following
        if (!user.social.following.includes(targetId)) {
          user.social.following.push(targetId);
          await user.save();

          // Add to target user's followers list
          await User.findByIdAndUpdate(targetId, {
            $addToSet: { 'social.followers': userId }
          });
        }
        break;

      case 'unfollow':
        user.social.following = user.social.following.filter(
          (id: Types.ObjectId | string) => id.toString() !== targetId.toString()
        );
        await user.save();

        await User.findByIdAndUpdate(targetId, {
          $pull: { 'social.followers': userId }
        });
        break;

      case 'favorite-outfit':
        if (!user.social.favoriteOutfits.includes(targetId)) {
          user.social.favoriteOutfits.push(targetId);
          await user.save();

          // Increment outfit likes
          await Outfit.findByIdAndUpdate(targetId, {
            $inc: { likes: 1 },
            $addToSet: { savedBy: userId }
          });
        }
        break;

      case 'unfavorite-outfit':
        user.social.favoriteOutfits = user.social.favoriteOutfits.filter(
          (id: Types.ObjectId | string) => id.toString() !== targetId.toString()
        );
        await user.save();

        await Outfit.findByIdAndUpdate(targetId, {
          $inc: { likes: -1 },
          $pull: { savedBy: userId }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating social data:', error);
    return NextResponse.json(
      { error: 'Failed to update social data' },
      { status: 500 }
    );
  }
}
