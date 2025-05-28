'use client';

import React, { Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StyleDefinition } from '@/config/styles';
import { AgeProfile } from '@/components/AgeProfileSelector';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load the heavy component
const StyleQuizComponent = dynamic(
  () => import('./StyleQuizComponent'),
  { 
    loading: () => <div className="flex justify-center items-center h-64"><div className="loading loading-spinner loading-lg" /></div>,
    ssr: false 
  }
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div role="alert" className="alert alert-error">
    <div>
      <span>Something went wrong:</span>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
    </div>
    <button onClick={resetErrorBoundary} className="btn btn-sm">Try again</button>
  </div>
);

function StyleQuiz() {
  const router = useRouter();
  const [ageProfile, setAgeProfile] = React.useState<AgeProfile | null>(null);
  const [selectedStyles, setSelectedStyles] = React.useState<StyleDefinition[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Safely get from localStorage with error handling
  const getFromLocalStorage = useCallback(<T,>(key: string, defaultValue: T): T => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error(`Error accessing localStorage key "${key}":`, err);
      setError('Failed to load your profile data. Please refresh the page.');
      return defaultValue;
    }
  }, []);

  // Load profile data
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const savedProfile = getFromLocalStorage<AgeProfile | null>('ageProfile', null);
        if (savedProfile) {
          setAgeProfile(savedProfile);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [getFromLocalStorage]);

  const handleQuizComplete = async (selectedStyles: StyleDefinition[], ageProfile: AgeProfile, bodyPhoto?: string) => {
    try {
      setIsLoading(true);
      const profileData = {
        styles: selectedStyles.map(style => style.id),
        ageProfile,
        bodyPhoto,
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Track completion
      if (window.gtag) {
        window.gtag('event', 'quiz_completed', {
          style_count: selectedStyles.length,
          has_photo: !!bodyPhoto
        });
      }
      
      router.push('/wardrobe');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save your preferences. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const progress = selectedStyles.length / 5 * 100;

  if (isLoading && !ageProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p>Loading your style profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="alert alert-error max-w-md">
          <div>
            <span>{error}</span>
          </div>
          <button 
            className="btn btn-sm" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="min-h-screen" role="main" aria-label="Style Quiz">
        <div 
          className="fixed top-0 left-0 right-0 h-2 bg-neutral"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg" />
          </div>
        }>
          <StyleQuizComponent 
            onComplete={handleQuizComplete} 
            maxSelections={5} 
            ageProfile={ageProfile || undefined}
            disabled={isLoading}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default StyleQuiz;