import { IClothing } from '@/models/Clothing';
import { IOutfit } from '@/models/Outfit';
import { Types } from 'mongoose';
import { ExternalTip, OutfitGeneratorParams, OutfitRules } from '@/types/outfit';
import { hasMongoId } from './typeGuards';
import { OutfitErrorRegulator } from './errorHandler';

export class OutfitGenerator {
  private static rules: OutfitRules = {
    maxItems: 6,
    requiredPositions: ['top', 'bottom', 'shoes'],
    styleCompatibility: {
      'minimalist': ['classic', 'scandinavian', 'business-casual'],
      'streetwear': ['edgy', 'athleisure', 'urban'],
      'classic': ['minimalist', 'business-casual', 'preppy'],
      'bohemian': ['artsy', 'vintage', 'romantic'],
      'athleisure': ['streetwear', 'sporty', 'casual']
    },
    colorCompatibility: {
      'black': ['white', 'gray', 'navy', 'beige', 'burgundy'],
      'navy': ['white', 'gray', 'beige', 'light-blue', 'burgundy'],
      'white': ['black', 'navy', 'gray', 'beige', 'brown', 'pastels'],
      'beige': ['brown', 'navy', 'black', 'white', 'olive'],
      'gray': ['black', 'navy', 'white', 'pastels', 'burgundy']
    },
    seasonalRules: {
      'summer': ['lightweight', 'breathable', 'short-sleeve', 'linen'],
      'winter': ['warm', 'layerable', 'long-sleeve', 'wool'],
      'spring': ['light-layers', 'water-resistant', 'transitional'],
      'fall': ['layerable', 'medium-weight', 'versatile'],
    }
  };

  private static readonly FASHION_TIPS: ExternalTip[] = [
    {
      source: 'reddit' as const,
      tip: "Rule of thirds: divide your outfit into thirds vertically for balanced proportions",
      category: 'proportion',
      style: ['classic', 'minimalist'],
      ageRange: { min: 18, max: 70 }
    },
    {
      source: 'reddit' as const,
      tip: "Use contrasting textures in monochromatic outfits for visual interest",
      category: 'texture',
      style: ['minimalist', 'modern'],
      ageRange: { min: 20, max: 65 }
    },
    {
      source: 'pinterest',
      tip: "Balance loose with fitted: pair oversized tops with slim bottoms",
      category: 'proportion',
      style: ['streetwear', 'casual'],
      ageRange: { min: 16, max: 45 }
    },
    {
      source: 'reddit',
      tip: "When wearing statement pieces, keep the rest of the outfit simple",
      category: 'balance',
      style: ['modern', 'edgy'],
      ageRange: { min: 18, max: 60 }
    },
    {
      source: 'pinterest',
      tip: "Layer necklaces in descending lengths for a curated look",
      category: 'accessory',
      style: ['bohemian', 'romantic'],
      ageRange: { min: 16, max: 65 }
    }
  ];

  private static async fetchExternalTips(params: OutfitGeneratorParams): Promise<ExternalTip[]> {
    return this.FASHION_TIPS.filter(tip => {
      const isAgeAppropriate = !tip.ageRange || 
        (params.age >= tip.ageRange.min && params.age <= tip.ageRange.max);
      const matchesStyle = !params.preferredStyles?.length || 
        tip.style.some(s => params.preferredStyles?.includes(s));
      return isAgeAppropriate && matchesStyle;
    });
  }

