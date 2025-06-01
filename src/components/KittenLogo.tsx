import React from 'react';

export const KittenLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg 
        className="w-12 h-12 transform-gpu"
        viewBox="0 0 100 100"
      >
        {/* Cat head */}
        <circle cx="50" cy="50" r="40" fill="#6F4E37" />
        
        {/* Ears */}
        <path d="M25 30 L50 45 L40 60 Z" fill="#5A3C2B" />
        <path d="M75 30 L50 45 L60 60 Z" fill="#5A3C2B" />
        
        {/* Inner ears */}
        <path d="M30 40 L45 45 L40 55 Z" fill="#8B7355" />
        <path d="M70 40 L55 45 L60 55 Z" fill="#8B7355" />
        
        {/* Relaxed eyebrows */}
        <path d="M25 40 Q35 35 45 38" 
              stroke="#5A3C2B" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round" />
        <path d="M75 40 Q65 35 55 38" 
              stroke="#5A3C2B" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round" />
              
        {/* Eyes */}
        <ellipse cx="35" cy="50" rx="10" ry="12" fill="white" />
        <ellipse cx="65" cy="50" rx="10" ry="12" fill="white" />
        
        {/* Pupils */}
        <ellipse cx="35" cy="50" rx="4" ry="5" fill="#333" />
        <ellipse cx="65" cy="50" rx="4" ry="5" fill="#333" />
        
        {/* Eye highlights */}
        <ellipse cx="37" cy="48" rx="1.5" ry="2" fill="white" />
        <ellipse cx="67" cy="48" rx="1.5" ry="2" fill="white" />
        
        {/* Subtle eye shine */}
        <ellipse cx="33" cy="47" rx="1" ry="1.5" fill="rgba(255,255,255,0.6)" />
        <ellipse cx="63" cy="47" rx="1" ry="1.5" fill="rgba(255,255,255,0.6)" />
        
        {/* Nose - smaller and cuter */}
        <path d="M50 58 L47 62 L53 62 Z" fill="#FF9EAA" />
        
        {/* Mouth - cute smile */}
        <path d="M45 65 Q50 70 55 65" 
              stroke="#5A3C2B" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round" />
        <path d="M47 67 Q50 69 53 67" 
              stroke="#5A3C2B" 
              strokeWidth="1" 
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round" />
              
        {/* Blush marks */}
        <circle cx="25" cy="55" r="5" fill="#F8BBD0" opacity="0.6" />
        <circle cx="75" cy="55" r="5" fill="#F8BBD0" opacity="0.6" />
        
        {/* Whiskers */}
        <path d="M40 65 L20 60" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M40 68 L20 68" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M60 65 L80 60" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M60 68 L80 68" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
