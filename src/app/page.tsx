'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="mb-6">Welcome to your Digital Wardrobe</h1>
      <p className="text-lg mb-8 max-w-2xl">
        Organize your clothing collection, discover perfect outfit combinations, 
        and connect with fashion enthusiasts like you.
      </p>
      <div className="space-x-4">
        <Link href="/auth/signin" className="btn-primary">
          Get Started
        </Link>
        <Link href="/about" className="btn-secondary">
          Learn More
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        <div className="card">
          <h2 className="mb-4">Catalog Your Collection</h2>
          <p>Upload photos and details of your clothing items for easy organization.</p>
        </div>
        <div className="card">
          <h2 className="mb-4">Generate Outfits</h2>
          <p>Get personalized outfit suggestions based on your style preferences.</p>
        </div>
        <div className="card">
          <h2 className="mb-4">Connect & Share</h2>
          <p>Join a community of fashion enthusiasts and share your unique style.</p>
        </div>
      </div>
    </div>
  )
}
