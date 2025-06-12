export interface OutfitItem {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  color: string;
  brand?: string;
}

export interface OutfitRecommendation {
  id: string;
  name: string;
  items: OutfitItem[];
  confidence: number;
  reason: string;
  lastWorn?: Date;
  weatherSuitability?: {
    temp: number;
    condition: string;
  };
}

export interface RecommendationFeedback {
  recommendationId: string;
  rating: number; // 1 for like, -1 for dislike
  feedback?: string;
  timestamp: Date;
}

export interface RecommendationPreferences {
  occasion?: string;
  stylePreferences?: string[];
  colorPreferences?: string[];
  weatherConsideration?: boolean;
  location?: string;
}
