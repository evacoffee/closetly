'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary mb-6 font-['Anton'] tracking-wide">WELCOME TO CLOSETLY</h1>
          <p className="text-xl text-gray-600 mb-8 font-['Russo_One']">
            Your personal digital wardrobe and style assistant
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-3 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">Your Wardrobe</h2>
              <p className="text-gray-600 font-['Russo_One']">Organize and manage your clothing collection</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-3 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">Style Quiz</h2>
              <p className="text-gray-600 font-['Russo_One']">Discover your personal fashion style</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-3 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">Outfit Ideas</h2>
              <p className="text-gray-600 font-['Russo_One']">Get inspired with personalized outfit suggestions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