  static async generateOutfit(
    clothes: IClothing[],
    params: OutfitGeneratorParams
  ): Promise<Partial<IOutfit>> {
    try {
      const outfit: Partial<IOutfit> = {
        userId: params.userId.toString(),
        clothes: [],
        occasion: params.occasion ? [params.occasion] : [],
        season: params.season || [],
        weather: params.weather || [],
        style: params.preferredStyles || [],
        aiGenerated: true
      };

      const tips = await this.fetchExternalTips(params);
      let availableClothes = this.filterClothes(clothes, params);

      if (availableClothes.length === 0) {
        OutfitErrorRegulator.logError({
          code: 'NO_SUITABLE_ITEMS',
          message: 'No suitable items found in wardrobe after filtering',
          severity: 'medium',
          context: { params }
        });
        return outfit;
      }


      for (const position of this.rules.requiredPositions) {
        const suitable = availableClothes.filter(item => 
          hasMongoId(item) && this.isItemSuitableForPosition(item, position, outfit, clothes, tips)
        );

        if (suitable.length === 0) {
          OutfitErrorRegulator.logError({
            code: 'NO_SUITABLE_ITEMS',
            message: `No suitable items found for position: ${position}`,
            severity: 'medium',
            context: { position, params }
          });
          continue;
        }

        const selected = this.selectBestMatch(suitable, outfit, clothes);
        if (selected && hasMongoId(selected)) {
          outfit.clothes?.push({
            itemId: selected._id.toString(),
            position
          });
          availableClothes = availableClothes.filter(item => 
            hasMongoId(item) && item._id.toString() !== selected._id.toString()
          );
        } else {
          OutfitErrorRegulator.logError({
            code: 'ITEM_SELECTION_FAILED',
            message: `Failed to select best match for position: ${position}`,
            severity: 'low',
            context: { position, suitableCount: suitable.length }
          });
        }
      }


      const missingPositions = this.rules.requiredPositions.filter(pos => 
        !outfit.clothes?.some(c => c.position === pos)
      );

      if (missingPositions.length > 0) {
        OutfitErrorRegulator.logError({
          code: 'INCOMPLETE_OUTFIT',
          message: 'Failed to fill all required positions',
          severity: 'high',
          context: { missingPositions }
        });
      }


      while (
        (outfit.clothes?.length || 0) < this.rules.maxItems && 
        availableClothes.length > 0
      ) {
        const position = this.determineNextPosition(outfit);
        const suitable = availableClothes.filter(item =>
          hasMongoId(item) && this.isItemSuitableForPosition(item, position, outfit, clothes, tips)
        );

        if (suitable.length === 0) break;

        const selected = this.selectBestMatch(suitable, outfit, clothes);
        if (selected && hasMongoId(selected)) {
          outfit.clothes?.push({
            itemId: selected._id.toString(),
            position
          });
          availableClothes = availableClothes.filter(item => 
            hasMongoId(item) && item._id.toString() !== selected._id.toString()
          );
        } else {
          OutfitErrorRegulator.logError({
            code: 'OPTIONAL_ITEM_SELECTION_FAILED',
            message: `Failed to select optional item for position: ${position}`,
            severity: 'low',
            context: { position, suitableCount: suitable.length }
          });
          break;
        }
      }


      this.validateStyleCoherence(outfit, clothes);

      return outfit;
    } catch (error) {
      OutfitErrorRegulator.logError({
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error during outfit generation',
        severity: 'high',
        context: { error }
      });
      throw error;
    }
  }

  private static validateStyleCoherence(outfit: Partial<IOutfit>, allClothes: IClothing[]): void {
    if (!outfit.clothes?.length) return;

    const outfitItems = outfit.clothes.map(c => 
      allClothes.find(item => hasMongoId(item) && item._id.toString() === c.itemId)
    ).filter((item): item is IClothing => item !== undefined);


    const commonStyles = outfitItems.reduce((common, item, index) => {
      if (index === 0) return item.style;
      return common.filter(style => item.style.includes(style));
    }, outfitItems[0].style);

    if (commonStyles.length === 0) {
      OutfitErrorRegulator.logError({
        code: 'STYLE_MISMATCH',
        message: 'No common styles found between outfit items',
        severity: 'medium',
        context: {
          styles: outfitItems.map(item => item.style)
        }
      });
    }


    const colorCombinations = outfitItems.flatMap((item1, i) =>
      outfitItems.slice(i + 1).map(item2 => ({
        color1: item1.color[0],
        color2: item2.color[0]
      }))
    );

    const hasIncompatibleColors = colorCombinations.some(({ color1, color2 }) =>
      !this.rules.colorCompatibility[color1]?.includes(color2) &&
      !this.rules.colorCompatibility[color2]?.includes(color1)
    );

    if (hasIncompatibleColors) {
      OutfitErrorRegulator.logError({
        code: 'COLOR_MISMATCH',
        message: 'Incompatible color combinations detected',
        severity: 'low',
        context: {
          combinations: colorCombinations
        }
      });
    }
  }

