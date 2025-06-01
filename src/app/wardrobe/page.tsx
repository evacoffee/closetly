'use client';

export default function WardrobePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6 font-['Anton'] tracking-wide">YOUR WARDROBE</h1>
          <p className="text-xl text-gray-600 font-['Russo_One']">
            Organize and manage your clothing collection
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder for clothing items */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">+ Add Item</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
