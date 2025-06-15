'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Share2, Calendar, Clock, RefreshCw, AlertCircle, Star, MapPin, Droplet, Thermometer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

// Types
interface OutfitItem {
  id: string;
  name: string;
  type: string;
  color: string;
  brand: string;
  imageUrl: string;
  brandLogo?: string;
}

interface Outfit {
  id: string;
  name: string;
  items: OutfitItem[];
  occasion: string;
  style: string;
  lastWorn?: string;
  isFavorite: boolean;
  isLiked: boolean;
  createdAt: string;
  weather: {
    temperature: number;
    condition: string;
  };
}

// Mock data
const MOCK_OUTFITS: Outfit[] = [
  {
    id: '1',
    name: 'Casual Summer Look',
    items: [
      {
        id: 'item1',
        name: 'White T-Shirt',
        type: 'Top',
        color: 'White',
        brand: 'Nike',
        imageUrl: 'https://example.com/tshirt.jpg',
        brandLogo: 'https://logo.clearbit.com/nike.com'
      },
      {
        id: 'item2',
        name: 'Blue Jeans',
        type: 'Bottom',
        color: 'Blue',
        brand: 'Levi\'s',
        imageUrl: 'https://example.com/jeans.jpg',
        brandLogo: 'https://logo.clearbit.com/levi.com'
      }
    ],
    occasion: 'Casual',
    style: 'Streetwear',
    lastWorn: '2023-06-10T10:00:00Z',
    isFavorite: true,
    isLiked: false,
    createdAt: '2023-06-01T09:00:00Z',
    weather: {
      temperature: 28,
      condition: 'Sunny'
    }
  },
  // Add more mock outfits as needed
];

export function OutfitGrid() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView();
  const { toast } = useToast();
  const pageSize = 6;

  // Fetch outfits
  const fetchOutfits = useCallback(async (pageNum: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const newOutfits = MOCK_OUTFITS.slice(start, end);
      
      setOutfits(prev => pageNum === 1 ? newOutfits : [...prev, ...newOutfits]);
      setHasMore(end < MOCK_OUTFITS.length);
    } catch (err) {
      console.error('Failed to fetch outfits:', err);
      setError('Failed to load outfits. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load outfits',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchOutfits(1);
  }, [fetchOutfits]);

  // Infinite scroll
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchOutfits(page + 1);
    }
  }, [inView, isLoading, hasMore, page, fetchOutfits]);

  // Handle like/unlike
  const handleLike = useCallback((outfitId: string) => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === outfitId 
          ? { ...outfit, isLiked: !outfit.isLiked } 
          : outfit
      )
    );
    
    // Show toast notification
    const isLiked = outfits.find(o => o.id === outfitId)?.isLiked;
    toast({
      title: isLiked ? 'Removed from likes' : 'Added to likes',
      description: isLiked ? 'Outfit removed from your likes' : 'Outfit added to your likes',
    });
  }, [outfits, toast]);

  // Handle mark as worn
  const handleMarkAsWorn = useCallback((outfitId: string) => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === outfitId 
          ? { ...outfit, lastWorn: new Date().toISOString() } 
          : outfit
      )
    );
    
    toast({
      title: 'Outfit marked as worn',
      description: 'We\'ve updated your outfit history',
    });
  }, [toast]);

  // Handle share
  const handleShare = useCallback(async (outfit: Outfit) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this ${outfit.name} outfit`,
          text: `I found this ${outfit.style} outfit for ${outfit.occasion} on Closetly!`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied to clipboard',
          description: 'Share the link with your friends!',
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }, [toast]);

  // Loading skeleton
  if (isLoading && outfits.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-2 mt-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load outfits</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button 
          onClick={() => {
            setPage(1);
            fetchOutfits(1);
          }}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (outfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Star className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No outfits found</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find any outfits matching your preferences.
        </p>
        <Button variant="outline">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {outfits.map((outfit) => (
          <Card key={outfit.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            {/* Outfit Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={outfit.items[0]?.imageUrl || '/placeholder-outfit.jpg'}
                alt={outfit.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Weather Badge */}
              <div className="absolute top-2 right-2 flex items-center bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                <Thermometer className="h-3 w-3 mr-1" />
                {outfit.weather.temperature}°C
                <span className="mx-1">•</span>
                {outfit.weather.condition}
              </div>
              
              {/* Occasion Badge */}
              <Badge className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm">
                {outfit.occasion}
              </Badge>
            </div>
            
            {/* Outfit Details */}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{outfit.name}</h3>
                  <p className="text-sm text-muted-foreground">{outfit.style}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${outfit.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                  onClick={() => handleLike(outfit.id)}
                >
                  <Heart className={`h-4 w-4 ${outfit.isLiked ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              {/* Items Grid */}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {outfit.items.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-md overflow-hidden border">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.brandLogo && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                        <img 
                          src={item.brandLogo} 
                          alt={item.brand}
                          className="h-3 object-contain w-full"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            
            {/* Footer with Actions */}
            <CardFooter className="flex justify-between pt-0">
              <div className="flex items-center text-xs text-muted-foreground">
                {outfit.lastWorn ? (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Worn {format(new Date(outfit.lastWorn), 'MMM d')}</span>
                  </>
                ) : (
                  <span>Never worn</span>
                )}
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleMarkAsWorn(outfit.id)}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleShare(outfit)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10 w-full">
        {isLoading && (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      {/* No more items */}
      {!hasMore && outfits.length > 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          You've reached the end of the list
        </div>
      )}
    </div>
  );
}