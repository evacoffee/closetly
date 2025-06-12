import { Metadata } from 'next';
import { SmartOutfitRecommendations } from '@/components/outfit/SmartOutfitRecommendations';

export const metadata: Metadata = {
  title: 'Outfit Recommendations | Closetly',
  description: 'Get personalized outfit recommendations based on your wardrobe and preferences.',
};

export default function OutfitRecommendationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Outfit Recommendations</h1>
          <p className="text-muted-foreground">
            Discover personalized outfit suggestions based on your wardrobe, preferences, and the occasion.
          </p>
        </div>
        
        <SmartOutfitRecommendations 
          showPreferencesForm={true}
          limit={6}
        />
      </div>
    </div>
  );
}
