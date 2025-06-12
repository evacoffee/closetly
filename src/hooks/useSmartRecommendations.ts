'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { 
  OutfitRecommendation, 
  RecommendationFeedback, 
  RecommendationPreferences 
} from '@/types/recommendations';

interface UseSmartRecommendationsProps {
  userId?: string;
  limit?: number;
}

export function useSmartRecommendations({ 
  userId, 
  limit = 5 
}: UseSmartRecommendationsProps = {}) {
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  const fetchRecommendations = useCallback(async (filters: RecommendationPreferences = {}) => {
    const currentUserId = userId || session?.user?.id;
    
    if (!currentUserId) {
      router.push('/auth/signin');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommend/outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          limit,
          ...filters,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      return data.recommendations;
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, session, limit, router]);

  const rateRecommendation = useCallback(async (
    recommendationId: string, 
    rating: number,
    feedback?: string
  ) => {
    try {
      const response = await fetch('/api/ai/recommend/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendationId,
          rating,
          feedback,
          userId: userId || session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      return await response.json();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      throw err;
    }
  }, [userId, session]);

  return {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    rateRecommendation,
    clearError,
  };
}
