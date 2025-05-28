'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+ App Router
import { StyleDefinition } from '@/config/styles';
import { AgeProfile } from '@/components/AgeProfileSelector';
import { StyleQuiz as StyleQuizComponent } from './StyleQuizComponent';

export default function StyleQuizPage() {
  const router = useRouter();
  const [ageProfile, setAgeProfile] = React.useState<AgeProfile | null>(null);
  const [selectedStyles, setSelectedStyles] = React.useState<StyleDefinition[]>([]);

  React.useEffect(() => {
    // Load age profile from localStorage or context if available
    const savedProfile = localStorage.getItem('ageProfile');
    if (savedProfile) {
      setAgeProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleQuizComplete = async (selectedStyles: StyleDefinition[], ageProfile: AgeProfile, bodyPhoto?: string) => {
    try {
      // Save selected styles and body photo to user profile
      const profileData = {
        styles: selectedStyles.map(style => style.id),
        ageProfile,
        bodyPhoto,
        updatedAt: new Date().toISOString()
      };

      // Here you would typically save to your backend
      console.log('Saving profile data:', profileData);
      
      // For now, save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      router.push('/wardrobe'); // Redirect to wardrobe page after completion
    } catch (error) {
      console.error('Error saving style preferences:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 h-2 bg-neutral">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${(selectedStyles.length / 5) * 100}%` }}
        />
      </div>
      <StyleQuizComponent 
        onComplete={handleQuizComplete} 
        maxSelections={5} 
        ageProfile={ageProfile || undefined} 
      />
    </div>
  );
}