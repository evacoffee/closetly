import { StyleDefinition } from './styles';

export interface StyleQuizQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    stylePoints: { [key: string]: number }; // styleId -> points
  }[];
}

export const styleQuizQuestions: StyleQuizQuestion[] = [
  {
    id: 'q1',
    question: 'How would you describe your ideal weekend outfit?',
    options: [
      {
        text: 'Comfortable jeans and a graphic tee',
        stylePoints: { 'streetwear': 2, 'casual': 1, 'athleisure': 1 }
      },
      {
        text: 'A flowy dress with sandals',
        stylePoints: { 'bohemian': 2, 'romantic': 2, 'boho-chic': 1 }
      },
      {
        text: 'Tailored trousers and a crisp shirt',
        stylePoints: { 'classic': 2, 'business-casual': 2, 'preppy': 1 }
      },
      {
        text: 'Leather jacket with ripped jeans',
        stylePoints: { 'edgy': 2, 'punk': 2, 'street-goth': 1 }
      },
      {
        text: 'Athletic wear that can transition to casual',
        stylePoints: { 'athleisure': 3, 'sporty': 2, 'casual': 1 }
      }
    ]
  },
  {
    id: 'q2',
    question: 'What colors are you most drawn to?',
    options: [
      {
        text: 'Neutrals: black, white, beige, gray',
        stylePoints: { 'minimalist': 2, 'scandinavian': 2, 'minimalist-luxe': 1 }
      },
      {
        text: 'Earthy tones: olive, brown, mustard',
        stylePoints: { 'bohemian': 2, 'boho-chic': 2, 'vintage': 1 }
      },
      {
        text: 'Dark and moody: black, deep red, navy',
        stylePoints: { 'gothic': 2, 'edgy': 2, 'street-goth': 2 }
      },
      {
        text: 'Bright and bold: red, yellow, electric blue',
        stylePoints: { 'streetwear': 2, 'artsy': 2, 'kawaii': 1 }
      },
      {
        text: 'Pastels: soft pink, baby blue, lavender',
        stylePoints: { 'romantic': 2, 'kawaii': 2, 'preppy': 1 }
      }
    ]
  },
  {
    id: 'q3',
    question: 'What\'s your go-to footwear?',
    options: [
      {
        text: 'Sneakers',
        stylePoints: { 'streetwear': 2, 'athleisure': 2, 'casual': 1 }
      },
      {
        text: 'Ankle boots',
        stylePoints: { 'edgy': 2, 'gothic': 1, 'street-goth': 1 }
      },
      {
        text: 'Loafers or oxfords',
        stylePoints: { 'preppy': 2, 'classic': 2, 'business-casual': 1 }
      },
      {
        text: 'Strappy sandals or gladiators',
        stylePoints: { 'bohemian': 2, 'romantic': 1, 'boho-chic': 1 }
      },
      {
        text: 'Chunky platform shoes',
        stylePoints: { 'punk': 2, 'alternative': 1, 'edgy': 1 }
      }
    ]
  },
  {
    id: 'q4',
    question: 'How do you feel about patterns?',
    options: [
      {
        text: 'Keep it solid and simple',
        stylePoints: { 'minimalist': 2, 'scandinavian': 2, 'minimalist-luxe': 1 }
      },
      {
        text: 'Florals and nature-inspired prints',
        stylePoints: { 'romantic': 2, 'bohemian': 2, 'boho-chic': 1 }
      },
      {
        text: 'Plaid, stripes, and classic patterns',
        stylePoints: { 'preppy': 2, 'classic': 2, 'business-casual': 1 }
      },
      {
        text: 'Bold graphics and logos',
        stylePoints: { 'streetwear': 2, 'edgy': 1, 'punk': 1 }
      },
      {
        text: 'Abstract and artistic prints',
        stylePoints: { 'artsy': 2, 'eclectic': 1, 'kawaii': 1 }
      }
    ]
  },
  {
    id: 'q5',
    question: 'What\'s your ideal way to accessorize?',
    options: [
      {
        text: 'Minimal, delicate jewelry',
        stylePoints: { 'minimalist': 2, 'scandinavian': 2, 'minimalist-luxe': 1 }
      },
      {
        text: 'Layered necklaces, rings, and bangles',
        stylePoints: { 'bohemian': 2, 'boho-chic': 2, 'romantic': 1 }
      },
      {
        text: 'Classic watch and simple studs',
        stylePoints: { 'classic': 2, 'preppy': 2, 'business-casual': 1 }
      },
      {
        text: 'Chokers, spikes, and statement pieces',
        stylePoints: { 'edgy': 2, 'gothic': 2, 'punk': 1 }
      },
      {
        text: 'Fun, colorful, and quirky accessories',
        stylePoints: { 'kawaii': 2, 'artsy': 2, 'streetwear': 1 }
      }
    ]
  },
  {
    id: 'q6',
    question: 'What\'s your preferred fabric choice?',
    options: [
      {
        text: 'Natural fibers like cotton and linen',
        stylePoints: { 'minimalist': 1, 'bohemian': 2, 'boho-chic': 1 }
      },
      {
        text: 'Silk, satin, and luxurious fabrics',
        stylePoints: { 'glamorous': 2, 'romantic': 1, 'minimalist-luxe': 1 }
      },
      {
        text: 'Leather and denim',
        stylePoints: { 'edgy': 2, 'punk': 2, 'street-goth': 1 }
      },
      {
        text: 'Technical and performance fabrics',
        stylePoints: { 'athleisure': 2, 'sporty': 2, 'streetwear': 1 }
      },
      {
        text: 'Tweed, wool, and classic fabrics',
        stylePoints: { 'classic': 2, 'preppy': 2, 'business-casual': 1 }
      }
    ]
  },
  {
    id: 'q7',
    question: 'How do you feel about layering?',
    options: [
      {
        text: 'The more layers, the better',
        stylePoints: { 'bohemian': 2, 'boho-chic': 1, 'romantic': 1 }
      },
      {
        text: 'Just one well-chosen layer',
        stylePoints: { 'minimalist': 2, 'scandinavian': 2, 'minimalist-luxe': 1 }
      },
      {
        text: 'Structured layers like blazers and vests',
        stylePoints: { 'classic': 2, 'preppy': 2, 'business-casual': 1 }
      },
      {
        text: 'Edgy layers like leather jackets and vests',
        stylePoints: { 'edgy': 2, 'punk': 2, 'street-goth': 1 }
      },
      {
        text: 'Athletic layers like hoodies and windbreakers',
        stylePoints: { 'streetwear': 2, 'athleisure': 2, 'sporty': 1 }
      }
    ]
  },
  {
    id: 'q8',
    question: 'What\'s your preferred silhouette?',
    options: [
      {
        text: 'Oversized and relaxed',
        stylePoints: { 'streetwear': 2, 'athleisure': 1, 'casual': 1 }
      },
      {
        text: 'Fitted and tailored',
        stylePoints: { 'classic': 2, 'preppy': 2, 'business-casual': 1 }
      },
      {
        text: 'Flowing and ethereal',
        stylePoints: { 'romantic': 2, 'bohemian': 2, 'boho-chic': 1 }
      },
      {
        text: 'Structured and architectural',
        stylePoints: { 'minimalist': 2, 'minimalist-luxe': 2, 'scandinavian': 1 }
      },
      {
        text: 'Edgy and asymmetrical',
        stylePoints: { 'edgy': 2, 'punk': 2, 'street-goth': 1 }
      }
    ]
  },
  {
    id: 'q9',
    question: 'How do you feel about vintage clothing?',
    options: [
      {
        text: 'I love mixing vintage with modern pieces',
        stylePoints: { 'vintage': 2, 'bohemian': 1, 'boho-chic': 1 }
      },
      {
        text: 'I prefer all my clothes to be new and current',
        stylePoints: { 'minimalist': 1, 'classic': 1, 'business-casual': 1 }
      },
      {
        text: 'I like vintage-inspired modern pieces',
        stylePoints: { 'romantic': 1, 'preppy': 1, 'retro-futurism': 2 }
      },
      {
        text: 'I love authentic vintage from specific eras',
        stylePoints: { 'vintage': 2, 'retro': 2, 'classic': 1 }
      },
      {
        text: 'I don't really think about it',
        stylePoints: { 'casual': 1, 'athleisure': 1, 'sporty': 1 }
      }
    ]
  },
  {
    id: 'q10',
    question: 'What\'s your approach to fashion trends?',
    options: [
      {
        text: 'I stick to timeless pieces that never go out of style',
        stylePoints: { 'classic': 2, 'minimalist': 1, 'minimalist-luxe': 1 }
      },
      {
        text: 'I love trying the latest trends',
        stylePoints: { 'streetwear': 2, 'fashion-forward': 1, 'trendy': 1 }
      },
      {
        text: 'I follow trends but adapt them to my personal style',
        stylePoints: { 'eclectic': 1, 'artsy': 1, 'boho-chic': 1 }
      },
      {
        text: 'I prefer alternative or subculture styles',
        stylePoints: { 'punk': 2, 'gothic': 2, 'street-goth': 1 }
      },
      {
        text: 'I don\'t really pay attention to trends',
        stylePoints: { 'casual': 1, 'comfortable': 1, 'sporty': 1 }
      }
    ]
  },
  {
    id: 'q11',
    question: 'What\'s your preferred level of formality?',
    options: [
      {
        text: 'Very casual and comfortable',
        stylePoints: { 'casual': 2, 'athleisure': 2, 'sporty': 1 }
      },
      {
        text: 'Smart casual - polished but not too formal',
        stylePoints: { 'business-casual': 2, 'preppy': 1, 'classic': 1 }
      },
      {
        text: 'Business professional',
        stylePoints: { 'business': 2, 'classic': 1, 'preppy': 1 }
      },
      {
        text: 'Dressy and glamorous',
        stylePoints: { 'glamorous': 2, 'romantic': 1, 'minimalist-luxe': 1 }
      },
      {
        text: 'It depends on my mood',
        stylePoints: { 'eclectic': 2, 'artsy': 1, 'bohemian': 1 }
      }
    ]
  },
  {
    id: 'q12',
    question: 'How do you feel about color coordination?',
    options: [
      {
        text: 'I prefer monochromatic or tonal looks',
        stylePoints: { 'minimalist': 2, 'scandinavian': 2, 'minimalist-luxe': 1 }
      },
      {
        text: 'I love mixing complementary colors',
        stylePoints: { 'bohemian': 2, 'artsy': 2, 'eclectic': 1 }
      },
      {
        text: 'I stick to classic color combinations',
        stylePoints: { 'classic': 2, 'preppy': 2, 'business-casual': 1 }
      },
      {
        text: 'I like dark, moody color palettes',
        stylePoints: { 'gothic': 2, 'edgy': 2, 'street-goth': 1 }
      },
      {
        text: 'The brighter and bolder, the better',
        stylePoints: { 'kawaii': 2, 'streetwear': 1, 'artsy': 1 }
      }
    ]
  },
  {
    id: 'q13',
    question: 'What\'s your approach to accessories?',
    options: [
      {
        text: 'Minimal and understated',
        stylePoints: { 'minimalist': 2, 'scandinavian': 2, 'minimalist-luxe': 1 }
      },
      {
        text: 'Layered and boho-inspired',
        stylePoints: { 'bohemian': 2, 'boho-chic': 2, 'romantic': 1 }
      },
      {
        text: 'Classic and timeless',
        stylePoints: { 'classic': 2, 'preppy': 2, 'business-casual': 1 }
      },
      {
        text: 'Bold and statement-making',
        stylePoints: { 'glamorous': 2, 'edgy': 1, 'punk': 1 }
      },
      {
        text: 'Fun and quirky',
        stylePoints: { 'kawaii': 2, 'artsy': 2, 'streetwear': 1 }
      }
    ]
  },
  {
    id: 'q14',
    question: 'What\'s your preferred neckline?',
    options: [
      {
        text: 'Crew or scoop neck',
        stylePoints: { 'minimalist': 1, 'casual': 1, 'sporty': 1 }
      },
      {
        text: 'V-neck or wrap',
        stylePoints: { 'classic': 1, 'business-casual': 1, 'romantic': 1 }
      },
      {
        text: 'Off-shoulder or cold-shoulder',
        stylePoints: { 'romantic': 2, 'bohemian': 1, 'boho-chic': 1 }
      },
      {
        text: 'Turtleneck or mock neck',
        stylePoints: { 'minimalist': 1, 'classic': 1, 'preppy': 1 }
      },
      {
        text: 'Asymmetrical or unique',
        stylePoints: { 'edgy': 2, 'artsy': 2, 'street-goth': 1 }
      }
    ]
  },
  {
    id: 'q15',
    question: 'How do you feel about mixing patterns?',
    options: [
      {
        text: 'I prefer solid colors',
        stylePoints: { 'minimalist': 2, 'scandinavian': 2, 'minimalist-luxe': 1 }
      },
      {
        text: 'I love mixing different patterns',
        stylePoints: { 'bohemian': 2, 'eclectic': 2, 'artsy': 1 }
      },
      {
        text: 'I stick to classic pattern combinations',
        stylePoints: { 'classic': 2, 'preppy': 2, 'business-casual': 1 }
      },
      {
        text: 'I like bold, graphic patterns',
        stylePoints: { 'streetwear': 2, 'edgy': 1, 'punk': 1 }
      },
      {
        text: 'I prefer subtle, tonal patterns',
        stylePoints: { 'romantic': 1, 'boho-chic': 1, 'minimalist-luxe': 1 }
      }
    ]
  },
  {
    id: 'q16',
    question: 'What\'s your preferred jacket style?',
    options: [
      {
        text: 'Denim or leather jacket',
        stylePoints: { 'edgy': 2, 'punk': 1, 'street-goth': 1 }
      },
      {
        text: 'Trench coat or wool coat',
        stylePoints: { 'classic': 2, 'preppy': 1, 'business-casual': 1 }
      },
      {
        text: 'Kimonos or duster cardigans',
        stylePoints: { 'bohemian': 2, 'boho-chic': 2, 'romantic': 1 }
      },
      {
        text: 'Structured blazer',
        stylePoints: { 'business-casual': 2, 'classic': 1, 'preppy': 1 }
      },
      {
        text: 'Puffer or technical jacket',
        stylePoints: { 'athleisure': 2, 'sporty': 2, 'streetwear': 1 }
      }
    ]
  },
  {
    id: 'q17',
    question: 'How do you feel about DIY or customized clothing?',
    options: [
      {
        text: 'I love personalizing my clothes',
        stylePoints: { 'punk': 2, 'artsy': 2, 'bohemian': 1 }
      },
      {
        text: 'I prefer clothes as they are',
        stylePoints: { 'classic': 1, 'minimalist': 1, 'business-casual': 1 }
      },
      {
        text: 'I like small customizations',
        stylePoints: { 'streetwear': 1, 'edgy': 1, 'eclectic': 1 }
      },
      {
        text: 'I enjoy upcycling and repurposing',
        stylePoints: { 'bohemian': 2, 'eco-friendly': 2, 'boho-chic': 1 }
      },
      {
        text: 'I've never really tried it',
        stylePoints: { 'classic': 1, 'minimalist': 1, 'preppy': 1 }
      }
    ]
  },
  {
    id: 'q18',
    question: 'What\'s your preferred length for bottoms?',
    options: [
      {
        text: 'Full-length or ankle-length',
        stylePoints: { 'classic': 1, 'business-casual': 1, 'minimalist': 1 }
      },
      {
        text: 'Cropped or capri',
        stylePoints: { 'casual': 1, 'preppy': 1, 'romantic': 1 }
      },
      {
        text: 'Shorts or mini',
        stylePoints: { 'casual': 1, 'sporty': 1, 'streetwear': 1 }
      },
      {
        text: 'Midi or maxi',
        stylePoints: { 'romantic': 2, 'bohemian': 1, 'boho-chic': 1 }
      },
      {
        text: 'It depends on the occasion',
        stylePoints: { 'eclectic': 1, 'artsy': 1, 'versatile': 1 }
      }
    ]
  },
  {
    id: 'q19',
    question: 'How do you feel about sustainable fashion?',
    options: [
      {
        text: 'It's very important to me',
        stylePoints: { 'bohemian': 1, 'eco-friendly': 2, 'minimalist': 1 }
      },
      {
        text: 'I try to be conscious about it',
        stylePoints: { 'classic': 1, 'minimalist': 1, 'business-casual': 1 }
      },
      {
        text: 'I prefer secondhand or vintage',
        stylePoints: { 'vintage': 2, 'retro': 1, 'bohemian': 1 }
      },
      {
        text: 'I focus more on style than sustainability',
        stylePoints: { 'fashion-forward': 1, 'trendy': 1, 'glamorous': 1 }
      },
      {
        text: 'I haven't given it much thought',
        stylePoints: { 'casual': 1, 'basic': 1, 'sporty': 1 }
      }
    ]
  },
  {
    id: 'q20',
    question: 'What\'s your approach to fashion in general?',
    options: [
      {
        text: 'I follow my own unique style',
        stylePoints: { 'eclectic': 2, 'artsy': 2, 'bohemian': 1 }
      },
      {
        text: 'I like to stay on top of trends',
        stylePoints: { 'fashion-forward': 2, 'trendy': 2, 'streetwear': 1 }
      },
      {
        text: 'I prefer timeless, classic pieces',
        stylePoints: { 'classic': 2, 'minimalist': 1, 'business-casual': 1 }
      },
      {
        text: 'I dress for comfort and practicality',
        stylePoints: { 'casual': 2, 'athleisure': 2, 'sporty': 1 }
      },
      {
        text: 'I use fashion as a form of self-expression',
        stylePoints: { 'edgy': 1, 'punk': 1, 'gothic': 1, 'artsy': 1 }
      }
    ]
  }
];

export function calculateStyleScores(answers: string[]) {
  const styleScores: { [key: string]: number } = {};
  
  answers.forEach((answerId, index) => {
    const question = styleQuizQuestions[index];
    const answer = question.options.find(opt => opt.text === answerId);
    
    if (answer) {
      Object.entries(answer.stylePoints).forEach(([styleId, points]) => {
        styleScores[styleId] = (styleScores[styleId] || 0) + points;
      });
    }
  });
  
  return styleScores;
}

export function getTopStyles(scores: { [key: string]: number }, count: number = 5): string[] {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([styleId]) => styleId);
}
