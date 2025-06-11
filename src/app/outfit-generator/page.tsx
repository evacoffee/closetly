import { Metadata } from 'next';
import { OutfitGenerator } from '@/components/outfit/OutfitGenerator';

export const metadata: Metadata = {
  title: 'Outfit Generator | Closetly',
  description: 'Get AI-powered outfit suggestions based on your wardrobe and the occasion.',
};

export default function OutfitGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Outfit Generator</h1>
        <p className="text-gray-600 mb-8">
          Get personalized outfit suggestions based on your wardrobe, the occasion, and even the weather.
          The AI will analyze your clothing items and create stylish combinations just for you.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <OutfitGenerator />
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-medium text-blue-800 mb-2">How it works</h2>
          <ul className="space-y-2 text-blue-700">
            <li>• Select an occasion for your outfit</li>
            <li>• Optionally enable weather consideration and enter your location</li>
            <li>• Click "Generate Outfit" to get AI-powered suggestions</li>
            <li>• Save your favorite outfits to your collection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
