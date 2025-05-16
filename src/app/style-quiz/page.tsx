'use client';

import { StyleQuiz } from '@/components/StyleQuiz';
import { StyleDefinition } from '@/config/styles';
import { useRouter } from 'next/navigation';

export default function StyleQuizPage() {
  const router = useRouter();

  const handleQuizComplete = async (selectedStyles: StyleDefinition[]) => {
    try {
      // TODO: Save selected styles to user profile
      console.log('Selected styles:', selectedStyles);
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
      <StyleQuiz onComplete={handleQuizComplete} maxSelections={5} />
    </div>
  );
}
