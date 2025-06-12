'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StyleDefinition } from '@/config/styles';

const StyleQuiz = ({
  onComplete,
  maxSelections
}: {
  onComplete: (styles: StyleDefinition[]) => void;
  maxSelections: number;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [QuizComponent, setQuizComponent] = React.useState<React.ComponentType<{
    onComplete: (styles: StyleDefinition[], ageProfile: any, bodyPhoto?: string) => void;
    maxSelections: number;
  }> | null>(null);

  React.useEffect(() => {
    import('@/components/StyleQuiz').then(module => {
      setQuizComponent(() => module.default);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !QuizComponent) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }


  const handleQuizComplete = (
    styles: StyleDefinition[],
    ageProfile: any,
    bodyPhoto?: string
  ) => {
    onComplete(styles);
  };

  return <QuizComponent onComplete={handleQuizComplete} maxSelections={maxSelections} />;
};



const OCCASIONS = ['Casual', 'Work', 'Date Night', 'Party', 'Formal'] as const;
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'] as const;

interface Outfit {
  id: string;
  title: string;
  description: string;
  image: string;
  occasion: string;
  season: string;
  items: string[];
  styles: string[];
}

const OUTFITS: Outfit[] = [
  {
    id: '1',
    title: 'Chic Summer Day',
    description: 'Perfect for a sunny day out in the city',
    image: '/images/outfits/summer-day.jpg',
    occasion: 'Casual',
    season: 'Summer',
    styles: ['casual', 'minimalist'],
    items: [
      'Linen button-down shirt',
      'High-waisted shorts',
      'Straw hat',
      'Leather sandals',
      'Tote bag'
    ]
  },
];



export function FashionHub() {
  const [activeTab, setActiveTab] = React.useState('style-quiz');
  const [selectedStyles, setSelectedStyles] = React.useState<StyleDefinition[]>([]);
  const [selectedOccasion, setSelectedOccasion] = React.useState<string>('Casual');
  const [selectedSeason, setSelectedSeason] = React.useState<string>('Summer');
  const [quizCompleted, setQuizCompleted] = React.useState(false);
  
  const handleQuizComplete = (styles: StyleDefinition[]) => {
    setSelectedStyles(styles);
    setQuizCompleted(true);
    setActiveTab('outfits');
  };

  const filteredOutfits = OUTFITS.filter(outfit => {
    const matchesStyle = selectedStyles.length === 0 || 
      selectedStyles.some(style => outfit.styles.includes(style.id));
    const matchesOccasion = outfit.occasion === selectedOccasion;
    const matchesSeason = outfit.season === selectedSeason;
    return matchesStyle && matchesOccasion && matchesSeason;
  });

  const renderTab = () => {
    if (activeTab === 'style-quiz') {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Discover Your Style</h3>
          <StyleQuiz 
            onComplete={handleQuizComplete} 
            maxSelections={5}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Outfit Inspiration</h3>
          {selectedStyles.length > 0 && (
            <div className="flex gap-2">
              {selectedStyles.map(style => (
                <span key={style.id} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {style.name}
                </span>
              ))}
            </div>
          )}
        </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Occasion</h4>
                <Select
                  value={selectedOccasion}
                  onValueChange={setSelectedOccasion}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCCASIONS.map((occasion) => (
                      <SelectItem key={occasion} value={occasion}>
                        {occasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Season</h4>
                <Select
                  value={selectedSeason}
                  onValueChange={setSelectedSeason}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((season) => (
                      <SelectItem key={season} value={season}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredOutfits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOutfits.map((outfit) => (
                  <Card key={outfit.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 relative">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {outfit.title} Image
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium">{outfit.title}</h4>
                      <p className="text-sm text-gray-500 mb-3">{outfit.description}</p>
                      <div className="space-y-1">
                        <h5 className="text-sm font-medium">Key Pieces:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {outfit.items.map((item, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No outfits found for the selected filters. Try different combinations!
              </div>
            )}
          </div>
        );
      };

  return (
    <div className="space-y-8">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'style-quiz' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('style-quiz')}
        >
          Style Quiz
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'outfits' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-gray-500'
          } ${!quizCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => quizCompleted && setActiveTab('outfits')}
          disabled={!quizCompleted}
        >
          Outfit Ideas
        </button>
      </div>
      
      <Card className="p-6">
        {renderTab()}
      </Card>
    </div>
  );
}
