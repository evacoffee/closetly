'use client';

import Link from 'next/link';
import * as React from 'react';
const { useState } = React;

const WardrobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-4">
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M7 7h.01" />
    <path d="M17 7h.01" />
    <path d="M7 12h.01" />
    <path d="M17 12h.01" />
  </svg>
);

const StyleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-4">
    <circle cx="12" cy="8" r="5" />
    <path d="M12 13v9" />
    <path d="M9 19h6" />
    <path d="M5 8a7 7 0 1 0 14 0 7 7 0 1 0-14 0" />
  </svg>
);

const OutfitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-4">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const FeaturedOutfit = ({ color, title, description }: { color: string, title: string, description: string }) => (
  <div className="card card-hover overflow-hidden">
    <div className={`h-48 -mx-6 -mt-6 mb-4 overflow-hidden ${color} flex items-center justify-center`}>
      <OutfitIcon />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-neutral-600 text-sm">{description}</p>
    <div className="mt-4 flex justify-end">
      <button className="btn-sm btn-outline">View Details</button>
    </div>
  </div>
);

export default function Home() {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks for subscribing with ${email}! We'll keep you updated.`);
    setEmail('');
  };

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Closetly provides all the tools you need to manage your wardrobe and elevate your style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Link href="/wardrobe" className="card card-hover text-center p-8">
              <div className="flex justify-center text-primary">
                <WardrobeIcon />
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Wardrobe</h3>
              <p className="text-neutral-600">
                Organize and manage your clothing collection with ease. Add items, categorize them, and keep track of what you own.
              </p>
            </Link>
            
            <Link href="/style-quiz" className="card card-hover text-center p-8">
              <div className="flex justify-center text-primary">
                <StyleIcon />
              </div>
              <h3 className="text-xl font-semibold mb-3">Style Quiz</h3>
              <p className="text-neutral-600">
                Discover your personal style preferences through our interactive quiz and get personalized recommendations.
              </p>
            </Link>
            
            <Link href="/outfits" className="card card-hover text-center p-8">
              <div className="flex justify-center text-primary">
                <OutfitIcon />
              </div>
              <h3 className="text-xl font-semibold mb-3">Outfit Ideas</h3>
              <p className="text-neutral-600">
                Get inspiration for your daily outfits based on your wardrobe, style preferences, and the weather.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-neutral-600 mb-8">
              Subscribe to our newsletter for style tips, wardrobe organization ideas, and app updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="form-input flex-grow"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
