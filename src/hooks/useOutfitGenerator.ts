import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { 
  OutfitSuggestion, 
  GenerateOutfitParams, 
  SaveOutfitParams, 
  OutfitGeneratorError 
} from '@/types/outfit';

interface UseOutfitGeneratorReturn {
  generateOutfit: (occasion: string, weather?: any) => Promise<OutfitSuggestion | null>;
  saveOutfit: (outfit: OutfitSuggestion) => Promise<boolean>;
  suggestion: OutfitSuggestion | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  clearError: () => void;
}

export function useOutfitGenerator(): UseOutfitGeneratorReturn {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestion, setSuggestion] = React.useState<OutfitSuggestion | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const clearError = React.useCallback(() => setError(null), []);

  const generateOutfit = React.useCallback(
    async (occasion: string, location?: string): Promise<OutfitSuggestion | null> => {
      if (!session?.user?.id) {
        setError('You must be logged in to generate outfits');
        router.push('/auth/signin');
        return null;
      }

      if (!occasion) {
        setError('Please select an occasion');
        return null;
      }

      setIsLoading(true);
      clearError();

      try {
        const params: GenerateOutfitParams = {
          occasion,
          location,
          timestamp: Date.now(),
        };

        const response = await fetch('/api/ai/outfit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const error = new Error(errorData.message || 'Failed to generate outfit');
          throw error;
        }

        const data = await response.json();
        setSuggestion(data);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate outfit';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [session, router, clearError]
  );

  const saveOutfit = React.useCallback(
    async (outfit: OutfitSuggestion): Promise<boolean> => {
      if (!session?.user?.id) {
        setError('You must be logged in to save outfits');
        router.push('/auth/signin');
        return false;
      }

      setIsSaving(true);
      clearError();

      try {
        const response = await fetch('/api/outfits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...outfit,
            userId: session.user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save outfit');
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save outfit';
        setError(errorMessage);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [session, router, clearError]
  );

  return {
    generateOutfit,
    saveOutfit,
    suggestion,
    isLoading,
    isSaving,
    error,
    clearError,
  };
}
