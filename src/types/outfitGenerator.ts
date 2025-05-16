import { Types } from 'mongoose';

export interface OutfitGeneratorParams {
  userId: string | Types.ObjectId;
  age: number;
  ageCategory: 'teen' | 'young-adult' | 'adult' | 'mature' | 'senior';
  baseStylePreferences: string[];
  occasion?: string;
  season?: string[];
  weather?: string[];
  preferredStyles?: string[];
  preferredColors?: string[];
  excludeItems?: string[];
  gender?: 'male' | 'female' | 'unisex';
  bodyType?: string;
  height?: number;
}

export interface OutfitRules {
  maxItems: number;
  requiredPositions: string[];
  styleCompatibility: Record<string, string[]>;
  colorCompatibility: Record<string, string[]>;
  seasonalRules: Record<string, string[]>;
}

export interface ExternalTip {
  source: 'reddit' | 'pinterest' | 'instagram';
  tip: string;
  category: string;
  style: string[];
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface GenerationResult {
  success: boolean;
  errors: Array<{
    code: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface OutfitRules {
  maxItems: number;
  requiredPositions: string[];
  styleCompatibility: Record<string, string[]>;
  colorCompatibility: Record<string, string[]>;
  seasonalRules: Record<string, string[]>;
}

export interface OutfitGeneratorParams {
  userId: string | Types.ObjectId;
  age: number;
  occasion?: string;
  season?: string[];
  weather?: string[];
  preferredStyles?: string[];
  preferredColors?: string[];
  excludeItems?: string[];
  gender?: 'male' | 'female' | 'unisex';
  bodyType?: string;
  height?: number;
}

export interface ExternalTip {
  source: 'reddit' | 'pinterest' | 'instagram';
  tip: string;
  category: string;
  style: string[];
  ageRange?: {
    min: number;
    max: number;
  };
}