  private static filterClothes(
    clothes: IClothing[],
    params: OutfitGeneratorParams
  ): IClothing[] {
    return clothes.filter(item => {
      if (!hasMongoId(item)) return false;
      if (params.excludeItems?.includes(item._id.toString())) return false;
      if (params.season && !params.season.some(s => item.season.includes(s))) return false;
      if (params.weather && !params.weather.some(w => item.metadata.weather.includes(w))) return false;
      return true;
    });
  }

  private static isItemSuitableForPosition(
    item: IClothing & { _id: Types.ObjectId },
    position: string,
    outfit: Partial<IOutfit>,
    allClothes: IClothing[],
    tips: ExternalTip[]
  ): boolean {
    const categoryMapping: Record<string, string[]> = {
      top: ['shirt', 'blouse', 'sweater', 't-shirt', 'tank-top'],
      bottom: ['pants', 'skirt', 'shorts', 'jeans', 'leggings'],
      shoes: ['sneakers', 'boots', 'sandals', 'flats', 'heels'],
      accessory: ['jewelry', 'scarf', 'belt', 'hat', 'bag', 'sunglasses'],
      outer: ['jacket', 'coat', 'cardigan', 'blazer'],
      layer: ['vest', 'sweater', 'cardigan']
    };

    if (!categoryMapping[position]?.includes(item.subCategory)) {
      return false;
    }


    const existingStyles = outfit.clothes?.map(c => {
      const matchingItem = allClothes.find(item => 
        hasMongoId(item) && item._id.toString() === c.itemId
      );
      return matchingItem?.style || [];
    }).flat() || [];


    if (existingStyles.length > 0) {
      const isStyleCompatible = item.style.some(style =>
        existingStyles.some(existingStyle =>
          this.rules.styleCompatibility[style]?.includes(existingStyle) ||
          this.rules.styleCompatibility[existingStyle]?.includes(style)
        )
      );
      if (!isStyleCompatible) return false;
    }


    const relevantTips = tips.filter(tip =>
      tip.category.toLowerCase().includes(position) &&
      tip.style.some(s => item.style.includes(s))
    );

    return relevantTips.length === 0 || relevantTips.some(tip =>
      tip.style.some(s => item.style.includes(s))
    );
  }

  private static selectBestMatch(
    suitable: IClothing[],
    outfit: Partial<IOutfit>,
    allClothes: IClothing[]
  ): (IClothing & { _id: Types.ObjectId }) | null {
    if (suitable.length === 0) return null;

    return suitable.reduce((best, current) => {
      if (!hasMongoId(current) || !hasMongoId(best)) return best;
      const score = this.calculateItemScore(current, outfit, allClothes);
      const bestScore = this.calculateItemScore(best, outfit, allClothes);
      return score > bestScore ? current : best;
    }, suitable[0]) as (IClothing & { _id: Types.ObjectId }) | null;
  }

  private static calculateItemScore(
    item: IClothing & { _id: Types.ObjectId },
    outfit: Partial<IOutfit>,
    allClothes: IClothing[]
  ): number {
    let score = 0;


    if (outfit.style) {
      score += item.style.filter(s => outfit.style?.includes(s)).length * 2;
    }


    const existingColors = outfit.clothes?.map(c => {
      const matchingItem = allClothes.find(item => 
        hasMongoId(item) && item._id.toString() === c.itemId
      );
      return matchingItem?.color || [];
    }).flat() || [];

    score += item.color.filter(c =>
      existingColors.some(ec =>
        this.rules.colorCompatibility[c]?.includes(ec) ||
        this.rules.colorCompatibility[ec]?.includes(c)
      )
    ).length;


    if (outfit.season && item.season.some(s => outfit.season?.includes(s))) {
      score += 1;
    }

    return score;
  }

  private static determineNextPosition(outfit: Partial<IOutfit>): string {
    const existingPositions = outfit.clothes?.map(c => c.position) || [];
    const positionPriority = ['outer', 'accessory', 'layer'];
    
    for (const position of positionPriority) {
      const count = existingPositions.filter(p => p === position).length;
      const maxAllowed = position === 'accessory' ? 3 : 1;
      
      if (count < maxAllowed) {
        return position;
      }
    }
    
    return 'accessory';
  }
}
