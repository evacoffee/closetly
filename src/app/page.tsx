'use client'

import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative w-full h-screen">
          <Image
            src="/images/workout-screen.png"
            alt="FIT App Interface"
            fill
            style={{
              objectFit: 'contain',
              objectPosition: 'top',
            }}
            priority
          />
        </div>
      </div>
    </div>
  )
}
