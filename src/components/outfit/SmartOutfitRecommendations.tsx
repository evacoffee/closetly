'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Clock, Calendar, Star, Plus, Filter, X, ChevronLeft } from 'lucide-react';

interface ClothingItem {
  id: string;
  name: string;
  type: string;
  color: string;
  imageUrl?: string;
  brand?: string;
  lastWorn?: Date;
  purchaseDate?: Date;
  price?: number;
  size?: string;
  condition?: 'new' | 'good' | 'fair' | 'poor';
  notes?: string;
  isFavorite?: boolean;
  category?: string;
  season?: string[];
  material?: string;
  careInstructions?: string;
  tags?: string[];
}

interface OutfitSuggestion {
  id: string;
  name: string;
  items: ClothingItem[];
  reason: string;
  confidence: number;
  weatherCheck?: {
    condition: string;
    temp: number;
    humidity?: number;
    windSpeed?: number;
  };
  occasion?: string;
  style?: string;
  comfort?: number;
  formality?: number;
  colors: string[];
  categories: string[];
  lastWorn?: Date;
  timesWorn?: number;
  userRating?: 1 | -1 | 0;
  isFavorite?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  notes?: string;
  tags?: string[];
  estimatedCost?: number;
  locationWorn?: string;
  photos?: string[];
}

interface OutfitPreferences {
  occasion?: string;
  stylePreferences?: string[];
  checkWeather?: boolean;
  temperatureRange?: [number, number];
  colors?: string[];
  categories?: string[];
  formality?: number;
  comfort?: number;
  brandPreferences?: string[];
  priceRange?: [number, number];
  excludeCategories?: string[];
  excludeColors?: string[];
  excludeBrands?: string[];
  seasonalOnly?: boolean;
  recentItemsOnly?: boolean;
  unusedItemsOnly?: boolean;
  favoriteItemsOnly?: boolean;
}

// Mock data
const mockOutfits: OutfitSuggestion[] = [
  {
    id: '1',
    name: 'Casual Summer Outfit',
    items: [
      {
        id: 'item1',
        name: 'White T-Shirt',
        type: 'Top',
        color: 'white',
        brand: 'BasicWear',
        category: 'casual',
        size: 'M',
        condition: 'good',
        price: 19.99,
        lastWorn: new Date('2023-05-15'),
        isFavorite: true,
        season: ['spring', 'summer'],
        material: 'cotton',
        careInstructions: 'Machine wash cold, tumble dry low',
        tags: ['basic', 'summer', 'casual']
      },
      {
        id: 'item2',
        name: 'Blue Jeans',
        type: 'Bottom',
        color: 'blue',
        brand: 'DenimCo',
        category: 'casual',
        size: '32x32',
        condition: 'good',
        price: 59.99,
        lastWorn: new Date('2023-05-20'),
        season: ['all'],
        material: 'denim',
        tags: ['denim', 'casual']
      }
    ],
    reason: 'Perfect for a warm summer day',
    confidence: 0.92,
    weatherCheck: {
      condition: 'Sunny',
      temp: 28,
      humidity: 45,
      windSpeed: 10
    },
    occasion: 'casual',
    style: 'summer',
    comfort: 9,
    formality: 3,
    colors: ['white', 'blue'],
    categories: ['casual', 'summer'],
    lastWorn: new Date('2023-05-20'),
    timesWorn: 5,
    userRating: 1,
    isFavorite: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-05-20'),
    notes: 'Great for weekend outings',
    tags: ['summer', 'casual', 'favorite'],
    estimatedCost: 79.98
  }
];

