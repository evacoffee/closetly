import { useState } from 'react';

interface AgeProfileSelectorProps {
  onSelect: (profile: AgeProfile) => void;
}

export interface AgeProfile {
  ageRange: {
    min: number;
    max: number;
  };
  category: 'teen' | 'young-adult' | 'adult' | 'mature' | 'senior';
  stylePreferences: string[];
}

const AGE_PROFILES: AgeProfile[] = [
  {
    ageRange: { min: 13, max: 19 },
    category: 'teen',
    stylePreferences: [
      'trendy', 
      'streetwear', 
      'casual', 
      'sporty', 
      'athleisure'
    ]
  },
  {
    ageRange: { min: 20, max: 29 },
    category: 'young-adult',
    stylePreferences: [
      'modern', 
      'experimental', 
      'streetwear', 
      'minimalist', 
      'edgy'
    ]
  },
  {
    ageRange: { min: 30, max: 44 },
    category: 'adult',
    stylePreferences: [
      'professional', 
      'smart-casual', 
      'classic', 
      'business-casual', 
      'minimalist'
    ]
  },
  {
    ageRange: { min: 45, max: 59 },
    category: 'mature',
    stylePreferences: [
      'elegant', 
      'classic', 
      'business-casual', 
      'sophisticated', 
      'refined'
    ]
  },
  {
    ageRange: { min: 60, max: 100 },
    category: 'senior',
    stylePreferences: [
      'classic', 
      'comfortable', 
      'traditional', 
      'elegant', 
      'timeless'
    ]
  }
];

export const AgeProfileSelector = ({ onSelect }: AgeProfileSelectorProps) => {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [customizing, setCustomizing] = useState(false);

  const handleAgeSelect = (age: number) => {
    setSelectedAge(age);
    const profile = AGE_PROFILES.find(
      p => age >= p.ageRange.min && age <= p.ageRange.max
    );
    if (profile) {
      onSelect(profile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-text/95 rounded-2xl shadow-xl">
      <h2 className="font-satisfy text-3xl text-secondary mb-6 text-center">
        Let&apos;s Find Your Perfect Style
      </h2>

      {!customizing ? (
        <div className="space-y-6">
          <p className="text-center text-accent/80 mb-8">
            To provide the most relevant outfit suggestions, please select your age group:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {AGE_PROFILES.map((profile) => (
              <button
                key={profile.category}
                onClick={() => handleAgeSelect((profile.ageRange.min + profile.ageRange.max) / 2)}
                className={`p-4 rounded-xl transition-all duration-300 hover:shadow-md
                  ${selectedAge && 
                    selectedAge >= profile.ageRange.min && 
                    selectedAge <= profile.ageRange.max
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-neutral/30 hover:bg-neutral/40'
                  }`}
              >
                <h3 className="font-satisfy text-xl text-secondary mb-2">
                  {profile.category.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <p className="text-sm text-accent/70">
                  {profile.ageRange.min}-{profile.ageRange.max} years
                </p>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCustomizing(true)}
              className="text-primary underline hover:text-primary/80"
            >
              Enter specific age
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <label htmlFor="age" className="text-lg text-accent/80 mb-2">
              Enter your age:
            </label>
            <input
              type="number"
              id="age"
              min="4"
              max="100"
              className="w-24 text-center px-4 py-2 rounded-lg border-2 border-primary/20 focus:border-primary focus:outline-none"
              onChange={(e) => handleAgeSelect(parseInt(e.target.value))}
            />
          </div>

          <div className="text-center">
            <button
              onClick={() => setCustomizing(false)}
              className="text-primary underline hover:text-primary/80"
            >
              Back to age groups
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
