import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'cream';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'accent',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  const colorClasses = {
    primary: 'border-coffee-500 border-t-cream',
    secondary: 'border-mocha-500 border-t-cream',
    accent: 'border-caramel-500 border-t-cream',
    cream: 'border-cream/30 border-t-cream',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          rounded-full 
          animate-spin
        `}
        style={{
          borderTopColor: 'currentColor',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
        }}
      >
        <span className="sr-only">Loading...</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-coffee-300">☕</span>
      </div>
    </div>
  );
};

export const PageLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-900/90">
      <div className="text-center">
        <div className="mb-6">
          <LoadingSpinner size="lg" color="accent" />
        </div>
        <h2 className="text-2xl font-playfair font-medium text-cream mb-2">Brewing Your Experience</h2>
        <p className="text-coffee-300">Just a moment while we prepare your perfect blend...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
