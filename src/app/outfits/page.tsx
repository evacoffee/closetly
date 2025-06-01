'use client';

export default function OutfitsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6 font-['Anton'] tracking-wide">YOUR OUTFITS</h1>
          <p className="text-xl text-gray-600 font-['Russo_One']">
            Browse and create new outfit combinations
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Placeholder for outfit cards */}
            <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">+ Create New Outfit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
