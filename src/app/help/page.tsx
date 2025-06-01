'use client';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6 font-['Anton'] tracking-wide">HELP & SUPPORT</h1>
          <p className="text-xl text-gray-600 font-['Russo_One']">
            Get assistance with using Closetly
          </p>
        </div>
        
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 font-['Anton'] tracking-wide text-[#5A3C2B]">How do I add items to my wardrobe?</h3>
                <p className="text-gray-600 font-['Russo_One']">Go to the Wardrobe tab and click the + button to add new clothing items with photos and details.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 font-['Anton'] tracking-wide text-[#5A3C2B]">How do I create an outfit?</h3>
                <p className="text-gray-600 font-['Russo_One']">Navigate to the Outfits tab and select 'Create New Outfit' to combine items from your wardrobe.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 font-['Anton'] tracking-wide text-[#5A3C2B]">Can I share my outfits?</h3>
                <p className="text-gray-600 font-['Russo_One']">Yes! You can share your outfits with friends via social media or messaging apps.</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">Contact Us</h2>
            <p className="text-gray-600 mb-6 font-['Russo_One'] text-lg">Need further assistance? Our support team is here to help.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="mr-3 text-2xl">📧</span>
                <div>
                  <p className="font-['Russo_One'] text-gray-500">Email us at</p>
                  <a href="mailto:support@closetly.app" className="text-[#6F4E37] hover:underline font-['Anton'] tracking-wide text-lg">
                    support@closetly.app
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-2xl">💬</span>
                <div>
                  <p className="font-['Russo_One'] text-gray-500">Live chat</p>
                  <p className="text-[#6F4E37] font-['Anton'] tracking-wide text-lg">Available 9AM-5PM EST</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 font-['Anton'] tracking-wide text-[#6F4E37] uppercase">App Information</h2>
            <div className="space-y-2 font-['Russo_One'] text-gray-600">
              <p>Version: 1.0.0</p>
              <p>Last Updated: May 2025</p>
              <p>© 2025 Closetly. All rights reserved.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
