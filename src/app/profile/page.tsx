'use client';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-6 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">👤</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-primary mb-6 font-['Anton'] tracking-wide">YOUR PROFILE</h1>
          <p className="text-xl text-gray-600 font-['Russo_One']">
            Manage your account and preferences
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-['Russo_One'] mb-1">Username</label>
                  <div className="p-3 bg-gray-100 rounded">user123</div>
                </div>
                <div>
                  <label className="block text-gray-700 font-['Russo_One'] mb-1">Email</label>
                  <div className="p-3 bg-gray-100 rounded">user@example.com</div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">Style Preferences</h2>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600 font-['Russo_One']">Complete the style quiz to get personalized recommendations</p>
                <button className="mt-3 px-4 py-2 bg-[#6F4E37] text-white rounded hover:bg-[#5A3C2B] transition-colors font-['Russo_One']">
                  Take Style Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
