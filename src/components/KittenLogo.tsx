import React from 'react';

export const KittenLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg 
        className="w-12 h-12 transform-gpu"
        viewBox="0 0 100 100"
        style={{
          animation: 'kittenBounce 2s ease-in-out infinite'
        }}
      >
        {/* Kitten body */}
        <circle cx="50" cy="55" r="35" fill="currentColor" opacity="0.9" />
        {/* Ears */}
        <path d="M30 30 L50 45 L40 20 Z" fill="currentColor" />
        <path d="M70 30 L50 45 L60 20 Z" fill="currentColor" />
        {/* Face */}
        <circle cx="40" cy="50" r="4" fill="currentColor" className="animate-blink" />
        <circle cx="60" cy="50" r="4" fill="currentColor" className="animate-blink" />
        <path d="M45 60 Q50 65 55 60" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Tail */}
        <path 
          d="M85 55 Q95 45 90 35" 
          stroke="currentColor" 
          strokeWidth="4" 
          fill="none"
          className="origin-bottom animate-tailWag"
        />
      </svg>
    </div>
  );
};
