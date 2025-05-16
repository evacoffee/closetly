import { useState } from 'react';
import { StyleCard } from './StyleCard';
import { fashionStyles, StyleDefinition } from '@/config/styles';
import { AgeProfile } from './AgeProfileSelector';

interface StyleQuizProps {
  onComplete: (selectedStyles: StyleDefinition[], ageProfile: AgeProfile) => void;
  maxSelections?: number;
  ageProfile?: AgeProfile;
}

export const StyleQuiz = ({ onComplete, maxSelections = 5, ageProfile }: StyleQuizProps) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(styleId)) {
        return prev.filter((id) => id !== styleId);
      }
      if (prev.length >= maxSelections) {
        return prev;
      }
      return [...prev, styleId];
    });
  };

  const handleSubmit = () => {
    const selectedStyleObjects = fashionStyles.filter((style) =>
      selectedStyles.includes(style.id)
    );
    
    if (!ageProfile) {
      console.error('Age profile is required to complete style quiz');
      return;
    }

    // Combine user's selected styles with age profile style preferences
    onComplete(selectedStyleObjects, ageProfile);
  };

  return (
    <div className="max-w-7xl mx-auto container-padding">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-satisfy">Discover Your Personal Style</h1>
        <p className="text-lg font-amatic mb-6">
          Choose up to {maxSelections} styles that resonate with your fashion sense
        </p>
        <div className="inline-block px-6 py-2 bg-accent/10 rounded-full">
          <span className="font-satisfy text-xl">
            {selectedStyles.length} of {maxSelections} styles selected
          </span>
        </div>
      </div>

      <div className="grid-layout">
        {fashionStyles.map((style) => (
          <StyleCard
            key={style.id}
            style={style}
            selected={selectedStyles.includes(style.id)}
            onSelect={handleStyleSelect}
          />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          className={`btn-primary text-2xl px-8 py-3 ${
            selectedStyles.length === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'transform hover:scale-105'
          }`}
          onClick={handleSubmit}
          disabled={selectedStyles.length === 0}
        >
          Complete Style Quiz
        </button>
      </div>
      
      {selectedStyles.length === maxSelections && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-accent text-text px-6 py-3 rounded-full shadow-lg animate-bounce">
            <p className="font-amatic text-xl">Maximum styles selected!</p>
          </div>
        </div>
      )}
    </div>
  );
};
