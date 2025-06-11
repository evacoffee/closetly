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

  const generateOutfit = React.useCallback(async (occasion: string, weatherData?: any): Promise<OutfitSuggestion | null> => {
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
        weather: weatherData,
        timestamp: Date.now() // Prevent caching
      };

      const response = await fetch('/api/ai/outfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Failed to generate outfit') as OutfitGeneratorError;
      error.code = errorData.code;
      error.status = response.status;
      throw error;
      }

      const data = await response.json();
      setSuggestion(data);
      return data;
    } catch (err) {
      console.error('Error generating outfit:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate outfit';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session, router, clearError]);

  const saveOutfit = React.useCallback(async (outfit: OutfitSuggestion): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('You must be logged in to save outfits');
      router.push('/auth/signin');
      return false;
    }
    if (!session?.user?.id) {
      setError('You must be logged in to save outfits');
      router.push('/auth/signin');
      return false;
    }

    setIsSaving(true);
    clearError();

    try {
      const params: SaveOutfitParams = {
        ...outfit,
        userId: session.user.id
      };

      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Failed to save outfit') as OutfitGeneratorError;
        error.code = errorData.code;
        error.status = response.status;
        throw error;
      }

      return true;
    } catch (err) {
      console.error('Error saving outfit:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save outfit';
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [session, router, clearError]);

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
