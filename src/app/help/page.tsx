// @ts-nocheck
'use client';

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Help & Support</h1>
      
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">How do I add items to my wardrobe?</h3>
              <p className="text-gray-600 mt-1">Go to the Wardrobe tab and click the + button to add new clothing items.</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">How do I create an outfit?</h3>
              <p className="text-gray-600 mt-1">Navigate to the Outfits tab and select 'Create New Outfit' to combine items from your wardrobe.</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">Can I share my outfits?</h3>
              <p className="text-gray-600 mt-1">Yes! You can share your outfits with friends via social media or messaging apps.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">Need further assistance? Reach out to our support team.</p>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <a href="mailto:support@fitapp.com" className="hover:underline">support@fitapp.com</a>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <a href="tel:+15551234567" className="hover:underline">+1 (555) 123-4567</a>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">App Information</h2>
          <div className="space-y-2 text-gray-600">
            <p>Version: 1.0.0</p>
            <p>Last Updated: May 2024</p>
            <p>© 2024 FIT. All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
