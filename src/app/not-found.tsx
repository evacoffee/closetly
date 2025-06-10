import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-900 to-coffee-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full bg-surface/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-coffee-800/50">
        {/* Coffee Mug Illustration */}
        <div className="mx-auto w-32 h-32 mb-8 relative">
          <div className="absolute w-full h-full rounded-full border-4 border-caramel opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl">☕</div>
        </div>
        
        <h1 className="text-8xl font-playfair font-bold text-cream mb-2">404</h1>
        <h2 className="text-3xl font-medium text-latte mb-6">Brewing Up a Storm</h2>
        
        <p className="text-latte/80 text-lg mb-8 max-w-lg mx-auto">
          Oops! The page you're looking for seems to have evaporated like steam from a fresh cup. 
          Let's get you back to your wardrobe.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/" 
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Back to Home
          </Link>
          <Link 
            href="/wardrobe" 
            className="btn btn-outline px-8 py-3 text-lg"
          >
            View Wardrobe
          </Link>
        </div>
        
        <div className="mt-12 pt-6 border-t border-coffee-800/30">
          <p className="text-coffee-400 text-sm">
            Need help? <a href="/contact" className="text-caramel hover:underline">Contact support</a>
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-caramel/10 blur-xl"></div>
      <div className="absolute top-1/4 right-8 w-24 h-24 rounded-full bg-caramel/5 blur-xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-caramel/15 blur-lg"></div>
    </div>
  );
}
