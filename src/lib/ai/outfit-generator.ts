import { WeatherService, type WeatherData } from './weather-service';
import type { WardrobeItem, OutfitSuggestion } from './types';

export class OutfitGenerator {
  private static instance: OutfitGenerator;
  private weatherService: WeatherService;

  private constructor() {
    this.weatherService = new WeatherService();
  }

  public static getInstance(): OutfitGenerator {
    if (!OutfitGenerator.instance) {
      OutfitGenerator.instance = new OutfitGenerator();
    }
    return OutfitGenerator.instance;
  }

  async generateOutfit(
    userId: string,
    occasion: string,
    location: string
  ): Promise<OutfitSuggestion[]> {
    try {
      // 1. Get user's wardrobe
      const wardrobe = await this.getUserWardrobe(userId);
      
      // 2. Get weather data
      const weather = await this.weatherService.getWeather(location);
      
      // 3. Filter items by weather and occasion
      const suitableItems = this.filterItemsByConditions(wardrobe, weather, occasion);
      
      // 4. Generate outfit combinations
      const outfitSuggestions = this.generateOutfitCombinations(suitableItems, weather, occasion);
      
      // 5. Rank and return top suggestions
      return this.rankOutfits(outfitSuggestions, weather, occasion).slice(0, 5);
      
    } catch (error) {
      console.error('Error generating outfit:', error);
      throw new Error('Failed to generate outfit suggestions');
    }
  }

  private async getUserWardrobe(userId: string): Promise<WardrobeItem[]> {
    // In a real implementation, this would fetch from your database
    const response = await fetch(`/api/wardrobe?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch wardrobe');
    }
    return response.json();
  }

  private filterItemsByConditions(
    items: WardrobeItem[],
    weather: WeatherData,
    occasion: string
  ): WardrobeItem[] {
    return items.filter(item => {
      // Filter by weather suitability
      const isWeatherSuitable = this.isItemSuitableForWeather(item, weather);
      
      // Filter by occasion
      const isOccasionSuitable = this.isItemSuitableForOccasion(item, occasion);
      
      return isWeatherSuitable && isOccasionSuitable;
    });
  }

  private isItemSuitableForWeather(item: WardrobeItem, weather: WeatherData): boolean {
    // Simple weather suitability check
    if (weather.temperature < 10 && !item.weatherSuitability.includes('cold')) {
      return false;
    }
    if (weather.temperature > 25 && !item.weatherSuitability.includes('hot')) {
      return false;
    }
    if (weather.isRaining && !item.weatherSuitability.includes('rain')) {
      return false;
    }
    return true;
  }

  private isItemSuitableForOccasion(item: WardrobeItem, occasion: string): boolean {
    // Simple occasion check
    const occasionMap: Record<string, string[]> = {
      casual: ['casual', 'business'],
      business: ['business', 'formal'],
      formal: ['formal'],
      athletic: ['athletic']
    };
    
    return occasionMap[occasion]?.includes(item.formality) ?? true;
  }

  private generateOutfitCombinations(
    items: WardrobeItem[],
    weather: WeatherData,
    occasion: string
  ): OutfitSuggestion[] {
    // Group items by type
    const tops = items.filter(item => this.isTop(item));
    const bottoms = items.filter(item => this.isBottom(item));
    const outerwear = items.filter(item => this.isOuterwear(item));
    const shoes = items.filter(item => this.isShoes(item));
    
    const combinations: OutfitSuggestion[] = [];
    
    // Generate combinations
    for (const top of tops) {
      for (const bottom of bottoms) {
        // Basic outfit
        const outfit: OutfitSuggestion = {
          top,
          bottom,
          rating: 0,
          reason: ''
        };
        
        // Add outerwear if needed
        if (weather.temperature < 18 && outerwear.length > 0) {
          outfit.outerwear = outerwear[Math.floor(Math.random() * outerwear.length)];
        }
        
        // Add shoes
        if (shoes.length > 0) {
          outfit.shoes = shoes[Math.floor(Math.random() * shoes.length)];
        }
        
        combinations.push(outfit);
      }
    }
    
    return combinations;
  }

  private rankOutfits(
    outfits: OutfitSuggestion[],
    weather: WeatherData,
    occasion: string
  ): OutfitSuggestion[] {
    return outfits.map(outfit => {
      let rating = 5; // Base rating
      
      // Rate based on weather
      if (weather.temperature < 10 && !outfit.outerwear) {
        rating -= 2;
      }
      
      if (weather.isRaining && outfit.shoes?.material === 'suede') {
        rating -= 1;
      }
      
      // Rate based on occasion
      if (occasion === 'formal' && outfit.top.formality !== 'formal') {
        rating -= 1;
      }
      
      // Rate based on color coordination
      if (outfit.top.color === outfit.bottom.color) {
        rating += 0.5; // Monochrome can be good
      }
      
      return {
        ...outfit,
        rating: Math.max(1, Math.min(5, rating)), // Keep rating between 1-5
        reason: this.generateOutfitReason(outfit, weather, occasion)
      };
    }).sort((a, b) => b.rating - a.rating);
  }

  private generateOutfitReason(
    outfit: OutfitSuggestion,
    weather: WeatherData,
    occasion: string
  ): string {
    const reasons = [];
    
    if (outfit.rating >= 4) {
      reasons.push('Great choice!');
    } else if (outfit.rating >= 3) {
      reasons.push('Good option');
    } else {
      reasons.push('Consider this alternative');
    }
    
    if (weather.temperature < 10 && outfit.outerwear) {
      reasons.push('Includes warm outerwear for the cold weather');
    }
    
    if (occasion === 'business' && outfit.top.formality === 'formal') {
      reasons.push('Perfectly formal for business occasions');
    }
    
    return reasons.join('. ') + '.';
  }

  // Helper methods to categorize items
  private isTop(item: WardrobeItem): boolean {
    return ['shirt', 'blouse', 't-shirt', 'sweater'].includes(item.type);
  }

  private isBottom(item: WardrobeItem): boolean {
    return ['pants', 'skirt', 'shorts', 'jeans'].includes(item.type);
  }

  private isOuterwear(item: WardrobeItem): boolean {
    return ['jacket', 'coat', 'blazer', 'hoodie'].includes(item.type);
  }

  private isShoes(item: WardrobeItem): boolean {
    return ['shoes', 'sneakers', 'boots', 'sandals'].includes(item.type);
  }
}

// Export a singleton instance
export const outfitGenerator = OutfitGenerator.getInstance();