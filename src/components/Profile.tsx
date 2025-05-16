import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from '@/models/User';
import { Outfit } from '@/models/Outfit';

interface ProfileProps {
  userId: string;
  currentUserId: string;
}

interface ProfileData extends Partial<User> {
  stats: {
    totalClothes: number;
    totalOutfits: number;
    outfitsGenerated: number;
    favoriteStyles: { style: string; count: number }[];
  };
}

export const Profile = ({ userId, currentUserId }: ProfileProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'outfits' | 'favorites' | 'followers' | 'following'>('outfits');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visibilitySettings, setVisibilitySettings] = useState({
    profileVisibility: 'public',
    outfitVisibility: 'public'
  });

  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    fetchProfileData();
    if (!isOwnProfile) {
      checkFollowingStatus();
    }
  }, [userId, currentUserId]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/social?userId=${userId}&action=profile`);
      const data = await response.json();
      setProfile(data);
      if (isOwnProfile) {
        setVisibilitySettings({
          profileVisibility: data.settings.profileVisibility,
          outfitVisibility: data.settings.outfitVisibility
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const checkFollowingStatus = async () => {
    try {
      const response = await fetch(`/api/social?userId=${currentUserId}&action=following`);
      const following = await response.json();
      setIsFollowing(following.some((user: User) => user._id === userId));
    } catch (error) {
      console.error('Error checking following status:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isFollowing ? 'unfollow' : 'follow',
          userId: currentUserId,
          targetId: userId
        })
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleVisibilityUpdate = async () => {
    try {
      await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateVisibility',
          userId: currentUserId,
          ...visibilitySettings
        })
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="coffee-card mb-6">
        <div className="flex items-center gap-6">
          {profile.image && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={profile.image}
                alt={profile.name || 'Profile'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-satisfy text-3xl text-secondary">{profile.name}</h1>
            {profile.social?.bio && (
              <p className="text-accent/80 mt-2">{profile.social.bio}</p>
            )}
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <div className="font-bold">{profile.stats.totalOutfits}</div>
                <div className="text-sm text-accent/60">Outfits</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profile.social?.followers?.length || 0}</div>
                <div className="text-sm text-accent/60">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profile.social?.following?.length || 0}</div>
                <div className="text-sm text-accent/60">Following</div>
              </div>
            </div>
          </div>
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className={`btn-primary ${isFollowing ? 'bg-secondary' : ''}`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Visibility Settings */}
        {isOwnProfile && isEditing && (
          <div className="mt-6 p-4 bg-neutral/20 rounded-lg">
            <h3 className="font-satisfy text-xl text-secondary mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-accent/80 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={visibilitySettings.profileVisibility}
                  onChange={(e) => setVisibilitySettings(prev => ({
                    ...prev,
                    profileVisibility: e.target.value as 'public' | 'private' | 'followers'
                  }))}
                  className="w-full p-2 rounded-md border border-primary/20 bg-text"
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/80 mb-2">
                  Outfits Visibility
                </label>
                <select
                  value={visibilitySettings.outfitVisibility}
                  onChange={(e) => setVisibilitySettings(prev => ({
                    ...prev,
                    outfitVisibility: e.target.value as 'public' | 'private' | 'followers'
                  }))}
                  className="w-full p-2 rounded-md border border-primary/20 bg-text"
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <button
                onClick={handleVisibilityUpdate}
                className="btn-primary w-full"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg bg-neutral/20 p-1">
          {(['outfits', 'favorites', 'followers', 'following'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-satisfy text-lg transition-all ${
                activeTab === tab
                  ? 'bg-primary text-text'
                  : 'text-secondary hover:bg-primary/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid-layout">
        {/* Add content for each tab */}
        {/* This will be populated based on the activeTab state */}
      </div>
    </div>
  );
};
