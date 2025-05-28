"use client";

import * as React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variants: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={reset}
              variant="default"
              className="w-full sm:w-auto"
            >
              Try again
            </Button>
            <Link 
              href="/" 
              className="w-full sm:w-auto"
            >
              <Button 
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
