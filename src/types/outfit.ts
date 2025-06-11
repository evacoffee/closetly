// Shared types for outfit-related functionality

export interface OutfitSuggestion {
  outfitName: string;
  items: string[];
  description: string;
  occasion: string;
  stylingTips?: string[];
  alternatives?: string[];
  weather?: {
    temp: number;
    condition: string;
    location: string;
  };
}

export interface GenerateOutfitParams {
  occasion: string;
  weather?: {
    location?: string;
    temp?: number;
    condition?: string;
  };
  timestamp?: number;
}

export interface SaveOutfitParams extends OutfitSuggestion {
  userId: string;
}

export interface OutfitGeneratorError extends Error {
  code?: string;
  status?: number;
}
