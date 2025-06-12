import React from 'react';

export const KittenLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg 
        className="w-12 h-12 transform-gpu"
        viewBox="0 0 100 100"
      >
        <path d="M25 30 L50 45 L40 60 Z" fill="#5A3C2B" />
        <path d="M75 30 L50 45 L60 60 Z" fill="#5A3C2B" />
        
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
              
        <ellipse cx="35" cy="50" rx="4" ry="5" fill="#333" />
        <ellipse cx="65" cy="50" rx="4" ry="5" fill="#333" />
        
        <ellipse cx="33" cy="47" rx="1" ry="1.5" fill="rgba(255,255,255,0.6)" />
        <ellipse cx="63" cy="47" rx="1" ry="1.5" fill="rgba(255,255,255,0.6)" />
        
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
              
        <path d="M40 65 L20 60" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M40 68 L20 68" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M60 65 L80 60" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M60 68 L80 68" stroke="#5A3C2B" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
