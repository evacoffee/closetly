'use client';

import { FashionHub } from '@/components/fashion/FashionHub';

export default function FashionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Fashion Hub</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover your personal style and get inspired with outfit ideas
        </p>
      </div>
      <FashionHub />
    </div>
  );
}