export function SmartOutfitRecommender() {
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<OutfitPreferences>({
    occasion: '',
    stylePreferences: [],
    checkWeather: true,
    temperatureRange: [15, 30],
    colors: [],
    categories: [],
    formality: 5,
    comfort: 5,
    brandPreferences: [],
    priceRange: [0, 500],
    excludeCategories: [],
    excludeColors: [],
    excludeBrands: [],
    seasonalOnly: true,
    recentItemsOnly: false,
    unusedItemsOnly: false,
    favoriteItemsOnly: false
  });
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitSuggestion | null>(null);
  const [showOutfitDetails, setShowOutfitDetails] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeTab, setActiveTab] = useState('outfits');
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ClothingItem>>({
    name: '',
    type: '',
    color: '',
    category: 'casual',
    condition: 'good'
  });

  const { toast } = useToast();
  const router = useRouter();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you would fetch this from your API
        setOutfits(mockOutfits);
        setWardrobeItems(mockOutfits.flatMap(outfit => outfit.items));
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleRateOutfit = useCallback((outfitId: string, rating: 1 | -1 | 0) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === outfitId
          ? { ...outfit, userRating: rating, updatedAt: new Date() }
          : outfit
      )
    );
  }, []);

  const toggleFavoriteOutfit = useCallback((outfitId: string) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === outfitId
          ? { ...outfit, isFavorite: !outfit.isFavorite, updatedAt: new Date() }
          : outfit
      )
    );
  }, []);

  const handleWearOutfit = useCallback((outfit: OutfitSuggestion) => {
    const updatedOutfit = {
      ...outfit,
      lastWorn: new Date(),
      timesWorn: (outfit.timesWorn || 0) + 1,
      updatedAt: new Date()
    };
    
    setOutfits(prev =>
      prev.map(o => (o.id === outfit.id ? updatedOutfit : o))
    );
    
    toast({
      title: 'Outfit Worn',
      description: `Marked "${outfit.name}" as worn today.`
    });
  }, [toast]);

  const handleAddItem = useCallback(() => {
    if (!newItem.name || !newItem.type || !newItem.color) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const item: ClothingItem = {
      id: `item-${Date.now()}`,
      name: newItem.name!,
      type: newItem.type!,
      color: newItem.color!,
      category: newItem.category || 'other',
      condition: newItem.condition || 'good',
      brand: newItem.brand,
      size: newItem.size,
      price: newItem.price,
      notes: newItem.notes,
      tags: newItem.tags,
      material: newItem.material,
      careInstructions: newItem.careInstructions,
      isFavorite: newItem.isFavorite || false,
      lastWorn: newItem.lastWorn,
      purchaseDate: newItem.purchaseDate,
      season: newItem.season || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setWardrobeItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      type: '',
      color: '',
      category: 'casual',
      condition: 'good'
    });
    setShowAddItem(false);
    
    toast({
      title: 'Item Added',
      description: `${item.name} has been added to your wardrobe.`
    });
  }, [newItem, toast]);

  const handleDeleteItem = useCallback((itemId: string) => {
    setWardrobeItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: 'Item Removed',
      description: 'The item has been removed from your wardrobe.'
    });
  }, [toast]);

  const renderOutfitCard = (outfit: OutfitSuggestion) => (
    <Card key={outfit.id} className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{outfit.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavoriteOutfit(outfit.id)}
            className={`h-8 w-8 p-0 ${outfit.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart className={`h-4 w-4 ${outfit.isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <CardDescription className="flex items-center text-sm text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {outfit.lastWorn ? `Last worn: ${outfit.lastWorn.toLocaleDateString()}` : 'Never worn'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {outfit.items.slice(0, 4).map((item, index) => (
            <div
              key={`${outfit.id}-${index}`}
              className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500 text-center p-2">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm">
          <Badge variant="outline" className="capitalize">
            {outfit.occasion || 'Casual'}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span>{(outfit.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex space-x-1">
          <Button
            variant={outfit.userRating === 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRateOutfit(outfit.id, 1)}
          >
            Like
          </Button>
          <Button
            variant={outfit.userRating === -1 ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => handleRateOutfit(outfit.id, -1)}
          >
            Dislike
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedOutfit(outfit);
              setShowOutfitDetails(true);
            }}
          >
            Details
          </Button>
          <Button
            size="sm"
            onClick={() => handleWearOutfit(outfit)}
          >
            Wear
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  const renderWardrobeItem = (item: ClothingItem) => (
    <div key={item.id} className="border rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{item.name}</h4>
          <p className="text-sm text-gray-500">
            {item.type} • {item.color} • {item.brand}
          </p>
          {item.price && (
            <p className="text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Implement edit functionality
            }}
          >
            <svg
              xmlns="[http://www.w3.org/2000/svg"](http://www.w3.org/2000/svg")
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteItem(item.id)}
            className="text-red-500 hover:text-red-600"
          >
            <svg
              xmlns="[http://www.w3.org/2000/svg"](http://www.w3.org/2000/svg")
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAddItemForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>Fill in the details of your clothing item</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              placeholder="e.g. Blue Jeans"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-type">Type</Label>
              <Select
                value={newItem.type}
                onValueChange={(value) => setNewItem({ ...newItem, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="dress">Dress</SelectItem>
                  <SelectItem value="outerwear">Outerwear</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-color">Color</Label>
              <Input
                id="item-color"
                placeholder="e.g. Blue"
                value={newItem.color}
                onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-brand">Brand (optional)</Label>
            <Input
              id="item-brand"
              placeholder="e.g. Levi's"
              value={newItem.brand || ''}
              onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-category">Category</Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="sportswear">Sportswear</SelectItem>
                  <SelectItem value="sleepwear">Sleepwear</SelectItem>
                  <SelectItem value="swimwear">Swimwear</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-condition">Condition</Label>
              <Select
                value={newItem.condition}
                onValueChange={(value) => setNewItem({ ...newItem, condition: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="item-favorite"
              checked={newItem.isFavorite || false}
              onCheckedChange={(checked) => setNewItem({ ...newItem, isFavorite: checked })}
            />
            <Label htmlFor="item-favorite">Add to favorites</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAddItem(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddItem}>
            Add Item
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderOutfitDetails = () => {
    if (!selectedOutfit) return null;

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOutfitDetails(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">Outfit Details</h2>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">{selectedOutfit.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last worn: {selectedOutfit.lastWorn ? selectedOutfit.lastWorn.toLocaleDateString() : 'Never'}</span>
              <span className="mx-2">•</span>
              <span>Worn {selectedOutfit.timesWorn || 0} times</span>
            </div>
            
            {selectedOutfit.weatherCheck && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm text-blue-800 mb-1">Weather Appropriate</h4>
                <p className="text-sm text-blue-700">
                  {selectedOutfit.weatherCheck.condition}, {selected