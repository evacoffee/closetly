export interface StyleDefinition {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
}

export const fashionStyles: StyleDefinition[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, neutral colors, and simple silhouettes focusing on quality basics.',
    keywords: ['minimal', 'clean', 'simple', 'neutral', 'basics'],
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Urban-inspired casual wear mixing comfort with bold graphics and statement pieces.',
    keywords: ['urban', 'casual', 'comfortable', 'bold', 'street'],
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Free-spirited style with natural fabrics, earthy tones, and flowing silhouettes.',
    keywords: ['boho', 'natural', 'flowing', 'earthy', 'layered'],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless pieces with traditional cuts and sophisticated color palettes.',
    keywords: ['timeless', 'traditional', 'sophisticated', 'elegant', 'refined'],
  },
  {
    id: 'athleisure',
    name: 'Athleisure',
    description: 'Athletic wear meets casual fashion, emphasizing comfort and performance.',
    keywords: ['athletic', 'sporty', 'comfortable', 'active', 'casual'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro-inspired pieces from various decades with a nostalgic appeal.',
    keywords: ['retro', 'nostalgic', 'old-school', 'classic', 'timeless'],
  },
  {
    id: 'preppy',
    name: 'Preppy',
    description: 'Clean-cut, collegiate-inspired style with tailored pieces and classic patterns.',
    keywords: ['collegiate', 'tailored', 'polished', 'traditional', 'neat'],
  },
  {
    id: 'edgy',
    name: 'Edgy',
    description: 'Bold, boundary-pushing style with dark colors and unconventional elements.',
    keywords: ['bold', 'dark', 'unconventional', 'rebellious', 'avant-garde'],
  },
  {
    id: 'romantic',
    name: 'Romantic',
    description: 'Feminine, soft aesthetics with delicate details and flowing fabrics.',
    keywords: ['feminine', 'soft', 'delicate', 'flowing', 'graceful'],
  },
  {
    id: 'artsy',
    name: 'Artsy',
    description: 'Creative, expressive style with unique pieces and artistic elements.',
    keywords: ['creative', 'unique', 'artistic', 'expressive', 'eclectic'],
  },
  {
    id: 'business-casual',
    name: 'Business Casual',
    description: 'Professional yet relaxed style suitable for modern workplaces.',
    keywords: ['professional', 'smart', 'office', 'polished', 'business'],
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Modern minimalism with focus on functionality and muted colors.',
    keywords: ['minimal', 'modern', 'functional', 'muted', 'clean'],
  },
  {
    id: 'grunge',
    name: 'Grunge',
    description: 'Rebellious style mixing vintage and alternative elements with a worn-in look.',
    keywords: ['alternative', 'rebellious', 'vintage', 'casual', 'distressed'],
  },
  {
    id: 'glamorous',
    name: 'Glamorous',
    description: 'Luxurious and eye-catching style with statement pieces and rich fabrics.',
    keywords: ['luxurious', 'statement', 'elegant', 'rich', 'bold'],
  },
  {
    id: 'kawaii',
    name: 'Kawaii',
    description: 'Cute Japanese-inspired fashion with playful colors and adorable motifs.',
    keywords: ['cute', 'playful', 'colorful', 'adorable', 'japanese'],
  },
  {
    id: 'punk',
    name: 'Punk',
    description: 'Rebellious and anti-establishment with leather, studs, and DIY elements.',
    keywords: ['rebellious', 'edgy', 'leather', 'studs', 'DIY'],
  },
  {
    id: 'gothic',
    name: 'Gothic',
    description: 'Dark, dramatic style with Victorian and romantic influences.',
    keywords: ['dark', 'dramatic', 'victorian', 'romantic', 'mysterious'],
  },
  {
    id: 'sporty',
    name: 'Sporty',
    description: 'Athletic-inspired clothing that prioritizes comfort and movement.',
    keywords: ['athletic', 'comfortable', 'active', 'casual', 'sport'],
  },
  {
    id: 'preppy-casual',
    name: 'Preppy Casual',
    description: 'Relaxed take on preppy style with comfortable, put-together looks.',
    keywords: ['casual', 'preppy', 'comfortable', 'polished', 'relaxed'],
  },
  {
    id: 'boho-chic',
    name: 'Boho Chic',
    description: 'Elegant bohemian style with a more polished and sophisticated edge.',
    keywords: ['boho', 'chic', 'elegant', 'polished', 'bohemian'],
  },
  {
    id: 'minimalist-luxe',
    name: 'Minimalist Luxe',
    description: 'Minimalism with luxurious fabrics and impeccable tailoring.',
    keywords: ['minimal', 'luxury', 'tailored', 'sophisticated', 'elegant'],
  },
  {
    id: 'street-goth',
    name: 'Street Goth',
    description: 'Urban streetwear meets dark gothic aesthetics.',
    keywords: ['streetwear', 'goth', 'urban', 'dark', 'edgy'],
  },
  {
    id: 'retro-futurism',
    name: 'Retro Futurism',
    description: 'Blend of vintage styles with futuristic elements and metallics.',
    keywords: ['retro', 'futuristic', 'metallic', 'vintage', 'modern'],
  }
];

export const getStyleById = (id: string): StyleDefinition | undefined => {
  return fashionStyles.find(style => style.id === id);
};

export const getStylesByKeywords = (keywords: string[]): StyleDefinition[] => {
  return fashionStyles.filter(style => 
    keywords.some(keyword => 
      style.keywords.includes(keyword.toLowerCase())
    )
  );
};
