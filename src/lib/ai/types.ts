export interface WardrobeItem {
    id: string;
    name: string;
    type: string;
    color: string;
    material: string;
    weatherSuitability: string[];
    formality: 'casual' | 'business' | 'formal' | 'athletic';
    layerable: boolean;
    // Add other relevant fields
  }
  
  export interface OutfitSuggestion {
    top: WardrobeItem;
    bottom: WardrobeItem;
    outerwear?: WardrobeItem;
    shoes?: WardrobeItem;
    accessories?: WardrobeItem[];
    rating: number;
    reason: string;
  }