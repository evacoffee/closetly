'use client';

import React from 'react';
const Button = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'default',
  size = 'md',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
  };
  const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center p-4 pt-0 ${className}`}>
    {children}
  </div>
);

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const variantStyles = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 bg-white text-gray-700',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};


const useToast = () => {
  return {
    toast: (options: { title: string; description?: string; variant?: string }) => {
      console.log(`[Toast] ${options.title}: ${options.description || ''}`);
    }
  };
};

type OutfitPreferences = {
  occasion?: string;
  stylePreferences?: string[];
  checkWeather?: boolean;
};

interface ClothingItem {
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
  color: string;
}

interface OutfitSuggestion {
  id: string;
  name: string;
  items: ClothingItem[];
  reason?: string;
  confidence?: number;
  weatherCheck?: {
    condition: string;
    temp: number;
  };
  occasion?: string;
  style?: string;
  comfort?: number;
  formality?: number;
  weather?: string;
  colors: string[];
  categories: string[];
  lastWorn?: string;
  timesWorn?: number;
  userRating?: 1 | -1;
}

type OutfitRecommenderProps = {
  initialPrefs?: OutfitPreferences;
  showPrefsForm?: boolean;
  title?: string;
  maxSuggestions?: number;
  userId?: string;
};

export function SmartOutfitRecommender({
  initialPrefs = {},
  showPrefsForm = true,
  title = 'Outfit Ideas for You',
  maxSuggestions = 3,
  userId,
}: OutfitRecommenderProps) {
  const [preferences, setPreferences] = React.useState<OutfitPreferences>({
    occasion: '',
    stylePreferences: [],
    checkWeather: false,
  });

  const [outfitSuggestions, setOutfitSuggestions] = React.useState<OutfitSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const { toast } = useToast();

  const exampleOutfits: OutfitSuggestion[] = [
    {
      id: '1',
      name: 'Casual Day Out',
      items: [
        { id: '1', imageUrl: 'https://example.com/image1.jpg', name: 'White T-Shirt', type: 'Shirt', color: 'White' },
        { id: '2', imageUrl: 'https://example.com/image2.jpg', name: 'Blue Jeans', type: 'Pants', color: 'Blue' },
      ],
      reason: 'Perfect for a casual day out',
      confidence: 0.9,
      weatherCheck: { condition: 'Sunny', temp: 25 },
      colors: ['white', 'blue'],
      categories: ['casual', 'everyday']
    },
    {
      id: '2',
      name: 'Office Ready',
      items: [
        { id: '3', imageUrl: 'https://example.com/image3.jpg', name: 'Button-Up Shirt', type: 'Shirt', color: 'White' },
        { id: '4', imageUrl: 'https://example.com/image4.jpg', name: 'Black Pants', type: 'Pants', color: 'Black' },
      ],
      reason: 'Professional and polished look',
      confidence: 0.85,
      weatherCheck: { condition: 'Cloudy', temp: 22 },
      colors: ['white', 'black'],
      categories: ['work', 'business']
    },
  ];

  const HeartIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const ShareIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );

  const ThumbsUpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );

  const ThumbsDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
    </svg>
  );

  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  const RefreshCwIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );

  const handleSaveOutfit = React.useCallback((outfit: OutfitSuggestion) => {
    toast({
      title: 'Outfit saved!',
      description: `${outfit.name} has been added to your saved outfits.`,
      variant: 'default',
    });
  }, [toast]);

  const handleShareOutfit = React.useCallback((outfit: OutfitSuggestion) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this outfit: ${outfit.name}`,
        text: `I found this great outfit on Closetly: ${outfit.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      toast({
        title: 'Link copied to clipboard',
        description: 'Share this link with others!',
        variant: 'default',
      });
      navigator.clipboard.writeText(window.location.href);
    }
  }, [toast]);


  React.useEffect(() => {
    let isMounted = true;
    
    const fetchOutfitSuggestions = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (isMounted) {
          setOutfitSuggestions(exampleOutfits);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching outfit suggestions:', error);
          toast({
            title: 'Error',
            description: 'Could not load outfit suggestions. Please try again later.',
            variant: 'destructive',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOutfitSuggestions();
    
    return () => {
      isMounted = false;
    };
  }, [preferences, exampleOutfits]);

  const handleRefresh = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOutfits: OutfitSuggestion[] = [
        {
          id: 'refreshed-1',
          name: 'Refreshed Outfit 1',
          items: [],
          colors: ['blue', 'white'],
          categories: ['top', 'bottom'],
          reason: 'Refreshed outfit suggestion',
          confidence: 0.9,
          weatherCheck: { condition: 'Sunny', temp: 25 }
        },
      ];
      
      setOutfitSuggestions(newOutfits);
      
      toast({
        title: 'Refreshed!',
        description: 'Found new outfit suggestions for you.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to refresh outfits:', error);
      toast({
        title: 'Error',
        description: 'Failed to load new outfit suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  const handlePreferencesChange = React.useCallback(async (newPreferences: Partial<OutfitPreferences>) => {
    try {
      setIsRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const freshOutfits = [
        {
          id: '3',
          name: 'Rainy Day Look',
          items: [
            { id: '5', imageUrl: 'https://example.com/image5.jpg', name: 'Waterproof Jacket', type: 'Jacket', color: 'Black' },
            { id: '6', imageUrl: 'https://example.com/image6.jpg', name: 'Beanie', type: 'Hat', color: 'Gray' },
          ],
          reason: 'Perfect for staying dry and stylish in the rain',
          confidence: 0.9,
          weatherCheck: { condition: 'Rainy', temp: 15 },
          colors: ['black', 'gray'],
          categories: ['rainy', 'winter']
        },
        {
          id: '4',
          name: 'Winter Warmth',
          items: [
            { id: '7', imageUrl: 'https://example.com/image7.jpg', name: 'Knit Scarf', type: 'Scarf', color: 'Red' },
            { id: '8', imageUrl: 'https://example.com/image8.jpg', name: 'Leather Gloves', type: 'Gloves', color: 'Brown' },
          ],
          reason: 'Cozy and warm for those chilly days',
          confidence: 0.8,
          weatherCheck: { condition: 'Windy', temp: 10 },
          colors: ['red', 'brown'],
          categories: ['winter', 'cold']
        },
      ];
      
      setOutfitSuggestions(freshOutfits);
      toast({
        title: 'Fresh styles loaded!',
        description: 'Found some new outfit ideas for you.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Whoops! Could not refresh outfits:', error);
      toast({
        title: 'Something went wrong',
        description: 'We had trouble refreshing your outfits. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  const handleRate = React.useCallback((outfitId: string, rating: 1 | -1) => {
    try {

      console.log(`User rated outfit ${outfitId} with ${rating > 0 ? '👍' : '👎'}`);
      

      setOutfitSuggestions(currentOutfits => 
        currentOutfits.map(outfit => 
          outfit.id === outfitId 
            ? { ...outfit, userRating: rating }
            : outfit
        )
      );

      toast({
        title: 'Thanks for your feedback!',
        description: `We've noted your ${rating > 0 ? 'like' : 'dislike'} for this outfit.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to rate outfit:', error);
      toast({
        title: 'Oops!',
        description: 'Failed to save your rating. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600">
            {outfitSuggestions.length} outfit suggestions for you
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-2"
        >
          {isRefreshing ? (
            <div className="animate-spin h-4 w-4 border-2 border-gray-400 rounded-full border-t-transparent"></div>
          ) : (
            <RefreshCwIcon />
          )}
          Refresh
        </Button>
      </div>

      {/* Show the preferences form if enabled */}
      {showPrefsForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">Filter Recommendations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
              <select
                value={preferences.occasion}
                onChange={(e) => setPreferences({ ...preferences, occasion: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Occasion</option>
                <option value="casual">Casual</option>
                <option value="work">Work</option>
                <option value="formal">Formal</option>
                <option value="date">Date Night</option>
                <option value="sport">Sports/Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <div className="flex flex-wrap gap-2">
                {['minimalist', 'bohemian', 'preppy', 'edgy', 'classic', 'trendy'].map((style) => (
                  <label key={style} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.stylePreferences.includes(style)}
                      onChange={(e) => {
                        const newStyles = e.target.checked
                          ? [...preferences.stylePreferences, style]
                          : preferences.stylePreferences.filter((s) => s !== style);
                        setPreferences({ ...preferences, stylePreferences: newStyles });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{style}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weather-consideration"
                checked={preferences.checkWeather}
                onChange={(e) =>
                  setPreferences({ ...preferences, checkWeather: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="weather-consideration" className="ml-2 block text-sm text-gray-700">
                Consider current weather
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Show loading state or empty state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : !outfitSuggestions.length ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-medium text-gray-700">No outfits found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or check back later for new suggestions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfitSuggestions.map((outfit) => (
            <Card key={outfit.id} className="overflow-hidden group hover:shadow-md transition-shadow border border-gray-100">
              <div className="relative">
                <div className="aspect-square grid grid-cols-2 gap-1 p-1 bg-gray-50">
                  {outfit.items.slice(0, 4).map((item, i) => (
                    <div key={`${outfit.id}-${i}`} className="bg-white rounded overflow-hidden aspect-square flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm text-center p-2">
                          {item.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0 flex items-center justify-center"
                    onClick={() => handleSaveOutfit(outfit)}
                    aria-label="Save outfit"
                  >
                    <HeartIcon />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0 flex items-center justify-center"
                    onClick={() => handleShareOutfit(outfit)}
                    aria-label="Share outfit"
                  >
                    <ShareIcon />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {outfit.name}
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center bg-amber-50 border-amber-100 text-amber-800">
                    <span className="mr-1">★</span>
                    {Math.round(outfit.confidence * 100)}% match
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 mt-1 line-clamp-2">
                  {outfit.reason}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {outfit.weatherCheck && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span className="mr-1">☀️</span>
                    {outfit.weatherCheck.condition}, {outfit.weatherCheck.temp}°C
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {outfit.items.slice(0, 3).map((item) => (
                    <Badge key={item.id} variant="secondary" className="text-xs">
                      {item.type}: {item.name}
                    </Badge>
                  ))}
                  {outfit.items.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{outfit.items.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRate(outfit.id, 1)}
                    className="text-green-600 hover:text-green-700"
                    aria-label="Like outfit"
                  >
                    <ThumbsUpIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRate(outfit.id, -1)}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Dislike outfit"
                  >
                    <ThumbsDownIcon />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveOutfit(outfit)}
                  className="text-blue-600 hover:text-blue-700"
                  aria-label="Save outfit"
                >
                  <PlusIcon />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
